/**
 * Contract Write Routes
 * 
 * Write endpoints for contract lifecycle.
 * State is NEVER stored - derived from ledger events.
 * 
 * NON-NEGOTIABLE INVARIANTS (ENFORCED GLOBALLY):
 * - principalUserId MUST come only from auth middleware (NEVER from request body)
 * - Any userId/principalUserId/ownerId/actorId field in body is REJECTED with 400
 * - These are enforced by registerWriteRouteGuards() - individual routes cannot bypass
 * 
 * All write operations:
 * 1. Load ordered ledger events (timestampUtc, id)
 * 2. Derive current state
 * 3. Validate from-state allows the action
 * 4. Append ledger event(s)
 */

import { FastifyPluginAsync } from 'fastify';
import { createFundingIntent } from '../services/funding.js';
import { createContract, getContract, updateContractBaseline } from '../services/contracts.js';
import { appendEvent, getEventsForContract } from '../services/ledger.js';
import { deriveState, validateFromState, InvalidTransitionError } from '../services/state-derivation.js';
import { ContractStatus, EventType, connectedAccounts } from '../db/schema.js';
import { getPrincipal, AuthError } from '../services/auth.js';
import { registerWriteRouteGuards } from '../invariants/auth-guards.js';
import { getBindingSnapshotForContract } from '../services/identity-bindings.js';
import { db } from '../db/client.js';
import { identities } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { createHash } from 'crypto';
import {
    getXClient,
    XAdapterError,
} from '../adapters/x.js';
import {
    checkXEligibility,
    calculateDeltaFloor,
    validateDeltaFloor,
    type FrozenXBinding,
} from '../adapters/x-eligibility.js';
import {
    stripeRevenueAdapter,
    validateTierEligibility,
    STRIPE_ERROR_CODES,
    STRIPE_TIER_PERCENTAGES,
    type StripeV1BaselineJson,
} from '../adapters/stripe-revenue.js';
import {
    requireVerifiedConnection,
    PlatformNotVerifiedError,
} from '../services/require-verified-connection.js';

// =====================================================
// WRITE ENDPOINT EVENT TYPES (explicit canonical list)
// =====================================================
// POST /contracts              → CONTRACT_CREATED, BASELINE_SNAPSHOTTED
// POST /:id/funding-intent     → FUNDS_AUTHORIZED
// POST /v1/stripe/webhook      → FUNDS_LOCKED (via handlePaymentSuccess)
// POST /:id/execute            → EXECUTION_REQUESTED, EXECUTION_CONFIRMED

const contractWriteRoutes: FastifyPluginAsync = async (fastify) => {
    // =======================================================================
    // GLOBAL INVARIANT ENFORCEMENT (unbypassable)
    // =======================================================================
    // This ensures ALL routes in this plugin enforce:
    // - requireAuth (401 if missing token)
    // - assertNoUserIdFieldsDeep (400 if userId/etc in body)
    registerWriteRouteGuards(fastify);
    /**
     * POST /contracts
     * Create a new contract
     * 
     * REQUIRES AUTH: principalUserId from middleware
     * REJECTS: userId in body (spoof protection)
     * 
     * From-state: NULL (no contract exists)
     * Appends: CONTRACT_CREATED, BASELINE_SNAPSHOTTED (if baseline provided)
     * To-state: CREATED
     */
    fastify.post<{
        Body: {
            username?: string;  // Optional, will look up from identity
            platform: 'X' | 'STRIPE' | 'GITHUB' | 'YOUTUBE' | 'TIKTOK' | 'SHOPIFY';
            metricType: 'IMPRESSIONS' | 'FOLLOWERS' | 'REVENUE' | 'VIEWS' | 'SUBSCRIBERS' | 'COMMITS' | 'PRS_MERGED' | 'STARS_GAINED';
            condition: {
                operator: 'GTE' | 'GT' | 'LTE' | 'LT' | 'EQ';
                threshold: number;
                deadline: string;
            };
            baseline?: Record<string, unknown>;
            lockAmountUsdCents: number;
            payoutAmountUsdCents: number;
            fundingMethod?: 'USD_CARD' | 'USD_ACH' | 'CRYPTO';
            riskTier?: 'STANDARD' | 'ADVANCED' | 'ELITE';
        };
    }>('/v1/contracts', async (request, reply) => {
        console.log('[contracts-write] POST /v1/contracts - START');
        try {
            // Auth is enforced by global registerWriteRouteGuards() hook
            // userId fields in body are rejected by global assertNoUserIdFieldsDeep()
            const principalUserId = getPrincipal(request);
            console.log('[contracts-write] principalUserId:', principalUserId);

            const {
                username: bodyUsername,
                platform,
                metricType,
                condition,
                baseline,
                lockAmountUsdCents,
                payoutAmountUsdCents,
                fundingMethod,
                riskTier
            } = request.body;
            console.log('[contracts-write] Body parsed, platform:', platform, 'metricType:', metricType);

            // =========================================================
            // ENFORCE VERIFIED CONNECTION - Fail-closed if not verified
            // Store result for username resolution
            // =========================================================
            let verifiedConnection: Awaited<ReturnType<typeof requireVerifiedConnection>> | null = null;

            if (platform === 'X' || platform === 'STRIPE') {
                try {
                    verifiedConnection = await requireVerifiedConnection(principalUserId, platform);
                    console.log(`[contracts-write] Verified ${platform} connection:`, verifiedConnection.externalAccountId);
                } catch (err) {
                    if (err instanceof PlatformNotVerifiedError) {
                        reply.status(err.status);
                        return {
                            code: err.code,
                            error: err.message,
                            platform: err.platform,
                        };
                    }
                    throw err;
                }
            }

            // Get username: body > identity > verified X metadata
            let username = bodyUsername;
            if (!username) {
                const [identity] = await db
                    .select()
                    .from(identities)
                    .where(eq(identities.userId, principalUserId))
                    .limit(1);

                if (identity) {
                    username = identity.username;
                } else if (platform === 'X' && verifiedConnection) {
                    // Use typed metadata from verified connection (no extra DB query)
                    username = (verifiedConnection.metadata as { resolvedUsername?: string }).resolvedUsername;
                }
            }

            if (!username) {
                reply.status(400);
                return { error: 'No identity found. Please connect your X account first.' };
            }

            // Input validation
            if (!platform || !metricType || !condition || !lockAmountUsdCents) {
                reply.status(400);
                return { error: 'Missing required fields' };
            }

            // =========================================================
            // BASELINE REJECTION - X/STRIPE baseline frozen at execution, not creation
            // =========================================================
            if ((platform === 'X' || platform === 'STRIPE') && baseline) {
                reply.status(400);
                return {
                    code: 'BASELINE_NOT_ALLOWED_AT_CREATION',
                    error: `Baseline cannot be set at creation for ${platform}. Baseline is automatically frozen at execution.`,
                };
            }

            // PRECOMMITTED PAYOUT VALIDATION
            if (payoutAmountUsdCents === undefined || payoutAmountUsdCents === null) {
                reply.status(400);
                return { error: 'payoutAmountUsdCents is required' };
            }

            if (!Number.isInteger(payoutAmountUsdCents)) {
                reply.status(400);
                return { error: 'payoutAmountUsdCents must be an integer' };
            }

            if (payoutAmountUsdCents <= 0) {
                reply.status(400);
                return { error: 'payoutAmountUsdCents must be greater than 0' };
            }

            // Payout must be at least equal to lock amount
            if (payoutAmountUsdCents < lockAmountUsdCents) {
                reply.status(400);
                return { error: 'payoutAmountUsdCents must be >= lockAmountUsdCents' };
            }

            if (lockAmountUsdCents < 100) {
                reply.status(400);
                return { error: 'Minimum lock amount is $1.00 (100 cents)' };
            }

            const deadline = new Date(condition.deadline);
            if (deadline <= new Date()) {
                reply.status(400);
                return { error: 'Deadline must be in the future' };
            }

            // NOTE: X/STRIPE connection verification handled by requireVerifiedConnection() above
            // Get binding snapshot for contract creation (immutable reference)
            let bindingId: string | null = null;
            let binding: any = null;
            try {
                const result = await getBindingSnapshotForContract(principalUserId, platform);
                bindingId = result.bindingId;
                binding = result.binding;
            } catch (err) {
                console.error('[contracts-write] getBindingSnapshotForContract failed:', err);
                // Continue without binding - it's optional for some platforms
            }

            try {
                // createContract internally:
                // 1. Inserts contract record
                // 2. Appends CONTRACT_CREATED event (with precommitted terms)
                // 3. Appends BASELINE_SNAPSHOTTED if baseline provided
                const contract = await createContract({
                    principalUserId,
                    principalIdentityUsername: username,
                    platform,
                    metricType,
                    condition,
                    baseline,
                    lockAmountUsdCents,
                    payoutAmountUsdCents,
                    fundingMethod,
                    riskTier,
                });

                // Derive state from events (should be CREATED)
                const events = await getEventsForContract(contract.id);
                const state = deriveState(events);

                return {
                    ok: true,
                    contractId: contract.id,
                    eventType: 'CONTRACT_CREATED',
                    derivedState: state,
                    message: 'Contract created successfully',
                    contract: {
                        id: contract.id,
                        platform: contract.platform,
                        metricType: contract.metricType,
                        condition: contract.conditionJson,
                        baseline: contract.baselineJson,
                        deadline: contract.deadlineUtc.toISOString(),
                        lockAmountUsdCents: contract.lockAmountUsdCents,
                        recordHash: contract.recordHash,
                        createdAt: contract.createdAt.toISOString(),
                        bindingId: bindingId || null,
                    },
                };
            } catch (err: any) {
                console.error('[contracts-write] createContract error:', err);
                if (err instanceof AuthError) {
                    reply.status(401);
                    return { ok: false, code: err.code || 'AUTH_ERROR', error: err.message };
                }
                reply.status(500);
                return { ok: false, code: 'INTERNAL_ERROR', error: err.message };
            }
        } catch (outerErr: any) {
            console.error('[contracts-write] OUTER ERROR:', outerErr);
            reply.status(500);
            return { ok: false, code: 'OUTER_ERROR', error: outerErr.message };
        }
    });

    /**
     * POST /contracts/:id/funding-intent
     * Create Stripe PaymentIntent for funding
     * 
     * REQUIRES AUTH: principalUserId from middleware
     * 
     * From-state: CREATED
     * Appends: FUNDS_AUTHORIZED (via funding service)
     * To-state: FUNDS_AUTHORIZED
     */
    fastify.post<{
        Params: { id: string };
        Body: { userId?: never }; // userId NEVER accepted from body
    }>('/v1/contracts/:id/funding-intent', async (request, reply) => {
        const { id } = request.params;
        const principalUserId = getPrincipal(request);

        console.log('[funding-intent] Contract:', id);
        console.log('[funding-intent] principalUserId:', principalUserId);

        // Reject userId in body (spoof protection)
        if ((request.body as any)?.userId !== undefined) {
            console.log('[funding-intent] Rejected: userId in body');
            reply.status(400);
            return {
                error: 'userId in body is not allowed. User identity is derived from authentication.',
                code: 'USER_ID_NOT_ALLOWED'
            };
        }

        if (!principalUserId) {
            console.log('[funding-intent] Rejected: No auth');
            reply.status(401);
            return { ok: false, code: 'UNAUTHORIZED', error: 'Authentication required' };
        }

        try {
            // createFundingIntent internally:
            // 1. Loads events and derives state
            // 2. Validates from-state is CREATED
            // 3. Appends FUNDS_AUTHORIZED event
            console.log('[funding-intent] Calling createFundingIntent...');
            const result = await createFundingIntent(id, principalUserId);
            console.log('[funding-intent] Success! PaymentIntent:', result.paymentIntentId);

            return {
                ok: true,
                contractId: id,
                eventType: 'FUNDS_AUTHORIZED',
                derivedState: ContractStatus.FUNDS_AUTHORIZED,
                message: 'Funding intent created',
                clientSecret: result.clientSecret,
                paymentIntentId: result.paymentIntentId,
                amountUsdCents: result.amountUsdCents,
            };
        } catch (err: any) {
            if (err instanceof InvalidTransitionError) {
                reply.status(400);
                return { ok: false, code: 'INVALID_STATE', error: err.message };
            }
            if (err.message.includes('Not authorized')) {
                reply.status(403);
                return { ok: false, code: 'FORBIDDEN', error: err.message };
            } else if (err.message.includes('not found')) {
                reply.status(404);
                return { ok: false, code: 'NOT_FOUND', error: err.message };
            } else {
                reply.status(500);
                return { ok: false, code: 'INTERNAL_ERROR', error: err.message };
            }
        }
    });

    // NOTE: FUNDS_AUTHORIZED → FUNDS_LOCKED transition happens via:
    //   - PRODUCTION: Stripe webhook (POST /v1/stripe/webhook → payment_intent.succeeded)
    //   - DEVELOPMENT: Can simulate via direct webhook call or test helper
    // See: src/routes/webhooks.ts → handlePaymentSuccess

    /**
     * POST /contracts/:id/execute
     * Execute the contract - IRREVERSIBLE
     * 
     * From-state: FUNDS_LOCKED
     * Appends: EXECUTION_REQUESTED, EXECUTION_CONFIRMED
     * To-state: LOCKED
     * 
     * Idempotent: returns success if already LOCKED
     */
    fastify.post<{
        Params: { id: string };
        Body: { userId?: never }; // userId NEVER accepted from body
    }>('/v1/contracts/:id/execute', async (request, reply) => {
        const { id } = request.params;
        const principalUserId = getPrincipal(request);

        // Reject userId in body (spoof protection)
        if ((request.body as any)?.userId !== undefined) {
            reply.status(400);
            return {
                error: 'userId in body is not allowed. User identity is derived from authentication.',
                code: 'USER_ID_NOT_ALLOWED'
            };
        }

        // 1. Get contract
        const contract = await getContract(id);
        if (!contract) {
            reply.status(404);
            return { error: 'Contract not found' };
        }

        if (contract.principalUserId !== principalUserId) {
            reply.status(403);
            return { error: 'Not authorized to execute this contract' };
        }

        // =========================================================
        // ENFORCE VERIFIED CONNECTION - Fail-closed if revoked
        // =========================================================
        const contractPlatform = contract.platform;
        if (contractPlatform === 'X' || contractPlatform === 'STRIPE') {
            try {
                await requireVerifiedConnection(principalUserId, contractPlatform);
                console.log(`[Execute] Verified ${contractPlatform} connection for contract ${id}`);
            } catch (err) {
                if (err instanceof PlatformNotVerifiedError) {
                    reply.status(err.status);
                    return {
                        ok: false,
                        code: err.code,
                        error: `Cannot execute: ${err.message}`,
                        platform: err.platform,
                    };
                }
                throw err;
            }
        }

        // 2. Load events and derive current state
        const events = await getEventsForContract(id);
        const currentState = deriveState(events);
        console.log('[Execute] Contract:', id, 'CurrentState:', currentState, 'EventCount:', events.length);

        // 3. Idempotent: already executed
        if (currentState === ContractStatus.LOCKED) {
            return {
                ok: true,
                contractId: contract.id,
                eventType: 'EXECUTION_CONFIRMED',
                derivedState: currentState,
                message: 'Contract already executed',
            };
        }

        // 4. Validate from-state (must be FUNDS_LOCKED)
        try {
            validateFromState(currentState, [ContractStatus.FUNDS_LOCKED], 'execute');
        } catch (err) {
            if (err instanceof InvalidTransitionError) {
                reply.status(409);
                return {
                    ok: false,
                    code: 'FUNDS_NOT_LOCKED',
                    error: `Cannot execute contract in state: ${currentState}. Must be FUNDS_LOCKED.`,
                };
            }
            throw err;
        }

        try {
            // 5. Append EXECUTION_REQUESTED
            await appendEvent({
                contractId: id,
                actor: 'USER',
                eventType: EventType.EXECUTION_REQUESTED,
                metadata: { requestedAt: new Date().toISOString() },
            });

            // 6. FREEZE IDENTITY & BASELINE (Platform-specific)
            let frozenBinding: FrozenXBinding | null = null;
            let termsHash: string | null = null;

            if (contract.platform === 'X') {
                // 6a. Get VERIFIED X connected account
                const [xAccount] = await db
                    .select()
                    .from(connectedAccounts)
                    .where(
                        and(
                            eq(connectedAccounts.userId, principalUserId),
                            eq(connectedAccounts.platform, 'X'),
                            eq(connectedAccounts.status, 'ACTIVE'),
                            eq(connectedAccounts.verificationStatus, 'VERIFIED')
                        )
                    )
                    .limit(1);

                if (!xAccount) {
                    reply.status(400);
                    return {
                        ok: false,
                        code: 'X_NOT_VERIFIED',
                        error: 'No verified X account. Connect and verify your X account first.',
                    };
                }

                const xUserId = xAccount.externalAccountId;
                const xUsername = (xAccount.metadataJson as any)?.resolvedUsername || xAccount.externalAccountId;

                // 6b. Fetch account health
                const client = getXClient();
                const accountHealth = await client.getUserWithHealth(xUserId);
                console.log('[Execute] accountHealth:', JSON.stringify(accountHealth, null, 2));

                // 6c. RE-CHECK ELIGIBILITY (fail closed)
                const eligibility = checkXEligibility(accountHealth);
                console.log('[Execute] eligibility:', eligibility);
                if (!eligibility.eligible) {
                    console.log('[Execute] FAILED: eligibility check');
                    reply.status(400);
                    return {
                        ok: false,
                        code: eligibility.reasonCode,
                        error: `X account not eligible for contracts: ${eligibility.reasonCode}`,
                        details: eligibility.details,
                    };
                }

                // 6d. Calculate frozen baseline and delta floor
                const frozenBaselineFollowers = accountHealth.publicMetrics.followersCount;
                const deltaFloor = calculateDeltaFloor(frozenBaselineFollowers);

                // 6e. Validate threshold meets delta floor
                const condition = contract.conditionJson as { threshold: number; operator: string };
                console.log('[Execute] condition:', condition, 'baseline:', frozenBaselineFollowers);
                const deltaValidation = validateDeltaFloor(frozenBaselineFollowers, condition.threshold);
                console.log('[Execute] deltaValidation:', deltaValidation);

                // Skip delta validation in local dev if env var set
                const skipDeltaFloor = process.env.SKIP_DELTA_FLOOR === 'true';
                if (!deltaValidation.valid && !skipDeltaFloor) {
                    console.log('[Execute] FAILED: delta floor validation');
                    reply.status(400);
                    return {
                        ok: false,
                        code: 'DELTA_FLOOR_NOT_MET',
                        error: `Target threshold does not meet minimum delta floor. ` +
                            `Baseline: ${frozenBaselineFollowers}, Target: ${condition.threshold}, ` +
                            `Required delta: ${deltaValidation.requiredDelta}, Actual: ${deltaValidation.actualDelta}`,
                    };
                }
                if (skipDeltaFloor && !deltaValidation.valid) {
                    console.log('[Execute] ⚠️ Delta floor validation SKIPPED (SKIP_DELTA_FLOOR=true)');
                }

                // 6f. Create frozen binding
                const measuredAtUtc = new Date().toISOString();
                frozenBinding = {
                    xUserId,
                    username: xUsername,
                    baselineFollowers: frozenBaselineFollowers,
                    deltaFloor,
                    accountHealth,
                    frozenAtUtc: measuredAtUtc,
                };

                // 6g. Persist frozen baseline into contract
                const baselineToStore = {
                    platform: 'X',
                    xUserId,
                    username: xUsername,
                    followers: frozenBaselineFollowers,
                    deltaFloor,
                    accountHealth,
                    measuredAtUtc,
                    frozenAtUtc: measuredAtUtc,
                };

                await updateContractBaseline(id, baselineToStore);

                termsHash = createHash('sha256')
                    .update(JSON.stringify({
                        xUserId,
                        baselineFollowers: frozenBaselineFollowers,
                        deltaFloor,
                        threshold: condition.threshold,
                        operator: condition.operator,
                        frozenAtUtc: measuredAtUtc,
                    }))
                    .digest('hex');
            }

            // STRIPE PLATFORM EXECUTE LOGIC
            if (contract.platform === 'STRIPE') {
                // 6a. Get VERIFIED Stripe connected account
                const [stripeAccount] = await db
                    .select()
                    .from(connectedAccounts)
                    .where(
                        and(
                            eq(connectedAccounts.userId, principalUserId),
                            eq(connectedAccounts.platform, 'STRIPE'),
                            eq(connectedAccounts.status, 'ACTIVE'),
                            eq(connectedAccounts.verificationStatus, 'VERIFIED')
                        )
                    )
                    .limit(1);

                if (!stripeAccount) {
                    reply.status(400);
                    return {
                        ok: false,
                        code: 'STRIPE_NOT_VERIFIED',
                        error: 'No verified Stripe account. Connect via Stripe Connect first.',
                    };
                }

                const stripeConnectedAccountId = stripeAccount.externalAccountId;
                const condition = contract.conditionJson as { threshold: number; operator: string };
                const executionTime = new Date();

                // 6b. Determine tier based on condition/riskTier (default STEADY)
                let tier: 'STEADY' | 'BROAD' | 'ALL_IN' = 'STEADY';
                const riskTier = (contract as any).riskTier;
                if (riskTier === 'ADVANCED') tier = 'BROAD';
                else if (riskTier === 'ELITE') tier = 'ALL_IN';

                try {
                    // 6c. Create V1 baseline snapshot (validates tier eligibility + delta floor)
                    const v1Baseline = await stripeRevenueAdapter.createV1BaselineSnapshot(
                        stripeConnectedAccountId,
                        condition.threshold, // Use threshold as delta target
                        executionTime,
                        tier
                    );

                    // 6d. Persist frozen baseline into contract
                    await updateContractBaseline(id, v1Baseline);

                    // 6e. Compute termsHash
                    termsHash = createHash('sha256')
                        .update(JSON.stringify({
                            stripeConnectedAccountId: v1Baseline.stripeConnectedAccountId,
                            baselineNetRevenueCents: v1Baseline.baselineNetRevenueCents,
                            deltaTargetCents: v1Baseline.deltaTargetCents,
                            tier: v1Baseline.tier,
                            tierPercentage: v1Baseline.tierPercentage,
                            verificationWindow: v1Baseline.verificationWindow,
                            frozenAtUtc: v1Baseline.frozenAtUtc,
                            noAppeals: true,
                            deterministicSettlement: true,
                        }))
                        .digest('hex');

                } catch (err: any) {
                    // Handle tier eligibility or delta floor errors
                    const errorMessage = err.message || 'Unknown error';
                    if (errorMessage.includes(STRIPE_ERROR_CODES.INELIGIBLE_BASELINE_TOO_LOW)) {
                        reply.status(400);
                        return {
                            ok: false,
                            code: STRIPE_ERROR_CODES.INELIGIBLE_BASELINE_TOO_LOW,
                            error: errorMessage,
                        };
                    }
                    if (errorMessage.includes(STRIPE_ERROR_CODES.DELTA_FLOOR_NOT_MET)) {
                        reply.status(400);
                        return {
                            ok: false,
                            code: STRIPE_ERROR_CODES.DELTA_FLOOR_NOT_MET,
                            error: errorMessage,
                        };
                    }
                    throw err;
                }
            }

            // 7. Append EXECUTION_CONFIRMED - transitions to LOCKED
            await appendEvent({
                contractId: id,
                actor: 'SYSTEM',
                eventType: EventType.EXECUTION_CONFIRMED,
                metadata: {
                    confirmedAt: new Date().toISOString(),
                    binding: true,
                    noAppeals: true,
                    ...(termsHash && { termsHash }),
                },
            });

            // 8. Get derived state after execution
            const updatedEvents = await getEventsForContract(id);
            const newState = deriveState(updatedEvents);

            return {
                ok: true,
                contractId: contract.id,
                eventType: 'EXECUTION_CONFIRMED',
                derivedState: newState,
                message: 'Contract executed. This is binding and irreversible.',
                deadline: contract.deadlineUtc.toISOString(),
                lockAmountUsdCents: contract.lockAmountUsdCents,
                ...(termsHash && { termsHash }),
                warnings: [
                    'No appeals will be accepted.',
                    'Capital will be forfeited on failure.',
                    'Verification is automatic and final.',
                ],
            };
        } catch (err: any) {
            if (err instanceof InvalidTransitionError) {
                reply.status(400);
                return { ok: false, code: 'INVALID_STATE', error: err.message };
            }
            reply.status(500);
            return { ok: false, code: 'INTERNAL_ERROR', error: err.message };
        }
    });

    // =======================================================================
    // DEV-ONLY: SIMULATE SUCCESS ENDPOINT
    // =======================================================================
    // Allows testing receipt page without Stripe funds locking
    // HARD-FAILS in production - no exceptions
    // =======================================================================
    fastify.post<{
        Params: { id: string };
    }>('/v1/contracts/:id/dev/simulate-success', async (request, reply) => {
        // ==========================================
        // PRODUCTION GUARD - HARD FAIL
        // ==========================================
        if (process.env.NODE_ENV === 'production') {
            console.error('[DEV SIMULATE] BLOCKED - Production environment detected!');
            reply.status(403);
            return {
                ok: false,
                code: 'PRODUCTION_BLOCKED',
                error: 'DEV endpoints are disabled in production'
            };
        }

        const contractId = request.params.id;
        const userId = request.userId!;

        console.warn('[DEV] Simulating contract success', { contractId, userId });

        try {
            // Get contract
            const contract = await getContract(contractId);
            if (!contract) {
                reply.status(404);
                return { ok: false, code: 'NOT_FOUND', error: 'Contract not found' };
            }

            // Verify ownership - contracts use principalUserId field
            // DEBUG: Log both userId values to diagnose mismatch
            console.log('[DEV] Ownership check:', {
                contractUserId: contract.principalUserId,
                authUserId: userId,
                match: contract.principalUserId === userId,
            });

            if (contract.principalUserId !== userId) {
                reply.status(403);
                return { ok: false, code: 'FORBIDDEN', error: 'Not your contract' };
            }

            // Get current events
            const events = await getEventsForContract(contractId);
            const currentState = deriveState(events);

            // Idempotent: if already in terminal success state, return success
            if (['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED'].includes(currentState)) {
                console.log('[DEV] Contract already in success state:', currentState);
                return {
                    ok: true,
                    code: 'ALREADY_SUCCESS',
                    state: currentState,
                    message: 'Contract is already in terminal success state'
                };
            }

            // Append missing events to reach LOCKED state
            const now = new Date().toISOString();

            // If no FUNDS_AUTHORIZED, add it
            const hasFundsAuthorized = events.some(e => e.eventType === 'FUNDS_AUTHORIZED');
            if (!hasFundsAuthorized) {
                await appendEvent({
                    contractId,
                    eventType: 'FUNDS_AUTHORIZED' as any,
                    payload: {
                        dev: true,
                        simulatedAt: now,
                        amountUsdCents: contract.lockAmountUsdCents,
                        paymentIntentId: 'pi_dev_simulated_' + contractId.slice(0, 8),
                    },
                });
                console.log('[DEV] Appended FUNDS_AUTHORIZED');
            }

            // If no FUNDS_LOCKED, add it
            const hasFundsLocked = events.some(e => e.eventType === 'FUNDS_LOCKED');
            if (!hasFundsLocked) {
                await appendEvent({
                    contractId,
                    eventType: 'FUNDS_LOCKED' as any,
                    payload: {
                        dev: true,
                        simulatedAt: now,
                        amountUsdCents: contract.lockAmountUsdCents,
                        chargeId: 'ch_dev_simulated_' + contractId.slice(0, 8),
                    },
                });
                console.log('[DEV] Appended FUNDS_LOCKED');
            }

            // If no EXECUTION_REQUESTED, add it
            const hasExecutionRequested = events.some(e => e.eventType === 'EXECUTION_REQUESTED');
            if (!hasExecutionRequested) {
                await appendEvent({
                    contractId,
                    eventType: 'EXECUTION_REQUESTED' as any,
                    payload: {
                        dev: true,
                        simulatedAt: now,
                    },
                });
                console.log('[DEV] Appended EXECUTION_REQUESTED');
            }

            // If no EXECUTION_CONFIRMED, add it
            const hasExecutionConfirmed = events.some(e => e.eventType === 'EXECUTION_CONFIRMED');
            if (!hasExecutionConfirmed) {
                await appendEvent({
                    contractId,
                    eventType: 'EXECUTION_CONFIRMED' as any,
                    payload: {
                        dev: true,
                        simulatedAt: now,
                        deadline: contract.deadlineUtc?.toISOString() || now,
                        lockAmountUsdCents: contract.lockAmountUsdCents,
                        message: '[DEV] Simulated execution confirmation',
                    },
                });
                console.log('[DEV] Appended EXECUTION_CONFIRMED');
            }

            // Get final state
            const updatedEvents = await getEventsForContract(contractId);
            const finalState = deriveState(updatedEvents);

            console.warn('[DEV] Simulated contract success', { contractId, finalState });

            return {
                ok: true,
                code: 'DEV_SIMULATED',
                state: finalState,
                message: 'Contract simulated to success state (DEV ONLY)',
                eventsAdded: updatedEvents.length - events.length,
            };

        } catch (err: any) {
            console.error('[DEV] Simulate error:', err);
            reply.status(500);
            return { ok: false, code: 'INTERNAL_ERROR', error: err.message };
        }
    });
};

export default contractWriteRoutes;


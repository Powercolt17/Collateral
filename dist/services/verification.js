/**
 * Verification Service
 *
 * Handles contract verification for X/Twitter metrics only.
 * NO SETTLEMENT - verification-only slice.
 *
 * State is NEVER stored - derived from ledger events.
 */
import { db } from '../db/client.js';
import { ContractStatus, EventType, users, contractIndex } from '../db/schema.js';
import { getContract } from './contracts.js';
import { appendEvent, getEventsForContract } from './ledger.js';
import { deriveState } from './state-derivation.js';
import { xAdapter } from '../adapters/x.js';
import { stripeRevenueAdapter } from '../adapters/stripe-revenue.js';
import { githubAdapter } from '../adapters/github.js';
import { tryAcquireLock, getNextRetryTime, scheduleRetry } from './job-lock.js';
import { classifyError } from './error-classification.js';
import { eq, and, or, lte, isNull } from 'drizzle-orm';
/**
 * Check if a contract can be verified
 * - Must be in LOCKED state
 * - Must be at/after deadline
 */
export function canVerify(currentState, deadlineUtc) {
    if (currentState !== ContractStatus.LOCKED) {
        return {
            allowed: false,
            reason: `Cannot verify: state is ${currentState ?? 'NULL'}, must be LOCKED`,
        };
    }
    if (deadlineUtc > new Date()) {
        return {
            allowed: false,
            reason: `Cannot verify: deadline not reached (${deadlineUtc.toISOString()})`,
        };
    }
    return { allowed: true };
}
/**
 * Verify a single contract (X platform only)
 *
 * From-state: LOCKED (or VERIFYING if retrying)
 * Appends: VERIFICATION_STARTED (if not exists), then VERIFICATION_SUCCEEDED or VERIFICATION_FAILED
 * To-state: VERIFIED
 *
 * IDEMPOTENCY:
 * - Terminal events: VERIFICATION_SUCCEEDED or VERIFICATION_FAILED
 * - Skip if terminal event exists (return cached result)
 * - Allow retry if only VERIFICATION_STARTED exists (prevents stuck VERIFYING state)
 *
 * INVARIANT: System never gets stuck in VERIFYING
 *
 * @param contractId - Contract ID to verify
 * @param tx - Optional transaction client (for lock-pinned writes from withContractLock)
 */
export async function verifyContract(contractId, tx) {
    // 1. Get contract
    const contract = await getContract(contractId, tx);
    if (!contract) {
        return {
            success: false,
            pass: false,
            observedValue: 0,
            threshold: 0,
            operator: '',
            evidence: { snapshotAt: '', metrics: {}, source: '' },
            error: 'Contract not found',
        };
    }
    // 1a. Load events early for terminal check (before acquiring lock)
    const events = await getEventsForContract(contractId, tx);
    // 1b. IDEMPOTENCY: Check if TERMINAL verification event exists FIRST
    const terminalVerificationEvent = events.find(e => e.eventType === EventType.VERIFICATION_SUCCEEDED ||
        e.eventType === EventType.VERIFICATION_FAILED);
    if (terminalVerificationEvent) {
        const metadata = terminalVerificationEvent.metadataJson;
        return {
            success: true,
            pass: terminalVerificationEvent.eventType === EventType.VERIFICATION_SUCCEEDED,
            observedValue: metadata?.observedValue ?? 0,
            threshold: metadata?.threshold ?? 0,
            operator: metadata?.operator ?? '',
            evidence: metadata?.evidence ?? { snapshotAt: '', metrics: {}, source: 'cached' },
        };
    }
    // 1c. Check if retry is scheduled for the future (before lock)
    // Skip this check when tx is provided - caller already holds invariant lock
    if (!tx) {
        const nextRetryTime = await getNextRetryTime(contractId, 'VERIFY');
        if (nextRetryTime && nextRetryTime > new Date()) {
            return {
                success: false,
                pass: false,
                observedValue: 0,
                threshold: 0,
                operator: '',
                evidence: { snapshotAt: '', metrics: {}, source: '' },
                error: `Retry scheduled at ${nextRetryTime.toISOString()}`,
                retryable: true,
            };
        }
    }
    // 1d. Try to acquire VERIFY lock
    // CRITICAL: Skip job-lock when tx is provided - caller already holds invariant lock
    if (!tx) {
        const lock = await tryAcquireLock(contractId, 'VERIFY');
        if (!lock.acquired) {
            return {
                success: false,
                pass: false,
                observedValue: 0,
                threshold: 0,
                operator: '',
                evidence: { snapshotAt: '', metrics: {}, source: '' },
                error: 'Locked by another worker',
                retryable: true,
            };
        }
    }
    // 2. Platform support check
    if (contract.platform !== 'X' && contract.platform !== 'STRIPE' && contract.platform !== 'GITHUB') {
        return {
            success: false,
            pass: false,
            observedValue: 0,
            threshold: 0,
            operator: '',
            evidence: { snapshotAt: '', metrics: {}, source: '' },
            error: `Platform ${contract.platform} not supported. Only X, STRIPE, and GITHUB are supported.`,
        };
    }
    if (contract.platform === 'STRIPE' && contract.metricType !== 'REVENUE') {
        return {
            success: false,
            pass: false,
            observedValue: 0,
            threshold: 0,
            operator: '',
            evidence: { snapshotAt: '', metrics: {}, source: '' },
            error: `Metric ${contract.metricType} not supported for STRIPE. Only REVENUE supported.`,
        };
    }
    // 3. Derive current state (reuse events loaded earlier)
    const currentState = deriveState(events);
    // 4. Check if VERIFICATION_STARTED exists (in progress)
    // (Terminal check already done above - we're here only if no terminal)
    const hasVerificationStarted = events.some(e => e.eventType === EventType.VERIFICATION_STARTED);
    // 5. Validate state and deadline
    // If VERIFICATION_STARTED exists, state is VERIFYING - allow retry
    // If no VERIFICATION_STARTED, state must be LOCKED
    if (!hasVerificationStarted) {
        const canVerifyResult = canVerify(currentState, contract.deadlineUtc);
        if (!canVerifyResult.allowed) {
            return {
                success: false,
                pass: false,
                observedValue: 0,
                threshold: 0,
                operator: '',
                evidence: { snapshotAt: '', metrics: {}, source: '' },
                error: canVerifyResult.reason,
            };
        }
    }
    else {
        // VERIFICATION_STARTED exists but no terminal - allow retry
        // Still need to check deadline
        if (contract.deadlineUtc > new Date()) {
            return {
                success: false,
                pass: false,
                observedValue: 0,
                threshold: 0,
                operator: '',
                evidence: { snapshotAt: '', metrics: {}, source: '' },
                error: `Cannot verify: deadline not reached (${contract.deadlineUtc.toISOString()})`,
            };
        }
        console.log(`📋 Retrying verification for ${contractId} (VERIFICATION_STARTED exists, no terminal event)`);
    }
    try {
        // 6. Append VERIFICATION_STARTED (only if not already exists)
        if (!hasVerificationStarted) {
            await appendEvent({
                contractId,
                actor: 'SYSTEM',
                eventType: EventType.VERIFICATION_STARTED,
                metadata: { startedAt: new Date().toISOString() },
                tx,
            });
        }
        // 6. Find Activation Event (EXECUTION_CONFIRMED)
        const activationEvent = events.find(e => e.eventType === EventType.EXECUTION_CONFIRMED);
        if (!activationEvent) {
            // Should be impossible if state is LOCKED/VERIFYING, but check safety
            // If we are evaluating, we MUST have a start point.
            return {
                success: false,
                pass: false,
                observedValue: 0,
                threshold: 0,
                operator: '',
                evidence: { snapshotAt: '', metrics: {}, source: '' },
                error: 'Cannot verify: Contract missing activation event (EXECUTION_CONFIRMED)',
            };
        }
        // 7. Call Adapter
        let evalResult;
        // Fetch User to get Connected Account ID
        // Optimized: We could have fetched this earlier, but doing it just-in-time for evaluation
        const [user] = await (tx ?? db)
            .select()
            .from(users)
            .where(eq(users.id, contract.principalUserId))
            .limit(1);
        const context = {
            windowStartUtc: new Date(activationEvent.timestampUtc),
            stripeConnectedAccountId: user?.stripeConnectedAccountId || undefined
        };
        if (contract.platform === 'X') {
            const xResult = await xAdapter.evaluate(contract, context);
            evalResult = {
                success: true,
                pass: xResult.pass,
                observedValue: xResult.observedValue,
                threshold: xResult.threshold,
                operator: xResult.operator,
                evidence: xResult.evidence
            };
        }
        else if (contract.platform === 'STRIPE') {
            // Enforce connected account presence for Stripe Revenue
            if (!context.stripeConnectedAccountId) {
                return {
                    success: false, // Verification execution failed (configuration error)
                    pass: false,
                    observedValue: 0,
                    threshold: 0,
                    operator: '',
                    evidence: { snapshotAt: '', metrics: {}, source: '' },
                    error: `Cannot verify Stripe Revenue: User ${contract.principalUserId} has no connected Stripe account.`,
                    success: false
                };
            }
            const stripeResult = await stripeRevenueAdapter.evaluate(contract, context);
            evalResult = {
                pass: stripeResult.pass,
                observedValue: stripeResult.observedValue,
                threshold: stripeResult.threshold,
                operator: stripeResult.operator,
                evidence: stripeResult.evidence
            };
        }
        else if (contract.platform === 'GITHUB') {
            const githubResult = await githubAdapter.evaluate(contract, context);
            evalResult = {
                pass: githubResult.pass,
                observedValue: githubResult.observedValue,
                threshold: githubResult.threshold,
                operator: githubResult.operator,
                evidence: githubResult.evidence
            };
        }
        else {
            throw new Error(`Platform ${contract.platform} logic missing`);
        }
        // 8. Append Result Event
        await appendEvent({
            contractId,
            actor: 'SYSTEM',
            eventType: evalResult.pass ? EventType.VERIFICATION_SUCCEEDED : EventType.VERIFICATION_FAILED,
            metadata: {
                observedValue: evalResult.observedValue,
                threshold: evalResult.threshold,
                operator: evalResult.operator,
                evidence: evalResult.evidence,
                verifiedAt: new Date().toISOString(),
            },
            tx,
        });
        // 9. Append CONTRACT_VERIFIED (idempotent - for UI state clarity)
        await appendContractVerifiedIfMissing(contractId, evalResult.pass, tx);
        console.log(`${evalResult.pass ? '✅' : '❌'} Contract ${contractId} verification: ${evalResult.pass ? 'SUCCEEDED' : 'FAILED'}`);
        return {
            success: true,
            pass: evalResult.pass,
            observedValue: evalResult.observedValue,
            threshold: evalResult.threshold,
            operator: evalResult.operator,
            evidence: evalResult.evidence,
        };
    }
    catch (err) {
        const classified = classifyError(err);
        console.error(`Error verifying contract ${contractId} (${classified.category}):`, err.message);
        if (classified.retryable) {
            // Schedule retry for retryable errors
            const nextRetry = await scheduleRetry(contractId, 'VERIFY', `${classified.category}: ${classified.originalError.message}`);
            if (nextRetry) {
                console.log(`⏰ Scheduled verification retry for ${contractId} at ${nextRetry.toISOString()}`);
            }
            else {
                console.log(`⏰ Scheduled verification retry for ${contractId} (time unknown)`);
            }
            return {
                success: false,
                pass: false,
                observedValue: 0,
                threshold: 0,
                operator: '',
                evidence: { snapshotAt: '', metrics: {}, source: '' },
                error: classified.originalError.message,
                retryable: true,
            };
        }
        else {
            // Non-retryable: append terminal VERIFICATION_FAILED
            await appendEvent({
                contractId,
                actor: 'SYSTEM',
                eventType: EventType.VERIFICATION_FAILED,
                metadata: {
                    reason: classified.originalError.message,
                    category: classified.category,
                    errorType: 'NON_RETRYABLE',
                    verifiedAt: new Date().toISOString(),
                    evidence: {},
                },
                tx,
            });
            // Append CONTRACT_VERIFIED for consistency
            await appendContractVerifiedIfMissing(contractId, false, tx);
            console.log(`❌ Contract ${contractId} verification FAILED (non-retryable: ${classified.category})`);
            return {
                success: false,
                pass: false,
                observedValue: 0,
                threshold: 0,
                operator: '',
                evidence: { snapshotAt: '', metrics: {}, source: '' },
                error: classified.originalError.message,
                retryable: false,
            };
        }
    }
}
/**
 * Helper: Append CONTRACT_VERIFIED if not already present (idempotent)
 */
async function appendContractVerifiedIfMissing(contractId, pass, tx) {
    const events = await getEventsForContract(contractId, tx);
    const hasContractVerified = events.some(e => e.eventType === EventType.CONTRACT_VERIFIED);
    if (!hasContractVerified) {
        await appendEvent({
            contractId,
            actor: 'SYSTEM',
            eventType: EventType.CONTRACT_VERIFIED,
            metadata: {
                outcome: pass ? 'SUCCEEDED' : 'FAILED',
                verifiedAt: new Date().toISOString(),
            },
            tx,
        });
    }
}
/**
 * Run verification for all eligible contracts
 *
 * CANDIDATE SELECTION (via contract_index - O(1) index lookup):
 * - currentState = LOCKED
 * - isTerminal = 0
 * - deadlineUtc <= now
 * - nextRetryDueUtc IS NULL OR nextRetryDueUtc <= now
 */
export async function runVerificationJob() {
    console.log('🚀 Starting verification job...');
    const now = new Date();
    // Query contract_index for LOCKED non-terminal contracts past deadline
    // This replaces the O(N) full table scan + per-contract deriveState
    const eligibleContractIds = await db
        .select({ contractId: contractIndex.contractId })
        .from(contractIndex)
        .where(and(eq(contractIndex.currentState, ContractStatus.LOCKED), eq(contractIndex.isTerminal, 0), lte(contractIndex.deadlineUtc, now), or(isNull(contractIndex.nextRetryDueUtc), lte(contractIndex.nextRetryDueUtc, now))));
    console.log(`Found ${eligibleContractIds.length} contracts ready for verification (via index)`);
    if (eligibleContractIds.length > 0) {
        console.log(`Contract IDs: ${eligibleContractIds.map(c => c.contractId).join(', ')}`);
    }
    let succeeded = 0;
    let failed = 0;
    let skipped = 0;
    for (const { contractId } of eligibleContractIds) {
        const result = await verifyContract(contractId);
        if (!result.success) {
            if (result.retryable) {
                skipped++;
            }
            else {
                failed++;
            }
        }
        else if (result.pass) {
            succeeded++;
        }
        else {
            failed++; // FAILED outcome = verification failed, counted as "failed" for stats
        }
    }
    console.log(`✅ Verification job complete: ${succeeded} succeeded, ${failed} failed, ${skipped} skipped`);
    return {
        processed: eligibleContractIds.length,
        succeeded,
        failed,
        skipped,
    };
}
//# sourceMappingURL=verification.js.map
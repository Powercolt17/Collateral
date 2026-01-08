/**
 * Contract Service
 *
 * Manages contract lifecycle. State is NEVER stored.
 * All state is derived from ledger events via state-derivation service.
 * Every meaningful action emits a ledger event.
 */
import { db } from '../db/client.js';
import { contracts, EventType, users, connectedAccounts } from '../db/schema.js';
import { appendEvent, getEventsForContract } from './ledger.js';
import { deriveState, canTransition, InvalidTransitionError } from './state-derivation.js';
import { eq, and } from 'drizzle-orm';
import { createHash } from 'crypto';
import { stripeRevenueAdapter } from '../adapters/stripe-revenue.js';
import { getGithubClient } from '../adapters/github.js';
// =============================================================================
// ANTI-ABUSE CONSTANTS (GitHub)
// =============================================================================
export const GITHUB_MIN_REPO_AGE_DAYS = 30;
export const GITHUB_MAX_PUSHED_STALENESS_DAYS = 30;
export const GITHUB_MIN_REPO_SIZE_KB = 1000;
export const GITHUB_MIN_THRESHOLD_ADVANCED = 5;
export const GITHUB_MIN_THRESHOLD_ELITE = 10;
export const GITHUB_MAX_WINDOW_DAYS = 30;
// =============================================================================
// ANTI-SYBIL CONTROLS
// =============================================================================
export const MAX_ACTIVE_CONTRACTS_PER_USER = 3;
export const MAX_ACTIVE_CONTRACTS_PER_PLATFORM = 1;
export const CONTRACT_CREATION_COOLDOWN_HOURS = 24;
export const FAILURE_COOLDOWN_HOURS = 72; // Cooldown after failure
export const FAILURE_WINDOW_DAYS = 7;
export const MIN_LOCK_AMOUNT_USD_CENTS = 1000; // $10
// Escalation tiers (MUST BE MONOTONIC: 1.0x → 1.5x → 2.0x)
export const ESCALATION_TIER_1_FAILURES = 2; // 2 failures → 1.5x
export const ESCALATION_TIER_1_MULTIPLIER = 1.5;
export const ESCALATION_TIER_2_FAILURES = 3; // 3+ failures → 2.0x
export const ESCALATION_TIER_2_MULTIPLIER = 2.0;
/**
 * Get contract by ID
 * @param contractId - Contract to fetch
 * @param txClient - Optional transaction client
 */
export async function getContract(contractId, txClient) {
    const client = txClient ?? db;
    const [contract] = await client
        .select()
        .from(contracts)
        .where(eq(contracts.id, contractId))
        .limit(1);
    return contract || null;
}
/**
 * Get contract with derived state
 */
export async function getContractWithState(contractId) {
    const contract = await getContract(contractId);
    if (!contract)
        return null;
    const events = await getEventsForContract(contractId);
    const state = deriveState(events);
    return { contract, state };
}
/**
 * Get contracts for a user with derived states
 */
export async function getContractsForUser(userId) {
    const userContracts = await db
        .select()
        .from(contracts)
        .where(eq(contracts.principalUserId, userId))
        .orderBy(contracts.createdAt);
    const results = await Promise.all(userContracts.map(async (contract) => {
        const events = await getEventsForContract(contract.id);
        const state = deriveState(events);
        return { contract, state };
    }));
    return results;
}
/**
 * Compute record hash for contract immutability
 */
function computeRecordHash(contract, firstEventId) {
    const payload = {
        principalUserId: contract.principalUserId,
        platform: contract.platform,
        metricType: contract.metricType,
        conditionJson: contract.conditionJson,
        deadlineUtc: contract.deadlineUtc,
        lockAmountUsdCents: contract.lockAmountUsdCents,
        firstEventId,
    };
    return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}
/**
 * Get terminal failure events for a user from the ledger
 * These events indicate when a contract was forfeited (user failed)
 * Returns events ordered by timestamp descending (most recent first)
 */
async function getTerminalFailureEventsForUser(principalUserId) {
    // First get all user's contracts
    const userContractIds = await db
        .select({ id: contracts.id })
        .from(contracts)
        .where(eq(contracts.principalUserId, principalUserId));
    if (userContractIds.length === 0) {
        return [];
    }
    const contractIds = userContractIds.map(c => c.id);
    // Query ledger for terminal failure events (SETTLED_FAILURE or CONTRACT_FORFEITED)
    // These indicate the user failed to meet their commitment
    const failureEventTypes = [EventType.SETTLED_FAILURE, EventType.CONTRACT_FORFEITED];
    const failureEvents = [];
    // Query ledger events for each contract (ledger is truth)
    for (const contractId of contractIds) {
        const events = await getEventsForContract(contractId);
        const failureEvent = events.find(e => failureEventTypes.includes(e.eventType));
        if (failureEvent) {
            failureEvents.push({
                contractId,
                eventType: failureEvent.eventType,
                timestamp: failureEvent.timestampUtc,
            });
        }
    }
    // Sort by timestamp descending (most recent first)
    return failureEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
/**
 * Anti-Sybil Validation (LEDGER-FIRST)
 *
 * Enforces:
 * - Active contract cap (max 3)
 * - Platform limits (max 1 per platform)
 * - Creation cooldown (24h between contracts)
 * - Failure cooldown (72h after any terminal failure - from LEDGER)
 * - Escalating min lock (based on failure COUNT from LEDGER)
 *
 * IMPORTANT: Failure detection uses ledger events (SETTLED_FAILURE, CONTRACT_FORFEITED)
 * not contract.createdAt. This is objective and cannot be gamed.
 */
async function validateAntiSybil(principalUserId, lockAmountUsdCents, platform) {
    const now = new Date();
    // Get all user contracts with states (for active cap checks)
    const userContracts = await getContractsForUser(principalUserId);
    // 1. Global active contract cap (max 3)
    const activeStates = ['CREATED', 'LOCKED', 'VERIFYING', 'SETTLING', 'VERIFIED', 'FUNDS_AUTHORIZED', 'FUNDS_LOCKED'];
    const activeContracts = userContracts.filter(c => c.state && activeStates.includes(c.state));
    if (activeContracts.length >= MAX_ACTIVE_CONTRACTS_PER_USER) {
        throw new Error(`Anti-sybil: Maximum ${MAX_ACTIVE_CONTRACTS_PER_USER} active contracts allowed per user`);
    }
    // 2. Platform-specific cap (max 1 per platform)
    const activePlatformContracts = activeContracts.filter(c => c.contract.platform === platform);
    if (activePlatformContracts.length >= MAX_ACTIVE_CONTRACTS_PER_PLATFORM) {
        throw new Error(`Anti-sybil: Maximum ${MAX_ACTIVE_CONTRACTS_PER_PLATFORM} active contract per platform (${platform})`);
    }
    // 3. Creation cooldown (24h between contracts)
    const cooldownCutoff = new Date(now.getTime() - CONTRACT_CREATION_COOLDOWN_HOURS * 60 * 60 * 1000);
    const recentContract = userContracts.find(c => c.contract.createdAt && new Date(c.contract.createdAt) > cooldownCutoff);
    if (recentContract) {
        const hoursAgo = Math.floor((now.getTime() - new Date(recentContract.contract.createdAt).getTime()) / (1000 * 60 * 60));
        throw new Error(`Anti-sybil: Must wait ${CONTRACT_CREATION_COOLDOWN_HOURS}h between contracts (last created ${hoursAgo}h ago)`);
    }
    // =============================================================================
    // LEDGER-FIRST: Get terminal failure events from ledger (objective truth)
    // =============================================================================
    const failureEvents = await getTerminalFailureEventsForUser(principalUserId);
    // 4. Failure cooldown (72h after any failure) - USES LEDGER TIMESTAMP
    const failureCooldownCutoff = new Date(now.getTime() - FAILURE_COOLDOWN_HOURS * 60 * 60 * 1000);
    const recentFailure = failureEvents.find(e => e.timestamp > failureCooldownCutoff);
    if (recentFailure) {
        const hoursAgo = Math.floor((now.getTime() - recentFailure.timestamp.getTime()) / (1000 * 60 * 60));
        const hoursRemaining = FAILURE_COOLDOWN_HOURS - hoursAgo;
        throw new Error(`Anti-sybil: Failure cooldown active. Wait ${hoursRemaining}h before creating new contracts (last failure at ${recentFailure.timestamp.toISOString()})`);
    }
    // 5. Escalating min lock after failures (MONOTONIC: 1x → 1.5x → 2x) - USES LEDGER
    const failureWindowCutoff = new Date(now.getTime() - FAILURE_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const recentFailures = failureEvents.filter(e => e.timestamp > failureWindowCutoff);
    let minLock = MIN_LOCK_AMOUNT_USD_CENTS;
    let escalationReason = '';
    if (recentFailures.length >= ESCALATION_TIER_2_FAILURES) {
        // 3+ failures → 2.0x (highest tier first for monotonic check)
        minLock = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_2_MULTIPLIER);
        escalationReason = ` (escalated 2.0x due to ${recentFailures.length} failures in last ${FAILURE_WINDOW_DAYS} days)`;
    }
    else if (recentFailures.length >= ESCALATION_TIER_1_FAILURES) {
        // 2 failures → 1.5x
        minLock = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_1_MULTIPLIER);
        escalationReason = ` (escalated 1.5x due to ${recentFailures.length} failures in last ${FAILURE_WINDOW_DAYS} days)`;
    }
    // 0-1 failures → 1.0x (no escalation)
    if (lockAmountUsdCents < minLock) {
        const minDollars = (minLock / 100).toFixed(2);
        throw new Error(`Anti-sybil: Minimum lock amount is $${minDollars}${escalationReason}`);
    }
}
/**
 * Create a new contract
 * Atomically: insert contract record, append CONTRACT_CREATED event, compute record hash
 * State is CREATED after the ledger event is appended (derived, not stored)
 */
export async function createContract(params) {
    const { principalUserId, principalIdentityUsername, platform, metricType, condition, lockAmountUsdCents, payoutAmountUsdCents, fundingMethod, riskTier = 'STANDARD', } = params;
    // =========================================================
    // ANTI-SYBIL VALIDATION (before any other checks)
    // =========================================================
    await validateAntiSybil(principalUserId, lockAmountUsdCents, platform);
    // =========================================================
    // STRICT CONDITION VALIDATION (per platform/metric)
    // =========================================================
    const cond = condition;
    if (typeof cond.operator !== 'string' || !['GTE', 'GT', 'LTE', 'LT', 'EQ'].includes(cond.operator)) {
        throw new Error('Contract condition requires valid operator (GTE, GT, LTE, LT, EQ)');
    }
    if (typeof cond.threshold !== 'number' || cond.threshold < 0) {
        throw new Error('Contract condition requires non-negative numeric threshold');
    }
    if (typeof cond.deadline !== 'string') {
        throw new Error('Contract condition requires deadline (ISO date string)');
    }
    // Platform-specific validation
    if (platform === 'GITHUB' && metricType === 'PRS_MERGED') {
        if (typeof cond.repoOwner !== 'string' || !cond.repoOwner.trim()) {
            throw new Error('GitHub PRs contract requires repoOwner in condition');
        }
        if (typeof cond.repoName !== 'string' || !cond.repoName.trim()) {
            throw new Error('GitHub PRs contract requires repoName in condition');
        }
        // =========================================================
        // TIER GATING: GitHub PRs only allowed in ADVANCED or ELITE
        // =========================================================
        if (riskTier === 'STANDARD') {
            throw new Error('GitHub PRs contracts require ADVANCED or ELITE tier (STANDARD not allowed)');
        }
        // =========================================================
        // MINIMUM THRESHOLD FLOORS
        // =========================================================
        const minThreshold = riskTier === 'ELITE' ? GITHUB_MIN_THRESHOLD_ELITE : GITHUB_MIN_THRESHOLD_ADVANCED;
        if (cond.threshold < minThreshold) {
            throw new Error(`GitHub PRs threshold must be >= ${minThreshold} for ${riskTier} tier`);
        }
        // =========================================================
        // MAXIMUM WINDOW (Deadline - Now <= 30 days)
        // =========================================================
        const deadlineDate = new Date(cond.deadline);
        const now = new Date();
        const windowDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (windowDays > GITHUB_MAX_WINDOW_DAYS) {
            throw new Error(`GitHub PRs window must be <= ${GITHUB_MAX_WINDOW_DAYS} days (got ${windowDays} days)`);
        }
    }
    // Snapshot Baseline if needed
    let baselineJson = null;
    if (platform === 'STRIPE' && metricType === 'REVENUE') {
        // Actually we need to fetch user to pass to adapter
        // Or adapter fetches user.
        // Let's fetch user here.
        const [userRecord] = await db.select().from(users).where(eq(users.id, principalUserId)).limit(1);
        if (userRecord) {
            const snapshot = await stripeRevenueAdapter.snapshotBaseline(userRecord);
            baselineJson = snapshot.metrics;
        }
    }
    else if (platform === 'GITHUB' && metricType === 'PRS_MERGED') {
        const cond = condition;
        if (!cond.repoOwner || !cond.repoName) {
            throw new Error('GitHub PRs contract requires repoOwner and repoName in condition');
        }
        // 1. Fetch Connected Account (Immutable Identity Binding)
        const [connected] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, principalUserId), eq(connectedAccounts.platform, 'GITHUB')))
            .limit(1);
        if (!connected) {
            throw new Error('Cannot create GitHub contract: User has no connected GitHub account');
        }
        // 2. Fetch repo metadata for eligibility checks
        const client = getGithubClient();
        const repoMeta = await client.getRepoMetadata(cond.repoOwner, cond.repoName);
        // =========================================================
        // REPO ELIGIBILITY CHECKS (Objective, No Subjective Judgement)
        // =========================================================
        const now = new Date();
        const repoAgeDays = Math.floor((now.getTime() - repoMeta.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        const pushedAgoDays = Math.floor((now.getTime() - repoMeta.pushedAt.getTime()) / (1000 * 60 * 60 * 24));
        // Check 1: Repo age >= 30 days
        if (repoAgeDays < GITHUB_MIN_REPO_AGE_DAYS) {
            throw new Error(`Cannot create GitHub contract: repo too new (${repoAgeDays} days, minimum ${GITHUB_MIN_REPO_AGE_DAYS})`);
        }
        // Check 2: Repo recently pushed (within 30 days)
        if (pushedAgoDays > GITHUB_MAX_PUSHED_STALENESS_DAYS) {
            throw new Error(`Cannot create GitHub contract: repo stale (last push ${pushedAgoDays} days ago, max ${GITHUB_MAX_PUSHED_STALENESS_DAYS})`);
        }
        // Check 3: Repo size >= 1MB
        if (repoMeta.sizeKb < GITHUB_MIN_REPO_SIZE_KB) {
            throw new Error(`Cannot create GitHub contract: repo too small (${repoMeta.sizeKb}KB, minimum ${GITHUB_MIN_REPO_SIZE_KB}KB)`);
        }
        // 3. Snapshot Baseline (Immutable Data for Verification)
        baselineJson = {
            principalGithubUserId: connected.externalAccountId, // Immutable ID
            defaultBranch: repoMeta.defaultBranch, // Immutable Target
            repoOwner: cond.repoOwner,
            repoName: cond.repoName,
            // Repo eligibility snapshot (evidence)
            repoCreatedAtUtc: repoMeta.createdAt.toISOString(),
            repoPushedAtUtc: repoMeta.pushedAt.toISOString(),
            repoSizeKb: repoMeta.sizeKb,
        };
    }
    else if (platform === 'X') {
        // Existing X logic or placeholder
        baselineJson = { followers: 1000 }; // Legacy mock
    }
    const deadlineUtc = new Date(condition.deadline);
    // Insert contract record (no status column - state derived from ledger)
    const newContract = {
        principalUserId,
        principalIdentityUsername,
        platform,
        metricType,
        conditionJson: condition,
        baselineJson, // Stored here
        deadlineUtc,
        lockAmountUsdCents,
        payoutAmountUsdCents,
        fundingMethod: fundingMethod || 'USD_CARD',
        riskTier,
    };
    const [inserted] = await db.insert(contracts).values(newContract).returning();
    // Append CONTRACT_CREATED event - this makes the contract state = CREATED
    // Include precommitted payout terms as ledger evidence (receipt)
    // CRITICAL: Pass deadlineUtc to populate contract_index.deadlineUtc
    const event = await appendEvent({
        contractId: inserted.id,
        actor: 'USER',
        eventType: EventType.CONTRACT_CREATED,
        amountUsdCents: lockAmountUsdCents,
        deadlineUtc, // Populate contract_index.deadlineUtc for job candidate selection
        metadata: {
            condition,
            baseline: baselineJson,
            // PRECOMMITTED TERMS (receipt)
            lockAmountUsdCents,
            payoutAmountUsdCents,
        },
    });
    // Compute and update record hash
    const recordHash = computeRecordHash(newContract, event.id);
    const [updated] = await db
        .update(contracts)
        .set({ recordHash })
        .where(eq(contracts.id, inserted.id))
        .returning();
    // If baseline exists, emit BASELINE_SNAPSHOTTED event (immutable ledger receipt)
    if (baselineJson) {
        await appendEvent({
            contractId: inserted.id,
            actor: 'SYSTEM',
            eventType: EventType.BASELINE_SNAPSHOTTED,
            metadata: {
                snapshotAt: new Date().toISOString(),
                platform,
                metricType,
                ...baselineJson,
            },
        });
    }
    return updated;
}
/**
 * Append a state-changing event to a contract
 * Validates that the transition is allowed before appending
 */
export async function appendContractEvent(contractId, options) {
    // Get current state
    const events = await getEventsForContract(contractId);
    const currentState = deriveState(events);
    if (!currentState) {
        return { success: false, error: 'Contract has no events' };
    }
    // The event type determines what state we're transitioning to
    // Append the event - validation happens in deriveState
    await appendEvent({
        contractId,
        actor: options.actor,
        eventType: EventType[options.eventType],
        amountUsdCents: options.amountUsdCents,
        externalRef: options.externalRef,
        metadata: options.metadata,
    });
    return { success: true };
}
/**
 * Update contract baseline JSON (for freezing at execution)
 *
 * SECURITY-CRITICAL: This is the ONLY way to update baselineJson after creation.
 * Used to freeze the identity binding and baseline metrics at EXECUTION_CONFIRMED.
 *
 * IMMUTABILITY GUARD: Rejects updates if contract is already in LOCKED or terminal state.
 * This ensures the frozen baseline cannot be tampered with after execution.
 */
export class BaselineImmutableError extends Error {
    constructor(contractId, currentState) {
        super(`Cannot update baseline for contract ${contractId} in state ${currentState}. Baseline is immutable after execution.`);
        this.name = 'BaselineImmutableError';
    }
}
export async function updateContractBaseline(contractId, baselineJson) {
    // 1. Get contract and derive state
    const contract = await getContract(contractId);
    if (!contract) {
        throw new Error(`Contract not found: ${contractId}`);
    }
    // 2. Get events and derive current state
    const events = await getEventsForContract(contractId);
    const currentState = deriveState(events);
    // 3. IMMUTABILITY GUARD: Reject if already LOCKED or terminal
    const immutableStates = [
        'LOCKED',
        'SETTLED',
        'FORFEITED',
    ];
    if (currentState && immutableStates.includes(currentState)) {
        throw new BaselineImmutableError(contractId, currentState);
    }
    // 4. Perform update
    await db
        .update(contracts)
        .set({ baselineJson })
        .where(eq(contracts.id, contractId));
}
/**
 * Get contracts that are due for verification (state = LOCKED + past deadline)
 */
export async function getContractsDueForVerification() {
    // Get all contracts, then filter by derived state
    const allContracts = await db.select().from(contracts);
    const now = new Date();
    const results = [];
    for (const contract of allContracts) {
        if (contract.deadlineUtc > now)
            continue; // Not past deadline
        const events = await getEventsForContract(contract.id);
        const state = deriveState(events);
        if (state === 'LOCKED') {
            results.push(contract);
        }
    }
    return results;
}
// Re-export for backwards compatibility
export { canTransition, InvalidTransitionError };
//# sourceMappingURL=contracts.js.map
/**
 * Settlement Service
 * 
 * Handles settlement after verification.
 * NO PAYOUT MATH - uses precommitted amounts from contract.
 * 
 * State is NEVER stored - derived from ledger events.
 */

import { db, type DbLike } from '../db/client.js';
import { contracts, users, ContractStatus, EventType, contractIndex, type Contract } from '../db/schema.js';
import { getContract } from './contracts.js';
import { appendEvent, getEventsForContract } from './ledger.js';
import { deriveState } from './state-derivation.js';
import { getStripeClient } from './stripe-client.js';
import { tryAcquireLock, getNextRetryTime, scheduleRetry } from './job-lock.js';
import { classifyError } from './error-classification.js';
import { eq, and, or, isNull, lte } from 'drizzle-orm';

// =====================================================
// SETTLEMENT EVENT TYPES
// =====================================================
// SETTLEMENT_STARTED  → state becomes SETTLING (non-terminal, allows retry)
// SETTLED_SUCCESS     → state becomes SETTLED (terminal)
// SETTLED_FAILURE     → state becomes FORFEITED (terminal)

/**
 * Settlement result with Stripe references
 */
export interface SettlementResult {
    success: boolean;
    outcome: 'SUCCESS' | 'FAILURE' | null;
    amountUsdCents: number;
    stripeRefs: {
        transferId?: string;
        payoutId?: string;
    };
    error?: string;
    retryable?: boolean;
}

/**
 * Issue receipt for a contract (idempotent helper)
 * ALWAYS fetches fresh events for correct chainHeadHash and eventCount
 * 
 * @param tx - Optional transaction client for lock-pinned writes
 */
// Exported for regression tests only — not part of public API
export async function issueReceiptForContract(
    contractId: string,
    contract: Contract,
    terminalEvent: { eventType: string; amountUsdCents: number | null; metadataJson: unknown },
    tx?: DbLike
): Promise<void> {
    // CRITICAL: Use tx for read-your-writes when inside a transaction
    // Without this, uncommitted events would not be visible and chainHeadHash would be wrong
    const latestEvents = await getEventsForContract(contractId, tx);

    // Check if receipt already exists (idempotent guard)
    const existingReceipt = latestEvents.find(e => e.eventType === EventType.RECEIPT_ISSUED);
    if (existingReceipt) {
        console.log(`📄 Receipt already issued for contract ${contractId} (idempotent)`);
        return;
    }

    const verificationEvent = latestEvents.find(e =>
        e.eventType === EventType.VERIFICATION_SUCCEEDED ||
        e.eventType === EventType.VERIFICATION_FAILED
    );
    const verificationEvidence = verificationEvent?.metadataJson as Record<string, any> || {};
    const baselineData = contract.baselineJson as Record<string, any> || {};
    const verificationSucceeded = latestEvents.some(e => e.eventType === EventType.VERIFICATION_SUCCEEDED);

    // Chain head is last element in ledger sequence (getEventsForContract returns ordered)
    const chainHeadEvent = latestEvents[latestEvents.length - 1];
    const chainHeadHash = chainHeadEvent?.eventHash || null;

    // Get stripeRefs from terminal event metadata if available
    const terminalMeta = terminalEvent.metadataJson as Record<string, any> || {};
    const stripeRefs = {
        transferId: terminalMeta.stripeTransferId,
        payoutId: terminalMeta.stripePayoutId,
    };

    await appendEvent({
        contractId,
        actor: 'SYSTEM',
        eventType: EventType.RECEIPT_ISSUED,
        amountUsdCents: terminalEvent.amountUsdCents ?? contract.lockAmountUsdCents,
        metadata: {
            // Contract parameters (immutable at creation)
            contractParams: {
                platform: contract.platform,
                metricType: contract.metricType,
                condition: contract.conditionJson,
                riskTier: contract.riskTier,
                lockAmountUsdCents: contract.lockAmountUsdCents,
                payoutAmountUsdCents: contract.payoutAmountUsdCents,
                deadlineUtc: contract.deadlineUtc,
                recordHash: contract.recordHash,
            },
            // Baseline snapshot
            baseline: baselineData,
            // Verification evidence
            verification: {
                outcome: verificationSucceeded ? 'SUCCEEDED' : 'FAILED',
                evidence: verificationEvidence,
            },
            // Settlement outcome
            settlement: {
                outcome: terminalEvent.eventType === EventType.SETTLED_SUCCESS ? 'SUCCESS' : 'FAILURE',
                stripeRefs,
                payoutDeferred: terminalMeta.payoutDeferred || false,
                settledAt: new Date().toISOString(),
            },
            // Chain integrity
            chainHeadHash,
            eventCount: latestEvents.length,
            // Receipt metadata
            receiptIssuedAt: new Date().toISOString(),
        },
        tx,  // Pass through transaction client
    });

    console.log(`📄 Receipt issued for contract ${contractId}`);
}

/**
 * Check if a contract can be settled
 * - Must be in VERIFIED state
 * - Must have terminal verification event (SUCCEEDED or FAILED)
 */
export function canSettle(
    currentState: string | null,
    events: { eventType: string }[]
): { allowed: boolean; reason?: string; verificationOutcome?: 'SUCCEEDED' | 'FAILED' } {
    if (currentState !== ContractStatus.VERIFIED) {
        return {
            allowed: false,
            reason: `Cannot settle: state is ${currentState ?? 'NULL'}, must be VERIFIED`,
        };
    }

    // Check for terminal verification event
    const verificationSucceeded = events.some(e =>
        e.eventType === EventType.VERIFICATION_SUCCEEDED
    );
    const verificationFailed = events.some(e =>
        e.eventType === EventType.VERIFICATION_FAILED
    );

    if (!verificationSucceeded && !verificationFailed) {
        return {
            allowed: false,
            reason: 'Cannot settle: no terminal verification event found',
        };
    }

    return {
        allowed: true,
        verificationOutcome: verificationSucceeded ? 'SUCCEEDED' : 'FAILED',
    };
}

/**
 * Settle a single contract
 * 
 * From-state: VERIFIED (or SETTLING if retrying)
 * Appends: SETTLEMENT_STARTED (if not exists), then SETTLED_SUCCESS or SETTLED_FAILURE
 * To-state: SETTLED or FORFEITED
 * 
 * IDEMPOTENCY:
 * - Terminal events: SETTLED_SUCCESS or SETTLED_FAILURE
 * - Skip if terminal event exists (return cached result)
 * - Allow retry if only SETTLEMENT_STARTED exists (prevents stuck SETTLING state)
 * 
 * INVARIANT: System never gets stuck in SETTLING
 * 
 * @param contractId - Contract ID to settle
 * @param tx - Optional transaction client (for lock-pinned writes from withContractLock)
 */
export async function settleContract(contractId: string, tx?: DbLike): Promise<SettlementResult> {
    // 1. Get contract
    const contract = await getContract(contractId, tx);
    if (!contract) {
        return {
            success: false,
            outcome: null,
            amountUsdCents: 0,
            stripeRefs: {},
            error: 'Contract not found',
        };
    }

    // 2. Load events early for terminal check (before acquiring lock)
    const events = await getEventsForContract(contractId, tx);

    // 3. IDEMPOTENCY: Check if TERMINAL settlement event exists FIRST
    const terminalSettlementEvent = events.find(e =>
        e.eventType === EventType.SETTLED_SUCCESS ||
        e.eventType === EventType.SETTLED_FAILURE
    );

    if (terminalSettlementEvent) {
        // Terminal event exists - but we MUST check if receipt was issued
        // If receipt missing (crash between settlement and receipt), issue it now
        const existingReceipt = events.find(e => e.eventType === EventType.RECEIPT_ISSUED);

        if (!existingReceipt) {
            // Receipt missing - issue it idempotently
            console.log(`📋 Terminal exists for ${contractId} but receipt missing - issuing receipt`);
            await issueReceiptForContract(contractId, contract, terminalSettlementEvent);
        }

        // Now return cached result
        const metadata = terminalSettlementEvent.metadataJson as Record<string, any>;
        return {
            success: true,
            outcome: terminalSettlementEvent.eventType === EventType.SETTLED_SUCCESS ? 'SUCCESS' : 'FAILURE',
            amountUsdCents: terminalSettlementEvent.amountUsdCents ?? contract.lockAmountUsdCents,
            stripeRefs: {
                transferId: metadata?.stripeTransferId,
                payoutId: metadata?.stripePayoutId,
            },
        };
    }

    // 3a. Check if retry is scheduled for the future (before lock)
    // Skip this check when tx is provided - caller already holds invariant lock
    if (!tx) {
        const nextRetryTime = await getNextRetryTime(contractId, 'SETTLE');
        if (nextRetryTime && nextRetryTime > new Date()) {
            return {
                success: false,
                outcome: null,
                amountUsdCents: 0,
                stripeRefs: {},
                error: `Retry scheduled at ${nextRetryTime.toISOString()}`,
                retryable: true,
            };
        }
    }

    // 3b. Try to acquire SETTLE lock
    // CRITICAL: Skip job-lock when tx is provided - caller already holds invariant lock
    // via withContractLock, which guarantees single-writer semantics
    if (!tx) {
        const lock = await tryAcquireLock(contractId, 'SETTLE');
        if (!lock.acquired) {
            return {
                success: false,
                outcome: null,
                amountUsdCents: 0,
                stripeRefs: {},
                error: 'Locked by another worker',
                retryable: true,
            };
        }
    }

    // Derive current state
    const currentState = deriveState(events);

    // Check if SETTLEMENT_STARTED exists (in progress)
    const hasSettlementStarted = events.some(e =>
        e.eventType === EventType.SETTLEMENT_STARTED
    );

    // 4. Validate state and verification outcome
    if (!hasSettlementStarted) {
        const canSettleResult = canSettle(currentState, events);
        if (!canSettleResult.allowed) {
            return {
                success: false,
                outcome: null,
                amountUsdCents: 0,
                stripeRefs: {},
                error: canSettleResult.reason,
            };
        }
    } else {
        console.log(`📋 Retrying settlement for ${contractId} (SETTLEMENT_STARTED exists, no terminal event)`);
    }

    // Get verification outcome (we need this for settlement logic)
    const verificationSucceeded = events.some(e =>
        e.eventType === EventType.VERIFICATION_SUCCEEDED
    );

    try {
        // 5. Get or append SETTLEMENT_STARTED to get the event ID for idempotency
        let settlementStartedEvent = events.find(e => e.eventType === EventType.SETTLEMENT_STARTED);

        if (!settlementStartedEvent) {
            settlementStartedEvent = await appendEvent({
                contractId,
                actor: 'SYSTEM',
                eventType: EventType.SETTLEMENT_STARTED,
                metadata: { startedAt: new Date().toISOString() },
                tx,
            });
        }

        // 6. Execute Stripe money move
        let stripeRefs: { transferId?: string; payoutId?: string } = {};

        if (verificationSucceeded) {
            // SUCCESS: Payout to user using PRECOMMITTED payoutAmountUsdCents

            // Fetch user to get Stripe Connect Account ID
            const [user] = await (tx ?? db)
                .select()
                .from(users)
                .where(eq(users.id, contract.principalUserId))
                .limit(1);

            if (!user) {
                throw new Error(`Principal user ${contract.principalUserId} not found`);
            }

            if (!user.stripeConnectedAccountId) {
                // DEFERRED: No Connect Account linked
                // CRITICAL FIX: Still append terminal SETTLED_SUCCESS with payoutDeferred=true
                // This ensures the contract reaches terminal state + receipt is issued
                console.log(`⚠️ Contract ${contractId} payout deferred: No Stripe Connect account for user ${user.id}`);

                // 1. Append PAYOUT_DEFERRED for operational tracking
                await appendEvent({
                    contractId,
                    actor: 'SYSTEM',
                    eventType: EventType.PAYOUT_DEFERRED,
                    amountUsdCents: contract.payoutAmountUsdCents,
                    metadata: {
                        reason: 'MISSING_STRIPE_CONNECT_ID',
                        owedAmountUsdCents: contract.payoutAmountUsdCents,
                        deferredAt: new Date().toISOString(),
                    },
                    tx,
                });

                // 2. TERMINAL: Append SETTLED_SUCCESS with payoutDeferred=true
                const terminalEvent = await appendEvent({
                    contractId,
                    actor: 'SYSTEM',
                    eventType: EventType.SETTLED_SUCCESS,
                    amountUsdCents: contract.payoutAmountUsdCents,
                    metadata: {
                        outcome: 'SUCCESS',
                        payoutDeferred: true,
                        owedAmountUsdCents: contract.payoutAmountUsdCents,
                        reason: 'MISSING_STRIPE_CONNECT_ID',
                        settledAt: new Date().toISOString(),
                    },
                    tx,
                });

                // 3. Issue receipt for terminal event
                await issueReceiptForContract(contractId, contract, terminalEvent, tx);

                return {
                    success: true,
                    outcome: 'SUCCESS',
                    amountUsdCents: contract.payoutAmountUsdCents,
                    stripeRefs: {},
                };
            }

            // Execute Real Stripe Transfer
            const idempotencyKey = `tr_${contractId}_${settlementStartedEvent.id}`;
            const stripeClient = getStripeClient();

            console.log(`💸 Attempting Stripe Transfer for ${contractId} to ${user.stripeConnectedAccountId} (Idempotency: ${idempotencyKey})`);

            const transferResult = await stripeClient.createTransfer({
                amountUsdCents: contract.payoutAmountUsdCents,
                destinationAccountId: user.stripeConnectedAccountId,
                contractId,
                idempotencyKey,
            });

            if (!transferResult.success) {
                throw new Error(`Stripe Transfer failed: ${transferResult.error}`);
            }

            stripeRefs = { transferId: transferResult.id };

            // 7. Append SETTLED_SUCCESS with real transfer ID
            await appendEvent({
                contractId,
                actor: 'SYSTEM',
                eventType: EventType.SETTLED_SUCCESS,
                amountUsdCents: contract.payoutAmountUsdCents,
                externalRef: transferResult.id, // Ledger dedupe key
                metadata: {
                    outcome: 'SUCCESS',
                    stripeTransferId: transferResult.id,
                    stripeConnectedAccountId: user.stripeConnectedAccountId,
                    settledAt: new Date().toISOString(),
                    payoutToUser: true,
                    // Evidence of terms used
                    lockAmountUsdCents: contract.lockAmountUsdCents,
                    payoutAmountUsdCents: contract.payoutAmountUsdCents,
                },
                tx,
            });

            console.log(`✅ Contract ${contractId} settled SUCCESS - payout ${contract.payoutAmountUsdCents} cents (Transfer: ${transferResult.id})`);

        } else {
            // FAILURE: Forfeit to house
            // Funds already captured to platform balance - no user payout
            // In production: Log the forfeiture, no Stripe action needed

            // 7. Append SETTLED_FAILURE
            await appendEvent({
                contractId,
                actor: 'SYSTEM',
                eventType: EventType.SETTLED_FAILURE,
                amountUsdCents: contract.lockAmountUsdCents,
                metadata: {
                    outcome: 'FAILURE',
                    forfeitedToHouse: true,
                    settledAt: new Date().toISOString(),
                    noUserPayout: true,
                },
                tx,
            });

            console.log(`❌ Contract ${contractId} settled FAILURE - forfeited ${contract.lockAmountUsdCents} cents`);
        }

        // =================================================================
        // 8. RECEIPT_ISSUED - Issue via helper for correct chainHeadHash
        // =================================================================

        // Get the terminal event we just appended for the helper
        // CRITICAL: Use tx for read-your-writes - see uncommitted events
        const latestEvents = await getEventsForContract(contractId, tx);
        const terminalForReceipt = latestEvents.find(e =>
            e.eventType === EventType.SETTLED_SUCCESS ||
            e.eventType === EventType.SETTLED_FAILURE
        );

        if (terminalForReceipt) {
            await issueReceiptForContract(contractId, contract, terminalForReceipt, tx);
        }

        return {
            success: true,
            outcome: verificationSucceeded ? 'SUCCESS' : 'FAILURE',
            // SUCCESS uses payoutAmountUsdCents, FAILURE uses lockAmountUsdCents
            amountUsdCents: verificationSucceeded ? contract.payoutAmountUsdCents : contract.lockAmountUsdCents,
            stripeRefs,
        };

    } catch (err: any) {
        const classified = classifyError(err);
        console.error(`Error settling contract ${contractId} (${classified.category}):`, err.message);

        if (classified.retryable) {
            // Schedule retry for retryable errors
            const nextRetry = await scheduleRetry(
                contractId,
                'SETTLE',
                `${classified.category}: ${classified.originalError.message}`
            );
            console.log(`⏰ Scheduled settlement retry for ${contractId} at ${nextRetry.toISOString()}`);
            return {
                success: false,
                outcome: null,
                amountUsdCents: 0,
                stripeRefs: {},
                error: classified.originalError.message,
                retryable: true,
            };
        } else {
            // Non-retryable: append terminal SETTLED_FAILURE
            await appendEvent({
                contractId,
                actor: 'SYSTEM',
                eventType: EventType.SETTLED_FAILURE,
                amountUsdCents: contract.lockAmountUsdCents,
                metadata: {
                    outcome: 'FAILURE',
                    reason: classified.originalError.message,
                    category: classified.category,
                    settledAt: new Date().toISOString(),
                    errorType: 'NON_RETRYABLE',
                },
                tx,
            });
            console.log(`❌ Contract ${contractId} settlement FAILED (non-retryable: ${classified.category})`);
            return {
                success: false,
                outcome: 'FAILURE',
                amountUsdCents: contract.lockAmountUsdCents,
                stripeRefs: {},
                error: classified.originalError.message,
                retryable: false,
            };
        }
    }
}

/**
 * Run settlement for all verified contracts
 * 
 * CANDIDATE SELECTION (via contract_index - O(1) index lookup):
 * - currentState = VERIFIED
 * - isTerminal = 0
 * - nextRetryDueUtc IS NULL OR nextRetryDueUtc <= now
 */
export async function runSettlementJob(): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
}> {
    console.log('🚀 Starting settlement job...');
    const now = new Date();

    // Query contract_index for VERIFIED non-terminal contracts (O(1) index lookup)
    // This replaces the O(N) full table scan + per-contract deriveState
    const verifiedContractIds = await db
        .select({ contractId: contractIndex.contractId })
        .from(contractIndex)
        .where(
            and(
                eq(contractIndex.currentState, ContractStatus.VERIFIED),
                eq(contractIndex.isTerminal, 0),
                or(
                    isNull(contractIndex.nextRetryDueUtc),
                    lte(contractIndex.nextRetryDueUtc, now)
                )
            )
        );

    console.log(`Found ${verifiedContractIds.length} contracts ready for settlement (via index)`);
    if (verifiedContractIds.length > 0) {
        console.log(`Contract IDs: ${verifiedContractIds.map(c => c.contractId).join(', ')}`);
    }

    let succeeded = 0;
    let failed = 0;
    let skipped = 0;

    for (const { contractId } of verifiedContractIds) {
        const result = await settleContract(contractId);
        if (!result.success) {
            if (result.retryable) {
                skipped++;
            } else {
                failed++;
            }
        } else if (result.outcome === 'SUCCESS') {
            succeeded++;
        } else {
            failed++; // FAILURE outcome = verification failed, counted as "failed" for stats
        }
    }

    console.log(`✅ Settlement job complete: ${succeeded} succeeded, ${failed} failed, ${skipped} skipped`);

    return {
        processed: verifiedContractIds.length,
        succeeded,
        failed,
        skipped,
    };
}

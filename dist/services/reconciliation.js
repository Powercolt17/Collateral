/**
 * Reconciliation Service
 *
 * Finds stuck contracts and re-drives operations idempotently.
 * Uses invariants: runIdempotent, withContractLock, scheduleRetry.
 *
 * STUCK STATES (recoverable):
 * - VERIFYING: Retry verification (respects locks and retry schedules)
 * - SETTLING: Retry settlement
 * - PAYOUT_DEFERRED: Retry payout if user now has Stripe binding
 * - Missing receipt: Issue receipt for terminal contracts
 */
import { db } from '../db/client.js';
import { contracts, ContractStatus, EventType, contractIndex } from '../db/schema.js';
import { getEventsForContract } from './ledger.js';
import { deriveState } from './state-derivation.js';
import { settleContract } from './settlement.js';
import { verifyContract } from './verification.js';
import { hasActiveLock, getNextRetryTime } from './job-lock.js';
import { eq, and, lt, lte, or, isNull } from 'drizzle-orm';
import { runIdempotent } from '../invariants/idempotency.js';
import { withContractLock, ContractLockError } from '../invariants/contract-locks.js';
import { getActiveBinding } from './identity-bindings.js';
// =============================================================================
// CONFIGURATION
// =============================================================================
// How old a contract must be to be considered "stuck" (minutes)
const STUCK_THRESHOLD_MINUTES = 15;
// Day bucket for idempotency (prevents rapid re-driving same day)
function getDayBucket() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}
// =============================================================================
// STUCK CONTRACT QUERIES (using contract_index)
// =============================================================================
const stuckThreshold = () => new Date(Date.now() - STUCK_THRESHOLD_MINUTES * 60 * 1000);
/**
 * Find contracts stuck after verification (no settlement terminal)
 */
async function findStuckSettlement() {
    const threshold = stuckThreshold();
    const result = await db
        .select({
        contractId: contractIndex.contractId,
    })
        .from(contractIndex)
        .where(and(or(eq(contractIndex.currentState, 'VERIFICATION_SUCCEEDED'), eq(contractIndex.currentState, 'SETTLEMENT_STARTED'), eq(contractIndex.currentState, 'SETTLING')), lt(contractIndex.lastEventAtUtc, threshold), eq(contractIndex.isTerminal, 0), or(isNull(contractIndex.nextRetryDueUtc), lte(contractIndex.nextRetryDueUtc, new Date()))));
    return result.map(r => r.contractId);
}
/**
 * Find contracts with PAYOUT_DEFERRED where user now has Stripe binding
 */
async function findPayoutDeferred() {
    const result = await db
        .select({
        contractId: contractIndex.contractId,
        principalUserId: contracts.principalUserId,
    })
        .from(contractIndex)
        .innerJoin(contracts, eq(contracts.id, contractIndex.contractId))
        .where(and(or(eq(contractIndex.currentState, 'PAYOUT_DEFERRED'), eq(contractIndex.currentState, 'PAYOUT_PENDING')), or(isNull(contractIndex.nextRetryDueUtc), lte(contractIndex.nextRetryDueUtc, new Date()))));
    // Filter to only those with Stripe binding now
    const deferred = [];
    for (const contract of result) {
        const binding = await getActiveBinding(contract.principalUserId, 'stripe');
        if (binding) {
            deferred.push(contract);
        }
    }
    return deferred;
}
/**
 * Find contracts with terminal state but missing receipt
 */
async function findMissingReceipts() {
    const terminalContracts = await db
        .select({
        contractId: contractIndex.contractId,
    })
        .from(contractIndex)
        .where(eq(contractIndex.isTerminal, 1));
    const missing = [];
    for (const contract of terminalContracts) {
        const events = await getEventsForContract(contract.contractId);
        const hasReceipt = events.some(e => e.eventType === EventType.RECEIPT_ISSUED);
        if (!hasReceipt) {
            missing.push(contract.contractId);
        }
    }
    return missing;
}
// =============================================================================
// RE-DRIVE FUNCTIONS (with idempotency + locks from invariants)
// =============================================================================
/**
 * Re-drive settlement for a stuck contract
 * Uses invariants: runIdempotent + withContractLock
 *
 * CRITICAL: tx from withContractLock is passed to settleContract
 * to ensure all DB writes use the lock-pinned connection.
 */
async function reDriveSettlement(contractId) {
    const dayBucket = getDayBucket();
    const idempotencyKey = `settle:${contractId}:${dayBucket}`;
    try {
        const result = await runIdempotent({ scope: 'reconcile:settle', key: idempotencyKey }, async () => {
            return await withContractLock(contractId, async (tx) => {
                // Lock acquired inside transaction - tx MUST be used for writes
                console.log(`🔧 Reconcile: re-driving settlement for ${contractId.slice(0, 8)}...`);
                const settleResult = await settleContract(contractId, tx);
                return settleResult.success;
            }, { noWait: true });
        });
        return {
            success: result.status === 'executed' ? (result.result ?? false) : true,
            cached: result.status === 'cached',
        };
    }
    catch (err) {
        if (err instanceof ContractLockError) {
            console.log(`⏳ Reconcile: contract ${contractId.slice(0, 8)}... locked, skipping`);
            return { success: false, cached: false };
        }
        throw err;
    }
}
/**
 * Re-drive verification for a stuck contract
 *
 * CRITICAL: tx from withContractLock is passed to verifyContract
 * to ensure all DB writes use the lock-pinned connection.
 */
async function reDriveVerification(contractId) {
    const dayBucket = getDayBucket();
    const idempotencyKey = `verify:${contractId}:${dayBucket}`;
    try {
        const result = await runIdempotent({ scope: 'reconcile:verify', key: idempotencyKey }, async () => {
            return await withContractLock(contractId, async (tx) => {
                // Lock acquired inside transaction - tx MUST be used for writes
                console.log(`🔧 Reconcile: re-driving verification for ${contractId.slice(0, 8)}...`);
                const verifyResult = await verifyContract(contractId, tx);
                return verifyResult.success;
            }, { noWait: true });
        });
        return {
            success: result.status === 'executed' ? (result.result ?? false) : true,
            cached: result.status === 'cached',
        };
    }
    catch (err) {
        if (err instanceof ContractLockError) {
            console.log(`⏳ Reconcile: contract ${contractId.slice(0, 8)}... locked, skipping`);
            return { success: false, cached: false };
        }
        throw err;
    }
}
// =============================================================================
// MAIN RECONCILIATION SWEEP
// =============================================================================
/**
 * Run a full reconciliation sweep
 *
 * This function is idempotent and safe to run repeatedly.
 * Uses locks to prevent per-contract conflicts with normal operations.
 */
export async function reconcileSweep() {
    const startTime = Date.now();
    const errors = [];
    let scanned = 0;
    let reDrivenFunding = 0;
    let reDrivenVerification = 0;
    let reDrivenSettlement = 0;
    let receiptsIssued = 0;
    let payoutsQueued = 0;
    console.log('🔍 Starting reconciliation sweep...');
    // Find all stuck contracts
    const [stuckSettlement, missingReceipts, payoutDeferred] = await Promise.all([
        findStuckSettlement(),
        findMissingReceipts(),
        findPayoutDeferred(),
    ]);
    scanned = stuckSettlement.length + missingReceipts.length + payoutDeferred.length;
    console.log(`📊 Found: ${stuckSettlement.length} settlement, ${missingReceipts.length} receipts, ${payoutDeferred.length} deferred payouts`);
    // Process stuck settlement
    for (const contractId of stuckSettlement) {
        try {
            const result = await reDriveSettlement(contractId);
            if (result.success && !result.cached) {
                reDrivenSettlement++;
            }
        }
        catch (err) {
            errors.push(`Settlement ${contractId}: ${err.message}`);
        }
    }
    // Process deferred payouts
    for (const contract of payoutDeferred) {
        try {
            const result = await reDriveSettlement(contract.contractId);
            if (result.success && !result.cached) {
                payoutsQueued++;
            }
        }
        catch (err) {
            errors.push(`Payout ${contract.contractId}: ${err.message}`);
        }
    }
    // Process missing receipts (settlement will issue if terminal)
    for (const contractId of missingReceipts) {
        try {
            const result = await reDriveSettlement(contractId);
            if (result.success && !result.cached) {
                receiptsIssued++;
            }
        }
        catch (err) {
            errors.push(`Receipt ${contractId}: ${err.message}`);
        }
    }
    const durationMs = Date.now() - startTime;
    console.log(`✅ Reconciliation complete in ${durationMs}ms: ${reDrivenSettlement} settlements, ${receiptsIssued} receipts, ${payoutsQueued} payouts`);
    return {
        scanned,
        reDrivenFunding,
        reDrivenVerification,
        reDrivenSettlement,
        receiptsIssued,
        payoutsQueued,
        errors,
        durationMs,
    };
}
// =============================================================================
// PAYOUT DEFERRED PROCESSOR
// =============================================================================
/**
 * Process deferred payouts for users who now have Stripe bindings
 */
export async function processDeferredPayouts() {
    console.log('💸 Processing deferred payouts...');
    const deferred = await findPayoutDeferred();
    let processed = 0;
    let succeeded = 0;
    let failed = 0;
    const errors = [];
    for (const contract of deferred) {
        processed++;
        try {
            const result = await reDriveSettlement(contract.contractId);
            if (result.success) {
                succeeded++;
            }
            else {
                failed++;
            }
        }
        catch (err) {
            failed++;
            errors.push(`${contract.contractId}: ${err.message}`);
        }
    }
    console.log(`💸 Deferred payouts: ${succeeded} succeeded, ${failed} failed`);
    return { processed, succeeded, failed, errors };
}
// =============================================================================
// LEGACY RECONCILIATION JOB (kept for backward compatibility)
// =============================================================================
/**
 * Run reconciliation job (legacy function)
 * @deprecated Use reconcileSweep() instead
 */
export async function runReconciliationJob() {
    console.log('🔄 Starting reconciliation job...');
    const allContracts = await db.select().from(contracts);
    let processed = 0;
    let recovered = 0;
    let stillStuck = 0;
    let skipped = 0;
    let errors = 0;
    for (const contract of allContracts) {
        try {
            const events = await getEventsForContract(contract.id);
            const state = deriveState(events);
            // Handle VERIFYING state
            if (state === ContractStatus.VERIFYING) {
                // Check if locked
                const lockStatus = await hasActiveLock(contract.id, 'VERIFY');
                if (lockStatus.locked) {
                    console.log(`⏳ Skipping ${contract.id}: VERIFY locked until ${lockStatus.expiresAt?.toISOString()}`);
                    skipped++;
                    continue;
                }
                // Check if retry is scheduled for the future
                const nextRetry = await getNextRetryTime(contract.id, 'VERIFY');
                if (nextRetry && nextRetry > new Date()) {
                    console.log(`⏳ Skipping ${contract.id}: VERIFY retry scheduled at ${nextRetry.toISOString()}`);
                    skipped++;
                    continue;
                }
                processed++;
                console.log(`🔧 Reconciling verification for ${contract.id} (State: ${state})`);
                const result = await verifyContract(contract.id);
                if (result.success) {
                    const newEvents = await getEventsForContract(contract.id);
                    const newState = deriveState(newEvents);
                    if (newState === ContractStatus.VERIFIED) {
                        recovered++;
                        console.log(`✅ Recovered verification ${contract.id} -> ${newState}`);
                    }
                    else {
                        stillStuck++;
                    }
                }
                else if (result.retryable) {
                    stillStuck++;
                    console.log(`⚠️ Contract ${contract.id} verification will retry later`);
                }
                else {
                    errors++;
                    console.error(`❌ Failed to reconcile verification ${contract.id}: ${result.error}`);
                }
            }
            // Handle SETTLING or PAYOUT_PENDING state
            if (state === ContractStatus.SETTLING || state === ContractStatus.PAYOUT_PENDING) {
                // Check if locked
                const lockStatus = await hasActiveLock(contract.id, 'SETTLE');
                if (lockStatus.locked) {
                    console.log(`⏳ Skipping ${contract.id}: SETTLE locked until ${lockStatus.expiresAt?.toISOString()}`);
                    skipped++;
                    continue;
                }
                // Check if retry is scheduled for the future
                const nextRetry = await getNextRetryTime(contract.id, 'SETTLE');
                if (nextRetry && nextRetry > new Date()) {
                    console.log(`⏳ Skipping ${contract.id}: SETTLE retry scheduled at ${nextRetry.toISOString()}`);
                    skipped++;
                    continue;
                }
                processed++;
                console.log(`🔧 Reconciling settlement for ${contract.id} (State: ${state})`);
                const result = await settleContract(contract.id);
                if (result.success && result.outcome) {
                    const newEvents = await getEventsForContract(contract.id);
                    const newState = deriveState(newEvents);
                    if (newState === ContractStatus.SETTLED || newState === ContractStatus.FORFEITED) {
                        recovered++;
                        console.log(`✅ Recovered settlement ${contract.id} -> ${newState}`);
                    }
                    else {
                        stillStuck++;
                        console.log(`⚠️ Contract ${contract.id} still in ${newState}`);
                    }
                }
                else if (result.retryable) {
                    stillStuck++;
                    console.log(`⚠️ Contract ${contract.id} settlement will retry later`);
                }
                else if (result.error) {
                    errors++;
                    console.error(`❌ Failed to reconcile settlement ${contract.id}: ${result.error}`);
                }
            }
        }
        catch (err) {
            errors++;
            console.error(`❌ Error reconciling ${contract.id}:`, err.message);
        }
    }
    console.log(`🏁 Reconciliation complete: ${processed} processed, ${recovered} recovered, ${stillStuck} stuck, ${skipped} skipped, ${errors} errors`);
    return {
        processed,
        recovered,
        stillStuck,
        skipped,
        errors,
    };
}
//# sourceMappingURL=reconciliation.js.map
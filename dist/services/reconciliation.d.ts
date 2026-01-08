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
export interface ReconciliationResult {
    scanned: number;
    reDrivenFunding: number;
    reDrivenVerification: number;
    reDrivenSettlement: number;
    receiptsIssued: number;
    payoutsQueued: number;
    errors: string[];
    durationMs: number;
}
/**
 * Run a full reconciliation sweep
 *
 * This function is idempotent and safe to run repeatedly.
 * Uses locks to prevent per-contract conflicts with normal operations.
 */
export declare function reconcileSweep(): Promise<ReconciliationResult>;
/**
 * Process deferred payouts for users who now have Stripe bindings
 */
export declare function processDeferredPayouts(): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
    errors: string[];
}>;
/**
 * Run reconciliation job (legacy function)
 * @deprecated Use reconcileSweep() instead
 */
export declare function runReconciliationJob(): Promise<{
    processed: number;
    recovered: number;
    stillStuck: number;
    skipped: number;
    errors: number;
}>;

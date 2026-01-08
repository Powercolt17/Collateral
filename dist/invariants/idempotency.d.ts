/**
 * Idempotency Guards - I2 External Side Effects
 *
 * DB-backed idempotency for exactly-once semantics across processes.
 *
 * INVARIANT: All external side effects (webhooks, transfers, payouts) are idempotent.
 *
 * FIXED: Atomic acquisition with INSERT ON CONFLICT + UPDATE compare-and-set.
 * FIXED: Bounded retry loop (max 2 attempts, no recursion).
 */
export type IdempotencyStatus = 'started' | 'succeeded' | 'failed';
export interface IdempotencyKey {
    key: string;
    scope: string;
    status: IdempotencyStatus;
    createdAt: Date;
    lockedAt: Date | null;
    completedAt: Date | null;
    resultJson: unknown;
    errorText: string | null;
}
export interface IdempotentResult<T> {
    status: 'executed' | 'cached' | 'in_progress';
    result?: T;
    cachedAt?: Date;
}
export interface IdempotentParams {
    scope: string;
    key: string;
}
/**
 * Run a function with DB-backed idempotency guarantee
 *
 * BEHAVIOR:
 * - First caller wins via atomic INSERT + UPDATE compare-and-set
 * - On success: updates to 'succeeded' + stores result
 * - On failure: updates to 'failed' + stores error; rethrows
 * - Subsequent callers:
 *   - If 'succeeded': return cached result
 *   - If 'started' (not stale): return 'in_progress'
 *   - If 'started' (stale): compete to take over via compare-and-set
 *   - If 'failed': compete to retry via compare-and-set
 */
export declare function runIdempotent<T>(params: IdempotentParams, fn: () => Promise<T>): Promise<IdempotentResult<T>>;
export declare const IdempotencyScope: {
    readonly STRIPE_WEBHOOK: "stripe:webhook";
    readonly STRIPE_PAYOUT: "stripe:payout";
    readonly CONTRACT_SETTLE: "contract:settle";
    readonly CONTRACT_VERIFY: "contract:verify";
};
/**
 * Check if an idempotency key exists and is completed
 * Useful for checking without running
 */
export declare function isIdempotentKeyCompleted(scope: string, key: string): Promise<boolean>;

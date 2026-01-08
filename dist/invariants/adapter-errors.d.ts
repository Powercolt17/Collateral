/**
 * Adapter Error Classification - I4 Fail-Closed on Uncertainty
 *
 * Classifies adapter errors and schedules retries appropriately.
 *
 * INVARIANT: On uncertainty, fail CLOSED (do not mark success) and schedule retry.
 *
 * This ensures:
 * - Network issues don't cause false negatives
 * - Rate limits are handled with appropriate backoff
 * - Auth failures are non-retryable (require intervention)
 * - Unknown errors fail closed (assume retryable)
 */
export interface ErrorClassification {
    retryable: boolean;
    reason: string;
    backoffMs?: number;
    category: 'network' | 'rate_limit' | 'auth' | 'not_found' | 'malformed' | 'unknown';
}
/**
 * Classify an adapter error to determine retry behavior
 *
 * FAIL CLOSED PRINCIPLE:
 * - If we can't confidently determine the error type, assume retryable
 * - Only non-retryable errors are:
 *   - Auth failures (401/403)
 *   - Not found (404)
 *   - Explicit non-retryable markers
 */
export declare function classifyAdapterError(err: unknown): ErrorClassification;
export interface RetryScheduleParams {
    contractId: string;
    jobType: 'VERIFY' | 'SETTLE';
    reason: string;
    attempt: number;
    baseBackoffMs?: number;
    maxBackoffMs?: number;
}
/**
 * Schedule a retry for a contract job
 *
 * Updates contract_index.nextRetryDueUtc with the calculated retry time.
 *
 * @returns The scheduled retry time
 */
export declare function scheduleRetry(params: RetryScheduleParams): Promise<Date>;
/**
 * Clear retry schedule (call on successful completion)
 */
export declare function clearRetrySchedule(contractId: string): Promise<void>;
export interface FailClosedResult<T> {
    success: boolean;
    result?: T;
    retryScheduled?: boolean;
    nextRetryAt?: Date;
    classification?: ErrorClassification;
}
/**
 * Execute an adapter call with fail-closed semantics
 *
 * On error:
 * - Classifies the error
 * - If retryable: schedules retry and returns { success: false, retryScheduled: true }
 * - If non-retryable: rethrows
 *
 * @param contractId Contract ID for retry scheduling
 * @param jobType Job type for logging
 * @param attempt Current attempt number
 * @param fn Adapter function to call
 */
export declare function runWithFailClosed<T>(contractId: string, jobType: 'VERIFY' | 'SETTLE', attempt: number, fn: () => Promise<T>): Promise<FailClosedResult<T>>;

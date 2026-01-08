/**
 * Job Lock Service (Atomic Implementation)
 *
 * Provides atomic locking for verification and settlement jobs.
 * Uses job_locks table with UNIQUE(contractId, jobType) constraint.
 *
 * Lock pattern:
 * - INSERT ... ON CONFLICT DO NOTHING for atomic acquire
 * - Expired locks can be replaced via DELETE + INSERT in transaction
 * - No race conditions: DB enforces single active lock
 */
export type JobType = 'VERIFY' | 'SETTLE';
export interface JobLockResult {
    acquired: boolean;
    lockId?: string;
    existingLockId?: string;
    expiresAt?: Date;
}
/**
 * Check if a non-expired lock exists for the given job type (DB-based)
 */
export declare function hasActiveLock(contractId: string, jobType: JobType): Promise<{
    locked: boolean;
    lockId?: string;
    expiresAt?: Date;
}>;
/**
 * Atomically acquire a lock for the given job type.
 * Uses INSERT ... ON CONFLICT DO NOTHING for race-safe acquisition.
 * Expired locks are deleted first in a transaction.
 */
export declare function tryAcquireLock(contractId: string, jobType: JobType): Promise<JobLockResult>;
/**
 * Release a lock (optional - locks expire automatically)
 */
export declare function releaseLock(contractId: string, jobType: JobType, lockId: string): Promise<boolean>;
/**
 * Get the count of RETRY_SCHEDULED events for a job type (for backoff calculation)
 */
export declare function getRetryCount(contractId: string, jobType: JobType): Promise<number>;
/**
 * Schedule a retry by appending RETRY_SCHEDULED event
 */
export declare function scheduleRetry(contractId: string, jobType: JobType, reason: string, baseDelayMs?: number): Promise<Date>;
/**
 * Get the next scheduled retry time for a job type (if any)
 */
export declare function getNextRetryTime(contractId: string, jobType: JobType): Promise<Date | null>;

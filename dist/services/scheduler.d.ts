/**
 * Scheduler Entrypoint
 *
 * Unified job scheduler that runs:
 * - runVerificationJob
 * - runSettlementJob
 * - runReconciliationJob
 *
 * Each job emits structured metrics logs.
 * Safe to run every minute, respects locks.
 */
import { type JobResult } from './observability.js';
export interface SchedulerResult {
    verification: JobResult | null;
    settlement: JobResult | null;
    reconciliation: JobResult | null;
    totalDurationMs: number;
}
/**
 * Run all scheduled jobs
 * Safe to call every minute
 * Respects kill switches and locks
 */
export declare function runScheduledJobs(): Promise<SchedulerResult>;
export declare function runVerificationJobWithMetrics(): Promise<JobResult>;
export declare function runSettlementJobWithMetrics(): Promise<JobResult>;
export declare function runReconciliationJobWithMetrics(): Promise<JobResult>;

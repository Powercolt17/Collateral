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

import { runVerificationJob } from './verification.js';
import { runSettlementJob } from './settlement.js';
import { runReconciliationJob } from './reconciliation.js';
import { runOracleRefreshJob } from '../jobs/oracle-refresh.js';
import {
    isVerificationEnabled,
    isSettlementEnabled,
} from './kill-switches.js';
import {
    recordVerificationJobRun,
    recordSettlementJobRun,
    recordReconciliationJobRun,
    logJobResult,
    type JobResult,
} from './observability.js';

// =============================================================================
// JOB SCHEDULER
// =============================================================================

export interface SchedulerResult {
    verification: JobResult | null;
    settlement: JobResult | null;
    reconciliation: JobResult | null;
    oracleRefresh: JobResult | null;
    totalDurationMs: number;
}

/**
 * Run all scheduled jobs
 * Safe to call every minute
 * Respects kill switches and locks
 */
export async function runScheduledJobs(): Promise<SchedulerResult> {
    console.log('⏰ Starting scheduled job run...');
    const startTime = Date.now();

    let verificationResult: JobResult | null = null;
    let settlementResult: JobResult | null = null;
    let reconciliationResult: JobResult | null = null;

    // 1. Verification Job
    if (isVerificationEnabled()) {
        const jobStart = Date.now();
        try {
            const result = await runVerificationJob();
            const durationMs = Date.now() - jobStart;
            recordVerificationJobRun(durationMs);

            verificationResult = {
                jobType: 'VERIFICATION',
                processed: result.processed,
                succeeded: result.succeeded,
                failed: result.failed,
                skipped: result.skipped,
                durationMs,
                skipReasons: {
                    locked: 0, // Would need to track in job
                    retryScheduled: 0,
                    terminal: 0,
                },
            };
            logJobResult(verificationResult);
        } catch (err: any) {
            console.error('❌ Verification job error:', err.message);
        }
    } else {
        console.log('⏭️ Verification job SKIPPED (kill switch disabled)');
    }

    // 2. Settlement Job
    if (isSettlementEnabled()) {
        const jobStart = Date.now();
        try {
            const result = await runSettlementJob();
            const durationMs = Date.now() - jobStart;
            recordSettlementJobRun(durationMs);

            settlementResult = {
                jobType: 'SETTLEMENT',
                processed: result.processed,
                succeeded: result.succeeded,
                failed: result.failed,
                skipped: result.skipped,
                durationMs,
                skipReasons: {
                    locked: 0,
                    retryScheduled: 0,
                    terminal: 0,
                },
            };
            logJobResult(settlementResult);
        } catch (err: any) {
            console.error('❌ Settlement job error:', err.message);
        }
    } else {
        console.log('⏭️ Settlement job SKIPPED (kill switch disabled)');
    }

    // 3. Reconciliation Job (always runs if verification/settlement enabled)
    if (isVerificationEnabled() || isSettlementEnabled()) {
        const jobStart = Date.now();
        try {
            const result = await runReconciliationJob();
            const durationMs = Date.now() - jobStart;
            recordReconciliationJobRun(durationMs);

            reconciliationResult = {
                jobType: 'RECONCILIATION',
                processed: result.processed,
                succeeded: result.recovered,
                failed: result.errors,
                skipped: result.skipped,
                recovered: result.recovered,
                stillStuck: result.stillStuck,
                errors: result.errors,
                durationMs,
                skipReasons: {
                    locked: 0,
                    retryScheduled: result.skipped,
                    terminal: 0,
                },
            };
            logJobResult(reconciliationResult);
        } catch (err: any) {
            console.error('❌ Reconciliation job error:', err.message);
        }
    }

    // 4. Oracle Refresh Job (always runs if verification enabled)
    let oracleResult: JobResult | null = null;
    if (isVerificationEnabled()) {
        const jobStart = Date.now();
        try {
            const result = await runOracleRefreshJob();
            const durationMs = Date.now() - jobStart;

            oracleResult = {
                jobType: 'ORACLE_REFRESH',
                processed: result.processed,
                succeeded: result.succeeded,
                failed: result.failed,
                skipped: result.skipped,
                durationMs,
                skipReasons: {
                    locked: 0,
                    retryScheduled: 0,
                    terminal: 0,
                },
            };
            logJobResult(oracleResult);
        } catch (err: any) {
            console.error('❌ Oracle refresh job error:', err.message);
        }
    }

    const totalDurationMs = Date.now() - startTime;
    console.log(`✅ Scheduled job run complete in ${totalDurationMs}ms`);

    return {
        verification: verificationResult,
        settlement: settlementResult,
        reconciliation: reconciliationResult,
        oracleRefresh: oracleResult,
        totalDurationMs,
    };
}

// =============================================================================
// INDIVIDUAL JOB RUNNERS (for testing)
// =============================================================================

export async function runVerificationJobWithMetrics(): Promise<JobResult> {
    if (!isVerificationEnabled()) {
        throw new Error('Verification is disabled');
    }

    const jobStart = Date.now();
    const result = await runVerificationJob();
    const durationMs = Date.now() - jobStart;
    recordVerificationJobRun(durationMs);

    const jobResult: JobResult = {
        jobType: 'VERIFICATION',
        processed: result.processed,
        succeeded: result.succeeded,
        failed: result.failed,
        skipped: result.skipped,
        durationMs,
        skipReasons: {
            locked: 0,
            retryScheduled: 0,
            terminal: 0,
        },
    };
    logJobResult(jobResult);
    return jobResult;
}

export async function runSettlementJobWithMetrics(): Promise<JobResult> {
    if (!isSettlementEnabled()) {
        throw new Error('Settlement is disabled');
    }

    const jobStart = Date.now();
    const result = await runSettlementJob();
    const durationMs = Date.now() - jobStart;
    recordSettlementJobRun(durationMs);

    const jobResult: JobResult = {
        jobType: 'SETTLEMENT',
        processed: result.processed,
        succeeded: result.succeeded,
        failed: result.failed,
        skipped: result.skipped,
        durationMs,
        skipReasons: {
            locked: 0,
            retryScheduled: 0,
            terminal: 0,
        },
    };
    logJobResult(jobResult);
    return jobResult;
}

export async function runReconciliationJobWithMetrics(): Promise<JobResult> {
    const jobStart = Date.now();
    const result = await runReconciliationJob();
    const durationMs = Date.now() - jobStart;
    recordReconciliationJobRun(durationMs);

    const jobResult: JobResult = {
        jobType: 'RECONCILIATION',
        processed: result.processed,
        succeeded: result.recovered,
        failed: result.errors,
        skipped: result.skipped,
        recovered: result.recovered,
        stillStuck: result.stillStuck,
        errors: result.errors,
        durationMs,
        skipReasons: {
            locked: 0,
            retryScheduled: result.skipped,
            terminal: 0,
        },
    };
    logJobResult(jobResult);
    return jobResult;
}

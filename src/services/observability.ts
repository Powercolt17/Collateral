/**
 * Operational Observability
 * 
 * Minimal metrics for operational monitoring.
 * In production, these would be pushed to Prometheus, CloudWatch, etc.
 */

// =============================================================================
// METRICS STATE
// =============================================================================

interface JobMetrics {
    successCount: number;
    failureCount: number;
    skippedCount: number;
    lastRunAt: string | null;
    lastDurationMs: number | null;
}

interface StateGauges {
    verifyingCount: number;
    settlingCount: number;
    payoutPendingCount: number;
    retryScheduledCount: number;
    lastUpdatedAt: string | null;
}

interface Metrics {
    verification: JobMetrics;
    settlement: JobMetrics;
    reconciliation: JobMetrics;
    stateGauges: StateGauges;
    retryBacklogSize: number;
    contractsCreatedTotal: number;
    contractsSettledTotal: number;
    contractsForfeitedTotal: number;
}

const metrics: Metrics = {
    verification: {
        successCount: 0,
        failureCount: 0,
        skippedCount: 0,
        lastRunAt: null,
        lastDurationMs: null,
    },
    settlement: {
        successCount: 0,
        failureCount: 0,
        skippedCount: 0,
        lastRunAt: null,
        lastDurationMs: null,
    },
    reconciliation: {
        successCount: 0,
        failureCount: 0,
        skippedCount: 0,
        lastRunAt: null,
        lastDurationMs: null,
    },
    stateGauges: {
        verifyingCount: 0,
        settlingCount: 0,
        payoutPendingCount: 0,
        retryScheduledCount: 0,
        lastUpdatedAt: null,
    },
    retryBacklogSize: 0,
    contractsCreatedTotal: 0,
    contractsSettledTotal: 0,
    contractsForfeitedTotal: 0,
};

// =============================================================================
// STRUCTURED JOB RESULT (for scheduler logging)
// =============================================================================

export interface JobResult {
    jobType: 'VERIFICATION' | 'SETTLEMENT' | 'RECONCILIATION';
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
    recovered?: number;
    stillStuck?: number;
    errors?: number;
    durationMs: number;
    skipReasons: {
        locked: number;
        retryScheduled: number;
        terminal: number;
    };
}

// =============================================================================
// METRIC RECORDING
// =============================================================================

export function recordVerificationSuccess(): void {
    metrics.verification.successCount++;
}

export function recordVerificationFailure(): void {
    metrics.verification.failureCount++;
}

export function recordVerificationSkipped(): void {
    metrics.verification.skippedCount++;
}

export function recordSettlementSuccess(): void {
    metrics.settlement.successCount++;
    metrics.contractsSettledTotal++;
}

export function recordSettlementFailure(): void {
    metrics.settlement.failureCount++;
    metrics.contractsForfeitedTotal++;
}

export function recordSettlementSkipped(): void {
    metrics.settlement.skippedCount++;
}

export function recordContractCreated(): void {
    metrics.contractsCreatedTotal++;
}

export function recordVerificationJobRun(durationMs: number): void {
    metrics.verification.lastRunAt = new Date().toISOString();
    metrics.verification.lastDurationMs = durationMs;
}

export function recordSettlementJobRun(durationMs: number): void {
    metrics.settlement.lastRunAt = new Date().toISOString();
    metrics.settlement.lastDurationMs = durationMs;
}

export function recordReconciliationJobRun(durationMs: number): void {
    metrics.reconciliation.lastRunAt = new Date().toISOString();
    metrics.reconciliation.lastDurationMs = durationMs;
}

export function updateRetryBacklogSize(size: number): void {
    metrics.retryBacklogSize = size;
}

// =============================================================================
// STATE GAUGE UPDATES
// =============================================================================

export function updateStateGauges(gauges: {
    verifyingCount: number;
    settlingCount: number;
    payoutPendingCount: number;
    retryScheduledCount: number;
}): void {
    metrics.stateGauges.verifyingCount = gauges.verifyingCount;
    metrics.stateGauges.settlingCount = gauges.settlingCount;
    metrics.stateGauges.payoutPendingCount = gauges.payoutPendingCount;
    metrics.stateGauges.retryScheduledCount = gauges.retryScheduledCount;
    metrics.stateGauges.lastUpdatedAt = new Date().toISOString();
}

export function getStateGauges(): StateGauges {
    return { ...metrics.stateGauges };
}

// =============================================================================
// METRIC RETRIEVAL (for /health or /metrics endpoint)
// =============================================================================

export function getMetrics(): Metrics {
    return { ...metrics };
}

export function getMetricsSummary(): string {
    return `
Verification: ${metrics.verification.successCount} success, ${metrics.verification.failureCount} failed, ${metrics.verification.skippedCount} skipped
Settlement: ${metrics.settlement.successCount} success, ${metrics.settlement.failureCount} failed, ${metrics.settlement.skippedCount} skipped
Reconciliation: ${metrics.reconciliation.successCount} success, ${metrics.reconciliation.failureCount} failed
State Gauges: VERIFYING=${metrics.stateGauges.verifyingCount}, SETTLING=${metrics.stateGauges.settlingCount}, PAYOUT_PENDING=${metrics.stateGauges.payoutPendingCount}, RETRY_SCHEDULED=${metrics.stateGauges.retryScheduledCount}
Retry Backlog: ${metrics.retryBacklogSize}
Total Created: ${metrics.contractsCreatedTotal}
Total Settled: ${metrics.contractsSettledTotal}
Total Forfeited: ${metrics.contractsForfeitedTotal}
Last Verification: ${metrics.verification.lastRunAt || 'never'}
Last Settlement: ${metrics.settlement.lastRunAt || 'never'}
Last Reconciliation: ${metrics.reconciliation.lastRunAt || 'never'}
`.trim();
}

// =============================================================================
// STRUCTURED JOB LOG (for scheduler)
// =============================================================================

export function logJobResult(result: JobResult): void {
    const log = {
        timestamp: new Date().toISOString(),
        jobType: result.jobType,
        processed: result.processed,
        succeeded: result.succeeded,
        failed: result.failed,
        skipped: result.skipped,
        recovered: result.recovered,
        stillStuck: result.stillStuck,
        errors: result.errors,
        durationMs: result.durationMs,
        skipReasons: result.skipReasons,
    };
    console.log(`📊 JOB_RESULT: ${JSON.stringify(log)}`);
}

// =============================================================================
// RESET (for testing)
// =============================================================================

export function resetMetrics(): void {
    metrics.verification.successCount = 0;
    metrics.verification.failureCount = 0;
    metrics.verification.skippedCount = 0;
    metrics.verification.lastRunAt = null;
    metrics.verification.lastDurationMs = null;
    metrics.settlement.successCount = 0;
    metrics.settlement.failureCount = 0;
    metrics.settlement.skippedCount = 0;
    metrics.settlement.lastRunAt = null;
    metrics.settlement.lastDurationMs = null;
    metrics.reconciliation.successCount = 0;
    metrics.reconciliation.failureCount = 0;
    metrics.reconciliation.skippedCount = 0;
    metrics.reconciliation.lastRunAt = null;
    metrics.reconciliation.lastDurationMs = null;
    metrics.stateGauges.verifyingCount = 0;
    metrics.stateGauges.settlingCount = 0;
    metrics.stateGauges.payoutPendingCount = 0;
    metrics.stateGauges.retryScheduledCount = 0;
    metrics.stateGauges.lastUpdatedAt = null;
    metrics.retryBacklogSize = 0;
    metrics.contractsCreatedTotal = 0;
    metrics.contractsSettledTotal = 0;
    metrics.contractsForfeitedTotal = 0;
}


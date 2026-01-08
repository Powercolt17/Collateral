/**
 * Operational Observability
 *
 * Minimal metrics for operational monitoring.
 * In production, these would be pushed to Prometheus, CloudWatch, etc.
 */
const metrics = {
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
// METRIC RECORDING
// =============================================================================
export function recordVerificationSuccess() {
    metrics.verification.successCount++;
}
export function recordVerificationFailure() {
    metrics.verification.failureCount++;
}
export function recordVerificationSkipped() {
    metrics.verification.skippedCount++;
}
export function recordSettlementSuccess() {
    metrics.settlement.successCount++;
    metrics.contractsSettledTotal++;
}
export function recordSettlementFailure() {
    metrics.settlement.failureCount++;
    metrics.contractsForfeitedTotal++;
}
export function recordSettlementSkipped() {
    metrics.settlement.skippedCount++;
}
export function recordContractCreated() {
    metrics.contractsCreatedTotal++;
}
export function recordVerificationJobRun(durationMs) {
    metrics.verification.lastRunAt = new Date().toISOString();
    metrics.verification.lastDurationMs = durationMs;
}
export function recordSettlementJobRun(durationMs) {
    metrics.settlement.lastRunAt = new Date().toISOString();
    metrics.settlement.lastDurationMs = durationMs;
}
export function recordReconciliationJobRun(durationMs) {
    metrics.reconciliation.lastRunAt = new Date().toISOString();
    metrics.reconciliation.lastDurationMs = durationMs;
}
export function updateRetryBacklogSize(size) {
    metrics.retryBacklogSize = size;
}
// =============================================================================
// STATE GAUGE UPDATES
// =============================================================================
export function updateStateGauges(gauges) {
    metrics.stateGauges.verifyingCount = gauges.verifyingCount;
    metrics.stateGauges.settlingCount = gauges.settlingCount;
    metrics.stateGauges.payoutPendingCount = gauges.payoutPendingCount;
    metrics.stateGauges.retryScheduledCount = gauges.retryScheduledCount;
    metrics.stateGauges.lastUpdatedAt = new Date().toISOString();
}
export function getStateGauges() {
    return { ...metrics.stateGauges };
}
// =============================================================================
// METRIC RETRIEVAL (for /health or /metrics endpoint)
// =============================================================================
export function getMetrics() {
    return { ...metrics };
}
export function getMetricsSummary() {
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
export function logJobResult(result) {
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
export function resetMetrics() {
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
//# sourceMappingURL=observability.js.map
/**
 * Operational Observability
 *
 * Minimal metrics for operational monitoring.
 * In production, these would be pushed to Prometheus, CloudWatch, etc.
 */
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
export declare function recordVerificationSuccess(): void;
export declare function recordVerificationFailure(): void;
export declare function recordVerificationSkipped(): void;
export declare function recordSettlementSuccess(): void;
export declare function recordSettlementFailure(): void;
export declare function recordSettlementSkipped(): void;
export declare function recordContractCreated(): void;
export declare function recordVerificationJobRun(durationMs: number): void;
export declare function recordSettlementJobRun(durationMs: number): void;
export declare function recordReconciliationJobRun(durationMs: number): void;
export declare function updateRetryBacklogSize(size: number): void;
export declare function updateStateGauges(gauges: {
    verifyingCount: number;
    settlingCount: number;
    payoutPendingCount: number;
    retryScheduledCount: number;
}): void;
export declare function getStateGauges(): StateGauges;
export declare function getMetrics(): Metrics;
export declare function getMetricsSummary(): string;
export declare function logJobResult(result: JobResult): void;
export declare function resetMetrics(): void;
export {};

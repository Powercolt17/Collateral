/**
 * Structured Logging with OTel Correlation
 *
 * Logs include traceId/spanId for correlation with traces.
 * Provides structured logging for terminal events.
 */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
/**
 * Log with trace correlation
 */
export declare function log(level: LogLevel, message: string, data?: Record<string, any>): void;
export declare function logDebug(message: string, data?: Record<string, any>): void;
export declare function logInfo(message: string, data?: Record<string, any>): void;
export declare function logWarn(message: string, data?: Record<string, any>): void;
export declare function logError(message: string, data?: Record<string, any>): void;
/**
 * Log a terminal verification event
 */
export declare function logTerminalVerification(params: {
    contractId: string;
    platform: string;
    riskTier: string;
    outcome: 'SUCCEEDED' | 'FAILED';
    retryable: boolean;
    category: string;
}): void;
/**
 * Log a terminal settlement event
 */
export declare function logTerminalSettlement(params: {
    contractId: string;
    platform: string;
    riskTier: string;
    outcome: 'SUCCESS' | 'FAILURE';
    retryable: boolean;
    category: string;
}): void;
/**
 * Log receipt issuance
 */
export declare function logReceiptIssued(params: {
    contractId: string;
    platform: string;
    riskTier: string;
    settlementOutcome: 'SUCCESS' | 'FAILURE';
}): void;
/**
 * Log job start
 */
export declare function logJobStart(jobType: string): void;
/**
 * Log job completion
 */
export declare function logJobComplete(jobType: string, result: {
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
    durationMs: number;
}): void;
/**
 * Log job error
 */
export declare function logJobError(jobType: string, error: string): void;

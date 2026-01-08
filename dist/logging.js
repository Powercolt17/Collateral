/**
 * Structured Logging with OTel Correlation
 *
 * Logs include traceId/spanId for correlation with traces.
 * Provides structured logging for terminal events.
 */
// Stub functions (OTel disabled for production rehearsal)
function getCurrentTraceId() { return undefined; }
function getCurrentSpanId() { return undefined; }
// =============================================================================
// CORE LOGGING
// =============================================================================
function createBaseLog(level, message) {
    return {
        timestamp: new Date().toISOString(),
        level,
        message,
        traceId: getCurrentTraceId(),
        spanId: getCurrentSpanId(),
    };
}
/**
 * Log with trace correlation
 */
export function log(level, message, data) {
    const entry = {
        ...createBaseLog(level, message),
        ...data,
    };
    const output = JSON.stringify(entry);
    switch (level) {
        case 'DEBUG':
            console.debug(output);
            break;
        case 'INFO':
            console.log(output);
            break;
        case 'WARN':
            console.warn(output);
            break;
        case 'ERROR':
            console.error(output);
            break;
    }
}
export function logDebug(message, data) {
    log('DEBUG', message, data);
}
export function logInfo(message, data) {
    log('INFO', message, data);
}
export function logWarn(message, data) {
    log('WARN', message, data);
}
export function logError(message, data) {
    log('ERROR', message, data);
}
// =============================================================================
// TERMINAL EVENT LOGGING
// =============================================================================
/**
 * Log a terminal verification event
 */
export function logTerminalVerification(params) {
    const entry = {
        ...createBaseLog('INFO', `Terminal verification: ${params.outcome}`),
        contractId: params.contractId,
        platform: params.platform,
        riskTier: params.riskTier,
        outcome: params.outcome,
        retryable: params.retryable,
        category: params.category,
        eventType: params.outcome === 'SUCCEEDED' ? 'VERIFICATION_SUCCEEDED' : 'VERIFICATION_FAILED',
    };
    console.log(`📋 TERMINAL_EVENT: ${JSON.stringify(entry)}`);
}
/**
 * Log a terminal settlement event
 */
export function logTerminalSettlement(params) {
    const entry = {
        ...createBaseLog('INFO', `Terminal settlement: ${params.outcome}`),
        contractId: params.contractId,
        platform: params.platform,
        riskTier: params.riskTier,
        outcome: params.outcome,
        retryable: params.retryable,
        category: params.category,
        eventType: params.outcome === 'SUCCESS' ? 'SETTLED_SUCCESS' : 'SETTLED_FAILURE',
    };
    console.log(`📋 TERMINAL_EVENT: ${JSON.stringify(entry)}`);
}
/**
 * Log receipt issuance
 */
export function logReceiptIssued(params) {
    const entry = {
        ...createBaseLog('INFO', 'Receipt issued'),
        contractId: params.contractId,
        platform: params.platform,
        riskTier: params.riskTier,
        outcome: params.settlementOutcome,
        retryable: false,
        category: 'RECEIPT',
        eventType: 'RECEIPT_ISSUED',
    };
    console.log(`📋 TERMINAL_EVENT: ${JSON.stringify(entry)}`);
}
// =============================================================================
// JOB LOGGING
// =============================================================================
/**
 * Log job start
 */
export function logJobStart(jobType) {
    log('INFO', `Job started: ${jobType}`, { jobType });
}
/**
 * Log job completion
 */
export function logJobComplete(jobType, result) {
    log('INFO', `Job completed: ${jobType}`, {
        jobType,
        ...result,
    });
}
/**
 * Log job error
 */
export function logJobError(jobType, error) {
    log('ERROR', `Job error: ${jobType}`, { jobType, error });
}
//# sourceMappingURL=logging.js.map
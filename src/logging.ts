/**
 * Structured Logging with OTel Correlation
 * 
 * Logs include traceId/spanId for correlation with traces.
 * Provides structured logging for terminal events.
 */

// Stub functions (OTel disabled for production rehearsal)
function getCurrentTraceId(): string | undefined { return undefined; }
function getCurrentSpanId(): string | undefined { return undefined; }

// =============================================================================
// LOG LEVELS
// =============================================================================

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

// =============================================================================
// STRUCTURED LOG ENTRY
// =============================================================================

interface BaseLogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    traceId?: string;
    spanId?: string;
}

interface TerminalEventLogEntry extends BaseLogEntry {
    contractId: string;
    platform: string;
    riskTier: string;
    outcome: string;
    retryable: boolean;
    category: string;
    eventType: string;
}

// =============================================================================
// CORE LOGGING
// =============================================================================

function createBaseLog(level: LogLevel, message: string): BaseLogEntry {
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
export function log(level: LogLevel, message: string, data?: Record<string, any>): void {
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

export function logDebug(message: string, data?: Record<string, any>): void {
    log('DEBUG', message, data);
}

export function logInfo(message: string, data?: Record<string, any>): void {
    log('INFO', message, data);
}

export function logWarn(message: string, data?: Record<string, any>): void {
    log('WARN', message, data);
}

export function logError(message: string, data?: Record<string, any>): void {
    log('ERROR', message, data);
}

// =============================================================================
// TERMINAL EVENT LOGGING
// =============================================================================

/**
 * Log a terminal verification event
 */
export function logTerminalVerification(params: {
    contractId: string;
    platform: string;
    riskTier: string;
    outcome: 'SUCCEEDED' | 'FAILED';
    retryable: boolean;
    category: string;
}): void {
    const entry: TerminalEventLogEntry = {
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
export function logTerminalSettlement(params: {
    contractId: string;
    platform: string;
    riskTier: string;
    outcome: 'SUCCESS' | 'FAILURE';
    retryable: boolean;
    category: string;
}): void {
    const entry: TerminalEventLogEntry = {
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
export function logReceiptIssued(params: {
    contractId: string;
    platform: string;
    riskTier: string;
    settlementOutcome: 'SUCCESS' | 'FAILURE';
}): void {
    const entry: TerminalEventLogEntry = {
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
export function logJobStart(jobType: string): void {
    log('INFO', `Job started: ${jobType}`, { jobType });
}

/**
 * Log job completion
 */
export function logJobComplete(jobType: string, result: {
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
    durationMs: number;
}): void {
    log('INFO', `Job completed: ${jobType}`, {
        jobType,
        ...result,
    });
}

/**
 * Log job error
 */
export function logJobError(jobType: string, error: string): void {
    log('ERROR', `Job error: ${jobType}`, { jobType, error });
}

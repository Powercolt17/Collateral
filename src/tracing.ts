/**
 * Tracing Utilities
 * 
 * High-level span creation for contract lifecycle operations.
 * Uses OTel API for traces with contract-specific attributes.
 * 
 * Falls back to noop when OTel packages not installed.
 */

// =============================================================================
// CONDITIONAL OTEL IMPORT
// =============================================================================

let trace: any;
let SpanKind: any = { INTERNAL: 0, CLIENT: 1 };
let SpanStatusCode: any = { OK: 0, ERROR: 1 };

try {
    const otelApi = await import('@opentelemetry/api');
    trace = otelApi.trace;
    SpanKind = otelApi.SpanKind;
    SpanStatusCode = otelApi.SpanStatusCode;
} catch {
    // OTel not installed - use noop
    const noopSpan = {
        setAttribute: () => { },
        setStatus: () => { },
        recordException: () => { },
        addEvent: () => { },
        end: () => { },
        spanContext: () => ({ traceId: '', spanId: '' }),
    };
    const noopTracer = {
        startActiveSpan: (_name: string, _opts: any, fn: any) => fn(noopSpan),
    };
    trace = {
        getTracer: () => noopTracer,
        getActiveSpan: () => noopSpan,
    };
}

// =============================================================================
// TRACER
// =============================================================================

const tracer = trace.getTracer('collateral-backend', '1.0.0');

// =============================================================================
// SPAN ATTRIBUTE TYPES
// =============================================================================

export interface ContractAttributes {
    contractId: string;
    platform?: string;
    metricType?: string;
    riskTier?: string;
    derivedStateBefore?: string;
    derivedStateAfter?: string;
}

export interface OutcomeAttributes {
    success: boolean;
    outcome?: string;
    retryable?: boolean;
    errorCategory?: string;
    errorMessage?: string;
}

export interface AdapterAttributes {
    adapterName: string;
    apiStatus?: number;
}

// =============================================================================
// SPAN CREATION
// =============================================================================

/**
 * Create a span for contract creation
 */
export async function spanCreateContract<T>(
    attrs: ContractAttributes,
    fn: () => Promise<T>
): Promise<T> {
    return tracer.startActiveSpan('contract.create', {
        kind: SpanKind.INTERNAL,
        attributes: {
            'contract.id': attrs.contractId,
            'contract.platform': attrs.platform,
            'contract.metricType': attrs.metricType,
            'contract.riskTier': attrs.riskTier,
        },
    }, async (span) => {
        try {
            const result = await fn();
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (err: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        } finally {
            span.end();
        }
    });
}

/**
 * Create a span for verification
 */
export async function spanVerifyContract<T>(
    attrs: ContractAttributes,
    fn: () => Promise<T & OutcomeAttributes>
): Promise<T & OutcomeAttributes> {
    return tracer.startActiveSpan('contract.verify', {
        kind: SpanKind.INTERNAL,
        attributes: {
            'contract.id': attrs.contractId,
            'contract.platform': attrs.platform,
            'contract.metricType': attrs.metricType,
            'contract.riskTier': attrs.riskTier,
            'contract.state.before': attrs.derivedStateBefore,
        },
    }, async (span) => {
        try {
            const result = await fn();
            span.setAttribute('contract.state.after', attrs.derivedStateAfter || 'unknown');
            span.setAttribute('verification.success', result.success);
            span.setAttribute('verification.outcome', result.outcome || 'unknown');
            span.setAttribute('verification.retryable', result.retryable || false);
            if (result.errorCategory) {
                span.setAttribute('error.category', result.errorCategory);
            }
            span.setStatus({ code: result.success ? SpanStatusCode.OK : SpanStatusCode.ERROR });
            return result;
        } catch (err: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        } finally {
            span.end();
        }
    });
}

/**
 * Create a span for settlement
 */
export async function spanSettleContract<T>(
    attrs: ContractAttributes,
    fn: () => Promise<T & OutcomeAttributes>
): Promise<T & OutcomeAttributes> {
    return tracer.startActiveSpan('contract.settle', {
        kind: SpanKind.INTERNAL,
        attributes: {
            'contract.id': attrs.contractId,
            'contract.platform': attrs.platform,
            'contract.metricType': attrs.metricType,
            'contract.riskTier': attrs.riskTier,
            'contract.state.before': attrs.derivedStateBefore,
        },
    }, async (span) => {
        try {
            const result = await fn();
            span.setAttribute('contract.state.after', attrs.derivedStateAfter || 'unknown');
            span.setAttribute('settlement.success', result.success);
            span.setAttribute('settlement.outcome', result.outcome || 'unknown');
            span.setAttribute('settlement.retryable', result.retryable || false);
            if (result.errorCategory) {
                span.setAttribute('error.category', result.errorCategory);
            }
            span.setStatus({ code: result.success ? SpanStatusCode.OK : SpanStatusCode.ERROR });
            return result;
        } catch (err: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        } finally {
            span.end();
        }
    });
}

/**
 * Create a span for adapter calls (GitHub, Stripe, X)
 */
export async function spanAdapterCall<T>(
    adapterName: string,
    platform: string,
    fn: () => Promise<T>
): Promise<T> {
    return tracer.startActiveSpan(`adapter.${adapterName}`, {
        kind: SpanKind.CLIENT,
        attributes: {
            'adapter.name': adapterName,
            'adapter.platform': platform,
        },
    }, async (span) => {
        try {
            const result = await fn();
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (err: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        } finally {
            span.end();
        }
    });
}

/**
 * Create a span for job execution
 */
export async function spanJob<T>(
    jobType: 'VERIFY' | 'SETTLE' | 'RECONCILE',
    fn: () => Promise<T>
): Promise<T> {
    return tracer.startActiveSpan(`job.${jobType.toLowerCase()}`, {
        kind: SpanKind.INTERNAL,
        attributes: {
            'job.type': jobType,
        },
    }, async (span) => {
        try {
            const result = await fn();
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (err: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        } finally {
            span.end();
        }
    });
}

/**
 * Create a span for execution flow
 */
export async function spanExecution<T>(
    eventType: string,
    attrs: ContractAttributes,
    fn: () => Promise<T>
): Promise<T> {
    return tracer.startActiveSpan(`execution.${eventType.toLowerCase()}`, {
        kind: SpanKind.INTERNAL,
        attributes: {
            'contract.id': attrs.contractId,
            'contract.platform': attrs.platform,
            'execution.eventType': eventType,
        },
    }, async (span) => {
        try {
            const result = await fn();
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (err: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        } finally {
            span.end();
        }
    });
}

// =============================================================================
// CURRENT SPAN UTILITIES
// =============================================================================

/**
 * Get current span (for adding attributes/events)
 */
export function getCurrentSpan(): Span | undefined {
    return trace.getActiveSpan();
}

/**
 * Get current trace ID for log correlation
 */
export function getCurrentTraceId(): string | undefined {
    const span = trace.getActiveSpan();
    if (span) {
        const spanContext = span.spanContext();
        return spanContext.traceId;
    }
    return undefined;
}

/**
 * Get current span ID for log correlation
 */
export function getCurrentSpanId(): string | undefined {
    const span = trace.getActiveSpan();
    if (span) {
        const spanContext = span.spanContext();
        return spanContext.spanId;
    }
    return undefined;
}

/**
 * Add event to current span
 */
export function addSpanEvent(name: string, attributes?: Record<string, string | number | boolean>): void {
    const span = trace.getActiveSpan();
    if (span) {
        span.addEvent(name, attributes);
    }
}

/**
 * Set attribute on current span
 */
export function setSpanAttribute(key: string, value: string | number | boolean): void {
    const span = trace.getActiveSpan();
    if (span) {
        span.setAttribute(key, value);
    }
}

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
let trace;
let SpanKind = { INTERNAL: 0, CLIENT: 1 };
let SpanStatusCode = { OK: 0, ERROR: 1 };
try {
    const otelApi = await import('@opentelemetry/api');
    trace = otelApi.trace;
    SpanKind = otelApi.SpanKind;
    SpanStatusCode = otelApi.SpanStatusCode;
}
catch {
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
        startActiveSpan: (_name, _opts, fn) => fn(noopSpan),
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
// SPAN CREATION
// =============================================================================
/**
 * Create a span for contract creation
 */
export async function spanCreateContract(attrs, fn) {
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
        }
        catch (err) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        }
        finally {
            span.end();
        }
    });
}
/**
 * Create a span for verification
 */
export async function spanVerifyContract(attrs, fn) {
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
        }
        catch (err) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        }
        finally {
            span.end();
        }
    });
}
/**
 * Create a span for settlement
 */
export async function spanSettleContract(attrs, fn) {
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
        }
        catch (err) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        }
        finally {
            span.end();
        }
    });
}
/**
 * Create a span for adapter calls (GitHub, Stripe, X)
 */
export async function spanAdapterCall(adapterName, platform, fn) {
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
        }
        catch (err) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        }
        finally {
            span.end();
        }
    });
}
/**
 * Create a span for job execution
 */
export async function spanJob(jobType, fn) {
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
        }
        catch (err) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        }
        finally {
            span.end();
        }
    });
}
/**
 * Create a span for execution flow
 */
export async function spanExecution(eventType, attrs, fn) {
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
        }
        catch (err) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
            throw err;
        }
        finally {
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
export function getCurrentSpan() {
    return trace.getActiveSpan();
}
/**
 * Get current trace ID for log correlation
 */
export function getCurrentTraceId() {
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
export function getCurrentSpanId() {
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
export function addSpanEvent(name, attributes) {
    const span = trace.getActiveSpan();
    if (span) {
        span.addEvent(name, attributes);
    }
}
/**
 * Set attribute on current span
 */
export function setSpanAttribute(key, value) {
    const span = trace.getActiveSpan();
    if (span) {
        span.setAttribute(key, value);
    }
}
//# sourceMappingURL=tracing.js.map
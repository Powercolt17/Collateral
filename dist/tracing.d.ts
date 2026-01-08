/**
 * Tracing Utilities
 *
 * High-level span creation for contract lifecycle operations.
 * Uses OTel API for traces with contract-specific attributes.
 *
 * Falls back to noop when OTel packages not installed.
 */
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
/**
 * Create a span for contract creation
 */
export declare function spanCreateContract<T>(attrs: ContractAttributes, fn: () => Promise<T>): Promise<T>;
/**
 * Create a span for verification
 */
export declare function spanVerifyContract<T>(attrs: ContractAttributes, fn: () => Promise<T & OutcomeAttributes>): Promise<T & OutcomeAttributes>;
/**
 * Create a span for settlement
 */
export declare function spanSettleContract<T>(attrs: ContractAttributes, fn: () => Promise<T & OutcomeAttributes>): Promise<T & OutcomeAttributes>;
/**
 * Create a span for adapter calls (GitHub, Stripe, X)
 */
export declare function spanAdapterCall<T>(adapterName: string, platform: string, fn: () => Promise<T>): Promise<T>;
/**
 * Create a span for job execution
 */
export declare function spanJob<T>(jobType: 'VERIFY' | 'SETTLE' | 'RECONCILE', fn: () => Promise<T>): Promise<T>;
/**
 * Create a span for execution flow
 */
export declare function spanExecution<T>(eventType: string, attrs: ContractAttributes, fn: () => Promise<T>): Promise<T>;
/**
 * Get current span (for adding attributes/events)
 */
export declare function getCurrentSpan(): Span | undefined;
/**
 * Get current trace ID for log correlation
 */
export declare function getCurrentTraceId(): string | undefined;
/**
 * Get current span ID for log correlation
 */
export declare function getCurrentSpanId(): string | undefined;
/**
 * Add event to current span
 */
export declare function addSpanEvent(name: string, attributes?: Record<string, string | number | boolean>): void;
/**
 * Set attribute on current span
 */
export declare function setSpanAttribute(key: string, value: string | number | boolean): void;

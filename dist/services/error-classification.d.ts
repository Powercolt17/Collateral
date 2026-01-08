/**
 * Error Classification Utility
 *
 * Classifies errors as retryable or non-retryable for verification/settlement operations.
 *
 * NON-RETRYABLE CATEGORIES:
 * - CONFIG: True permanent config failures (missing account, unsupported platform)
 * - RESOURCE_MISSING: Resource deleted/inaccessible AFTER execution (forfeit path)
 *
 * Everything else defaults to RETRYABLE (fail-closed but not terminal).
 */
export interface ClassifiedError {
    retryable: boolean;
    category: 'RATE_LIMIT' | 'SERVER_ERROR' | 'NETWORK' | 'TIMEOUT' | 'CONFIG' | 'RESOURCE_MISSING' | 'UNKNOWN';
    originalError: Error;
}
/**
 * Determine if an error is retryable (transient) or non-retryable (permanent)
 */
export declare function classifyError(err: unknown): ClassifiedError;
/**
 * Simple helper for quick retryable check
 */
export declare function isRetryableError(err: unknown): boolean;

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
// Exact patterns that indicate TRUE permanent config errors (non-retryable)
const PERMANENT_CONFIG_PATTERNS = [
    'no connected stripe account',
    'no connected github account',
    'no connected account',
    'missing connected account',
    'platform not supported',
    'metric not supported',
    'unsupported platform',
    'unsupported metric',
    'invalid condition',
    'missing condition',
    'missing baseline',
    'principal user not found',
    'contract not found',
];
// Patterns indicating resource was deleted/inaccessible AFTER execution
// This is a forfeit condition: user deleted repo or revoked access
const RESOURCE_MISSING_PATTERNS = [
    'resource_missing:', // Explicit prefix from adapters
    'repo not found',
    'repo inaccessible',
    'repository not found',
    'repository inaccessible',
    'access revoked',
    'permission denied after execution',
    'resource deleted',
];
/**
 * Determine if an error is retryable (transient) or non-retryable (permanent)
 */
export function classifyError(err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const message = error.message.toLowerCase();
    // RESOURCE_MISSING: Resource deleted/inaccessible (forfeit path, non-retryable)
    for (const pattern of RESOURCE_MISSING_PATTERNS) {
        if (message.includes(pattern)) {
            return { retryable: false, category: 'RESOURCE_MISSING', originalError: error };
        }
    }
    // Rate limit errors (retryable)
    if (message.includes('rate limit') ||
        message.includes('rate limited') ||
        message.includes('too many requests') ||
        message.includes('429') ||
        message.includes('retry after')) {
        return { retryable: true, category: 'RATE_LIMIT', originalError: error };
    }
    // Server errors (retryable)
    if (message.includes('500') ||
        message.includes('502') ||
        message.includes('503') ||
        message.includes('504') ||
        message.includes('server error') ||
        message.includes('internal server error') ||
        message.includes('bad gateway') ||
        message.includes('service unavailable')) {
        return { retryable: true, category: 'SERVER_ERROR', originalError: error };
    }
    // Network errors (retryable)
    if (message.includes('network') ||
        message.includes('econnrefused') ||
        message.includes('econnreset') ||
        message.includes('etimedout') ||
        message.includes('enotfound') ||
        message.includes('fetch failed') ||
        message.includes('socket hang up')) {
        return { retryable: true, category: 'NETWORK', originalError: error };
    }
    // Timeout errors (retryable)
    if (message.includes('timeout') ||
        message.includes('timed out') ||
        message.includes('aborted')) {
        return { retryable: true, category: 'TIMEOUT', originalError: error };
    }
    // TRUE PERMANENT CONFIG ERRORS ONLY (non-retryable)
    // These are situations that CANNOT be fixed by retrying
    for (const pattern of PERMANENT_CONFIG_PATTERNS) {
        if (message.includes(pattern)) {
            return { retryable: false, category: 'CONFIG', originalError: error };
        }
    }
    // Default: assume RETRYABLE (fail-closed pattern)
    // Better to retry than to permanently fail on unknown errors
    // This protects users from losing payouts due to transient failures
    return { retryable: true, category: 'UNKNOWN', originalError: error };
}
/**
 * Simple helper for quick retryable check
 */
export function isRetryableError(err) {
    return classifyError(err).retryable;
}
//# sourceMappingURL=error-classification.js.map
/**
 * X API Rate Limit Circuit Breaker
 *
 * Global singleton that tracks X API rate limit state.
 * Prevents any X API calls while rate limited.
 *
 * USAGE:
 * - Before X API call: check isGloballyRateLimited()
 * - After 429 with resetAt: call setGlobalRateLimit(resetAt)
 */
/**
 * Check if X API is globally rate limited.
 * Returns null if not rate limited, or { resetAt, retryAfterSeconds } if limited.
 */
export declare function checkGlobalRateLimit(): {
    resetAt: number;
    retryAfterSeconds: number;
} | null;
/**
 * Set global rate limit. Called when X API returns 429.
 * Uses max() to avoid reducing an existing longer limit.
 */
export declare function setGlobalRateLimit(resetAtEpochSec: number): void;
/**
 * Get current rate limit state (for debugging/status endpoints)
 */
export declare function getGlobalRateLimitState(): {
    lockedUntil: number | null;
    isLocked: boolean;
};
/**
 * Clear rate limit (for testing only)
 */
export declare function clearGlobalRateLimit(): void;

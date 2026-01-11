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

// =============================================================================
// GLOBAL STATE (in-memory, shared across all requests)
// =============================================================================

let xGlobalRateLimitedUntilEpochSec: number | null = null;

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Check if X API is globally rate limited.
 * Returns null if not rate limited, or { resetAt, retryAfterSeconds } if limited.
 */
export function checkGlobalRateLimit(): { resetAt: number; retryAfterSeconds: number } | null {
    if (xGlobalRateLimitedUntilEpochSec === null) {
        return null;
    }

    const nowSec = Math.floor(Date.now() / 1000);
    if (nowSec >= xGlobalRateLimitedUntilEpochSec) {
        // Rate limit has expired, clear it
        xGlobalRateLimitedUntilEpochSec = null;
        console.log('[X Circuit] Rate limit expired, circuit CLOSED');
        return null;
    }

    const remaining = xGlobalRateLimitedUntilEpochSec - nowSec;
    console.log(`[X Circuit] OPEN - Rate limited for ${remaining}s more`);
    return {
        resetAt: xGlobalRateLimitedUntilEpochSec,
        retryAfterSeconds: Math.max(1, remaining),
    };
}

/**
 * Set global rate limit. Called when X API returns 429.
 * Uses max() to avoid reducing an existing longer limit.
 */
export function setGlobalRateLimit(resetAtEpochSec: number): void {
    const current = xGlobalRateLimitedUntilEpochSec || 0;
    xGlobalRateLimitedUntilEpochSec = Math.max(current, resetAtEpochSec);
    const remaining = xGlobalRateLimitedUntilEpochSec - Math.floor(Date.now() / 1000);
    console.log(`[X Circuit] OPENED - Blocked until ${xGlobalRateLimitedUntilEpochSec} (${remaining}s)`);
}

/**
 * Get current rate limit state (for debugging/status endpoints)
 */
export function getGlobalRateLimitState(): { lockedUntil: number | null; isLocked: boolean } {
    const check = checkGlobalRateLimit();
    return {
        lockedUntil: xGlobalRateLimitedUntilEpochSec,
        isLocked: check !== null,
    };
}

/**
 * Clear rate limit (for testing only)
 */
export function clearGlobalRateLimit(): void {
    xGlobalRateLimitedUntilEpochSec = null;
    console.log('[X Circuit] Manually cleared');
}

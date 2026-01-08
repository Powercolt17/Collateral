/**
 * X Account Eligibility & Health
 *
 * SECURITY-CRITICAL: Enforces hard eligibility gates for X contracts.
 *
 * ELIGIBILITY RULES (ALL must pass):
 * - Followers >= 10,000
 * - Account age >= 180 days
 * - Protected = false
 * - tweet_count >= 50
 *
 * INVARIANTS:
 * - No partial eligibility - all gates must pass
 * - Fails closed with explicit reason codes
 * - Never fabricates data outside test mode
 */
// =============================================================================
// CONSTANTS (Hardcoded thresholds - not configurable for security)
// =============================================================================
export const X_ELIGIBILITY_THRESHOLDS = {
    MIN_FOLLOWERS: 10_000,
    MIN_ACCOUNT_AGE_DAYS: 180,
    MIN_TWEET_COUNT: 50,
};
export const X_DELTA_FLOOR = {
    ABSOLUTE_MIN: 500,
    PERCENTAGE: 0.05, // 5%
};
// =============================================================================
// ELIGIBILITY CHECK
// =============================================================================
/**
 * Check if an X account is eligible for follower contracts.
 *
 * FAILS CLOSED: Returns ineligible with explicit reason if any gate fails.
 */
export function checkXEligibility(health) {
    const now = new Date();
    const createdAt = new Date(health.createdAt);
    const accountAgeDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const details = {
        followersCount: health.publicMetrics.followersCount,
        accountAgeDays,
        protected: health.protected,
        tweetCount: health.publicMetrics.tweetCount,
        minimums: {
            followers: X_ELIGIBILITY_THRESHOLDS.MIN_FOLLOWERS,
            accountAgeDays: X_ELIGIBILITY_THRESHOLDS.MIN_ACCOUNT_AGE_DAYS,
            tweets: X_ELIGIBILITY_THRESHOLDS.MIN_TWEET_COUNT,
        },
    };
    // Gate 1: Minimum followers
    if (health.publicMetrics.followersCount < X_ELIGIBILITY_THRESHOLDS.MIN_FOLLOWERS) {
        return {
            eligible: false,
            reasonCode: 'X_INELIGIBLE_MIN_FOLLOWERS',
            details,
        };
    }
    // Gate 2: Account age
    if (accountAgeDays < X_ELIGIBILITY_THRESHOLDS.MIN_ACCOUNT_AGE_DAYS) {
        return {
            eligible: false,
            reasonCode: 'X_INELIGIBLE_ACCOUNT_AGE',
            details,
        };
    }
    // Gate 3: Not protected
    if (health.protected) {
        return {
            eligible: false,
            reasonCode: 'X_INELIGIBLE_PROTECTED',
            details,
        };
    }
    // Gate 4: Minimum activity
    if (health.publicMetrics.tweetCount < X_ELIGIBILITY_THRESHOLDS.MIN_TWEET_COUNT) {
        return {
            eligible: false,
            reasonCode: 'X_INELIGIBLE_LOW_ACTIVITY',
            details,
        };
    }
    // All gates passed
    return {
        eligible: true,
        details,
    };
}
// =============================================================================
// DELTA FLOOR CALCULATION
// =============================================================================
/**
 * Calculate the minimum absolute follower gain required.
 *
 * Formula: max(500, baselineFollowers * 0.05)
 *
 * This prevents farming via tiny percentage gains on large accounts.
 */
export function calculateDeltaFloor(baselineFollowers) {
    const percentageDelta = Math.floor(baselineFollowers * X_DELTA_FLOOR.PERCENTAGE);
    return Math.max(X_DELTA_FLOOR.ABSOLUTE_MIN, percentageDelta);
}
/**
 * Validate that a threshold meets delta floor requirements.
 *
 * @param baselineFollowers Current follower count
 * @param targetThreshold The target follower count in the contract
 * @returns Whether the delta meets or exceeds the floor
 */
export function validateDeltaFloor(baselineFollowers, targetThreshold) {
    const requiredDelta = calculateDeltaFloor(baselineFollowers);
    const actualDelta = targetThreshold - baselineFollowers;
    return {
        valid: actualDelta >= requiredDelta,
        requiredDelta,
        actualDelta,
    };
}
/**
 * Create a frozen identity binding for execution.
 * This data is immutable after execution.
 */
export function createFrozenBinding(xUserId, username, baselineFollowers, accountHealth) {
    return {
        xUserId,
        username,
        baselineFollowers,
        deltaFloor: calculateDeltaFloor(baselineFollowers),
        accountHealth,
        frozenAtUtc: new Date().toISOString(),
    };
}
/**
 * Evaluate if samples meet the threshold with required consecutive passes.
 *
 * For a contract to pass:
 * - At least `requiredConsecutive` consecutive samples must meet threshold
 */
export function evaluateSamples(samples, threshold, operator, requiredConsecutive = 3) {
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    for (const sample of samples) {
        const meets = evaluateThreshold(sample.followers, operator, threshold);
        if (meets) {
            currentConsecutive++;
            maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        }
        else {
            currentConsecutive = 0;
        }
    }
    return {
        pass: maxConsecutive >= requiredConsecutive,
        consecutivePassCount: maxConsecutive,
    };
}
function evaluateThreshold(value, operator, threshold) {
    switch (operator) {
        case 'GTE': return value >= threshold;
        case 'GT': return value > threshold;
        case 'LTE': return value <= threshold;
        case 'LT': return value < threshold;
        case 'EQ': return value === threshold;
        default: return false;
    }
}
//# sourceMappingURL=x-eligibility.js.map
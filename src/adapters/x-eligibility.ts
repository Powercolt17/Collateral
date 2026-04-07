/**
 * X Account Eligibility & Health
 * 
 * SECURITY-CRITICAL: Enforces hard eligibility gates for X contracts.
 * 
 * ELIGIBILITY RULES (ALL must pass):
 * - Followers >= 1,000
 * - Account age >= 90 days
 * - Protected = false
 * - tweet_count >= 50
 * 
 * INVARIANTS:
 * - No partial eligibility - all gates must pass
 * - Fails closed with explicit reason codes
 * - Never fabricates data outside test mode
 */

// =============================================================================
// TYPES
// =============================================================================

export interface XAccountHealth {
    createdAt: string;           // ISO timestamp of account creation
    protected: boolean;          // Is account protected (private)?
    publicMetrics: {
        followersCount: number;
        followingCount: number;
        tweetCount: number;
        listedCount: number;
    };
    measuredAtUtc: string;       // When this snapshot was taken
}

export type XIneligibilityReason =
    | 'X_INELIGIBLE_MIN_FOLLOWERS'
    | 'X_INELIGIBLE_ACCOUNT_AGE'
    | 'X_INELIGIBLE_PROTECTED'
    | 'X_INELIGIBLE_LOW_ACTIVITY';

export interface XEligibilityResult {
    eligible: boolean;
    reasonCode?: XIneligibilityReason;
    details: {
        followersCount: number;
        accountAgeDays: number;
        protected: boolean;
        tweetCount: number;
        minimums: {
            followers: number;
            accountAgeDays: number;
            tweets: number;
        };
    };
}

// =============================================================================
// CONSTANTS — PRODUCTION THRESHOLDS
// =============================================================================

export const X_ELIGIBILITY_THRESHOLDS = {
    MIN_FOLLOWERS: 1_000,        // 1,000 followers minimum
    MIN_ACCOUNT_AGE_DAYS: 90,    // 90 days minimum
    MIN_TWEET_COUNT: 50,         // 50 tweets minimum
} as const;

export const X_DELTA_FLOOR = {
    ABSOLUTE_MIN: 100,     // Minimum 100 new followers required
    PERCENTAGE: 0.05,      // Or 5% of baseline, whichever is higher
} as const;

// =============================================================================
// ELIGIBILITY CHECK
// =============================================================================

/**
 * Check if an X account is eligible for follower contracts.
 * 
 * FAILS CLOSED: Returns ineligible with explicit reason if any gate fails.
 */
export function checkXEligibility(health: XAccountHealth): XEligibilityResult {
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
export function calculateDeltaFloor(baselineFollowers: number): number {
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
export function validateDeltaFloor(
    baselineFollowers: number,
    targetThreshold: number
): { valid: boolean; requiredDelta: number; actualDelta: number } {
    const requiredDelta = calculateDeltaFloor(baselineFollowers);
    const actualDelta = targetThreshold - baselineFollowers;

    return {
        valid: actualDelta >= requiredDelta,
        requiredDelta,
        actualDelta,
    };
}

// =============================================================================
// FROZEN IDENTITY BINDING
// =============================================================================

export interface FrozenXBinding {
    xUserId: string;
    username: string;
    baselineFollowers: number;
    deltaFloor: number;
    accountHealth: XAccountHealth;
    frozenAtUtc: string;
}

/**
 * Create a frozen identity binding for execution.
 * This data is immutable after execution.
 */
export function createFrozenBinding(
    xUserId: string,
    username: string,
    baselineFollowers: number,
    accountHealth: XAccountHealth
): FrozenXBinding {
    return {
        xUserId,
        username,
        baselineFollowers,
        deltaFloor: calculateDeltaFloor(baselineFollowers),
        accountHealth,
        frozenAtUtc: new Date().toISOString(),
    };
}

// =============================================================================
// SAMPLE EVIDENCE TYPES (for multi-sample verification)
// =============================================================================

export interface FollowerSample {
    timestampUtc: string;
    followers: number;
}

export interface VerificationEvidence {
    samples: FollowerSample[];
    consecutivePassCount: number;
    requiredConsecutive: number;
    threshold: number;
    baselineFollowers: number;
    deltaFloor: number;
    pass: boolean;
}

/**
 * Evaluate if samples meet the threshold with required consecutive passes.
 * 
 * For a contract to pass:
 * - At least `requiredConsecutive` consecutive samples must meet threshold
 */
export function evaluateSamples(
    samples: FollowerSample[],
    threshold: number,
    operator: string,
    requiredConsecutive: number = 3
): { pass: boolean; consecutivePassCount: number } {
    let maxConsecutive = 0;
    let currentConsecutive = 0;

    for (const sample of samples) {
        const meets = evaluateThreshold(sample.followers, operator, threshold);
        if (meets) {
            currentConsecutive++;
            maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else {
            currentConsecutive = 0;
        }
    }

    return {
        pass: maxConsecutive >= requiredConsecutive,
        consecutivePassCount: maxConsecutive,
    };
}

function evaluateThreshold(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
        case 'GTE': return value >= threshold;
        case 'GT': return value > threshold;
        case 'LTE': return value <= threshold;
        case 'LT': return value < threshold;
        case 'EQ': return value === threshold;
        default: return false;
    }
}

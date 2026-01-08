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
export interface XAccountHealth {
    createdAt: string;
    protected: boolean;
    publicMetrics: {
        followersCount: number;
        followingCount: number;
        tweetCount: number;
        listedCount: number;
    };
    measuredAtUtc: string;
}
export type XIneligibilityReason = 'X_INELIGIBLE_MIN_FOLLOWERS' | 'X_INELIGIBLE_ACCOUNT_AGE' | 'X_INELIGIBLE_PROTECTED' | 'X_INELIGIBLE_LOW_ACTIVITY';
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
export declare const X_ELIGIBILITY_THRESHOLDS: {
    readonly MIN_FOLLOWERS: 10000;
    readonly MIN_ACCOUNT_AGE_DAYS: 180;
    readonly MIN_TWEET_COUNT: 50;
};
export declare const X_DELTA_FLOOR: {
    readonly ABSOLUTE_MIN: 500;
    readonly PERCENTAGE: 0.05;
};
/**
 * Check if an X account is eligible for follower contracts.
 *
 * FAILS CLOSED: Returns ineligible with explicit reason if any gate fails.
 */
export declare function checkXEligibility(health: XAccountHealth): XEligibilityResult;
/**
 * Calculate the minimum absolute follower gain required.
 *
 * Formula: max(500, baselineFollowers * 0.05)
 *
 * This prevents farming via tiny percentage gains on large accounts.
 */
export declare function calculateDeltaFloor(baselineFollowers: number): number;
/**
 * Validate that a threshold meets delta floor requirements.
 *
 * @param baselineFollowers Current follower count
 * @param targetThreshold The target follower count in the contract
 * @returns Whether the delta meets or exceeds the floor
 */
export declare function validateDeltaFloor(baselineFollowers: number, targetThreshold: number): {
    valid: boolean;
    requiredDelta: number;
    actualDelta: number;
};
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
export declare function createFrozenBinding(xUserId: string, username: string, baselineFollowers: number, accountHealth: XAccountHealth): FrozenXBinding;
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
export declare function evaluateSamples(samples: FollowerSample[], threshold: number, operator: string, requiredConsecutive?: number): {
    pass: boolean;
    consecutivePassCount: number;
};

/**
 * Platform Integration Roadmap & Oracle Policy
 *
 * DESIGN INVARIANT — Locked as policy, not code constants
 *
 * Collateral is a self-betting, capital-enforced system.
 * Platforms are verification rails, not features.
 * We only integrate platforms that support binary, time-bounded, baseline-scaled outcomes.
 */
/**
 * All platform integrations MUST support:
 *
 * 1. BASELINE SNAPSHOT
 *    - Capture starting metrics at contract creation/funding
 *
 * 2. SCALED TARGET CALCULATION
 *    - Targets scale relative to baseline, not raw numbers
 *
 * 3. BINARY EVALUATION AT DEADLINE
 *    - Pass or fail only (no partial credit)
 *
 * 4. EVIDENCE PAYLOAD
 *    - Verifiable data stored with contract receipt
 *
 * 5. STRICT VERIFICATION
 *    - No rounding, no discretion, no appeals
 *
 * Do NOT integrate platforms that cannot support all five.
 */
export type PlatformTier = 'TIER_1' | 'TIER_2' | 'TIER_3' | 'AVOID';
export type Platform = 'X' | 'STRIPE' | 'GITHUB' | 'YOUTUBE' | 'TIKTOK' | 'SHOPIFY' | 'SUBSTACK' | 'APP_STORE' | 'PLAY_STORE' | 'NOTION' | 'LINEAR';
export interface PlatformPolicy {
    platform: Platform;
    tier: PlatformTier;
    displayName: string;
    rationale: string[];
    risks: string[];
    supportedMetrics: MetricPolicy[];
    baselineScalingRules: BaselineScalingRule[];
    constraints: PlatformConstraints;
}
export interface MetricPolicy {
    metricType: MetricType;
    displayName: string;
    description: string;
    baselineCalculation: 'snapshot' | 'trailing_avg' | 'median';
    baselinePeriodDays?: number;
    scope: 'account' | 'channel' | 'repository' | 'store';
    avoid?: string[];
}
export interface BaselineScalingRule {
    metricType: MetricType;
    formula: string;
    factors: string[];
}
export interface PlatformConstraints {
    requiresOAuth: boolean;
    apiRateLimits?: string;
    reportingDelay?: string;
    minimumBaseline?: Record<string, number>;
}
export type MetricType = 'FOLLOWERS' | 'IMPRESSIONS' | 'ENGAGEMENT_RATE' | 'VIEWS' | 'SUBSCRIBERS' | 'REVENUE' | 'MRR' | 'CHARGE_VOLUME' | 'GROSS_SALES' | 'ORDER_COUNT' | 'COMMITS' | 'PRS_MERGED' | 'REPOS_CREATED' | 'STARS_GAINED' | 'DOWNLOADS' | 'TASKS_COMPLETED' | 'PROJECTS_SHIPPED';
export declare const X_POLICY: PlatformPolicy;
export declare const STRIPE_POLICY: PlatformPolicy;
export declare const GITHUB_POLICY: PlatformPolicy;
export declare const YOUTUBE_POLICY: PlatformPolicy;
export declare const TIKTOK_POLICY: PlatformPolicy;
export declare const SHOPIFY_POLICY: PlatformPolicy;
export declare const TIER_3_PLATFORMS: Platform[];
export declare const AVOID_PLATFORMS: {
    name: string;
    reason: string;
}[];
export declare const PLATFORM_POLICIES: Record<Platform, PlatformPolicy | null>;
export declare function getPlatformPolicy(platform: Platform): PlatformPolicy | null;
export declare function getPlatformTier(platform: Platform): PlatformTier;
export declare function isTier1Platform(platform: Platform): boolean;

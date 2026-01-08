/**
 * Platform Integration Roadmap & Oracle Policy
 * 
 * DESIGN INVARIANT — Locked as policy, not code constants
 * 
 * Collateral is a self-betting, capital-enforced system.
 * Platforms are verification rails, not features.
 * We only integrate platforms that support binary, time-bounded, baseline-scaled outcomes.
 */

// =====================================================
// CORE INVARIANTS (NON-NEGOTIABLE)
// =====================================================

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

// =====================================================
// PLATFORM TIER DEFINITIONS
// =====================================================

export type PlatformTier = 'TIER_1' | 'TIER_2' | 'TIER_3' | 'AVOID';

export type Platform =
    // Tier 1 - Ship First
    | 'X'
    | 'STRIPE'
    | 'GITHUB'
    // Tier 2 - Handle Carefully
    | 'YOUTUBE'
    | 'TIKTOK'
    | 'SHOPIFY'
    // Tier 3 - Add Later
    | 'SUBSTACK'
    | 'APP_STORE'
    | 'PLAY_STORE'
    | 'NOTION'
    | 'LINEAR';

export interface PlatformPolicy {
    platform: Platform;
    tier: PlatformTier;
    displayName: string;

    // Why we integrate this platform
    rationale: string[];

    // Known risks and mitigations
    risks: string[];

    // Supported contract types
    supportedMetrics: MetricPolicy[];

    // Baseline scaling rules
    baselineScalingRules: BaselineScalingRule[];

    // Platform-specific constraints
    constraints: PlatformConstraints;
}

export interface MetricPolicy {
    metricType: MetricType;
    displayName: string;
    description: string;

    // How baseline is calculated
    baselineCalculation: 'snapshot' | 'trailing_avg' | 'median';
    baselinePeriodDays?: number;

    // Aggregation scope
    scope: 'account' | 'channel' | 'repository' | 'store';

    // Avoid patterns
    avoid?: string[];
}

export interface BaselineScalingRule {
    metricType: MetricType;
    formula: string;  // Human-readable formula
    factors: string[];  // Variables used in calculation
}

export interface PlatformConstraints {
    requiresOAuth: boolean;
    apiRateLimits?: string;
    reportingDelay?: string;
    minimumBaseline?: Record<string, number>;
}

export type MetricType =
    // Social metrics
    | 'FOLLOWERS'
    | 'IMPRESSIONS'
    | 'ENGAGEMENT_RATE'
    | 'VIEWS'
    | 'SUBSCRIBERS'
    // Revenue metrics
    | 'REVENUE'
    | 'MRR'
    | 'CHARGE_VOLUME'
    | 'GROSS_SALES'
    | 'ORDER_COUNT'
    // Developer metrics
    | 'COMMITS'
    | 'PRS_MERGED'
    | 'REPOS_CREATED'
    | 'STARS_GAINED'
    | 'DOWNLOADS'
    // Productivity metrics
    | 'TASKS_COMPLETED'
    | 'PROJECTS_SHIPPED';

// =====================================================
// TIER 1 — SHIP FIRST
// =====================================================

export const X_POLICY: PlatformPolicy = {
    platform: 'X',
    tier: 'TIER_1',
    displayName: 'X (Twitter)',

    rationale: [
        'Clear public metrics',
        'Time-bounded outcomes',
        'Strong cultural fit with accountability + self-betting',
    ],

    risks: [],

    supportedMetrics: [
        {
            metricType: 'IMPRESSIONS',
            displayName: 'Impressions',
            description: 'Account-level impressions in time window',
            baselineCalculation: 'trailing_avg',
            baselinePeriodDays: 30,
            scope: 'account',
            avoid: ['Per-post impressions'],
        },
        {
            metricType: 'FOLLOWERS',
            displayName: 'Follower Growth',
            description: 'Net follower increase in time window',
            baselineCalculation: 'snapshot',
            scope: 'account',
        },
        {
            metricType: 'ENGAGEMENT_RATE',
            displayName: 'Engagement Rate',
            description: 'Engagement rate above threshold',
            baselineCalculation: 'trailing_avg',
            baselinePeriodDays: 30,
            scope: 'account',
        },
    ],

    baselineScalingRules: [
        {
            metricType: 'IMPRESSIONS',
            formula: 'target = follower_count × multiplier × time_window_days',
            factors: ['follower_count', 'multiplier', 'time_window_days'],
        },
        {
            metricType: 'FOLLOWERS',
            formula: 'target = current_followers × (1 + growth_percentage)',
            factors: ['current_followers', 'growth_percentage'],
        },
    ],

    constraints: {
        requiresOAuth: true,
        apiRateLimits: '15 requests per 15 minutes per user',
    },
};

export const STRIPE_POLICY: PlatformPolicy = {
    platform: 'STRIPE',
    tier: 'TIER_1',
    displayName: 'Stripe',

    rationale: [
        'Clean revenue verification',
        'USD-native',
        'High trust + low ambiguity',
    ],

    risks: [],

    supportedMetrics: [
        {
            metricType: 'REVENUE',
            displayName: 'Net Revenue',
            description: 'Net revenue in time window',
            baselineCalculation: 'trailing_avg',
            baselinePeriodDays: 30,
            scope: 'account',
        },
        {
            metricType: 'MRR',
            displayName: 'MRR Growth',
            description: 'Monthly recurring revenue increase',
            baselineCalculation: 'snapshot',
            scope: 'account',
        },
        {
            metricType: 'CHARGE_VOLUME',
            displayName: 'Charge Volume',
            description: 'Total successful charges',
            baselineCalculation: 'trailing_avg',
            baselinePeriodDays: 30,
            scope: 'account',
        },
    ],

    baselineScalingRules: [
        {
            metricType: 'REVENUE',
            formula: 'target = trailing_avg_monthly_revenue × growth_factor',
            factors: ['trailing_avg_monthly_revenue', 'growth_factor'],
        },
        {
            metricType: 'MRR',
            formula: 'target = current_mrr × (1 + growth_percentage)',
            factors: ['current_mrr', 'growth_percentage'],
        },
    ],

    constraints: {
        requiresOAuth: true,
        apiRateLimits: '100 requests per second',
        minimumBaseline: { revenue: 0 },  // New accounts allowed but capped
    },
};

export const GITHUB_POLICY: PlatformPolicy = {
    platform: 'GITHUB',
    tier: 'TIER_1',
    displayName: 'GitHub',

    rationale: [
        'Extremely verifiable',
        'Builder-focused credibility',
        'Low fraud risk',
    ],

    risks: [],

    supportedMetrics: [
        {
            metricType: 'COMMITS',
            displayName: 'Commits',
            description: 'Commit count in time window',
            baselineCalculation: 'trailing_avg',
            baselinePeriodDays: 30,
            scope: 'account',
            avoid: ['Spam commits', 'Auto-generated commits'],
        },
        {
            metricType: 'PRS_MERGED',
            displayName: 'PRs Merged',
            description: 'Pull requests merged (preferred over raw commits)',
            baselineCalculation: 'trailing_avg',
            baselinePeriodDays: 30,
            scope: 'account',
        },
        {
            metricType: 'REPOS_CREATED',
            displayName: 'Repos Created',
            description: 'New repositories created',
            baselineCalculation: 'snapshot',
            scope: 'account',
            avoid: ['Empty repos', 'Fork-only activity'],
        },
        {
            metricType: 'STARS_GAINED',
            displayName: 'Stars Gained',
            description: 'Stars gained across repositories',
            baselineCalculation: 'snapshot',
            scope: 'account',
            avoid: ['Star-for-star schemes'],
        },
    ],

    baselineScalingRules: [
        {
            metricType: 'COMMITS',
            formula: 'target = trailing_30d_commits × multiplier',
            factors: ['trailing_30d_commits', 'multiplier'],
        },
        {
            metricType: 'PRS_MERGED',
            formula: 'target = trailing_30d_prs × multiplier',
            factors: ['trailing_30d_prs', 'multiplier'],
        },
    ],

    constraints: {
        requiresOAuth: true,
        apiRateLimits: '5000 requests per hour',
    },
};

// =====================================================
// TIER 2 — HANDLE CAREFULLY
// =====================================================

export const YOUTUBE_POLICY: PlatformPolicy = {
    platform: 'YOUTUBE',
    tier: 'TIER_2',
    displayName: 'YouTube',

    rationale: [
        'Public metrics',
        'Large creator ecosystem',
    ],

    risks: [
        'Algorithmic volatility',
        'Burst-driven views',
    ],

    supportedMetrics: [
        {
            metricType: 'VIEWS',
            displayName: 'Channel Views',
            description: 'Total views across entire channel',
            baselineCalculation: 'trailing_avg',
            baselinePeriodDays: 30,
            scope: 'channel',
            avoid: ['Single-video viral bets'],
        },
        {
            metricType: 'SUBSCRIBERS',
            displayName: 'Subscriber Growth',
            description: 'Net subscriber increase',
            baselineCalculation: 'snapshot',
            scope: 'channel',
        },
    ],

    baselineScalingRules: [
        {
            metricType: 'VIEWS',
            formula: 'target = trailing_30d_views × multiplier',
            factors: ['trailing_30d_views', 'multiplier'],
        },
    ],

    constraints: {
        requiresOAuth: true,
        apiRateLimits: '10000 units per day',
    },
};

export const TIKTOK_POLICY: PlatformPolicy = {
    platform: 'TIKTOK',
    tier: 'TIER_2',
    displayName: 'TikTok',

    rationale: [
        'Massive creator base',
        'Engagement-centric platform',
    ],

    risks: [
        'High algorithm volatility',
        'API friction',
    ],

    supportedMetrics: [
        {
            metricType: 'VIEWS',
            displayName: 'Account Views',
            description: 'Views across entire account',
            baselineCalculation: 'trailing_avg',
            baselinePeriodDays: 30,
            scope: 'account',
            avoid: ['Single-post metrics'],
        },
        {
            metricType: 'FOLLOWERS',
            displayName: 'Follower Growth',
            description: 'Net follower increase',
            baselineCalculation: 'snapshot',
            scope: 'account',
        },
    ],

    baselineScalingRules: [
        {
            metricType: 'VIEWS',
            formula: 'target = median_views_per_post × expected_posts × multiplier',
            factors: ['median_views_per_post', 'expected_posts', 'multiplier'],
        },
    ],

    constraints: {
        requiresOAuth: true,
        apiRateLimits: 'Varies by access tier',
    },
};

export const SHOPIFY_POLICY: PlatformPolicy = {
    platform: 'SHOPIFY',
    tier: 'TIER_2',
    displayName: 'Shopify',

    rationale: [
        'Strong business outcomes',
        'Natural extension of Stripe',
    ],

    risks: [],

    supportedMetrics: [
        {
            metricType: 'GROSS_SALES',
            displayName: 'Gross Sales',
            description: 'Gross merchandise value',
            baselineCalculation: 'trailing_avg',
            baselinePeriodDays: 30,
            scope: 'store',
        },
        {
            metricType: 'ORDER_COUNT',
            displayName: 'Order Count',
            description: 'Number of orders',
            baselineCalculation: 'trailing_avg',
            baselinePeriodDays: 30,
            scope: 'store',
        },
    ],

    baselineScalingRules: [
        {
            metricType: 'GROSS_SALES',
            formula: 'target = trailing_30d_gmv × multiplier',
            factors: ['trailing_30d_gmv', 'multiplier'],
        },
    ],

    constraints: {
        requiresOAuth: true,
    },
};

// =====================================================
// TIER 3 — ADD LATER
// =====================================================

export const TIER_3_PLATFORMS: Platform[] = [
    'SUBSTACK',
    'APP_STORE',
    'PLAY_STORE',
    'NOTION',
    'LINEAR',
];

// =====================================================
// PLATFORMS TO AVOID
// =====================================================

export const AVOID_PLATFORMS = [
    { name: 'Instagram', reason: 'API limitations + fake engagement' },
    { name: 'LinkedIn', reason: 'Noisy metrics, weak verification' },
    { name: 'Reddit', reason: 'Ambiguous success definitions' },
    { name: 'Discord', reason: 'Vanity metrics' },
    { name: 'Generic web traffic', reason: 'Easily gamed without strict controls' },
];

// =====================================================
// PLATFORM REGISTRY
// =====================================================

export const PLATFORM_POLICIES: Record<Platform, PlatformPolicy | null> = {
    // Tier 1
    X: X_POLICY,
    STRIPE: STRIPE_POLICY,
    GITHUB: GITHUB_POLICY,
    // Tier 2
    YOUTUBE: YOUTUBE_POLICY,
    TIKTOK: TIKTOK_POLICY,
    SHOPIFY: SHOPIFY_POLICY,
    // Tier 3 - Not yet defined
    SUBSTACK: null,
    APP_STORE: null,
    PLAY_STORE: null,
    NOTION: null,
    LINEAR: null,
};

export function getPlatformPolicy(platform: Platform): PlatformPolicy | null {
    return PLATFORM_POLICIES[platform] || null;
}

export function getPlatformTier(platform: Platform): PlatformTier {
    const policy = PLATFORM_POLICIES[platform];
    return policy?.tier || 'TIER_3';
}

export function isTier1Platform(platform: Platform): boolean {
    return getPlatformTier(platform) === 'TIER_1';
}

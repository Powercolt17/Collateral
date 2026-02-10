/**
 * Contract Calculator - V1 (Audited)
 * 
 * Computes fair thresholds for contracts across different baselines.
 * Uses an S-curve / diminishing returns model to ensure:
 * - Low baseline users aren't given trivial targets
 * - High baseline users aren't given impossible targets
 * - Target win rates: STANDARD 30%, ADVANCED 20%, ELITE 10%
 * 
 * INVARIANTS:
 * - Deterministic: same inputs => same outputs
 * - Monotonic: higher baseline => higher threshold
 * - Auditable: full explanation returned
 * - Hard minimums: low baseline floors are ALWAYS enforced
 */

import { z } from 'zod';

// =============================================================================
// MODEL VERSION
// =============================================================================

export const MODEL_VERSION = 'v1.2.0';

// =============================================================================
// MINIMUM WINDOW DAYS (Anti-trivialization)
// =============================================================================

export const MIN_WINDOW_DAYS = {
    STRIPE: 30,
    X: 14,
} as const;

// =============================================================================
// TYPES
// =============================================================================

export type Platform = 'STRIPE' | 'X';
export type MetricType = 'REVENUE' | 'FOLLOWERS';
export type RiskTier = 'STANDARD' | 'ADVANCED' | 'ELITE';

export interface QuoteInput {
    platform: Platform;
    metricType: MetricType;
    windowDays: number;
    tier: RiskTier;
    baseline: {
        revenue30dUsdCents?: number;
        followersCount?: number;
    };
}

export interface QuoteOutput {
    platform: Platform;
    metricType: MetricType;
    windowDays: number;
    tier: RiskTier;
    operator: 'GTE';
    baselineValue: number;
    thresholdValue: number;
    deltaRequired: number;
    normalizedDifficulty: number;
    targetWinRate: 0.30 | 0.20 | 0.10;
    explanation: QuoteExplanation;
}

export interface QuoteExplanation {
    modelVersion: string;
    formula: string;
    parameters: Record<string, number>;
    floorsApplied: Record<string, boolean>;
    capsApplied: Record<string, boolean>;
}

// =============================================================================
// TIER CONFIGURATION
// =============================================================================

export const TIER_MULTIPLIERS: Record<RiskTier, number> = {
    STANDARD: 1.00,
    ADVANCED: 1.35,
    ELITE: 1.90,
};

export const TIER_WIN_RATES: Record<RiskTier, 0.30 | 0.20 | 0.10> = {
    STANDARD: 0.30,
    ADVANCED: 0.20,
    ELITE: 0.10,
};

// =============================================================================
// X FOLLOWERS PARAMETERS (windowDays=30)
// =============================================================================

export const X_FOLLOWERS_PARAMS = {
    k: 5000,
    pctBase: 0.08,
    pctLogBoost: 0.10,
    sMax: Math.log10(1 + 1_000_000 / 5000),
    maxDeltaPct: 0.35,

    // Base absolute floor (before tier multiplier)
    baseAbsFloor: 150,

    // Low baseline threshold and HARD MINIMUMS (these are final, not overridable)
    lowBaselineThreshold: 2000,
    lowBaselineMin: {
        STANDARD: 250,
        ADVANCED: 500,
        ELITE: 900,
    } as Record<RiskTier, number>,
};

// =============================================================================
// MINIMUM BASELINE THRESHOLDS (HARD GATE — cannot create contract below these)
// Users MUST have real existing metrics. No starting from zero.
// =============================================================================

export const MINIMUM_BASELINES = {
    X: {
        FOLLOWERS: {
            // Minimum followers required to create a contract at each tier
            // Higher tiers require larger existing audience (more to risk)
            STANDARD: 100,     // Controlled: need at least 100 followers
            ADVANCED: 250,     // Elevated: need at least 250 followers  
            ELITE: 500,        // Maximum: need at least 500 followers
        } as Record<RiskTier, number>,
    },
    STRIPE: {
        REVENUE: {
            // Minimum 30-day revenue (in USD cents) required
            STANDARD: 500_00,   // Controlled: $500/mo minimum
            ADVANCED: 2_000_00, // Elevated: $2,000/mo minimum
            ELITE: 5_000_00,    // Maximum: $5,000/mo minimum
        } as Record<RiskTier, number>,
    },
    SHOPIFY: {
        REVENUE: {
            STANDARD: 500_00,   // Controlled: $500/mo minimum
            ADVANCED: 2_000_00, // Elevated: $2,000/mo minimum
            ELITE: 5_000_00,    // Maximum: $5,000/mo minimum
        } as Record<RiskTier, number>,
    },
    AMAZON: {
        REVENUE: {
            STANDARD: 500_00,   // Controlled: $500/mo minimum
            ADVANCED: 2_000_00, // Elevated: $2,000/mo minimum
            ELITE: 5_000_00,    // Maximum: $5,000/mo minimum
        } as Record<RiskTier, number>,
    },
} as const;

// =============================================================================
// STRIPE REVENUE PARAMETERS (windowDays=30, all values in cents)
// =============================================================================

export const STRIPE_REVENUE_PARAMS = {
    k: 200_000_00, // $200k in cents
    pctBase: 0.18,
    pctLogBoost: 0.22,
    sMax: Math.log10(1 + 5_000_000_00 / 200_000_00),
    maxDeltaPct: 0.60,

    // Base absolute floor (before tier multiplier)
    baseAbsFloor: 800_00, // $800

    // Zero baseline: tier-specific targets (NO tier multiplier applied on top)
    zeroBaselineFloor: {
        STANDARD: 1500_00, // $1500
        ADVANCED: 2500_00, // $2500
        ELITE: 5000_00, // $5000
    } as Record<RiskTier, number>,

    // Low baseline (< $2000) HARD MINIMUMS
    lowBaselineThreshold: 2000_00, // $2000
    lowBaselineMin: {
        STANDARD: 1200_00, // $1200
        ADVANCED: 2000_00, // $2000
        ELITE: 4000_00, // $4000
    } as Record<RiskTier, number>,
};

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

const BaselineSchema = z.object({
    revenue30dUsdCents: z.number().finite().nonnegative().optional(),
    followersCount: z.number().finite().nonnegative().int().optional(),
});

const QuoteInputSchema = z.object({
    platform: z.enum(['STRIPE', 'X']),
    metricType: z.enum(['REVENUE', 'FOLLOWERS']),
    windowDays: z.number().int().min(1).max(365).default(30),
    tier: z.enum(['STANDARD', 'ADVANCED', 'ELITE']),
    baseline: BaselineSchema,
}).refine(
    (data) => {
        // Platform/metricType combinations
        if (data.platform === 'STRIPE' && data.metricType !== 'REVENUE') {
            return false;
        }
        if (data.platform === 'X' && data.metricType !== 'FOLLOWERS') {
            return false;
        }
        return true;
    },
    { message: 'Invalid platform/metricType combination. STRIPE requires REVENUE, X requires FOLLOWERS.' }
).refine(
    (data) => {
        // Required baseline field based on platform
        if (data.platform === 'STRIPE' && data.baseline.revenue30dUsdCents === undefined) {
            return false;
        }
        if (data.platform === 'X' && data.baseline.followersCount === undefined) {
            return false;
        }
        return true;
    },
    { message: 'Missing required baseline field for platform.' }
).refine(
    (data) => {
        // HARD GATE: Minimum baseline thresholds — no starting from zero
        if (data.platform === 'X' && data.baseline.followersCount !== undefined) {
            const minFollowers = MINIMUM_BASELINES.X.FOLLOWERS[data.tier];
            if (data.baseline.followersCount < minFollowers) {
                return false;
            }
        }
        if (data.platform === 'STRIPE' && data.baseline.revenue30dUsdCents !== undefined) {
            const minRevenue = MINIMUM_BASELINES.STRIPE.REVENUE[data.tier];
            if (data.baseline.revenue30dUsdCents < minRevenue) {
                return false;
            }
        }
        return true;
    },
    (data) => {
        if (data.platform === 'X') {
            const min = MINIMUM_BASELINES.X.FOLLOWERS[data.tier];
            return {
                message: `Baseline too low: ${data.tier} tier requires minimum ${min} followers. Got ${data.baseline.followersCount}. You need an existing audience to create a contract.`,
                path: ['baseline', 'followersCount'],
            };
        }
        const minCents = MINIMUM_BASELINES.STRIPE.REVENUE[data.tier];
        const minDollars = (minCents / 100).toFixed(0);
        const gotDollars = ((data.baseline.revenue30dUsdCents ?? 0) / 100).toFixed(0);
        return {
            message: `Baseline too low: ${data.tier} tier requires minimum $${minDollars}/mo revenue. Got $${gotDollars}/mo. You need existing revenue to create a contract.`,
            path: ['baseline', 'revenue30dUsdCents'],
        };
    }
).refine(
    (data) => {
        // Minimum window days to prevent trivialization
        const minWindow = MIN_WINDOW_DAYS[data.platform];
        if (data.windowDays < minWindow) {
            return false;
        }
        return true;
    },
    (data) => ({
        message: `Minimum windowDays for ${data.platform} is ${MIN_WINDOW_DAYS[data.platform]}. Got ${data.windowDays}.`,
        path: ['windowDays'],
    })
);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function clamp01(x: number): number {
    return Math.max(0, Math.min(1, x));
}

function roundToInt(x: number): number {
    return Math.round(x);
}

// =============================================================================
// VALIDATION FUNCTION
// =============================================================================

export function validateQuoteInput(input: unknown): QuoteInput {
    const result = QuoteInputSchema.safeParse(input);

    if (!result.success) {
        const firstError = result.error.errors[0];
        throw new Error(`Validation error: ${firstError.message} (path: ${firstError.path.join('.')})`);
    }

    return result.data as QuoteInput;
}

// =============================================================================
// CORE CALCULATOR
// =============================================================================

export function calculateQuote(input: QuoteInput): QuoteOutput {
    const { platform, metricType, windowDays, tier, baseline } = input;

    // Extract baseline value
    let baselineValue: number;

    if (platform === 'STRIPE') {
        baselineValue = baseline.revenue30dUsdCents!;
    } else {
        baselineValue = baseline.followersCount!;
    }

    // Ensure non-negative
    baselineValue = Math.max(0, baselineValue);

    // Scale window to 30 days (normalize)
    const windowScale = windowDays / 30;

    // Calculate delta based on platform
    let deltaRequired: number;
    let floorsApplied: Record<string, boolean> = {};
    let capsApplied: Record<string, boolean> = {};
    let parameters: Record<string, number> = {};
    let formula: string;

    if (platform === 'X') {
        const result = calculateXFollowersDelta(baselineValue, tier, windowScale);
        deltaRequired = result.delta;
        floorsApplied = result.floorsApplied;
        capsApplied = result.capsApplied;
        parameters = result.parameters;
        formula = result.formula;
    } else {
        const result = calculateStripeRevenueDelta(baselineValue, tier, windowScale);
        deltaRequired = result.delta;
        floorsApplied = result.floorsApplied;
        capsApplied = result.capsApplied;
        parameters = result.parameters;
        formula = result.formula;
    }

    // Round to integer (followers are ints, cents are ints)
    deltaRequired = roundToInt(deltaRequired);

    const thresholdValue = baselineValue + deltaRequired;

    // Normalized difficulty (0-1 scale for sanity checking)
    // For baseline=0, use appropriate reference floor instead of maxDeltaPct * baseline
    let normalizedDifficulty: number;

    if (baselineValue === 0) {
        // Use tier-specific floor as reference
        const referenceFloor = platform === 'X'
            ? X_FOLLOWERS_PARAMS.lowBaselineMin[tier] * windowScale
            : STRIPE_REVENUE_PARAMS.zeroBaselineFloor[tier] * windowScale;
        normalizedDifficulty = clamp01(deltaRequired / Math.max(1, referenceFloor));
    } else {
        const maxExpectedDelta = platform === 'X'
            ? X_FOLLOWERS_PARAMS.maxDeltaPct * baselineValue * windowScale
            : STRIPE_REVENUE_PARAMS.maxDeltaPct * baselineValue * windowScale;
        normalizedDifficulty = clamp01(deltaRequired / Math.max(1, maxExpectedDelta));
    }

    return {
        platform,
        metricType,
        windowDays,
        tier,
        operator: 'GTE',
        baselineValue,
        thresholdValue,
        deltaRequired,
        normalizedDifficulty,
        targetWinRate: TIER_WIN_RATES[tier],
        explanation: {
            modelVersion: MODEL_VERSION,
            formula,
            parameters,
            floorsApplied,
            capsApplied,
        },
    };
}

// =============================================================================
// X FOLLOWERS DELTA CALCULATION
// =============================================================================

interface DeltaResult {
    delta: number;
    floorsApplied: Record<string, boolean>;
    capsApplied: Record<string, boolean>;
    parameters: Record<string, number>;
    formula: string;
}

function calculateXFollowersDelta(
    baseline: number,
    tier: RiskTier,
    windowScale: number
): DeltaResult {
    const params = X_FOLLOWERS_PARAMS;
    const tierMult = TIER_MULTIPLIERS[tier];

    const floorsApplied: Record<string, boolean> = {};
    const capsApplied: Record<string, boolean> = {};

    // Log transform scale
    const s = Math.log10(1 + baseline / params.k);

    // Base delta calculation (WITHOUT absFloor in formula, apply once at end)
    let baseDelta = (baseline * params.pctBase) +
        (params.pctLogBoost * baseline * clamp01(s / params.sMax));

    // Apply tier multiplier
    baseDelta *= tierMult;

    // Apply window scaling
    baseDelta *= windowScale;

    // Apply absolute floor (once, after everything else)
    const absFloor = params.baseAbsFloor * tierMult * windowScale;
    if (baseDelta < absFloor) {
        baseDelta = absFloor;
        floorsApplied['absFloor'] = true;
    }

    // Apply cap (max 35% of baseline for high accounts only)
    if (baseline > params.lowBaselineThreshold) {
        const cap = params.maxDeltaPct * baseline * windowScale;
        if (baseDelta > cap) {
            baseDelta = cap;
            capsApplied['maxDeltaPct'] = true;
        }
    }

    // HARD MINIMUM: Low baseline protection (always enforced)
    if (baseline < params.lowBaselineThreshold) {
        const hardMin = params.lowBaselineMin[tier] * windowScale;
        if (baseDelta < hardMin) {
            baseDelta = hardMin;
            floorsApplied['lowBaselineMin'] = true;
        }
    }

    return {
        delta: baseDelta,
        floorsApplied,
        capsApplied,
        parameters: {
            k: params.k,
            pctBase: params.pctBase,
            pctLogBoost: params.pctLogBoost,
            sMax: params.sMax,
            maxDeltaPct: params.maxDeltaPct,
            tierMultiplier: tierMult,
            windowScale,
            s,
            baseline,
            baseAbsFloor: params.baseAbsFloor,
            lowBaselineMin: params.lowBaselineMin[tier],
        },
        formula: 'delta = max(absFloor, (baseline*pctBase + pctLogBoost*baseline*clamp01(s/sMax)) * tierMult * windowScale), then lowBaselineMin enforced',
    };
}

// =============================================================================
// STRIPE REVENUE DELTA CALCULATION
// =============================================================================

function calculateStripeRevenueDelta(
    baseline: number,
    tier: RiskTier,
    windowScale: number
): DeltaResult {
    const params = STRIPE_REVENUE_PARAMS;
    const tierMult = TIER_MULTIPLIERS[tier];

    const floorsApplied: Record<string, boolean> = {};
    const capsApplied: Record<string, boolean> = {};

    // ZERO BASELINE: REJECT — users must have existing revenue
    // This should be caught by Zod validation, but enforce here as defense-in-depth
    if (baseline === 0) {
        throw new Error(
            `Cannot calculate threshold for $0 baseline. ` +
            `${tier} tier requires minimum $${(MINIMUM_BASELINES.STRIPE.REVENUE[tier] / 100).toFixed(0)}/mo revenue. ` +
            `Connect your Stripe account and build revenue first.`
        );
    }

    // Log transform scale
    const s = Math.log10(1 + baseline / params.k);

    // Base delta calculation (WITHOUT absFloor in formula)
    let baseDelta = (baseline * params.pctBase) +
        (params.pctLogBoost * baseline * clamp01(s / params.sMax));

    // Apply tier multiplier
    baseDelta *= tierMult;

    // Apply window scaling
    baseDelta *= windowScale;

    // Apply absolute floor (once)
    const absFloor = params.baseAbsFloor * tierMult * windowScale;
    if (baseDelta < absFloor) {
        baseDelta = absFloor;
        floorsApplied['absFloor'] = true;
    }

    // Apply cap (max 60% of baseline for high accounts only)
    if (baseline > params.lowBaselineThreshold) {
        const cap = params.maxDeltaPct * baseline * windowScale;
        if (baseDelta > cap) {
            baseDelta = cap;
            capsApplied['maxDeltaPct'] = true;
        }
    }

    // HARD MINIMUM: Low baseline protection (always enforced)
    if (baseline < params.lowBaselineThreshold && baseline > 0) {
        const hardMin = params.lowBaselineMin[tier] * windowScale;
        if (baseDelta < hardMin) {
            baseDelta = hardMin;
            floorsApplied['lowBaselineMin'] = true;
        }
    }

    return {
        delta: baseDelta,
        floorsApplied,
        capsApplied,
        parameters: {
            k: params.k,
            pctBase: params.pctBase,
            pctLogBoost: params.pctLogBoost,
            sMax: params.sMax,
            maxDeltaPct: params.maxDeltaPct,
            tierMultiplier: tierMult,
            windowScale,
            s,
            baseline,
            baseAbsFloor: params.baseAbsFloor,
            lowBaselineMin: params.lowBaselineMin[tier],
        },
        formula: 'delta = max(absFloor, (baseline*pctBase + pctLogBoost*baseline*clamp01(s/sMax)) * tierMult * windowScale), then lowBaselineMin enforced',
    };
}

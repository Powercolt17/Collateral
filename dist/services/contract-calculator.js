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
};
// =============================================================================
// TIER CONFIGURATION
// =============================================================================
export const TIER_MULTIPLIERS = {
    STANDARD: 1.00,
    ADVANCED: 1.35,
    ELITE: 1.90,
};
export const TIER_WIN_RATES = {
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
    },
};
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
    },
    // Low baseline (< $2000) HARD MINIMUMS
    lowBaselineThreshold: 2000_00, // $2000
    lowBaselineMin: {
        STANDARD: 1200_00, // $1200
        ADVANCED: 2000_00, // $2000
        ELITE: 4000_00, // $4000
    },
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
}).refine((data) => {
    // Platform/metricType combinations
    if (data.platform === 'STRIPE' && data.metricType !== 'REVENUE') {
        return false;
    }
    if (data.platform === 'X' && data.metricType !== 'FOLLOWERS') {
        return false;
    }
    return true;
}, { message: 'Invalid platform/metricType combination. STRIPE requires REVENUE, X requires FOLLOWERS.' }).refine((data) => {
    // Required baseline field based on platform
    if (data.platform === 'STRIPE' && data.baseline.revenue30dUsdCents === undefined) {
        return false;
    }
    if (data.platform === 'X' && data.baseline.followersCount === undefined) {
        return false;
    }
    return true;
}, { message: 'Missing required baseline field for platform.' }).refine((data) => {
    // Minimum window days to prevent trivialization
    const minWindow = MIN_WINDOW_DAYS[data.platform];
    if (data.windowDays < minWindow) {
        return false;
    }
    return true;
}, (data) => ({
    message: `Minimum windowDays for ${data.platform} is ${MIN_WINDOW_DAYS[data.platform]}. Got ${data.windowDays}.`,
    path: ['windowDays'],
}));
// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
function clamp01(x) {
    return Math.max(0, Math.min(1, x));
}
function roundToInt(x) {
    return Math.round(x);
}
// =============================================================================
// VALIDATION FUNCTION
// =============================================================================
export function validateQuoteInput(input) {
    const result = QuoteInputSchema.safeParse(input);
    if (!result.success) {
        const firstError = result.error.errors[0];
        throw new Error(`Validation error: ${firstError.message} (path: ${firstError.path.join('.')})`);
    }
    return result.data;
}
// =============================================================================
// CORE CALCULATOR
// =============================================================================
export function calculateQuote(input) {
    const { platform, metricType, windowDays, tier, baseline } = input;
    // Extract baseline value
    let baselineValue;
    if (platform === 'STRIPE') {
        baselineValue = baseline.revenue30dUsdCents;
    }
    else {
        baselineValue = baseline.followersCount;
    }
    // Ensure non-negative
    baselineValue = Math.max(0, baselineValue);
    // Scale window to 30 days (normalize)
    const windowScale = windowDays / 30;
    // Calculate delta based on platform
    let deltaRequired;
    let floorsApplied = {};
    let capsApplied = {};
    let parameters = {};
    let formula;
    if (platform === 'X') {
        const result = calculateXFollowersDelta(baselineValue, tier, windowScale);
        deltaRequired = result.delta;
        floorsApplied = result.floorsApplied;
        capsApplied = result.capsApplied;
        parameters = result.parameters;
        formula = result.formula;
    }
    else {
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
    let normalizedDifficulty;
    if (baselineValue === 0) {
        // Use tier-specific floor as reference
        const referenceFloor = platform === 'X'
            ? X_FOLLOWERS_PARAMS.lowBaselineMin[tier] * windowScale
            : STRIPE_REVENUE_PARAMS.zeroBaselineFloor[tier] * windowScale;
        normalizedDifficulty = clamp01(deltaRequired / Math.max(1, referenceFloor));
    }
    else {
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
function calculateXFollowersDelta(baseline, tier, windowScale) {
    const params = X_FOLLOWERS_PARAMS;
    const tierMult = TIER_MULTIPLIERS[tier];
    const floorsApplied = {};
    const capsApplied = {};
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
function calculateStripeRevenueDelta(baseline, tier, windowScale) {
    const params = STRIPE_REVENUE_PARAMS;
    const tierMult = TIER_MULTIPLIERS[tier];
    const floorsApplied = {};
    const capsApplied = {};
    // ZERO BASELINE: Use tier-specific fixed values (no tier multiplier on top)
    if (baseline === 0) {
        const zeroFloor = params.zeroBaselineFloor[tier] * windowScale;
        floorsApplied['zeroBaselineFloor'] = true;
        return {
            delta: zeroFloor,
            floorsApplied,
            capsApplied,
            parameters: {
                zeroBaselineFloor: params.zeroBaselineFloor[tier],
                windowScale,
                baseline,
                // Note: tierMultiplier NOT applied for zero baseline
            },
            formula: 'delta = zeroBaselineFloor[tier] * windowScale (zero baseline, tier-specific constant)',
        };
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
//# sourceMappingURL=contract-calculator.js.map
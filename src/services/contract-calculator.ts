
export interface TargetPolicy {
    mode: 'percentage_delta';
    min_pct: number;
    max_pct: number;
    min_absolute_floor: number;
}

/**
 * Calculates a specific target for a user based on their baseline and the contract's policy.
 * @param baseline - The user's current metric value.
 * @param policy - The policy defining the target calculation rules.
 * @returns The calculated target value.
 */
export function calculateTarget(baseline: number, policy: TargetPolicy): number {
    if (!policy || policy.mode !== 'percentage_delta') {
        return Math.ceil(baseline * 1.1); // Default 10%
    }
    const avgPct = (policy.min_pct + policy.max_pct) / 2;
    const delta = Math.ceil(baseline * (avgPct / 100));
    const effectiveDelta = Math.max(delta, policy.min_absolute_floor);
    return baseline + effectiveDelta;
}

/**
 * Generates a human-readable hint string for the target.
 * @param policy - The target policy.
 * @returns A string representation of the target range.
 */
export function getTargetHint(policy: TargetPolicy): string {
    if (!policy) return '';
    return `+${policy.min_pct}–${policy.max_pct}%`;
}

// =============================================================================
// QUOTE VALIDATION & CALCULATION (Restored/Shimmed)
// =============================================================================

export interface QuoteInput {
    platform: string;
    metric: string;
    baseline: number;
    windowDays: number;
    tier?: string; // standard, advanced, elite
}

export function validateQuoteInput(input: any): QuoteInput {
    if (!input || typeof input !== 'object') {
        throw new Error('Invalid input: must be an object');
    }
    if (!input.platform || typeof input.platform !== 'string') {
        throw new Error('Missing or invalid "platform"');
    }
    if (typeof input.baseline !== 'number' || input.baseline < 0) {
        throw new Error('Missing or invalid "baseline"');
    }

    // Defaults
    return {
        platform: input.platform,
        metric: input.metric || 'REVENUE',
        baseline: input.baseline,
        windowDays: Number(input.windowDays) || 30,
        tier: input.tier || 'STANDARD'
    };
}

export function calculateQuote(input: QuoteInput) {
    // Legacy logic shim using the new smart tier concepts where possible, 
    // or just standard fixed logic to satisfy the endpoint.

    const { baseline, windowDays, tier } = input;

    let multiplier = 1.1; // Standard
    let risk = 'LOW';

    if (tier === 'ADVANCED') {
        multiplier = 1.25;
        risk = 'MEDIUM';
    } else if (tier === 'ELITE') {
        multiplier = 1.5;
        risk = 'HIGH';
    }

    // Simple projection
    const target = Math.ceil(baseline * multiplier);
    const growth = target - baseline;
    const growthPct = Math.round(((target - baseline) / baseline) * 100);

    return {
        input,
        quote: {
            target,
            growthAbsolute: growth,
            growthPercent: growthPct,
            impliedDailyGrowth: growth / windowDays,
            riskLevel: risk,
            // Computed "Win Probability" for UI display
            winProbability: tier === 'ELITE' ? 0.15 : tier === 'ADVANCED' ? 0.35 : 0.65
        }
    };
}

// =============================================================================
// SHARED CONSTANTS
// =============================================================================

export const MINIMUM_BASELINES = {
    STRIPE: {
        REVENUE: {
            STANDARD: 100000,   // $1,000/mo — matches STEADY tier
            ADVANCED: 500000,   // $5,000/mo — matches BROAD tier
            ELITE: 1000000      // $10,000/mo — matches ALL_IN tier
        }
    },
    X: {
        FOLLOWERS: {
            STANDARD: 100,
            ADVANCED: 1000,
            ELITE: 5000
        }
    }
} as const;

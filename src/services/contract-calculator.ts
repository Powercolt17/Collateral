
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
    // Uses the final locked growth percentages per tier.

    const { baseline, windowDays, tier } = input;

    // Final locked growth targets
    let multiplier = 1.20; // Controlled: 20% growth
    let risk = 'CONTROLLED';

    if (tier === 'ADVANCED') {
        multiplier = 1.30;  // Elevated: 30% growth
        risk = 'ELEVATED';
    } else if (tier === 'ELITE') {
        multiplier = 1.45;  // Maximum: 45% growth
        risk = 'MAXIMUM';
    }

    // target = baseline × (1 + growth_percentage)
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
            // Target failure rates for UI display
            winProbability: tier === 'ELITE' ? 0.10 : tier === 'ADVANCED' ? 0.20 : 0.25
        }
    };
}

// =============================================================================
// SHARED CONSTANTS — FINAL LOCKED PARAMETERS
// =============================================================================

export const MINIMUM_BASELINES = {
    STRIPE: {
        REVENUE: {
            STANDARD: 100_000,   // $1,000/mo — matches Controlled tier
            ADVANCED: 500_000,   // $5,000/mo — matches Elevated tier
            ELITE: 1_000_000     // $10,000/mo — matches Maximum tier
        }
    },
    X: {
        FOLLOWERS: {
            STANDARD: 500,       // 500 followers — Controlled tier
            ADVANCED: 2_000,     // 2K followers — Elevated tier
            ELITE: 5_000         // 5K followers — Maximum tier
        }
    },
    SHOPIFY: {
        REVENUE: {
            STANDARD: 100_000,   // $1,000/mo — matches Controlled tier
            ADVANCED: 500_000,   // $5,000/mo — matches Elevated tier
            ELITE: 1_000_000     // $10,000/mo — matches Maximum tier
        }
    },
    YOUTUBE: {
        SUBSCRIBERS: {
            STANDARD: 1_000,     // 1K subs — Controlled tier
            ADVANCED: 10_000,    // 10K subs — Elevated tier
            ELITE: 100_000       // 100K subs — Maximum tier
        },
        VIEWS: {
            STANDARD: 10_000,    // 10K 30d views — Controlled tier
            ADVANCED: 100_000,   // 100K 30d views — Elevated tier
            ELITE: 1_000_000     // 1M 30d views — Maximum tier
        }
    }
} as const;

// =============================================================================
// MINIMUM ACCOUNT AGE (days) — ANTI-GAMING
// =============================================================================
export const MIN_ACCOUNT_AGE_DAYS = {
    X: 90,          // X account must be 90+ days old
    STRIPE: 90,     // Stripe account must be 90+ days old
    SHOPIFY: 90,    // Shopify store must be 90+ days old
    YOUTUBE: 90,    // YouTube channel must be 90+ days old
} as const;

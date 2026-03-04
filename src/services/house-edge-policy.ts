/**
 * House Edge Policy — FINAL LOCKED PARAMETERS
 * 
 * CORE INVARIANT: The SYSTEM dictates ALL contract terms.
 * Users do NOT choose their own targets, payouts, or stake amounts.
 * 
 * The system calculates:
 * 1. Target (from baseline + tier → contract-calculator.ts)
 * 2. Stake amount (system-set, capped per tier)  
 * 3. Payout amount (system-calculated, FIXED multiplier per tier)
 * 4. Duration (system-set per tier)
 * 
 * IMPORTANT DESIGN RULE:
 * Payout multipliers are FIXED and NEVER adjust dynamically.
 * Platform profitability is controlled through:
 *   - Growth percentage difficulty
 *   - Baseline requirements
 *   - Delta floors
 * 
 * WHALE DEFENSE:
 * - Hard max stake per contract per tier
 * - Max single-contract exposure (% of pool)
 * - System-calculated payouts ensure house always profits long-run
 * - No user-specified payouts
 * 
 * ECONOMICS (Final — Locked):
 * 
 *   Controlled: ~25% win rate × 1.7x = 0.425 → house margin ~30-35%
 *   Elevated:   ~20% win rate × 2.5x = 0.500 → house margin ~35-40%
 *   Maximum:    ~10% win rate × 4.0x = 0.400 → house margin ~40-60%
 * 
 * Target failure rates:
 *   Controlled: ~75%   (20% growth in 30 days)
 *   Elevated:   ~80%   (30% growth in 21 days)
 *   Maximum:    ~90%   (45% growth in 14 days)
 */

// =============================================================================
// TYPES
// =============================================================================

export type RiskTier = 'STANDARD' | 'ADVANCED' | 'ELITE';

// =============================================================================
// STAKE CAPS (Hard maximum per contract — NO EXCEPTIONS)
// =============================================================================

export const STAKE_CAPS: Record<RiskTier, {
    minUsdCents: number;
    maxUsdCents: number;
}> = {
    // Controlled: ~25% win rate, 1.7x payout
    STANDARD: {
        minUsdCents: 100_00,      // $100 minimum
        maxUsdCents: 2_500_00,    // $2,500 maximum per contract
    },

    // Elevated: ~20% win rate, 2.5x payout
    ADVANCED: {
        minUsdCents: 250_00,      // $250 minimum
        maxUsdCents: 5_000_00,    // $5,000 maximum per contract
    },

    // Maximum: ~10% win rate, 4.0x payout
    ELITE: {
        minUsdCents: 500_00,      // $500 minimum
        maxUsdCents: 10_000_00,   // $10,000 maximum per contract
    },
};

// =============================================================================
// PAYOUT MULTIPLIERS (FIXED — Never dynamically adjusted)
// 
// Profitability is controlled through growth %, baselines, and delta floors.
// DO NOT change these multipliers to adjust margins.
//
//   Controlled: 1.7x  → $1,000 stake pays $1,700 on success
//   Elevated:   2.5x  → $1,000 stake pays $2,500 on success
//   Maximum:    4.0x  → $1,000 stake pays $4,000 on success
// =============================================================================

export const PAYOUT_MULTIPLIERS: Record<RiskTier, number> = {
    STANDARD: 1.7,   // Controlled: $1,700 on $1,000 stake
    ADVANCED: 2.5,   // Elevated:   $2,500 on $1,000 stake
    ELITE: 4.0,      // Maximum:    $4,000 on $1,000 stake
};

// =============================================================================
// POOL EXPOSURE LIMITS
// No single contract can exceed X% of the total pool balance
// =============================================================================

export const MAX_SINGLE_CONTRACT_POOL_PCT = 0.05;  // 5% max of pool per contract
export const MAX_TIER_POOL_EXPOSURE_PCT: Record<RiskTier, number> = {
    STANDARD: 0.30, // Max 30% of pool across all Controlled contracts
    ADVANCED: 0.25, // Max 25% of pool across all Elevated contracts  
    ELITE: 0.15,    // Max 15% of pool across all Maximum contracts
};

// Minimum pool balance to accept new contracts
export const MIN_POOL_BALANCE_USD_CENTS = 10_000_00; // $10,000

// =============================================================================
// SYSTEM-SET DURATIONS (Users don't pick their own window)
// =============================================================================

export const SYSTEM_DURATIONS: Record<RiskTier, {
    days: number;
    label: string;
}> = {
    STANDARD: { days: 30, label: '30 Days' },
    ADVANCED: { days: 21, label: '21 Days' },
    ELITE: { days: 14, label: '14 Days' },
};

// =============================================================================
// GROWTH TARGETS (The difficulty lever — this is what drives failure rates)
// =============================================================================

export const GROWTH_TARGETS: Record<RiskTier, {
    percentage: number;
    deltaFloorCents: number;
    minBaselineCents: number;
    minEventCount: number;
}> = {
    STANDARD: {
        percentage: 0.20,          // 20% growth in 30 days → ~75% failure
        deltaFloorCents: 50_000,   // $500 minimum absolute growth
        minBaselineCents: 100_000,  // $1,000/mo minimum baseline
        minEventCount: 3,          // Minimum 3 charges/events
    },
    ADVANCED: {
        percentage: 0.30,          // 30% growth in 21 days → ~80% failure
        deltaFloorCents: 100_000,  // $1,000 minimum absolute growth
        minBaselineCents: 500_000,  // $5,000/mo minimum baseline
        minEventCount: 3,          // Minimum 3 charges/events
    },
    ELITE: {
        percentage: 0.45,          // 45% growth in 14 days → ~90% failure
        deltaFloorCents: 250_000,  // $2,500 minimum absolute growth
        minBaselineCents: 1_000_000, // $10,000/mo minimum baseline
        minEventCount: 3,          // Minimum 3 charges/events
    },
};

// =============================================================================
// FUNCTIONS
// =============================================================================

/**
 * Calculate system-determined payout for a given stake and tier
 * Users NEVER specify this — it's always calculated
 * payout = stake × multiplier
 */
export function calculatePayout(stakeUsdCents: number, tier: RiskTier): number {
    return Math.round(stakeUsdCents * PAYOUT_MULTIPLIERS[tier]);
}

/**
 * Validate stake amount against tier caps
 * Returns error message if invalid, null if OK
 */
export function validateStake(stakeUsdCents: number, tier: RiskTier): string | null {
    const caps = STAKE_CAPS[tier];

    if (stakeUsdCents < caps.minUsdCents) {
        const minDollars = (caps.minUsdCents / 100).toFixed(0);
        return `Minimum stake for ${tier} tier is $${minDollars}`;
    }

    if (stakeUsdCents > caps.maxUsdCents) {
        const maxDollars = (caps.maxUsdCents / 100).toFixed(0);
        return `Maximum stake for ${tier} tier is $${maxDollars}. System-controlled limits protect pool integrity.`;
    }

    return null;
}

/**
 * Check if a new contract would exceed pool exposure limits
 * 
 * @param stakeUsdCents - Proposed stake
 * @param tier - Contract tier
 * @param poolBalanceUsdCents - Current pool balance
 * @param activeTierExposureUsdCents - Total active exposure for this tier
 */
export function validatePoolExposure(
    stakeUsdCents: number,
    tier: RiskTier,
    poolBalanceUsdCents: number,
    activeTierExposureUsdCents: number
): string | null {
    // Pool too small to accept contracts
    if (poolBalanceUsdCents < MIN_POOL_BALANCE_USD_CENTS) {
        return 'Pool balance too low to accept new contracts';
    }

    // Single contract exposure check (5% of pool max)
    const maxSingleExposure = Math.round(poolBalanceUsdCents * MAX_SINGLE_CONTRACT_POOL_PCT);
    const potentialPayout = calculatePayout(stakeUsdCents, tier);

    if (potentialPayout > maxSingleExposure) {
        const maxStake = Math.round(maxSingleExposure / PAYOUT_MULTIPLIERS[tier]);
        const maxDollars = (maxStake / 100).toFixed(0);
        return `Stake too high for current pool. Maximum stake: $${maxDollars}`;
    }

    // Tier-level exposure check
    const maxTierExposure = Math.round(poolBalanceUsdCents * MAX_TIER_POOL_EXPOSURE_PCT[tier]);
    const newTierExposure = activeTierExposureUsdCents + potentialPayout;

    if (newTierExposure > maxTierExposure) {
        return `${tier} tier exposure limit reached. Try again later or choose a different tier.`;
    }

    return null;
}

/**
 * Calculate target metric from baseline using tier growth percentage
 * Formula: target = baseline × (1 + growth_percentage)
 */
export function calculateTargetMetric(baselineCents: number, tier: RiskTier): number {
    const growth = GROWTH_TARGETS[tier];
    const target = Math.ceil(baselineCents * (1 + growth.percentage));
    const delta = target - baselineCents;

    // Enforce delta floor — target must grow by at least the delta floor
    if (delta < growth.deltaFloorCents) {
        return baselineCents + growth.deltaFloorCents;
    }

    return target;
}

/**
 * Validate baseline meets all tier requirements
 * Returns error message if invalid, null if OK
 */
export function validateBaseline(
    baselineCents: number,
    eventCount: number,
    tier: RiskTier
): string | null {
    const growth = GROWTH_TARGETS[tier];

    // Minimum baseline check
    if (baselineCents < growth.minBaselineCents) {
        const minDollars = (growth.minBaselineCents / 100).toLocaleString();
        return `Minimum baseline for ${tier} tier is $${minDollars}/month`;
    }

    // Minimum event count check
    if (eventCount < growth.minEventCount) {
        return `Minimum ${growth.minEventCount} charges/events required. Found ${eventCount}. Build consistent revenue before creating a contract.`;
    }

    return null;
}

/**
 * Get system-generated contract terms for a given tier and stake
 * This is THE function that produces non-negotiable terms
 */
export function getSystemTerms(stakeUsdCents: number, tier: RiskTier) {
    const duration = SYSTEM_DURATIONS[tier];
    const payout = calculatePayout(stakeUsdCents, tier);
    const caps = STAKE_CAPS[tier];
    const growth = GROWTH_TARGETS[tier];

    return {
        tier,
        stakeUsdCents,
        payoutUsdCents: payout,
        durationDays: duration.days,
        durationLabel: duration.label,
        payoutMultiplier: PAYOUT_MULTIPLIERS[tier],
        growthPercentage: growth.percentage,
        deltaFloorCents: growth.deltaFloorCents,
        minBaselineCents: growth.minBaselineCents,
        minEventCount: growth.minEventCount,
        stakeRange: {
            min: caps.minUsdCents,
            max: caps.maxUsdCents,
        },
        // Display values
        stakeDisplay: `$${(stakeUsdCents / 100).toLocaleString()}`,
        payoutDisplay: `$${(payout / 100).toLocaleString()}`,
        multiplierDisplay: `${PAYOUT_MULTIPLIERS[tier]}x`,
        growthDisplay: `${(growth.percentage * 100).toFixed(0)}%`,
    };
}

/**
 * House edge report for monitoring
 */
export function getHouseEdgeReport() {
    return {
        tiers: {
            STANDARD: {
                displayName: 'Controlled',
                targetFailureRate: 0.75,
                winRate: 0.25,
                payoutMultiplier: PAYOUT_MULTIPLIERS.STANDARD,
                houseMargin: `~30-35%`,
                growthTarget: `${(GROWTH_TARGETS.STANDARD.percentage * 100).toFixed(0)}% in ${SYSTEM_DURATIONS.STANDARD.days} days`,
                maxStake: `$${(STAKE_CAPS.STANDARD.maxUsdCents / 100).toLocaleString()}`,
                maxPayout: `$${(calculatePayout(STAKE_CAPS.STANDARD.maxUsdCents, 'STANDARD') / 100).toLocaleString()}`,
            },
            ADVANCED: {
                displayName: 'Elevated',
                targetFailureRate: 0.80,
                winRate: 0.20,
                payoutMultiplier: PAYOUT_MULTIPLIERS.ADVANCED,
                houseMargin: `~35-40%`,
                growthTarget: `${(GROWTH_TARGETS.ADVANCED.percentage * 100).toFixed(0)}% in ${SYSTEM_DURATIONS.ADVANCED.days} days`,
                maxStake: `$${(STAKE_CAPS.ADVANCED.maxUsdCents / 100).toLocaleString()}`,
                maxPayout: `$${(calculatePayout(STAKE_CAPS.ADVANCED.maxUsdCents, 'ADVANCED') / 100).toLocaleString()}`,
            },
            ELITE: {
                displayName: 'Maximum',
                targetFailureRate: 0.90,
                winRate: 0.10,
                payoutMultiplier: PAYOUT_MULTIPLIERS.ELITE,
                houseMargin: `~40-60%`,
                growthTarget: `${(GROWTH_TARGETS.ELITE.percentage * 100).toFixed(0)}% in ${SYSTEM_DURATIONS.ELITE.days} days`,
                maxStake: `$${(STAKE_CAPS.ELITE.maxUsdCents / 100).toLocaleString()}`,
                maxPayout: `$${(calculatePayout(STAKE_CAPS.ELITE.maxUsdCents, 'ELITE') / 100).toLocaleString()}`,
            },
        },
        poolLimits: {
            maxSingleContractPct: `${MAX_SINGLE_CONTRACT_POOL_PCT * 100}%`,
            minPoolBalance: `$${(MIN_POOL_BALANCE_USD_CENTS / 100).toLocaleString()}`,
        },
    };
}

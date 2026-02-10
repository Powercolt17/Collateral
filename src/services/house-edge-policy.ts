/**
 * House Edge Policy — WHALE PROTECTION
 * 
 * CORE INVARIANT: The SYSTEM dictates ALL contract terms.
 * Users do NOT choose their own targets, payouts, or stake amounts.
 * 
 * The system calculates:
 * 1. Target (from baseline + tier → contract-calculator.ts)
 * 2. Stake amount (system-set, capped per tier)  
 * 3. Payout amount (system-calculated, always less than expected value)
 * 4. Duration (system-set per tier)
 * 
 * WHALE DEFENSE:
 * - Hard max stake per contract per tier
 * - Max single-contract exposure (% of pool)
 * - System-calculated payouts ensure house always profits long-run
 * - No user-specified payouts
 * 
 * MATH:
 * If Controlled wins 30% of the time:
 *   House keeps 70% of stakes, pays out 30% of stakes * payout_multiplier
 *   For the house to profit: payout_multiplier < (1 / win_rate)
 *   Controlled: payout_multiplier < 3.33x (we use 1.8x → house edge 46%)
 *   Elevated:   payout_multiplier < 5.0x  (we use 2.5x → house edge 50%)
 *   Maximum:    payout_multiplier < 10.0x (we use 4.0x → house edge 60%)
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
    // Controlled: Low risk to house (30% win rate)
    // But also lowest payout multiplier, so cap stake to limit exposure
    STANDARD: {
        minUsdCents: 10_00,       // $10 minimum
        maxUsdCents: 2_500_00,    // $2,500 maximum per contract
    },

    // Elevated: Medium risk (20% win rate)
    ADVANCED: {
        minUsdCents: 50_00,       // $50 minimum
        maxUsdCents: 5_000_00,    // $5,000 maximum per contract
    },

    // Maximum: Highest risk but lowest win rate (10%)
    ELITE: {
        minUsdCents: 250_00,      // $250 minimum
        maxUsdCents: 10_000_00,   // $10,000 maximum per contract
    },
};

// =============================================================================
// PAYOUT MULTIPLIERS (System-calculated, NOT user-specified)
// 
// These ensure the house always wins over time:
//   Expected house revenue per contract = stake * (1 - win_rate * payout_multiplier)
//
//   Controlled: 1 - (0.30 * 1.8) = 1 - 0.54 = +46% house edge
//   Elevated:   1 - (0.20 * 2.5) = 1 - 0.50 = +50% house edge  
//   Maximum:    1 - (0.10 * 4.0) = 1 - 0.40 = +60% house edge
// =============================================================================

export const PAYOUT_MULTIPLIERS: Record<RiskTier, number> = {
    STANDARD: 1.8,   // Win $1,800 on a $1,000 stake (house edge 46%)
    ADVANCED: 2.5,   // Win $2,500 on a $1,000 stake (house edge 50%)
    ELITE: 4.0,      // Win $4,000 on a $1,000 stake (house edge 60%)
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
// FUNCTIONS
// =============================================================================

/**
 * Calculate system-determined payout for a given stake and tier
 * Users NEVER specify this — it's always calculated
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
 * Get system-generated contract terms for a given tier and stake
 * This is THE function that produces non-negotiable terms
 */
export function getSystemTerms(stakeUsdCents: number, tier: RiskTier) {
    const duration = SYSTEM_DURATIONS[tier];
    const payout = calculatePayout(stakeUsdCents, tier);
    const caps = STAKE_CAPS[tier];

    return {
        tier,
        stakeUsdCents,
        payoutUsdCents: payout,
        durationDays: duration.days,
        durationLabel: duration.label,
        payoutMultiplier: PAYOUT_MULTIPLIERS[tier],
        stakeRange: {
            min: caps.minUsdCents,
            max: caps.maxUsdCents,
        },
        // Display values
        stakeDisplay: `$${(stakeUsdCents / 100).toLocaleString()}`,
        payoutDisplay: `$${(payout / 100).toLocaleString()}`,
        multiplierDisplay: `${PAYOUT_MULTIPLIERS[tier]}x`,
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
                winRate: 0.30,
                payoutMultiplier: PAYOUT_MULTIPLIERS.STANDARD,
                houseEdge: 1 - (0.30 * PAYOUT_MULTIPLIERS.STANDARD),
                maxStake: `$${(STAKE_CAPS.STANDARD.maxUsdCents / 100).toLocaleString()}`,
                maxPayout: `$${(calculatePayout(STAKE_CAPS.STANDARD.maxUsdCents, 'STANDARD') / 100).toLocaleString()}`,
            },
            ADVANCED: {
                displayName: 'Elevated',
                winRate: 0.20,
                payoutMultiplier: PAYOUT_MULTIPLIERS.ADVANCED,
                houseEdge: 1 - (0.20 * PAYOUT_MULTIPLIERS.ADVANCED),
                maxStake: `$${(STAKE_CAPS.ADVANCED.maxUsdCents / 100).toLocaleString()}`,
                maxPayout: `$${(calculatePayout(STAKE_CAPS.ADVANCED.maxUsdCents, 'ADVANCED') / 100).toLocaleString()}`,
            },
            ELITE: {
                displayName: 'Maximum',
                winRate: 0.10,
                payoutMultiplier: PAYOUT_MULTIPLIERS.ELITE,
                houseEdge: 1 - (0.10 * PAYOUT_MULTIPLIERS.ELITE),
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

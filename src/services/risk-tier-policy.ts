/**
 * Risk Tier Policy Architecture
 * 
 * POLICY INVARIANT: Three-tier risk structure
 * 
 * Tier 1 (STANDARD): ~30% designed success rate
 * Tier 2 (ADVANCED): ~20% designed success rate
 * Tier 3 (ELITE):    ~10% designed success rate
 * 
 * These are DESIGNED outcome distributions achieved through:
 * - Baseline-relative target calculation
 * - Nonlinear scaling with existing size
 * - Time pressure differences per tier
 * - Stake escalation per tier
 * - Strict, binary verification
 * 
 * NOT hard-coded probabilities.
 * NOT manipulated outcomes.
 * Targets can be tuned via configuration.
 */

// =====================================================
// TYPES & INTERFACES
// =====================================================

/**
 * The three canonical risk tiers
 */
export type RiskTier = 'STANDARD' | 'ADVANCED' | 'ELITE';

/**
 * Configuration for each risk tier
 * All values are tunable - no hard-coded probabilities
 */
export interface RiskTierConfig {
    tier: RiskTier;

    // Target calculation
    baselineMultiplierCurve: BaselineMultiplierCurve;

    // Time pressure
    minDurationDays: number;
    maxDurationDays: number;
    timePressureCoefficient: number;

    // Stake requirements
    minStakeUsdCents: number;
    maxStakeUsdCents: number;
    stakeEscalationFactor: number;

    // Display
    displayName: string;
    designedSuccessRate: string; // e.g., "~30%" - for UI only
}

/**
 * Nonlinear curve for baseline-relative target scaling
 * Larger baselines require proportionally harder targets
 */
export interface BaselineMultiplierCurve {
    // Curve type determines the mathematical relationship
    type: 'logarithmic' | 'exponential' | 'polynomial';

    // Coefficients (interpretation depends on type)
    coefficients: {
        base: number;      // Base multiplier (e.g., 1.3 = 30% growth minimum)
        scale: number;     // How aggressively difficulty scales with size
        exponent: number;  // For polynomial/exponential curves
        ceiling: number;   // Maximum multiplier cap
    };

    // Size thresholds for nonlinear breakpoints
    breakpoints: SizeBreakpoint[];
}

/**
 * Size breakpoint for nonlinear scaling
 * At each threshold, scaling behavior changes
 */
export interface SizeBreakpoint {
    threshold: number;           // Baseline value where this kicks in
    adjustmentFactor: number;    // Multiplier adjustment at this level
    metricTypes: MetricType[];   // Which metrics this applies to
}

/**
 * Metric types with platform context
 */
export type MetricType =
    | 'FOLLOWERS'
    | 'IMPRESSIONS'
    | 'VIEWS'
    | 'SUBSCRIBERS'
    | 'REVENUE';

/**
 * Platform context affects how metrics are interpreted
 */
export type Platform = 'X' | 'STRIPE' | 'TIKTOK' | 'YOUTUBE';

/**
 * Input for target calculation
 */
export interface TargetCalculationInput {
    tier: RiskTier;
    platform: Platform;
    metricType: MetricType;
    baseline: number;
    durationDays: number;
    stakeUsdCents: number;
}

/**
 * Output from target calculation
 */
export interface TargetCalculationOutput {
    target: number;
    multiplier: number;
    adjustments: {
        sizeAdjustment: number;
        timeAdjustment: number;
        stakeAdjustment: number;
    };
    breakdown: string[];  // Human-readable calculation breakdown
}

// =====================================================
// POLICY CONFIGURATION
// (Tunable values - not hard-coded probabilities)
// =====================================================

/**
 * Default tier configurations
 * These values can be overridden via environment or database
 */
export const DEFAULT_TIER_CONFIGS: Record<RiskTier, RiskTierConfig> = {
    STANDARD: {
        tier: 'STANDARD',
        displayName: 'Standard',
        designedSuccessRate: '~30%',

        baselineMultiplierCurve: {
            type: 'logarithmic',
            coefficients: {
                base: 1.15,      // Start at 15% growth
                scale: 0.05,     // Moderate scaling
                exponent: 1.0,
                ceiling: 1.5,    // Max 50% growth
            },
            breakpoints: [
                { threshold: 10000, adjustmentFactor: 1.05, metricTypes: ['FOLLOWERS', 'SUBSCRIBERS'] },
                { threshold: 100000, adjustmentFactor: 1.1, metricTypes: ['FOLLOWERS', 'SUBSCRIBERS'] },
                { threshold: 1000000, adjustmentFactor: 1.15, metricTypes: ['FOLLOWERS', 'SUBSCRIBERS'] },
            ],
        },

        minDurationDays: 7,
        maxDurationDays: 30,
        timePressureCoefficient: 0.8,  // More time = slightly harder target

        minStakeUsdCents: 1000,        // $10 minimum
        maxStakeUsdCents: 10000000,    // $100k maximum
        stakeEscalationFactor: 1.0,    // No escalation at standard
    },

    ADVANCED: {
        tier: 'ADVANCED',
        displayName: 'Advanced',
        designedSuccessRate: '~20%',

        baselineMultiplierCurve: {
            type: 'logarithmic',
            coefficients: {
                base: 1.35,      // Start at 35% growth
                scale: 0.08,     // Steeper scaling
                exponent: 1.2,
                ceiling: 2.0,    // Max 100% growth
            },
            breakpoints: [
                { threshold: 10000, adjustmentFactor: 1.1, metricTypes: ['FOLLOWERS', 'SUBSCRIBERS'] },
                { threshold: 100000, adjustmentFactor: 1.2, metricTypes: ['FOLLOWERS', 'SUBSCRIBERS'] },
                { threshold: 1000000, adjustmentFactor: 1.3, metricTypes: ['FOLLOWERS', 'SUBSCRIBERS'] },
            ],
        },

        minDurationDays: 7,
        maxDurationDays: 21,
        timePressureCoefficient: 1.0,  // Baseline time pressure

        minStakeUsdCents: 5000,        // $50 minimum
        maxStakeUsdCents: 50000000,    // $500k maximum
        stakeEscalationFactor: 1.25,   // 25% higher stakes
    },

    ELITE: {
        tier: 'ELITE',
        displayName: 'Elite',
        designedSuccessRate: '~10%',

        baselineMultiplierCurve: {
            type: 'exponential',
            coefficients: {
                base: 1.6,       // Start at 60% growth
                scale: 0.12,     // Aggressive scaling
                exponent: 1.5,
                ceiling: 3.0,    // Max 200% growth
            },
            breakpoints: [
                { threshold: 10000, adjustmentFactor: 1.15, metricTypes: ['FOLLOWERS', 'SUBSCRIBERS'] },
                { threshold: 100000, adjustmentFactor: 1.3, metricTypes: ['FOLLOWERS', 'SUBSCRIBERS'] },
                { threshold: 1000000, adjustmentFactor: 1.5, metricTypes: ['FOLLOWERS', 'SUBSCRIBERS'] },
            ],
        },

        minDurationDays: 3,
        maxDurationDays: 14,
        timePressureCoefficient: 1.3,  // Aggressive time pressure

        minStakeUsdCents: 25000,       // $250 minimum
        maxStakeUsdCents: 100000000,   // $1M maximum
        stakeEscalationFactor: 1.5,    // 50% higher stakes
    },
};

// =====================================================
// POLICY INTERFACE (to be implemented)
// =====================================================

/**
 * Calculate target for a given tier and context
 * This is the core policy function - implementation deferred
 */
export function calculateTarget(_input: TargetCalculationInput): TargetCalculationOutput {
    // TODO: Implement when ready
    // - Apply baseline multiplier curve
    // - Apply size breakpoints
    // - Apply time pressure
    // - Apply stake adjustment
    throw new Error('calculateTarget: Implementation deferred - architecture only');
}

/**
 * Validate a contract's target against tier policy
 * Ensures targets meet minimum difficulty for tier
 */
export function validateTargetForTier(
    _tier: RiskTier,
    _baseline: number,
    _target: number,
    _metricType: MetricType
): { valid: boolean; reason?: string } {
    // TODO: Implement when ready
    throw new Error('validateTargetForTier: Implementation deferred - architecture only');
}

/**
 * Get recommended stake range for tier
 */
export function getStakeRangeForTier(tier: RiskTier): { min: number; max: number } {
    const config = DEFAULT_TIER_CONFIGS[tier];
    return {
        min: config.minStakeUsdCents,
        max: config.maxStakeUsdCents,
    };
}

/**
 * Get duration constraints for tier
 */
export function getDurationRangeForTier(tier: RiskTier): { min: number; max: number } {
    const config = DEFAULT_TIER_CONFIGS[tier];
    return {
        min: config.minDurationDays,
        max: config.maxDurationDays,
    };
}

// =====================================================
// SCHEMA ADDITIONS (for database)
// =====================================================

/**
 * Add to contracts table:
 *
 * risk_tier: ENUM('STANDARD', 'ADVANCED', 'ELITE')
 * target_calculation_metadata: JSONB {
 *   multiplier: number,
 *   adjustments: { size, time, stake },
 *   configVersion: string
 * }
 */

// =====================================================
// TUNING GUIDELINES
// =====================================================

/**
 * To tune success rates, adjust these levers:
 * 
 * 1. BASE MULTIPLIER
 *    - Higher base = harder targets = lower success rate
 *    - STANDARD: 1.15, ADVANCED: 1.35, ELITE: 1.6
 * 
 * 2. SCALE COEFFICIENT
 *    - Higher scale = faster difficulty increase with size
 *    - Affects large accounts more than small
 * 
 * 3. BREAKPOINTS
 *    - Define where scaling behavior changes
 *    - 1M follower account should face different challenge than 1K
 * 
 * 4. TIME PRESSURE
 *    - Shorter duration = harder (less time to grow)
 *    - ELITE has shortest max duration (14 days)
 * 
 * 5. STAKE ESCALATION
 *    - Higher stakes = psychological pressure
 *    - Not directly affecting difficulty, but affects behavior
 * 
 * Monitor actual success rates and adjust coefficients accordingly.
 * Target distributions (~30%, ~20%, ~10%) emerge from calibration,
 * not from hard-coded probabilities.
 */

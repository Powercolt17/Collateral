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
    baselineMultiplierCurve: BaselineMultiplierCurve;
    minDurationDays: number;
    maxDurationDays: number;
    timePressureCoefficient: number;
    minStakeUsdCents: number;
    maxStakeUsdCents: number;
    stakeEscalationFactor: number;
    displayName: string;
    designedSuccessRate: string;
}
/**
 * Nonlinear curve for baseline-relative target scaling
 * Larger baselines require proportionally harder targets
 */
export interface BaselineMultiplierCurve {
    type: 'logarithmic' | 'exponential' | 'polynomial';
    coefficients: {
        base: number;
        scale: number;
        exponent: number;
        ceiling: number;
    };
    breakpoints: SizeBreakpoint[];
}
/**
 * Size breakpoint for nonlinear scaling
 * At each threshold, scaling behavior changes
 */
export interface SizeBreakpoint {
    threshold: number;
    adjustmentFactor: number;
    metricTypes: MetricType[];
}
/**
 * Metric types with platform context
 */
export type MetricType = 'FOLLOWERS' | 'IMPRESSIONS' | 'VIEWS' | 'SUBSCRIBERS' | 'REVENUE';
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
    breakdown: string[];
}
/**
 * Default tier configurations
 * These values can be overridden via environment or database
 */
export declare const DEFAULT_TIER_CONFIGS: Record<RiskTier, RiskTierConfig>;
/**
 * Calculate target for a given tier and context
 * This is the core policy function - implementation deferred
 */
export declare function calculateTarget(_input: TargetCalculationInput): TargetCalculationOutput;
/**
 * Validate a contract's target against tier policy
 * Ensures targets meet minimum difficulty for tier
 */
export declare function validateTargetForTier(_tier: RiskTier, _baseline: number, _target: number, _metricType: MetricType): {
    valid: boolean;
    reason?: string;
};
/**
 * Get recommended stake range for tier
 */
export declare function getStakeRangeForTier(tier: RiskTier): {
    min: number;
    max: number;
};
/**
 * Get duration constraints for tier
 */
export declare function getDurationRangeForTier(tier: RiskTier): {
    min: number;
    max: number;
};
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

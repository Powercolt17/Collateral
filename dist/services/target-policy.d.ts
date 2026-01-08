/**
 * Target Policy Module
 *
 * Scaling difficulty logic - targets scale relative to baseline
 * Someone with 1M followers gets proportionally harder target than 1k
 */
export interface TargetTier {
    name: string;
    multiplier: number;
    description: string;
}
export interface SuggestedTargets {
    tiers: TargetTier[];
    baseline: number;
    metricType: string;
}
/**
 * Calculate suggested target tiers based on baseline
 */
export declare function calculateSuggestedTargets(baseline: number, metricType: string): SuggestedTargets;
/**
 * Validate a proposed target against baseline
 * Prevents trivially easy targets
 */
export declare function validateTarget(baseline: number, target: number, metricType: string): {
    valid: boolean;
    reason?: string;
};

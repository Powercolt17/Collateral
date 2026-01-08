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
export declare const MODEL_VERSION = "v1.2.0";
export declare const MIN_WINDOW_DAYS: {
    readonly STRIPE: 30;
    readonly X: 14;
};
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
export declare const TIER_MULTIPLIERS: Record<RiskTier, number>;
export declare const TIER_WIN_RATES: Record<RiskTier, 0.30 | 0.20 | 0.10>;
export declare const X_FOLLOWERS_PARAMS: {
    k: number;
    pctBase: number;
    pctLogBoost: number;
    sMax: number;
    maxDeltaPct: number;
    baseAbsFloor: number;
    lowBaselineThreshold: number;
    lowBaselineMin: Record<RiskTier, number>;
};
export declare const STRIPE_REVENUE_PARAMS: {
    k: number;
    pctBase: number;
    pctLogBoost: number;
    sMax: number;
    maxDeltaPct: number;
    baseAbsFloor: number;
    zeroBaselineFloor: Record<RiskTier, number>;
    lowBaselineThreshold: number;
    lowBaselineMin: Record<RiskTier, number>;
};
export declare function validateQuoteInput(input: unknown): QuoteInput;
export declare function calculateQuote(input: QuoteInput): QuoteOutput;

import { describe, it, expect } from 'vitest';
import {
    calculateTarget,
    validateTargetForTier,
    RiskTier,
    TargetCalculationInput
} from '../src/services/risk-tier-policy.js';

describe('Risk Tier Policy Logic', () => {

    describe('calculateTarget', () => {

        it('should calculate correct target for STANDARD tier (Logarithmic)', () => {
            // Standard: Base 1.15, Scale 0.05, Logarithmic
            // Baseline 1000 -> log10 is 3
            // Multiplier = 1.15 + 0.05 * 3 = 1.30
            // Size Adj: < 10000 -> 1.0
            // Time Adj: Standard is 0.8
            // Final Multiplier: 1.30 * 0.8 = 1.04
            // Target: ceil(1000 * 1.04) = 1040

            const input: TargetCalculationInput = {
                tier: 'STANDARD',
                platform: 'X',
                metricType: 'FOLLOWERS',
                baseline: 1000,
                durationDays: 30, // Max duration
                stakeUsdCents: 1000
            };

            const result = calculateTarget(input);
            expect(result.target).toBe(1040);
            expect(result.multiplier).toBeCloseTo(1.04, 3);
        });

        it('should calculate correct target for ADVANCED tier (Logarithmic)', () => {
            // Advanced: Base 1.35, Scale 0.08
            // Baseline 1000 -> log10 is 3
            // Multiplier = 1.35 + 0.08 * 3 = 1.59
            // Size Adj: < 10000 -> 1.0
            // Time Adj: Advanced is 1.0
            // Final Multiplier: 1.59 * 1.0 = 1.59
            // Target: ceil(1000 * 1.59) = 1590

            const input: TargetCalculationInput = {
                tier: 'ADVANCED',
                platform: 'X',
                metricType: 'FOLLOWERS',
                baseline: 1000,
                durationDays: 21,
                stakeUsdCents: 5000
            };

            const result = calculateTarget(input);
            expect(result.target).toBe(1590);
            expect(result.multiplier).toBeCloseTo(1.59, 3);
        });

        it('should calculate correct target for ELITE tier (Exponential-ish)', () => {
            // Elite: Base 1.6, Scale 0.12, Exponent 1.5
            // Baseline 1000 -> log10 is 3
            // Multiplier = 1.6 + 0.12 * (3 ^ 1.5)
            // 3 ^ 1.5 = 5.19615
            // 0.12 * 5.19615 = 0.6235
            // Base 1.6 + 0.6235 = 2.2235
            // Size Adj: < 10000 -> 1.0
            // Time Adj: Elite is 1.3
            // Final Multiplier: 2.2235 * 1.3 = 2.89055
            // Target: ceil(1000 * 2.89055) = 2891

            const input: TargetCalculationInput = {
                tier: 'ELITE',
                platform: 'X',
                metricType: 'FOLLOWERS',
                baseline: 1000,
                durationDays: 14,
                stakeUsdCents: 25000
            };

            const result = calculateTarget(input);
            // 2891 is expected
            expect(result.target).toBe(2891);
        });

        it('should apply size breakpoints for large accounts', () => {
            // Standard Tier, Baseline 100,001
            // Base Multiplier: 1.15 + 0.05 * log10(100001) ~= 5.0
            // 1.15 + 0.05 * 5 = 1.40
            // Size Breakpoints:
            // > 10,000 (1.05x)
            // > 100,000 (1.1x)
            // Total Size Adj: 1.05 * 1.1 = 1.155
            // Time Adj: 0.8
            // Final Multiplier: 1.40 * 1.155 * 0.8 = 1.2936
            // Target: 100001 * 1.2936 = 129361

            const input: TargetCalculationInput = {
                tier: 'STANDARD',
                platform: 'X',
                metricType: 'FOLLOWERS',
                baseline: 100001,
                durationDays: 30,
                stakeUsdCents: 1000
            };

            const result = calculateTarget(input);
            expect(result.adjustments.sizeAdjustment).toBeCloseTo(1.155, 3);
            expect(result.target).toBeGreaterThan(100001);
        });

        it('should cap multiplier at ceiling', () => {
            // Elite tier with huge baseline
            // Base 1.6, Scale 0.12, Exp 1.5
            // Baseline 100,000,000 (log 8)
            // 8^1.5 = 22.62
            // 1.6 + 0.12 * 22.62 = 1.6 + 2.71 = 4.31
            // Ceiling is 3.0
            // Time Adj 1.3 applied AFTER ceiling? Or before?
            // "Multiplier" variable is capped.
            // If logic caps "multiplier" before time adj?

            // Logic implemented:
            // 1. Base Calc
            // 2. Size Adj
            // 3. Time Adj
            // 4. Ceiling Cap

            // So if base * size * time > ceiling, it gets capped.

            const input: TargetCalculationInput = {
                tier: 'ELITE',
                platform: 'X',
                metricType: 'FOLLOWERS',
                baseline: 100000000,
                durationDays: 14,
                stakeUsdCents: 25000
            };

            const result = calculateTarget(input);
            expect(result.multiplier).toBe(3.0);
        });
    });

    describe('validateTargetForTier', () => {
        it('should valid if target > calculated min', () => {
            // Standard Tier Min Calc for 1000 is 1040
            const result = validateTargetForTier('STANDARD', 1000, 1050, 'FOLLOWERS');
            expect(result.valid).toBe(true);
        });

        it('should invalid if target < calculated min', () => {
            // Standard Tier Min Calc for 1000 is 1040
            const result = validateTargetForTier('STANDARD', 1000, 1039, 'FOLLOWERS');
            expect(result.valid).toBe(false);
            expect(result.reason).toContain('below minimum allowed');
        });
    });
});

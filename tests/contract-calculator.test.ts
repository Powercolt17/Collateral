/**
 * Contract Calculator Unit Tests (Updated)
 * 
 * Tests:
 * 1. Deterministic: same inputs => same outputs
 * 2. Monotonic: higher baseline => higher threshold
 * 3. Low baseline HARD MINIMUMS enforced
 * 4. Tier ordering: ELITE > ADVANCED > STANDARD
 * 5. Cap enforcement for large baselines
 * 6. Minimum window days enforcement (A)
 * 7. normalizedDifficulty for baseline=0 (B)
 */

import { describe, it, expect } from 'vitest';
import {
    calculateQuote,
    validateQuoteInput,
    QuoteInput,
    MODEL_VERSION,
    MIN_WINDOW_DAYS,
    X_FOLLOWERS_PARAMS,
    STRIPE_REVENUE_PARAMS,
} from '../src/services/contract-calculator.js';

// =============================================================================
// MINIMUM WINDOW DAYS TESTS (FIX A)
// =============================================================================

describe('Contract Calculator - Minimum Window Days', () => {
    it('rejects STRIPE windowDays < 30', () => {
        expect(() => validateQuoteInput({
            platform: 'STRIPE',
            metricType: 'REVENUE',
            tier: 'STANDARD',
            windowDays: 14,
            baseline: { revenue30dUsdCents: 10000_00 },
        })).toThrow(/Minimum windowDays for STRIPE is 30/);
    });

    it('accepts STRIPE windowDays = 30', () => {
        const input = validateQuoteInput({
            platform: 'STRIPE',
            metricType: 'REVENUE',
            tier: 'STANDARD',
            windowDays: 30,
            baseline: { revenue30dUsdCents: 10000_00 },
        });
        expect(input.windowDays).toBe(30);
    });

    it('rejects X windowDays < 14', () => {
        expect(() => validateQuoteInput({
            platform: 'X',
            metricType: 'FOLLOWERS',
            tier: 'STANDARD',
            windowDays: 7,
            baseline: { followersCount: 5000 },
        })).toThrow(/Minimum windowDays for X is 14/);
    });

    it('accepts X windowDays = 14', () => {
        const input = validateQuoteInput({
            platform: 'X',
            metricType: 'FOLLOWERS',
            tier: 'STANDARD',
            windowDays: 14,
            baseline: { followersCount: 5000 },
        });
        expect(input.windowDays).toBe(14);
    });

    it('MIN_WINDOW_DAYS constants are correct', () => {
        expect(MIN_WINDOW_DAYS.STRIPE).toBe(30);
        expect(MIN_WINDOW_DAYS.X).toBe(14);
    });
});

// =============================================================================
// NORMALIZED DIFFICULTY TESTS (FIX B)
// =============================================================================

describe('Contract Calculator - normalizedDifficulty', () => {
    it('STRIPE baseline=0 returns normalizedDifficulty = 1 (computed correctly)', () => {
        const quote = calculateQuote({
            platform: 'STRIPE',
            metricType: 'REVENUE',
            windowDays: 30,
            tier: 'STANDARD',
            baseline: { revenue30dUsdCents: 0 },
        });

        // deltaRequired equals zeroBaselineFloor, reference is also zeroBaselineFloor
        // So normalizedDifficulty should be exactly 1
        expect(quote.normalizedDifficulty).toBe(1);
    });

    it('X baseline=0 returns normalizedDifficulty = 1 (computed correctly)', () => {
        const quote = calculateQuote({
            platform: 'X',
            metricType: 'FOLLOWERS',
            windowDays: 14,
            tier: 'STANDARD',
            baseline: { followersCount: 0 },
        });

        // For X baseline=0, delta should equal lowBaselineMin * windowScale
        // Reference is also lowBaselineMin * windowScale, so normalizedDifficulty = 1
        expect(quote.normalizedDifficulty).toBe(1);
    });

    it('baseline > 0 uses maxDeltaPct reference', () => {
        const quote = calculateQuote({
            platform: 'X',
            metricType: 'FOLLOWERS',
            windowDays: 30,
            tier: 'STANDARD',
            baseline: { followersCount: 100000 },
        });

        // For large baselines, normalizedDifficulty should be reasonable (not always 1)
        expect(quote.normalizedDifficulty).toBeLessThanOrEqual(1);
        expect(quote.normalizedDifficulty).toBeGreaterThan(0);
    });

    it('normalizedDifficulty is between 0 and 1 for all cases', () => {
        const baselines = [0, 1000, 10000, 100000, 1000000];

        for (const baseline of baselines) {
            const quote = calculateQuote({
                platform: 'X',
                metricType: 'FOLLOWERS',
                windowDays: 14,
                tier: 'ELITE',
                baseline: { followersCount: baseline },
            });

            expect(quote.normalizedDifficulty).toBeGreaterThanOrEqual(0);
            expect(quote.normalizedDifficulty).toBeLessThanOrEqual(1);
        }
    });
});

// =============================================================================
// DETERMINISM TESTS
// =============================================================================

describe('Contract Calculator - Determinism', () => {
    it('returns identical output for identical X FOLLOWERS input', () => {
        const input: QuoteInput = {
            platform: 'X',
            metricType: 'FOLLOWERS',
            windowDays: 30,
            tier: 'STANDARD',
            baseline: { followersCount: 5000 },
        };

        const quote1 = calculateQuote(input);
        const quote2 = calculateQuote(input);

        expect(quote1).toEqual(quote2);
    });

    it('returns identical output for identical STRIPE REVENUE input', () => {
        const input: QuoteInput = {
            platform: 'STRIPE',
            metricType: 'REVENUE',
            windowDays: 30,
            tier: 'ADVANCED',
            baseline: { revenue30dUsdCents: 500000 },
        };

        const quote1 = calculateQuote(input);
        const quote2 = calculateQuote(input);

        expect(quote1).toEqual(quote2);
    });

    it('includes correct model version in explanation', () => {
        const quote = calculateQuote({
            platform: 'X',
            metricType: 'FOLLOWERS',
            windowDays: 14,
            tier: 'STANDARD',
            baseline: { followersCount: 1000 },
        });

        expect(quote.explanation.modelVersion).toBe(MODEL_VERSION);
        expect(MODEL_VERSION).toBe('v1.2.0'); // Updated version
    });
});

// =============================================================================
// LOW BASELINE HARD MINIMUM TESTS
// =============================================================================

describe('Contract Calculator - Low Baseline Hard Minimums', () => {
    describe('STRIPE REVENUE', () => {
        it('baseline 0 => STANDARD delta >= $1500', () => {
            const quote = calculateQuote({
                platform: 'STRIPE',
                metricType: 'REVENUE',
                windowDays: 30,
                tier: 'STANDARD',
                baseline: { revenue30dUsdCents: 0 },
            });

            expect(quote.deltaRequired).toBeGreaterThanOrEqual(1500_00);
        });

        it('baseline 0 => ADVANCED delta >= $2500', () => {
            const quote = calculateQuote({
                platform: 'STRIPE',
                metricType: 'REVENUE',
                windowDays: 30,
                tier: 'ADVANCED',
                baseline: { revenue30dUsdCents: 0 },
            });

            expect(quote.deltaRequired).toBeGreaterThanOrEqual(2500_00);
        });

        it('baseline 0 => ELITE delta >= $5000', () => {
            const quote = calculateQuote({
                platform: 'STRIPE',
                metricType: 'REVENUE',
                windowDays: 30,
                tier: 'ELITE',
                baseline: { revenue30dUsdCents: 0 },
            });

            expect(quote.deltaRequired).toBeGreaterThanOrEqual(5000_00);
        });

        it('baseline $1000 => STANDARD delta >= $1200', () => {
            const quote = calculateQuote({
                platform: 'STRIPE',
                metricType: 'REVENUE',
                windowDays: 30,
                tier: 'STANDARD',
                baseline: { revenue30dUsdCents: 1000_00 },
            });

            expect(quote.deltaRequired).toBeGreaterThanOrEqual(1200_00);
        });
    });

    describe('X FOLLOWERS', () => {
        it('baseline 1000 => STANDARD delta >= 250', () => {
            const quote = calculateQuote({
                platform: 'X',
                metricType: 'FOLLOWERS',
                windowDays: 30,
                tier: 'STANDARD',
                baseline: { followersCount: 1000 },
            });

            expect(quote.deltaRequired).toBeGreaterThanOrEqual(250);
        });

        it('baseline 1000 => ADVANCED delta >= 500', () => {
            const quote = calculateQuote({
                platform: 'X',
                metricType: 'FOLLOWERS',
                windowDays: 30,
                tier: 'ADVANCED',
                baseline: { followersCount: 1000 },
            });

            expect(quote.deltaRequired).toBeGreaterThanOrEqual(500);
        });

        it('baseline 1000 => ELITE delta >= 900', () => {
            const quote = calculateQuote({
                platform: 'X',
                metricType: 'FOLLOWERS',
                windowDays: 30,
                tier: 'ELITE',
                baseline: { followersCount: 1000 },
            });

            expect(quote.deltaRequired).toBeGreaterThanOrEqual(900);
        });

        it('baseline 0 => delta >= lowBaselineMin', () => {
            const quote = calculateQuote({
                platform: 'X',
                metricType: 'FOLLOWERS',
                windowDays: 30,
                tier: 'STANDARD',
                baseline: { followersCount: 0 },
            });

            expect(quote.deltaRequired).toBeGreaterThanOrEqual(X_FOLLOWERS_PARAMS.lowBaselineMin.STANDARD);
        });
    });
});

// =============================================================================
// TIER ORDERING TESTS
// =============================================================================

describe('Contract Calculator - Tier Ordering', () => {
    it('X FOLLOWERS: ELITE delta > ADVANCED delta > STANDARD delta', () => {
        const baselines = [500, 5000, 50000, 500000];

        for (const baseline of baselines) {
            const standard = calculateQuote({
                platform: 'X',
                metricType: 'FOLLOWERS',
                windowDays: 30,
                tier: 'STANDARD',
                baseline: { followersCount: baseline },
            });

            const advanced = calculateQuote({
                platform: 'X',
                metricType: 'FOLLOWERS',
                windowDays: 30,
                tier: 'ADVANCED',
                baseline: { followersCount: baseline },
            });

            const elite = calculateQuote({
                platform: 'X',
                metricType: 'FOLLOWERS',
                windowDays: 30,
                tier: 'ELITE',
                baseline: { followersCount: baseline },
            });

            expect(elite.deltaRequired).toBeGreaterThan(advanced.deltaRequired);
            expect(advanced.deltaRequired).toBeGreaterThan(standard.deltaRequired);
        }
    });

    it('STRIPE REVENUE: ELITE delta > ADVANCED delta > STANDARD delta', () => {
        const baselines = [0, 500_00, 5000_00, 50000_00];

        for (const baseline of baselines) {
            const standard = calculateQuote({
                platform: 'STRIPE',
                metricType: 'REVENUE',
                windowDays: 30,
                tier: 'STANDARD',
                baseline: { revenue30dUsdCents: baseline },
            });

            const advanced = calculateQuote({
                platform: 'STRIPE',
                metricType: 'REVENUE',
                windowDays: 30,
                tier: 'ADVANCED',
                baseline: { revenue30dUsdCents: baseline },
            });

            const elite = calculateQuote({
                platform: 'STRIPE',
                metricType: 'REVENUE',
                windowDays: 30,
                tier: 'ELITE',
                baseline: { revenue30dUsdCents: baseline },
            });

            expect(elite.deltaRequired).toBeGreaterThan(advanced.deltaRequired);
            expect(advanced.deltaRequired).toBeGreaterThan(standard.deltaRequired);
        }
    });
});

// =============================================================================
// CAP ENFORCEMENT TESTS
// =============================================================================

describe('Contract Calculator - Cap Enforcement', () => {
    it('X baseline 1,000,000 => deltaRequired <= 350,000', () => {
        const quote = calculateQuote({
            platform: 'X',
            metricType: 'FOLLOWERS',
            windowDays: 30,
            tier: 'ELITE',
            baseline: { followersCount: 1_000_000 },
        });

        expect(quote.deltaRequired).toBeLessThanOrEqual(350_000);
        // Cap is only applied when formula exceeds maxDeltaPct * baseline
        // If deltaRequired is already under cap, capsApplied won't be set
        if (quote.deltaRequired >= 350_000) {
            expect(quote.explanation.capsApplied['maxDeltaPct']).toBe(true);
        }
    });

    it('STRIPE baseline $100k => deltaRequired <= $60k', () => {
        const quote = calculateQuote({
            platform: 'STRIPE',
            metricType: 'REVENUE',
            windowDays: 30,
            tier: 'ELITE',
            baseline: { revenue30dUsdCents: 100000_00 },
        });

        expect(quote.deltaRequired).toBeLessThanOrEqual(60000_00);
        // Cap is only applied when formula exceeds maxDeltaPct * baseline
        if (quote.deltaRequired >= 60000_00) {
            expect(quote.explanation.capsApplied['maxDeltaPct']).toBe(true);
        }
    });
});

// =============================================================================
// MONOTONICITY TESTS
// =============================================================================

describe('Contract Calculator - Monotonicity', () => {
    it('X FOLLOWERS: higher baseline => higher or equal threshold', () => {
        const baselines = [0, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000, 500000, 1000000];

        for (const tier of ['STANDARD', 'ADVANCED', 'ELITE'] as const) {
            let prevThreshold = 0;

            for (const baseline of baselines) {
                const quote = calculateQuote({
                    platform: 'X',
                    metricType: 'FOLLOWERS',
                    windowDays: 30,
                    tier,
                    baseline: { followersCount: baseline },
                });

                expect(quote.thresholdValue).toBeGreaterThanOrEqual(prevThreshold);
                prevThreshold = quote.thresholdValue;
            }
        }
    });
});

// =============================================================================
// VALIDATION TESTS
// =============================================================================

describe('Contract Calculator - Input Validation', () => {
    it('throws on missing baseline for platform', () => {
        expect(() => validateQuoteInput({
            platform: 'X',
            metricType: 'FOLLOWERS',
            windowDays: 14,
            tier: 'STANDARD',
            baseline: {},
        })).toThrow('Missing required baseline');
    });

    it('throws on invalid platform/metricType combo', () => {
        expect(() => validateQuoteInput({
            platform: 'X',
            metricType: 'REVENUE',
            windowDays: 14,
            tier: 'STANDARD',
            baseline: { revenue30dUsdCents: 1000 },
        })).toThrow('Invalid platform/metricType combination');
    });

    it('throws on negative baseline', () => {
        expect(() => validateQuoteInput({
            platform: 'X',
            metricType: 'FOLLOWERS',
            tier: 'STANDARD',
            baseline: { followersCount: -100 },
        })).toThrow();
    });
});

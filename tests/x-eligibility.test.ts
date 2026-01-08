/**
 * X Eligibility & Hardening Tests
 * 
 * SECURITY-CRITICAL: Tests proving adversarial resistance
 * 
 * Tests:
 * 1. Eligibility gate failures for each reason code
 * 2. Delta floor enforcement
 * 3. Protected account rejection
 * 4. Multi-sample verification
 */

import { describe, it, expect } from 'vitest';
import {
    checkXEligibility,
    calculateDeltaFloor,
    validateDeltaFloor,
    evaluateSamples,
    X_ELIGIBILITY_THRESHOLDS,
    X_DELTA_FLOOR,
    type XAccountHealth,
    type FollowerSample,
} from '../src/adapters/x-eligibility.js';

// =============================================================================
// HELPER: Create account health with defaults
// =============================================================================

function createHealth(overrides: Partial<XAccountHealth> = {}): XAccountHealth {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 200);

    return {
        createdAt: sixMonthsAgo.toISOString(),
        protected: false,
        publicMetrics: {
            followersCount: 15000,
            followingCount: 500,
            tweetCount: 1000,
            listedCount: 50,
        },
        measuredAtUtc: new Date().toISOString(),
        ...overrides,
    };
}

// =============================================================================
// 1. ELIGIBILITY GATE TESTS
// =============================================================================

describe('X Eligibility Gates', () => {
    describe('Minimum Followers (10,000)', () => {
        it('rejects account with < 10K followers', () => {
            const health = createHealth();
            health.publicMetrics.followersCount = 9999;

            const result = checkXEligibility(health);

            expect(result.eligible).toBe(false);
            expect(result.reasonCode).toBe('X_INELIGIBLE_MIN_FOLLOWERS');
            expect(result.details.followersCount).toBe(9999);
        });

        it('accepts account with exactly 10K followers', () => {
            const health = createHealth();
            health.publicMetrics.followersCount = 10000;

            const result = checkXEligibility(health);

            expect(result.eligible).toBe(true);
            expect(result.reasonCode).toBeUndefined();
        });

        it('accepts account with > 10K followers', () => {
            const health = createHealth();
            health.publicMetrics.followersCount = 50000;

            const result = checkXEligibility(health);

            expect(result.eligible).toBe(true);
        });
    });

    describe('Account Age (180 days)', () => {
        it('rejects account < 180 days old', () => {
            const recentDate = new Date();
            recentDate.setDate(recentDate.getDate() - 179);

            const health = createHealth({ createdAt: recentDate.toISOString() });

            const result = checkXEligibility(health);

            expect(result.eligible).toBe(false);
            expect(result.reasonCode).toBe('X_INELIGIBLE_ACCOUNT_AGE');
            expect(result.details.accountAgeDays).toBe(179);
        });

        it('accepts account exactly 180 days old', () => {
            const exactDate = new Date();
            exactDate.setDate(exactDate.getDate() - 180);

            const health = createHealth({ createdAt: exactDate.toISOString() });

            const result = checkXEligibility(health);

            expect(result.eligible).toBe(true);
        });
    });

    describe('Protected Account', () => {
        it('rejects protected (private) account', () => {
            const health = createHealth({ protected: true });

            const result = checkXEligibility(health);

            expect(result.eligible).toBe(false);
            expect(result.reasonCode).toBe('X_INELIGIBLE_PROTECTED');
            expect(result.details.protected).toBe(true);
        });

        it('accepts public account', () => {
            const health = createHealth({ protected: false });

            const result = checkXEligibility(health);

            expect(result.eligible).toBe(true);
        });
    });

    describe('Minimum Activity (50 tweets)', () => {
        it('rejects account with < 50 tweets', () => {
            const health = createHealth();
            health.publicMetrics.tweetCount = 49;

            const result = checkXEligibility(health);

            expect(result.eligible).toBe(false);
            expect(result.reasonCode).toBe('X_INELIGIBLE_LOW_ACTIVITY');
            expect(result.details.tweetCount).toBe(49);
        });

        it('accepts account with exactly 50 tweets', () => {
            const health = createHealth();
            health.publicMetrics.tweetCount = 50;

            const result = checkXEligibility(health);

            expect(result.eligible).toBe(true);
        });
    });

    describe('Threshold Constants', () => {
        it('has correct minimum followers threshold', () => {
            expect(X_ELIGIBILITY_THRESHOLDS.MIN_FOLLOWERS).toBe(10000);
        });

        it('has correct minimum account age', () => {
            expect(X_ELIGIBILITY_THRESHOLDS.MIN_ACCOUNT_AGE_DAYS).toBe(180);
        });

        it('has correct minimum tweet count', () => {
            expect(X_ELIGIBILITY_THRESHOLDS.MIN_TWEET_COUNT).toBe(50);
        });
    });
});

// =============================================================================
// 2. DELTA FLOOR TESTS
// =============================================================================

describe('Delta Floor Enforcement', () => {
    describe('calculateDeltaFloor', () => {
        it('returns absolute minimum (500) for small accounts', () => {
            // 5% of 5000 = 250, but min is 500
            expect(calculateDeltaFloor(5000)).toBe(500);
        });

        it('returns 5% for large accounts', () => {
            // 5% of 20000 = 1000 > 500
            expect(calculateDeltaFloor(20000)).toBe(1000);
        });

        it('returns absolute minimum for accounts at threshold boundary', () => {
            // 5% of 10000 = 500 = min
            expect(calculateDeltaFloor(10000)).toBe(500);
        });

        it('handles very large accounts', () => {
            // 5% of 1M = 50000
            expect(calculateDeltaFloor(1000000)).toBe(50000);
        });
    });

    describe('validateDeltaFloor', () => {
        it('rejects threshold below delta floor', () => {
            // Baseline 15000, target 15400 = delta 400
            // Required delta = max(500, 15000*0.05) = 750
            const result = validateDeltaFloor(15000, 15400);

            expect(result.valid).toBe(false);
            expect(result.requiredDelta).toBe(750);
            expect(result.actualDelta).toBe(400);
        });

        it('accepts threshold meeting delta floor', () => {
            // Baseline 10000, target 10500 = delta 500
            // Required delta = 500
            const result = validateDeltaFloor(10000, 10500);

            expect(result.valid).toBe(true);
            expect(result.requiredDelta).toBe(500);
            expect(result.actualDelta).toBe(500);
        });

        it('accepts threshold exceeding delta floor', () => {
            // Baseline 10000, target 11000 = delta 1000
            // Required delta = 500
            const result = validateDeltaFloor(10000, 11000);

            expect(result.valid).toBe(true);
            expect(result.actualDelta).toBe(1000);
        });

        it('rejects negative delta (threshold below baseline)', () => {
            const result = validateDeltaFloor(15000, 14000);

            expect(result.valid).toBe(false);
            expect(result.actualDelta).toBe(-1000);
        });
    });

    describe('Delta Floor Constants', () => {
        it('has correct absolute minimum', () => {
            expect(X_DELTA_FLOOR.ABSOLUTE_MIN).toBe(500);
        });

        it('has correct percentage', () => {
            expect(X_DELTA_FLOOR.PERCENTAGE).toBe(0.05);
        });
    });
});

// =============================================================================
// 3. MULTI-SAMPLE VERIFICATION TESTS
// =============================================================================

describe('Multi-Sample Verification', () => {
    describe('evaluateSamples', () => {
        it('passes with 3 consecutive samples above threshold', () => {
            const samples: FollowerSample[] = [
                { timestampUtc: new Date().toISOString(), followers: 11000 },
                { timestampUtc: new Date().toISOString(), followers: 11100 },
                { timestampUtc: new Date().toISOString(), followers: 11200 },
            ];

            const result = evaluateSamples(samples, 10500, 'GTE', 3);

            expect(result.pass).toBe(true);
            expect(result.consecutivePassCount).toBe(3);
        });

        it('fails when only 2 consecutive samples pass', () => {
            const samples: FollowerSample[] = [
                { timestampUtc: new Date().toISOString(), followers: 11000 },
                { timestampUtc: new Date().toISOString(), followers: 11100 },
                { timestampUtc: new Date().toISOString(), followers: 10400 }, // Below
            ];

            const result = evaluateSamples(samples, 10500, 'GTE', 3);

            expect(result.pass).toBe(false);
            expect(result.consecutivePassCount).toBe(2);
        });

        it('fails single-spike pattern (anti-manipulation)', () => {
            const samples: FollowerSample[] = [
                { timestampUtc: new Date().toISOString(), followers: 10400 }, // Below
                { timestampUtc: new Date().toISOString(), followers: 11000 }, // Spike!
                { timestampUtc: new Date().toISOString(), followers: 10400 }, // Below
            ];

            const result = evaluateSamples(samples, 10500, 'GTE', 3);

            expect(result.pass).toBe(false);
            expect(result.consecutivePassCount).toBe(1);
        });

        it('fails all-below pattern', () => {
            const samples: FollowerSample[] = [
                { timestampUtc: new Date().toISOString(), followers: 10000 },
                { timestampUtc: new Date().toISOString(), followers: 10100 },
                { timestampUtc: new Date().toISOString(), followers: 10200 },
            ];

            const result = evaluateSamples(samples, 10500, 'GTE', 3);

            expect(result.pass).toBe(false);
            expect(result.consecutivePassCount).toBe(0);
        });

        it('handles operator GT correctly', () => {
            const samples: FollowerSample[] = [
                { timestampUtc: new Date().toISOString(), followers: 10500 }, // Equal, not GT
                { timestampUtc: new Date().toISOString(), followers: 10501 },
                { timestampUtc: new Date().toISOString(), followers: 10502 },
            ];

            const result = evaluateSamples(samples, 10500, 'GT', 3);

            expect(result.pass).toBe(false);
            expect(result.consecutivePassCount).toBe(2);
        });
    });
});

// =============================================================================
// 4. FAIL-CLOSED BEHAVIOR
// =============================================================================

describe('Fail-Closed Behavior', () => {
    it('eligibility check requires all gates to pass', () => {
        // Account that fails just one gate (protected)
        const health = createHealth({ protected: true });
        health.publicMetrics.followersCount = 50000; // More than enough
        health.publicMetrics.tweetCount = 5000; // More than enough

        const result = checkXEligibility(health);

        expect(result.eligible).toBe(false);
        expect(result.reasonCode).toBe('X_INELIGIBLE_PROTECTED');
    });

    it('delta floor check returns explicit validation result', () => {
        // Edge case: exact boundary
        const result = validateDeltaFloor(10000, 10499);

        expect(result.valid).toBe(false);
        expect(result.requiredDelta).toBe(500);
        expect(result.actualDelta).toBe(499);
    });
});

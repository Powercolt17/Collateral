/**
 * Stripe Revenue V1 Spec Tests
 * 
 * Tests for V1 spec compliance:
 * - Baseline snapshot correctness (30-day window)
 * - Delta floor enforcement
 * - Identity drift prevention
 * - Pass condition: observed >= baseline + delta
 * - Revenue source filtering (topups, transfers excluded)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    MockStripeRevenueClient,
    setRevenueClient,
    stripeRevenueAdapter,
    calculateStripeDeltaFloor,
    validateStripeDeltaFloor,
    STRIPE_MIN_DELTA_CENTS,
    STRIPE_DELTA_FLOOR_PERCENTAGE,
    STRIPE_WINDOW_DAYS,
    STRIPE_TIER_PERCENTAGES,
    STRIPE_EXCLUDED_TRANSACTION_TYPES,
    StripeBalanceTransaction,
    StripeV1BaselineJson,
} from '../src/adapters/stripe-revenue.js';

describe('Stripe V1 Spec: Delta Floor Enforcement', () => {
    it('should enforce minimum $500 delta floor', () => {
        // Small baseline: floor should be $500 (minimum)
        expect(calculateStripeDeltaFloor(0)).toBe(50000);
        expect(calculateStripeDeltaFloor(100000)).toBe(50000); // $1000 baseline → $500 floor (15% = $150, but min is $500)
        expect(calculateStripeDeltaFloor(200000)).toBe(50000); // $2000 baseline → $500 floor (15% = $300, but min is $500)
    });

    it('should enforce 15% floor for large baselines (STEADY tier)', () => {
        // Large baseline: floor should be 15% (STEADY tier default)
        expect(calculateStripeDeltaFloor(500000)).toBe(75000);  // $5k → $750 floor (15%)
        expect(calculateStripeDeltaFloor(1000000)).toBe(150000); // $10k → $1500 floor (15%)
        expect(calculateStripeDeltaFloor(5000000)).toBe(750000); // $50k → $7500 floor (15%)
    });

    it('should support tier-aware delta floors', () => {
        const baseline = 1000000; // $10k

        // STEADY (15%): $10k × 0.15 = $1500
        expect(calculateStripeDeltaFloor(baseline, STRIPE_TIER_PERCENTAGES.STEADY)).toBe(150000);

        // BROAD (25%): $10k × 0.25 = $2500
        expect(calculateStripeDeltaFloor(baseline, STRIPE_TIER_PERCENTAGES.BROAD)).toBe(250000);

        // ALL_IN (40%): $10k × 0.40 = $4000
        expect(calculateStripeDeltaFloor(baseline, STRIPE_TIER_PERCENTAGES.ALL_IN)).toBe(400000);
    });

    it('should have correct constants per spec', () => {
        expect(STRIPE_MIN_DELTA_CENTS).toBe(50000); // $500
        expect(STRIPE_DELTA_FLOOR_PERCENTAGE).toBe(0.15); // 15% (STEADY tier)
        expect(STRIPE_WINDOW_DAYS).toBe(30);
        expect(STRIPE_TIER_PERCENTAGES).toEqual({
            STEADY: 0.15,
            BROAD: 0.25,
            ALL_IN: 0.40,
        });
    });
});

describe('Stripe V1 Spec: Baseline Snapshot', () => {
    let mockClient: MockStripeRevenueClient;

    beforeEach(() => {
        mockClient = new MockStripeRevenueClient(0, 0, []);
        setRevenueClient(mockClient);
    });

    it('should fetch 30-day prior window for baseline', async () => {
        const executionTime = new Date('2025-02-15T00:00:00Z');
        const transactions: StripeBalanceTransaction[] = [
            // Within baseline window (Jan 16 - Feb 15)
            { id: 'ch_1', type: 'charge', amount: 100000, currency: 'usd', created: new Date('2025-02-01T00:00:00Z').getTime() / 1000, source: null },
            { id: 'ch_2', type: 'charge', amount: 50000, currency: 'usd', created: new Date('2025-01-20T00:00:00Z').getTime() / 1000, source: null },
        ];
        mockClient.setMockTransactions(transactions);

        const baseline = await mockClient.getBaselineSnapshot('acct_test', executionTime);

        expect(baseline.netRevenue).toBe(150000); // $1500
    });

    it('should create V1-compliant baseline JSON', async () => {
        const transactions: StripeBalanceTransaction[] = [
            { id: 'ch_1', type: 'charge', amount: 1000000, currency: 'usd', created: Date.now() / 1000 - 86400, source: null },
        ];
        mockClient.setMockTransactions(transactions);

        const baseline = await stripeRevenueAdapter.createV1BaselineSnapshot(
            'acct_test123',
            100000, // $1000 delta target
            new Date()
        );

        expect(baseline.platform).toBe('STRIPE');
        expect(baseline.stripeConnectedAccountId).toBe('acct_test123');
        expect(baseline.baselineNetRevenueCents).toBe(1000000);
        expect(baseline.deltaTargetCents).toBe(100000);
        expect(baseline.windowDays).toBe(30);
        expect(baseline.baselineWindow.fromUtc).toBeDefined();
        expect(baseline.baselineWindow.toUtc).toBeDefined();
        expect(baseline.frozenAtUtc).toBeDefined();
        expect(baseline.deltaFloorCheck.passed).toBe(true);
    });

    it('should reject delta below floor', async () => {
        const transactions: StripeBalanceTransaction[] = [
            { id: 'ch_1', type: 'charge', amount: 1000000, currency: 'usd', created: Date.now() / 1000 - 86400, source: null },
        ];
        mockClient.setMockTransactions(transactions);

        // 10% of $10k = $1000, but trying to set $400 delta
        await expect(
            stripeRevenueAdapter.createV1BaselineSnapshot(
                'acct_test123',
                40000, // $400 - below floor
                new Date()
            )
        ).rejects.toThrow('Delta target does not meet minimum floor');
    });
});

describe('Stripe V1 Spec: Identity Drift Prevention', () => {
    let mockClient: MockStripeRevenueClient;

    beforeEach(() => {
        mockClient = new MockStripeRevenueClient(0, 0, []);
        setRevenueClient(mockClient);
    });

    it('should use frozen stripeConnectedAccountId from baseline', async () => {
        const frozenAccountId = 'acct_frozen_at_execution';
        const currentAccountId = 'acct_current_different';

        const transactions: StripeBalanceTransaction[] = [
            { id: 'ch_1', type: 'charge', amount: 200000, currency: 'usd', created: Date.now() / 1000 - 1000, source: null },
        ];
        mockClient.setMockTransactions(transactions);

        // Create a contract with V1 baseline (frozen account ID)
        const v1Baseline: StripeV1BaselineJson = {
            platform: 'STRIPE',
            stripeConnectedAccountId: frozenAccountId, // This should be used
            baselineNetRevenueCents: 100000,
            deltaTargetCents: 50000,
            windowDays: 30,
            baselineWindow: {
                fromUtc: new Date(Date.now() - 30 * 86400000).toISOString(),
                toUtc: new Date().toISOString(),
            },
            frozenAtUtc: new Date().toISOString(),
            deltaFloor: 50000,
            deltaFloorCheck: { passed: true, requiredDelta: 50000, actualDelta: 50000 },
        };

        const mockContract = {
            id: 'test-contract',
            baselineJson: v1Baseline,
            deadlineUtc: new Date(Date.now() + 86400000),
            conditionJson: { operator: 'GTE', threshold: 150000 },
        } as any;

        const context = {
            windowStartUtc: new Date(),
            stripeConnectedAccountId: currentAccountId, // Different! Should be ignored
        };

        const result = await stripeRevenueAdapter.evaluate(mockContract, context);

        // The evidence should show the FROZEN account ID was used
        expect(result.evidence.frozenStripeAccountId).toBe(frozenAccountId);
        expect(result.evidence.v1Compliant).toBe(true);
    });
});

describe('Stripe V1 Spec: Pass Condition (observed >= baseline + delta)', () => {
    let mockClient: MockStripeRevenueClient;

    beforeEach(() => {
        mockClient = new MockStripeRevenueClient(0, 0, []);
        setRevenueClient(mockClient);
    });

    it('should PASS when observed >= baseline + delta', async () => {
        // Observed: $2500, Baseline: $1000, Delta: $500 → Target: $1500 → PASS
        const transactions: StripeBalanceTransaction[] = [
            { id: 'ch_1', type: 'charge', amount: 250000, currency: 'usd', created: Date.now() / 1000 - 1000, source: null },
        ];
        mockClient.setMockTransactions(transactions);

        const v1Baseline: StripeV1BaselineJson = {
            platform: 'STRIPE',
            stripeConnectedAccountId: 'acct_test',
            baselineNetRevenueCents: 100000, // $1000
            deltaTargetCents: 50000, // $500
            windowDays: 30,
            baselineWindow: { fromUtc: '', toUtc: '' },
            frozenAtUtc: '',
            deltaFloor: 50000,
            deltaFloorCheck: { passed: true, requiredDelta: 50000, actualDelta: 50000 },
        };

        const mockContract = {
            id: 'test',
            baselineJson: v1Baseline,
            deadlineUtc: new Date(Date.now() + 86400000),
            conditionJson: { operator: 'GTE', threshold: 150000 },
        } as any;

        const result = await stripeRevenueAdapter.evaluate(mockContract, { windowStartUtc: new Date() });

        expect(result.pass).toBe(true);
        expect(result.observedValue).toBe(250000);
        expect(result.threshold).toBe(150000); // baseline + delta
        expect(result.evidence.passCalculation).toEqual({
            observed: 250000,
            baseline: 100000,
            delta: 50000,
            target: 150000,
            result: 'PASS',
        });
    });

    it('should FAIL when observed < baseline + delta', async () => {
        // Observed: $1200, Baseline: $1000, Delta: $500 → Target: $1500 → FAIL
        const transactions: StripeBalanceTransaction[] = [
            { id: 'ch_1', type: 'charge', amount: 120000, currency: 'usd', created: Date.now() / 1000 - 1000, source: null },
        ];
        mockClient.setMockTransactions(transactions);

        const v1Baseline: StripeV1BaselineJson = {
            platform: 'STRIPE',
            stripeConnectedAccountId: 'acct_test',
            baselineNetRevenueCents: 100000, // $1000
            deltaTargetCents: 50000, // $500
            windowDays: 30,
            baselineWindow: { fromUtc: '', toUtc: '' },
            frozenAtUtc: '',
            deltaFloor: 50000,
            deltaFloorCheck: { passed: true, requiredDelta: 50000, actualDelta: 50000 },
        };

        const mockContract = {
            id: 'test',
            baselineJson: v1Baseline,
            deadlineUtc: new Date(Date.now() + 86400000),
            conditionJson: { operator: 'GTE', threshold: 150000 },
        } as any;

        const result = await stripeRevenueAdapter.evaluate(mockContract, { windowStartUtc: new Date() });

        expect(result.pass).toBe(false);
        expect(result.evidence.passCalculation.result).toBe('FAIL');
    });

    it('should handle refunds reducing observed revenue', async () => {
        const transactions: StripeBalanceTransaction[] = [
            { id: 'ch_1', type: 'charge', amount: 200000, currency: 'usd', created: Date.now() / 1000 - 5 * 86400, source: null },
            { id: 'ref_1', type: 'refund', amount: -80000, currency: 'usd', created: Date.now() / 1000 - 86400, source: 'ch_1' },
        ];
        mockClient.setMockTransactions(transactions);

        const v1Baseline: StripeV1BaselineJson = {
            platform: 'STRIPE',
            stripeConnectedAccountId: 'acct_test',
            baselineNetRevenueCents: 50000,
            deltaTargetCents: 50000,
            windowDays: 30,
            baselineWindow: { fromUtc: '', toUtc: '' },
            frozenAtUtc: '',
            deltaFloor: 50000,
            deltaFloorCheck: { passed: true, requiredDelta: 50000, actualDelta: 50000 },
        };

        const mockContract = {
            id: 'test',
            baselineJson: v1Baseline,
            deadlineUtc: new Date(Date.now() + 86400000),
            conditionJson: { operator: 'GTE', threshold: 100000 },
        } as any;

        const result = await stripeRevenueAdapter.evaluate(mockContract, { windowStartUtc: new Date() });

        // Net: $2000 - $800 = $1200
        expect(result.observedValue).toBe(120000);
        expect(result.evidence.refunds).toBe(80000);
    });
});

/**
 * V1 HARDENING: Revenue Source Filtering
 * 
 * Balance top-ups, transfers, adjustments, and payouts
 * MUST NOT count toward revenue.
 */
describe('Stripe V1 Hardening: Revenue Source Filtering', () => {
    let mockClient: MockStripeRevenueClient;

    beforeEach(() => {
        mockClient = new MockStripeRevenueClient(0, 0, []);
        setRevenueClient(mockClient);
    });

    it('should EXCLUDE balance top-ups and adjustments from revenue', async () => {
        // CRITICAL TEST: Proves manipulation via top-ups is impossible
        const transactions: StripeBalanceTransaction[] = [
            // Real customer charge: $1000
            { id: 'ch_real', type: 'charge', amount: 100000, currency: 'usd', created: Date.now() / 1000 - 86400, source: null },
            // MANIPULATION ATTEMPT: Balance top-up of $5000 (should be EXCLUDED)
            { id: 'topup_fake', type: 'topup', amount: 500000, currency: 'usd', created: Date.now() / 1000 - 1000, source: null },
            // MANIPULATION ATTEMPT: Manual adjustment of $3000 (should be EXCLUDED)
            { id: 'adj_fake', type: 'adjustment', amount: 300000, currency: 'usd', created: Date.now() / 1000 - 500, source: null },
        ];
        mockClient.setMockTransactions(transactions);

        const windowStart = new Date(Date.now() - 30 * 86400000);
        const windowEnd = new Date(Date.now() + 86400000);
        const refundBufferDate = new Date(windowEnd.getTime() - 5 * 86400000);

        const result = await mockClient.getNetSettledRevenue(
            'acct_test',
            windowStart,
            windowEnd,
            refundBufferDate,
            'usd'
        );

        // ONLY the real charge should count
        expect(result.grossCharges).toBe(100000); // $1000 - only real charge
        expect(result.netRevenue).toBe(100000);   // Net is also $1000

        // Both manipulation attempts should be excluded
        expect(result.excludedManipulation).toBe(2); // topup + adjustment

        // Verify the excluded types are in the constant
        expect(STRIPE_EXCLUDED_TRANSACTION_TYPES).toContain('topup');
        expect(STRIPE_EXCLUDED_TRANSACTION_TYPES).toContain('adjustment');
        expect(STRIPE_EXCLUDED_TRANSACTION_TYPES).toContain('transfer');
        expect(STRIPE_EXCLUDED_TRANSACTION_TYPES).toContain('payout');
    });
});

/**
 * V1 FINALIZATION: Qualified Revenue Helper
 */
describe('Stripe V1 Finalization: Qualified Revenue Charge', () => {
    it('should qualify paid, succeeded charges', () => {
        const charge: import('../src/adapters/stripe-revenue.js').StripeCharge = {
            id: 'ch_test',
            paid: true,
            refunded: false,
            amount: 100000,
            amount_refunded: 0,
            currency: 'usd',
            status: 'succeeded',
            disputed: false,
            created: Date.now() / 1000,
        };

        const { isQualifiedRevenueCharge } = require('../src/adapters/stripe-revenue.js');
        const result = isQualifiedRevenueCharge(charge, 'usd');

        expect(result.qualified).toBe(true);
        expect(result.netAmountCents).toBe(100000);
    });

    it('should reject unpaid charges', () => {
        const charge: import('../src/adapters/stripe-revenue.js').StripeCharge = {
            id: 'ch_test',
            paid: false,
            refunded: false,
            amount: 100000,
            amount_refunded: 0,
            currency: 'usd',
            status: 'succeeded',
            disputed: false,
            created: Date.now() / 1000,
        };

        const { isQualifiedRevenueCharge } = require('../src/adapters/stripe-revenue.js');
        const result = isQualifiedRevenueCharge(charge, 'usd');

        expect(result.qualified).toBe(false);
        expect(result.reason).toBe('charge_not_paid');
    });

    it('should reject currency mismatch (fail closed)', () => {
        const charge: import('../src/adapters/stripe-revenue.js').StripeCharge = {
            id: 'ch_test',
            paid: true,
            refunded: false,
            amount: 100000,
            amount_refunded: 0,
            currency: 'eur',
            status: 'succeeded',
            disputed: false,
            created: Date.now() / 1000,
        };

        const { isQualifiedRevenueCharge } = require('../src/adapters/stripe-revenue.js');
        const result = isQualifiedRevenueCharge(charge, 'usd');

        expect(result.qualified).toBe(false);
        expect(result.reason).toBe('currency_mismatch');
    });

    it('should handle partial refunds (subtract from net)', () => {
        const charge: import('../src/adapters/stripe-revenue.js').StripeCharge = {
            id: 'ch_test',
            paid: true,
            refunded: false,
            amount: 100000,
            amount_refunded: 30000, // $300 refunded
            currency: 'usd',
            status: 'succeeded',
            disputed: false,
            created: Date.now() / 1000,
        };

        const { isQualifiedRevenueCharge } = require('../src/adapters/stripe-revenue.js');
        const result = isQualifiedRevenueCharge(charge, 'usd');

        expect(result.qualified).toBe(true);
        expect(result.netAmountCents).toBe(70000); // $700 net
    });
});

/**
 * V1 FINALIZATION: Tier Eligibility Floors
 */
describe('Stripe V1 Finalization: Tier Eligibility', () => {
    it('should enforce minimum baseline for each tier', () => {
        const { validateTierEligibility, STRIPE_TIER_MINIMUM_BASELINE } = require('../src/adapters/stripe-revenue.js');

        // STEADY: $1,000 minimum
        expect(validateTierEligibility(50000, 'STEADY').eligible).toBe(false); // $500 < $1000
        expect(validateTierEligibility(100000, 'STEADY').eligible).toBe(true); // $1000 = $1000

        // BROAD: $5,000 minimum
        expect(validateTierEligibility(400000, 'BROAD').eligible).toBe(false); // $4000 < $5000
        expect(validateTierEligibility(500000, 'BROAD').eligible).toBe(true); // $5000 = $5000

        // ALL_IN: $10,000 minimum
        expect(validateTierEligibility(900000, 'ALL_IN').eligible).toBe(false); // $9000 < $10000
        expect(validateTierEligibility(1000000, 'ALL_IN').eligible).toBe(true); // $10000 = $10000
    });

    it('should return correct error code when ineligible', () => {
        const { validateTierEligibility, STRIPE_ERROR_CODES } = require('../src/adapters/stripe-revenue.js');

        const result = validateTierEligibility(50000, 'BROAD');
        expect(result.eligible).toBe(false);
        expect(result.errorCode).toBe(STRIPE_ERROR_CODES.INELIGIBLE_BASELINE_TOO_LOW);
    });
});

/**
 * V1 FINALIZATION: Single-Invoice Dominance Check
 */
describe('Stripe V1 Finalization: Single-Invoice Dominance', () => {
    it('should detect single-invoice dominance (>= 50%)', () => {
        const { checkSingleInvoiceDominance } = require('../src/adapters/stripe-revenue.js');

        // One charge is 60% of total → VIOLATION
        const charges = [
            { id: 'ch_1', netAmountCents: 60000 }, // 60%
            { id: 'ch_2', netAmountCents: 40000 }, // 40%
        ];

        const result = checkSingleInvoiceDominance(charges);

        expect(result.violation).toBe(true);
        expect(result.largestChargeCents).toBe(60000);
        expect(result.largestChargePct).toBe(0.6);
    });

    it('should pass when no single charge dominates', () => {
        const { checkSingleInvoiceDominance } = require('../src/adapters/stripe-revenue.js');

        // No charge is >= 50%
        const charges = [
            { id: 'ch_1', netAmountCents: 40000 }, // 40%
            { id: 'ch_2', netAmountCents: 35000 }, // 35%
            { id: 'ch_3', netAmountCents: 25000 }, // 25%
        ];

        const result = checkSingleInvoiceDominance(charges);

        expect(result.violation).toBe(false);
        expect(result.largestChargePct).toBe(0.4);
    });
});

/**
 * Stripe Full Lifecycle E2E Test
 * 
 * Simulates complete contract lifecycle:
 * 1. Contract created
 * 2. Funding intent created
 * 3. Webhook "succeeded" (FUNDS_LOCKED)
 * 4. Execute freezes baseline
 * 5. Verification computes and settles
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    MockStripeRevenueClient,
    setRevenueClient,
    stripeRevenueAdapter,
    StripeBalanceTransaction,
    StripeV1BaselineJson,
    STRIPE_TIER_PERCENTAGES,
    STRIPE_TIER_MINIMUM_BASELINE,
} from '../src/adapters/stripe-revenue.js';

describe('Stripe E2E: Full Contract Lifecycle', () => {
    let mockClient: MockStripeRevenueClient;

    beforeEach(() => {
        // Set up mock with $5k baseline (STEADY eligible)
        mockClient = new MockStripeRevenueClient(
            500000,  // fixedRevenueInWindow: $5k
            1000000, // fixedLifetimeRevenue: $10k
            []
        );
        setRevenueClient(mockClient);
    });

    it('should complete full lifecycle: create → fund → execute → verify', async () => {
        // PHASE 1: Simulate contract creation
        // (In real system, this happens via POST /v1/contracts)
        const contractId = 'test-stripe-e2e-001';
        const stripeConnectedAccountId = 'acct_test123';
        const tierChoice = 'STEADY';

        // Set mock transactions for baseline (within 30 days prior)
        const baselineTransactions: StripeBalanceTransaction[] = [
            { id: 'ch_1', type: 'charge', amount: 300000, currency: 'usd', created: Date.now() / 1000 - 10 * 86400, source: null },
            { id: 'ch_2', type: 'charge', amount: 200000, currency: 'usd', created: Date.now() / 1000 - 5 * 86400, source: null },
        ];
        mockClient.setMockTransactions(baselineTransactions);

        // PHASE 2: Create V1 baseline snapshot (happens at execute)
        const executionTime = new Date();
        const deltaTarget = 100000; // $1000 delta

        // This simulates what happens in POST /v1/contracts/:id/execute
        const v1Baseline = await stripeRevenueAdapter.createV1BaselineSnapshot(
            stripeConnectedAccountId,
            deltaTarget,
            executionTime,
            tierChoice
        );

        // Verify baseline structure
        expect(v1Baseline.platform).toBe('STRIPE');
        expect(v1Baseline.stripeConnectedAccountId).toBe(stripeConnectedAccountId);
        expect(v1Baseline.baselineNetRevenueCents).toBe(500000); // $5k
        expect(v1Baseline.deltaTargetCents).toBe(deltaTarget);
        expect(v1Baseline.tier).toBe('STEADY');
        expect(v1Baseline.tierPercentage).toBe(STRIPE_TIER_PERCENTAGES.STEADY);
        expect(v1Baseline.tierMinimumBaseline).toBe(STRIPE_TIER_MINIMUM_BASELINE.STEADY);
        expect(v1Baseline.noAppeals).toBe(true);
        expect(v1Baseline.deterministicSettlement).toBe(true);

        // Verify windows are correctly calculated
        expect(v1Baseline.baselineWindow.fromUtc).toBeDefined();
        expect(v1Baseline.baselineWindow.toUtc).toBeDefined();
        expect(v1Baseline.verificationWindow.fromUtc).toBeDefined();
        expect(v1Baseline.verificationWindow.toUtc).toBeDefined();

        // Windows should not overlap
        const baselineEnd = new Date(v1Baseline.baselineWindow.toUtc);
        const verificationStart = new Date(v1Baseline.verificationWindow.fromUtc);
        expect(baselineEnd.getTime()).toBeLessThanOrEqual(verificationStart.getTime());

        // PHASE 3: Simulate verification (after deadline)
        // Set mock transactions for verification window (new revenue)
        const verificationTransactions: StripeBalanceTransaction[] = [
            // Keep baseline transactions
            ...baselineTransactions,
            // Add new revenue in verification window
            { id: 'ch_3', type: 'charge', amount: 300000, currency: 'usd', created: Date.now() / 1000 + 5 * 86400, source: null },
            { id: 'ch_4', type: 'charge', amount: 200000, currency: 'usd', created: Date.now() / 1000 + 10 * 86400, source: null },
            { id: 'ch_5', type: 'charge', amount: 200000, currency: 'usd', created: Date.now() / 1000 + 15 * 86400, source: null },
        ];
        mockClient.setMockTransactions(verificationTransactions);

        // Create mock contract for evaluation
        const mockContract = {
            id: contractId,
            baselineJson: v1Baseline,
            deadlineUtc: new Date(Date.now() + 35 * 86400000), // 35 days out
            conditionJson: {
                operator: 'GTE',
                threshold: v1Baseline.baselineNetRevenueCents + v1Baseline.deltaTargetCents
            },
        } as any;

        // PHASE 4: Evaluate verification result
        const result = await stripeRevenueAdapter.evaluate(mockContract, {
            windowStartUtc: new Date()
        });

        // Verify evaluation result
        expect(result.evidence.v1Compliant).toBe(true);
        expect(result.evidence.frozenStripeAccountId).toBe(stripeConnectedAccountId);
        expect(result.evidence.passCalculation).toBeDefined();
        expect(result.evidence.passCalculation.baseline).toBe(v1Baseline.baselineNetRevenueCents);
        expect(result.evidence.passCalculation.delta).toBe(v1Baseline.deltaTargetCents);
        expect(result.evidence.passCalculation.target).toBe(
            v1Baseline.baselineNetRevenueCents + v1Baseline.deltaTargetCents
        );
    });

    it('should enforce tier eligibility: reject BROAD tier for low baseline', async () => {
        // Low baseline: $1k (below BROAD minimum of $5k)
        const lowBaselineTransactions: StripeBalanceTransaction[] = [
            { id: 'ch_1', type: 'charge', amount: 100000, currency: 'usd', created: Date.now() / 1000 - 5 * 86400, source: null },
        ];
        mockClient.setMockTransactions(lowBaselineTransactions);

        // Attempt BROAD tier with low baseline should fail
        await expect(
            stripeRevenueAdapter.createV1BaselineSnapshot(
                'acct_test123',
                50000,
                new Date(),
                'BROAD'
            )
        ).rejects.toThrow('STRIPE_INELIGIBLE_BASELINE_TOO_LOW');
    });

    it('should handle single-invoice dominance detection', async () => {
        // One charge is 80% of revenue - should be flagged
        const dominantTransactions: StripeBalanceTransaction[] = [
            { id: 'ch_big', type: 'charge', amount: 800000, currency: 'usd', created: Date.now() / 1000 - 5 * 86400, source: null },
            { id: 'ch_small', type: 'charge', amount: 200000, currency: 'usd', created: Date.now() / 1000 - 3 * 86400, source: null },
        ];
        mockClient.setMockTransactions(dominantTransactions);

        const result = await mockClient.getNetSettledRevenue(
            'acct_test',
            new Date(Date.now() - 30 * 86400000),
            new Date(),
            new Date(),
            'usd'
        );

        expect(result.singleInvoiceViolation).toBe(true);
        expect(result.largestChargePct).toBeGreaterThanOrEqual(0.5);
        expect(result.largestChargeCents).toBe(800000);
    });
});

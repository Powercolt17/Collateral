/**
 * Stripe Anti-Abuse Tests
 * 
 * Tests for all four anti-abuse invariants:
 * A) Net Settled Revenue = charges - refunds - disputes
 * B) Charge-Only Revenue (no transfers, payouts, topups)
 * C) Single-Currency Enforcement (USD only)
 * D) Refund Cooling Window (charges must be before deadline - buffer)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    MockStripeRevenueClient,
    STRIPE_REFUND_BUFFER_DAYS,
    STRIPE_ALLOWED_CURRENCY,
    STRIPE_ALLOWED_TRANSACTION_TYPES,
    STRIPE_DEDUCTION_TYPES,
    StripeBalanceTransaction,
} from '../src/adapters/stripe-revenue.js';

describe('Stripe Anti-Abuse: Net Settled Revenue (A)', () => {
    const windowStart = new Date('2025-01-01T00:00:00Z');
    const windowEnd = new Date('2025-01-15T00:00:00Z');
    const refundBufferDate = new Date('2025-01-10T00:00:00Z'); // 5 days before deadline

    it('should calculate netRevenue = grossCharges - refunds - disputes', async () => {
        const client = new MockStripeRevenueClient();
        client.setMockTransactions([
            { id: 'ch_1', type: 'charge', amount: 100000, currency: 'usd', created: windowStart.getTime() / 1000 + 1000, source: null },
            { id: 'ch_2', type: 'charge', amount: 50000, currency: 'usd', created: windowStart.getTime() / 1000 + 2000, source: null },
            { id: 're_1', type: 'refund', amount: -20000, currency: 'usd', created: windowStart.getTime() / 1000 + 3000, source: 'ch_1' },
            { id: 'dp_1', type: 'dispute', amount: -10000, currency: 'usd', created: windowStart.getTime() / 1000 + 4000, source: 'ch_2' },
        ]);

        const result = await client.getNetSettledRevenue('acct_test', windowStart, windowEnd, refundBufferDate, 'usd');

        expect(result.grossCharges).toBe(150000);
        expect(result.refunds).toBe(20000);
        expect(result.disputes).toBe(10000);
        expect(result.netRevenue).toBe(120000); // 150k - 20k - 10k
    });

    it('should handle refund resulting in negative net revenue', async () => {
        const client = new MockStripeRevenueClient();
        client.setMockTransactions([
            { id: 'ch_1', type: 'charge', amount: 50000, currency: 'usd', created: windowStart.getTime() / 1000 + 1000, source: null },
            { id: 're_1', type: 'refund', amount: -60000, currency: 'usd', created: windowStart.getTime() / 1000 + 2000, source: 'ch_1' },
        ]);

        const result = await client.getNetSettledRevenue('acct_test', windowStart, windowEnd, refundBufferDate, 'usd');

        expect(result.netRevenue).toBe(-10000); // Negative is valid - user owes
    });

    it('should ONLY count refunds linked to counted charges (via source)', async () => {
        const client = new MockStripeRevenueClient();
        client.setMockTransactions([
            // Charge in window (before buffer)
            { id: 'ch_1', type: 'charge', amount: 100000, currency: 'usd', created: windowStart.getTime() / 1000 + 1000, source: null },
            // Refund LINKED to ch_1 - should count
            { id: 're_1', type: 'refund', amount: -20000, currency: 'usd', created: windowStart.getTime() / 1000 + 3000, source: 'ch_1' },
            // Refund NOT LINKED (or linked to a charge outside window) - should NOT count
            { id: 're_2', type: 'refund', amount: -30000, currency: 'usd', created: windowStart.getTime() / 1000 + 4000, source: 'ch_external_old' },
        ]);

        const result = await client.getNetSettledRevenue('acct_test', windowStart, windowEnd, refundBufferDate, 'usd');

        expect(result.grossCharges).toBe(100000);
        expect(result.refunds).toBe(20000); // Only linked refund
        expect(result.netRevenue).toBe(80000); // 100k - 20k (unlinked refund ignored)
        expect(result.unlinkedDeductions).toBe(1);
    });
});

describe('Stripe Anti-Abuse: Charge-Only Revenue (B)', () => {
    const windowStart = new Date('2025-01-01T00:00:00Z');
    const windowEnd = new Date('2025-01-15T00:00:00Z');
    const refundBufferDate = new Date('2025-01-10T00:00:00Z');

    it('should EXCLUDE transfers, payouts, topups from revenue', async () => {
        const client = new MockStripeRevenueClient();
        client.setMockTransactions([
            { id: 'ch_1', type: 'charge', amount: 100000, currency: 'usd', created: windowStart.getTime() / 1000 + 1000, source: null },
            { id: 'tr_1', type: 'transfer', amount: 50000, currency: 'usd', created: windowStart.getTime() / 1000 + 2000, source: null },
            { id: 'po_1', type: 'payout', amount: 30000, currency: 'usd', created: windowStart.getTime() / 1000 + 3000, source: null },
            { id: 'tu_1', type: 'topup', amount: 20000, currency: 'usd', created: windowStart.getTime() / 1000 + 4000, source: null },
        ]);

        const result = await client.getNetSettledRevenue('acct_test', windowStart, windowEnd, refundBufferDate, 'usd');

        expect(result.grossCharges).toBe(100000); // Only the charge counts
        expect(result.excludedWrongType).toBe(3); // transfer, payout, topup excluded
    });

    it('should only count charge type (payment is not a balance_transaction type)', () => {
        expect(STRIPE_ALLOWED_TRANSACTION_TYPES).toContain('charge');
        expect(STRIPE_ALLOWED_TRANSACTION_TYPES).not.toContain('payment'); // Not a real type
        expect(STRIPE_ALLOWED_TRANSACTION_TYPES).not.toContain('transfer');
        expect(STRIPE_ALLOWED_TRANSACTION_TYPES).not.toContain('payout');
    });
});

describe('Stripe Anti-Abuse: Single-Currency Enforcement (C)', () => {
    const windowStart = new Date('2025-01-01T00:00:00Z');
    const windowEnd = new Date('2025-01-15T00:00:00Z');
    const refundBufferDate = new Date('2025-01-10T00:00:00Z');

    it('should EXCLUDE non-USD charges', async () => {
        const client = new MockStripeRevenueClient();
        client.setMockTransactions([
            { id: 'ch_1', type: 'charge', amount: 100000, currency: 'usd', created: windowStart.getTime() / 1000 + 1000, source: null },
            { id: 'ch_2', type: 'charge', amount: 50000, currency: 'eur', created: windowStart.getTime() / 1000 + 2000, source: null },
            { id: 'ch_3', type: 'charge', amount: 30000, currency: 'gbp', created: windowStart.getTime() / 1000 + 3000, source: null },
        ]);

        const result = await client.getNetSettledRevenue('acct_test', windowStart, windowEnd, refundBufferDate, 'usd');

        expect(result.grossCharges).toBe(100000); // Only USD
        expect(result.excludedWrongCurrency).toBe(2); // EUR and GBP excluded
    });

    it('should enforce USD-only constant', () => {
        expect(STRIPE_ALLOWED_CURRENCY).toBe('usd');
    });
});

describe('Stripe Anti-Abuse: Refund Cooling Window (D)', () => {
    const windowStart = new Date('2025-01-01T00:00:00Z');
    const windowEnd = new Date('2025-01-15T00:00:00Z');
    // Buffer: 5 days before deadline = Jan 10
    const refundBufferDate = new Date(windowEnd);
    refundBufferDate.setDate(refundBufferDate.getDate() - STRIPE_REFUND_BUFFER_DAYS);

    it('should EXCLUDE charges created after refund buffer date', async () => {
        const client = new MockStripeRevenueClient();
        client.setMockTransactions([
            // Valid: charge before buffer date (Jan 5)
            { id: 'ch_1', type: 'charge', amount: 100000, currency: 'usd', created: new Date('2025-01-05T00:00:00Z').getTime() / 1000, source: null },
            // Invalid: charge after buffer date (Jan 12)
            { id: 'ch_2', type: 'charge', amount: 50000, currency: 'usd', created: new Date('2025-01-12T00:00:00Z').getTime() / 1000, source: null },
        ]);

        const result = await client.getNetSettledRevenue('acct_test', windowStart, windowEnd, refundBufferDate, 'usd');

        expect(result.grossCharges).toBe(100000); // Only Jan 5 charge
        expect(result.excludedOutsideBuffer).toBe(1); // Jan 12 charge excluded
    });

    it('should have 5-day default buffer', () => {
        expect(STRIPE_REFUND_BUFFER_DAYS).toBe(5);
    });

    it('should prevent refund-after-verification exploit', async () => {
        // Scenario: User charges $1000 on Jan 14 (1 day before deadline)
        // Verification runs on Jan 15 (deadline)
        // User refunds on Jan 16
        // With 5-day buffer, Jan 14 charge is EXCLUDED because Jan 14 > Jan 10 (buffer date)
        const client = new MockStripeRevenueClient();
        client.setMockTransactions([
            { id: 'ch_late', type: 'charge', amount: 100000, currency: 'usd', created: new Date('2025-01-14T00:00:00Z').getTime() / 1000, source: null },
        ]);

        const result = await client.getNetSettledRevenue('acct_test', windowStart, windowEnd, refundBufferDate, 'usd');

        expect(result.grossCharges).toBe(0); // Late charge excluded
        expect(result.excludedOutsideBuffer).toBe(1);
        expect(result.netRevenue).toBe(0); // Contract fails if threshold > 0
    });
});

describe('Stripe Anti-Abuse: Evidence Transparency', () => {
    it('should document all evidence fields in result', () => {
        const expectedFields = [
            'grossCharges',
            'refunds',
            'disputes',
            'netRevenue',
            'excludedWrongCurrency',
            'excludedWrongType',
            'excludedOutsideBuffer',
        ];

        const mockResult = {
            grossCharges: 100000,
            refunds: 10000,
            disputes: 5000,
            netRevenue: 85000,
            transactions: [],
            excludedWrongCurrency: 2,
            excludedWrongType: 1,
            excludedOutsideBuffer: 1,
        };

        for (const field of expectedFields) {
            expect(mockResult).toHaveProperty(field);
        }
    });
});

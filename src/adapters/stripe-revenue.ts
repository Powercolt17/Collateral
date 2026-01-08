/**
 * Stripe Revenue Adapter
 * 
 * outcome_spec:
 *   platform: 'STRIPE'
 *   metricType: 'REVENUE' // Net revenue (BalanceTransactions of type=charge/payment) in USD Cents
 * 
 * Source of Truth: Stripe Balance Transactions
 * - We verify revenue generated strictly within the contract window.
 * - Window: [EXECUTION_CONFIRMED timestamp, contract.deadlineUtc]
 * 
 * ANTI-ABUSE INVARIANTS:
 * A) Net Settled Revenue = charges - refunds - disputes
 * B) Charge-Only Revenue (no transfers, payouts, topups)
 * C) Single-Currency Enforcement (USD only)
 * D) Refund Cooling Window (charges must be before deadline - buffer)
 */

import { Contract, User, ConnectedAccount } from '../db/schema.js';

// =============================================================================
// STRIPE ANTI-ABUSE CONSTANTS
// =============================================================================
export const STRIPE_REFUND_BUFFER_DAYS = 5; // Charges must be >= 5 days before deadline
export const STRIPE_ALLOWED_CURRENCY = 'usd';
// Real Stripe balance_transaction.type values:
// Charges: 'charge' (most common for payments)
// Note: 'payment' is NOT a balance_transaction type. Payment intents result in 'charge' transactions.
// https://stripe.com/docs/api/balance_transactions/object#balance_transaction_object-type
export const STRIPE_ALLOWED_TRANSACTION_TYPES = ['charge'];
export const STRIPE_DEDUCTION_TYPES = ['refund', 'dispute', 'charge_failure'];

// =====================================================
// CLIENT ABSTRACTION (Deterministic)
// =====================================================

export interface StripeBalanceTransaction {
    id: string;
    type: string; // 'charge' | 'refund' | 'dispute' | 'payout' | 'transfer' | etc.
    amount: number; // In cents (positive for charges, negative for refunds typically)
    currency: string; // 'usd', 'eur', etc.
    created: number; // Unix timestamp
    source: string | null; // Related object ID (e.g., charge ID for refund)
}

export interface StripeNetRevenueResult {
    grossCharges: number;
    refunds: number;
    disputes: number;
    netRevenue: number;
    transactions: StripeBalanceTransaction[];
    countedChargeIds: string[]; // IDs of charges counted toward revenue
    excludedWrongCurrency: number;
    excludedWrongType: number;
    excludedOutsideBuffer: number;
    unlinkedDeductions: number; // Deductions not linked to a counted charge
}

export interface StripeRevenueClient {
    /**
     * Get cumulative revenue (sum of balance transactions) in the given window.
     * In cents.
     * @param connectedAccountId - The user's Stripe Connect Account ID
     * @param start - Start of window (inclusive)
     * @param end - End of window (inclusive)
     */
    getRevenueInWindow(connectedAccountId: string, start: Date, end: Date): Promise<number>;

    /**
     * Get NET SETTLED revenue with full anti-abuse filtering.
     * Returns charges minus refunds minus disputes, with all exclusions.
     */
    getNetSettledRevenue(
        connectedAccountId: string,
        windowStart: Date,
        windowEnd: Date,
        refundBufferDate: Date, // Charges must be before this date
        currency: string
    ): Promise<StripeNetRevenueResult>;

    /**
     * Get snapshot of "current" state for baseline.
     */
    getLifetimeRevenue(connectedAccountId: string): Promise<number>;
}

export class MockStripeRevenueClient implements StripeRevenueClient {
    constructor(
        private fixedRevenueInWindow: number = 500000, // $5,000.00
        private fixedLifetimeRevenue: number = 1000000, // $10,000.00
        private mockTransactions: StripeBalanceTransaction[] = []
    ) { }

    async getRevenueInWindow(connectedAccountId: string, start: Date, end: Date): Promise<number> {
        return this.fixedRevenueInWindow;
    }

    async getNetSettledRevenue(
        connectedAccountId: string,
        windowStart: Date,
        windowEnd: Date,
        refundBufferDate: Date,
        currency: string
    ): Promise<StripeNetRevenueResult> {
        // Mock implementation with configurable transactions
        let grossCharges = 0;
        let refunds = 0;
        let disputes = 0;
        let excludedWrongCurrency = 0;
        let excludedWrongType = 0;
        let excludedOutsideBuffer = 0;
        let unlinkedDeductions = 0;
        const countedChargeIds: string[] = [];

        const transactions = this.mockTransactions.length > 0
            ? this.mockTransactions
            : [
                // Default: single valid charge
                { id: 'ch_mock', type: 'charge', amount: this.fixedRevenueInWindow, currency, created: windowStart.getTime() / 1000 + 1000, source: null }
            ];

        // First pass: identify counted charges
        for (const txn of transactions) {
            if (txn.currency.toLowerCase() !== currency.toLowerCase()) {
                excludedWrongCurrency++;
                continue;
            }

            if (STRIPE_ALLOWED_TRANSACTION_TYPES.includes(txn.type)) {
                const txnDate = new Date(txn.created * 1000);
                if (txnDate > refundBufferDate) {
                    excludedOutsideBuffer++;
                    continue;
                }
                grossCharges += txn.amount;
                countedChargeIds.push(txn.id);
            }
        }

        // Second pass: count deductions ONLY for counted charges (linked via source)
        for (const txn of transactions) {
            if (txn.currency.toLowerCase() !== currency.toLowerCase()) {
                continue; // Already counted in first pass
            }

            if (STRIPE_DEDUCTION_TYPES.includes(txn.type)) {
                // Check if this deduction is linked to a counted charge
                const linkedToCountedCharge = txn.source && countedChargeIds.includes(txn.source);

                if (!linkedToCountedCharge) {
                    unlinkedDeductions++;
                    continue; // Don't count deductions for charges not in our window
                }

                if (txn.type === 'refund') {
                    refunds += Math.abs(txn.amount);
                } else {
                    disputes += Math.abs(txn.amount);
                }
            } else if (!STRIPE_ALLOWED_TRANSACTION_TYPES.includes(txn.type)) {
                excludedWrongType++;
            }
        }

        return {
            grossCharges,
            refunds,
            disputes,
            netRevenue: grossCharges - refunds - disputes,
            transactions,
            countedChargeIds,
            excludedWrongCurrency,
            excludedWrongType,
            excludedOutsideBuffer,
            unlinkedDeductions,
        };
    }

    async getLifetimeRevenue(connectedAccountId: string): Promise<number> {
        return this.fixedLifetimeRevenue;
    }

    // Test helper
    setMockTransactions(txns: StripeBalanceTransaction[]) {
        this.mockTransactions = txns;
    }
}

let clientInstance: StripeRevenueClient | null = null;

export function getRevenueClient(): StripeRevenueClient {
    if (!clientInstance) {
        // Default to mock for safety until explicitly configured
        clientInstance = new MockStripeRevenueClient();
    }
    return clientInstance;
}

export function setRevenueClient(client: StripeRevenueClient) {
    clientInstance = client;
}

// =====================================================
// ADAPTER IMPLEMENTATION
// =====================================================

export interface VerificationContext {
    windowStartUtc: Date;
    stripeConnectedAccountId?: string;
}

export interface EvaluationResult {
    pass: boolean;
    observedValue: number;
    threshold: number;
    operator: string;
    evidence: Record<string, unknown>;
}

export const stripeRevenueAdapter = {
    platform: 'STRIPE',

    async snapshotBaseline(user: User): Promise<{
        snapshotAt: string;
        metrics: Record<string, number>;
    }> {
        const client = getRevenueClient();
        if (!user.stripeConnectedAccountId) {
            // If no connected account at creation, baseline is 0 (or error?)
            // We'll assume 0 and store evidence that account was missing.
            return {
                snapshotAt: new Date().toISOString(),
                metrics: { lifetime_revenue: 0 },
            };
        }

        const lifetime = await client.getLifetimeRevenue(user.stripeConnectedAccountId);

        return {
            snapshotAt: new Date().toISOString(),
            metrics: {
                lifetime_revenue: lifetime,
            },
        };
    },

    async evaluate(contract: Contract, context: VerificationContext): Promise<EvaluationResult> {
        const condition = contract.conditionJson as {
            operator: string;
            threshold: number;
        };

        const client = getRevenueClient();

        // 1. Validate Context
        if (!context.stripeConnectedAccountId) {
            // Should be impossible if verification service does its job, but safety first
            // We cannot verify revenue without the target account ID.
            throw new Error(`Cannot verify Stripe Revenue: Missing stripeConnectedAccountId in context.`);
        }

        const connectedAccountId = context.stripeConnectedAccountId;
        const windowStartUtc = context.windowStartUtc;
        const windowEndUtc = contract.deadlineUtc;
        const measuredAtUtc = new Date().toISOString();

        // =========================================================
        // ANTI-ABUSE: Refund Cooling Window
        // Charges must be created >= REFUND_BUFFER_DAYS before deadline
        // =========================================================
        const refundBufferDate = new Date(windowEndUtc);
        refundBufferDate.setDate(refundBufferDate.getDate() - STRIPE_REFUND_BUFFER_DAYS);

        // 2. Fetch NET SETTLED Revenue (charges - refunds - disputes)
        // with anti-abuse filtering: charge-only, single-currency, refund buffer
        const revenueResult = await client.getNetSettledRevenue(
            connectedAccountId,
            windowStartUtc,
            windowEndUtc,
            refundBufferDate,
            STRIPE_ALLOWED_CURRENCY
        );

        // 3. Identify Baseline (Reference only)
        const baseline = contract.baselineJson as { lifetime_revenue?: number } | null;
        const baselineRevenue = baseline?.lifetime_revenue || 0;

        // 4. Observed Value = Net Settled Revenue
        const observedRevenue = revenueResult.netRevenue;

        const pass = evaluateCondition(observedRevenue, condition.operator, condition.threshold);

        return {
            pass,
            observedValue: observedRevenue,
            threshold: condition.threshold,
            operator: condition.operator,
            evidence: {
                source: 'STRIPE',
                measuredAtUtc,
                windowStartUtc: windowStartUtc.toISOString(),
                windowEndUtc: windowEndUtc.toISOString(),
                refundBufferDate: refundBufferDate.toISOString(),
                baselineRevenue,
                // Anti-abuse breakdown
                grossCharges: revenueResult.grossCharges,
                refunds: revenueResult.refunds,
                disputes: revenueResult.disputes,
                netRevenue: revenueResult.netRevenue,
                observedRevenue,
                threshold: condition.threshold,
                currency: STRIPE_ALLOWED_CURRENCY,
                // Exclusion counts for transparency
                excludedWrongCurrency: revenueResult.excludedWrongCurrency,
                excludedWrongType: revenueResult.excludedWrongType,
                excludedOutsideBuffer: revenueResult.excludedOutsideBuffer,
                stripeObjectType: 'balance_transaction',
            },
        };
    },
};

function evaluateCondition(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
        case 'GTE': return value >= threshold;
        case 'GT': return value > threshold;
        case 'LTE': return value <= threshold;
        case 'LT': return value < threshold;
        case 'EQ': return value === threshold;
        default: return false;
    }
}

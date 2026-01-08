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
export class MockStripeRevenueClient {
    fixedRevenueInWindow;
    fixedLifetimeRevenue;
    mockTransactions;
    constructor(fixedRevenueInWindow = 500000, // $5,000.00
    fixedLifetimeRevenue = 1000000, // $10,000.00
    mockTransactions = []) {
        this.fixedRevenueInWindow = fixedRevenueInWindow;
        this.fixedLifetimeRevenue = fixedLifetimeRevenue;
        this.mockTransactions = mockTransactions;
    }
    async getRevenueInWindow(connectedAccountId, start, end) {
        return this.fixedRevenueInWindow;
    }
    async getNetSettledRevenue(connectedAccountId, windowStart, windowEnd, refundBufferDate, currency) {
        // Mock implementation with configurable transactions
        let grossCharges = 0;
        let refunds = 0;
        let disputes = 0;
        let excludedWrongCurrency = 0;
        let excludedWrongType = 0;
        let excludedOutsideBuffer = 0;
        let unlinkedDeductions = 0;
        const countedChargeIds = [];
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
                }
                else {
                    disputes += Math.abs(txn.amount);
                }
            }
            else if (!STRIPE_ALLOWED_TRANSACTION_TYPES.includes(txn.type)) {
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
    async getLifetimeRevenue(connectedAccountId) {
        return this.fixedLifetimeRevenue;
    }
    // Test helper
    setMockTransactions(txns) {
        this.mockTransactions = txns;
    }
}
let clientInstance = null;
export function getRevenueClient() {
    if (!clientInstance) {
        // Default to mock for safety until explicitly configured
        clientInstance = new MockStripeRevenueClient();
    }
    return clientInstance;
}
export function setRevenueClient(client) {
    clientInstance = client;
}
export const stripeRevenueAdapter = {
    platform: 'STRIPE',
    async snapshotBaseline(user) {
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
    async evaluate(contract, context) {
        const condition = contract.conditionJson;
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
        const revenueResult = await client.getNetSettledRevenue(connectedAccountId, windowStartUtc, windowEndUtc, refundBufferDate, STRIPE_ALLOWED_CURRENCY);
        // 3. Identify Baseline (Reference only)
        const baseline = contract.baselineJson;
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
function evaluateCondition(value, operator, threshold) {
    switch (operator) {
        case 'GTE': return value >= threshold;
        case 'GT': return value > threshold;
        case 'LTE': return value <= threshold;
        case 'LT': return value < threshold;
        case 'EQ': return value === threshold;
        default: return false;
    }
}
//# sourceMappingURL=stripe-revenue.js.map
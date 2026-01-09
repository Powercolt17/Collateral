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
// =============================================================================
// V1 SPEC CONSTANTS
// =============================================================================
export const STRIPE_WINDOW_DAYS = 30; // Contract window is exactly 30 days
export const STRIPE_MIN_DELTA_CENTS = 50000; // $500.00 minimum delta
export const STRIPE_DELTA_FLOOR_PERCENTAGE = 0.10; // 10% of baseline minimum
/**
 * Calculate the delta floor for Stripe revenue contracts.
 *
 * Delta floor = max($500, baseline * 10%)
 *
 * This prevents trivial contracts where users lock capital for minimal gain.
 *
 * @param baselineNetRevenueCents - The baseline net revenue in cents
 * @returns The minimum delta required in cents
 */
export function calculateStripeDeltaFloor(baselineNetRevenueCents) {
    const percentageFloor = Math.floor(baselineNetRevenueCents * STRIPE_DELTA_FLOOR_PERCENTAGE);
    return Math.max(STRIPE_MIN_DELTA_CENTS, percentageFloor);
}
/**
 * Validate that a delta target meets the floor requirements.
 *
 * @param baselineNetRevenueCents - The baseline net revenue in cents
 * @param deltaTargetCents - The user's requested delta target in cents
 * @returns Validation result with details
 */
export function validateStripeDeltaFloor(baselineNetRevenueCents, deltaTargetCents) {
    const requiredDelta = calculateStripeDeltaFloor(baselineNetRevenueCents);
    return {
        valid: deltaTargetCents >= requiredDelta,
        requiredDelta,
        actualDelta: deltaTargetCents,
    };
}
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
    async getBaselineSnapshot(connectedAccountId, executionTime) {
        // Calculate 30-day baseline window
        const windowEnd = executionTime;
        const windowStart = new Date(executionTime);
        windowStart.setDate(windowStart.getDate() - STRIPE_WINDOW_DAYS);
        // No refund buffer for baseline (we're calculating historical, not evaluating)
        const refundBufferDate = windowEnd;
        return this.getNetSettledRevenue(connectedAccountId, windowStart, windowEnd, refundBufferDate, STRIPE_ALLOWED_CURRENCY);
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
    /**
     * @deprecated Use createV1BaselineSnapshot for V1 spec compliance
     */
    async snapshotBaseline(user) {
        const client = getRevenueClient();
        if (!user.stripeConnectedAccountId) {
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
    /**
     * V1 SPEC: Create immutable baseline snapshot at execution time.
     *
     * This function:
     * 1. Fetches 30-day prior net revenue from Stripe
     * 2. Validates delta floor requirements
     * 3. Returns V1-compliant frozen baseline JSON
     *
     * @param stripeConnectedAccountId - The user's verified Stripe account ID
     * @param deltaTargetCents - The user's requested delta (must meet floor)
     * @param executionTime - The execution timestamp
     * @returns V1-compliant baseline JSON for freezing in contract
     * @throws Error if delta floor not met or Stripe data unavailable
     */
    async createV1BaselineSnapshot(stripeConnectedAccountId, deltaTargetCents, executionTime) {
        const client = getRevenueClient();
        // 1. Fetch baseline (30-day prior net revenue)
        const baselineResult = await client.getBaselineSnapshot(stripeConnectedAccountId, executionTime);
        const baselineNetRevenueCents = baselineResult.netRevenue;
        // 2. Calculate and validate delta floor
        const deltaFloor = calculateStripeDeltaFloor(baselineNetRevenueCents);
        const deltaValidation = validateStripeDeltaFloor(baselineNetRevenueCents, deltaTargetCents);
        if (!deltaValidation.valid) {
            throw new Error(`Delta target does not meet minimum floor. ` +
                `Baseline: ${baselineNetRevenueCents} cents ($${(baselineNetRevenueCents / 100).toFixed(2)}), ` +
                `Target delta: ${deltaTargetCents} cents ($${(deltaTargetCents / 100).toFixed(2)}), ` +
                `Required delta: ${deltaValidation.requiredDelta} cents ($${(deltaValidation.requiredDelta / 100).toFixed(2)})`);
        }
        // 3. Calculate baseline window bounds
        const windowEnd = executionTime;
        const windowStart = new Date(executionTime);
        windowStart.setDate(windowStart.getDate() - STRIPE_WINDOW_DAYS);
        // 4. Return immutable V1 baseline
        return {
            platform: 'STRIPE',
            stripeConnectedAccountId,
            baselineNetRevenueCents,
            deltaTargetCents,
            windowDays: STRIPE_WINDOW_DAYS,
            baselineWindow: {
                fromUtc: windowStart.toISOString(),
                toUtc: windowEnd.toISOString(),
            },
            frozenAtUtc: executionTime.toISOString(),
            deltaFloor,
            deltaFloorCheck: {
                passed: deltaValidation.valid,
                requiredDelta: deltaValidation.requiredDelta,
                actualDelta: deltaValidation.actualDelta,
            },
        };
    },
    async evaluate(contract, context) {
        const client = getRevenueClient();
        // 1. Extract frozen baseline from contract (V1 spec)
        const baseline = contract.baselineJson;
        // Check if this is a V1 baseline
        const isV1Baseline = baseline && 'baselineNetRevenueCents' in baseline;
        // 2. Get frozen Stripe account ID (MUST use frozen ID, never current)
        let connectedAccountId;
        let frozenBaseline;
        let frozenDelta;
        if (isV1Baseline) {
            const v1Baseline = baseline;
            connectedAccountId = v1Baseline.stripeConnectedAccountId; // FROZEN ID
            frozenBaseline = v1Baseline.baselineNetRevenueCents;
            frozenDelta = v1Baseline.deltaTargetCents;
        }
        else {
            // Legacy fallback for older contracts
            if (!context.stripeConnectedAccountId) {
                throw new Error(`Cannot verify Stripe Revenue: Missing stripeConnectedAccountId in context.`);
            }
            connectedAccountId = context.stripeConnectedAccountId;
            frozenBaseline = baseline?.lifetime_revenue || 0;
            const condition = contract.conditionJson;
            frozenDelta = condition.threshold - frozenBaseline; // Approximate for legacy
        }
        const windowStartUtc = context.windowStartUtc;
        const windowEndUtc = contract.deadlineUtc;
        const measuredAtUtc = new Date().toISOString();
        // 3. ANTI-ABUSE: Refund Cooling Window
        const refundBufferDate = new Date(windowEndUtc);
        refundBufferDate.setDate(refundBufferDate.getDate() - STRIPE_REFUND_BUFFER_DAYS);
        // 4. Fetch NET SETTLED Revenue (charges - refunds - disputes)
        const revenueResult = await client.getNetSettledRevenue(connectedAccountId, windowStartUtc, windowEndUtc, refundBufferDate, STRIPE_ALLOWED_CURRENCY);
        const observedRevenue = revenueResult.netRevenue;
        // 5. V1 SPEC: Pass condition is observed >= baseline + delta
        const targetThreshold = frozenBaseline + frozenDelta;
        const pass = observedRevenue >= targetThreshold;
        return {
            pass,
            observedValue: observedRevenue,
            threshold: targetThreshold,
            operator: 'GTE',
            evidence: {
                source: 'STRIPE',
                v1Compliant: isV1Baseline,
                measuredAtUtc,
                windowStartUtc: windowStartUtc.toISOString(),
                windowEndUtc: windowEndUtc.toISOString(),
                refundBufferDate: refundBufferDate.toISOString(),
                // V1 frozen values
                frozenStripeAccountId: connectedAccountId,
                frozenBaseline,
                frozenDelta,
                targetThreshold,
                // Observed results
                grossCharges: revenueResult.grossCharges,
                refunds: revenueResult.refunds,
                disputes: revenueResult.disputes,
                netRevenue: revenueResult.netRevenue,
                observedRevenue,
                // Pass calculation breakdown
                passCalculation: {
                    observed: observedRevenue,
                    baseline: frozenBaseline,
                    delta: frozenDelta,
                    target: targetThreshold,
                    result: pass ? 'PASS' : 'FAIL',
                },
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
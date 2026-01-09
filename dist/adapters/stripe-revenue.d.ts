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
import { Contract, User } from '../db/schema.js';
export declare const STRIPE_REFUND_BUFFER_DAYS = 5;
export declare const STRIPE_ALLOWED_CURRENCY = "usd";
export declare const STRIPE_ALLOWED_TRANSACTION_TYPES: string[];
export declare const STRIPE_DEDUCTION_TYPES: string[];
export declare const STRIPE_WINDOW_DAYS = 30;
export declare const STRIPE_MIN_DELTA_CENTS = 50000;
export declare const STRIPE_DELTA_FLOOR_PERCENTAGE = 0.1;
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
export declare function calculateStripeDeltaFloor(baselineNetRevenueCents: number): number;
/**
 * Validate that a delta target meets the floor requirements.
 *
 * @param baselineNetRevenueCents - The baseline net revenue in cents
 * @param deltaTargetCents - The user's requested delta target in cents
 * @returns Validation result with details
 */
export declare function validateStripeDeltaFloor(baselineNetRevenueCents: number, deltaTargetCents: number): {
    valid: boolean;
    requiredDelta: number;
    actualDelta: number;
};
export interface StripeBalanceTransaction {
    id: string;
    type: string;
    amount: number;
    currency: string;
    created: number;
    source: string | null;
}
export interface StripeNetRevenueResult {
    grossCharges: number;
    refunds: number;
    disputes: number;
    netRevenue: number;
    transactions: StripeBalanceTransaction[];
    countedChargeIds: string[];
    excludedWrongCurrency: number;
    excludedWrongType: number;
    excludedOutsideBuffer: number;
    unlinkedDeductions: number;
}
/**
 * V1 Spec-Compliant Baseline JSON
 *
 * This is the immutable snapshot frozen at EXECUTION_CONFIRMED.
 * All fields are required and cannot be modified after execution.
 */
export interface StripeV1BaselineJson {
    platform: 'STRIPE';
    stripeConnectedAccountId: string;
    baselineNetRevenueCents: number;
    deltaTargetCents: number;
    windowDays: number;
    baselineWindow: {
        fromUtc: string;
        toUtc: string;
    };
    frozenAtUtc: string;
    deltaFloor: number;
    deltaFloorCheck: {
        passed: boolean;
        requiredDelta: number;
        actualDelta: number;
    };
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
    getNetSettledRevenue(connectedAccountId: string, windowStart: Date, windowEnd: Date, refundBufferDate: Date, // Charges must be before this date
    currency: string): Promise<StripeNetRevenueResult>;
    /**
     * Get snapshot of "current" state for baseline.
     * @deprecated Use getBaselineSnapshot for V1 spec compliance
     */
    getLifetimeRevenue(connectedAccountId: string): Promise<number>;
    /**
     * V1 SPEC: Get 30-day prior revenue for baseline calculation.
     *
     * Baseline = net revenue in the 30 days immediately preceding execution.
     *
     * @param connectedAccountId - The user's Stripe Connect Account ID
     * @param executionTime - The execution timestamp (baseline window ends here)
     * @returns Net revenue result for the 30-day baseline window
     */
    getBaselineSnapshot(connectedAccountId: string, executionTime: Date): Promise<StripeNetRevenueResult>;
}
export declare class MockStripeRevenueClient implements StripeRevenueClient {
    private fixedRevenueInWindow;
    private fixedLifetimeRevenue;
    private mockTransactions;
    constructor(fixedRevenueInWindow?: number, // $5,000.00
    fixedLifetimeRevenue?: number, // $10,000.00
    mockTransactions?: StripeBalanceTransaction[]);
    getRevenueInWindow(connectedAccountId: string, start: Date, end: Date): Promise<number>;
    getNetSettledRevenue(connectedAccountId: string, windowStart: Date, windowEnd: Date, refundBufferDate: Date, currency: string): Promise<StripeNetRevenueResult>;
    getLifetimeRevenue(connectedAccountId: string): Promise<number>;
    getBaselineSnapshot(connectedAccountId: string, executionTime: Date): Promise<StripeNetRevenueResult>;
    setMockTransactions(txns: StripeBalanceTransaction[]): void;
}
export declare function getRevenueClient(): StripeRevenueClient;
export declare function setRevenueClient(client: StripeRevenueClient): void;
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
export declare const stripeRevenueAdapter: {
    platform: string;
    /**
     * @deprecated Use createV1BaselineSnapshot for V1 spec compliance
     */
    snapshotBaseline(user: User): Promise<{
        snapshotAt: string;
        metrics: Record<string, number>;
    }>;
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
    createV1BaselineSnapshot(stripeConnectedAccountId: string, deltaTargetCents: number, executionTime: Date): Promise<StripeV1BaselineJson>;
    evaluate(contract: Contract, context: VerificationContext): Promise<EvaluationResult>;
};

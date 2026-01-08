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
     */
    getLifetimeRevenue(connectedAccountId: string): Promise<number>;
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
    snapshotBaseline(user: User): Promise<{
        snapshotAt: string;
        metrics: Record<string, number>;
    }>;
    evaluate(contract: Contract, context: VerificationContext): Promise<EvaluationResult>;
};

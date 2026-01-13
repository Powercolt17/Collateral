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
export declare const STRIPE_EXCLUDED_TRANSACTION_TYPES: string[];
export declare const STRIPE_DEDUCTION_TYPES: string[];
export declare const STRIPE_WINDOW_DAYS = 30;
export declare const STRIPE_MIN_DELTA_CENTS = 50000;
export declare const STRIPE_TIER_PERCENTAGES: {
    readonly STEADY: 0.15;
    readonly BROAD: 0.25;
    readonly ALL_IN: 0.4;
};
export declare const STRIPE_DELTA_FLOOR_PERCENTAGE: 0.15;
export declare const STRIPE_TIER_MINIMUM_BASELINE: {
    readonly STEADY: 100000;
    readonly BROAD: 500000;
    readonly ALL_IN: 1000000;
};
export declare const STRIPE_SINGLE_CHARGE_MAX_PERCENTAGE = 0.5;
export declare const STRIPE_ERROR_CODES: {
    readonly INELIGIBLE_BASELINE_TOO_LOW: "STRIPE_INELIGIBLE_BASELINE_TOO_LOW";
    readonly SINGLE_INVOICE_VIOLATION: "STRIPE_SINGLE_INVOICE_VIOLATION";
    readonly CURRENCY_MISMATCH: "STRIPE_CURRENCY_MISMATCH";
    readonly API_UNAVAILABLE: "STRIPE_API_UNAVAILABLE";
    readonly DELTA_FLOOR_NOT_MET: "STRIPE_DELTA_FLOOR_NOT_MET";
};
/**
 * Stripe Charge representation for qualification checking.
 * This mirrors Stripe's charge object structure.
 */
export interface StripeCharge {
    id: string;
    paid: boolean;
    refunded: boolean;
    amount: number;
    amount_refunded: number;
    currency: string;
    status: 'succeeded' | 'pending' | 'failed';
    disputed: boolean;
    dispute?: {
        status: 'warning_needs_response' | 'warning_under_review' | 'warning_closed' | 'needs_response' | 'under_review' | 'charge_refunded' | 'won' | 'lost';
    };
    created: number;
}
/**
 * Check if a Stripe charge qualifies as revenue.
 *
 * A charge is qualified if:
 * 1. paid === true
 * 2. Not fully refunded (partial refunds reduce net amount)
 * 3. Currency matches the expected currency
 * 4. Status is 'succeeded'
 * 5. Not in an active dispute (disputed but lost = counts, pending = zero)
 *
 * @param charge - The Stripe charge to check
 * @param expectedCurrency - The frozen currency from baseline
 * @returns Qualification result with net amount
 */
export declare function isQualifiedRevenueCharge(charge: StripeCharge, expectedCurrency: string): {
    qualified: boolean;
    netAmountCents: number;
    reason?: string;
};
/**
 * Validate tier eligibility based on baseline revenue.
 *
 * @param baselineNetRevenueCents - The baseline net revenue
 * @param tier - The requested tier
 * @returns Eligibility result
 */
export declare function validateTierEligibility(baselineNetRevenueCents: number, tier: 'STEADY' | 'BROAD' | 'ALL_IN'): {
    eligible: boolean;
    minimumRequired: number;
    errorCode?: string;
};
/**
 * Check for single-invoice dominance (anti-gaming).
 *
 * If ≥50% of total revenue comes from a single charge, flag as violation.
 *
 * @param charges - Array of qualified charge amounts
 * @returns Violation check result
 */
export declare function checkSingleInvoiceDominance(charges: {
    id: string;
    netAmountCents: number;
}[]): {
    violation: boolean;
    largestChargeCents: number;
    largestChargeId: string | null;
    largestChargePct: number;
    totalRevenueCents: number;
};
/**
 * Calculate the delta floor for Stripe revenue contracts.
 *
 * Delta floor = max($500, baseline * tierPercentage)
 *
 * Tier percentages:
 * - STEADY: 15% - removes accidental wins
 * - BROAD: 25% - clearly difficult, requires action
 * - ALL_IN: 40% - extremely punitive
 *
 * @param baselineNetRevenueCents - The baseline net revenue in cents
 * @param tierPercentage - Optional tier percentage (defaults to STEADY 15%)
 * @returns The minimum delta required in cents
 */
export declare function calculateStripeDeltaFloor(baselineNetRevenueCents: number, tierPercentage?: number): number;
/**
 * Validate that a delta target meets the floor requirements.
 *
 * @param baselineNetRevenueCents - The baseline net revenue in cents
 * @param deltaTargetCents - The user's requested delta target in cents
 * @param tierPercentage - Optional tier percentage (defaults to STEADY 15%)
 * @returns Validation result with details
 */
export declare function validateStripeDeltaFloor(baselineNetRevenueCents: number, deltaTargetCents: number, tierPercentage?: number): {
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
    excludedManipulation: number;
    unlinkedDeductions: number;
    refundsExcludedCents: number;
    disputesPendingCount: number;
    disputesResolvedCount: number;
    largestChargeCents: number;
    largestChargePct: number;
    singleInvoiceViolation: boolean;
}
/**
 * V1 Spec-Compliant Baseline JSON (Hardened + Finalized)
 *
 * This is the immutable snapshot frozen at EXECUTION_CONFIRMED.
 * All fields are required and cannot be modified after execution.
 *
 * EVIDENCE FIELDS ensure audit trail and verification consistency.
 * NON-REVERSIBILITY MARKERS ensure no appeals or manual overrides.
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
    verificationWindow: {
        fromUtc: string;
        toUtc: string;
    };
    frozenAtUtc: string;
    measuredAtUtc: string;
    includedTransactionTypes: string[];
    excludedTransactionTypes: string[];
    currency: string;
    tier: 'STEADY' | 'BROAD' | 'ALL_IN';
    tierPercentage: number;
    tierMinimumBaseline: number;
    deltaFloor: number;
    deltaFloorCheck: {
        passed: boolean;
        requiredDelta: number;
        actualDelta: number;
    };
    noAppeals: true;
    deterministicSettlement: true;
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
/**
 * Production Stripe Revenue Client
 *
 * Uses Stripe SDK to fetch real balance transactions.
 * Implements retry logic for 429/5xx, fail-closed for auth errors.
 */
export declare class RealStripeRevenueClient implements StripeRevenueClient {
    private stripe;
    private maxRetries;
    private retryDelayMs;
    constructor(stripeSecretKey: string);
    /**
     * Retry helper for transient errors (429, 5xx)
     */
    private withRetry;
    getRevenueInWindow(connectedAccountId: string, start: Date, end: Date): Promise<number>;
    getNetSettledRevenue(connectedAccountId: string, windowStart: Date, windowEnd: Date, refundBufferDate: Date, currency: string): Promise<StripeNetRevenueResult>;
    getLifetimeRevenue(connectedAccountId: string): Promise<number>;
    getBaselineSnapshot(connectedAccountId: string, executionTime: Date): Promise<StripeNetRevenueResult>;
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
     * 3. Returns V1-compliant frozen baseline JSON with full evidence
     *
     * @param stripeConnectedAccountId - The user's verified Stripe account ID
     * @param deltaTargetCents - The user's requested delta (must meet floor)
     * @param executionTime - The execution timestamp
     * @param tier - The tier level (STEADY/BROAD/ALL_IN)
     * @returns V1-compliant baseline JSON for freezing in contract
     * @throws Error if delta floor not met or Stripe data unavailable
     */
    createV1BaselineSnapshot(stripeConnectedAccountId: string, deltaTargetCents: number, executionTime: Date, tier?: "STEADY" | "BROAD" | "ALL_IN"): Promise<StripeV1BaselineJson>;
    evaluate(contract: Contract, context: VerificationContext): Promise<EvaluationResult>;
};

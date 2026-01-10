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

// REVENUE INCLUSION: Only real customer charges count toward revenue
// https://stripe.com/docs/api/balance_transactions/object#balance_transaction_object-type
export const STRIPE_ALLOWED_TRANSACTION_TYPES = ['charge', 'payment'];

// REVENUE EXCLUSION: These NEVER count toward revenue (anti-abuse critical)
export const STRIPE_EXCLUDED_TRANSACTION_TYPES = [
    'adjustment',           // Manual balance adjustments
    'balance_transfer',     // Internal transfers
    'contribution',         // Platform contributions
    'payout',               // Withdrawals to bank
    'payout_cancel',        // Cancelled payouts
    'payout_failure',       // Failed payouts
    'topup',                // Balance top-ups (adding funds)
    'topup_reversal',       // Reversed top-ups
    'transfer',             // Transfers to connected accounts
    'transfer_cancel',      // Cancelled transfers
    'transfer_failure',     // Failed transfers
    'transfer_refund',      // Refunded transfers
    'stripe_fee',           // Stripe processing fees
    'application_fee',      // Platform application fees
    'application_fee_refund', // Refunded application fees
    'fee_refund',           // Fee refunds
    'issuing_authorization', // Issuing authorizations
    'issuing_dispute',      // Issuing disputes
    'issuing_transaction',  // Issuing card transactions
    'connect_collection_transfer', // Connect collection transfers
    'reserve_transaction',  // Reserve holds
    'reserved_funds',       // Reserved balance
    'obligation',           // Platform obligations
];

export const STRIPE_DEDUCTION_TYPES = ['refund', 'dispute', 'charge_failure'];

// =============================================================================
// V1 SPEC CONSTANTS
// =============================================================================
export const STRIPE_WINDOW_DAYS = 30; // Contract window is exactly 30 days
export const STRIPE_MIN_DELTA_CENTS = 50000; // $500.00 minimum delta

// TIER PERCENTAGES (Revenue growth requirements by tier)
export const STRIPE_TIER_PERCENTAGES = {
    STEADY: 0.15,   // 15% - removes accidental wins, forces real behavior change
    BROAD: 0.25,    // 25% - clearly difficult, requires action (ads, launch, pricing)
    ALL_IN: 0.40,   // 40% - extremely punitive, high forfeiture yield
} as const;

// Default tier for delta floor calculation (can be overridden per contract)
export const STRIPE_DELTA_FLOOR_PERCENTAGE = STRIPE_TIER_PERCENTAGES.STEADY; // 15%

// =============================================================================
// TIER ELIGIBILITY FLOORS (Minimum baseline to qualify for tier)
// =============================================================================
export const STRIPE_TIER_MINIMUM_BASELINE = {
    STEADY: 100000,    // $1,000 minimum baseline
    BROAD: 500000,     // $5,000 minimum baseline
    ALL_IN: 1000000,   // $10,000 minimum baseline
} as const;

// =============================================================================
// ANTI-ONE-INVOICE CONSTANTS
// =============================================================================
export const STRIPE_SINGLE_CHARGE_MAX_PERCENTAGE = 0.50; // 50% - if one charge is ≥50%, fail

// =============================================================================
// ERROR CODES
// =============================================================================
export const STRIPE_ERROR_CODES = {
    INELIGIBLE_BASELINE_TOO_LOW: 'STRIPE_INELIGIBLE_BASELINE_TOO_LOW',
    SINGLE_INVOICE_VIOLATION: 'STRIPE_SINGLE_INVOICE_VIOLATION',
    CURRENCY_MISMATCH: 'STRIPE_CURRENCY_MISMATCH',
    API_UNAVAILABLE: 'STRIPE_API_UNAVAILABLE',
    DELTA_FLOOR_NOT_MET: 'STRIPE_DELTA_FLOOR_NOT_MET',
} as const;

// =============================================================================
// CHARGE QUALIFICATION TYPES
// =============================================================================

/**
 * Stripe Charge representation for qualification checking.
 * This mirrors Stripe's charge object structure.
 */
export interface StripeCharge {
    id: string;
    paid: boolean;
    refunded: boolean;
    amount: number;           // In cents
    amount_refunded: number;  // In cents (for partial refunds)
    currency: string;
    status: 'succeeded' | 'pending' | 'failed';
    disputed: boolean;
    dispute?: {
        status: 'warning_needs_response' | 'warning_under_review' | 'warning_closed' |
        'needs_response' | 'under_review' | 'charge_refunded' | 'won' | 'lost';
    };
    created: number; // Unix timestamp
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
export function isQualifiedRevenueCharge(
    charge: StripeCharge,
    expectedCurrency: string
): { qualified: boolean; netAmountCents: number; reason?: string } {
    // Rule 1: Must be paid
    if (!charge.paid) {
        return { qualified: false, netAmountCents: 0, reason: 'charge_not_paid' };
    }

    // Rule 2: Currency must match exactly (fail closed on mismatch)
    if (charge.currency.toLowerCase() !== expectedCurrency.toLowerCase()) {
        return { qualified: false, netAmountCents: 0, reason: 'currency_mismatch' };
    }

    // Rule 3: Status must be succeeded
    if (charge.status !== 'succeeded') {
        return { qualified: false, netAmountCents: 0, reason: 'charge_not_succeeded' };
    }

    // Rule 4: Handle disputes (pending disputes = zero revenue)
    if (charge.disputed) {
        const disputeStatus = charge.dispute?.status;
        // Only count if dispute was WON (in our favor)
        if (disputeStatus !== 'won') {
            // Pending, lost, or under review = zero revenue
            return { qualified: false, netAmountCents: 0, reason: 'dispute_pending_or_lost' };
        }
    }

    // Rule 5: Calculate net amount (subtract partial refunds)
    const netAmountCents = charge.amount - charge.amount_refunded;

    // If fully refunded, not qualified
    if (netAmountCents <= 0) {
        return { qualified: false, netAmountCents: 0, reason: 'fully_refunded' };
    }

    return { qualified: true, netAmountCents };
}

/**
 * Validate tier eligibility based on baseline revenue.
 * 
 * @param baselineNetRevenueCents - The baseline net revenue
 * @param tier - The requested tier
 * @returns Eligibility result
 */
export function validateTierEligibility(
    baselineNetRevenueCents: number,
    tier: 'STEADY' | 'BROAD' | 'ALL_IN'
): { eligible: boolean; minimumRequired: number; errorCode?: string } {
    const minimumRequired = STRIPE_TIER_MINIMUM_BASELINE[tier];

    if (baselineNetRevenueCents < minimumRequired) {
        return {
            eligible: false,
            minimumRequired,
            errorCode: STRIPE_ERROR_CODES.INELIGIBLE_BASELINE_TOO_LOW,
        };
    }

    return { eligible: true, minimumRequired };
}

/**
 * Check for single-invoice dominance (anti-gaming).
 * 
 * If ≥50% of total revenue comes from a single charge, flag as violation.
 * 
 * @param charges - Array of qualified charge amounts
 * @returns Violation check result
 */
export function checkSingleInvoiceDominance(
    charges: { id: string; netAmountCents: number }[]
): {
    violation: boolean;
    largestChargeCents: number;
    largestChargeId: string | null;
    largestChargePct: number;
    totalRevenueCents: number;
} {
    if (charges.length === 0) {
        return {
            violation: false,
            largestChargeCents: 0,
            largestChargeId: null,
            largestChargePct: 0,
            totalRevenueCents: 0,
        };
    }

    const totalRevenueCents = charges.reduce((sum, c) => sum + c.netAmountCents, 0);

    // Find largest charge
    let largestCharge = charges[0];
    for (const charge of charges) {
        if (charge.netAmountCents > largestCharge.netAmountCents) {
            largestCharge = charge;
        }
    }

    const largestChargePct = totalRevenueCents > 0
        ? largestCharge.netAmountCents / totalRevenueCents
        : 0;

    return {
        violation: largestChargePct >= STRIPE_SINGLE_CHARGE_MAX_PERCENTAGE,
        largestChargeCents: largestCharge.netAmountCents,
        largestChargeId: largestCharge.id,
        largestChargePct,
        totalRevenueCents,
    };
}

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
export function calculateStripeDeltaFloor(
    baselineNetRevenueCents: number,
    tierPercentage: number = STRIPE_DELTA_FLOOR_PERCENTAGE
): number {
    const percentageFloor = Math.floor(baselineNetRevenueCents * tierPercentage);
    return Math.max(STRIPE_MIN_DELTA_CENTS, percentageFloor);
}

/**
 * Validate that a delta target meets the floor requirements.
 * 
 * @param baselineNetRevenueCents - The baseline net revenue in cents
 * @param deltaTargetCents - The user's requested delta target in cents
 * @param tierPercentage - Optional tier percentage (defaults to STEADY 15%)
 * @returns Validation result with details
 */
export function validateStripeDeltaFloor(
    baselineNetRevenueCents: number,
    deltaTargetCents: number,
    tierPercentage: number = STRIPE_DELTA_FLOOR_PERCENTAGE
): { valid: boolean; requiredDelta: number; actualDelta: number } {
    const requiredDelta = calculateStripeDeltaFloor(baselineNetRevenueCents, tierPercentage);
    return {
        valid: deltaTargetCents >= requiredDelta,
        requiredDelta,
        actualDelta: deltaTargetCents,
    };
}

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
    excludedManipulation: number; // topups, transfers, adjustments
    unlinkedDeductions: number; // Deductions not linked to a counted charge

    // V1 Finalization: Dispute & Refund Evidence
    refundsExcludedCents: number;
    disputesPendingCount: number;
    disputesResolvedCount: number;

    // Anti-One-Invoice Evidence
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

    // BASELINE WINDOW (30 days prior to execution)
    baselineWindow: {
        fromUtc: string; // executionTime - 30 days
        toUtc: string;   // executionTime (exclusive)
    };

    // VERIFICATION WINDOW (30 days after execution)
    verificationWindow: {
        fromUtc: string; // executionTime
        toUtc: string;   // executionTime + 30 days
    };

    frozenAtUtc: string;
    measuredAtUtc: string; // When baseline was actually measured

    // EVIDENCE: Revenue filtering applied
    includedTransactionTypes: string[];
    excludedTransactionTypes: string[];
    currency: string;

    // Tier configuration
    tier: 'STEADY' | 'BROAD' | 'ALL_IN';
    tierPercentage: number;
    tierMinimumBaseline: number;

    // Anti-abuse evidence
    deltaFloor: number;
    deltaFloorCheck: {
        passed: boolean;
        requiredDelta: number;
        actualDelta: number;
    };

    // NON-REVERSIBILITY MARKERS (for UI, legal, Stripe dispute defense)
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
    getNetSettledRevenue(
        connectedAccountId: string,
        windowStart: Date,
        windowEnd: Date,
        refundBufferDate: Date, // Charges must be before this date
        currency: string
    ): Promise<StripeNetRevenueResult>;

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
    getBaselineSnapshot(
        connectedAccountId: string,
        executionTime: Date
    ): Promise<StripeNetRevenueResult>;
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
        let excludedManipulation = 0; // NEW: topups, transfers, adjustments
        let unlinkedDeductions = 0;
        const countedChargeIds: string[] = [];

        const transactions = this.mockTransactions.length > 0
            ? this.mockTransactions
            : [
                // Default: single valid charge
                { id: 'ch_mock', type: 'charge', amount: this.fixedRevenueInWindow, currency, created: windowStart.getTime() / 1000 + 1000, source: null }
            ];

        // First pass: identify counted charges (FILTER EXCLUDED TYPES)
        for (const txn of transactions) {
            // ANTI-MANIPULATION: Explicitly reject excluded transaction types
            if (STRIPE_EXCLUDED_TRANSACTION_TYPES.includes(txn.type)) {
                excludedManipulation++;
                continue; // Skip topups, transfers, adjustments, payouts, etc.
            }

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
            // Skip excluded types (already counted as manipulation)
            if (STRIPE_EXCLUDED_TRANSACTION_TYPES.includes(txn.type)) {
                continue;
            }

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
            excludedManipulation,
            unlinkedDeductions,

            // V1 Finalization fields
            refundsExcludedCents: refunds,
            disputesPendingCount: 0, // Mock: no pending disputes
            disputesResolvedCount: 0,

            // Anti-One-Invoice Evidence (calculated from counted charges)
            largestChargeCents: countedChargeIds.length > 0
                ? Math.max(...transactions.filter(t => countedChargeIds.includes(t.id)).map(t => t.amount))
                : 0,
            largestChargePct: grossCharges > 0
                ? Math.max(...transactions.filter(t => countedChargeIds.includes(t.id)).map(t => t.amount)) / grossCharges
                : 0,
            singleInvoiceViolation: grossCharges > 0
                ? (Math.max(...transactions.filter(t => countedChargeIds.includes(t.id)).map(t => t.amount)) / grossCharges) >= STRIPE_SINGLE_CHARGE_MAX_PERCENTAGE
                : false,
        };
    }

    async getLifetimeRevenue(connectedAccountId: string): Promise<number> {
        return this.fixedLifetimeRevenue;
    }

    async getBaselineSnapshot(
        connectedAccountId: string,
        executionTime: Date
    ): Promise<StripeNetRevenueResult> {
        // Calculate 30-day baseline window
        const windowEnd = executionTime;
        const windowStart = new Date(executionTime);
        windowStart.setDate(windowStart.getDate() - STRIPE_WINDOW_DAYS);

        // No refund buffer for baseline (we're calculating historical, not evaluating)
        const refundBufferDate = windowEnd;

        return this.getNetSettledRevenue(
            connectedAccountId,
            windowStart,
            windowEnd,
            refundBufferDate,
            STRIPE_ALLOWED_CURRENCY
        );
    }

    // Test helper
    setMockTransactions(txns: StripeBalanceTransaction[]) {
        this.mockTransactions = txns;
    }
}

// =============================================================================
// REAL STRIPE REVENUE CLIENT (Production)
// =============================================================================

/**
 * Production Stripe Revenue Client
 * 
 * Uses Stripe SDK to fetch real balance transactions.
 * Implements retry logic for 429/5xx, fail-closed for auth errors.
 */
export class RealStripeRevenueClient implements StripeRevenueClient {
    private stripe: import('stripe').default;
    private maxRetries = 3;
    private retryDelayMs = 1000;

    constructor(stripeSecretKey: string) {
        // Dynamic import to avoid requiring stripe in all environments
        const Stripe = require('stripe').default;
        this.stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2023-10-16',
        });
    }

    /**
     * Retry helper for transient errors (429, 5xx)
     */
    private async withRetry<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                return await operation();
            } catch (err: any) {
                lastError = err;

                // Check if retryable
                const statusCode = err.statusCode || err.status;
                const isRetryable = statusCode === 429 || (statusCode >= 500 && statusCode < 600);

                if (!isRetryable) {
                    // Non-retryable: auth errors, 4xx (except 429), config errors
                    throw new Error(
                        `[${STRIPE_ERROR_CODES.API_UNAVAILABLE}] ` +
                        `Stripe API error (non-retryable): ${err.message}`
                    );
                }

                if (attempt < this.maxRetries) {
                    console.log(`[Stripe] ${operationName} attempt ${attempt} failed with ${statusCode}, retrying...`);
                    await new Promise(resolve => setTimeout(resolve, this.retryDelayMs * attempt));
                }
            }
        }

        throw new Error(
            `[${STRIPE_ERROR_CODES.API_UNAVAILABLE}] ` +
            `Stripe API failed after ${this.maxRetries} attempts: ${lastError?.message}`
        );
    }

    async getRevenueInWindow(connectedAccountId: string, start: Date, end: Date): Promise<number> {
        const result = await this.getNetSettledRevenue(
            connectedAccountId,
            start,
            end,
            end, // No refund buffer for simple window query
            STRIPE_ALLOWED_CURRENCY
        );
        return result.netRevenue;
    }

    async getNetSettledRevenue(
        connectedAccountId: string,
        windowStart: Date,
        windowEnd: Date,
        refundBufferDate: Date,
        currency: string
    ): Promise<StripeNetRevenueResult> {
        return this.withRetry(async () => {
            let grossCharges = 0;
            let refunds = 0;
            let disputes = 0;
            let excludedWrongCurrency = 0;
            let excludedWrongType = 0;
            let excludedOutsideBuffer = 0;
            let excludedManipulation = 0;
            let unlinkedDeductions = 0;
            let disputesPendingCount = 0;
            let disputesResolvedCount = 0;
            const countedChargeIds: string[] = [];
            const transactions: StripeBalanceTransaction[] = [];

            // Fetch all balance transactions in the window
            let hasMore = true;
            let startingAfter: string | undefined;

            while (hasMore) {
                const params: any = {
                    created: {
                        gte: Math.floor(windowStart.getTime() / 1000),
                        lte: Math.floor(windowEnd.getTime() / 1000),
                    },
                    limit: 100,
                    expand: ['data.source'],
                };

                if (startingAfter) {
                    params.starting_after = startingAfter;
                }

                const response = await this.stripe.balanceTransactions.list(params, {
                    stripeAccount: connectedAccountId,
                });

                for (const txn of response.data) {
                    const txnData: StripeBalanceTransaction = {
                        id: txn.id,
                        type: txn.type,
                        amount: txn.amount,
                        currency: txn.currency,
                        created: txn.created,
                        source: typeof txn.source === 'string' ? txn.source : txn.source?.id || null,
                    };
                    transactions.push(txnData);

                    // ANTI-MANIPULATION: Explicit type exclusion
                    if (STRIPE_EXCLUDED_TRANSACTION_TYPES.includes(txn.type)) {
                        excludedManipulation++;
                        continue;
                    }

                    // Currency check
                    if (txn.currency.toLowerCase() !== currency.toLowerCase()) {
                        excludedWrongCurrency++;
                        continue;
                    }

                    // Count charges
                    if (STRIPE_ALLOWED_TRANSACTION_TYPES.includes(txn.type)) {
                        const txnDate = new Date(txn.created * 1000);
                        if (txnDate > refundBufferDate) {
                            excludedOutsideBuffer++;
                            continue;
                        }
                        grossCharges += txn.amount;
                        countedChargeIds.push(txn.id);
                    }

                    // Count deductions
                    if (STRIPE_DEDUCTION_TYPES.includes(txn.type)) {
                        const linkedToCountedCharge = txnData.source && countedChargeIds.includes(txnData.source);
                        if (!linkedToCountedCharge) {
                            unlinkedDeductions++;
                            continue;
                        }
                        if (txn.type === 'refund') {
                            refunds += Math.abs(txn.amount);
                        } else if (txn.type === 'dispute') {
                            disputes += Math.abs(txn.amount);
                            disputesPendingCount++; // We count all as pending initially
                        }
                    }
                }

                hasMore = response.has_more;
                if (response.data.length > 0) {
                    startingAfter = response.data[response.data.length - 1].id;
                } else {
                    hasMore = false;
                }
            }

            // Calculate single-invoice dominance
            const chargeAmounts = transactions
                .filter(t => countedChargeIds.includes(t.id))
                .map(t => ({ id: t.id, netAmountCents: t.amount }));
            const dominanceCheck = checkSingleInvoiceDominance(chargeAmounts);

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
                excludedManipulation,
                unlinkedDeductions,
                refundsExcludedCents: refunds,
                disputesPendingCount,
                disputesResolvedCount,
                largestChargeCents: dominanceCheck.largestChargeCents,
                largestChargePct: dominanceCheck.largestChargePct,
                singleInvoiceViolation: dominanceCheck.violation,
            };
        }, 'getNetSettledRevenue');
    }

    async getLifetimeRevenue(connectedAccountId: string): Promise<number> {
        // For historical baseline, we need to sum all balance transactions
        // This is expensive so we limit to recent history
        return this.withRetry(async () => {
            let total = 0;
            let hasMore = true;
            let startingAfter: string | undefined;

            while (hasMore) {
                const params: any = { limit: 100 };
                if (startingAfter) params.starting_after = startingAfter;

                const response = await this.stripe.balanceTransactions.list(params, {
                    stripeAccount: connectedAccountId,
                });

                for (const txn of response.data) {
                    if (STRIPE_EXCLUDED_TRANSACTION_TYPES.includes(txn.type)) continue;
                    if (txn.currency.toLowerCase() !== STRIPE_ALLOWED_CURRENCY) continue;
                    if (STRIPE_ALLOWED_TRANSACTION_TYPES.includes(txn.type)) {
                        total += txn.amount;
                    } else if (STRIPE_DEDUCTION_TYPES.includes(txn.type)) {
                        total -= Math.abs(txn.amount);
                    }
                }

                hasMore = response.has_more;
                if (response.data.length > 0) {
                    startingAfter = response.data[response.data.length - 1].id;
                } else {
                    hasMore = false;
                }
            }

            return total;
        }, 'getLifetimeRevenue');
    }

    async getBaselineSnapshot(connectedAccountId: string, executionTime: Date): Promise<StripeNetRevenueResult> {
        const windowEnd = executionTime;
        const windowStart = new Date(executionTime);
        windowStart.setDate(windowStart.getDate() - STRIPE_WINDOW_DAYS);
        const refundBufferDate = windowEnd; // No buffer for baseline

        return this.getNetSettledRevenue(
            connectedAccountId,
            windowStart,
            windowEnd,
            refundBufferDate,
            STRIPE_ALLOWED_CURRENCY
        );
    }
}

let clientInstance: StripeRevenueClient | null = null;

export function getRevenueClient(): StripeRevenueClient {
    if (!clientInstance) {
        // Select client based on environment
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        const nodeEnv = process.env.NODE_ENV;

        if (nodeEnv === 'production' && stripeSecretKey) {
            console.log('[Stripe] Using RealStripeRevenueClient (production)');
            clientInstance = new RealStripeRevenueClient(stripeSecretKey);
        } else if (stripeSecretKey && nodeEnv !== 'test') {
            console.log('[Stripe] Using RealStripeRevenueClient (development)');
            clientInstance = new RealStripeRevenueClient(stripeSecretKey);
        } else {
            console.log('[Stripe] Using MockStripeRevenueClient (test/no-key)');
            clientInstance = new MockStripeRevenueClient();
        }
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

    /**
     * @deprecated Use createV1BaselineSnapshot for V1 spec compliance
     */
    async snapshotBaseline(user: User): Promise<{
        snapshotAt: string;
        metrics: Record<string, number>;
    }> {
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
     * 3. Returns V1-compliant frozen baseline JSON with full evidence
     * 
     * @param stripeConnectedAccountId - The user's verified Stripe account ID
     * @param deltaTargetCents - The user's requested delta (must meet floor)
     * @param executionTime - The execution timestamp
     * @param tier - The tier level (STEADY/BROAD/ALL_IN)
     * @returns V1-compliant baseline JSON for freezing in contract
     * @throws Error if delta floor not met or Stripe data unavailable
     */
    async createV1BaselineSnapshot(
        stripeConnectedAccountId: string,
        deltaTargetCents: number,
        executionTime: Date,
        tier: 'STEADY' | 'BROAD' | 'ALL_IN' = 'STEADY'
    ): Promise<StripeV1BaselineJson> {
        const client = getRevenueClient();
        const measuredAtUtc = new Date().toISOString();

        // Get tier percentage
        const tierPercentage = STRIPE_TIER_PERCENTAGES[tier];

        // 1. Fetch baseline (30-day prior net revenue)
        const baselineResult = await client.getBaselineSnapshot(
            stripeConnectedAccountId,
            executionTime
        );

        const baselineNetRevenueCents = baselineResult.netRevenue;

        // 2. Validate tier eligibility (minimum baseline for tier)
        const tierEligibility = validateTierEligibility(baselineNetRevenueCents, tier);
        if (!tierEligibility.eligible) {
            throw new Error(
                `[${STRIPE_ERROR_CODES.INELIGIBLE_BASELINE_TOO_LOW}] ` +
                `Baseline too low for ${tier} tier. ` +
                `Baseline: $${(baselineNetRevenueCents / 100).toFixed(2)}, ` +
                `Minimum required: $${(tierEligibility.minimumRequired / 100).toFixed(2)}`
            );
        }

        // 3. Calculate and validate delta floor (tier-aware)
        const deltaFloor = calculateStripeDeltaFloor(baselineNetRevenueCents, tierPercentage);
        const deltaValidation = validateStripeDeltaFloor(baselineNetRevenueCents, deltaTargetCents, tierPercentage);

        if (!deltaValidation.valid) {
            throw new Error(
                `[${STRIPE_ERROR_CODES.DELTA_FLOOR_NOT_MET}] ` +
                `Delta target does not meet minimum floor. ` +
                `Tier: ${tier} (${(tierPercentage * 100).toFixed(0)}%), ` +
                `Baseline: ${baselineNetRevenueCents} cents ($${(baselineNetRevenueCents / 100).toFixed(2)}), ` +
                `Target delta: ${deltaTargetCents} cents ($${(deltaTargetCents / 100).toFixed(2)}), ` +
                `Required delta: ${deltaValidation.requiredDelta} cents ($${(deltaValidation.requiredDelta / 100).toFixed(2)})`
            );
        }

        // 4. Calculate baseline window bounds (30 days prior to execution)
        const baselineWindowEnd = executionTime;
        const baselineWindowStart = new Date(executionTime);
        baselineWindowStart.setDate(baselineWindowStart.getDate() - STRIPE_WINDOW_DAYS);

        // 5. Calculate verification window bounds (30 days after execution)
        const verificationWindowStart = executionTime;
        const verificationWindowEnd = new Date(executionTime);
        verificationWindowEnd.setDate(verificationWindowEnd.getDate() + STRIPE_WINDOW_DAYS);

        // 6. Return immutable V1 baseline with full evidence + non-reversibility markers
        return {
            platform: 'STRIPE',
            stripeConnectedAccountId,
            baselineNetRevenueCents,
            deltaTargetCents,
            windowDays: STRIPE_WINDOW_DAYS,

            // BASELINE WINDOW (30 days prior)
            baselineWindow: {
                fromUtc: baselineWindowStart.toISOString(),
                toUtc: baselineWindowEnd.toISOString(),
            },

            // VERIFICATION WINDOW (30 days after) - no overlap
            verificationWindow: {
                fromUtc: verificationWindowStart.toISOString(),
                toUtc: verificationWindowEnd.toISOString(),
            },

            frozenAtUtc: executionTime.toISOString(),
            measuredAtUtc,

            // EVIDENCE: Revenue filtering applied
            includedTransactionTypes: [...STRIPE_ALLOWED_TRANSACTION_TYPES],
            excludedTransactionTypes: [...STRIPE_EXCLUDED_TRANSACTION_TYPES],
            currency: STRIPE_ALLOWED_CURRENCY,

            // Tier configuration
            tier,
            tierPercentage,
            tierMinimumBaseline: STRIPE_TIER_MINIMUM_BASELINE[tier],

            // Anti-abuse evidence
            deltaFloor,
            deltaFloorCheck: {
                passed: deltaValidation.valid,
                requiredDelta: deltaValidation.requiredDelta,
                actualDelta: deltaValidation.actualDelta,
            },

            // NON-REVERSIBILITY MARKERS
            noAppeals: true,
            deterministicSettlement: true,
        };
    },

    async evaluate(contract: Contract, context: VerificationContext): Promise<EvaluationResult> {
        const client = getRevenueClient();

        // 1. Extract frozen baseline from contract (V1 spec)
        const baseline = contract.baselineJson as StripeV1BaselineJson | { lifetime_revenue?: number } | null;

        // Check if this is a V1 baseline
        const isV1Baseline = baseline && 'baselineNetRevenueCents' in baseline;

        // 2. Get frozen Stripe account ID (MUST use frozen ID, never current)
        let connectedAccountId: string;
        let frozenBaseline: number;
        let frozenDelta: number;

        if (isV1Baseline) {
            const v1Baseline = baseline as StripeV1BaselineJson;
            connectedAccountId = v1Baseline.stripeConnectedAccountId; // FROZEN ID
            frozenBaseline = v1Baseline.baselineNetRevenueCents;
            frozenDelta = v1Baseline.deltaTargetCents;
        } else {
            // Legacy fallback for older contracts
            if (!context.stripeConnectedAccountId) {
                throw new Error(`Cannot verify Stripe Revenue: Missing stripeConnectedAccountId in context.`);
            }
            connectedAccountId = context.stripeConnectedAccountId;
            frozenBaseline = (baseline as { lifetime_revenue?: number })?.lifetime_revenue || 0;
            const condition = contract.conditionJson as { threshold: number };
            frozenDelta = condition.threshold - frozenBaseline; // Approximate for legacy
        }

        const windowStartUtc = context.windowStartUtc;
        const windowEndUtc = contract.deadlineUtc;
        const measuredAtUtc = new Date().toISOString();

        // 3. ANTI-ABUSE: Refund Cooling Window
        const refundBufferDate = new Date(windowEndUtc);
        refundBufferDate.setDate(refundBufferDate.getDate() - STRIPE_REFUND_BUFFER_DAYS);

        // 4. Fetch NET SETTLED Revenue (charges - refunds - disputes)
        const revenueResult = await client.getNetSettledRevenue(
            connectedAccountId,
            windowStartUtc,
            windowEndUtc,
            refundBufferDate,
            STRIPE_ALLOWED_CURRENCY
        );

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

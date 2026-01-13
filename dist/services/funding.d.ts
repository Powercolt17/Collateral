/**
 * Funding Service
 *
 * USD-first funding with Stripe
 * Card payments (PaymentIntent)
 * ACH support (staged for later)
 *
 * State is NEVER stored - derived from ledger events
 */
export interface CreateFundingIntentResult {
    clientSecret: string;
    paymentIntentId: string;
    amountUsdCents: number;
}
/**
 * Create a Stripe PaymentIntent for contract funding
 *
 * From-state: CREATED
 * Appends: FUNDS_AUTHORIZED (semantically: "funding intent created, awaiting payment")
 * To-state: FUNDS_AUTHORIZED
 *
 * NOTE: Uses automatic capture for V1 simplicity.
 * - PaymentIntent.succeeded = funds captured immediately
 * - No separate capture step needed
 * - Webhook on payment_intent.succeeded → FUNDS_LOCKED
 */
export declare function createFundingIntent(contractId: string, userId: string): Promise<CreateFundingIntentResult>;
/**
 * Handle Stripe webhook for payment confirmation
 *
 * Called when: payment_intent.succeeded webhook fires
 * From-state: FUNDS_AUTHORIZED
 * Appends: FUNDS_LOCKED
 * To-state: FUNDS_LOCKED
 *
 * V1 FLOW (automatic capture):
 * - PaymentIntent.succeeded means funds are already captured
 * - No separate capture step needed
 * - Just append FUNDS_LOCKED event
 *
 * IDEMPOTENCY:
 * - Checks if FUNDS_LOCKED event with same payment_intent_id already exists
 * - Returns early if already processed
 *
 * SECURITY:
 * - contractId MUST come from PaymentIntent.metadata (trusted binding)
 * - chargeId REQUIRED for dispute correlation (fail if missing)
 */
export declare function handlePaymentSuccess(paymentIntentId: string, contractId: string, chargeId: string): Promise<void>;
/**
 * Handle payment failure
 * Revert contract to CREATED status
 */
export declare function handlePaymentFailure(paymentIntentId: string, contractId: string): Promise<void>;
/**
 * DISPUTE DEFENSE: Handle payment dispute (chargeback)
 *
 * OBJECTIVE FORFEITURE RULES (Stripe-defensible):
 * 1. User initiated chargeback/funding reversal → FORFEITED
 * 2. This is NOT subjective - it's a verifiable Stripe event
 *
 * Appends: PAYMENT_DISPUTED (→ may trigger CONTRACT_FORFEITED)
 */
export interface DisputeParams {
    disputeId: string;
    chargeId: string;
    contractId: string;
    reason: string;
    amountCents: number;
    status: string;
}
export declare function handlePaymentDisputed(params: DisputeParams): Promise<void>;

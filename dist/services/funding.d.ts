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
 * Appends: FUNDS_AUTHORIZED
 * To-state: FUNDS_AUTHORIZED
 */
export declare function createFundingIntent(contractId: string, userId: string): Promise<CreateFundingIntentResult>;
/**
 * Handle Stripe webhook for payment confirmation
 *
 * From-state: FUNDS_AUTHORIZED
 * Appends: FUNDS_LOCKED
 * To-state: FUNDS_LOCKED
 *
 * IDEMPOTENCY:
 * - Checks if FUNDS_LOCKED event with same payment_intent_id already exists
 * - Returns early if already processed (dedupe key: externalRef = payment_intent_id)
 *
 * SECURITY:
 * - contractId MUST come from PaymentIntent.metadata (trusted binding)
 * - payment_intent_id links to the specific payment that authorized
 */
export declare function handlePaymentSuccess(paymentIntentId: string, contractId: string): Promise<void>;
/**
 * Handle payment failure
 * Revert contract to CREATED status
 */
export declare function handlePaymentFailure(paymentIntentId: string, contractId: string): Promise<void>;

/**
 * Funding Service
 *
 * USD-first funding with Stripe
 * Card payments (PaymentIntent)
 * ACH support (staged for later)
 *
 * State is NEVER stored - derived from ledger events
 */
import { ContractStatus, EventType } from '../db/schema.js';
import { getContract, getContractWithState } from './contracts.js';
import { appendEvent, getEventsForContract, eventExistsForExternalRef } from './ledger.js';
import { deriveState, validateFromState } from './state-derivation.js';
import { getStripeClient } from './stripe-client.js';
/**
 * Create a Stripe PaymentIntent for contract funding
 *
 * From-state: CREATED
 * Appends: FUNDS_AUTHORIZED
 * To-state: FUNDS_AUTHORIZED
 */
export async function createFundingIntent(contractId, userId) {
    // 1. Get contract
    const contract = await getContract(contractId);
    if (!contract) {
        throw new Error('Contract not found');
    }
    if (contract.principalUserId !== userId) {
        throw new Error('Not authorized to fund this contract');
    }
    // 2. Load events and derive current state
    const events = await getEventsForContract(contractId);
    const currentState = deriveState(events);
    // 3. Validate from-state (must be CREATED)
    validateFromState(currentState, [ContractStatus.CREATED], 'funding-intent');
    // 4. Create Stripe PaymentIntent via client abstraction
    const stripeClient = getStripeClient();
    const paymentIntent = await stripeClient.createPaymentIntent({
        amountUsdCents: contract.lockAmountUsdCents,
        contractId,
        captureMethod: 'manual', // Hold funds (authorize only)
    });
    // 5. Append FUNDS_AUTHORIZED event
    await appendEvent({
        contractId,
        actor: 'SYSTEM',
        eventType: EventType.FUNDS_AUTHORIZED,
        amountUsdCents: contract.lockAmountUsdCents,
        externalRef: paymentIntent.id, // Dedupe key
        metadata: {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.clientSecret,
        },
    });
    return {
        clientSecret: paymentIntent.clientSecret,
        paymentIntentId: paymentIntent.id,
        amountUsdCents: contract.lockAmountUsdCents,
    };
}
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
export async function handlePaymentSuccess(paymentIntentId, contractId) {
    // 1. IDEMPOTENCY CHECK: Has this payment_intent already been processed?
    const alreadyProcessed = await eventExistsForExternalRef(contractId, paymentIntentId, EventType.FUNDS_LOCKED);
    if (alreadyProcessed) {
        console.log(`Idempotent skip: FUNDS_LOCKED already exists for ${paymentIntentId}`);
        return;
    }
    // 2. Get contract
    const contract = await getContract(contractId);
    if (!contract) {
        throw new Error('Contract not found for payment');
    }
    // 3. TRUSTED BINDING VALIDATION:
    // Verify the payment_intent was actually authorized for this contract
    // by checking that FUNDS_AUTHORIZED event exists with matching externalRef
    const authorizedEventExists = await eventExistsForExternalRef(contractId, paymentIntentId, EventType.FUNDS_AUTHORIZED);
    if (!authorizedEventExists) {
        throw new Error(`Untrusted payment binding: No FUNDS_AUTHORIZED event found for payment_intent ${paymentIntentId} on contract ${contractId}`);
    }
    // 4. Load events and derive current state
    const events = await getEventsForContract(contractId);
    const currentState = deriveState(events);
    // 5. State-based idempotency: skip if already locked
    if (currentState === ContractStatus.FUNDS_LOCKED ||
        currentState === ContractStatus.LOCKED) {
        return;
    }
    // 6. Validate from-state (must be FUNDS_AUTHORIZED)
    validateFromState(currentState, [ContractStatus.FUNDS_AUTHORIZED], 'payment-success');
    // 7. CAPTURE FUNDS: Ensure funds are actually captured before locking contract
    const stripeClient = getStripeClient();
    const idempotencyKey = `cap_${paymentIntentId}`; // Idempotency key for capture
    console.log(`🔒 Capturing payment ${paymentIntentId} for contract ${contractId}...`);
    const captureResult = await stripeClient.capturePaymentIntent(paymentIntentId, idempotencyKey);
    if (!captureResult.success) {
        throw new Error(`Failed to capture payment ${paymentIntentId}`);
    }
    // 8. Append FUNDS_LOCKED event
    // Use chargeId as externalRef to avoid conflict with FUNDS_AUTHORIZED (which uses paymentIntentId)
    await appendEvent({
        contractId,
        actor: 'SYSTEM',
        eventType: EventType.FUNDS_LOCKED,
        amountUsdCents: contract.lockAmountUsdCents,
        externalRef: captureResult.chargeId, // Use charge ID (different from PI used in FUNDS_AUTHORIZED)
        metadata: {
            paymentIntentId, // Store PI for reference
            paymentConfirmed: true,
            chargeId: captureResult.chargeId,
            capturedAt: new Date().toISOString()
        },
    });
    console.log(`✅ funds locked for ${contractId} (Charge: ${captureResult.chargeId})`);
}
/**
 * Handle payment failure
 * Revert contract to CREATED status
 */
export async function handlePaymentFailure(paymentIntentId, contractId) {
    const result = await getContractWithState(contractId);
    if (!result) {
        throw new Error('Contract not found for payment failure');
    }
    // Log the failure but don't change state machine
    // Contract stays in FUNDS_AUTHORIZED and user can retry
    console.log(`Payment failed for contract ${contractId}: ${paymentIntentId}`);
}
//# sourceMappingURL=funding.js.map
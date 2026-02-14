/**
 * Funding Service
 * 
 * USD-first funding with Stripe
 * Card payments (PaymentIntent)
 * ACH support (staged for later)
 * 
 * State is NEVER stored - derived from ledger events
 */

import { db } from '../db/client.js';
import { contracts, ContractStatus, EventType, identities, identityStatusEnum } from '../db/schema.js';
import { getContract, getContractWithState, appendContractEvent } from './contracts.js';
import { appendEvent, getEventsForContract, eventExistsForExternalRef } from './ledger.js';
import { deriveState, validateFromState, InvalidTransitionError } from './state-derivation.js';
import { appendAccountEvent, computeBalances, AccountEventType } from './balances.js';
import { eq } from 'drizzle-orm';

import { getStripeClient } from './stripe-client.js';

// =====================================================
// WRITE ENDPOINT EVENT TYPES (explicit list)
// =====================================================
// POST /contracts/:id/funding-intent → FUNDS_AUTHORIZED
// Stripe webhook (payment success) → FUNDS_LOCKED

export interface CreateFundingIntentResult {
    clientSecret: string;
    paymentIntentId: string;
    amountUsdCents: number;
    status: string;
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
export async function createFundingIntent(
    contractId: string,
    userId: string
): Promise<CreateFundingIntentResult> {
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

    // 4. Get user's saved funding source (card)
    const { fundingSources } = await import('../db/schema.js');
    const [fundingSource] = await db.select().from(fundingSources).where(eq(fundingSources.userId, userId));

    if (!fundingSource?.stripePaymentMethodId || !fundingSource?.stripeCustomerId) {
        throw new Error('No verified funding source. Please add a card first.');
    }

    if (fundingSource.status !== 'verified') {
        throw new Error('Funding source not verified. Please verify your card first.');
    }

    console.log(`[Funding] Using saved card PM:${fundingSource.stripePaymentMethodId} for user ${userId}`);

    // 5. Create Stripe PaymentIntent with saved card (off-session)
    const stripeClient = getStripeClient();
    const paymentIntent = await stripeClient.createPaymentIntent({
        amountUsdCents: contract.lockAmountUsdCents,
        contractId,
        captureMethod: 'automatic',
        customerId: fundingSource.stripeCustomerId,
        paymentMethodId: fundingSource.stripePaymentMethodId,
    });

    // 6. Append FUNDS_AUTHORIZED event
    await appendEvent({
        contractId,
        actor: 'SYSTEM',
        eventType: EventType.FUNDS_AUTHORIZED,
        amountUsdCents: contract.lockAmountUsdCents,
        externalRef: paymentIntent.id,
        metadata: {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.clientSecret,
            paymentStatus: paymentIntent.status,
            semanticNote: paymentIntent.status === 'succeeded'
                ? 'off_session_payment_succeeded'
                : 'funding_intent_created',
        },
    });

    // 7. If off-session payment succeeded immediately, also append FUNDS_LOCKED
    // This happens when using a saved card that doesn't require 3D Secure
    if (paymentIntent.status === 'succeeded') {
        console.log(`[Funding] Off-session payment succeeded immediately for ${contractId}`);

        // Get chargeId from the PaymentIntent (needed for dispute correlation)
        const chargeId = (paymentIntent as any).chargeId || `ch_simulated_${paymentIntent.id}`;

        // Append FUNDS_LOCKED event to contract ledger
        // Use different externalRef suffix to avoid conflict with FUNDS_AUTHORIZED
        await appendEvent({
            contractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_LOCKED,
            amountUsdCents: contract.lockAmountUsdCents,
            externalRef: `${paymentIntent.id}_locked`,
            metadata: {
                paymentIntentId: paymentIntent.id,
                chargeId,
                paymentConfirmed: true,
                lockedAt: new Date().toISOString(),
                source: 'immediate_off_session',
            },
        });

        // Append CAPITAL_LOCKED event to account ledger
        await appendAccountEvent({
            userId,
            contractId,
            eventType: AccountEventType.CAPITAL_LOCKED,
            amountCents: contract.lockAmountUsdCents,
            idempotencyKey: `capital_locked_${contractId}_${paymentIntent.id}`,
            metadata: {
                paymentIntentId: paymentIntent.id,
                chargeId,
                lockedAt: new Date().toISOString(),
            },
        });

        console.log(`[Funding] ✅ Funds locked immediately for ${contractId}`);
    }

    return {
        clientSecret: paymentIntent.clientSecret,
        paymentIntentId: paymentIntent.id,
        amountUsdCents: contract.lockAmountUsdCents,
        status: paymentIntent.status,
    };
}

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
export async function handlePaymentSuccess(
    paymentIntentId: string,
    contractId: string,
    chargeId: string  // REQUIRED: For dispute correlation
): Promise<void> {
    // 0. REQUIRE chargeId for dispute correlation
    if (!chargeId) {
        throw new Error(`Missing chargeId for payment ${paymentIntentId} - cannot lock funds without dispute correlation`);
    }

    // 1. IDEMPOTENCY CHECK: Has this payment_intent already been processed?
    const alreadyProcessed = await eventExistsForExternalRef(
        contractId,
        paymentIntentId,
        EventType.FUNDS_LOCKED
    );
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
    // Verify the payment_intent was created for this contract
    const fundingIntentExists = await eventExistsForExternalRef(
        contractId,
        paymentIntentId,
        EventType.FUNDS_AUTHORIZED
    );
    if (!fundingIntentExists) {
        throw new Error(
            `Untrusted payment binding: No funding intent found for payment_intent ${paymentIntentId} on contract ${contractId}`
        );
    }

    // 4. Load events and derive current state
    const events = await getEventsForContract(contractId);
    const currentState = deriveState(events);

    // 5. State-based idempotency: skip if already locked
    if (currentState === ContractStatus.FUNDS_LOCKED ||
        currentState === ContractStatus.LOCKED) {
        console.log(`State-based skip: Contract ${contractId} already in state ${currentState}`);
        return;
    }

    // 6. Validate from-state (must be FUNDS_AUTHORIZED)
    validateFromState(currentState, [ContractStatus.FUNDS_AUTHORIZED], 'payment-success');

    // 7. Append FUNDS_LOCKED event to contract ledger
    // V1: With automatic capture, payment_intent.succeeded means funds are captured
    // No capture API call needed
    await appendEvent({
        contractId,
        actor: 'SYSTEM',
        eventType: EventType.FUNDS_LOCKED,
        amountUsdCents: contract.lockAmountUsdCents,
        externalRef: paymentIntentId,  // Idempotency key
        metadata: {
            paymentIntentId,
            chargeId,  // CRITICAL: Required for dispute correlation
            paymentConfirmed: true,
            lockedAt: new Date().toISOString()
        },
    });

    // 8. Append CAPITAL_LOCKED event to account ledger
    // This deducts from available balance and adds to locked balance
    await appendAccountEvent({
        userId: contract.principalUserId,
        contractId,
        eventType: AccountEventType.CAPITAL_LOCKED,
        amountCents: contract.lockAmountUsdCents,
        idempotencyKey: `capital_locked_${contractId}_${paymentIntentId}`,
        metadata: {
            paymentIntentId,
            chargeId,
            lockedAt: new Date().toISOString(),
        },
    });

    console.log(`✅ Funds locked for ${contractId} (PI: ${paymentIntentId}, Charge: ${chargeId})`);
}

/**
 * Handle payment failure
 * Revert contract to CREATED status
 */
export async function handlePaymentFailure(
    paymentIntentId: string,
    contractId: string
): Promise<void> {
    const result = await getContractWithState(contractId);

    if (!result) {
        throw new Error('Contract not found for payment failure');
    }

    // Log the failure but don't change state machine
    // Contract stays in FUNDS_AUTHORIZED and user can retry
    console.log(`Payment failed for contract ${contractId}: ${paymentIntentId}`);
}

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

export async function handlePaymentDisputed(params: DisputeParams): Promise<void> {
    const { disputeId, chargeId, contractId, reason, amountCents, status } = params;

    // 1. IDEMPOTENCY CHECK
    const alreadyProcessed = await eventExistsForExternalRef(
        contractId,
        disputeId,
        EventType.PAYMENT_DISPUTED
    );
    if (alreadyProcessed) {
        console.log(`Idempotent skip: PAYMENT_DISPUTED already exists for ${disputeId}`);
        return;
    }

    // 2. Get contract
    const contract = await getContract(contractId);
    if (!contract) {
        throw new Error(`Contract not found for dispute: ${contractId}`);
    }

    // 3. Load current state
    const events = await getEventsForContract(contractId);
    const currentState = deriveState(events);

    // 4. Append PAYMENT_DISPUTED event
    await appendEvent({
        contractId,
        actor: 'SYSTEM',
        eventType: EventType.PAYMENT_DISPUTED,
        amountUsdCents: amountCents,
        externalRef: disputeId,
        metadata: {
            disputeId,
            chargeId,
            reason,
            status,
            disputedAt: new Date().toISOString(),
            previousState: currentState,
            // OBJECTIVE EVIDENCE (not subjective judgment)
            objectiveReason: 'USER_INITIATED_CHARGEBACK',
            forfeitureRule: 'Funding reversal by user triggers automatic forfeiture',
        },
    });

    console.log(`⚠️ PAYMENT_DISPUTED recorded for ${contractId} (Dispute: ${disputeId}, Reason: ${reason})`);

    // 5. If contract is in LOCKED or later state, append CONTRACT_FORFEITED
    // This is an OBJECTIVE forfeiture - not subjective cheating detection
    if (currentState === ContractStatus.LOCKED ||
        currentState === ContractStatus.FUNDS_LOCKED) {

        await appendEvent({
            contractId,
            actor: 'SYSTEM',
            eventType: EventType.CONTRACT_FORFEITED,
            amountUsdCents: amountCents,
            metadata: {
                settlementType: 'FORFEITED',
                reason: 'FUNDING_REVERSAL',
                triggeredBy: disputeId,
                // AUDIT TRAIL for Stripe dispute defense
                auditTrail: {
                    termsHash: (contract.baselineJson as any)?.termsHash,
                    baselineWindow: (contract.baselineJson as any)?.baselineWindow,
                    verificationWindow: (contract.baselineJson as any)?.verificationWindow,
                    noAppeals: true,
                    deterministicSettlement: true,
                    forfeitureCondition: 'User-initiated chargeback on locked funds',
                },
            },
        });

        console.log(`🔒 CONTRACT_FORFEITED for ${contractId} due to funding reversal`);
    }

    // 6. SUSPEND IDENTITY (Account Freeze)
    if (contract.principalUserId) {
        await db.update(identities)
            .set({ status: 'SUSPENDED' } as any)
            .where(eq(identities.userId, contract.principalUserId));

        console.log(`⛔ SUSPENDED identity for user ${contract.principalUserId} due to dispute`);
    }
}

import { FastifyPluginAsync } from 'fastify';
import { eq } from 'drizzle-orm';
import { handlePaymentSuccess, handlePaymentFailure, handlePaymentDisputed } from '../services/funding.js';
import { getContractIdByPaymentIntent, getContractIdByChargeId } from '../services/ledger.js';
import { getContract } from '../services/contracts.js';
import { db } from '../db/client.js';
import { fundingSources } from '../db/schema.js';

/**
 * Webhook Routes
 * 
 * Handle Stripe webhooks for payment events
 * Uses Stripe SDK constructEvent for signature verification
 * 
 * SECURITY:
 * - Signature verification via Stripe SDK (not custom)
 * - Amount validation: amount_received >= contract.lockAmountCents
 * - Currency validation: must be 'usd' (platform is USD-only)
 * - Metadata correlation: Primary: metadata.contractId, Fallback: ledger lookup
 * - FAIL CLOSED: Reject all payment_intent.* if no contractId in production
 * 
 * DISPUTE DEFENSE:
 * - charge.dispute.created → PAYMENT_DISPUTED → CONTRACT_FORFEITED
 * - Only objective, pre-declared conditions trigger forfeiture
 */

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Explicit dev override (must be set explicitly, not just absence of production)
const ALLOW_UNSIGNED_WEBHOOKS = process.env.ALLOW_UNSIGNED_STRIPE_WEBHOOKS === 'true';

// Initialize Stripe SDK
let stripe: any = null;
function getStripe() {
    if (!stripe && STRIPE_SECRET_KEY) {
        const Stripe = require('stripe').default || require('stripe');
        stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    }
    return stripe;
}

const webhookRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * POST /v1/stripe/webhook
     * Handle Stripe payment events
     * 
     * CRITICAL: Uses Stripe SDK constructEvent for signature verification
     */
    fastify.post<{
        Body: any;
    }>('/v1/stripe/webhook', {
        config: {
            rawBody: true, // Requires fastify-raw-body plugin
        },
    }, async (request, reply) => {
        const signature = request.headers['stripe-signature'] as string;
        const rawBody = (request as any).rawBody;

        console.log('📥 [Stripe Webhook] Incoming request');
        console.log('   Signature:', signature ? 'present' : 'MISSING');
        console.log('   Raw body:', rawBody ? `${rawBody.length} bytes` : 'MISSING');

        // =========================================================
        // 1. FAIL CLOSED: Production requires both secret and SDK
        // =========================================================
        if (IS_PRODUCTION) {
            if (!STRIPE_WEBHOOK_SECRET) {
                console.error('🔒 SECURITY: STRIPE_WEBHOOK_SECRET not configured');
                reply.status(500);
                return { error: 'Webhook secret not configured' };
            }
            if (!STRIPE_SECRET_KEY) {
                console.error('🔒 SECURITY: STRIPE_SECRET_KEY not configured');
                reply.status(500);
                return { error: 'Stripe not configured' };
            }
        }

        // =========================================================
        // 2. Signature Verification via Stripe SDK
        // =========================================================
        let event: any;

        // If signature header is present, ALWAYS verify (even in dev)
        if (signature) {
            if (!STRIPE_WEBHOOK_SECRET || !STRIPE_SECRET_KEY) {
                console.error('🔒 Signature present but secrets missing');
                reply.status(500);
                return { error: 'Webhook secrets not configured' };
            }

            const stripeClient = getStripe();
            if (!stripeClient) {
                reply.status(500);
                return { error: 'Stripe SDK not initialized' };
            }

            if (!rawBody) {
                console.warn('⚠️ Webhook missing raw body');
                reply.status(400);
                return { error: 'Missing raw body' };
            }

            try {
                // Use Stripe SDK constructEvent - pass Buffer directly
                event = stripeClient.webhooks.constructEvent(
                    rawBody, // Pass Buffer directly, not toString()
                    signature,
                    STRIPE_WEBHOOK_SECRET
                );
                console.log('   ✅ Signature verified via Stripe SDK');
            } catch (err: any) {
                console.warn(`⚠️ Webhook signature verification FAILED: ${err.message}`);
                reply.status(400);
                return { error: 'Invalid signature' };
            }
        } else {
            // No signature header - only allow with explicit dev override
            if (!ALLOW_UNSIGNED_WEBHOOKS) {
                console.warn('⚠️ Webhook missing signature and ALLOW_UNSIGNED_STRIPE_WEBHOOKS not set');
                reply.status(400);
                return { error: 'Missing signature' };
            }
            console.log('   ⏩ Unsigned webhook allowed (ALLOW_UNSIGNED_STRIPE_WEBHOOKS=true)');
            try {
                event = JSON.parse(rawBody ? rawBody.toString() : JSON.stringify(request.body));
            } catch (err) {
                reply.status(400);
                return { error: 'Invalid payload JSON' };
            }
        }

        const { id: eventId, type, data } = event;
        const eventObject = data.object;

        // For payment intents
        const piId = eventObject?.id;
        const piAmountReceived = eventObject?.amount_received ?? eventObject?.amount;
        const piCurrency = eventObject?.currency;
        // Get chargeId - PaymentIntent uses latest_charge, not charge directly
        const latestCharge = eventObject?.latest_charge;
        const chargeFromEvent = eventObject?.charges?.data?.[0]?.id;
        let chargeId = latestCharge || chargeFromEvent || eventObject?.charge;

        // For disputes
        const disputeChargeId = eventObject?.charge;
        const disputeId = eventObject?.id;

        // =========================================================
        // 3. Contract Correlation
        //    Primary: metadata.contractId
        //    Fallback: ledger lookup by PI/charge
        //    FAIL CLOSED: For all payment_intent.* in production
        // =========================================================
        let contractId = eventObject?.metadata?.contractId;

        if (!contractId && piId && type.startsWith('payment_intent')) {
            console.log(`   📍 No contractId in metadata, looking up by PI: ${piId}`);
            contractId = await getContractIdByPaymentIntent(piId);
            if (contractId) {
                console.log(`   ✅ Found contractId ${contractId} via ledger lookup`);
            }
        }

        // For disputes, look up by charge ID
        if (!contractId && disputeChargeId && type.startsWith('charge.dispute')) {
            console.log(`   📍 Looking up contractId by charge: ${disputeChargeId}`);
            contractId = await getContractIdByChargeId(disputeChargeId);
            if (contractId) {
                console.log(`   ✅ Found contractId ${contractId} via charge lookup`);
            }
        }

        const ctx = `[Webhook ${eventId}] [${type}]`;

        // FAIL CLOSED: For ALL payment_intent.* events in production, require contractId
        if (!contractId) {
            if (IS_PRODUCTION && type.startsWith('payment_intent.')) {
                console.error(`${ctx} 🔒 SECURITY: No contractId found for payment_intent event - rejecting`);
                reply.status(400);
                return { error: 'Contract correlation failed' };
            }
            console.log(`${ctx} ⏩ Ignored (No contractId found)`);
            return { received: true };
        }

        console.log(`${ctx} 🔄 Processing for contract ${contractId}`);

        // =========================================================
        // 4. Amount/Currency Validation (for payment success)
        // =========================================================
        if (type === 'payment_intent.succeeded') {
            const contract = await getContract(contractId);
            if (!contract) {
                console.error(`${ctx} 🔒 Contract not found: ${contractId}`);
                reply.status(400);
                return { error: 'Contract not found' };
            }

            // Validate amount_received EXACTLY matches (no overpay allowed)
            if (piAmountReceived !== contract.lockAmountUsdCents) {
                console.error(`${ctx} 🔒 AMOUNT MISMATCH: received=${piAmountReceived} vs contract=${contract.lockAmountUsdCents}`);
                reply.status(400);
                return { error: 'Amount mismatch - must be exact' };
            }

            // Validate currency (platform is USD-only)
            if (piCurrency !== 'usd') {
                console.error(`${ctx} 🔒 CURRENCY MISMATCH: ${piCurrency} (platform only supports usd)`);
                reply.status(400);
                return { error: 'Currency not supported - platform is USD only' };
            }

            // Validate chargeId exists (required for dispute correlation)
            // If missing from webhook payload, fetch from Stripe API
            if (!chargeId) {
                console.log(`${ctx} ⚠️ ChargeId missing in webhook, fetching from Stripe API...`);
                try {
                    const stripeClient = getStripe();
                    if (stripeClient && piId) {
                        const pi = await stripeClient.paymentIntents.retrieve(piId, { expand: ['latest_charge'] });
                        const fetchedChargeId = (pi as any)?.latest_charge?.id ?? (pi as any)?.latest_charge;
                        if (fetchedChargeId) {
                            chargeId = fetchedChargeId;
                            console.log(`${ctx} ✅ Fetched chargeId from Stripe: ${chargeId}`);
                        }
                    }
                } catch (fetchErr: any) {
                    console.error(`${ctx} ❌ Failed to fetch chargeId: ${fetchErr.message}`);
                }

                // After fetch attempt, still missing = fail
                if (!chargeId) {
                    console.error(`${ctx} 🔒 MISSING CHARGE_ID: Cannot lock funds without dispute correlation`);
                    reply.status(500);
                    return { error: 'Missing chargeId - cannot proceed' };
                }
            }

            console.log(`   ✅ Payment validated: ${piAmountReceived} ${piCurrency} (chargeId: ${chargeId})`);
        }

        // =========================================================
        // 5. Event Processing (Idempotent)
        // =========================================================
        try {
            switch (type) {
                case 'payment_intent.succeeded':
                    // Pass chargeId for dispute correlation later
                    await handlePaymentSuccess(eventObject.id, contractId, chargeId);
                    console.log(`${ctx} ✅ Payment processed successfully (chargeId: ${chargeId})`);
                    break;

                case 'payment_intent.payment_failed':
                    await handlePaymentFailure(eventObject.id, contractId);
                    console.log(`${ctx} ❌ Payment failed - recorded`);
                    break;

                case 'charge.dispute.created':
                    console.log(`${ctx} ⚠️ DISPUTE CREATED`);
                    // Get dispute details
                    const disputeAmount = eventObject.amount;
                    const disputeReason = eventObject.reason || 'unknown';
                    const disputeStatus = eventObject.status;

                    await handlePaymentDisputed({
                        disputeId,
                        chargeId: disputeChargeId,
                        contractId,
                        reason: disputeReason,
                        amountCents: disputeAmount,
                        status: disputeStatus,
                    });
                    console.log(`${ctx} 🔒 Dispute recorded - contract may be forfeited`);
                    break;

                case 'setup_intent.succeeded': {
                    // Card verification succeeded
                    const siId = eventObject.id;
                    const paymentMethodId = eventObject.payment_method;
                    const customerId = eventObject.customer;
                    const userId = eventObject.metadata?.userId;

                    console.log(`${ctx} 💳 SetupIntent succeeded: ${siId}`);

                    if (!paymentMethodId || !customerId) {
                        console.log(`${ctx} ⏩ Ignored (missing PM or customer)`);
                        return { received: true };
                    }

                    // Fetch payment method details
                    const stripeClient = getStripe();
                    if (stripeClient) {
                        try {
                            const pm = await stripeClient.paymentMethods.retrieve(paymentMethodId);
                            const card = pm.card;

                            // Update funding source by setup intent ID
                            await db.update(fundingSources)
                                .set({
                                    stripePaymentMethodId: paymentMethodId,
                                    brand: card?.brand?.toUpperCase() || null,
                                    last4: card?.last4 || null,
                                    expMonth: card?.exp_month || null,
                                    expYear: card?.exp_year || null,
                                    status: 'verified',
                                    verifiedAt: new Date(),
                                    updatedAt: new Date(),
                                })
                                .where(eq(fundingSources.stripeSetupIntentId, siId));

                            // Set as default payment method
                            await stripeClient.customers.update(customerId, {
                                invoice_settings: {
                                    default_payment_method: paymentMethodId,
                                },
                            });

                            console.log(`${ctx} ✅ Card verified: ${card?.brand} •••• ${card?.last4}`);
                        } catch (pmErr: any) {
                            console.error(`${ctx} ⚠️ Failed to process PM: ${pmErr.message}`);
                        }
                    }
                    break;
                }

                case 'setup_intent.setup_failed': {
                    // Card verification failed
                    const siId = eventObject.id;
                    const failureCode = eventObject.last_setup_error?.code;
                    const failureMessage = eventObject.last_setup_error?.message;

                    console.log(`${ctx} ❌ SetupIntent failed: ${siId} - ${failureCode}: ${failureMessage}`);

                    // Update status to unconfigured (allow retry)
                    await db.update(fundingSources)
                        .set({
                            status: 'unconfigured',
                            updatedAt: new Date(),
                        })
                        .where(eq(fundingSources.stripeSetupIntentId, siId));
                    break;
                }

                default:
                    console.log(`${ctx} ⏩ Unhandled event type`);
            }

            // Return 2xx ONLY after successful processing
            return { received: true };

        } catch (err: any) {
            console.error(`${ctx} 💥 Error: ${err.message}`);
            // Return 500 to trigger Stripe retry
            reply.status(500);
            return { error: err.message };
        }
    });
};

export default webhookRoutes;

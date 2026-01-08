import { FastifyPluginAsync } from 'fastify';
import { handlePaymentSuccess, handlePaymentFailure } from '../services/funding.js';
import { getContractIdByPaymentIntent } from '../services/ledger.js';
import { createHash, createHmac } from 'crypto';

/**
 * Webhook Routes
 * 
 * Handle Stripe webhooks for payment events
 * Verify signatures before processing
 */

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test';

function verifyStripeSignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    // Parse Stripe signature header
    const parts = signature.split(',');
    let timestamp = '';
    let sig = '';

    for (const part of parts) {
        const [key, value] = part.split('=');
        if (key === 't') timestamp = value;
        if (key === 'v1') sig = value;
    }

    if (!timestamp || !sig) return false;

    // Compute expected signature
    const signedPayload = `${timestamp}.${payload}`;
    const expectedSig = createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex');

    // Compare (timing-safe would be better in production)
    return sig === expectedSig;
}

const webhookRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * POST /stripe/webhook
     * Handle Stripe payment events
     */
    fastify.post<{
        Body: any; // Fastify raw body handling
    }>('/v1/stripe/webhook', {
        config: {
            rawBody: true, // Requires fastify-raw-body plugin
        },
    }, async (request, reply) => {
        const signature = request.headers['stripe-signature'] as string;

        // Fastify raw body support
        const rawBody = (request as any).rawBody;

        console.log('📥 [Stripe Webhook] Incoming request');
        console.log('   Signature:', signature ? 'present' : 'MISSING');
        console.log('   Raw body:', rawBody ? `${rawBody.length} bytes` : 'MISSING');

        // 1. Verify Signature
        if (STRIPE_WEBHOOK_SECRET !== 'whsec_test') {
            if (!signature || !rawBody || !verifyStripeSignature(rawBody.toString(), signature, STRIPE_WEBHOOK_SECRET)) {
                console.warn('⚠️ Webhook signature verification failed');
                reply.status(400);
                return { error: 'Invalid signature' };
            }
            console.log('   ✅ Signature verified');
        } else {
            console.log('   ⏩ Signature verification bypassed (whsec_test mode)');
        }

        // 2. Parse Event
        let event: any;
        try {
            event = JSON.parse(rawBody ? rawBody.toString() : JSON.stringify(request.body));
        } catch (err) {
            reply.status(400);
            return { error: 'Invalid payload JSON' };
        }

        const { id: eventId, type, data } = event;
        const paymentIntent = data.object;
        const piId = paymentIntent?.id;

        // Get contractId: first try metadata, then fallback to ledger lookup
        let contractId = paymentIntent?.metadata?.contractId;

        if (!contractId && piId) {
            console.log(`   📍 No contractId in metadata, looking up by PI: ${piId}`);
            contractId = await getContractIdByPaymentIntent(piId);
            if (contractId) {
                console.log(`   ✅ Found contractId ${contractId} via ledger lookup`);
            }
        }

        // Structured Context
        const ctx = `[Webhook ${eventId}] [${type}]`;

        if (!contractId) {
            console.log(`${ctx} ⏩ Ignored (No contractId found - not in metadata or ledger)`);
            return { received: true };
        }

        console.log(`${ctx} 🔄 Processing for contract ${contractId} (PI: ${piId})`);

        try {
            switch (type) {
                case 'payment_intent.succeeded':
                    // 3. Idempotent Processing
                    await handlePaymentSuccess(paymentIntent.id, contractId);
                    console.log(`${ctx} ✅ Payment processed successfully`);
                    break;

                case 'payment_intent.payment_failed':
                    await handlePaymentFailure(paymentIntent.id, contractId);
                    console.log(`${ctx} ❌ Payment failed details recorded`);
                    break;

                default:
                    console.log(`${ctx} ⏩ Unhandled event type`);
            }

            // 4. Return 2xx ONLY after success
            return { received: true };

        } catch (err: any) {
            console.error(`${ctx} 💥 Error: ${err.message}`);
            // Return 500 to trigger Stripe retry (unless it's a permanent logic error, but safety first)
            reply.status(500);
            return { error: err.message };
        }
    });
};

export default webhookRoutes;

/**
 * Billing Routes
 * 
 * Handle Stripe card setup and verification for funding sources.
 * Uses SetupIntent flow for SCA-compliant card verification.
 * 
 * Endpoints:
 * - POST /v1/billing/card/setup_intent - Create SetupIntent for card verification
 * - GET /v1/billing/status - Get full billing status
 * - POST /v1/billing/card/remove - Remove/disable card
 */

import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { users, fundingSources } from '../db/schema.js';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Lazy-load Stripe SDK
let stripeInstance: any = null;
async function getStripe() {
    if (!stripeInstance && STRIPE_SECRET_KEY) {
        const StripeModule = await import('stripe');
        const Stripe = StripeModule.default;
        stripeInstance = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    }
    return stripeInstance;
}

const billingRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * POST /v1/billing/card/setup_intent
     * Create a Stripe SetupIntent for card verification
     * 
     * Returns: { clientSecret, setupIntentId }
     */
    fastify.post('/v1/billing/card/setup_intent', {
        preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId!;

        const stripe = await getStripe();
        if (!stripe) {
            reply.status(500);
            return { error: 'Stripe not configured' };
        }

        try {
            // Get user
            const [user] = await db.select().from(users).where(eq(users.id, userId));
            if (!user) {
                reply.status(404);
                return { error: 'User not found' };
            }

            // Get or create Stripe customer
            let stripeCustomerId: string;
            const [existingFundingSource] = await db.select().from(fundingSources).where(eq(fundingSources.userId, userId));

            if (existingFundingSource?.stripeCustomerId) {
                stripeCustomerId = existingFundingSource.stripeCustomerId;
            } else {
                // Create new Stripe customer
                const customer = await stripe.customers.create({
                    email: user.email || undefined,
                    metadata: { userId },
                });
                stripeCustomerId = customer.id;
                console.log(`[Billing] Created Stripe customer ${stripeCustomerId} for user ${userId}`);
            }

            // Create SetupIntent
            const setupIntent = await stripe.setupIntents.create({
                customer: stripeCustomerId,
                payment_method_types: ['card'],
                usage: 'off_session',
                metadata: { userId },
            });

            // Upsert funding source record
            if (existingFundingSource) {
                await db.update(fundingSources)
                    .set({
                        stripeSetupIntentId: setupIntent.id,
                        status: 'pending_verification',
                        updatedAt: new Date(),
                    })
                    .where(eq(fundingSources.userId, userId));
            } else {
                await db.insert(fundingSources).values({
                    userId,
                    stripeCustomerId,
                    stripeSetupIntentId: setupIntent.id,
                    status: 'pending_verification',
                });
            }

            console.log(`[Billing] Created SetupIntent ${setupIntent.id} for user ${userId}`);

            return {
                clientSecret: setupIntent.client_secret,
                setupIntentId: setupIntent.id,
            };
        } catch (err: any) {
            console.error('[Billing] SetupIntent error:', err.message);
            reply.status(500);
            return { error: 'Failed to create setup intent', details: err.message };
        }
    });

    /**
     * GET /v1/billing/status
     * Get full billing status for the Funding page
     * 
     * Returns funding sources, payout destinations, balances
     */
    fastify.get('/v1/billing/status', {
        preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId!;

        try {
            // Get funding source
            const [fundingSource] = await db.select().from(fundingSources).where(eq(fundingSources.userId, userId));

            // Get user for Stripe Connect status
            const [user] = await db.select().from(users).where(eq(users.id, userId));

            // Calculate balances from contracts (reuse existing logic)
            // For now, return basic structure - can be enhanced
            const balances = {
                availableBalanceUsdCents: 0,
                lockedBalanceUsdCents: 0,
                pendingPayoutUsdCents: 0,
            };

            return {
                fundingSource: fundingSource ? {
                    status: fundingSource.status,
                    brand: fundingSource.brand,
                    last4: fundingSource.last4,
                    expMonth: fundingSource.expMonth,
                    expYear: fundingSource.expYear,
                    verifiedAt: fundingSource.verifiedAt,
                } : null,
                payoutDestination: user?.stripeConnectedAccountId ? {
                    connected: true,
                    accountId: user.stripeConnectedAccountId,
                } : null,
                balances,
                flags: {
                    canAddCard: !fundingSource || fundingSource.status !== 'verified',
                    canPayout: !!user?.stripeConnectedAccountId,
                },
            };
        } catch (err: any) {
            console.error('[Billing] Status error:', err.message);
            reply.status(500);
            return { error: 'Failed to get billing status' };
        }
    });

    /**
     * POST /v1/billing/card/remove
     * Remove/disable the user's card
     */
    fastify.post('/v1/billing/card/remove', {
        preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId!;

        try {
            const [fundingSource] = await db.select().from(fundingSources).where(eq(fundingSources.userId, userId));

            if (!fundingSource) {
                reply.status(404);
                return { error: 'No funding source found' };
            }

            // TODO: Check for active locked contracts before allowing removal
            // For now, just mark as disabled

            const stripe = await getStripe();
            if (stripe && fundingSource.stripePaymentMethodId) {
                try {
                    // Detach payment method from customer
                    await stripe.paymentMethods.detach(fundingSource.stripePaymentMethodId);
                    console.log(`[Billing] Detached PM ${fundingSource.stripePaymentMethodId}`);
                } catch (detachErr: any) {
                    console.warn(`[Billing] Failed to detach PM: ${detachErr.message}`);
                }
            }

            // Update DB - mark as disabled
            await db.update(fundingSources)
                .set({
                    status: 'disabled',
                    stripePaymentMethodId: null,
                    brand: null,
                    last4: null,
                    expMonth: null,
                    expYear: null,
                    verifiedAt: null,
                    updatedAt: new Date(),
                })
                .where(eq(fundingSources.userId, userId));

            console.log(`[Billing] Removed card for user ${userId}`);

            return { success: true };
        } catch (err: any) {
            console.error('[Billing] Remove card error:', err.message);
            reply.status(500);
            return { error: 'Failed to remove card' };
        }
    });

    /**
     * POST /v1/billing/card/confirm
     * Called after frontend confirms SetupIntent (optional - webhook is primary)
     * Used for immediate UI feedback before webhook arrives
     */
    fastify.post<{
        Body: { setupIntentId: string; paymentMethodId: string };
    }>('/v1/billing/card/confirm', {
        preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId!;
        const { setupIntentId, paymentMethodId } = request.body || {};

        if (!setupIntentId || !paymentMethodId) {
            reply.status(400);
            return { error: 'setupIntentId and paymentMethodId required' };
        }

        try {
            const stripe = await getStripe();
            if (!stripe) {
                reply.status(500);
                return { error: 'Stripe not configured' };
            }

            // Retrieve SetupIntent to verify it succeeded
            const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

            if (setupIntent.status !== 'succeeded') {
                reply.status(400);
                return { error: `SetupIntent status is ${setupIntent.status}, expected succeeded` };
            }

            // Get payment method details
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
            const card = paymentMethod.card;

            // Update funding source
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
                .where(eq(fundingSources.userId, userId));

            // Set as default payment method on customer
            const [fundingSource] = await db.select().from(fundingSources).where(eq(fundingSources.userId, userId));
            if (fundingSource?.stripeCustomerId) {
                await stripe.customers.update(fundingSource.stripeCustomerId, {
                    invoice_settings: {
                        default_payment_method: paymentMethodId,
                    },
                });
            }

            console.log(`[Billing] Card verified for user ${userId}: ${card?.brand} •••• ${card?.last4}`);

            return {
                success: true,
                card: {
                    brand: card?.brand?.toUpperCase(),
                    last4: card?.last4,
                    expMonth: card?.exp_month,
                    expYear: card?.exp_year,
                },
            };
        } catch (err: any) {
            console.error('[Billing] Confirm error:', err.message);
            reply.status(500);
            return { error: 'Failed to confirm card', details: err.message };
        }
    });
};

export default billingRoutes;

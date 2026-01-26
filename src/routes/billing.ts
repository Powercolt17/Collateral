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
import { users, fundingSources, identities, connectAccounts } from '../db/schema.js';
import { computeBalances, appendAccountEvent, AccountEventType } from '../services/balances.js';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Lazy-load Stripe SDK
let stripeInstance: any = null;
async function getStripe() {
    if (!stripeInstance && STRIPE_SECRET_KEY) {
        const StripeModule = await import('stripe');
        const Stripe = StripeModule.default;
        stripeInstance = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

        // Log key info for debugging (safe - only shows prefix)
        const keyPrefix = STRIPE_SECRET_KEY.substring(0, 12);
        console.log(`[Billing] Stripe initialized with key: ${keyPrefix}...`);
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
            console.log(`[Billing] SetupIntent details:`, {
                id: setupIntent.id,
                hasClientSecret: !!setupIntent.client_secret,
                clientSecretPrefix: setupIntent.client_secret?.substring(0, 25),
                clientSecretContainsSecret: setupIntent.client_secret?.includes('_secret_'),
                customer: setupIntent.customer,
                status: setupIntent.status,
            });

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
            // Get funding source - with fallback if table doesn't exist
            let fundingSource = null;
            try {
                const rows = await db.select().from(fundingSources).where(eq(fundingSources.userId, userId));
                fundingSource = rows[0] || null;
            } catch (dbErr: any) {
                // Table might not exist yet - log but don't fail
                console.warn('[Billing] funding_sources query failed:', dbErr.message);
                // If the error is about the relation not existing, continue with null
                if (dbErr.message?.includes('does not exist')) {
                    console.warn('[Billing] funding_sources table not found - returning empty state');
                } else {
                    throw dbErr; // Re-throw other errors
                }
            }

            // Get user info and connect status
            // Funding page must reflect connect_accounts table, not users table
            const [connectAccount] = await db.select().from(connectAccounts).where(eq(connectAccounts.userId, userId));
            // Get identity status (for potential freeze)
            const [identity] = await db.select().from(identities).where(eq(identities.userId, userId));

            // Compute derived balances from account ledger events
            const derivedBalances = await computeBalances(userId);
            const balances = {
                availableBalanceUsdCents: derivedBalances.availableCents,
                lockedBalanceUsdCents: derivedBalances.lockedCents,
                pendingPayoutUsdCents: derivedBalances.pendingPayoutCents,
            };

            return {
                identityStatus: identity?.status || 'ACTIVE',
                fundingSource: fundingSource ? {
                    status: fundingSource.status,
                    brand: fundingSource.brand,
                    last4: fundingSource.last4,
                    expMonth: fundingSource.expMonth,
                    expYear: fundingSource.expYear,
                    verifiedAt: fundingSource.verifiedAt,
                } : null,
                payoutDestination: (connectAccount?.stripeConnectAccountId) ? {
                    connected: connectAccount.onboardingStatus === 'connected', // Status check
                    accountId: connectAccount.stripeConnectAccountId,
                    status: connectAccount.onboardingStatus,
                    payoutsEnabled: !!connectAccount.payoutsEnabled,
                } : null,
                balances,
                flags: {
                    canAddCard: !fundingSource || fundingSource.status !== 'verified',
                    canPayout: !!(connectAccount?.payoutsEnabled),
                },
            };
        } catch (err: any) {
            console.error('[Billing] Status error:', {
                userId,
                message: err?.message,
                stack: err?.stack,
                name: err?.name,
            });
            reply.status(500);
            return {
                ok: false,
                error: 'billing_status_failed',
                message: err?.message ?? 'unknown',
                detail: err?.name,
            };
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

    /**
     * POST /v1/billing/add-funds
     * Charge user's saved card and add to available balance
     */
    fastify.post<{
        Body: { amountCents: number };
    }>('/v1/billing/add-funds', {
        preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId!;
        const { amountCents } = request.body || {};

        if (!amountCents || amountCents < 100) {
            reply.status(400);
            return { error: 'Minimum amount is $1.00 (100 cents)' };
        }

        try {
            // Get user's saved funding source
            const [fundingSource] = await db.select().from(fundingSources).where(eq(fundingSources.userId, userId));

            if (!fundingSource?.stripePaymentMethodId || !fundingSource?.stripeCustomerId) {
                reply.status(400);
                return { error: 'No verified funding source. Please add a card first.' };
            }

            if (fundingSource.status !== 'verified') {
                reply.status(400);
                return { error: 'Funding source not verified.' };
            }

            const stripe = await getStripe();
            if (!stripe) {
                reply.status(500);
                return { error: 'Stripe not configured' };
            }

            // Create PaymentIntent with saved card (off-session)
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountCents,
                currency: 'usd',
                customer: fundingSource.stripeCustomerId,
                payment_method: fundingSource.stripePaymentMethodId,
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: 'never',
                },
                // off_session: true, // REMOVED: User is likely in-session (on frontend). 
                // Setting off_session: true increases decline rate for SCA cards during manual top-up.
                confirm: true,
                metadata: {
                    userId,
                    type: 'add_funds',
                    platform: 'collateral',
                },
            });

            console.log(`[Billing] Add funds PaymentIntent ${paymentIntent.id} status: ${paymentIntent.status}`);

            if (paymentIntent.status === 'succeeded') {
                // Write FUNDS_ADDED ledger event (idempotent via payment_intent.id)
                await appendAccountEvent({
                    userId,
                    eventType: AccountEventType.FUNDS_ADDED,
                    amountCents,
                    idempotencyKey: `funds_added_${paymentIntent.id}`,
                    metadata: {
                        paymentIntentId: paymentIntent.id,
                        source: 'card_topup',
                    },
                });

                // Get updated balances
                const newBalances = await computeBalances(userId);

                console.log(`[Billing] Added $${(amountCents / 100).toFixed(2)} to user ${userId}'s balance`);

                return {
                    success: true,
                    amountCents,
                    balances: {
                        availableBalanceUsdCents: newBalances.availableCents,
                        lockedBalanceUsdCents: newBalances.lockedCents,
                        pendingPayoutUsdCents: newBalances.pendingPayoutCents,
                    },
                    paymentIntentId: paymentIntent.id,
                };
            } else if (paymentIntent.status === 'requires_action') {
                // SCA required - return client secret for frontend to handle
                return {
                    requiresAction: true,
                    clientSecret: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.id,
                };
            } else {
                reply.status(400);
                return { error: `Payment failed with status: ${paymentIntent.status}` };
            }

        } catch (err: any) {
            console.error('[Billing] Add funds error:', err.message);
            reply.status(500);
            return { error: err.message || 'Failed to add funds' };
        }
    });

    /**
     * ADMIN TEST HELPER: Attach Test Card
     * POST /v1/admin/test/attach-card
     * ONLY available if ALLOW_TEST_HELPERS=true AND not production.
     */
    const ALLOW_TEST_HELPERS = process.env.ALLOW_TEST_HELPERS === 'true' && process.env.NODE_ENV !== 'production';

    if (ALLOW_TEST_HELPERS) {
        fastify.post('/v1/admin/test/attach-card', {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                // 1. Auth User
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }

                // 2. Admin Check (Strict)
                const adminKey = request.headers['x-admin-key'];
                if (!process.env.ADMIN_API_KEY) {
                    // This route shouldn't even be registered if not safe, but double check
                    if (process.env.NODE_ENV === 'production') return reply.status(500).send({ error: 'Misconfigured' });
                }
                if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
                    return reply.status(403).send({ error: 'Unauthorized' });
                }
            },
        }, async (request, reply) => {
            const userId = request.userId!;

            try {
                const stripe = await getStripe();
                if (!stripe) return { error: 'Stripe not configured' };

                // 1. Get/Create Customer
                let stripeCustomerId: string;
                const [existing] = await db.select().from(fundingSources).where(eq(fundingSources.userId, userId));

                if (existing?.stripeCustomerId) {
                    stripeCustomerId = existing.stripeCustomerId;
                } else {
                    const [user] = await db.select().from(users).where(eq(users.id, userId));
                    const customer = await stripe.customers.create({ email: user?.email, metadata: { userId } });
                    stripeCustomerId = customer.id;
                }

                // 2. Create Payment Method (from Token)
                // In test mode, 'tok_visa' creates a verified card PM
                const pm = await stripe.paymentMethods.create({ type: 'card', card: { token: 'tok_visa' } });

                // 3. Attach to Customer
                await stripe.paymentMethods.attach(pm.id, { customer: stripeCustomerId });

                // 4. Set Default
                await stripe.customers.update(stripeCustomerId, {
                    invoice_settings: { default_payment_method: pm.id }
                });

                // 5. Update DB
                const card = pm.card;
                if (existing) {
                    await db.update(fundingSources).set({
                        stripeCustomerId,
                        stripePaymentMethodId: pm.id,
                        status: 'verified',
                        brand: card?.brand?.toUpperCase(),
                        last4: card?.last4,
                        expMonth: card?.exp_month,
                        expYear: card?.exp_year,
                        verifiedAt: new Date(),
                        updatedAt: new Date()
                    }).where(eq(fundingSources.userId, userId));
                } else {
                    await db.insert(fundingSources).values({
                        userId,
                        stripeCustomerId,
                        stripePaymentMethodId: pm.id,
                        status: 'verified',
                        brand: card?.brand?.toUpperCase(),
                        last4: card?.last4,
                        expMonth: card?.exp_month,
                        expYear: card?.exp_year,
                        verifiedAt: new Date()
                    });
                }

                return { success: true, message: 'Test card attached', paymentMethodId: pm.id };

            } catch (err: any) {
                console.error('[Billing] Admin Attach Error:', err);
                reply.status(500);
                return { error: err.message };
            }
        });
    }

    /**
     * DEV-ONLY: Debug endpoint to test balance ledger
     * POST /v1/billing/debug/add-balance
     */
    const IS_DEV = process.env.NODE_ENV !== 'production';
    if (IS_DEV) {
        fastify.post<{
            Body: { amountCents?: number };
        }>('/v1/billing/debug/add-balance', {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }
            },
        }, async (request, reply) => {
            const userId = request.userId!;
            const amountCents = (request.body as any)?.amountCents || 100000; // Default $1000

            console.log(`[DEBUG] Adding ${amountCents} cents to user ${userId}`);

            try {
                const result = await appendAccountEvent({
                    userId,
                    eventType: AccountEventType.FUNDS_ADDED,
                    amountCents,
                    idempotencyKey: `debug_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                    metadata: { source: 'debug_endpoint' },
                });

                const balances = await computeBalances(userId);

                return {
                    success: true,
                    insertResult: result,
                    balances,
                };
            } catch (err: any) {
                console.error('[DEBUG] Error:', err.message, err.stack);
                return {
                    success: false,
                    error: err.message,
                    code: err.code,
                };
            }
        });
    }
};

export default billingRoutes;

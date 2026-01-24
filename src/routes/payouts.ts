/**
 * Payout Routes
 * 
 * Stripe Connect onboarding and payout execution.
 * Enables winners to receive funds via Stripe Connect Express accounts.
 */

import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { users, connectAccounts } from '../db/schema.js';
import { computeBalances, appendAccountEvent, AccountEventType } from '../services/balances.js';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_PUBLIC_URL = process.env.APP_PUBLIC_URL || 'http://localhost:5173';

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

const payoutRoutes: FastifyPluginAsync = async (fastify) => {

    /**
     * POST /v1/payouts/connect/create
     * Create a Stripe Connect Express account and return onboarding URL
     */
    fastify.post('/v1/payouts/connect/create', {
        preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId!;

        try {
            const stripe = await getStripe();
            if (!stripe) {
                reply.status(500);
                return { error: 'Stripe not configured' };
            }

            // Check if user already has a Connect account
            let [existingAccount] = await db
                .select()
                .from(connectAccounts)
                .where(eq(connectAccounts.userId, userId));

            let stripeAccountId: string;

            if (existingAccount) {
                stripeAccountId = existingAccount.stripeConnectAccountId;

                // If already connected, just return the status
                if (existingAccount.onboardingStatus === 'connected') {
                    return {
                        ok: true,
                        accountId: stripeAccountId,
                        status: 'connected',
                        message: 'Connect account already configured',
                    };
                }
            } else {
                // Get user email for the account
                const [user] = await db.select().from(users).where(eq(users.id, userId));

                // Create new Express account
                const account = await stripe.accounts.create({
                    type: 'express',
                    country: 'US',
                    email: user?.email || undefined,
                    capabilities: {
                        transfers: { requested: true },
                    },
                    metadata: {
                        userId,
                        platform: 'collateral',
                    },
                });

                stripeAccountId = account.id;

                // Save to database
                await db.insert(connectAccounts).values({
                    userId,
                    stripeConnectAccountId: stripeAccountId,
                    onboardingStatus: 'pending',
                    accountType: 'express',
                });

                console.log(`[Payouts] Created Connect account ${stripeAccountId} for user ${userId}`);
            }

            // Create onboarding link
            const accountLink = await stripe.accountLinks.create({
                account: stripeAccountId,
                refresh_url: `${APP_PUBLIC_URL}/funding?connect_refresh=true`,
                return_url: `${APP_PUBLIC_URL}/funding?connect_return=true`,
                type: 'account_onboarding',
            });

            return {
                ok: true,
                accountId: stripeAccountId,
                onboardingUrl: accountLink.url,
                expiresAt: new Date(accountLink.expires_at * 1000).toISOString(),
            };

        } catch (err: any) {
            console.error('[Payouts] Create Connect error:', err.message);
            reply.status(500);
            return { error: err.message || 'Failed to create Connect account' };
        }
    });

    /**
     * GET /v1/payouts/connect/status
     * Get current Connect account status from Stripe
     */
    fastify.get('/v1/payouts/connect/status', {
        preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId!;

        try {
            // Get local record
            const [account] = await db
                .select()
                .from(connectAccounts)
                .where(eq(connectAccounts.userId, userId));

            if (!account) {
                return {
                    ok: true,
                    status: 'not_configured',
                    payoutsEnabled: false,
                    chargesEnabled: false,
                };
            }

            const stripe = await getStripe();
            if (!stripe) {
                // Return cached values if Stripe unavailable
                return {
                    ok: true,
                    accountId: account.stripeConnectAccountId,
                    status: account.onboardingStatus,
                    payoutsEnabled: !!account.payoutsEnabled,
                    chargesEnabled: !!account.chargesEnabled,
                    detailsSubmitted: !!account.detailsSubmitted,
                };
            }

            // Fetch fresh status from Stripe
            const stripeAccount = await stripe.accounts.retrieve(account.stripeConnectAccountId);

            // Update local record
            const newStatus = stripeAccount.payouts_enabled ? 'connected' :
                stripeAccount.details_submitted ? 'pending' :
                    stripeAccount.requirements?.disabled_reason ? 'restricted' : 'pending';

            await db.update(connectAccounts)
                .set({
                    onboardingStatus: newStatus,
                    payoutsEnabled: stripeAccount.payouts_enabled ? 1 : 0,
                    chargesEnabled: stripeAccount.charges_enabled ? 1 : 0,
                    detailsSubmitted: stripeAccount.details_submitted ? 1 : 0,
                    updatedAt: new Date(),
                })
                .where(eq(connectAccounts.userId, userId));

            return {
                ok: true,
                accountId: account.stripeConnectAccountId,
                status: newStatus,
                payoutsEnabled: stripeAccount.payouts_enabled,
                chargesEnabled: stripeAccount.charges_enabled,
                detailsSubmitted: stripeAccount.details_submitted,
                requirements: stripeAccount.requirements?.currently_due || [],
            };

        } catch (err: any) {
            console.error('[Payouts] Connect status error:', err.message);
            reply.status(500);
            return { error: err.message || 'Failed to get Connect status' };
        }
    });

    /**
     * POST /v1/payouts/run
     * Execute pending payouts (admin/job endpoint)
     * 
     * For MVP: processes all PAYOUT_QUEUED for users with payouts_enabled
     */
    fastify.post('/v1/payouts/run', {
        preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            // For production, add admin authentication
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        try {
            const stripe = await getStripe();
            if (!stripe) {
                reply.status(500);
                return { error: 'Stripe not configured' };
            }

            // Get all connect accounts with payouts enabled
            const enabledAccounts = await db
                .select()
                .from(connectAccounts)
                .where(eq(connectAccounts.payoutsEnabled, 1));

            if (enabledAccounts.length === 0) {
                return { ok: true, processed: 0, message: 'No accounts with payouts enabled' };
            }

            let processed = 0;
            let failed = 0;
            const results: any[] = [];

            for (const account of enabledAccounts) {
                const userId = account.userId;
                const balances = await computeBalances(userId);

                if (balances.pendingPayoutCents <= 0) {
                    continue;
                }

                try {
                    // Create transfer to Connect account
                    const transfer = await stripe.transfers.create({
                        amount: balances.pendingPayoutCents,
                        currency: 'usd',
                        destination: account.stripeConnectAccountId,
                        metadata: {
                            userId,
                            type: 'settlement_payout',
                        },
                    });

                    // Write PAYOUT_SENT event
                    await appendAccountEvent({
                        userId,
                        eventType: AccountEventType.PAYOUT_SENT,
                        amountCents: balances.pendingPayoutCents,
                        idempotencyKey: `payout_sent_${transfer.id}`,
                        metadata: {
                            transferId: transfer.id,
                            stripeConnectAccountId: account.stripeConnectAccountId,
                        },
                    });

                    processed++;
                    results.push({
                        userId,
                        transferId: transfer.id,
                        amountCents: balances.pendingPayoutCents,
                        status: 'success',
                    });

                    console.log(`[Payouts] Sent $${(balances.pendingPayoutCents / 100).toFixed(2)} to ${account.stripeConnectAccountId}`);

                } catch (payErr: any) {
                    // Write PAYOUT_FAILED event
                    await appendAccountEvent({
                        userId,
                        eventType: AccountEventType.PAYOUT_FAILED,
                        amountCents: balances.pendingPayoutCents,
                        idempotencyKey: `payout_failed_${userId}_${Date.now()}`,
                        metadata: {
                            error: payErr.message,
                            stripeConnectAccountId: account.stripeConnectAccountId,
                        },
                    });

                    failed++;
                    results.push({
                        userId,
                        amountCents: balances.pendingPayoutCents,
                        status: 'failed',
                        error: payErr.message,
                    });

                    console.error(`[Payouts] Failed for user ${userId}:`, payErr.message);
                }
            }

            return {
                ok: true,
                processed,
                failed,
                results,
            };

        } catch (err: any) {
            console.error('[Payouts] Run error:', err.message);
            reply.status(500);
            return { error: err.message || 'Failed to run payouts' };
        }
    });
};

export default payoutRoutes;

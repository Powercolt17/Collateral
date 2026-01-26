/**
 * Payout Routes
 * 
 * Stripe Connect onboarding and payout execution.
 * Enables winners to receive funds via Stripe Connect Express accounts.
 */

import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { sql, and, eq, isNotNull } from 'drizzle-orm';
import { db } from '../db/client.js';
import { users, connectAccounts, identities, accountLedgerEvents } from '../db/schema.js';
import { appendAccountEvent, AccountEventType } from '../services/balances.js';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_PUBLIC_URL = process.env.APP_PUBLIC_URL || 'http://localhost:5173';

if (process.env.NODE_ENV === 'production') {
    console.log(`[Payouts] APP_PUBLIC_URL=${APP_PUBLIC_URL}`);
    if (!APP_PUBLIC_URL.startsWith('https')) {
        console.warn('[Payouts] ⚠️ WARNING: APP_PUBLIC_URL is not HTTPS in production!');
    }
}

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
                refresh_url: `${APP_PUBLIC_URL}/#/funding?connect_refresh=true`,
                return_url: `${APP_PUBLIC_URL}/#/funding?connect_return=true`,
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
            // Admin Auth Check
            const adminKey = request.headers['x-admin-key'];

            // PROD SAFETY: Strict configuration check
            if (!process.env.ADMIN_API_KEY && process.env.NODE_ENV === 'production') {
                return reply.status(500).send({ error: 'ADMIN_API_KEY not configured' });
            }

            // STRICT CHECK: Header must match Env Var
            if (!process.env.ADMIN_API_KEY || adminKey !== process.env.ADMIN_API_KEY) {
                return reply.status(403).send({ error: 'Unauthorized: Admin access required' });
            }
        },
    }, async (request, reply) => {
        try {
            const stripe = await getStripe();
            if (!stripe) {
                reply.status(500);
                return { error: 'Stripe not configured' };
            }

            // GLOBAL QUERY: Get all pending payouts joined with eligible connect accounts
            // Filters:
            // 1. Payouts Enabled (connect_accounts.payouts_enabled = 1)
            // 2. Not Suspended (identities.status != 'SUSPENDED')
            // 3. Not Already Sent (NOT EXISTS PAYOUT_SENT with origin_event_id = queued.id)

            const pendingQuery = sql`
                SELECT 
                    e.id as event_id,
                    e.user_id,
                    e.amount_cents,
                    e.contract_id,
                    c.stripe_connect_account_id
                FROM account_ledger_events e
                JOIN connect_accounts c ON e.user_id = c.user_id
                LEFT JOIN identities i ON e.user_id = i.user_id
                WHERE e.event_type = 'PAYOUT_QUEUED'
                  AND c.payouts_enabled = 1
                  AND (i.status IS NULL OR i.status != 'SUSPENDED')
                  AND NOT EXISTS (
                      SELECT 1 FROM account_ledger_events s
                      WHERE s.origin_event_id = e.id
                        AND s.event_type IN ('PAYOUT_SENT', 'PAYOUT_FAILED')
                  )
            `;

            const rawRes = await db.execute(pendingQuery);
            // Drizzle/Driver normalization: result might be an array or object with rows
            const pendingEvents: any[] = Array.isArray(rawRes) ? rawRes : ((rawRes as any).rows ?? []);

            if (pendingEvents.length === 0) {
                return { ok: true, processed: 0, message: 'No pending payouts found' };
            }

            console.log(`[Payouts] Found ${pendingEvents.length} pending payouts`);

            let processed = 0;
            let failed = 0;
            const results: any[] = [];

            // Process each event
            // Note: Since we fetched specific fields via raw SQL, we cast them
            for (const row of pendingEvents) {
                const eventId = row.event_id as string;
                const userId = row.user_id as string;
                const amountCents = Number(row.amount_cents);
                const contractId = row.contract_id as string;
                const stripeConnectId = row.stripe_connect_account_id as string;

                try {
                    // Create transfer
                    const transfer = await stripe.transfers.create({
                        amount: amountCents,
                        currency: 'usd',
                        destination: stripeConnectId,
                        metadata: {
                            userId,
                            type: 'settlement_payout',
                            originEventId: eventId,
                            contractId: contractId || 'n/a'
                        },
                    }, {
                        idempotencyKey: `payout_tx_${eventId}`
                    });

                    // Write PAYOUT_SENT event
                    await appendAccountEvent({
                        userId,
                        eventType: AccountEventType.PAYOUT_SENT,
                        amountCents: amountCents,
                        idempotencyKey: `payout_sent_${transfer.id}`,
                        originEventId: eventId, // IDEMPOTENCY COLUMN
                        metadata: {
                            transferId: transfer.id,
                            stripeConnectAccountId: stripeConnectId,
                            originEventId: eventId,
                        },
                    });

                    processed++;
                    results.push({ userId, transferId: transfer.id, amountCents, status: 'success' });
                    console.log(`[Payouts] Sent $${(amountCents / 100).toFixed(2)} to ${stripeConnectId} (Ref: ${eventId})`);

                } catch (payErr: any) {
                    if (payErr.code === 'balance_insufficient') {
                        console.error(`[Payouts] ⚠️ INSUFFICIENT PLATFORM FUNDS for user ${userId}`);
                    }

                    // Write PAYOUT_FAILED event
                    await appendAccountEvent({
                        userId,
                        eventType: AccountEventType.PAYOUT_FAILED,
                        amountCents,
                        idempotencyKey: `payout_failed_${eventId}`, // DETERMINISTIC
                        originEventId: eventId,
                        metadata: {
                            error: payErr.message,
                            code: payErr.code,
                            stripeConnectAccountId: stripeConnectId,
                            originEventId: eventId,
                        },
                    });

                    failed++;
                    results.push({ userId, amountCents, status: 'failed', error: payErr.message });
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

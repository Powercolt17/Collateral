/**
 * Stripe Connect Routes
 * 
 * OAuth flow for connecting user's Stripe account:
 * 1. GET /v1/connect/stripe/start - Redirect to Stripe OAuth
 * 2. GET /v1/connect/stripe/callback - Handle OAuth callback
 * 3. GET /v1/connect/stripe/status - Check connection status
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/client.js';
import { connectedAccounts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { randomBytes } from 'crypto';

// =============================================================================
// CONSTANTS
// =============================================================================

const STRIPE_CLIENT_ID = process.env.STRIPE_CLIENT_ID;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// OAuth state tokens (in production, use Redis or DB)
const oauthStates = new Map<string, { userId: string; expiresAt: number }>();

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

function isPlaceholderValue(value: string | undefined): boolean {
    if (!value) return true;
    return value.includes('YOUR') ||
        value.includes('CHANGEME') ||
        value.includes('xxx') ||
        value === 'ca_' ||
        value.length < 10;
}

function getStripeMode(): 'test' | 'live' | 'unknown' {
    if (STRIPE_SECRET_KEY?.startsWith('sk_test_')) return 'test';
    if (STRIPE_SECRET_KEY?.startsWith('sk_live_')) return 'live';
    return 'unknown';
}

// Startup logging (safe - no secrets)
console.log(`[Stripe Connect] mode=${getStripeMode()} client_id=${STRIPE_CLIENT_ID ? 'present' : 'MISSING'}`);
if (STRIPE_CLIENT_ID && isPlaceholderValue(STRIPE_CLIENT_ID)) {
    console.warn('[Stripe Connect] ⚠️ STRIPE_CLIENT_ID appears to be a placeholder!');
}

// =============================================================================
// ROUTES
// =============================================================================

async function stripeConnectRoutes(fastify: FastifyInstance) {
    /**
     * GET /v1/connect/stripe/start
     * 
     * Initiate Stripe Connect OAuth flow
     * Returns URL to redirect user to Stripe
     */
    fastify.get(
        '/v1/connect/stripe/start',
        {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }
            },
        },
        async (request, reply) => {
            const userId = request.userId!;

            // Validate STRIPE_CLIENT_ID exists and is not placeholder
            if (!STRIPE_CLIENT_ID) {
                return reply.status(500).send({
                    error: 'STRIPE_CLIENT_ID not configured',
                    hint: 'Set STRIPE_CLIENT_ID in backend .env (get from Stripe Dashboard > Connect > Settings)',
                });
            }

            if (isPlaceholderValue(STRIPE_CLIENT_ID)) {
                return reply.status(500).send({
                    error: 'STRIPE_CLIENT_ID is a placeholder value',
                    hint: 'Replace ca_YOUR_CLIENT_ID_HERE with your real Client ID from Stripe Dashboard > Connect > Settings',
                });
            }

            if (!STRIPE_CLIENT_ID.startsWith('ca_')) {
                return reply.status(500).send({
                    error: 'STRIPE_CLIENT_ID has invalid format',
                    hint: 'Client ID must start with ca_ (get from Stripe Dashboard > Connect > Settings)',
                });
            }

            // Check if already connected
            const [existing] = await db
                .select()
                .from(connectedAccounts)
                .where(
                    and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'STRIPE')
                    )
                )
                .limit(1);

            if (existing?.verificationStatus === 'VERIFIED') {
                return reply.status(200).send({
                    alreadyConnected: true,
                    stripeAccountId: existing.externalAccountId,
                });
            }

            // Generate state token for CSRF protection
            const state = randomBytes(16).toString('hex');
            oauthStates.set(state, {
                userId,
                expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
            });

            // Build Stripe Connect OAuth URL
            const redirectUri = `${FRONTEND_URL}/stripe/callback`;
            const oauthUrl = new URL('https://connect.stripe.com/oauth/authorize');
            oauthUrl.searchParams.set('response_type', 'code');
            oauthUrl.searchParams.set('client_id', STRIPE_CLIENT_ID);
            oauthUrl.searchParams.set('scope', 'read_write'); // Stripe requires read_write - we enforce read-only at API level
            oauthUrl.searchParams.set('redirect_uri', redirectUri);
            oauthUrl.searchParams.set('state', state);

            return reply.status(200).send({
                oauthUrl: oauthUrl.toString(),
                state,
            });
        }
    );

    /**
     * POST /v1/connect/stripe/callback
     * 
     * Handle OAuth callback - exchange code for account ID
     */
    fastify.post<{ Body: { code: string; state: string } }>(
        '/v1/connect/stripe/callback',
        {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }
            },
        },
        async (request, reply) => {
            const userId = request.userId!;
            const { code, state } = request.body;

            if (!code || !state) {
                return reply.status(400).send({ error: 'code and state are required' });
            }

            // Verify state token
            const stateData = oauthStates.get(state);
            if (!stateData) {
                return reply.status(400).send({ error: 'Invalid or expired state token' });
            }

            if (stateData.userId !== userId) {
                return reply.status(400).send({ error: 'State token mismatch' });
            }

            if (Date.now() > stateData.expiresAt) {
                oauthStates.delete(state);
                return reply.status(400).send({ error: 'State token expired' });
            }

            oauthStates.delete(state);

            // Exchange code for connected account ID
            if (!STRIPE_SECRET_KEY) {
                return reply.status(500).send({ error: 'Stripe not configured' });
            }

            try {
                const tokenResponse = await fetch('https://connect.stripe.com/oauth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        code,
                        client_secret: STRIPE_SECRET_KEY,
                    }),
                });

                const tokenData = await tokenResponse.json() as {
                    stripe_user_id?: string;
                    error?: string;
                    error_description?: string;
                };

                if (!tokenResponse.ok || tokenData.error) {
                    console.error('[Stripe Connect] Token exchange failed:', tokenData);
                    return reply.status(400).send({
                        error: tokenData.error_description || 'Failed to connect Stripe account',
                    });
                }

                const stripeAccountId = tokenData.stripe_user_id;
                if (!stripeAccountId) {
                    return reply.status(400).send({ error: 'No account ID returned from Stripe' });
                }

                const now = new Date();

                // Upsert connected account
                await db
                    .insert(connectedAccounts)
                    .values({
                        userId,
                        platform: 'STRIPE',
                        externalAccountId: stripeAccountId,
                        status: 'ACTIVE',
                        verificationStatus: 'VERIFIED', // OAuth = verified
                        verifiedAt: now,
                        connectedAt: now,
                        metadataJson: {
                            connectedVia: 'oauth',
                            connectedAt: now.toISOString(),
                        },
                    })
                    .onConflictDoUpdate({
                        target: [connectedAccounts.userId, connectedAccounts.platform],
                        set: {
                            externalAccountId: stripeAccountId,
                            status: 'ACTIVE',
                            verificationStatus: 'VERIFIED',
                            verifiedAt: now,
                            metadataJson: {
                                connectedVia: 'oauth',
                                connectedAt: now.toISOString(),
                            },
                        },
                    });

                console.log(`[Stripe Connect] User ${userId} connected account ${stripeAccountId}`);

                return reply.status(200).send({
                    success: true,
                    stripeAccountId,
                    verificationStatus: 'VERIFIED',
                });

            } catch (err: any) {
                console.error('[Stripe Connect] Error:', err);
                return reply.status(500).send({ error: 'Failed to connect Stripe account' });
            }
        }
    );

    /**
     * GET /v1/connect/stripe/status
     * 
     * Get Stripe connection status for current user
     */
    fastify.get(
        '/v1/connect/stripe/status',
        {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }
            },
        },
        async (request, reply) => {
            const userId = request.userId!;

            const [account] = await db
                .select()
                .from(connectedAccounts)
                .where(
                    and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'STRIPE')
                    )
                )
                .limit(1);

            if (!account) {
                return reply.status(200).send({
                    connected: false,
                    verificationStatus: null,
                });
            }

            return reply.status(200).send({
                connected: true,
                stripeAccountId: account.externalAccountId,
                verificationStatus: account.verificationStatus,
                connectedAt: account.connectedAt?.toISOString(),
            });
        }
    );
}

export default stripeConnectRoutes;

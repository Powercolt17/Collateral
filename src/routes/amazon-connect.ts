// @ts-nocheck
/**
 * Amazon Seller Connect Routes
 * 
 * OAuth 2.0 flow for connecting user's Amazon Seller account via LWA:
 * 1. GET /v1/connect/amazon/start - Build Amazon OAuth URL
 * 2. GET /v1/connect/amazon/oauth-callback - Handle OAuth callback
 * 3. GET /v1/connect/amazon/status - Check connection status
 * 4. POST /v1/connect/amazon/disconnect - Remove connection
 * 
 * Requires: AMAZON_CLIENT_ID, AMAZON_CLIENT_SECRET, AMAZON_REDIRECT_URI env vars
 * Uses Login with Amazon (LWA) OAuth 2.0 for SP-API access.
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/client.js';
import { connectedAccounts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { randomBytes } from 'crypto';

// =============================================================================
// CONSTANTS
// =============================================================================

const AMAZON_CLIENT_ID = process.env.AMAZON_CLIENT_ID;
const AMAZON_CLIENT_SECRET = process.env.AMAZON_CLIENT_SECRET;
const AMAZON_MARKETPLACE_ID = process.env.AMAZON_MARKETPLACE_ID || 'ATVPDKIKX0DER'; // US marketplace
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const AMAZON_CONFIGURED = !!(AMAZON_CLIENT_ID && AMAZON_CLIENT_SECRET);

// OAuth state tokens (in production, use Redis or DB)
const oauthStates = new Map<string, { userId: string; expiresAt: number }>();

if (!AMAZON_CONFIGURED) {
    console.warn(
        '[Amazon Connect] WARNING: Missing env vars (AMAZON_CLIENT_ID, AMAZON_CLIENT_SECRET). ' +
        'Amazon routes will return 503. Server will continue to start.'
    );
} else {
    console.log(`[Amazon Connect] Configured. Client ID: ${AMAZON_CLIENT_ID!.substring(0, 12)}...`);
}

// =============================================================================
// ROUTES
// =============================================================================

async function amazonConnectRoutes(fastify: FastifyInstance) {
    /**
     * GET /v1/connect/amazon/start
     * 
     * Initiate Amazon Seller OAuth flow via Login with Amazon (LWA).
     * Returns URL to redirect user to Amazon authorization.
     */
    fastify.get(
        '/v1/connect/amazon/start',
        {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }
            },
        },
        async (request, reply) => {
            const userId = request.userId!;

            if (!AMAZON_CONFIGURED) {
                return reply.status(503).send({
                    error: 'Amazon Seller integration not configured',
                    hint: 'Set AMAZON_CLIENT_ID and AMAZON_CLIENT_SECRET in environment variables',
                });
            }

            // Check if already connected
            const [existing] = await db
                .select()
                .from(connectedAccounts)
                .where(
                    and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'AMAZON')
                    )
                )
                .limit(1);

            if (existing?.verificationStatus === 'VERIFIED') {
                return reply.status(200).send({
                    alreadyConnected: true,
                    sellerId: existing.externalAccountId,
                });
            }

            // Generate state token
            const state = randomBytes(16).toString('hex');
            oauthStates.set(state, {
                userId,
                expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
            });

            // Build Amazon SP-API Authorization URL
            // Uses Seller Central authorization (not LWA consumer flow)
            const redirectUri = `${API_BASE_URL}/v1/connect/amazon/oauth-callback`;
            const oauthUrl = new URL('https://sellercentral.amazon.com/apps/authorize/consent');
            oauthUrl.searchParams.set('application_id', AMAZON_CLIENT_ID!);
            oauthUrl.searchParams.set('state', state);
            oauthUrl.searchParams.set('redirect_uri', redirectUri);

            return reply.status(200).send({
                oauthUrl: oauthUrl.toString(),
                state,
            });
        }
    );

    /**
     * GET /v1/connect/amazon/oauth-callback
     * 
     * Handle OAuth callback from Amazon Seller Central.
     * Amazon redirects here → backend exchanges auth code for tokens → redirect to frontend.
     */
    fastify.get<{ Querystring: { spapi_oauth_code?: string; state?: string; selling_partner_id?: string; error?: string } }>(
        '/v1/connect/amazon/oauth-callback',
        async (request, reply) => {
            const { spapi_oauth_code, state, selling_partner_id, error } = request.query;

            if (error) {
                console.error('[Amazon Connect] OAuth error:', error);
                return reply.redirect(`${FRONTEND_URL}/#/amazon/callback?error=${encodeURIComponent(error)}`);
            }

            if (!spapi_oauth_code || !state || !selling_partner_id) {
                return reply.redirect(`${FRONTEND_URL}/#/amazon/callback?error=missing_params`);
            }

            // Verify state token
            const stateData = oauthStates.get(state);
            if (!stateData) {
                return reply.redirect(`${FRONTEND_URL}/#/amazon/callback?error=invalid_state`);
            }

            if (Date.now() > stateData.expiresAt) {
                oauthStates.delete(state);
                return reply.redirect(`${FRONTEND_URL}/#/amazon/callback?error=state_expired`);
            }

            const userId = stateData.userId;
            oauthStates.delete(state);

            if (!AMAZON_CLIENT_ID || !AMAZON_CLIENT_SECRET) {
                return reply.redirect(`${FRONTEND_URL}/#/amazon/callback?error=config_error`);
            }

            try {
                // Exchange authorization code for refresh token via LWA
                const redirectUri = `${API_BASE_URL}/v1/connect/amazon/oauth-callback`;
                const tokenResponse = await fetch('https://api.amazon.com/auth/o2/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        code: spapi_oauth_code,
                        redirect_uri: redirectUri,
                        client_id: AMAZON_CLIENT_ID,
                        client_secret: AMAZON_CLIENT_SECRET,
                    }),
                });

                const tokenData = await tokenResponse.json() as {
                    access_token?: string;
                    refresh_token?: string;
                    token_type?: string;
                    expires_in?: number;
                    error?: string;
                    error_description?: string;
                };

                if (!tokenResponse.ok || tokenData.error || !tokenData.refresh_token) {
                    console.error('[Amazon Connect] Token exchange failed:', tokenData);
                    return reply.redirect(`${FRONTEND_URL}/#/amazon/callback?error=${encodeURIComponent(tokenData.error || 'exchange_failed')}`);
                }

                const now = new Date();

                // Upsert connected account
                await db
                    .insert(connectedAccounts)
                    .values({
                        userId,
                        platform: 'AMAZON',
                        externalAccountId: selling_partner_id,
                        status: 'ACTIVE',
                        verificationStatus: 'VERIFIED',
                        verifiedAt: now,
                        connectedAt: now,
                        metadataJson: {
                            connectedVia: 'oauth',
                            connectedAt: now.toISOString(),
                            sellerId: selling_partner_id,
                            marketplaceId: AMAZON_MARKETPLACE_ID,
                            // NOTE: refresh_token stored — production should use vault/encrypted column
                            refreshToken: tokenData.refresh_token,
                        },
                    } as any)
                    .onConflictDoUpdate({
                        target: [connectedAccounts.userId, connectedAccounts.platform],
                        set: {
                            externalAccountId: selling_partner_id,
                            status: 'ACTIVE',
                            verificationStatus: 'VERIFIED',
                            verifiedAt: now,
                            metadataJson: {
                                connectedVia: 'oauth',
                                connectedAt: now.toISOString(),
                                sellerId: selling_partner_id,
                                marketplaceId: AMAZON_MARKETPLACE_ID,
                                refreshToken: tokenData.refresh_token,
                            },
                        } as any,
                    });

                console.log(`[Amazon Connect] User ${userId} connected seller ${selling_partner_id}`);

                return reply.redirect(`${FRONTEND_URL}/#/amazon/callback?success=true&seller=${encodeURIComponent(selling_partner_id)}`);

            } catch (err: any) {
                console.error('[Amazon Connect] Callback error:', err);
                return reply.redirect(`${FRONTEND_URL}/#/amazon/callback?error=server_error`);
            }
        }
    );

    /**
     * GET /v1/connect/amazon/status
     * 
     * Get Amazon connection status for current user
     */
    fastify.get(
        '/v1/connect/amazon/status',
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
                        eq(connectedAccounts.platform, 'AMAZON')
                    )
                )
                .limit(1);

            if (!account) {
                return reply.status(200).send({
                    connected: false,
                    verificationStatus: null,
                });
            }

            const metadata = account.metadataJson as Record<string, any> | null;

            return reply.status(200).send({
                connected: true,
                sellerId: account.externalAccountId,
                marketplaceId: metadata?.marketplaceId || AMAZON_MARKETPLACE_ID,
                verificationStatus: account.verificationStatus,
                connectedAt: account.connectedAt?.toISOString(),
            });
        }
    );

    /**
     * POST /v1/connect/amazon/disconnect
     * 
     * Remove Amazon connection
     */
    fastify.post(
        '/v1/connect/amazon/disconnect',
        {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }
            },
        },
        async (request, reply) => {
            const userId = request.userId!;

            const result = await db
                .update(connectedAccounts)
                .set({
                    status: 'INACTIVE',
                    verificationStatus: 'UNVERIFIED',
                    metadataJson: null,
                } as any)
                .where(
                    and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'AMAZON')
                    )
                )
                .returning({ id: connectedAccounts.id });

            if (result.length === 0) {
                return reply.status(404).send({ error: 'No Amazon connection found' });
            }

            console.log(`[Amazon Connect] User ${userId} disconnected Amazon`);

            return reply.status(200).send({
                success: true,
                message: 'Amazon disconnected',
            });
        }
    );
}

export default amazonConnectRoutes;

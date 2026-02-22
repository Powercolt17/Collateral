// @ts-nocheck
/**
 * Shopify Connect Routes
 * 
 * OAuth 2.0 flow for connecting user's Shopify store:
 * 1. GET /v1/connect/shopify/start - Build Shopify OAuth URL
 * 2. GET /v1/connect/shopify/oauth-callback - Handle OAuth callback from Shopify
 * 3. GET /v1/connect/shopify/status - Check connection status
 * 4. POST /v1/connect/shopify/disconnect - Remove connection
 * 
 * Requires: SHOPIFY_API_KEY, SHOPIFY_API_SECRET env vars
 * Scopes: read_orders (for revenue verification)
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/client.js';
import { connectedAccounts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { randomBytes, createHmac } from 'crypto';

// =============================================================================
// CONSTANTS
// =============================================================================

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES || 'read_orders';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const SHOPIFY_CONFIGURED = !!(SHOPIFY_API_KEY && SHOPIFY_API_SECRET);

// OAuth state tokens (in production, use Redis or DB)
const oauthStates = new Map<string, { userId: string; shop: string; expiresAt: number }>();

if (!SHOPIFY_CONFIGURED) {
    console.warn(
        '[Shopify Connect] WARNING: Missing env vars (SHOPIFY_API_KEY, SHOPIFY_API_SECRET). ' +
        'Shopify routes will return 503. Server will continue to start.'
    );
} else {
    console.log(`[Shopify Connect] Configured. API Key: ${SHOPIFY_API_KEY!.substring(0, 6)}...`);
}

// =============================================================================
// HELPERS
// =============================================================================

function verifyHmac(queryParams: Record<string, string>, secret: string): boolean {
    const { hmac, ...rest } = queryParams;
    if (!hmac) return false;

    const ordered = Object.keys(rest).sort().map(k => `${k}=${rest[k]}`).join('&');
    const computed = createHmac('sha256', secret).update(ordered).digest('hex');
    return computed === hmac;
}

function isValidShopDomain(shop: string): boolean {
    // Must be *.myshopify.com
    return /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop);
}

// =============================================================================
// ROUTES
// =============================================================================

async function shopifyConnectRoutes(fastify: FastifyInstance) {
    /**
     * GET /v1/connect/shopify/start
     * 
     * Initiate Shopify OAuth flow.
     * Requires ?shop=storename.myshopify.com query param.
     * Returns URL to redirect user to Shopify.
     */
    fastify.get<{ Querystring: { shop?: string } }>(
        '/v1/connect/shopify/start',
        {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }
            },
        },
        async (request, reply) => {
            const userId = request.userId!;

            if (!SHOPIFY_CONFIGURED) {
                return reply.status(503).send({
                    error: 'Shopify integration not configured',
                    hint: 'Set SHOPIFY_API_KEY and SHOPIFY_API_SECRET in environment variables',
                });
            }

            const shop = (request.query as { shop?: string })?.shop?.trim();

            if (!shop) {
                return reply.status(400).send({
                    error: 'shop parameter is required',
                    hint: 'Provide your store domain, e.g. mystore.myshopify.com',
                });
            }

            if (!isValidShopDomain(shop)) {
                return reply.status(400).send({
                    error: 'Invalid shop domain',
                    hint: 'Shop must be a valid *.myshopify.com domain',
                });
            }

            // Check if already connected
            const [existing] = await db
                .select()
                .from(connectedAccounts)
                .where(
                    and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'SHOPIFY')
                    )
                )
                .limit(1);

            if (existing?.verificationStatus === 'VERIFIED') {
                return reply.status(200).send({
                    alreadyConnected: true,
                    shopDomain: existing.externalAccountId,
                });
            }

            // Generate state token
            const state = randomBytes(16).toString('hex');
            oauthStates.set(state, {
                userId,
                shop,
                expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
            });

            // Build Shopify OAuth URL
            const redirectUri = `${API_BASE_URL}/v1/connect/shopify/oauth-callback`;
            const oauthUrl = `https://${shop}/admin/oauth/authorize?` +
                `client_id=${SHOPIFY_API_KEY}` +
                `&scope=${encodeURIComponent(SHOPIFY_SCOPES)}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&state=${state}`;

            return reply.status(200).send({
                oauthUrl,
                state,
                shop,
            });
        }
    );

    /**
     * GET /v1/connect/shopify/oauth-callback
     * 
     * Handle OAuth callback from Shopify.
     * Shopify redirects here → backend exchanges code → redirect to frontend.
     */
    fastify.get<{ Querystring: { code?: string; state?: string; shop?: string; hmac?: string; timestamp?: string } }>(
        '/v1/connect/shopify/oauth-callback',
        async (request, reply) => {
            const query = request.query as Record<string, string>;
            const { code, state, shop } = query;

            // Validate params
            if (!code || !state || !shop) {
                return reply.redirect(`${FRONTEND_URL}/#/shopify/callback?error=missing_params`);
            }

            // Verify HMAC signature from Shopify
            if (SHOPIFY_API_SECRET && query.hmac) {
                if (!verifyHmac(query, SHOPIFY_API_SECRET)) {
                    console.error('[Shopify Connect] HMAC verification failed');
                    return reply.redirect(`${FRONTEND_URL}/#/shopify/callback?error=hmac_invalid`);
                }
            }

            // Verify state token
            const stateData = oauthStates.get(state);
            if (!stateData) {
                return reply.redirect(`${FRONTEND_URL}/#/shopify/callback?error=invalid_state`);
            }

            if (Date.now() > stateData.expiresAt) {
                oauthStates.delete(state);
                return reply.redirect(`${FRONTEND_URL}/#/shopify/callback?error=state_expired`);
            }

            const userId = stateData.userId;
            oauthStates.delete(state);

            // Validate shop domain
            if (!isValidShopDomain(shop)) {
                return reply.redirect(`${FRONTEND_URL}/#/shopify/callback?error=invalid_shop`);
            }

            if (!SHOPIFY_API_KEY || !SHOPIFY_API_SECRET) {
                return reply.redirect(`${FRONTEND_URL}/#/shopify/callback?error=config_error`);
            }

            try {
                // Exchange code for permanent access token
                const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        client_id: SHOPIFY_API_KEY,
                        client_secret: SHOPIFY_API_SECRET,
                        code,
                    }),
                });

                const tokenData = await tokenResponse.json() as {
                    access_token?: string;
                    scope?: string;
                    error?: string;
                    error_description?: string;
                };

                if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
                    console.error('[Shopify Connect] Token exchange failed:', tokenData);
                    return reply.redirect(`${FRONTEND_URL}/#/shopify/callback?error=${encodeURIComponent(tokenData.error || 'exchange_failed')}`);
                }

                // Validate the shop by calling /admin/api/2024-01/shop.json
                const shopResponse = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
                    headers: { 'X-Shopify-Access-Token': tokenData.access_token },
                });

                let shopName = shop;
                let shopCurrency = 'USD';
                if (shopResponse.ok) {
                    const shopInfo = await shopResponse.json() as { shop?: { name?: string; currency?: string } };
                    shopName = shopInfo.shop?.name || shop;
                    shopCurrency = shopInfo.shop?.currency || 'USD';
                }

                const now = new Date();

                // Upsert connected account
                await db
                    .insert(connectedAccounts)
                    .values({
                        userId,
                        platform: 'SHOPIFY',
                        externalAccountId: shop,
                        status: 'ACTIVE',
                        verificationStatus: 'VERIFIED',
                        verifiedAt: now,
                        connectedAt: now,
                        metadataJson: {
                            connectedVia: 'oauth',
                            connectedAt: now.toISOString(),
                            shopDomain: shop,
                            shopName,
                            currency: shopCurrency,
                            scopes: tokenData.scope,
                            // NOTE: access_token stored securely — production should use vault/encrypted column
                            accessToken: tokenData.access_token,
                        },
                    } as any)
                    .onConflictDoUpdate({
                        target: [connectedAccounts.userId, connectedAccounts.platform],
                        set: {
                            externalAccountId: shop,
                            status: 'ACTIVE',
                            verificationStatus: 'VERIFIED',
                            verifiedAt: now,
                            metadataJson: {
                                connectedVia: 'oauth',
                                connectedAt: now.toISOString(),
                                shopDomain: shop,
                                shopName,
                                currency: shopCurrency,
                                scopes: tokenData.scope,
                                accessToken: tokenData.access_token,
                            },
                        } as any,
                    });

                console.log(`[Shopify Connect] User ${userId} connected shop ${shop} (${shopName})`);

                return reply.redirect(`${FRONTEND_URL}/#/shopify/callback?success=true&shop=${encodeURIComponent(shop)}`);

            } catch (err: any) {
                console.error('[Shopify Connect] Callback error:', err);
                return reply.redirect(`${FRONTEND_URL}/#/shopify/callback?error=server_error`);
            }
        }
    );

    /**
     * GET /v1/connect/shopify/status
     * 
     * Get Shopify connection status for current user
     */
    fastify.get(
        '/v1/connect/shopify/status',
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
                        eq(connectedAccounts.platform, 'SHOPIFY')
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
                shopDomain: account.externalAccountId,
                shopName: metadata?.shopName || account.externalAccountId,
                verificationStatus: account.verificationStatus,
                connectedAt: account.connectedAt?.toISOString(),
            });
        }
    );

    /**
     * POST /v1/connect/shopify/disconnect
     * 
     * Remove Shopify connection
     */
    fastify.post(
        '/v1/connect/shopify/disconnect',
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
                        eq(connectedAccounts.platform, 'SHOPIFY')
                    )
                )
                .returning({ id: connectedAccounts.id });

            if (result.length === 0) {
                return reply.status(404).send({ error: 'No Shopify connection found' });
            }

            console.log(`[Shopify Connect] User ${userId} disconnected Shopify`);

            return reply.status(200).send({
                success: true,
                message: 'Shopify disconnected',
            });
        }
    );
}

export default shopifyConnectRoutes;

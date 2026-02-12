/**
 * X OAuth Routes - Connect X via OAuth 1.0a
 * 
 * Uses OAuth 1.0a because the Free tier X API blocks /2/users/me.
 * OAuth 1.0a with verify_credentials works reliably on all tiers.
 * 
 * Flow:
 * 1. GET /v1/connect/x/oauth/start - Get request token, redirect to X
 * 2. GET /v1/connect/x/oauth/callback - Exchange for access token, fetch profile
 * 3. GET /v1/connect/x/status - Check current X connection status
 * 
 * Requires env vars:
 * - X_API_KEY (Consumer Key)
 * - X_API_SECRET (Consumer Secret)
 * - X_OAUTH_REDIRECT_URI (Callback URL)
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/client.js';
import { users, connectedAccounts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { randomBytes, createHmac } from 'crypto';

// =============================================================================
// CONSTANTS
// =============================================================================

// OAuth 1.0a uses ONLY API Key/Secret (Consumer credentials)
// DO NOT fallback to OAuth 2.0 credentials - they will cause 400 errors
const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_OAUTH_REDIRECT_URI = process.env.X_OAUTH_REDIRECT_URI;

// Graceful degradation: warn but don't crash the entire server
const X_OAUTH_CONFIGURED = !!(X_API_KEY && X_API_SECRET && X_OAUTH_REDIRECT_URI);
if (!X_OAUTH_CONFIGURED) {
    console.warn(
        '[X OAuth 1.0a] WARNING: Missing env vars (X_API_KEY, X_API_SECRET, X_OAUTH_REDIRECT_URI). ' +
        'X OAuth routes will return 503. Server will continue to start.'
    );
}

// Request tokens expire after 10 minutes
const TOKEN_EXPIRY_MS = 10 * 60 * 1000;

// In-memory store for OAuth 1.0a request tokens (use Redis in production)
const pendingOAuthTokens = new Map<string, {
    userId: string;
    oauthTokenSecret: string;
    expiresAt: number;
}>();

// =============================================================================
// OAUTH 1.0a HELPERS
// =============================================================================

function generateNonce(): string {
    return randomBytes(16).toString('hex');
}

function percentEncode(str: string): string {
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}

function generateOAuthSignature(
    method: string,
    url: string,
    params: Record<string, string>,
    consumerSecret: string,
    tokenSecret: string = ''
): string {
    // Sort and encode parameters
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${percentEncode(key)}=${percentEncode(params[key])}`)
        .join('&');

    // Create signature base string
    const signatureBase = [
        method.toUpperCase(),
        percentEncode(url),
        percentEncode(sortedParams)
    ].join('&');

    // Create signing key
    const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

    // Generate HMAC-SHA1 signature
    const signature = createHmac('sha1', signingKey)
        .update(signatureBase)
        .digest('base64');

    return signature;
}

function buildOAuthHeader(params: Record<string, string>): string {
    return 'OAuth ' + Object.keys(params)
        .sort()
        .map(key => `${percentEncode(key)}="${percentEncode(params[key])}"`)
        .join(', ');
}

// =============================================================================
// ROUTES
// =============================================================================

async function xOAuthRoutes(fastify: FastifyInstance) {
    // If X OAuth is not configured, register stub routes that return 503
    if (!X_OAUTH_CONFIGURED) {
        fastify.get('/v1/connect/x/oauth/start', async (_req, reply) => {
            return reply.status(503).send({ error: 'X OAuth not configured', code: 'X_OAUTH_NOT_CONFIGURED' });
        });
        fastify.get('/v1/connect/x/oauth/callback', async (_req, reply) => {
            return reply.status(503).send({ error: 'X OAuth not configured', code: 'X_OAUTH_NOT_CONFIGURED' });
        });
        fastify.get('/v1/connect/x/status', async (_req, reply) => {
            return reply.status(200).send({ connected: false });
        });
        fastify.post('/v1/connect/x/disconnect', async (_req, reply) => {
            return reply.status(503).send({ error: 'X OAuth not configured', code: 'X_OAUTH_NOT_CONFIGURED' });
        });
        return;
    }

    /**
     * GET /v1/connect/x/oauth/start
     * 
     * Step 1: Get request token from X, then redirect user to authorize.
     */
    fastify.get(
        '/v1/connect/x/oauth/start',
        {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const userId = request.userId!;

            // Check if user already has X connected (connected_accounts is CANONICAL)
            const [xConn] = await db
                .select({
                    externalAccountId: connectedAccounts.externalAccountId,
                    verificationStatus: connectedAccounts.verificationStatus,
                    status: connectedAccounts.status,
                    metadataJson: connectedAccounts.metadataJson,
                })
                .from(connectedAccounts)
                .where(
                    and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'X')
                    )
                )
                .limit(1);

            // If already connected AND verified in connected_accounts, return early
            if (xConn?.externalAccountId && xConn.status === 'ACTIVE' && xConn.verificationStatus === 'VERIFIED') {
                const meta = xConn.metadataJson as { resolvedUsername?: string } | null;
                return reply.status(200).send({
                    connected: true,
                    platform: 'X',
                    xUserId: xConn.externalAccountId,
                    xUsername: meta?.resolvedUsername ?? null,
                    message: 'X account already connected',
                });
            }

            try {
                // Step 1: Get request token
                const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
                const timestamp = Math.floor(Date.now() / 1000).toString();
                const nonce = generateNonce();

                const oauthParams: Record<string, string> = {
                    oauth_callback: X_OAUTH_REDIRECT_URI,
                    oauth_consumer_key: X_API_KEY,
                    oauth_nonce: nonce,
                    oauth_signature_method: 'HMAC-SHA1',
                    oauth_timestamp: timestamp,
                    oauth_version: '1.0',
                };

                const signature = generateOAuthSignature(
                    'POST',
                    requestTokenUrl,
                    oauthParams,
                    X_API_SECRET
                );

                oauthParams.oauth_signature = signature;

                const response = await fetch(requestTokenUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': buildOAuthHeader(oauthParams),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`[X OAuth 1.0a] Request token failed: ${response.status} ${errorText}`);
                    return reply.status(400).send({
                        error: 'Failed to get request token from X',
                        code: 'X_OAUTH_REQUEST_TOKEN_FAILED',
                        details: errorText,
                    });
                }

                const responseText = await response.text();
                const tokenData = new URLSearchParams(responseText);
                const oauthToken = tokenData.get('oauth_token');
                const oauthTokenSecret = tokenData.get('oauth_token_secret');

                if (!oauthToken || !oauthTokenSecret) {
                    console.error('[X OAuth 1.0a] Missing tokens in response:', responseText);
                    return reply.status(400).send({
                        error: 'Invalid response from X',
                        code: 'X_OAUTH_INVALID_RESPONSE',
                    });
                }

                // Store the token secret for the callback (keyed by oauth_token)
                pendingOAuthTokens.set(oauthToken, {
                    userId,
                    oauthTokenSecret,
                    expiresAt: Date.now() + TOKEN_EXPIRY_MS,
                });

                // Build authorize URL
                const authorizeUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`;

                console.log(`[X OAuth 1.0a START] userId=${userId}`);
                console.log(`[X OAuth 1.0a START] redirect_uri=${X_OAUTH_REDIRECT_URI}`);
                console.log(`[X OAuth 1.0a START] Authorize URL: ${authorizeUrl}`);

                return reply.status(200).send({
                    oauthUrl: authorizeUrl,
                });

            } catch (err) {
                console.error('[X OAuth 1.0a] Start error:', err);
                return reply.status(500).send({
                    error: 'Internal error during OAuth start',
                    code: 'X_OAUTH_INTERNAL_ERROR',
                });
            }
        }
    );

    /**
     * GET /v1/connect/x/oauth/callback
     * 
     * Step 2: Exchange oauth_verifier for access token, then fetch user profile.
     */
    fastify.get(
        '/v1/connect/x/oauth/callback',
        async (request: FastifyRequest<{ Querystring: { oauth_token?: string; oauth_verifier?: string; denied?: string } }>, reply: FastifyReply) => {
            const { oauth_token, oauth_verifier, denied } = request.query;

            // User denied authorization
            if (denied) {
                console.log('[X OAuth 1.0a] User denied access');
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                return reply.redirect(`${frontendUrl}/#/x/callback?error=denied`);
            }

            if (!oauth_token || !oauth_verifier) {
                return reply.status(400).send({
                    error: 'Missing oauth_token or oauth_verifier',
                    code: 'X_OAUTH_INVALID_CALLBACK',
                });
            }

            // Validate and retrieve stored request token
            const pending = pendingOAuthTokens.get(oauth_token);
            if (!pending) {
                return reply.status(400).send({
                    error: 'Invalid or expired oauth_token',
                    code: 'X_OAUTH_INVALID_TOKEN',
                });
            }

            if (Date.now() > pending.expiresAt) {
                pendingOAuthTokens.delete(oauth_token);
                return reply.status(400).send({
                    error: 'OAuth session expired',
                    code: 'X_OAUTH_EXPIRED',
                });
            }

            // Clean up (one-time use)
            pendingOAuthTokens.delete(oauth_token);

            const { userId, oauthTokenSecret } = pending;

            try {
                // Step 2: Exchange for access token
                const accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
                const timestamp = Math.floor(Date.now() / 1000).toString();
                const nonce = generateNonce();

                const oauthParams: Record<string, string> = {
                    oauth_consumer_key: X_API_KEY,
                    oauth_nonce: nonce,
                    oauth_signature_method: 'HMAC-SHA1',
                    oauth_timestamp: timestamp,
                    oauth_token: oauth_token,
                    oauth_version: '1.0',
                };

                // Include oauth_verifier in params for signature
                const signatureParams = { ...oauthParams, oauth_verifier };

                const signature = generateOAuthSignature(
                    'POST',
                    accessTokenUrl,
                    signatureParams,
                    X_API_SECRET,
                    oauthTokenSecret
                );

                oauthParams.oauth_signature = signature;

                const tokenResponse = await fetch(accessTokenUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': buildOAuthHeader(oauthParams),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `oauth_verifier=${encodeURIComponent(oauth_verifier)}`,
                });

                if (!tokenResponse.ok) {
                    const errorText = await tokenResponse.text();
                    console.error(`[X OAuth 1.0a] Access token failed: ${tokenResponse.status} ${errorText}`);
                    return reply.status(400).send({
                        error: 'Failed to exchange for access token',
                        code: 'X_OAUTH_ACCESS_TOKEN_FAILED',
                    });
                }

                const tokenText = await tokenResponse.text();
                const accessData = new URLSearchParams(tokenText);
                const accessToken = accessData.get('oauth_token');
                const accessTokenSecret = accessData.get('oauth_token_secret');
                const xUserId = accessData.get('user_id');
                const xUsername = accessData.get('screen_name');

                if (!accessToken || !accessTokenSecret || !xUserId) {
                    console.error('[X OAuth 1.0a] Missing data in access token response:', tokenText);
                    return reply.status(400).send({
                        error: 'Invalid access token response',
                        code: 'X_OAUTH_INVALID_ACCESS_RESPONSE',
                    });
                }

                console.log(`[X OAuth 1.0a] Got access token for @${xUsername} (${xUserId})`);

                // Step 3: Fetch user profile via verify_credentials (works on Free tier!)
                const verifyUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';
                const verifyTimestamp = Math.floor(Date.now() / 1000).toString();
                const verifyNonce = generateNonce();

                const verifyParams: Record<string, string> = {
                    oauth_consumer_key: X_API_KEY,
                    oauth_nonce: verifyNonce,
                    oauth_signature_method: 'HMAC-SHA1',
                    oauth_timestamp: verifyTimestamp,
                    oauth_token: accessToken,
                    oauth_version: '1.0',
                };

                const verifySignature = generateOAuthSignature(
                    'GET',
                    verifyUrl,
                    verifyParams,
                    X_API_SECRET,
                    accessTokenSecret
                );

                verifyParams.oauth_signature = verifySignature;

                // Step 3: Fetch user profile via verify_credentials (REQUIRED - fail closed)
                const verifyResponse = await fetch(verifyUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': buildOAuthHeader(verifyParams),
                    },
                });

                // FAIL CLOSED: verify_credentials MUST succeed for oracle integrity
                if (!verifyResponse.ok) {
                    const errorText = await verifyResponse.text();
                    console.error(`[X OAUTH VERIFY] FAILED status=${verifyResponse.status}`);
                    console.error(`[X OAUTH VERIFY] token=${accessToken.substring(0, 10)}...`);
                    console.error(`[X OAUTH VERIFY] nonce=${verifyNonce}`);
                    console.error(`[X OAUTH VERIFY] timestamp=${verifyTimestamp}`);
                    console.error(`[X OAUTH VERIFY] response=${errorText}`);

                    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                    return reply.redirect(`${frontendUrl}/#/x/callback?error=verification_failed`);
                }

                const userData = await verifyResponse.json() as {
                    id_str: string;
                    screen_name: string;
                    followers_count: number;
                    created_at: string;
                    protected: boolean;
                };

                const followersCount = userData.followers_count;
                const isProtected = userData.protected;

                // Normalize created_at from Twitter legacy format: "Wed Aug 27 13:08:45 +0000 2008"
                const xAccountCreatedAt = new Date(userData.created_at);

                console.log(`[X OAUTH VERIFY] SUCCESS @${userData.screen_name}`);
                console.log(`[X OAUTH VERIFY] followers=${followersCount}`);
                console.log(`[X OAUTH VERIFY] created_at=${xAccountCreatedAt.toISOString()}`);
                console.log(`[X OAUTH VERIFY] protected=${isProtected}`);

                // Eligibility check: protected accounts cannot be used
                if (isProtected) {
                    console.warn(`[X OAuth 1.0a] Rejected protected account @${userData.screen_name}`);
                    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                    return reply.redirect(`${frontendUrl}/#/x/callback?error=protected`);
                }

                // Check if X account already bound to another user
                const [existingBinding] = await db
                    .select({ id: users.id })
                    .from(users)
                    .where(eq(users.xUserId, xUserId))
                    .limit(1);

                if (existingBinding && existingBinding.id !== userId) {
                    console.warn(`[X OAuth 1.0a] Account @${xUsername} already bound to user ${existingBinding.id}`);
                    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                    return reply.redirect(`${frontendUrl}/#/x/callback?error=already_bound`);
                }

                // Bind X account to user - store tokens SEPARATELY
                const connectNow = new Date();
                await db
                    .update(users)
                    .set({
                        xUserId: xUserId,
                        xUsername: xUsername,
                        xConnectedAt: connectNow,
                        xAccessToken: accessToken,           // Stored separately
                        xAccessTokenSecret: accessTokenSecret, // Stored separately
                        xAccountCreatedAt: xAccountCreatedAt,  // Normalized to TIMESTAMPTZ
                    })
                    .where(eq(users.id, userId));

                // CRITICAL: Also upsert to connected_accounts for contract creation compatibility
                // OAuth 1.0a = proof of ownership = VERIFIED status (no bio challenge needed)
                const xMetadata = {
                    resolvedUsername: xUsername,
                    followersCount: followersCount,
                    accountCreatedAt: xAccountCreatedAt?.toISOString() || null,
                };

                // Atomic upsert - single statement prevents race conditions
                await db
                    .insert(connectedAccounts)
                    .values({
                        userId,
                        platform: 'X',
                        externalAccountId: xUserId,
                        status: 'ACTIVE' as const,
                        verificationStatus: 'VERIFIED' as const,
                        connectedAt: connectNow,
                        verifiedAt: connectNow,
                        metadataJson: xMetadata,
                    })
                    .onConflictDoUpdate({
                        target: [connectedAccounts.userId, connectedAccounts.platform],
                        set: {
                            externalAccountId: xUserId,
                            status: 'ACTIVE' as const,
                            verificationStatus: 'VERIFIED' as const,
                            connectedAt: connectNow,
                            verifiedAt: connectNow,
                            metadataJson: xMetadata,
                        },
                    });

                console.log(`[X OAuth 1.0a] Successfully connected @${xUsername} to user ${userId} (connected_accounts synced)`);

                // Redirect to frontend success page
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                return reply.redirect(`${frontendUrl}/#/x/callback?success=true&username=${encodeURIComponent(xUsername || '')}`);

            } catch (err) {
                console.error('[X OAuth 1.0a] Callback error:', err);
                return reply.status(500).send({
                    error: 'Internal error during OAuth callback',
                    code: 'X_OAUTH_INTERNAL_ERROR',
                });
            }
        }
    );

    /**
     * GET /v1/connect/x/status
     * 
     * Get current X connection status for authenticated user.
     * Reads from connected_accounts (CANONICAL source).
     */
    fastify.get(
        '/v1/connect/x/status',
        {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const userId = request.userId!;

            // Read from connected_accounts (CANONICAL source)
            const [xConn] = await db
                .select({
                    externalAccountId: connectedAccounts.externalAccountId,
                    status: connectedAccounts.status,
                    verificationStatus: connectedAccounts.verificationStatus,
                    connectedAt: connectedAccounts.connectedAt,
                    verifiedAt: connectedAccounts.verifiedAt,
                    metadataJson: connectedAccounts.metadataJson,
                })
                .from(connectedAccounts)
                .where(
                    and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'X')
                    )
                )
                .limit(1);

            if (!xConn || !xConn.externalAccountId || xConn.status !== 'ACTIVE') {
                return reply.status(200).send({ connected: false });
            }

            const meta = (xConn.metadataJson ?? null) as { resolvedUsername?: string } | null;

            return reply.status(200).send({
                connected: true,
                platform: 'X',
                xUserId: xConn.externalAccountId,
                xUsername: meta?.resolvedUsername ?? null,
                status: xConn.status,
                verificationStatus: xConn.verificationStatus,
                connectedAt: xConn.connectedAt?.toISOString?.() ?? null,
                verifiedAt: xConn.verifiedAt?.toISOString?.() ?? null,
            });
        }
    );

    /**
     * POST /v1/connect/x/disconnect
     * 
     * Disconnect X account from user.
     */
    fastify.post(
        '/v1/connect/x/disconnect',
        {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const userId = request.userId!;

            // Clear legacy users table columns
            await db
                .update(users)
                .set({
                    xUserId: null,
                    xUsername: null,
                    xConnectedAt: null,
                    xAccessToken: null,
                    xAccessTokenSecret: null,
                    xAccountCreatedAt: null,
                })
                .where(eq(users.id, userId));

            // CRITICAL: Also revoke in connected_accounts (canonical source for contract creation)
            // Clear metadataJson to remove stale username data (externalAccountId is NOT NULL in schema)
            await db
                .update(connectedAccounts)
                .set({
                    status: 'REVOKED' as const,
                    verificationStatus: 'PENDING' as const, // Reset verification
                    verifiedAt: null,
                    metadataJson: null,  // Clear stale metadata
                })
                .where(
                    and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'X')
                    )
                );

            console.log(`[X OAuth 1.0a] Disconnected X account for user ${userId} (connected_accounts synced)`);

            return reply.status(200).send({
                success: true,
                message: 'X account disconnected',
            });
        }
    );
}

export default xOAuthRoutes;

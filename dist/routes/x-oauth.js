/**
 * X OAuth Routes - Connect X via OAuth 2.0 PKCE
 *
 * Flow:
 * 1. GET /v1/connect/x/oauth/start - Generate OAuth URL with PKCE challenge
 * 2. GET /v1/connect/x/oauth/callback - Handle callback, exchange code for tokens
 * 3. GET /v1/connect/x/status - Check current X connection status
 *
 * X API calls happen ONLY at:
 * - OAuth callback (to get user profile)
 * - Contract execution (baseline followers)
 * - Contract verification (final followers)
 */
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { randomBytes, createHash } from 'crypto';
// =============================================================================
// CONSTANTS
// =============================================================================
const X_OAUTH_CLIENT_ID = process.env.X_OAUTH_CLIENT_ID || '';
const X_OAUTH_CLIENT_SECRET = process.env.X_OAUTH_CLIENT_SECRET || '';
const X_OAUTH_REDIRECT_URI = process.env.X_OAUTH_REDIRECT_URI || '';
// State tokens expire after 10 minutes
const STATE_EXPIRY_MS = 10 * 60 * 1000;
// In-memory state store (use Redis in production for multi-instance)
const pendingOAuthStates = new Map();
// =============================================================================
// HELPERS
// =============================================================================
function generateCodeVerifier() {
    return randomBytes(32).toString('base64url');
}
function generateCodeChallenge(verifier) {
    return createHash('sha256').update(verifier).digest('base64url');
}
function generateState() {
    return randomBytes(16).toString('hex');
}
// =============================================================================
// ROUTES
// =============================================================================
async function xOAuthRoutes(fastify) {
    /**
     * GET /v1/connect/x/oauth/start
     *
     * Generate OAuth authorization URL with PKCE challenge.
     * Requires authentication.
     */
    fastify.get('/v1/connect/x/oauth/start', {
        preHandler: async (request, reply) => {
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId;
        // Check if OAuth is configured
        if (!X_OAUTH_CLIENT_ID || !X_OAUTH_REDIRECT_URI) {
            console.error('[X OAuth] Missing X_OAUTH_CLIENT_ID or X_OAUTH_REDIRECT_URI');
            return reply.status(500).send({
                error: 'X OAuth not configured',
                code: 'X_OAUTH_NOT_CONFIGURED',
            });
        }
        // Check if user already has X connected
        const [user] = await db
            .select({ xUserId: users.xUserId, xUsername: users.xUsername })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);
        if (user?.xUserId) {
            return reply.status(200).send({
                connected: true,
                xUserId: user.xUserId,
                xUsername: user.xUsername,
                message: 'X account already connected',
            });
        }
        // Generate PKCE challenge
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = generateCodeChallenge(codeVerifier);
        const state = generateState();
        // Store state for callback verification
        pendingOAuthStates.set(state, {
            userId,
            codeVerifier,
            expiresAt: Date.now() + STATE_EXPIRY_MS,
        });
        // Build OAuth URL - MINIMAL scope: only users.read
        // Do NOT add tweet.read or offline.access unless portal explicitly allows them
        const oauthUrl = new URL('https://twitter.com/i/oauth2/authorize');
        oauthUrl.searchParams.set('response_type', 'code');
        oauthUrl.searchParams.set('client_id', X_OAUTH_CLIENT_ID);
        oauthUrl.searchParams.set('redirect_uri', X_OAUTH_REDIRECT_URI);
        oauthUrl.searchParams.set('scope', 'users.read');
        oauthUrl.searchParams.set('state', state);
        oauthUrl.searchParams.set('code_challenge', codeChallenge);
        oauthUrl.searchParams.set('code_challenge_method', 'S256');
        // Diagnostic logging
        console.log(`[X OAuth START] userId=${userId}`);
        console.log(`[X OAuth START] client_id=${X_OAUTH_CLIENT_ID}`);
        console.log(`[X OAuth START] redirect_uri=${X_OAUTH_REDIRECT_URI}`);
        console.log(`[X OAuth START] scope=users.read`);
        console.log(`[X OAuth START] Full URL: ${oauthUrl.toString()}`);
        return reply.status(200).send({
            oauthUrl: oauthUrl.toString(),
            state,
        });
    });
    /**
     * GET /v1/connect/x/oauth/callback
     *
     * Handle OAuth callback from X.
     * Exchange authorization code for access token.
     * Fetch user profile and bind to account.
     */
    fastify.get('/v1/connect/x/oauth/callback', async (request, reply) => {
        const { code, state, error } = request.query;
        if (error) {
            console.log(`[X OAuth] User denied access: ${error}`);
            return reply.status(400).send({
                error: 'OAuth authorization denied',
                code: 'X_OAUTH_DENIED',
                details: error,
            });
        }
        if (!code || !state) {
            return reply.status(400).send({
                error: 'Missing code or state parameter',
                code: 'X_OAUTH_INVALID_CALLBACK',
            });
        }
        // Validate state
        const pending = pendingOAuthStates.get(state);
        if (!pending) {
            return reply.status(400).send({
                error: 'Invalid or expired state',
                code: 'X_OAUTH_INVALID_STATE',
            });
        }
        // Check expiry
        if (Date.now() > pending.expiresAt) {
            pendingOAuthStates.delete(state);
            return reply.status(400).send({
                error: 'OAuth session expired',
                code: 'X_OAUTH_EXPIRED',
            });
        }
        // Clean up state immediately (one-time use)
        pendingOAuthStates.delete(state);
        const { userId, codeVerifier } = pending;
        try {
            // Exchange code for access token
            const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${X_OAUTH_CLIENT_ID}:${X_OAUTH_CLIENT_SECRET}`).toString('base64')}`,
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: X_OAUTH_REDIRECT_URI,
                    code_verifier: codeVerifier,
                }),
            });
            if (!tokenResponse.ok) {
                const errorBody = await tokenResponse.text();
                console.error(`[X OAuth] Token exchange failed: ${tokenResponse.status} ${errorBody}`);
                return reply.status(400).send({
                    error: 'Failed to exchange authorization code',
                    code: 'X_OAUTH_TOKEN_FAILED',
                });
            }
            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;
            const refreshToken = tokenData.refresh_token;
            const expiresIn = tokenData.expires_in;
            const tokenExpiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined;
            // Fetch user profile with access token
            const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=id,username,created_at,protected,public_metrics', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!userResponse.ok) {
                const errorBody = await userResponse.text();
                console.error(`[X OAuth] User fetch failed: ${userResponse.status} ${errorBody}`);
                return reply.status(400).send({
                    error: 'Failed to fetch X user profile',
                    code: 'X_OAUTH_USER_FETCH_FAILED',
                });
            }
            const userData = await userResponse.json();
            const xUser = userData.data;
            // Eligibility checks
            if (xUser.protected) {
                return reply.status(400).send({
                    error: 'Protected (private) accounts cannot be used for contracts',
                    code: 'X_ACCOUNT_PROTECTED',
                });
            }
            // Check account age (6 months minimum)
            if (xUser.created_at) {
                const createdDate = new Date(xUser.created_at);
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                if (createdDate > sixMonthsAgo) {
                    return reply.status(400).send({
                        error: 'Account must be at least 6 months old',
                        code: 'X_ACCOUNT_TOO_NEW',
                    });
                }
            }
            // Check if X account already bound to another user
            const [existingBinding] = await db
                .select({ id: users.id })
                .from(users)
                .where(eq(users.xUserId, xUser.id))
                .limit(1);
            if (existingBinding && existingBinding.id !== userId) {
                return reply.status(400).send({
                    error: 'This X account is already connected to another user',
                    code: 'X_ACCOUNT_ALREADY_BOUND',
                });
            }
            // Bind X account to user
            const connectNow = new Date();
            await db
                .update(users)
                .set({
                xUserId: xUser.id,
                xUsername: xUser.username,
                xConnectedAt: connectNow,
                xRefreshToken: refreshToken ?? null,
                xTokenExpiresAt: tokenExpiresAt ?? null,
            })
                .where(eq(users.id, userId));
            console.log(`[X OAuth] Successfully connected @${xUser.username} to user ${userId}`);
            // Redirect to frontend success page (URL encode username for safety)
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            return reply.redirect(`${frontendUrl}/x/callback?success=true&username=${encodeURIComponent(xUser.username)}`);
        }
        catch (err) {
            console.error('[X OAuth] Callback error:', err);
            return reply.status(500).send({
                error: 'Internal error during OAuth callback',
                code: 'X_OAUTH_INTERNAL_ERROR',
            });
        }
    });
    /**
     * GET /v1/connect/x/status
     *
     * Get current X connection status for authenticated user.
     */
    fastify.get('/v1/connect/x/status', {
        preHandler: async (request, reply) => {
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId;
        const [user] = await db
            .select({
            xUserId: users.xUserId,
            xUsername: users.xUsername,
            xConnectedAt: users.xConnectedAt,
        })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);
        if (!user || !user.xUserId) {
            return reply.status(200).send({
                connected: false,
            });
        }
        return reply.status(200).send({
            connected: true,
            platform: 'X',
            xUserId: user.xUserId,
            xUsername: user.xUsername,
            connectedAt: user.xConnectedAt?.toISOString(),
        });
    });
    /**
     * POST /v1/connect/x/disconnect
     *
     * Disconnect X account from user.
     * Only allowed if no active contracts depend on it.
     */
    fastify.post('/v1/connect/x/disconnect', {
        preHandler: async (request, reply) => {
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId;
        // TODO: Check for active contracts before allowing disconnect
        await db
            .update(users)
            .set({
            xUserId: null,
            xUsername: null,
            xConnectedAt: null,
            xRefreshToken: null,
            xTokenExpiresAt: null,
        })
            .where(eq(users.id, userId));
        console.log(`[X OAuth] Disconnected X account for user ${userId}`);
        return reply.status(200).send({
            success: true,
            message: 'X account disconnected',
        });
    });
}
export default xOAuthRoutes;
//# sourceMappingURL=x-oauth.js.map
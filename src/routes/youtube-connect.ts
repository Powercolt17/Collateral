// @ts-nocheck
/**
 * YouTube Connect Routes
 * 
 * Google OAuth 2.0 flow for connecting user's YouTube channel:
 * 1. GET /v1/connect/youtube/start - Build Google OAuth URL
 * 2. GET /v1/connect/youtube/callback - Handle OAuth callback 
 * 3. GET /v1/connect/youtube/status - Check connection status
 * 4. POST /v1/connect/youtube/disconnect - Remove connection
 * 
 * Requires: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET env vars
 * Scopes: youtube.readonly, yt-analytics.readonly
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/client.js';
import { connectedAccounts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { randomBytes } from 'crypto';

// =============================================================================
// CONSTANTS
// =============================================================================

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const YOUTUBE_CONFIGURED = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const YOUTUBE_DATA_API = 'https://www.googleapis.com/youtube/v3';

const YOUTUBE_SCOPES = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/yt-analytics.readonly',
].join(' ');

// OAuth state tokens (in production, use Redis or DB)
const oauthStates = new Map<string, { userId: string; expiresAt: number }>();

if (!YOUTUBE_CONFIGURED) {
    console.warn(
        '[YouTube Connect] WARNING: Missing env vars (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET). ' +
        'YouTube routes will return 503. Server will continue to start.'
    );
} else {
    console.log(`[YouTube Connect] Configured. Client ID: ${GOOGLE_CLIENT_ID!.substring(0, 12)}...`);
}

// =============================================================================
// ROUTES
// =============================================================================

async function youtubeConnectRoutes(fastify: FastifyInstance) {
    /**
     * GET /v1/connect/youtube/start
     * 
     * Initiate Google OAuth flow for YouTube.
     * Returns URL to redirect user to Google consent screen.
     */
    fastify.get(
        '/v1/connect/youtube/start',
        {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ error: 'Authentication required' });
                }
            },
        },
        async (request, reply) => {
            const userId = request.userId!;

            if (!YOUTUBE_CONFIGURED) {
                return reply.status(503).send({
                    error: 'YouTube integration not configured',
                    hint: 'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables',
                });
            }

            // Check if already connected
            const [existing] = await db
                .select()
                .from(connectedAccounts)
                .where(
                    and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'YOUTUBE')
                    )
                )
                .limit(1);

            if (existing?.verificationStatus === 'VERIFIED') {
                const metadata = existing.metadataJson as Record<string, any> | null;
                return reply.status(200).send({
                    alreadyConnected: true,
                    channelId: existing.externalAccountId,
                    channelTitle: metadata?.channelTitle || 'Connected Channel',
                });
            }

            // Generate state token
            const state = randomBytes(16).toString('hex');
            oauthStates.set(state, {
                userId,
                expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
            });

            // Build Google OAuth URL
            const redirectUri = `${API_BASE_URL}/v1/connect/youtube/callback`;
            const oauthUrl = `${GOOGLE_AUTH_URL}?` +
                `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID!)}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&response_type=code` +
                `&scope=${encodeURIComponent(YOUTUBE_SCOPES)}` +
                `&access_type=offline` +
                `&prompt=consent` +
                `&state=${state}`;

            return reply.status(200).send({
                oauthUrl,
                state,
            });
        }
    );

    /**
     * GET /v1/connect/youtube/callback
     * 
     * Handle OAuth callback from Google.
     * Exchange code for tokens → fetch channel info → store connection.
     */
    fastify.get<{ Querystring: { code?: string; state?: string; error?: string } }>(
        '/v1/connect/youtube/callback',
        async (request, reply) => {
            const query = request.query as Record<string, string>;
            const { code, state, error } = query;

            // Handle denied access
            if (error) {
                console.log(`[YouTube Connect] OAuth error: ${error}`);
                return reply.redirect(`${FRONTEND_URL}/#/youtube/callback?error=${encodeURIComponent(error)}`);
            }

            // Validate params
            if (!code || !state) {
                return reply.redirect(`${FRONTEND_URL}/#/youtube/callback?error=missing_params`);
            }

            // Verify state token
            const stateData = oauthStates.get(state);
            if (!stateData) {
                return reply.redirect(`${FRONTEND_URL}/#/youtube/callback?error=invalid_state`);
            }

            if (Date.now() > stateData.expiresAt) {
                oauthStates.delete(state);
                return reply.redirect(`${FRONTEND_URL}/#/youtube/callback?error=state_expired`);
            }

            const userId = stateData.userId;
            oauthStates.delete(state);

            if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
                return reply.redirect(`${FRONTEND_URL}/#/youtube/callback?error=config_error`);
            }

            try {
                // Exchange code for tokens
                const redirectUri = `${API_BASE_URL}/v1/connect/youtube/callback`;
                const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        code,
                        client_id: GOOGLE_CLIENT_ID,
                        client_secret: GOOGLE_CLIENT_SECRET,
                        redirect_uri: redirectUri,
                        grant_type: 'authorization_code',
                    }),
                });

                const tokenData = await tokenResponse.json() as {
                    access_token?: string;
                    refresh_token?: string;
                    expires_in?: number;
                    error?: string;
                    error_description?: string;
                };

                if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
                    console.error('[YouTube Connect] Token exchange failed:', tokenData);
                    return reply.redirect(`${FRONTEND_URL}/#/youtube/callback?error=${encodeURIComponent(tokenData.error || 'exchange_failed')}`);
                }

                // Fetch YouTube channel info
                const channelResponse = await fetch(
                    `${YOUTUBE_DATA_API}/channels?part=snippet,statistics&mine=true`,
                    {
                        headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
                    }
                );

                let channelId = '';
                let channelTitle = 'Unknown Channel';
                let subscriberCount = 0;
                let videoCount = 0;

                if (channelResponse.ok) {
                    const channelData = await channelResponse.json() as {
                        items?: Array<{
                            id: string;
                            snippet: { title: string; publishedAt: string };
                            statistics: { subscriberCount: string; viewCount: string; videoCount: string };
                        }>;
                    };

                    if (channelData.items && channelData.items.length > 0) {
                        const ch = channelData.items[0];
                        channelId = ch.id;
                        channelTitle = ch.snippet.title;
                        subscriberCount = parseInt(ch.statistics.subscriberCount, 10) || 0;
                        videoCount = parseInt(ch.statistics.videoCount, 10) || 0;
                    }
                }

                if (!channelId) {
                    return reply.redirect(`${FRONTEND_URL}/#/youtube/callback?error=${encodeURIComponent('No YouTube channel found for this Google account')}`);
                }

                const now = new Date();
                const expiresAt = new Date(now.getTime() + (tokenData.expires_in || 3600) * 1000).toISOString();

                // GLOBAL UNIQUENESS — Block if another user already connected this channel
                const [globallyVerified] = await db
                    .select({ userId: connectedAccounts.userId })
                    .from(connectedAccounts)
                    .where(
                        and(
                            eq(connectedAccounts.platform, 'YOUTUBE'),
                            eq(connectedAccounts.externalAccountId, channelId),
                            eq(connectedAccounts.verificationStatus, 'VERIFIED')
                        )
                    )
                    .limit(1);

                if (globallyVerified && globallyVerified.userId !== userId) {
                    console.log(`[YouTube Connect] BLOCKED: Channel ${channelId} already verified by user ${globallyVerified.userId}`);
                    return reply.redirect(`${FRONTEND_URL}/#/youtube/callback?error=${encodeURIComponent('This YouTube channel is already connected to another Collateral account')}`);
                }

                // Upsert connected account
                await db
                    .insert(connectedAccounts)
                    .values({
                        userId,
                        platform: 'YOUTUBE',
                        externalAccountId: channelId,
                        status: 'ACTIVE',
                        verificationStatus: 'VERIFIED',
                        verifiedAt: now,
                        connectedAt: now,
                        metadataJson: {
                            connectedVia: 'oauth',
                            connectedAt: now.toISOString(),
                            channelId,
                            channelTitle,
                            subscriberCount,
                            videoCount,
                            accessToken: tokenData.access_token,
                            refreshToken: tokenData.refresh_token || null,
                            expiresAt,
                        },
                    } as any)
                    .onConflictDoUpdate({
                        target: [connectedAccounts.userId, connectedAccounts.platform],
                        set: {
                            externalAccountId: channelId,
                            status: 'ACTIVE',
                            verificationStatus: 'VERIFIED',
                            verifiedAt: now,
                            metadataJson: {
                                connectedVia: 'oauth',
                                connectedAt: now.toISOString(),
                                channelId,
                                channelTitle,
                                subscriberCount,
                                videoCount,
                                accessToken: tokenData.access_token,
                                refreshToken: tokenData.refresh_token || null,
                                expiresAt,
                            },
                        } as any,
                    });

                console.log(`[YouTube Connect] User ${userId} connected channel ${channelId} (${channelTitle}, ${subscriberCount} subs)`);

                return reply.redirect(`${FRONTEND_URL}/#/youtube/callback?success=true&channel=${encodeURIComponent(channelTitle)}`);

            } catch (err: any) {
                console.error('[YouTube Connect] Callback error:', err);
                return reply.redirect(`${FRONTEND_URL}/#/youtube/callback?error=server_error`);
            }
        }
    );

    /**
     * GET /v1/connect/youtube/status
     * 
     * Get YouTube connection status for current user
     */
    fastify.get(
        '/v1/connect/youtube/status',
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
                        eq(connectedAccounts.platform, 'YOUTUBE')
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

            // If account was revoked/disconnected, report as not connected
            if (account.status === 'REVOKED' || account.verificationStatus === 'UNVERIFIED') {
                return reply.status(200).send({
                    connected: false,
                    revoked: true,
                    verificationStatus: account.verificationStatus,
                    message: 'YouTube connection expired. Please reconnect.',
                });
            }

            return reply.status(200).send({
                connected: true,
                channelId: account.externalAccountId,
                channelTitle: metadata?.channelTitle || 'Connected Channel',
                subscriberCount: metadata?.subscriberCount || 0,
                videoCount: metadata?.videoCount || 0,
                verificationStatus: account.verificationStatus,
                connectedAt: account.connectedAt?.toISOString(),
            });
        }
    );

    /**
     * POST /v1/connect/youtube/disconnect
     * 
     * Remove YouTube connection
     */
    fastify.post(
        '/v1/connect/youtube/disconnect',
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
                    status: 'REVOKED',
                    verificationStatus: 'UNVERIFIED',
                    metadataJson: null,
                } as any)
                .where(
                    and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'YOUTUBE')
                    )
                )
                .returning({ id: connectedAccounts.id });

            if (result.length === 0) {
                return reply.status(404).send({ error: 'No YouTube connection found' });
            }

            console.log(`[YouTube Connect] User ${userId} disconnected YouTube`);

            return reply.status(200).send({
                success: true,
                message: 'YouTube disconnected',
            });
        }
    );
}

export default youtubeConnectRoutes;

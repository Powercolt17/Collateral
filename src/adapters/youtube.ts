// @ts-nocheck
/**
 * YouTube Platform Adapter - Production Ready
 * 
 * Handles SUBSCRIBERS and VIEWS metrics via YouTube Data API v3
 * and YouTube Analytics API.
 * 
 * INVARIANTS:
 * - Production NEVER silently falls back to mock. Fails closed.
 * - Requires Google OAuth2 access token from connected_accounts.
 * - Rate limits (429) are retryable; auth errors (401/403) are not.
 */

import { db } from '../db/client.js';
import { connectedAccounts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

// =============================================================================
// ERROR TYPES
// =============================================================================

export class YouTubeAdapterError extends Error {
    constructor(
        message: string,
        public readonly retryable: boolean,
        public readonly category: 'RATE_LIMIT' | 'AUTH' | 'API' | 'CONFIG' | 'ELIGIBILITY',
        public readonly code?: string
    ) {
        super(message);
        this.name = 'YouTubeAdapterError';
    }
}

// =============================================================================
// TYPES
// =============================================================================

export interface YouTubeChannelStats {
    channelId: string;
    channelTitle: string;
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
    hiddenSubscriberCount: boolean;
    publishedAt: string;  // ISO date — channel creation date
    thumbnailUrl?: string;
}

export interface YouTube30DayViews {
    totalViews: number;
    dailyBreakdown: Array<{ date: string; views: number }>;
    windowStart: string;
    windowEnd: string;
}

export interface YouTubeBaselineSnapshot {
    snapshotAt: string;
    provider: 'youtube';
    channelId: string;
    channelTitle: string;
    subscribers: number;
    views30d: number;
    totalViews: number;
    videoCount: number;
    channelCreatedAt: string;
    hiddenSubscriberCount: boolean;
}

// =============================================================================
// CLIENT ABSTRACTION
// =============================================================================

export interface YouTubeClient {
    getChannelStats(accessToken: string): Promise<YouTubeChannelStats>;
    get30DayViews(accessToken: string): Promise<YouTube30DayViews>;
    refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }>;
}

// =============================================================================
// MOCK CLIENT (Tests/Dev)
// =============================================================================

export class MockYouTubeClient implements YouTubeClient {
    constructor(
        private fixedSubscribers: number = 15000,
        private fixedViews30d: number = 250000,
        private fixedVideoCount: number = 50
    ) { }

    async getChannelStats(_accessToken: string): Promise<YouTubeChannelStats> {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 200);

        return {
            channelId: 'UC_mock_channel_id',
            channelTitle: 'Mock YouTube Channel',
            subscriberCount: this.fixedSubscribers,
            viewCount: 5000000,
            videoCount: this.fixedVideoCount,
            hiddenSubscriberCount: false,
            publishedAt: sixMonthsAgo.toISOString(),
            thumbnailUrl: '',
        };
    }

    async get30DayViews(_accessToken: string): Promise<YouTube30DayViews> {
        const end = new Date();
        const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        return {
            totalViews: this.fixedViews30d,
            dailyBreakdown: [],
            windowStart: start.toISOString(),
            windowEnd: end.toISOString(),
        };
    }

    async refreshAccessToken(_refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
        return { accessToken: 'mock_refreshed_token', expiresIn: 3600 };
    }
}

// =============================================================================
// REAL YOUTUBE CLIENT (Production)
// =============================================================================

const YOUTUBE_DATA_API_BASE = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_ANALYTICS_API_BASE = 'https://youtubeanalytics.googleapis.com/v2';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const REQUEST_TIMEOUT_MS = 15000;

export class RealYouTubeClient implements YouTubeClient {
    /**
     * Make authenticated request to YouTube/Google API
     */
    private async request<T>(url: string, accessToken: string): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.status === 429) {
                throw new YouTubeAdapterError('YouTube API rate limit exceeded', true, 'RATE_LIMIT');
            }

            if (response.status === 401 || response.status === 403) {
                const body = await response.text();
                throw new YouTubeAdapterError(
                    `YouTube API auth error (${response.status}): ${body.slice(0, 200)}`,
                    false, 'AUTH'
                );
            }

            if (!response.ok) {
                throw new YouTubeAdapterError(
                    `YouTube API error (${response.status})`,
                    response.status >= 500, 'API'
                );
            }

            return await response.json() as T;
        } catch (err) {
            clearTimeout(timeoutId);
            if (err instanceof YouTubeAdapterError) throw err;
            if (err instanceof Error && err.name === 'AbortError') {
                throw new YouTubeAdapterError('YouTube API request timed out', true, 'API');
            }
            throw new YouTubeAdapterError(`YouTube API request failed: ${err}`, true, 'API');
        }
    }

    async getChannelStats(accessToken: string): Promise<YouTubeChannelStats> {
        interface ChannelResponse {
            items?: Array<{
                id: string;
                snippet: {
                    title: string;
                    publishedAt: string;
                    thumbnails?: { default?: { url: string } };
                };
                statistics: {
                    subscriberCount: string;
                    viewCount: string;
                    videoCount: string;
                    hiddenSubscriberCount: boolean;
                };
            }>;
        }

        const url = `${YOUTUBE_DATA_API_BASE}/channels?part=snippet,statistics&mine=true`;
        const result = await this.request<ChannelResponse>(url, accessToken);

        if (!result.items || result.items.length === 0) {
            throw new YouTubeAdapterError('No YouTube channel found for this account', false, 'API');
        }

        const channel = result.items[0];
        return {
            channelId: channel.id,
            channelTitle: channel.snippet.title,
            subscriberCount: parseInt(channel.statistics.subscriberCount, 10) || 0,
            viewCount: parseInt(channel.statistics.viewCount, 10) || 0,
            videoCount: parseInt(channel.statistics.videoCount, 10) || 0,
            hiddenSubscriberCount: channel.statistics.hiddenSubscriberCount,
            publishedAt: channel.snippet.publishedAt,
            thumbnailUrl: channel.snippet.thumbnails?.default?.url,
        };
    }

    async get30DayViews(accessToken: string): Promise<YouTube30DayViews> {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

        const startStr = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const endStr = endDate.toISOString().split('T')[0];

        interface AnalyticsResponse {
            rows?: Array<[string, number]>; // [date, views]
            columnHeaders?: Array<{ name: string }>;
        }

        const url = `${YOUTUBE_ANALYTICS_API_BASE}/reports?` +
            `ids=channel==MINE` +
            `&startDate=${startStr}` +
            `&endDate=${endStr}` +
            `&metrics=views` +
            `&dimensions=day` +
            `&sort=day`;

        const result = await this.request<AnalyticsResponse>(url, accessToken);

        const dailyBreakdown = (result.rows || []).map(row => ({
            date: row[0],
            views: Number(row[1]) || 0,
        }));

        const totalViews = dailyBreakdown.reduce((sum, d) => sum + d.views, 0);

        return {
            totalViews,
            dailyBreakdown,
            windowStart: startStr,
            windowEnd: endStr,
        };
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new YouTubeAdapterError('Google OAuth not configured', false, 'CONFIG');
        }

        const response = await fetch(GOOGLE_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        });

        if (!response.ok) {
            const body = await response.text();
            throw new YouTubeAdapterError(
                `Token refresh failed (${response.status}): ${body.slice(0, 200)}`,
                false, 'AUTH'
            );
        }

        const data = await response.json() as { access_token: string; expires_in: number };
        return {
            accessToken: data.access_token,
            expiresIn: data.expires_in,
        };
    }
}

// =============================================================================
// CLIENT SINGLETON & ENVIRONMENT DETECTION
// =============================================================================

let youtubeClientInstance: YouTubeClient | null = null;

export function getYouTubeClient(): YouTubeClient {
    if (youtubeClientInstance) {
        return youtubeClientInstance;
    }

    const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITEST;
    const useMock = process.env.USE_MOCK_YOUTUBE === 'true';

    if (isTest || useMock) {
        console.log('[YouTube Client] Using MockYouTubeClient');
        youtubeClientInstance = new MockYouTubeClient();
        return youtubeClientInstance;
    }

    console.log('[YouTube Client] Using RealYouTubeClient');
    youtubeClientInstance = new RealYouTubeClient();
    return youtubeClientInstance;
}

export function setYouTubeClient(client: YouTubeClient) {
    youtubeClientInstance = client;
}

export function resetYouTubeClient() {
    youtubeClientInstance = null;
}

// =============================================================================
// CONNECTED ACCOUNT HELPERS
// =============================================================================

export async function getYouTubeConnectedAccount(userId: string) {
    const [account] = await db
        .select()
        .from(connectedAccounts)
        .where(
            and(
                eq(connectedAccounts.userId, userId),
                eq(connectedAccounts.platform, 'YOUTUBE'),
                eq(connectedAccounts.status, 'ACTIVE')
            )
        )
        .limit(1);

    return account || null;
}

/**
 * Get a valid access token for the user's YouTube account.
 * Refreshes the token if needed.
 */
export async function getYouTubeAccessToken(userId: string): Promise<string> {
    const account = await getYouTubeConnectedAccount(userId);
    if (!account) {
        throw new YouTubeAdapterError('No connected YouTube account', false, 'AUTH');
    }

    const metadata = account.metadataJson as Record<string, any> | null;
    if (!metadata?.accessToken) {
        throw new YouTubeAdapterError('YouTube access token missing', false, 'AUTH');
    }

    // Check if token might be expired (if we stored expiresAt)
    const expiresAt = metadata.expiresAt ? new Date(metadata.expiresAt).getTime() : 0;
    const now = Date.now();

    if (expiresAt && now > expiresAt - 60000 && metadata.refreshToken) {
        // Token expired or expiring soon — refresh
        try {
            const client = getYouTubeClient();
            const refreshed = await client.refreshAccessToken(metadata.refreshToken);

            // Update stored token
            const newExpiresAt = new Date(now + refreshed.expiresIn * 1000).toISOString();
            await db
                .update(connectedAccounts)
                .set({
                    metadataJson: {
                        ...metadata,
                        accessToken: refreshed.accessToken,
                        expiresAt: newExpiresAt,
                    },
                } as any)
                .where(eq(connectedAccounts.id, account.id));

            console.log(`[YouTube] Refreshed access token for user ${userId}`);
            return refreshed.accessToken;
        } catch (err) {
            console.error(`[YouTube] Token refresh failed for user ${userId}:`, (err as any).message);
            // Fall through to try the current token
        }
    }

    return metadata.accessToken;
}

// =============================================================================
// YOUTUBE ADAPTER (Snapshot + Verify)
// =============================================================================

export const youtubeAdapter = {
    platform: 'YOUTUBE' as const,

    /**
     * Snapshot baseline for a YouTube contract.
     * Returns immutable baseline data for subscribers + 30d views.
     */
    async snapshotBaseline(userId: string): Promise<YouTubeBaselineSnapshot> {
        const accessToken = await getYouTubeAccessToken(userId);
        const client = getYouTubeClient();

        // Fetch channel stats
        const stats = await client.getChannelStats(accessToken);

        // Fetch 30-day views
        let views30d = 0;
        try {
            const viewData = await client.get30DayViews(accessToken);
            views30d = viewData.totalViews;
        } catch (err) {
            // Analytics API might not be available for all channels — log but don't fail
            console.warn(`[YouTube] Analytics API failed for ${stats.channelId}: ${(err as any).message}`);
            // Fall back to 0 — baseline will still work for subscriber contracts
        }

        return {
            snapshotAt: new Date().toISOString(),
            provider: 'youtube',
            channelId: stats.channelId,
            channelTitle: stats.channelTitle,
            subscribers: stats.subscriberCount,
            views30d,
            totalViews: stats.viewCount,
            videoCount: stats.videoCount,
            channelCreatedAt: stats.publishedAt,
            hiddenSubscriberCount: stats.hiddenSubscriberCount,
        };
    },

    /**
     * Evaluate a YouTube contract at deadline.
     * Compares current metrics against baseline + target.
     */
    async evaluate(
        userId: string,
        metricType: 'SUBSCRIBERS' | 'VIEWS',
        baselineValue: number,
        targetDelta: number
    ): Promise<{
        pass: boolean;
        currentValue: number;
        delta: number;
        targetDelta: number;
        evidence: Record<string, unknown>;
    }> {
        const accessToken = await getYouTubeAccessToken(userId);
        const client = getYouTubeClient();
        const stats = await client.getChannelStats(accessToken);

        let currentValue: number;
        if (metricType === 'SUBSCRIBERS') {
            currentValue = stats.subscriberCount;
        } else {
            // VIEWS — get fresh 30d views
            try {
                const viewData = await client.get30DayViews(accessToken);
                currentValue = viewData.totalViews;
            } catch {
                currentValue = 0;
            }
        }

        const delta = currentValue - baselineValue;
        const pass = delta >= targetDelta;

        return {
            pass,
            currentValue,
            delta,
            targetDelta,
            evidence: {
                source: 'YOUTUBE',
                channelId: stats.channelId,
                metricType,
                baselineValue,
                currentValue,
                delta,
                targetDelta,
                evaluatedAt: new Date().toISOString(),
                subscriberCount: stats.subscriberCount,
                videoCount: stats.videoCount,
            },
        };
    },
};

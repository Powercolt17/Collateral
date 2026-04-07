// @ts-nocheck
/**
 * Oracle Routes — Live Contract Metric API
 * 
 * Serves contract progress data entirely from contract_metric_current cache.
 * Frontend polls this endpoint, never hits provider APIs directly.
 * 
 * Endpoints:
 *   GET /v1/contracts/:id/metric  — Current metric + progress for a contract
 */

import { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client.js';
import { contracts, contractMetricCurrent } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const oracleRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * GET /v1/contracts/:id/metric
     * 
     * Returns live metric progress for an active contract.
     * Auth required — must be contract owner.
     * 
     * Response:
     * {
     *   provider: "X",
     *   metric_key: "followers",
     *   baseline_value: 10000,
     *   target_value: 12000,
     *   current_value: 11500,
     *   progress_pct: 75.0,
     *   fetched_at: "2026-03-04T06:00:00Z",
     *   next_check_at: "2026-03-04T07:00:00Z"
     * }
     */
    fastify.get<{
        Params: { id: string };
    }>('/v1/contracts/:id/metric', async (request, reply) => {
        const { id } = request.params;
        const userId = request.userId;

        if (!userId) {
            reply.status(401);
            return { error: 'Authentication required', code: 'AUTH_REQUIRED' };
        }

        // Load contract
        const [contract] = await db
            .select()
            .from(contracts)
            .where(eq(contracts.id, id))
            .limit(1);

        if (!contract) {
            reply.status(404);
            return { error: 'Contract not found', code: 'CONTRACT_NOT_FOUND' };
        }

        // Auth: must be contract owner
        if (contract.principalUserId !== userId) {
            reply.status(403);
            return { error: 'Not authorized to view this contract', code: 'FORBIDDEN' };
        }

        // Load current metric from cache
        const [metric] = await db
            .select()
            .from(contractMetricCurrent)
            .where(eq(contractMetricCurrent.contractId, id))
            .limit(1);

        if (!metric) {
            // No metric data yet — oracle hasn't run for this contract
            // Return baseline info so frontend can show "Awaiting first check"
            const condition = contract.conditionJson as { threshold?: number } | null;
            const baseline = contract.baselineJson as Record<string, any> | null;
            const platform = contract.platform as string;

            let baselineValue = 0;
            let metricKey = 'unknown';

            if (platform === 'X') {
                baselineValue = baseline?.followers ?? 0;
                metricKey = 'followers';
            } else if (platform === 'STRIPE') {
                baselineValue = baseline?.netSettledAmountCents ?? baseline?.baselineValueCents ?? 0;
                metricKey = 'revenue';
            } else if (platform === 'SHOPIFY') {
                baselineValue = baseline?.netRevenueCents ?? 0;
                metricKey = 'shopify_revenue';
            }

            return {
                provider: platform,
                metric_key: metricKey,
                baseline_value: baselineValue,
                target_value: condition?.threshold ?? 0,
                current_value: null,
                progress_pct: 0,
                fetched_at: null,
                next_check_at: null,
                status: 'awaiting_first_check',
            };
        }

        // Extract baseline/target from contract
        const condition = contract.conditionJson as { threshold?: number } | null;
        const baseline = contract.baselineJson as Record<string, any> | null;
        const platform = contract.platform as string;

        let baselineValue = 0;
        if (platform === 'X') {
            baselineValue = baseline?.followers ?? 0;
        } else if (platform === 'STRIPE') {
            baselineValue = baseline?.netSettledAmountCents ?? baseline?.baselineValueCents ?? 0;
        } else if (platform === 'SHOPIFY') {
            baselineValue = baseline?.netRevenueCents ?? 0;
        }

        return {
            provider: metric.provider,
            metric_key: metric.metricKey,
            baseline_value: baselineValue,
            target_value: condition?.threshold ?? 0,
            current_value: parseFloat(metric.metricValue),
            progress_pct: parseFloat(metric.progressPct),
            fetched_at: metric.fetchedAt?.toISOString() ?? null,
            next_check_at: metric.nextCheckAt?.toISOString() ?? null,
            status: 'active',
        };
    });

    /**
     * GET /v1/contracts/:id/preview_baseline
     * 
     * Pings the live platform API on-demand to fetch the CURRENT LIVE baseline
     * and calculate the projected target before execution.
     * Use ONLY for PENDING/CREATED contracts. Active contracts should use the cached /metric route.
     */
    fastify.get<{
        Params: { id: string };
    }>('/v1/contracts/:id/preview_baseline', async (request, reply) => {
        const { id } = request.params;
        const userId = request.userId;

        if (!userId) {
            reply.status(401);
            return { error: 'Authentication required', code: 'AUTH_REQUIRED' };
        }

        const [contract] = await db.select().from(contracts).where(eq(contracts.id, id)).limit(1);
        if (!contract) {
            reply.status(404);
            return { error: 'Contract not found', code: 'CONTRACT_NOT_FOUND' };
        }
        if (contract.principalUserId !== userId) {
            reply.status(403);
            return { error: 'Not authorized to view this contract', code: 'FORBIDDEN' };
        }

        const condition = contract.conditionJson as Record<string, any> | null;
        let currentBaseline = 0;
        let projectedTarget = 0;
        let metricKey = 'unknown';

        try {
            if (contract.platform === 'X') {
                const { xAdapter } = await import('../adapters/x.js');
                const baseline = await xAdapter.snapshotBaseline(contract);
                currentBaseline = baseline.followers;
                projectedTarget = condition?.threshold ?? 0;
                metricKey = 'followers';
            } else if (contract.platform === 'STRIPE') {
                const { stripeRevenueAdapter } = await import('../adapters/stripe-revenue.js');
                const { connectedAccounts } = await import('../db/schema.js');
                const { and } = await import('drizzle-orm');
                const [account] = await db.select().from(connectedAccounts)
                    .where(and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, 'STRIPE')))
                    .limit(1);
                
                if (!account) throw new Error('Stripe account not connected');
                
                // For preview, grab the standard steady 30 day trailing baseline
                const baseline = await stripeRevenueAdapter.createV1BaselineSnapshot(
                    account.externalAccountId,
                    condition?.threshold || 0,
                    new Date(),
                    'STEADY'
                );
                currentBaseline = baseline.baselineNetRevenueCents;
                projectedTarget = currentBaseline + (condition?.threshold ?? 0);
                metricKey = 'revenue';
            } else if (contract.platform === 'SHOPIFY') {
                const { shopifyAdapter } = await import('../adapters/shopify.js');
                const baseline = await shopifyAdapter.snapshotBaseline(userId);
                currentBaseline = baseline.netCents;
                projectedTarget = currentBaseline + (condition?.thresholdCents || condition?.targetDeltaCents || 0);
                metricKey = 'shopify_revenue';
            } else if (contract.platform === 'AMAZON') {
                const { amazonAdapter } = await import('../adapters/amazon-seller.js');
                const baseline = await amazonAdapter.snapshotBaseline(userId);
                currentBaseline = baseline.netCents;
                projectedTarget = currentBaseline + (condition?.thresholdCents || condition?.targetDeltaCents || 0);
                metricKey = 'amazon_revenue';
            } else if (contract.platform === 'YOUTUBE') {
                const { youtubeAdapter } = await import('../adapters/youtube.js');
                const baseline = await youtubeAdapter.snapshotBaseline(userId);
                if (contract.metricType === 'VIEWS') {
                    currentBaseline = baseline.views30d;
                    metricKey = 'youtube_views';
                } else {
                    currentBaseline = baseline.subscribers;
                    metricKey = 'youtube_subscribers';
                }
                projectedTarget = currentBaseline + (condition?.threshold || condition?.targetDelta || 0);
            }

            return {
                provider: contract.platform,
                metric_key: metricKey,
                current_baseline: currentBaseline,
                projected_target: projectedTarget,
                status: 'success'
            };
        } catch (err: any) {
            console.error(`Preview baseline error for ${id}:`, err);
            // Fail gracefully so UI displays a placeholder or error rather than crashing entirely
            reply.status(200);
            return {
                provider: contract.platform,
                status: 'error',
                error: err.message || 'Failed to fetch live baseline'
            };
        }
    });

    /**
     * GET /v1/oracle/preview
     * 
     * Pings the live platform API for the currently logged-in user to fetch their
     * current baseline metric for a specific provider.
     * Does not require an existing contract. Used for Market Term Sheets.
     */
    fastify.get<{
        Querystring: { provider: string; metric?: string; tier?: string };
    }>('/v1/oracle/preview', async (request, reply) => {
        const userId = request.userId;
        const { provider, metric, tier } = request.query;

        if (!userId) {
            reply.status(401);
            return { error: 'Authentication required', code: 'AUTH_REQUIRED' };
        }

        const platform = provider.toUpperCase();
        let currentBaseline = 0;
        let metricKey = metric || 'unknown';

        // DIAGNOSTIC: Log what we're looking for
        console.log(`[Oracle Preview] userId=${userId}, provider=${platform}, metric=${metricKey}`);
        
        // DIAGNOSTIC: List all connected accounts for this user
        try {
            const { connectedAccounts: ca } = await import('../db/schema.js');
            const { eq: eqDiag } = await import('drizzle-orm');
            const allAccounts = await db.select({
                platform: ca.platform,
                status: ca.status,
                extId: ca.externalAccountId,
                verified: ca.verificationStatus,
            }).from(ca).where(eqDiag(ca.userId, userId));
            console.log(`[Oracle Preview] User ${userId} has ${allAccounts.length} connected accounts:`, JSON.stringify(allAccounts));
        } catch (diagErr) {
            console.error('[Oracle Preview] Diagnostic query failed:', diagErr);
        }

        try {
            if (platform === 'X') {
                const { connectedAccounts } = await import('../db/schema.js');
                const { users } = await import('../db/schema.js');
                const { and, eq } = await import('drizzle-orm');
                const [xAccount] = await db.select().from(connectedAccounts)
                    .where(and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'X')
                    ))
                    .limit(1);
                
                if (!xAccount) {
                    reply.status(200);
                    return { provider: 'X', status: 'error', code: 'NOT_CONNECTED', error: 'X account not connected' };
                }

                if (xAccount.status === 'REVOKED') {
                    reply.status(200);
                    return { provider: 'X', status: 'error', code: 'RECONNECT_REQUIRED', error: 'X connection expired. Please reconnect in Sources.' };
                }

                // Strategy 1: Try X API v2 Bearer token (may 403 on Free tier)
                let gotLive = false;
                try {
                    const { getXClient } = await import('../adapters/x.js');
                    const client = getXClient();
                    currentBaseline = await client.getFollowers(xAccount.externalAccountId);
                    gotLive = true;
                } catch (apiErr: any) {
                    console.warn(`[Oracle Preview] X API v2 failed (${apiErr.message}), trying OAuth 1.0a fallback...`);
                }

                // Strategy 2: Use user's OAuth 1.0a tokens with v1.1 verify_credentials
                if (!gotLive) {
                    try {
                        const [user] = await db.select({
                            xAccessToken: users.xAccessToken,
                            xAccessTokenSecret: users.xAccessTokenSecret,
                        }).from(users).where(eq(users.id, userId)).limit(1);

                        if (user?.xAccessToken && user?.xAccessTokenSecret) {
                            const { createHmac, randomBytes } = await import('crypto');
                            const consumerKey = process.env.X_API_KEY;
                            const consumerSecret = process.env.X_API_SECRET;
                            
                            if (consumerKey && consumerSecret) {
                                const verifyUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';
                                const timestamp = Math.floor(Date.now() / 1000).toString();
                                const nonce = randomBytes(16).toString('hex');

                                const oauthParams: Record<string, string> = {
                                    oauth_consumer_key: consumerKey,
                                    oauth_nonce: nonce,
                                    oauth_signature_method: 'HMAC-SHA1',
                                    oauth_timestamp: timestamp,
                                    oauth_token: user.xAccessToken,
                                    oauth_version: '1.0',
                                };

                                // Build signature
                                const percentEncode = (s: string) => encodeURIComponent(s).replace(/!/g,'%21').replace(/'/g,'%27').replace(/\(/g,'%28').replace(/\)/g,'%29').replace(/\*/g,'%2A');
                                const sortedParams = Object.keys(oauthParams).sort().map(k => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`).join('&');
                                const sigBase = `GET&${percentEncode(verifyUrl)}&${percentEncode(sortedParams)}`;
                                const sigKey = `${percentEncode(consumerSecret)}&${percentEncode(user.xAccessTokenSecret)}`;
                                const sig = createHmac('sha1', sigKey).update(sigBase).digest('base64');
                                oauthParams.oauth_signature = sig;

                                const authHeader = 'OAuth ' + Object.keys(oauthParams).sort().map(k => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`).join(', ');

                                const resp = await fetch(verifyUrl, { headers: { 'Authorization': authHeader } });
                                if (resp.ok) {
                                    const data = await resp.json() as { followers_count: number };
                                    currentBaseline = data.followers_count;
                                    gotLive = true;
                                    console.log(`[Oracle Preview] X v1.1 verify_credentials success: ${currentBaseline} followers`);
                                }
                            }
                        }
                    } catch (v1Err: any) {
                        console.warn(`[Oracle Preview] X v1.1 fallback failed:`, v1Err.message);
                    }
                }

                // Strategy 3: Fall back to stored metadata from OAuth connection
                if (!gotLive) {
                    const meta = xAccount.metadataJson as Record<string, any> | null;
                    if (meta?.followersCount) {
                        currentBaseline = meta.followersCount;
                        console.log(`[Oracle Preview] X using stored metadata: ${currentBaseline} followers`);
                    } else {
                        throw new Error('X API unavailable and no stored follower data');
                    }
                }

                metricKey = 'followers';

                // Minimum baseline check for X — tier-specific
                const { MINIMUM_BASELINES: MB_X } = await import('../services/contract-calculator.js');
                const tierKey = tier === 'elevated' || tier === 'ELEVATED' || tier === 'ADVANCED'
                    ? 'ADVANCED'
                    : tier === 'maximum' || tier === 'MAXIMUM' || tier === 'ELITE'
                        ? 'ELITE'
                        : 'STANDARD';
                const X_MIN_FOLLOWERS = MB_X.X.FOLLOWERS[tierKey];
                if (currentBaseline < X_MIN_FOLLOWERS) {
                    reply.status(200);
                    return {
                        provider: 'X',
                        status: 'ok',
                        current_baseline: currentBaseline,
                        metric_key: 'followers',
                        warning: 'BASELINE_TOO_LOW',
                        warning_message: `Your account has ${currentBaseline} followers. Minimum required: ${X_MIN_FOLLOWERS} followers. Grow your audience before executing a contract.`,
                        minimum_required: X_MIN_FOLLOWERS,
                    };
                }
            } else if (platform === 'STRIPE') {
                const { connectedAccounts } = await import('../db/schema.js');
                const { and, eq } = await import('drizzle-orm');
                const [account] = await db.select().from(connectedAccounts)
                    .where(and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, 'STRIPE')))
                    .limit(1);
                
                if (!account) {
                    reply.status(200);
                    return { provider: 'STRIPE', status: 'error', code: 'NOT_CONNECTED', error: 'Stripe account not connected. Go to Sources to connect.' };
                }

                if (account.status === 'REVOKED') {
                    reply.status(200);
                    return { provider: 'STRIPE', status: 'error', code: 'RECONNECT_REQUIRED', error: 'Stripe connection expired. Please reconnect in Sources.' };
                }
                
                // For preview: fetch raw baseline WITHOUT tier validation
                // Tier eligibility is enforced at execution time, not preview
                try {
                    const { getRevenueClient, STRIPE_TIER_MINIMUM_BASELINE } = await import('../adapters/stripe-revenue.js');
                    const client = getRevenueClient();
                    const baselineResult = await client.getBaselineSnapshot(
                        account.externalAccountId,
                        new Date()
                    );
                    currentBaseline = baselineResult.netRevenue; // cents
                    metricKey = 'revenue';

                    // If below minimum, still return the baseline but flag it
                    const minRequired = STRIPE_TIER_MINIMUM_BASELINE.STEADY; // $1,000 = 100000 cents
                    if (currentBaseline < minRequired) {
                        reply.status(200);
                        return {
                            provider: 'STRIPE',
                            status: 'ok',
                            current_baseline: currentBaseline,
                            metric_key: 'revenue',
                            warning: 'BASELINE_TOO_LOW',
                            warning_message: `Your current 30-day Stripe revenue is $${(currentBaseline / 100).toFixed(2)}. Minimum required: $${(minRequired / 100).toFixed(2)}.`,
                            minimum_required: minRequired,
                        };
                    }
                } catch (stripeErr: any) {
                    console.warn(`[Oracle Preview] Stripe baseline fetch failed:`, stripeErr.message);
                    reply.status(200);
                    return { 
                        provider: 'STRIPE', 
                        status: 'error', 
                        code: 'FETCH_FAILED', 
                        error: `Unable to fetch Stripe revenue data. ${stripeErr.message}` 
                    };
                }
            } else if (platform === 'SHOPIFY') {
                const { shopifyAdapter } = await import('../adapters/shopify.js');
                const baseline = await shopifyAdapter.snapshotBaseline(userId);
                currentBaseline = baseline.netCents;
                metricKey = 'shopify_revenue';
            } else if (platform === 'AMAZON') {
                const { amazonAdapter } = await import('../adapters/amazon-seller.js');
                const baseline = await amazonAdapter.snapshotBaseline(userId);
                currentBaseline = baseline.netCents;
                metricKey = 'amazon_revenue';
            } else if (platform === 'YOUTUBE') {
                // Try live adapter first, fall back to stored metadata if token expired
                const { connectedAccounts } = await import('../db/schema.js');
                const { and: andOp, eq: eqOp } = await import('drizzle-orm');
                const [ytAccount] = await db.select().from(connectedAccounts)
                    .where(andOp(
                        eqOp(connectedAccounts.userId, userId),
                        eqOp(connectedAccounts.platform, 'YOUTUBE')
                    ))
                    .limit(1);
                
                if (!ytAccount) {
                    reply.status(200);
                    return { provider: 'YOUTUBE', status: 'error', code: 'NOT_CONNECTED', error: 'YouTube account not connected. Go to Sources to connect your channel.' };
                }

                console.log(`[Oracle Preview] YouTube account found for user ${userId}: status=${ytAccount.status}, verified=${ytAccount.verificationStatus}, extId=${ytAccount.externalAccountId}`);

                // Check if account is REVOKED or not VERIFIED
                if (ytAccount.status === 'REVOKED' || ytAccount.verificationStatus !== 'VERIFIED') {
                    reply.status(200);
                    return { 
                        provider: 'YOUTUBE', 
                        status: 'error', 
                        code: 'RECONNECT_REQUIRED', 
                        error: 'YouTube connection expired. Please go to Sources and reconnect your YouTube channel.' 
                    };
                }

                try {
                    const { youtubeAdapter } = await import('../adapters/youtube.js');
                    const baseline = await youtubeAdapter.snapshotBaseline(userId);
                    if (metricKey === 'VIEWS' || metricKey === 'youtube_views' || metricKey === 'youtube_30day_views') {
                        currentBaseline = baseline.views30d;
                        metricKey = 'youtube_views';
                    } else {
                        currentBaseline = baseline.subscribers;
                        metricKey = 'youtube_subscribers';
                    }
                } catch (ytErr: any) {
                    // Fallback: use the subscriber count stored during OAuth connection
                    console.warn(`[Oracle Preview] YouTube live API failed, falling back to stored metadata:`, ytErr.message);
                    const meta = ytAccount.metadataJson as Record<string, any> | null;
                    if (meta?.subscriberCount) {
                        currentBaseline = meta.subscriberCount;
                        metricKey = 'youtube_subscribers';
                    } else {
                        throw ytErr; // No fallback data, rethrow
                    }
                }
                // Minimum baseline check for YouTube — tier-specific
                const { MINIMUM_BASELINES } = await import('../services/contract-calculator.js');
                const ytTierKey = tier === 'elevated' || tier === 'ELEVATED' || tier === 'ADVANCED'
                    ? 'ADVANCED'
                    : tier === 'maximum' || tier === 'MAXIMUM' || tier === 'ELITE'
                        ? 'ELITE'
                        : 'STANDARD';
                const YT_MIN_SUBS = MINIMUM_BASELINES.YOUTUBE.SUBSCRIBERS[ytTierKey];
                const YT_MIN_VIEWS = MINIMUM_BASELINES.YOUTUBE.VIEWS[ytTierKey];
                const ytMin = metricKey === 'youtube_views' ? YT_MIN_VIEWS : YT_MIN_SUBS;
                const ytNoun = metricKey === 'youtube_views' ? '30-day views' : 'subscribers';
                if (currentBaseline < ytMin) {
                    reply.status(200);
                    return {
                        provider: 'YOUTUBE',
                        status: 'ok',
                        current_baseline: currentBaseline,
                        metric_key: metricKey,
                        warning: 'BASELINE_TOO_LOW',
                        warning_message: `Your channel has ${currentBaseline.toLocaleString()} ${ytNoun}. Minimum required: ${ytMin.toLocaleString()}.`,
                        minimum_required: ytMin,
                    };
                }
            } else {
                reply.status(400);
                return { error: `Unsupported platform: ${platform}`, code: 'UNSUPPORTED_PLATFORM' };
            }

            return {
                provider: platform,
                metric_key: metricKey,
                current_baseline: currentBaseline,
                status: 'success'
            };
        } catch (err: any) {
            console.error(`Generic preview baseline error for ${userId} on ${platform}:`, err);
            reply.status(200);
            return {
                provider: platform,
                status: 'error',
                code: err?.code || 'FETCH_ERROR',
                error: err.message || 'Failed to fetch live baseline'
            };
        }
    });
};

export default oracleRoutes;

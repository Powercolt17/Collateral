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
        Querystring: { provider: string; metric?: string };
    }>('/v1/oracle/preview', async (request, reply) => {
        const userId = request.userId;
        const { provider, metric } = request.query;

        if (!userId) {
            reply.status(401);
            return { error: 'Authentication required', code: 'AUTH_REQUIRED' };
        }

        const platform = provider.toUpperCase();
        let currentBaseline = 0;
        let metricKey = metric || 'unknown';

        try {
            if (platform === 'X') {
                const { getXClient } = await import('../adapters/x.js');
                const { connectedAccounts } = await import('../db/schema.js');
                const { and, eq } = await import('drizzle-orm');
                const [xAccount] = await db.select().from(connectedAccounts)
                    .where(and(
                        eq(connectedAccounts.userId, userId),
                        eq(connectedAccounts.platform, 'X'),
                        eq(connectedAccounts.status, 'ACTIVE')
                    ))
                    .limit(1);
                
                if (!xAccount) {
                    reply.status(200);
                    return { provider: 'X', status: 'error', code: 'NOT_CONNECTED', error: 'X account not connected' };
                }
                
                const client = getXClient();
                currentBaseline = await client.getFollowers(xAccount.externalAccountId);
                metricKey = 'followers';
            } else if (platform === 'STRIPE') {
                const { stripeRevenueAdapter } = await import('../adapters/stripe-revenue.js');
                const { connectedAccounts } = await import('../db/schema.js');
                const { and, eq } = await import('drizzle-orm');
                const [account] = await db.select().from(connectedAccounts)
                    .where(and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, 'STRIPE')))
                    .limit(1);
                
                if (!account) {
                    reply.status(400);
                    return { error: 'Stripe account not connected', code: 'NOT_CONNECTED' };
                }
                
                const baseline = await stripeRevenueAdapter.createV1BaselineSnapshot(
                    account.externalAccountId,
                    0,
                    new Date(),
                    'STEADY'
                );
                currentBaseline = baseline.baselineNetRevenueCents;
                metricKey = 'revenue';
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
                        eqOp(connectedAccounts.platform, 'YOUTUBE'),
                        eqOp(connectedAccounts.status, 'ACTIVE')
                    ))
                    .limit(1);
                
                if (!ytAccount) {
                    reply.status(200);
                    return { provider: 'YOUTUBE', status: 'error', code: 'NOT_CONNECTED', error: 'YouTube account not connected. Go to Sources to connect your channel.' };
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

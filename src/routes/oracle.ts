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
};

export default oracleRoutes;

/**
 * Commerce Routes - Shopify + Amazon Contract Management
 * 
 * REST API endpoints for commerce performance contracts.
 * 
 * Endpoints:
 * - POST /v1/commerce/health/:platform      - Check platform connection
 * - POST /v1/commerce/baseline              - Create baseline snapshot
 * - GET  /v1/commerce/baselines             - List user baselines
 * - POST /v1/commerce/terms                 - Attach terms to contract
 * - GET  /v1/commerce/terms/:contractId     - Get contract terms
 * - POST /v1/commerce/verify/:contractId    - Enqueue verification
 * - GET  /v1/commerce/verification/:contractId - Get verification status
 */

import { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify';
import {
    createCommerceBaseline,
    getCommerceBaseline,
    getUserCommerceBaselines,
    attachCommerceTerms,
    getCommerceTerms,
    enqueueCommerceVerification,
    processCommerceVerification,
    getLatestCommerceVerification,
    checkCommerceHealth,
    type CommercePlatform,
} from '../services/commerce.js';

// =============================================================================
// SCHEMAS
// =============================================================================

const platformSchema = {
    type: 'object',
    properties: {
        platform: { type: 'string', enum: ['shopify', 'amazon'] },
    },
    required: ['platform'],
} as const;

const createBaselineSchema = {
    type: 'object',
    properties: {
        platform: { type: 'string', enum: ['shopify', 'amazon'] },
        windowDays: { type: 'number', minimum: 7, maximum: 90, default: 30 },
    },
    required: ['platform'],
} as const;

const attachTermsSchema = {
    type: 'object',
    properties: {
        contractId: { type: 'string', format: 'uuid' },
        snapshotId: { type: 'string', format: 'uuid' },
        platform: { type: 'string', enum: ['shopify', 'amazon'] },
        metric: { type: 'string', enum: ['net_settled_amount', 'closed_won_count'] },
        windowDays: { type: 'number', minimum: 7, maximum: 90 },
        targetDeltaCents: { type: 'number', minimum: 1 },
    },
    required: ['contractId', 'snapshotId', 'platform', 'metric', 'windowDays', 'targetDeltaCents'],
} as const;

// =============================================================================
// ROUTE PLUGIN
// =============================================================================

export default async function commerceRoutes(fastify: FastifyInstance) {
    // =========================================================================
    // HEALTH CHECK
    // =========================================================================

    /**
     * POST /v1/commerce/health/:platform
     * Check if user's commerce platform connection is healthy
     */
    fastify.post<{
        Params: { platform: string };
    }>('/v1/commerce/health/:platform', {
        schema: {
            params: platformSchema,
            response: {
                200: {
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean' },
                        platform: { type: 'string' },
                        shop: { type: 'string' },
                    },
                },
            },
        },
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        const userId = request.user?.id;
        if (!userId) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }

        const platform = request.params.platform as CommercePlatform;

        try {
            const result = await checkCommerceHealth(userId, platform);
            return reply.send(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Health check failed';
            return reply.send({ ok: false, platform, error: message });
        }
    });

    // =========================================================================
    // BASELINE SNAPSHOTS
    // =========================================================================

    /**
     * POST /v1/commerce/baseline
     * Create a baseline snapshot for commerce revenue
     */
    fastify.post<{
        Body: {
            platform: CommercePlatform;
            windowDays?: number;
        };
    }>('/v1/commerce/baseline', {
        schema: {
            body: createBaselineSchema,
            response: {
                201: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        platform: { type: 'string' },
                        netRevenueCents: { type: 'number' },
                        orderCount: { type: 'number' },
                        windowDays: { type: 'number' },
                        windowStart: { type: 'string' },
                        windowEnd: { type: 'string' },
                        createdAt: { type: 'string' },
                    },
                },
            },
        },
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        const userId = request.user?.id;
        if (!userId) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }

        const { platform, windowDays } = request.body;

        try {
            const snapshot = await createCommerceBaseline({
                userId,
                platform,
                windowDays,
            });

            const baselineJson = snapshot.baselineJson as {
                platform?: string;
                netRevenueCents?: number;
                orderCount?: number;
                windowStart?: string;
                windowEnd?: string;
            };

            return reply.status(201).send({
                id: snapshot.id,
                platform: baselineJson.platform,
                netRevenueCents: baselineJson.netRevenueCents,
                orderCount: baselineJson.orderCount,
                windowDays: snapshot.windowDays,
                windowStart: baselineJson.windowStart,
                windowEnd: baselineJson.windowEnd,
                createdAt: snapshot.createdAt.toISOString(),
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create baseline';
            return reply.status(400).send({ error: message });
        }
    });

    /**
     * GET /v1/commerce/baselines
     * List user's commerce baselines
     */
    fastify.get<{
        Querystring: { platform?: CommercePlatform };
    }>('/v1/commerce/baselines', {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    platform: { type: 'string', enum: ['shopify', 'amazon'] },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        baselines: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    platform: { type: 'string' },
                                    netRevenueCents: { type: 'number' },
                                    windowDays: { type: 'number' },
                                    createdAt: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        const userId = request.user?.id;
        if (!userId) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }

        const { platform } = request.query;

        const snapshots = await getUserCommerceBaselines(userId, platform);

        const baselines = snapshots.map(s => {
            const json = s.baselineJson as { platform?: string; netRevenueCents?: number };
            return {
                id: s.id,
                platform: json.platform,
                netRevenueCents: json.netRevenueCents,
                windowDays: s.windowDays,
                createdAt: s.createdAt.toISOString(),
            };
        });

        return reply.send({ baselines });
    });

    // =========================================================================
    // CONTRACT TERMS
    // =========================================================================

    /**
     * POST /v1/commerce/terms
     * Attach commerce terms to a contract
     */
    fastify.post<{
        Body: {
            contractId: string;
            snapshotId: string;
            platform: CommercePlatform;
            metric: 'net_settled_amount' | 'closed_won_count';
            windowDays: number;
            targetDeltaCents: number;
        };
    }>('/v1/commerce/terms', {
        schema: {
            body: attachTermsSchema,
            response: {
                201: {
                    type: 'object',
                    properties: {
                        contractId: { type: 'string' },
                        platform: { type: 'string' },
                        baselineValueCents: { type: 'number' },
                        targetDeltaCents: { type: 'number' },
                        targetTotalCents: { type: 'number' },
                        windowDays: { type: 'number' },
                        executedAt: { type: 'string' },
                    },
                },
            },
        },
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        const userId = request.user?.id;
        if (!userId) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }

        const { contractId, snapshotId, platform, metric, windowDays, targetDeltaCents } = request.body;

        try {
            const terms = await attachCommerceTerms({
                contractId,
                snapshotId,
                platform,
                metric,
                windowDays,
                targetDeltaCents,
            });

            return reply.status(201).send({
                contractId: terms.contractId,
                platform,
                baselineValueCents: terms.baselineValueCents,
                targetDeltaCents: terms.targetDeltaCents,
                targetTotalCents: terms.targetTotalCents,
                windowDays: terms.windowDays,
                executedAt: terms.executedAt.toISOString(),
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to attach terms';
            return reply.status(400).send({ error: message });
        }
    });

    /**
     * GET /v1/commerce/terms/:contractId
     * Get commerce terms for a contract
     */
    fastify.get<{
        Params: { contractId: string };
    }>('/v1/commerce/terms/:contractId', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    contractId: { type: 'string', format: 'uuid' },
                },
                required: ['contractId'],
            },
        },
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        const { contractId } = request.params;

        const terms = await getCommerceTerms(contractId);
        if (!terms) {
            return reply.status(404).send({ error: 'Commerce terms not found' });
        }

        const rulesJson = terms.qualifiedRulesJson as { platform?: string };

        return reply.send({
            contractId: terms.contractId,
            platform: rulesJson?.platform,
            baselineValueCents: terms.baselineValueCents,
            targetDeltaCents: terms.targetDeltaCents,
            targetTotalCents: terms.targetTotalCents,
            windowDays: terms.windowDays,
            executedAt: terms.executedAt.toISOString(),
        });
    });

    // =========================================================================
    // VERIFICATION
    // =========================================================================

    /**
     * POST /v1/commerce/verify/:contractId
     * Enqueue verification for a commerce contract
     */
    fastify.post<{
        Params: { contractId: string };
    }>('/v1/commerce/verify/:contractId', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    contractId: { type: 'string', format: 'uuid' },
                },
                required: ['contractId'],
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        runId: { type: 'string' },
                        status: { type: 'string' },
                        message: { type: 'string' },
                    },
                },
            },
        },
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        const { contractId } = request.params;

        try {
            const run = await enqueueCommerceVerification(contractId);

            return reply.status(201).send({
                runId: run.id,
                status: run.status,
                message: 'Verification queued',
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to queue verification';
            return reply.status(400).send({ error: message });
        }
    });

    /**
     * GET /v1/commerce/verification/:contractId
     * Get latest verification status for a commerce contract
     */
    fastify.get<{
        Params: { contractId: string };
    }>('/v1/commerce/verification/:contractId', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    contractId: { type: 'string', format: 'uuid' },
                },
                required: ['contractId'],
            },
        },
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        const { contractId } = request.params;

        const run = await getLatestCommerceVerification(contractId);
        if (!run) {
            return reply.status(404).send({ error: 'No verification found' });
        }

        return reply.send({
            runId: run.id,
            contractId: run.contractId,
            status: run.status,
            attempt: run.attempt,
            startedAt: run.startedAt?.toISOString(),
            finishedAt: run.finishedAt?.toISOString(),
            result: run.resultJson,
            error: run.errorMessage,
        });
    });

    /**
     * POST /v1/commerce/process/:runId
     * Process a verification run (internal/ops use)
     */
    fastify.post<{
        Params: { runId: string };
    }>('/v1/commerce/process/:runId', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    runId: { type: 'string', format: 'uuid' },
                },
                required: ['runId'],
            },
        },
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        const { runId } = request.params;

        const result = await processCommerceVerification(runId);

        return reply.send(result);
    });
}

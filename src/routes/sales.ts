/**
 * Sales Routes - Stripe Revenue Tracking
 * 
 * /v1/sales/* endpoints for baseline snapshotting, term attachment, 
 * and verification using Stripe payment data.
 * 
 * NOTE: Authorize.net support has been removed. Sales now uses
 * existing Stripe integration for revenue verification.
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
    createBaselineSnapshot,
    attachSalesTerms,
    enqueueVerification,
    getSalesTerms,
    getLatestVerificationRun,
} from '../services/sales.js';

// =============================================================================
// REQUEST SCHEMAS
// =============================================================================

interface CreateBaselineBody {
    windowDays?: number;
}

interface AttachTermsBody {
    snapshotId: string;
    metric: 'net_settled_amount';
    windowDays: number;
    targetDeltaCents: number;
}

interface ContractParams {
    id: string;
}

// =============================================================================
// ROUTE REGISTRATION
// =============================================================================

export async function salesRoutes(fastify: FastifyInstance): Promise<void> {
    // All routes require authentication
    fastify.addHook('preHandler', async (request, reply) => {
        if (!request.user?.id) {
            reply.code(401).send({ error: 'Authentication required' });
            throw new Error('Unauthorized');
        }
    });

    // =========================================================================
    // POST /v1/sales/baseline/snapshot
    // Create a baseline snapshot using Stripe revenue data
    // =========================================================================
    fastify.post<{ Body: CreateBaselineBody }>(
        '/v1/sales/baseline/snapshot',
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        windowDays: { type: 'integer', minimum: 1, maximum: 90, default: 30 },
                    },
                },
            },
        },
        async (request, reply) => {
            const userId = (request as any).user!.id;
            const { windowDays } = request.body;

            try {
                const snapshot = await createBaselineSnapshot({
                    userId,
                    windowDays,
                });

                return {
                    id: snapshot.id,
                    windowDays: snapshot.windowDays,
                    windowStartAt: snapshot.windowStartAt,
                    windowEndAt: snapshot.windowEndAt,
                    baselineValueCents: (snapshot.baselineJson as any)?.netSettledAmountCents,
                    txCount: (snapshot.baselineJson as any)?.txCount,
                    createdAt: snapshot.createdAt,
                };
            } catch (error) {
                fastify.log.error(error, 'Failed to create baseline snapshot');
                return reply.code(400).send({
                    error: error instanceof Error ? error.message : 'Snapshot failed',
                });
            }
        }
    );

    // =========================================================================
    // POST /v1/contracts/:id/sales/attach-terms
    // Attach immutable sales terms to a contract
    // =========================================================================
    fastify.post<{ Params: ContractParams; Body: AttachTermsBody }>(
        '/v1/contracts/:id/sales/attach-terms',
        {
            schema: {
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                    },
                },
                body: {
                    type: 'object',
                    required: ['snapshotId', 'metric', 'windowDays', 'targetDeltaCents'],
                    properties: {
                        snapshotId: { type: 'string', format: 'uuid' },
                        metric: { type: 'string', enum: ['net_settled_amount'] },
                        windowDays: { type: 'integer', minimum: 1, maximum: 90 },
                        targetDeltaCents: { type: 'integer', minimum: 0 },
                    },
                },
            },
        },
        async (request, reply) => {
            const { id: contractId } = request.params;
            const { snapshotId, metric, windowDays, targetDeltaCents } = request.body;

            try {
                const terms = await attachSalesTerms({
                    contractId,
                    snapshotId,
                    metric,
                    windowDays,
                    targetDeltaCents,
                });

                return {
                    contractId: terms.contractId,
                    provider: terms.provider,
                    metric: terms.metric,
                    windowDays: terms.windowDays,
                    baselineValueCents: terms.baselineValueCents,
                    targetDeltaCents: terms.targetDeltaCents,
                    targetTotalCents: terms.targetTotalCents,
                    executedAt: terms.executedAt,
                };
            } catch (error) {
                fastify.log.error(error, 'Failed to attach sales terms');

                if (error instanceof Error && error.message.includes('already has sales terms')) {
                    return reply.code(409).send({ error: error.message });
                }

                return reply.code(400).send({
                    error: error instanceof Error ? error.message : 'Attach terms failed',
                });
            }
        }
    );

    // =========================================================================
    // POST /v1/contracts/:id/sales/verify-now
    // Trigger manual verification (testing/ops)
    // =========================================================================
    fastify.post<{ Params: ContractParams }>(
        '/v1/contracts/:id/sales/verify-now',
        {
            schema: {
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                    },
                },
            },
        },
        async (request, reply) => {
            const { id: contractId } = request.params;

            try {
                const run = await enqueueVerification(contractId);

                return {
                    ok: true,
                    runId: run.id,
                    status: run.status,
                    attempt: run.attempt,
                };
            } catch (error) {
                fastify.log.error(error, 'Failed to enqueue verification');
                return reply.code(400).send({
                    error: error instanceof Error ? error.message : 'Verification failed',
                });
            }
        }
    );

    // =========================================================================
    // GET /v1/contracts/:id/sales/terms
    // =========================================================================
    fastify.get<{ Params: ContractParams }>(
        '/v1/contracts/:id/sales/terms',
        async (request, reply) => {
            const { id: contractId } = request.params;
            const terms = await getSalesTerms(contractId);

            if (!terms) {
                return reply.code(404).send({
                    error: 'No sales terms found for this contract',
                });
            }

            return terms;
        }
    );

    // =========================================================================
    // GET /v1/contracts/:id/sales/verification
    // =========================================================================
    fastify.get<{ Params: ContractParams }>(
        '/v1/contracts/:id/sales/verification',
        async (request, reply) => {
            const { id: contractId } = request.params;
            const run = await getLatestVerificationRun(contractId);

            if (!run) {
                return reply.code(404).send({
                    error: 'No verification runs found for this contract',
                });
            }

            return run;
        }
    );
}

export default salesRoutes;

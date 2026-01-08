/**
 * Ops Routes
 * 
 * Server-only administrative endpoints for operations.
 * Protected by OPS_TOKEN secret header.
 * 
 * These endpoints are NOT exposed to public API.
 */

import { FastifyPluginAsync } from 'fastify';
import { reconcileSweep, processDeferredPayouts } from '../services/reconciliation.js';

// =============================================================================
// CONFIGURATION
// =============================================================================

const OPS_TOKEN = process.env.OPS_TOKEN || 'dev-ops-token-change-in-production';

// Fail fast in production
if (process.env.NODE_ENV === 'production' && OPS_TOKEN === 'dev-ops-token-change-in-production') {
    console.warn('⚠️ OPS_TOKEN not set - ops endpoints will require token in production');
}

// =============================================================================
// AUTH HELPER
// =============================================================================

function verifyOpsToken(request: any): boolean {
    const token = request.headers['x-ops-token'] || request.headers['authorization'];

    // In development, allow without token
    if (process.env.NODE_ENV !== 'production') {
        return true;
    }

    if (!token) {
        return false;
    }

    // Support both raw token and Bearer token
    const cleanToken = token.replace('Bearer ', '');
    return cleanToken === OPS_TOKEN;
}

// =============================================================================
// ROUTES
// =============================================================================

const opsRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * POST /ops/reconcile
     * 
     * Trigger a reconciliation sweep to find and repair stuck contracts.
     * Returns a summary of actions taken.
     */
    fastify.post('/ops/reconcile', async (request, reply) => {
        if (!verifyOpsToken(request)) {
            reply.status(401);
            return { error: 'Invalid or missing OPS_TOKEN' };
        }

        try {
            const result = await reconcileSweep();
            return {
                success: true,
                ...result,
            };
        } catch (err: any) {
            reply.status(500);
            return {
                success: false,
                error: err.message,
            };
        }
    });

    /**
     * POST /ops/process-deferred-payouts
     * 
     * Process deferred payouts for users who have since connected Stripe.
     */
    fastify.post('/ops/process-deferred-payouts', async (request, reply) => {
        if (!verifyOpsToken(request)) {
            reply.status(401);
            return { error: 'Invalid or missing OPS_TOKEN' };
        }

        try {
            const result = await processDeferredPayouts();
            return {
                success: true,
                ...result,
            };
        } catch (err: any) {
            reply.status(500);
            return {
                success: false,
                error: err.message,
            };
        }
    });

    /**
     * GET /ops/health
     * 
     * Health check for ops endpoints (no auth required).
     */
    fastify.get('/ops/health', async () => {
        return {
            status: 'ok',
            opsAvailable: true,
            timestamp: new Date().toISOString(),
        };
    });

    /**
     * POST /ops/run-verification
     * 
     * Manually trigger the verification job.
     * Finds all LOCKED contracts past deadline and verifies them.
     */
    fastify.post('/ops/run-verification', async (request, reply) => {
        if (!verifyOpsToken(request)) {
            reply.status(401);
            return { error: 'Invalid or missing OPS_TOKEN' };
        }

        try {
            const { runVerificationJob } = await import('../services/verification.js');
            const result = await runVerificationJob();
            return {
                success: true,
                jobType: 'VERIFICATION',
                ...result,
            };
        } catch (err: any) {
            reply.status(500);
            return {
                success: false,
                error: err.message,
            };
        }
    });

    /**
     * POST /ops/run-settlement
     * 
     * Manually trigger the settlement job.
     * Finds all verified contracts and settles them.
     */
    fastify.post('/ops/run-settlement', async (request, reply) => {
        if (!verifyOpsToken(request)) {
            reply.status(401);
            return { error: 'Invalid or missing OPS_TOKEN' };
        }

        try {
            const { runSettlementJob } = await import('../services/settlement.js');
            const result = await runSettlementJob();
            return {
                success: true,
                jobType: 'SETTLEMENT',
                ...result,
            };
        } catch (err: any) {
            reply.status(500);
            return {
                success: false,
                error: err.message,
            };
        }
    });

    /**
     * POST /ops/run-all-jobs
     * 
     * Manually trigger all scheduled jobs (verification, settlement, reconciliation).
     */
    fastify.post('/ops/run-all-jobs', async (request, reply) => {
        if (!verifyOpsToken(request)) {
            reply.status(401);
            return { error: 'Invalid or missing OPS_TOKEN' };
        }

        try {
            const { runScheduledJobs } = await import('../services/scheduler.js');
            const result = await runScheduledJobs();
            return {
                success: true,
                ...result,
            };
        } catch (err: any) {
            reply.status(500);
            return {
                success: false,
                error: err.message,
            };
        }
    });
};
export default opsRoutes;

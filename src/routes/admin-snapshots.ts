// @ts-nocheck
/**
 * Admin Snapshot Routes
 * 
 * View baseline snapshots, oracle metric history, and connected accounts.
 * Protected by ADMIN_API_KEY header.
 */

import { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client.js';
import {
    contracts,
    connectedAccounts,
    ledgerEvents,
} from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// =============================================================================
// AUTH
// =============================================================================

function verifyAdmin(request: any): boolean {
    // Support both header and query param for browser access
    const adminKey = request.headers['x-admin-key'] || (request.query as any)?.key;
    if (!process.env.ADMIN_API_KEY && process.env.NODE_ENV !== 'production') {
        return true; // Allow in dev without key
    }
    return !!adminKey && adminKey === process.env.ADMIN_API_KEY;
}

// =============================================================================
// ROUTES
// =============================================================================

const adminSnapshotRoutes: FastifyPluginAsync = async (fastify) => {

    /**
     * GET /v1/admin/snapshots
     * 
     * List all contracts with their baseline data.
     * Query params: ?platform=YOUTUBE&userId=xxx&limit=50
     */
    fastify.get('/v1/admin/snapshots', async (request, reply) => {
        if (!verifyAdmin(request)) {
            return reply.status(403).send({ error: 'Unauthorized: Admin access required' });
        }

        try {
            const query = request.query as { platform?: string; userId?: string; limit?: string };
            const limit = Math.min(parseInt(query.limit || '50', 10), 200);

            // Simple query — just contracts table, no joins
            let results = await db
                .select()
                .from(contracts)
                .orderBy(desc(contracts.createdAt))
                .limit(limit);

            // Filter by platform
            if (query.platform) {
                const plat = query.platform.toUpperCase();
                results = results.filter(r => r.platform === plat);
            }

            // Filter by userId
            if (query.userId) {
                results = results.filter(r => r.principalUserId === query.userId);
            }

            // Format for readability
            const formatted = results.map(r => ({
                contractId: r.id,
                user: r.principalIdentityUsername || r.principalUserId,
                platform: r.platform,
                metricType: r.metricType,
                lockAmount: `$${((r.lockAmountUsdCents || 0) / 100).toFixed(2)}`,
                payoutAmount: `$${((r.payoutAmountUsdCents || 0) / 100).toFixed(2)}`,
                riskTier: r.riskTier,
                deadline: r.deadlineUtc,
                createdAt: r.createdAt,
                baseline: r.baselineJson,
                condition: r.conditionJson,
            }));

            return {
                ok: true,
                count: formatted.length,
                snapshots: formatted,
            };
        } catch (err: any) {
            console.error('[AdminSnapshots] Error fetching snapshots:', err);
            return reply.status(500).send({ ok: false, error: err.message });
        }
    });

    /**
     * GET /v1/admin/snapshots/:contractId
     * 
     * Deep view of a single contract: baseline + ledger events.
     */
    fastify.get('/v1/admin/snapshots/:contractId', async (request, reply) => {
        if (!verifyAdmin(request)) {
            return reply.status(403).send({ error: 'Unauthorized: Admin access required' });
        }

        try {
            const { contractId } = request.params as { contractId: string };

            // Contract details
            const [contract] = await db
                .select()
                .from(contracts)
                .where(eq(contracts.id, contractId))
                .limit(1);

            if (!contract) {
                return reply.status(404).send({ error: 'Contract not found' });
            }

            // Ledger events for this contract
            const events = await db
                .select()
                .from(ledgerEvents)
                .where(eq(ledgerEvents.contractId, contractId))
                .orderBy(desc(ledgerEvents.timestampUtc))
                .limit(50);

            // Try to get oracle data (tables may not exist yet)
            let oracleHistory = [];
            let currentMetric = null;
            try {
                const { contractMetricSnapshots, contractMetricCurrent } = await import('../db/schema.js');
                if (contractMetricSnapshots) {
                    oracleHistory = await db
                        .select()
                        .from(contractMetricSnapshots)
                        .where(eq(contractMetricSnapshots.contractId, contractId))
                        .orderBy(desc(contractMetricSnapshots.fetchedAt))
                        .limit(100);
                }
                if (contractMetricCurrent) {
                    const [cm] = await db
                        .select()
                        .from(contractMetricCurrent)
                        .where(eq(contractMetricCurrent.contractId, contractId))
                        .limit(1);
                    currentMetric = cm || null;
                }
            } catch (oracleErr) {
                console.warn('[AdminSnapshots] Oracle tables not available:', (oracleErr as any).message);
            }

            return {
                ok: true,
                contract: {
                    id: contract.id,
                    user: contract.principalIdentityUsername || contract.principalUserId,
                    platform: contract.platform,
                    metricType: contract.metricType,
                    lockAmount: `$${((contract.lockAmountUsdCents || 0) / 100).toFixed(2)}`,
                    payoutAmount: `$${((contract.payoutAmountUsdCents || 0) / 100).toFixed(2)}`,
                    deadline: contract.deadlineUtc,
                    riskTier: contract.riskTier,
                    createdAt: contract.createdAt,
                },
                baseline: contract.baselineJson,
                condition: contract.conditionJson,
                currentMetric: currentMetric ? {
                    provider: currentMetric.provider,
                    metricKey: currentMetric.metricKey,
                    metricValue: currentMetric.metricValue,
                    progressPct: currentMetric.progressPct,
                    fetchedAt: currentMetric.fetchedAt,
                    nextCheckAt: currentMetric.nextCheckAt,
                } : null,
                oracleHistory: oracleHistory.map((s: any) => ({
                    provider: s.provider,
                    metricKey: s.metricKey,
                    metricValue: s.metricValue,
                    fetchedAt: s.fetchedAt,
                })),
                ledgerEvents: events.map(e => ({
                    eventType: e.eventType,
                    actor: e.actor,
                    amountUsdCents: e.amountUsdCents,
                    metadata: e.metadata,
                    timestamp: e.timestampUtc,
                })),
            };
        } catch (err: any) {
            console.error('[AdminSnapshots] Error fetching contract detail:', err);
            return reply.status(500).send({ ok: false, error: err.message });
        }
    });

    /**
     * GET /v1/admin/connected-accounts
     * 
     * List all connected accounts across all users.
     * Query params: ?platform=YOUTUBE&status=ACTIVE&limit=50
     */
    fastify.get('/v1/admin/connected-accounts', async (request, reply) => {
        if (!verifyAdmin(request)) {
            return reply.status(403).send({ error: 'Unauthorized: Admin access required' });
        }

        try {
            const query = request.query as { platform?: string; status?: string; limit?: string };
            const limit = Math.min(parseInt(query.limit || '50', 10), 200);

            let results = await db
                .select()
                .from(connectedAccounts)
                .orderBy(desc(connectedAccounts.createdAt))
                .limit(limit);

            // Filter by platform
            if (query.platform) {
                results = results.filter(r => r.platform === query.platform?.toUpperCase());
            }

            // Filter by status
            if (query.status) {
                results = results.filter(r => r.status === query.status?.toUpperCase());
            }

            const formatted = results.map(r => ({
                id: r.id,
                userId: r.userId,
                platform: r.platform,
                externalAccountId: r.externalAccountId,
                displayName: r.displayName,
                status: r.status,
                metadata: r.metadataJson,
                connectedAt: r.createdAt,
                verifiedAt: r.verifiedAt,
            }));

            return {
                ok: true,
                count: formatted.length,
                accounts: formatted,
            };
        } catch (err: any) {
            console.error('[AdminSnapshots] Error fetching connected accounts:', err);
            return reply.status(500).send({ ok: false, error: err.message });
        }
    });
};

export default adminSnapshotRoutes;

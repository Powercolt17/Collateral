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
    contractIndex,
    contractMetricSnapshots,
    contractMetricCurrent,
    connectedAccounts,
    ledgerEvents,
} from '../db/schema.js';
import { eq, desc, and, sql } from 'drizzle-orm';

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

        const query = request.query as { platform?: string; userId?: string; limit?: string };
        const limit = Math.min(parseInt(query.limit || '50', 10), 200);

        let results = await db
            .select({
                contractId: contracts.id,
                principalUserId: contracts.principalUserId,
                username: contracts.principalIdentityUsername,
                platform: contracts.platform,
                metricType: contracts.metricType,
                conditionJson: contracts.conditionJson,
                baselineJson: contracts.baselineJson,
                lockAmountUsdCents: contracts.lockAmountUsdCents,
                payoutAmountUsdCents: contracts.payoutAmountUsdCents,
                deadlineUtc: contracts.deadlineUtc,
                riskTier: contracts.riskTier,
                createdAt: contracts.createdAt,
                currentState: contractIndex.currentState,
                isTerminal: contractIndex.isTerminal,
            })
            .from(contracts)
            .leftJoin(contractIndex, eq(contracts.id, contractIndex.contractId))
            .orderBy(desc(contracts.createdAt))
            .limit(limit);

        // Filter by platform
        if (query.platform) {
            results = results.filter(r => r.platform === query.platform.toUpperCase());
        }

        // Filter by userId
        if (query.userId) {
            results = results.filter(r => r.principalUserId === query.userId);
        }

        // Format for readability
        const formatted = results.map(r => ({
            contractId: r.contractId,
            user: r.username || r.principalUserId,
            platform: r.platform,
            metricType: r.metricType,
            state: r.currentState || 'UNKNOWN',
            isTerminal: !!r.isTerminal,
            lockAmount: `$${((r.lockAmountUsdCents || 0) / 100).toFixed(2)}`,
            payoutAmount: `$${((r.payoutAmountUsdCents || 0) / 100).toFixed(2)}`,
            deadline: r.deadlineUtc,
            createdAt: r.createdAt,
            baseline: r.baselineJson,
            condition: r.conditionJson,
            riskTier: r.riskTier,
        }));

        return {
            ok: true,
            count: formatted.length,
            snapshots: formatted,
        };
    });

    /**
     * GET /v1/admin/snapshots/:contractId
     * 
     * Deep view of a single contract: baseline + oracle snapshots + current metric + ledger events.
     */
    fastify.get('/v1/admin/snapshots/:contractId', async (request, reply) => {
        if (!verifyAdmin(request)) {
            return reply.status(403).send({ error: 'Unauthorized: Admin access required' });
        }

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

        // Current state
        const [state] = await db
            .select()
            .from(contractIndex)
            .where(eq(contractIndex.contractId, contractId))
            .limit(1);

        // Oracle metric snapshots (history)
        const snapshots = await db
            .select()
            .from(contractMetricSnapshots)
            .where(eq(contractMetricSnapshots.contractId, contractId))
            .orderBy(desc(contractMetricSnapshots.fetchedAt))
            .limit(100);

        // Current metric cache
        const [currentMetric] = await db
            .select()
            .from(contractMetricCurrent)
            .where(eq(contractMetricCurrent.contractId, contractId))
            .limit(1);

        // Baseline-related ledger events
        const events = await db
            .select()
            .from(ledgerEvents)
            .where(eq(ledgerEvents.contractId, contractId))
            .orderBy(desc(ledgerEvents.timestampUtc))
            .limit(50);

        return {
            ok: true,
            contract: {
                id: contract.id,
                user: contract.principalIdentityUsername || contract.principalUserId,
                platform: contract.platform,
                metricType: contract.metricType,
                state: state?.currentState || 'UNKNOWN',
                isTerminal: !!state?.isTerminal,
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
            oracleHistory: snapshots.map(s => ({
                provider: s.provider,
                metricKey: s.metricKey,
                metricValue: s.metricValue,
                fetchedAt: s.fetchedAt,
                requestId: s.requestId,
            })),
            ledgerEvents: events.map(e => ({
                eventType: e.eventType,
                actor: e.actor,
                amountUsdCents: e.amountUsdCents,
                metadata: e.metadata,
                timestamp: e.timestampUtc,
            })),
        };
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
    });
};

export default adminSnapshotRoutes;

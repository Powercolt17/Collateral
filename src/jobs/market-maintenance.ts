import { db } from '../db/client.js';
import {
    marketContractInstances,
    marketStatsCache,
    contracts,
} from '../db/schema.js';
import { eq, lt, inArray, sql, and, gte } from 'drizzle-orm';

/**
 * JOB 1: Expire Instances
 * Runs every minute. Closes instances past their funding window.
 */
export async function expireInstances() {
    const now = new Date();

    const result = await db
        .update(marketContractInstances)
        .set({ status: 'expired' } as any)
        .where(and(
            lt(marketContractInstances.fundingCloseAt, now),
            inArray(marketContractInstances.status, ['published', 'closing'])
        ))
        .returning({ id: marketContractInstances.id });

    if (result.length > 0) {
        console.log(`[Job] Expired ${result.length} market instances`);
    }
}

/**
 * JOB 2: Recompute Market Stats
 * Runs every 30-60s. Updates trending/volume stats for active instances.
 */
export async function recomputeStats() {
    // 1. Find active instances (published/closing)
    const activeInstances = await db
        .select({ id: marketContractInstances.id })
        .from(marketContractInstances)
        .where(inArray(marketContractInstances.status, ['published', 'closing']));

    if (activeInstances.length === 0) return;

    const instanceIds = activeInstances.map(i => i.id);

    // 2. Aggregate stats for these instances
    // We do this in one query per metric or broken down?
    // Let's iterate for simplicity and clarity, or use a complex group by query.
    // Iteration is safer for now given the complexity of date filtering in SQL builder.

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    for (const instanceId of instanceIds) {
        // Count executions 1h
        const [exec1h] = await db
            .select({ count: sql<number>`count(*)` })
            .from(contracts)
            .where(and(
                eq(contracts.marketInstanceId, instanceId),
                gte(contracts.createdAt, oneHourAgo)
            ));

        // Count executions 24h
        const [exec24h] = await db
            .select({ count: sql<number>`count(*)` })
            .from(contracts)
            .where(and(
                eq(contracts.marketInstanceId, instanceId),
                gte(contracts.createdAt, twentyFourHoursAgo)
            ));

        // Volume 24h
        const [vol24h] = await db
            .select({ total: sql<number>`sum(${contracts.lockAmountUsdCents})` })
            .from(contracts)
            .where(and(
                eq(contracts.marketInstanceId, instanceId),
                gte(contracts.createdAt, twentyFourHoursAgo)
            ));

        // Volume 1h
        const [vol1h] = await db
            .select({ total: sql<number>`sum(${contracts.lockAmountUsdCents})` })
            .from(contracts)
            .where(and(
                eq(contracts.marketInstanceId, instanceId),
                gte(contracts.createdAt, oneHourAgo)
            ));

        // Total Volume
        const [volTotal] = await db
            .select({ total: sql<number>`sum(${contracts.lockAmountUsdCents})` })
            .from(contracts)
            .where(eq(contracts.marketInstanceId, instanceId));

        // Last Execution Time
        const [lastExec] = await db
            .select({ createdAt: contracts.createdAt })
            .from(contracts)
            .where(eq(contracts.marketInstanceId, instanceId))
            .orderBy(sql`${contracts.createdAt} DESC`)
            .limit(1);

        // Update Cache
        // Upsert (insert on conflict update)
        await db
            .insert(marketStatsCache)
            .values({
                instanceId,
                executions1h: Number(exec1h?.count || 0),
                executions24h: Number(exec24h?.count || 0),
                capitalLocked1hCents: Number(vol1h?.total || 0),
                capitalLocked24hCents: Number(vol24h?.total || 0),
                capitalLockedTotalCents: Number(volTotal?.total || 0),
                lastExecutionAt: lastExec?.createdAt || null,
                updatedAt: new Date(),
            } as any)
            .onConflictDoUpdate({
                target: marketStatsCache.instanceId,
                set: {
                    executions1h: Number(exec1h?.count || 0),
                    executions24h: Number(exec24h?.count || 0),
                    capitalLocked1hCents: Number(vol1h?.total || 0),
                    capitalLocked24hCents: Number(vol24h?.total || 0),
                    capitalLockedTotalCents: Number(volTotal?.total || 0),
                    lastExecutionAt: lastExec?.createdAt || null,
                    updatedAt: new Date(),
                } as any
            });
    }

    console.log(`[Job] Updated stats for ${instanceIds.length} instances`);
}

// Runner for testing manually
if (process.argv[1] && process.argv[1].endsWith('market-maintenance.ts')) {
    (async () => {
        console.log('Running market maintenance jobs...');
        await expireInstances();
        await recomputeStats();
        console.log('Done.');
        process.exit(0);
    })();
}

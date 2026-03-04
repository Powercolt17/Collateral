// @ts-nocheck
/**
 * Oracle Service — Live Metric Refresh for Active Contracts
 * 
 * Fetches current metric values from provider adapters, writes append-only
 * snapshots, upserts the fast-read cache (contract_metric_current), and
 * emits ledger events.
 * 
 * INVARIANTS:
 * - Frontend NEVER calls provider APIs. This service is the only writer.
 * - Fail-closed: on provider error, current value is NOT changed.
 * - Single-writer lock per contract prevents concurrent refresh.
 * - Append-only snapshots are never mutated or deleted.
 */

import { db } from '../db/client.js';
import {
    contracts,
    contractIndex,
    contractMetricSnapshots,
    contractMetricCurrent,
    connectedAccounts,
    EventType,
} from '../db/schema.js';
import { eq, and, lte, or, isNull, sql } from 'drizzle-orm';
import { appendEvent } from './ledger.js';
import { tryAcquireLock, releaseLock } from './job-lock.js';
import { getXClient } from '../adapters/x.js';
import { randomUUID } from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

interface MetricFetchResult {
    metricValue: number;
    fetchedAt: Date;
    requestId: string;
}

// =============================================================================
// DYNAMIC CADENCE RULES
// =============================================================================

/** Default polling intervals per provider (milliseconds) */
const DEFAULT_CADENCE_MS: Record<string, number> = {
    X: 60 * 60 * 1000,          // 60 minutes
    STRIPE: 6 * 60 * 60 * 1000,  // 6 hours (webhook reconciliation)
    SHOPIFY: 6 * 60 * 60 * 1000, // 6 hours (webhook reconciliation)
};

const BACKOFF_MS = 10 * 60 * 1000; // 10 minutes on error

/**
 * Compute next_check_at based on progress, provider, and deadline proximity.
 */
export function computeNextCheckAt(
    provider: string,
    progressPct: number,
    deadlineUtc: Date,
): Date {
    const now = new Date();
    const msUntilDeadline = deadlineUtc.getTime() - now.getTime();
    const defaultMs = DEFAULT_CADENCE_MS[provider] ?? 60 * 60 * 1000;

    let intervalMs = defaultMs;

    // Escalation near target
    if (progressPct >= 95) {
        intervalMs = 5 * 60 * 1000;   // 5 minutes
    } else if (progressPct >= 80) {
        intervalMs = 15 * 60 * 1000;  // 15 minutes
    }

    // Final 24h before deadline — minimum 15 min cadence
    if (msUntilDeadline > 0 && msUntilDeadline <= 24 * 60 * 60 * 1000) {
        intervalMs = Math.min(intervalMs, 15 * 60 * 1000);
    }

    return new Date(now.getTime() + intervalMs);
}

// =============================================================================
// PROGRESS CALCULATION
// =============================================================================

/**
 * Compute clamped progress percentage (0–100).
 * 
 * For delta-based contracts (e.g., revenue growth from baseline):
 *   progress = ((current - baseline) / (target - baseline)) * 100
 * 
 * For absolute contracts (e.g., follower threshold):
 *   progress = (current / target) * 100
 */
export function computeProgressPct(
    baselineValue: number,
    targetValue: number,
    currentValue: number,
    mode: 'delta' | 'absolute' = 'absolute',
): number {
    let pct: number;

    if (mode === 'delta') {
        const range = targetValue - baselineValue;
        if (range <= 0) return currentValue >= targetValue ? 100 : 0;
        pct = ((currentValue - baselineValue) / range) * 100;
    } else {
        if (targetValue <= 0) return 100;
        pct = (currentValue / targetValue) * 100;
    }

    // Clamp 0–100
    return Math.max(0, Math.min(100, pct));
}

// =============================================================================
// METRIC FETCHERS (per provider)
// =============================================================================

/**
 * Extract baseline and target values from contract JSON fields.
 */
function extractMetricParams(contract: any): {
    metricKey: string;
    baselineValue: number;
    targetValue: number;
    mode: 'delta' | 'absolute';
    xUserId?: string;
} {
    const platform = contract.platform as string;
    const condition = contract.conditionJson as { threshold?: number; operator?: string };
    const baseline = contract.baselineJson as Record<string, any> | null;

    if (platform === 'X') {
        return {
            metricKey: 'followers',
            baselineValue: baseline?.followers ?? 0,
            targetValue: condition?.threshold ?? 0,
            mode: 'absolute', // X uses absolute threshold (GTE followers)
        };
    }

    if (platform === 'STRIPE') {
        return {
            metricKey: 'revenue',
            baselineValue: baseline?.netSettledAmountCents ?? baseline?.baselineValueCents ?? 0,
            targetValue: condition?.threshold ?? 0,
            mode: 'delta', // Stripe uses revenue growth from baseline
        };
    }

    if (platform === 'SHOPIFY') {
        return {
            metricKey: 'shopify_revenue',
            baselineValue: baseline?.netRevenueCents ?? 0,
            targetValue: condition?.threshold ?? 0,
            mode: 'delta',
        };
    }

    // Generic fallback
    return {
        metricKey: contract.metricType?.toLowerCase() ?? 'generic',
        baselineValue: baseline?.value ?? 0,
        targetValue: condition?.threshold ?? 0,
        mode: 'absolute',
    };
}

/**
 * Fetch the live metric value from the provider.
 * Returns null on failure (fail-closed — caller handles backoff).
 */
async function fetchMetricFromProvider(
    contract: any,
    params: ReturnType<typeof extractMetricParams>,
): Promise<MetricFetchResult | null> {
    const platform = contract.platform as string;
    const requestId = randomUUID();
    const fetchedAt = new Date();

    try {
        if (platform === 'X') {
            // Get X connected account for this user
            const [xAccount] = await db
                .select()
                .from(connectedAccounts)
                .where(
                    and(
                        eq(connectedAccounts.userId, contract.principalUserId),
                        eq(connectedAccounts.platform, 'X'),
                        eq(connectedAccounts.status, 'ACTIVE'),
                    )
                )
                .limit(1);

            if (!xAccount) {
                console.error(`[Oracle] No active X account for user ${contract.principalUserId}`);
                return null;
            }

            const client = getXClient();
            const followers = await client.getFollowers(xAccount.externalAccountId);

            return {
                metricValue: followers,
                fetchedAt,
                requestId,
            };
        }

        // STRIPE and SHOPIFY: webhook-primary, oracle is reconciliation
        // For now, these providers don't have oracle polling implemented
        // (webhooks handle real-time updates; oracle just reconciles)
        // TODO: Add Stripe Balance Transaction fetch and Shopify order total fetch
        console.log(`[Oracle] Provider ${platform} uses webhooks — oracle reconciliation skipped for now`);
        return null;

    } catch (err: any) {
        console.error(`[Oracle] Failed to fetch metric for contract ${contract.id} (${platform}):`, err.message);
        return null;
    }
}

// =============================================================================
// CORE REFRESH LOGIC
// =============================================================================

/**
 * Refresh metric for a single contract.
 * 
 * 1. Acquire per-contract lock (single writer)
 * 2. Fetch metric from provider
 * 3. Write append-only snapshot
 * 4. Upsert contract_metric_current
 * 5. Emit ledger event
 * 6. Release lock
 */
export async function refreshContractMetric(contractId: string): Promise<boolean> {
    // Step 1: Acquire lock
    const lockResult = await tryAcquireLock(contractId, 'ORACLE');
    if (!lockResult.acquired) {
        console.log(`[Oracle] Lock contention for contract ${contractId}, skipping`);
        return false;
    }

    try {
        // Step 2: Load contract
        const [contract] = await db
            .select()
            .from(contracts)
            .where(eq(contracts.id, contractId))
            .limit(1);

        if (!contract) {
            console.error(`[Oracle] Contract not found: ${contractId}`);
            return false;
        }

        const platform = contract.platform as string;
        const params = extractMetricParams(contract);

        // Step 3: Fetch metric
        const fetchResult = await fetchMetricFromProvider(contract, params);

        if (!fetchResult) {
            // Fail-closed: don't change current value, set backoff
            await db
                .insert(contractMetricCurrent)
                .values({
                    contractId,
                    provider: platform,
                    metricKey: params.metricKey,
                    metricValue: '0',
                    fetchedAt: new Date(),
                    progressPct: '0',
                    nextCheckAt: new Date(Date.now() + BACKOFF_MS),
                    updatedAt: new Date(),
                })
                .onConflictDoUpdate({
                    target: contractMetricCurrent.contractId,
                    set: {
                        nextCheckAt: new Date(Date.now() + BACKOFF_MS),
                        updatedAt: new Date(),
                    },
                });
            return false;
        }

        // Step 4: Compute progress
        const progressPct = computeProgressPct(
            params.baselineValue,
            params.targetValue,
            fetchResult.metricValue,
            params.mode,
        );

        // Step 5: Write snapshot (append-only)
        await db.insert(contractMetricSnapshots).values({
            contractId,
            provider: platform,
            metricKey: params.metricKey,
            metricValue: String(fetchResult.metricValue),
            fetchedAt: fetchResult.fetchedAt,
            requestId: fetchResult.requestId,
        });

        // Step 6: Compute next check time
        const nextCheckAt = computeNextCheckAt(platform, progressPct, contract.deadlineUtc);

        // Step 7: Upsert current cache
        await db
            .insert(contractMetricCurrent)
            .values({
                contractId,
                provider: platform,
                metricKey: params.metricKey,
                metricValue: String(fetchResult.metricValue),
                fetchedAt: fetchResult.fetchedAt,
                progressPct: String(progressPct),
                nextCheckAt,
                updatedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: contractMetricCurrent.contractId,
                set: {
                    provider: platform,
                    metricKey: params.metricKey,
                    metricValue: String(fetchResult.metricValue),
                    fetchedAt: fetchResult.fetchedAt,
                    progressPct: String(progressPct),
                    nextCheckAt,
                    updatedAt: new Date(),
                },
            });

        // Step 8: Emit ledger event
        await appendEvent({
            contractId,
            actor: 'SYSTEM',
            eventType: EventType.ORACLE_SNAPSHOT_RECORDED,
            metadata: {
                provider: platform,
                metricKey: params.metricKey,
                metricValue: fetchResult.metricValue,
                fetchedAt: fetchResult.fetchedAt.toISOString(),
                progressPct,
                requestId: fetchResult.requestId,
                nextCheckAt: nextCheckAt.toISOString(),
            },
        });

        console.log(
            `[Oracle] ✅ Contract ${contractId} | ${platform}/${params.metricKey} = ${fetchResult.metricValue} | progress=${progressPct.toFixed(1)}% | next=${nextCheckAt.toISOString()}`
        );

        return true;

    } finally {
        // Step 9: Release lock
        if (lockResult.lockId) {
            await releaseLock(contractId, 'ORACLE', lockResult.lockId);
        }
    }
}

// =============================================================================
// QUERY: Active contracts needing refresh
// =============================================================================

/**
 * Find ACTIVE contracts that need a metric refresh.
 * 
 * A contract needs refresh if:
 * - currentState is 'LOCKED' (active, pre-deadline)
 * - AND either:
 *   a) No row in contract_metric_current (first fetch)
 *   b) next_check_at <= NOW()
 */
export async function getContractsNeedingRefresh(): Promise<string[]> {
    const now = new Date();

    // Contracts with no current metric or past-due next_check_at
    const results = await db
        .select({ contractId: contractIndex.contractId })
        .from(contractIndex)
        .leftJoin(
            contractMetricCurrent,
            eq(contractIndex.contractId, contractMetricCurrent.contractId),
        )
        .where(
            and(
                eq(contractIndex.currentState, 'LOCKED'),
                eq(contractIndex.isTerminal, 0),
                or(
                    isNull(contractMetricCurrent.contractId), // No metric row yet
                    lte(contractMetricCurrent.nextCheckAt, now), // Past due
                ),
            )
        );

    return results.map(r => r.contractId);
}

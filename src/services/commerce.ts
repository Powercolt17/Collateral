/**
 * Commerce Service - Shopify + Amazon Revenue Tracking
 * 
 * Business logic for commerce baselines, contract terms, and verification.
 * Uses Shopify/Amazon APIs for revenue tracking.
 * 
 * INVARIANTS:
 * - Baseline snapshots are IMMUTABLE after creation
 * - Contract terms are FROZEN at execution
 * - Only delta growth is measured (not raw totals)
 * - All money in USD cents (BIGINT in DB)
 * - Fail-closed on any verification error
 */

import { db } from '../db/client.js';
import {
    salesBaselineSnapshots,
    salesContractTerms,
    salesVerificationRuns,
    ledgerEvents,
    contracts,
    type Contract,
    type SalesBaselineSnapshot,
    type SalesContractTerms,
    type SalesVerificationRun,
    EventType,
} from '../db/schema.js';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { appendEvent } from './ledger.js';
import { shopifyAdapter, type CommerceAdapter } from '../adapters/shopify.js';
import { amazonAdapter } from '../adapters/amazon-seller.js';

// =============================================================================
// TYPES
// =============================================================================

export type CommercePlatform = 'shopify' | 'amazon';

export interface CreateCommerceBaselineParams {
    userId: string;
    platform: CommercePlatform;
    windowDays?: number;
}

export interface AttachCommerceTermsParams {
    contractId: string;
    snapshotId: string;
    platform: CommercePlatform;
    metric: 'net_settled_amount' | 'closed_won_count';
    windowDays: number;
    targetDeltaCents: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const TERMINAL_EVENTS = [
    'SETTLED_SUCCESS',
    'SETTLED_FAILURE',
    'CONTRACT_FORFEITED',
    'CONTRACT_SETTLED',
];

// =============================================================================
// HELPERS
// =============================================================================

function getAdapter(platform: CommercePlatform): CommerceAdapter {
    switch (platform) {
        case 'shopify':
            return shopifyAdapter;
        case 'amazon':
            return amazonAdapter;
        default:
            throw new Error(`Unknown commerce platform: ${platform}`);
    }
}

async function isContractTerminal(contractId: string): Promise<boolean> {
    const events = await db
        .select({ eventType: ledgerEvents.eventType })
        .from(ledgerEvents)
        .where(
            and(
                eq(ledgerEvents.contractId, contractId),
                inArray(ledgerEvents.eventType, TERMINAL_EVENTS)
            )
        )
        .limit(1);

    return events.length > 0;
}

// =============================================================================
// BASELINE SNAPSHOTS
// =============================================================================

/**
 * Create a baseline snapshot for commerce revenue
 */
export async function createCommerceBaseline(
    params: CreateCommerceBaselineParams
): Promise<SalesBaselineSnapshot> {
    const { userId, platform, windowDays = 30 } = params;

    const adapter = getAdapter(platform);
    const baseline = await adapter.snapshotBaseline(userId, windowDays);

    // Calculate window bounds
    const windowEndAt = new Date(baseline.snapshotAt);
    const windowStartAt = new Date(windowEndAt.getTime() - windowDays * 24 * 60 * 60 * 1000);

    // Insert baseline snapshot
    const [snapshot] = await db.insert(salesBaselineSnapshots).values({
        userId,
        provider: 'stripe', // Schema uses 'stripe' enum, we store platform details in baselineJson
        windowDays,
        windowStartAt,
        windowEndAt,
        baselineJson: {
            platform,
            netRevenueCents: baseline.netRevenueCents,
            orderCount: baseline.orderCount,
            windowStart: baseline.windowStart,
            windowEnd: baseline.windowEnd,
            evidence: baseline.evidence,
        },
    }).returning();

    // Emit ledger event
    await appendEvent({
        eventType: EventType.COMMERCE_BASELINE_CAPTURED,
        userId,
        contractId: null,
        metadata: {
            snapshotId: snapshot.id,
            platform,
            netRevenueCents: baseline.netRevenueCents,
            orderCount: baseline.orderCount,
            windowDays,
        },
    });

    return snapshot;
}

/**
 * Get baseline snapshot by ID
 */
export async function getCommerceBaseline(
    snapshotId: string
): Promise<SalesBaselineSnapshot | null> {
    const [snapshot] = await db
        .select()
        .from(salesBaselineSnapshots)
        .where(eq(salesBaselineSnapshots.id, snapshotId))
        .limit(1);

    return snapshot || null;
}

/**
 * Get user's commerce baselines
 */
export async function getUserCommerceBaselines(
    userId: string,
    platform?: CommercePlatform
): Promise<SalesBaselineSnapshot[]> {
    const snapshots = await db
        .select()
        .from(salesBaselineSnapshots)
        .where(eq(salesBaselineSnapshots.userId, userId))
        .orderBy(desc(salesBaselineSnapshots.createdAt));

    // Filter by platform if specified (stored in baselineJson)
    if (platform) {
        return snapshots.filter(s => {
            const json = s.baselineJson as { platform?: string };
            return json.platform === platform;
        });
    }

    return snapshots;
}

// =============================================================================
// CONTRACT TERMS
// =============================================================================

/**
 * Attach commerce terms to a contract
 * 
 * GUARDRAIL: Once attached, cannot be changed
 */
export async function attachCommerceTerms(
    params: AttachCommerceTermsParams
): Promise<SalesContractTerms> {
    const { contractId, snapshotId, platform, metric, windowDays, targetDeltaCents } = params;

    // Get the contract
    const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, contractId))
        .limit(1);

    if (!contract) {
        throw new Error(`Contract not found: ${contractId}`);
    }

    // Check if already terminal
    if (await isContractTerminal(contractId)) {
        throw new Error(`Contract ${contractId} is already in terminal state`);
    }

    // Get the baseline snapshot
    const snapshot = await getCommerceBaseline(snapshotId);
    if (!snapshot) {
        throw new Error(`Baseline snapshot not found: ${snapshotId}`);
    }

    // Extract baseline value
    const baselineJson = snapshot.baselineJson as { netRevenueCents?: number; platform?: string };
    const baselineValueCents = baselineJson.netRevenueCents || 0;

    // Verify platform matches
    if (baselineJson.platform !== platform) {
        throw new Error(`Baseline platform mismatch: expected ${platform}, got ${baselineJson.platform}`);
    }

    // Calculate target total
    const targetTotalCents = baselineValueCents + targetDeltaCents;

    // Insert contract terms
    const [terms] = await db.insert(salesContractTerms).values({
        contractId,
        provider: 'stripe', // Schema enum
        metric,
        windowDays,
        baselineSnapshotId: snapshotId,
        baselineValueCents,
        targetDeltaCents,
        targetTotalCents,
        qualifiedRulesJson: {
            platform,
            excludeRefunds: true,
            excludeCancellations: true,
            requireFulfillment: true,
        },
        executedAt: new Date(),
    }).returning();

    // Emit ledger event
    await appendEvent({
        eventType: EventType.COMMERCE_TARGET_LOCKED,
        userId: contract.principalUserId,
        contractId,
        metadata: {
            platform,
            snapshotId,
            baselineValueCents,
            targetDeltaCents,
            targetTotalCents,
            metric,
            windowDays,
        },
    });

    return terms;
}

/**
 * Get commerce terms for a contract
 */
export async function getCommerceTerms(
    contractId: string
): Promise<SalesContractTerms | null> {
    const [terms] = await db
        .select()
        .from(salesContractTerms)
        .where(eq(salesContractTerms.contractId, contractId))
        .limit(1);

    return terms || null;
}

// =============================================================================
// VERIFICATION
// =============================================================================

/**
 * Enqueue a commerce verification run
 */
export async function enqueueCommerceVerification(
    contractId: string
): Promise<SalesVerificationRun> {
    // Get the contract
    const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, contractId))
        .limit(1);

    if (!contract) {
        throw new Error(`Contract not found: ${contractId}`);
    }

    // Check if already terminal
    if (await isContractTerminal(contractId)) {
        throw new Error(`Contract ${contractId} is already in terminal state`);
    }

    // Get commerce terms
    const terms = await getCommerceTerms(contractId);
    if (!terms) {
        throw new Error(`No commerce terms found for contract: ${contractId}`);
    }

    // Extract platform from terms
    const rulesJson = terms.qualifiedRulesJson as { platform?: string };
    const platform = rulesJson?.platform || 'shopify';

    // Insert verification run
    const [run] = await db.insert(salesVerificationRuns).values({
        contractId,
        provider: 'stripe', // Schema enum
        status: 'queued',
        attempt: 1,
    }).returning();

    // Emit ledger event
    await appendEvent({
        eventType: EventType.SALES_VERIFICATION_QUEUED,
        userId: contract.principalUserId,
        contractId,
        metadata: {
            runId: run.id,
            platform,
        },
    });

    return run;
}

/**
 * Process a commerce verification run
 */
export async function processCommerceVerification(
    runId: string
): Promise<{ success: boolean; passed?: boolean; error?: string }> {
    // Get the verification run
    const [run] = await db
        .select()
        .from(salesVerificationRuns)
        .where(eq(salesVerificationRuns.id, runId))
        .limit(1);

    if (!run) {
        return { success: false, error: `Verification run not found: ${runId}` };
    }

    // Skip if already processed
    if (run.status === 'ok' || run.status === 'error') {
        return { success: true, passed: run.status === 'ok' };
    }

    // Mark as running
    await db.update(salesVerificationRuns)
        .set({ status: 'running', startedAt: new Date() })
        .where(eq(salesVerificationRuns.id, runId));

    try {
        // Get contract
        const [contract] = await db
            .select()
            .from(contracts)
            .where(eq(contracts.id, run.contractId))
            .limit(1);

        if (!contract) {
            throw new Error(`Contract not found: ${run.contractId}`);
        }

        // Check if already terminal
        if (await isContractTerminal(run.contractId)) {
            await db.update(salesVerificationRuns)
                .set({
                    status: 'error',
                    finishedAt: new Date(),
                    errorMessage: 'Contract already in terminal state',
                })
                .where(eq(salesVerificationRuns.id, runId));
            return { success: false, error: 'Contract already in terminal state' };
        }

        // Get commerce terms
        const terms = await getCommerceTerms(run.contractId);
        if (!terms) {
            throw new Error(`No commerce terms for contract: ${run.contractId}`);
        }

        // Get baseline
        const snapshot = await getCommerceBaseline(terms.baselineSnapshotId);
        if (!snapshot) {
            throw new Error(`Baseline snapshot not found: ${terms.baselineSnapshotId}`);
        }

        // Extract platform
        const rulesJson = terms.qualifiedRulesJson as { platform?: string };
        const platform = (rulesJson?.platform || 'shopify') as CommercePlatform;
        const adapter = getAdapter(platform);

        // Calculate window
        const windowStart = terms.executedAt;
        const windowEnd = contract.deadlineUtc;

        // Evaluate
        const result = await adapter.evaluate(
            contract.principalUserId,
            terms.baselineValueCents,
            terms.targetDeltaCents,
            windowStart,
            windowEnd
        );

        // Update verification run
        const finalStatus = result.pass ? 'ok' : 'error';
        await db.update(salesVerificationRuns)
            .set({
                status: finalStatus,
                finishedAt: new Date(),
                resultJson: result,
            })
            .where(eq(salesVerificationRuns.id, runId));

        // Emit appropriate ledger event
        const eventType = result.pass
            ? EventType.COMMERCE_VERIFIED_SUCCESS
            : EventType.COMMERCE_VERIFIED_FAIL;

        await appendEvent({
            eventType,
            userId: contract.principalUserId,
            contractId: run.contractId,
            metadata: {
                runId,
                platform,
                passed: result.pass,
                currentRevenueCents: result.currentRevenueCents,
                deltaCents: result.deltaCents,
                targetDeltaCents: result.targetDeltaCents,
                evidence: result.evidence,
            },
        });

        return { success: true, passed: result.pass };

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);

        await db.update(salesVerificationRuns)
            .set({
                status: 'error',
                finishedAt: new Date(),
                errorMessage,
            })
            .where(eq(salesVerificationRuns.id, runId));

        return { success: false, error: errorMessage };
    }
}

/**
 * Get latest verification run for a contract
 */
export async function getLatestCommerceVerification(
    contractId: string
): Promise<SalesVerificationRun | null> {
    const [run] = await db
        .select()
        .from(salesVerificationRuns)
        .where(eq(salesVerificationRuns.contractId, contractId))
        .orderBy(desc(salesVerificationRuns.createdAt))
        .limit(1);

    return run || null;
}

/**
 * Health check for commerce platform
 */
export async function checkCommerceHealth(
    userId: string,
    platform: CommercePlatform
): Promise<{ ok: boolean; platform: string; shop?: string }> {
    const adapter = getAdapter(platform);
    const result = await adapter.healthCheck(userId);
    return { ...result, platform };
}

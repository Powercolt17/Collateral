/**
 * Sales Service - Stripe Revenue Tracking
 * 
 * Business logic for sales baselines, terms, and verification.
 * Uses Stripe payment data (via existing integration) for revenue tracking.
 * 
 * NOTE: Authorize.net support has been removed. This service now
 * uses Stripe as the revenue source.
 * 
 * INVARIANTS:
 * - Baselines are immutable once created
 * - Terms are immutable once attached
 * - All state changes emit ledger events
 */

import { db } from '../db/client.js';
import {
    salesBaselineSnapshots,
    salesContractTerms,
    salesVerificationRuns,
    contractIndex,
    type SalesBaselineSnapshot,
    type SalesContractTerms,
    type SalesVerificationRun,
    type NewSalesBaselineSnapshot,
    type NewSalesContractTerms,
    type NewSalesVerificationRun,
} from '../db/schema.js';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { appendEvent } from './ledger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface CreateBaselineParams {
    userId: string;
    windowDays?: number;
}

export interface AttachTermsParams {
    contractId: string;
    snapshotId: string;
    metric: 'net_settled_amount';
    windowDays: number;
    targetDeltaCents: number;
}

// Terminal states - once in these, contract is done
const TERMINAL_EVENTS = [
    'SETTLED_SUCCESS',
    'SETTLED_FAILURE',
    'CONTRACT_FORFEITED',
    'CONTRACT_SETTLED',
];

/**
 * Check if a contract is already in a terminal state
 */
export async function isContractTerminal(contractId: string): Promise<boolean> {
    const [index] = await db
        .select({ lastEventType: contractIndex.lastEventType })
        .from(contractIndex)
        .where(eq(contractIndex.contractId, contractId))
        .limit(1);

    if (!index) return false;
    return TERMINAL_EVENTS.includes(index.lastEventType || '');
}

// =============================================================================
// BASELINE SNAPSHOTS (Stripe Revenue)
// =============================================================================

/**
 * Create a baseline snapshot using Stripe revenue data
 * 
 * TODO: Implement actual Stripe revenue fetching via existing integration
 * For now, creates a placeholder that can be filled with Stripe data
 */
export async function createBaselineSnapshot(
    params: CreateBaselineParams
): Promise<SalesBaselineSnapshot> {
    const { userId, windowDays = 30 } = params;

    // Compute window dates for baseline (look back from today)
    const windowEnd = new Date();
    const windowStart = new Date(windowEnd.getTime() - windowDays * 24 * 60 * 60 * 1000);

    // Normalize for determinism
    windowStart.setUTCHours(0, 0, 0, 0);
    windowEnd.setUTCHours(23, 59, 59, 999);

    // Check for existing snapshot (idempotency)
    const existing = await db
        .select()
        .from(salesBaselineSnapshots)
        .where(
            and(
                eq(salesBaselineSnapshots.userId, userId),
                eq(salesBaselineSnapshots.windowStartAt, windowStart),
                eq(salesBaselineSnapshots.windowEndAt, windowEnd)
            )
        )
        .limit(1);

    if (existing.length > 0) {
        return existing[0];
    }

    // TODO: Fetch actual Stripe revenue data via existing integration
    // For now, create baseline structure ready for Stripe data
    const metrics = {
        netSettledAmountCents: 0,
        txCount: 0,
        refundCount: 0,
        chargebackCount: 0,
        source: 'stripe',
        rawSummary: {
            windowStart: windowStart.toISOString(),
            windowEnd: windowEnd.toISOString(),
            fetchedAt: new Date().toISOString(),
            note: 'Stripe revenue integration pending',
        },
    };

    const newSnapshot: NewSalesBaselineSnapshot = {
        userId,
        provider: 'stripe',
        windowDays,
        windowStartAt: windowStart,
        windowEndAt: windowEnd,
        baselineJson: metrics as any,
    };

    const [snapshot] = await db
        .insert(salesBaselineSnapshots)
        .values(newSnapshot)
        .returning();

    return snapshot;
}

/**
 * Get baseline snapshot by ID
 */
export async function getBaselineSnapshot(
    snapshotId: string
): Promise<SalesBaselineSnapshot | null> {
    const [snapshot] = await db
        .select()
        .from(salesBaselineSnapshots)
        .where(eq(salesBaselineSnapshots.id, snapshotId));

    return snapshot || null;
}

// =============================================================================
// CONTRACT TERMS
// =============================================================================

/**
 * Attach sales terms to a contract
 * 
 * GUARDRAIL: Once attached, cannot be changed
 */
export async function attachSalesTerms(
    params: AttachTermsParams
): Promise<SalesContractTerms> {
    const { contractId, snapshotId, metric, windowDays, targetDeltaCents } = params;

    // Check if terms already exist (immutability guard)
    const existing = await db
        .select()
        .from(salesContractTerms)
        .where(eq(salesContractTerms.contractId, contractId))
        .limit(1);

    if (existing.length > 0) {
        throw new Error(`Contract ${contractId} already has sales terms attached`);
    }

    // Get snapshot
    const snapshot = await getBaselineSnapshot(snapshotId);
    if (!snapshot) {
        throw new Error(`Snapshot ${snapshotId} not found`);
    }

    // Get baseline value from snapshot
    const baselineJson = snapshot.baselineJson as { netSettledAmountCents: number };
    const baselineValueCents = baselineJson.netSettledAmountCents;
    const targetTotalCents = baselineValueCents + targetDeltaCents;

    const newTerms: NewSalesContractTerms = {
        contractId,
        provider: 'stripe',
        metric,
        windowDays,
        baselineSnapshotId: snapshotId,
        baselineValueCents,
        targetDeltaCents,
        targetTotalCents,
        qualifiedRulesJson: {
            excludeRefunds: true,
            excludeChargebacks: true,
            onlySucceeded: true,
        },
        executedAt: new Date(),
    };

    const [terms] = await db
        .insert(salesContractTerms)
        .values(newTerms)
        .returning();

    // Emit ledger event
    await appendEvent({
        contractId,
        actor: 'SYSTEM',
        eventType: 'SALES_TERMS_ATTACHED' as any,
        metadata: {
            snapshotId,
            provider: 'stripe',
            metric,
            baselineValueCents,
            targetDeltaCents,
            targetTotalCents,
        },
    });

    return terms;
}

/**
 * Get sales terms for a contract
 */
export async function getSalesTerms(
    contractId: string
): Promise<SalesContractTerms | null> {
    const [terms] = await db
        .select()
        .from(salesContractTerms)
        .where(eq(salesContractTerms.contractId, contractId));

    return terms || null;
}

// =============================================================================
// VERIFICATION
// =============================================================================

/**
 * Enqueue a verification run
 */
export async function enqueueVerification(
    contractId: string
): Promise<SalesVerificationRun> {
    // Check if already terminal
    if (await isContractTerminal(contractId)) {
        throw new Error(`Contract ${contractId} is already in a terminal state`);
    }

    // Get terms
    const terms = await getSalesTerms(contractId);
    if (!terms) {
        throw new Error(`No sales terms found for contract ${contractId}`);
    }

    const newRun: NewSalesVerificationRun = {
        contractId,
        provider: 'stripe',
        status: 'queued',
        attempt: 1,
    };

    const [run] = await db
        .insert(salesVerificationRuns)
        .values(newRun)
        .returning();

    // Emit ledger event
    await appendEvent({
        contractId,
        actor: 'SYSTEM',
        eventType: 'SALES_VERIFICATION_QUEUED' as any,
        metadata: {
            runId: run.id,
            provider: 'stripe',
            attempt: 1,
        },
    });

    return run;
}

/**
 * Get latest verification run for a contract
 */
export async function getLatestVerificationRun(
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
 * Process a verification run using Stripe data
 * 
 * TODO: Implement Stripe revenue verification
 */
export async function processVerificationRun(
    runId: string
): Promise<{ success: boolean; passed?: boolean; error?: string }> {
    const [run] = await db
        .select()
        .from(salesVerificationRuns)
        .where(eq(salesVerificationRuns.id, runId));

    if (!run) {
        return { success: false, error: 'Run not found' };
    }

    // Check if contract is already terminal (idempotency)
    if (await isContractTerminal(run.contractId)) {
        return { success: true, passed: undefined }; // Already settled
    }

    if (run.status !== 'queued') {
        return { success: false, error: `Run already processed: ${run.status}` };
    }

    // Mark as running
    await db
        .update(salesVerificationRuns)
        .set({ status: 'running', startedAt: new Date() })
        .where(eq(salesVerificationRuns.id, runId));

    try {
        const terms = await getSalesTerms(run.contractId);
        if (!terms) {
            throw new Error('No sales terms found');
        }

        // Compute window
        const windowStart = new Date(terms.executedAt);
        const windowEnd = new Date(
            terms.executedAt.getTime() + terms.windowDays * 24 * 60 * 60 * 1000
        );

        // TODO: Fetch actual Stripe revenue in window
        // For now, placeholder metrics
        const metrics = {
            netSettledAmountCents: 0,
            txCount: 0,
            refundCount: 0,
            source: 'stripe',
        };

        const passed = metrics.netSettledAmountCents >= terms.targetTotalCents;

        await db
            .update(salesVerificationRuns)
            .set({
                status: 'ok',
                finishedAt: new Date(),
                resultJson: {
                    ...metrics,
                    targetTotalCents: terms.targetTotalCents,
                    passed,
                },
            })
            .where(eq(salesVerificationRuns.id, runId));

        // Emit ledger event
        await appendEvent({
            contractId: run.contractId,
            actor: 'SYSTEM',
            eventType: 'SALES_VERIFICATION_COMPUTED' as any,
            amountUsdCents: metrics.netSettledAmountCents,
            metadata: {
                runId,
                passed,
                netSettledAmountCents: metrics.netSettledAmountCents,
                targetTotalCents: terms.targetTotalCents,
                windowStartAt: windowStart.toISOString(),
                windowEndAt: windowEnd.toISOString(),
            },
        });

        // Check if window ended - trigger settlement
        const now = new Date();
        if (now >= windowEnd) {
            const settlementRef = `sales-settlement:${run.contractId}:${runId}`;
            const terminalEvent = passed ? 'SETTLED_SUCCESS' : 'SETTLED_FAILURE';

            await appendEvent({
                contractId: run.contractId,
                actor: 'SYSTEM',
                eventType: terminalEvent as any,
                externalRef: settlementRef,
                amountUsdCents: metrics.netSettledAmountCents,
                metadata: {
                    source: 'sales_verification',
                    runId,
                    passed,
                },
            });
        }

        return { success: true, passed };
    } catch (error) {
        await db
            .update(salesVerificationRuns)
            .set({
                status: 'error',
                finishedAt: new Date(),
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
            } as any)
            .where(eq(salesVerificationRuns.id, runId));

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

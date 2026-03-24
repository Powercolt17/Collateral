// @ts-nocheck
/**
 * Rivalry Metric Tracker
 * 
 * Polls provider APIs for active rivalries and writes metric snapshots.
 * Also handles baseline snapshots when rivalries become ACTIVE (BOTH_FUNDED).
 * 
 * Called by the scheduler on a regular cadence (every 5 minutes).
 */

import { db } from '../db/client.js';
import {
    rivalries, rivalryParticipants, rivalryMetricSnapshots,
    connectedAccounts, rivalryLedgerEvents, RivalryEventType
} from '../db/schema.js';
import { eq, and, isNotNull, isNull, sql } from 'drizzle-orm';
import { getRivalryState, appendRivalryEvent } from '../services/rivalry.js';
import { randomUUID } from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

interface TrackerResult {
    processed: number;
    snapshotsTaken: number;
    baselinesSet: number;
    errors: number;
    skipped: number;
}

// =============================================================================
// METRIC FETCHERS
// =============================================================================

/**
 * Fetch the current metric value for a user on a given platform.
 * Reuses the same connected_accounts infrastructure as the oracle.
 */
async function fetchRivalryMetric(
    userId: string,
    platform: string,
    metricKey: string,
): Promise<{ value: number; rawJson: any } | null> {
    try {
        // Find user's connected account for this platform
        const [account] = await db
            .select()
            .from(connectedAccounts)
            .where(
                and(
                    eq(connectedAccounts.userId, userId),
                    eq(connectedAccounts.platform, platform),
                    eq(connectedAccounts.status, 'ACTIVE'),
                )
            )
            .limit(1);

        if (!account) {
            console.log(`[RivalryTracker] No active ${platform} account for user ${userId}`);
            return null;
        }

        if (platform === 'X') {
            try {
                const { getXClient } = await import('../adapters/x-client.js');
                const client = getXClient();
                const followers = await client.getFollowers(account.externalAccountId);
                return { value: followers, rawJson: { followers, accountId: account.externalAccountId } };
            } catch (err: any) {
                console.error(`[RivalryTracker] X fetch error: ${err.message}`);
                return null;
            }
        }

        if (platform === 'STRIPE') {
            // Stripe: fetch balance or net volume via Stripe API
            // For rivalries, we track total revenue from connected account
            try {
                const { default: Stripe } = await import('stripe');
                const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
                const balance = await stripe.balance.retrieve({
                    stripeAccount: account.externalAccountId,
                });
                const available = balance.available.reduce((sum, b) => sum + b.amount, 0);
                return { value: available / 100, rawJson: balance };
            } catch (err: any) {
                console.error(`[RivalryTracker] Stripe fetch error: ${err.message}`);
                return null;
            }
        }

        if (platform === 'SHOPIFY') {
            // Shopify: fetch order totals
            try {
                const shop = account.externalAccountId;
                const token = account.accessToken;
                if (!token) return null;

                const res = await fetch(`https://${shop}/admin/api/2024-01/orders/count.json?status=any`, {
                    headers: { 'X-Shopify-Access-Token': token },
                });
                const data = await res.json();
                return { value: data.count || 0, rawJson: data };
            } catch (err: any) {
                console.error(`[RivalryTracker] Shopify fetch error: ${err.message}`);
                return null;
            }
        }

        if (platform === 'AMAZON') {
            // Amazon: simplified — uses stored order count or API
            console.log(`[RivalryTracker] Amazon metric fetch not yet implemented`);
            return null;
        }

        console.log(`[RivalryTracker] Unknown platform: ${platform}`);
        return null;

    } catch (err: any) {
        console.error(`[RivalryTracker] Fetch error for ${platform}: ${err.message}`);
        return null;
    }
}

// =============================================================================
// BASELINE SNAPSHOT
// =============================================================================

/**
 * Take baseline snapshots for a rivalry that just became BOTH_FUNDED.
 * Called once when both sides fund — captures the starting metric values.
 */
async function snapshotBaselines(rivalryId: string): Promise<boolean> {
    const [rivalry] = await db.select().from(rivalries).where(eq(rivalries.id, rivalryId));
    if (!rivalry) return false;

    const participants = await db
        .select()
        .from(rivalryParticipants)
        .where(eq(rivalryParticipants.rivalryId, rivalryId));

    let success = true;

    for (const participant of participants) {
        // Skip if baseline already set
        if (participant.baselineValue != null) continue;

        const result = await fetchRivalryMetric(
            participant.userId,
            rivalry.platform,
            rivalry.metricKey,
        );

        if (result) {
            const hash = require('crypto')
                .createHash('sha256')
                .update(JSON.stringify(result.rawJson))
                .digest('hex')
                .slice(0, 16);

            await db.update(rivalryParticipants)
                .set({
                    baselineValue: String(result.value),
                    baselineJson: result.rawJson,
                    baselineSnapshotAt: new Date(),
                    baselineHash: hash,
                })
                .where(eq(rivalryParticipants.id, participant.id));

            // Also write initial metric snapshot
            await db.insert(rivalryMetricSnapshots).values({
                rivalryId,
                userId: participant.userId,
                provider: rivalry.platform,
                metricKey: rivalry.metricKey,
                metricValue: String(result.value),
                fetchedAt: new Date(),
                requestId: randomUUID(),
                rawPayloadHash: hash,
            });

            console.log(`[RivalryTracker] Baseline set for ${participant.role} in ${rivalryId}: ${result.value}`);
        } else {
            console.error(`[RivalryTracker] Failed to snapshot baseline for ${participant.role} in ${rivalryId}`);
            success = false;
        }
    }

    // If all baselines set, activate the rivalry
    const allSet = await db
        .select()
        .from(rivalryParticipants)
        .where(and(
            eq(rivalryParticipants.rivalryId, rivalryId),
            isNotNull(rivalryParticipants.baselineValue),
        ))
        .then(rows => rows.length === participants.length);

    if (allSet) {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + rivalry.durationDays);

        await db.update(rivalries)
            .set({
                activatedAt: new Date(),
                deadlineUtc: deadline,
                updatedAt: new Date(),
            })
            .where(eq(rivalries.id, rivalryId));

        await appendRivalryEvent(rivalryId, {
            actor: 'SYSTEM',
            eventType: RivalryEventType.RIVALRY_ACTIVATED,
            metadata: {
                activatedAt: new Date().toISOString(),
                deadlineUtc: deadline.toISOString(),
            },
        });

        console.log(`[RivalryTracker] Rivalry ${rivalryId} ACTIVATED — deadline ${deadline.toISOString()}`);
    }

    return success;
}

// =============================================================================
// PERIODIC METRIC REFRESH
// =============================================================================

/**
 * Refresh metrics for all active rivalries.
 * Takes a snapshot of each participant's current metric value.
 */
async function refreshActiveRivalryMetrics(): Promise<{ snapshots: number; errors: number }> {
    let snapshots = 0;
    let errors = 0;

    // Find all active rivalries (have activatedAt, no settledAt, past deadline check is separate)
    const activeRivalries = await db
        .select()
        .from(rivalries)
        .where(
            and(
                isNotNull(rivalries.activatedAt),
                isNull(rivalries.settledAt),
            )
        );

    for (const rivalry of activeRivalries) {
        const participants = await db
            .select()
            .from(rivalryParticipants)
            .where(eq(rivalryParticipants.rivalryId, rivalry.id));

        for (const participant of participants) {
            const result = await fetchRivalryMetric(
                participant.userId,
                rivalry.platform,
                rivalry.metricKey,
            );

            if (result) {
                const hash = require('crypto')
                    .createHash('sha256')
                    .update(JSON.stringify(result.rawJson))
                    .digest('hex')
                    .slice(0, 16);

                await db.insert(rivalryMetricSnapshots).values({
                    rivalryId: rivalry.id,
                    userId: participant.userId,
                    provider: rivalry.platform,
                    metricKey: rivalry.metricKey,
                    metricValue: String(result.value),
                    fetchedAt: new Date(),
                    requestId: randomUUID(),
                    rawPayloadHash: hash,
                });

                snapshots++;
            } else {
                errors++;
            }
        }
    }

    return { snapshots, errors };
}

// =============================================================================
// MAIN JOB RUNNER
// =============================================================================

/**
 * Run the full rivalry tracking job:
 * 1. Snapshot baselines for newly-funded rivalries
 * 2. Refresh metrics for active rivalries
 */
export async function runRivalryTrackerJob(): Promise<TrackerResult> {
    console.log('[RivalryTracker] Starting rivalry tracker job...');
    const startTime = Date.now();

    let processed = 0;
    let snapshotsTaken = 0;
    let baselinesSet = 0;
    let errorCount = 0;
    let skipped = 0;

    // 1. Find rivalries that are BOTH_FUNDED but not yet ACTIVATED (need baselines)
    const fundedNotActivated = await db
        .select()
        .from(rivalries)
        .where(
            and(
                isNotNull(rivalries.fundedAt),
                isNull(rivalries.activatedAt),
                isNull(rivalries.settledAt),
            )
        );

    for (const rivalry of fundedNotActivated) {
        processed++;
        const success = await snapshotBaselines(rivalry.id);
        if (success) baselinesSet++;
        else errorCount++;
    }

    // 2. Refresh metrics for active rivalries
    const { snapshots, errors } = await refreshActiveRivalryMetrics();
    snapshotsTaken += snapshots;
    errorCount += errors;
    processed += snapshots + errors;

    const duration = Date.now() - startTime;
    console.log(`[RivalryTracker] Complete in ${duration}ms — baselines: ${baselinesSet}, snapshots: ${snapshotsTaken}, errors: ${errorCount}`);

    return {
        processed,
        snapshotsTaken,
        baselinesSet,
        errors: errorCount,
        skipped,
    };
}

// @ts-nocheck
/**
 * Rivalry Cron Jobs
 * 
 * Handles automated rivalry lifecycle tasks:
 * 1. Auto-settle rivalries past their deadline
 * 2. Expire unanswered challenges (72h TTL)
 * 3. Cancel unfunded rivalries after acceptance (48h TTL)
 * 
 * Safe to run every minute. Idempotent.
 */

import { db } from '../db/client.js';
import { rivalries } from '../db/schema.js';
import { eq, and, isNotNull, isNull, lte, sql } from 'drizzle-orm';
import { settleRivalry } from '../services/rivalry-settlement.js';
import { expireStaleRivalries, cancelUnfundedRivalries, getRivalryState } from '../services/rivalry.js';

// =============================================================================
// TYPES
// =============================================================================

interface RivalryCronResult {
    settled: number;
    expired: number;
    cancelled: number;
    errors: number;
}

// =============================================================================
// AUTO-SETTLEMENT
// =============================================================================

/**
 * Find active rivalries past their deadline and trigger settlement.
 * 
 * Settlement flow:
 * 1. Find rivalries where deadline_utc <= NOW() and settled_at IS NULL
 * 2. For each, check state is ACTIVE/BOTH_FUNDED/VERIFYING/VERIFIED
 * 3. Trigger settleRivalry() which compares growth and determines winner
 */
async function autoSettleExpiredRivalries(): Promise<{ settled: number; errors: number }> {
    let settled = 0;
    let errors = 0;

    const now = new Date();

    // Find rivalries past deadline, activated but not settled
    const pastDeadline = await db
        .select()
        .from(rivalries)
        .where(
            and(
                isNotNull(rivalries.activatedAt),
                isNull(rivalries.settledAt),
                isNotNull(rivalries.deadlineUtc),
                lte(rivalries.deadlineUtc, now),
            )
        );

    console.log(`[RivalryCron] Found ${pastDeadline.length} rivalries past deadline`);

    for (const rivalry of pastDeadline) {
        try {
            // Skip simulated rivalries — their lifecycle is managed by sim-progress job
            const simCheck = await db.execute(
                sql`
                    SELECT 1 FROM users WHERE id = ${rivalry.challengerUserId} AND email LIKE '%@collateral.internal' LIMIT 1
                `
            );
            const simRows = (simCheck as any).rows || simCheck;
            if (simRows && simRows.length > 0) {
                console.log(`[RivalryCron] Skipping simulated rivalry ${rivalry.id}`);
                continue;
            }

            const state = await getRivalryState(rivalry.id);

            // Only settle if in an active/verified state
            if (['ACTIVE', 'BOTH_FUNDED', 'VERIFYING', 'VERIFIED'].includes(state)) {
                console.log(`[RivalryCron] Auto-settling rivalry ${rivalry.id} (state: ${state})...`);
                const result = await settleRivalry(rivalry.id);

                if (result.success) {
                    settled++;
                    console.log(`[RivalryCron] Settled ${rivalry.id}: ${result.outcome} — winner: ${result.winnerId || 'DRAW'}`);
                } else {
                    errors++;
                    console.error(`[RivalryCron] Settlement failed for ${rivalry.id}: ${result.error}`);
                }
            } else {
                console.log(`[RivalryCron] Skipping ${rivalry.id} — state ${state} not settleable`);
            }
        } catch (err: any) {
            errors++;
            console.error(`[RivalryCron] Error settling ${rivalry.id}:`, err.message);
        }
    }

    return { settled, errors };
}

// =============================================================================
// MAIN CRON RUNNER
// =============================================================================

/**
 * Run all rivalry cron tasks:
 * 1. Auto-settle past-deadline rivalries
 * 2. Expire stale challenges (72h unanswered)
 * 3. Cancel unfunded rivalries (48h after acceptance)
 */
export async function runRivalryCronJobs(): Promise<RivalryCronResult> {
    console.log('[RivalryCron] Starting rivalry cron jobs...');
    const startTime = Date.now();

    let settled = 0;
    let expired = 0;
    let cancelled = 0;
    let errorCount = 0;

    // 1. Auto-settle past-deadline rivalries
    try {
        const settlement = await autoSettleExpiredRivalries();
        settled = settlement.settled;
        errorCount += settlement.errors;
    } catch (err: any) {
        console.error('[RivalryCron] Auto-settlement error:', err.message);
        errorCount++;
    }

    // 2. Expire stale challenges (72h TTL)
    try {
        expired = await expireStaleRivalries();
        if (expired > 0) {
            console.log(`[RivalryCron] Expired ${expired} stale challenges`);
        }
    } catch (err: any) {
        console.error('[RivalryCron] Challenge expiry error:', err.message);
        errorCount++;
    }

    // 3. Cancel unfunded rivalries (48h after acceptance)
    try {
        cancelled = await cancelUnfundedRivalries();
        if (cancelled > 0) {
            console.log(`[RivalryCron] Cancelled ${cancelled} unfunded rivalries`);
        }
    } catch (err: any) {
        console.error('[RivalryCron] Unfunded cancellation error:', err.message);
        errorCount++;
    }

    const duration = Date.now() - startTime;
    console.log(`[RivalryCron] Complete in ${duration}ms — settled: ${settled}, expired: ${expired}, cancelled: ${cancelled}, errors: ${errorCount}`);

    return { settled, expired, cancelled, errors: errorCount };
}

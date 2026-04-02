// @ts-nocheck
/**
 * Rivalry Settlement Service
 * 
 * Target-based settlement for head-to-head duels.
 * 
 * Both participants face the SAME growth target.
 * Settlement compares each player's growth against the shared target.
 * 
 * Settlement rules (12% platform fee on all outcomes):
 *   Both hit target  → DRAW (stakes returned minus 12% platform fee)
 *   One hits target  → WINNER takes pool (minus 12% fee)
 *   Both miss target → BOTH_MISS (protocol keeps entire pool)
 * 
 * State is NEVER stored — derived from ledger events.
 */

import { db, type DbLike } from '../db/client.js';
import { eq, and } from 'drizzle-orm';
import {
    rivalries, rivalryParticipants, accountLedgerEvents,
    RivalryStatus, RivalryEventType,
    type Rivalry, type RivalryParticipant,
} from '../db/schema.js';
import {
    getRivalryState, getRivalryEvents, appendRivalryEvent,
} from './rivalry.js';
import { validateRivalryFromState } from './rivalry-state-derivation.js';

// =============================================================================
// SETTLEMENT TYPES
// =============================================================================

export interface RivalrySettlementResult {
    success: boolean;
    outcome: 'WIN' | 'DRAW' | 'BOTH_MISS' | null;
    winnerId: string | null;
    loserId: string | null;
    challengerGrowthPct: number;
    opponentGrowthPct: number;
    targetGrowthPct: number;
    challengerHitTarget: boolean;
    opponentHitTarget: boolean;
    winnerPayoutCents: number;
    protocolFeeCents: number;
    error?: string;
}

// =============================================================================
// SETTLEMENT LOGIC
// =============================================================================

/**
 * Compute growth percentage for a participant
 */
function computeGrowthPct(baseline: number, final: number): number {
    if (baseline === 0) {
        // Zero baseline: use absolute delta as proxy
        return final > 0 ? final : 0;
    }
    return ((final - baseline) / Math.abs(baseline)) * 100;
}

/**
 * Determine outcome based on target comparison
 * 
 * Same bar. Same rules. Same clock.
 */
function determineOutcome(
    challengerGrowth: number,
    opponentGrowth: number,
    targetPct: number,
): { outcome: 'CHALLENGER_WINS' | 'OPPONENT_WINS' | 'DRAW' | 'BOTH_MISS' } {
    const challengerHit = challengerGrowth >= targetPct;
    const opponentHit = opponentGrowth >= targetPct;

    if (challengerHit && opponentHit) {
        return { outcome: 'DRAW' };
    }
    if (challengerHit && !opponentHit) {
        return { outcome: 'CHALLENGER_WINS' };
    }
    if (!challengerHit && opponentHit) {
        return { outcome: 'OPPONENT_WINS' };
    }
    // Both missed
    return { outcome: 'BOTH_MISS' };
}

/**
 * Settle a rivalry
 * 
 * From-state: VERIFIED (or SETTLING if retrying)
 * Appends: RIVALRY_SETTLEMENT_STARTED, then RIVALRY_SETTLED or RIVALRY_DRAW
 * To-state: SETTLED or DRAW
 */
export async function settleRivalry(
    rivalryId: string,
    txClient?: DbLike,
): Promise<RivalrySettlementResult> {
    const client = txClient || db;
    const emptyResult = (error: string): RivalrySettlementResult => ({
        success: false, outcome: null, winnerId: null, loserId: null,
        challengerGrowthPct: 0, opponentGrowthPct: 0, targetGrowthPct: 0,
        challengerHitTarget: false, opponentHitTarget: false,
        winnerPayoutCents: 0, protocolFeeCents: 0, error,
    });

    // Get rivalry record
    const [rivalry] = await client.select().from(rivalries).where(eq(rivalries.id, rivalryId));
    if (!rivalry) return emptyResult('Rivalry not found');

    // Validate state
    const state = await getRivalryState(rivalryId, client);
    validateRivalryFromState(state, [RivalryStatus.VERIFIED, RivalryStatus.SETTLING], 'settle rivalry');

    // Get participants
    const participants = await client
        .select()
        .from(rivalryParticipants)
        .where(eq(rivalryParticipants.rivalryId, rivalryId));

    const challenger = participants.find(p => p.role === 'challenger');
    const opponent = participants.find(p => p.role === 'opponent');

    if (!challenger || !opponent) return emptyResult('Missing participant records');

    // Ensure both have final values
    if (challenger.finalValue === null || opponent.finalValue === null) {
        return emptyResult('Both sides must have final measurements');
    }

    // Append SETTLEMENT_STARTED if not already in SETTLING
    if (state !== RivalryStatus.SETTLING) {
        await appendRivalryEvent(rivalryId, {
            actor: 'SYSTEM',
            eventType: RivalryEventType.RIVALRY_SETTLEMENT_STARTED,
            externalRef: `rivalry:${rivalryId}:settlement_started`,
        }, client);
    }

    // Compute growth percentages
    const challengerBaseline = parseFloat(String(challenger.baselineValue || 0));
    const challengerFinal = parseFloat(String(challenger.finalValue));
    const opponentBaseline = parseFloat(String(opponent.baselineValue || 0));
    const opponentFinal = parseFloat(String(opponent.finalValue));

    const challengerGrowthPct = computeGrowthPct(challengerBaseline, challengerFinal);
    const opponentGrowthPct = computeGrowthPct(opponentBaseline, opponentFinal);

    // Get target from rivalry record
    const targetGrowthPct = parseFloat(String(rivalry.targetGrowthPct || 15));
    const challengerHitTarget = challengerGrowthPct >= targetGrowthPct;
    const opponentHitTarget = opponentGrowthPct >= targetGrowthPct;

    // Determine outcome against target
    const { outcome } = determineOutcome(challengerGrowthPct, opponentGrowthPct, targetGrowthPct);

    // Calculate payouts
    const pool = rivalry.stakePerSideCents * 2;
    const protocolFeeBps = rivalry.protocolFeeBps || 1200;

    try {
        await db.transaction(async (tx) => {
            if (outcome === 'DRAW') {
                // ═══ BOTH HIT TARGET ═══
                // Platform fee applied, remainder split back evenly
                const drawFeeCents = Math.floor(pool * protocolFeeBps / 10000);
                const remainingPool = pool - drawFeeCents;
                const returnPerSide = Math.floor(remainingPool / 2);

                // Return capital (minus fee share) to challenger
                await tx.insert(accountLedgerEvents).values({
                    userId: challenger.userId,
                    eventType: 'CAPITAL_UNLOCKED',
                    amountCents: rivalry.stakePerSideCents,
                    idempotencyKey: `rivalry:${rivalryId}:challenger:draw_unlock`,
                    metadata: { rivalryId, outcome: 'DRAW', targetGrowthPct, challengerGrowthPct },
                }).onConflictDoNothing();

                // Deduct fee from challenger's side
                const feePerSide = rivalry.stakePerSideCents - returnPerSide;
                if (feePerSide > 0) {
                    await tx.insert(accountLedgerEvents).values({
                        userId: challenger.userId,
                        eventType: 'SETTLEMENT_LOSS',
                        amountCents: feePerSide,
                        idempotencyKey: `rivalry:${rivalryId}:challenger:draw_fee`,
                        metadata: { rivalryId, outcome: 'DRAW', platformFee: true, feeBps: protocolFeeBps },
                    }).onConflictDoNothing();
                }

                // Return capital (minus fee share) to opponent
                await tx.insert(accountLedgerEvents).values({
                    userId: opponent.userId,
                    eventType: 'CAPITAL_UNLOCKED',
                    amountCents: rivalry.stakePerSideCents,
                    idempotencyKey: `rivalry:${rivalryId}:opponent:draw_unlock`,
                    metadata: { rivalryId, outcome: 'DRAW', targetGrowthPct, opponentGrowthPct },
                }).onConflictDoNothing();

                if (feePerSide > 0) {
                    await tx.insert(accountLedgerEvents).values({
                        userId: opponent.userId,
                        eventType: 'SETTLEMENT_LOSS',
                        amountCents: feePerSide,
                        idempotencyKey: `rivalry:${rivalryId}:opponent:draw_fee`,
                        metadata: { rivalryId, outcome: 'DRAW', platformFee: true, feeBps: protocolFeeBps },
                    }).onConflictDoNothing();
                }

                // Update participant outcomes
                await tx.update(rivalryParticipants)
                    .set({ outcome: 'DRAW', payoutCents: returnPerSide, absoluteDelta: String(challengerFinal - challengerBaseline), percentageDelta: String(challengerGrowthPct) })
                    .where(and(eq(rivalryParticipants.rivalryId, rivalryId), eq(rivalryParticipants.role, 'challenger')));

                await tx.update(rivalryParticipants)
                    .set({ outcome: 'DRAW', payoutCents: returnPerSide, absoluteDelta: String(opponentFinal - opponentBaseline), percentageDelta: String(opponentGrowthPct) })
                    .where(and(eq(rivalryParticipants.rivalryId, rivalryId), eq(rivalryParticipants.role, 'opponent')));

                // Append DRAW event
                await appendRivalryEvent(rivalryId, {
                    actor: 'SYSTEM',
                    eventType: RivalryEventType.RIVALRY_DRAW,
                    externalRef: `rivalry:${rivalryId}:draw`,
                    metadata: {
                        challengerGrowthPct, opponentGrowthPct, targetGrowthPct,
                        challengerHitTarget, opponentHitTarget,
                        protocolFeeCents: drawFeeCents, returnPerSide,
                    },
                }, tx);

                // Update rivalry record
                await tx.update(rivalries)
                    .set({
                        settledAt: new Date(),
                        settlementMetadata: {
                            outcome: 'DRAW', challengerGrowthPct, opponentGrowthPct,
                            targetGrowthPct, challengerHitTarget, opponentHitTarget,
                            protocolFeeCents: drawFeeCents,
                        },
                        updatedAt: new Date(),
                    })
                    .where(eq(rivalries.id, rivalryId));

            } else if (outcome === 'BOTH_MISS') {
                // ═══ BOTH MISSED TARGET ═══
                // Protocol keeps entire pool — neither gets capital back
                const protocolRevenue = pool;
                const lockAmountCents = rivalry.stakePerSideCents;

                // Unlock then Loss for challenger
                await tx.insert(accountLedgerEvents).values({
                    userId: challenger.userId,
                    eventType: 'CAPITAL_UNLOCKED',
                    amountCents: lockAmountCents,
                    idempotencyKey: `rivalry:${rivalryId}:challenger:both_miss_unlock`,
                    metadata: { rivalryId, outcome: 'BOTH_MISS' },
                }).onConflictDoNothing();

                await tx.insert(accountLedgerEvents).values({
                    userId: challenger.userId,
                    eventType: 'SETTLEMENT_LOSS',
                    amountCents: lockAmountCents,
                    idempotencyKey: `rivalry:${rivalryId}:challenger:both_miss_loss`,
                    metadata: { rivalryId, outcome: 'BOTH_MISS', targetGrowthPct, actualGrowth: challengerGrowthPct },
                }).onConflictDoNothing();

                // Unlock then Loss for opponent
                await tx.insert(accountLedgerEvents).values({
                    userId: opponent.userId,
                    eventType: 'CAPITAL_UNLOCKED',
                    amountCents: lockAmountCents,
                    idempotencyKey: `rivalry:${rivalryId}:opponent:both_miss_unlock`,
                    metadata: { rivalryId, outcome: 'BOTH_MISS' },
                }).onConflictDoNothing();

                await tx.insert(accountLedgerEvents).values({
                    userId: opponent.userId,
                    eventType: 'SETTLEMENT_LOSS',
                    amountCents: lockAmountCents,
                    idempotencyKey: `rivalry:${rivalryId}:opponent:both_miss_loss`,
                    metadata: { rivalryId, outcome: 'BOTH_MISS', targetGrowthPct, actualGrowth: opponentGrowthPct },
                }).onConflictDoNothing();

                // Update participant outcomes
                await tx.update(rivalryParticipants)
                    .set({ outcome: 'BOTH_MISS', payoutCents: 0, absoluteDelta: String(challengerFinal - challengerBaseline), percentageDelta: String(challengerGrowthPct) })
                    .where(and(eq(rivalryParticipants.rivalryId, rivalryId), eq(rivalryParticipants.role, 'challenger')));

                await tx.update(rivalryParticipants)
                    .set({ outcome: 'BOTH_MISS', payoutCents: 0, absoluteDelta: String(opponentFinal - opponentBaseline), percentageDelta: String(opponentGrowthPct) })
                    .where(and(eq(rivalryParticipants.rivalryId, rivalryId), eq(rivalryParticipants.role, 'opponent')));

                // Append SETTLED event (both_miss is a type of settlement)
                await appendRivalryEvent(rivalryId, {
                    actor: 'SYSTEM',
                    eventType: RivalryEventType.RIVALRY_SETTLED,
                    amountUsdCents: protocolRevenue,
                    externalRef: `rivalry:${rivalryId}:both_miss`,
                    metadata: {
                        outcome: 'BOTH_MISS',
                        challengerGrowthPct, opponentGrowthPct, targetGrowthPct,
                        challengerHitTarget: false, opponentHitTarget: false,
                        protocolRevenue,
                    },
                }, tx);

                // Update rivalry record
                await tx.update(rivalries)
                    .set({
                        settledAt: new Date(),
                        settlementMetadata: {
                            outcome: 'BOTH_MISS',
                            challengerGrowthPct, opponentGrowthPct, targetGrowthPct,
                            challengerHitTarget: false, opponentHitTarget: false,
                            protocolRevenue,
                        },
                        updatedAt: new Date(),
                    })
                    .where(eq(rivalries.id, rivalryId));

            } else {
                // ═══ ONE HIT, ONE MISSED ═══
                // Winner gets pool minus protocol fee
                const winnerId = outcome === 'CHALLENGER_WINS' ? challenger.userId : opponent.userId;
                const loserId = outcome === 'CHALLENGER_WINS' ? opponent.userId : challenger.userId;
                const winnerRole = outcome === 'CHALLENGER_WINS' ? 'challenger' : 'opponent';
                const loserRole = outcome === 'CHALLENGER_WINS' ? 'opponent' : 'challenger';
                const protocolFeeCents = Math.floor(pool * protocolFeeBps / 10000);
                const winnerPayout = pool - protocolFeeCents;
                const lockAmountCents = rivalry.stakePerSideCents;
                const profitCents = winnerPayout - lockAmountCents;

                // Unlock for winner
                await tx.insert(accountLedgerEvents).values({
                    userId: winnerId,
                    eventType: 'CAPITAL_UNLOCKED',
                    amountCents: lockAmountCents,
                    idempotencyKey: `rivalry:${rivalryId}:${winnerRole}:unlock`,
                    metadata: { rivalryId, outcome: 'WIN' },
                }).onConflictDoNothing();

                // Add profit to balance
                if (profitCents > 0) {
                    await tx.insert(accountLedgerEvents).values({
                        userId: winnerId,
                        eventType: 'SETTLEMENT_WIN',
                        amountCents: profitCents,
                        idempotencyKey: `rivalry:${rivalryId}:${winnerRole}:win`,
                        metadata: { rivalryId, outcome: 'WIN', targetGrowthPct },
                    }).onConflictDoNothing();
                }

                // Queue Payout for winner for FULL payout
                await tx.insert(accountLedgerEvents).values({
                    userId: winnerId,
                    eventType: 'PAYOUT_QUEUED',
                    amountCents: winnerPayout,
                    idempotencyKey: `rivalry:${rivalryId}:${winnerRole}:payout_queued`,
                    metadata: { rivalryId, outcome: 'WIN', targetGrowthPct, payoutQueued: true },
                }).onConflictDoNothing();

                // Unlock then Loss for loser (no capital returned)
                await tx.insert(accountLedgerEvents).values({
                    userId: loserId,
                    eventType: 'CAPITAL_UNLOCKED',
                    amountCents: lockAmountCents,
                    idempotencyKey: `rivalry:${rivalryId}:${loserRole}:unlock`,
                    metadata: { rivalryId, outcome: 'LOSS' },
                }).onConflictDoNothing();

                await tx.insert(accountLedgerEvents).values({
                    userId: loserId,
                    eventType: 'SETTLEMENT_LOSS',
                    amountCents: lockAmountCents,
                    idempotencyKey: `rivalry:${rivalryId}:${loserRole}:loss`,
                    metadata: { rivalryId, outcome: 'LOSS', targetGrowthPct },
                }).onConflictDoNothing();

                // Update participant outcomes
                const winnerGrowth = outcome === 'CHALLENGER_WINS' ? challengerGrowthPct : opponentGrowthPct;
                const loserGrowth = outcome === 'CHALLENGER_WINS' ? opponentGrowthPct : challengerGrowthPct;
                const winnerBaseline = outcome === 'CHALLENGER_WINS' ? challengerBaseline : opponentBaseline;
                const winnerFinalVal = outcome === 'CHALLENGER_WINS' ? challengerFinal : opponentFinal;
                const loserBaseline = outcome === 'CHALLENGER_WINS' ? opponentBaseline : challengerBaseline;
                const loserFinalVal = outcome === 'CHALLENGER_WINS' ? opponentFinal : challengerFinal;

                await tx.update(rivalryParticipants)
                    .set({ outcome: 'WIN', payoutCents: winnerPayout, absoluteDelta: String(winnerFinalVal - winnerBaseline), percentageDelta: String(winnerGrowth) })
                    .where(and(eq(rivalryParticipants.rivalryId, rivalryId), eq(rivalryParticipants.role, winnerRole)));

                await tx.update(rivalryParticipants)
                    .set({ outcome: 'LOSS', payoutCents: 0, absoluteDelta: String(loserFinalVal - loserBaseline), percentageDelta: String(loserGrowth) })
                    .where(and(eq(rivalryParticipants.rivalryId, rivalryId), eq(rivalryParticipants.role, loserRole)));

                // Append SETTLED event
                await appendRivalryEvent(rivalryId, {
                    actor: 'SYSTEM',
                    eventType: RivalryEventType.RIVALRY_SETTLED,
                    amountUsdCents: winnerPayout,
                    externalRef: `rivalry:${rivalryId}:settled`,
                    metadata: {
                        winnerId, loserId, winnerRole, outcome,
                        challengerGrowthPct, opponentGrowthPct, targetGrowthPct,
                        challengerHitTarget, opponentHitTarget,
                        protocolFeeCents, winnerPayout,
                    },
                }, tx);

                // Update rivalry record
                await tx.update(rivalries)
                    .set({
                        winnerUserId: winnerId,
                        settledAt: new Date(),
                        settlementMetadata: {
                            outcome: 'WIN', winnerId, loserId,
                            challengerGrowthPct, opponentGrowthPct, targetGrowthPct,
                            challengerHitTarget, opponentHitTarget,
                            protocolFeeCents, winnerPayout,
                        },
                        updatedAt: new Date(),
                    })
                    .where(eq(rivalries.id, rivalryId));
            }
        });

        const protocolFeeCents = outcome === 'DRAW' ? Math.floor(pool * protocolFeeBps / 10000)
            : outcome === 'BOTH_MISS' ? pool
            : Math.floor(pool * protocolFeeBps / 10000);

        return {
            success: true,
            outcome: outcome === 'DRAW' ? 'DRAW' : outcome === 'BOTH_MISS' ? 'BOTH_MISS' : 'WIN',
            winnerId: (outcome === 'DRAW' || outcome === 'BOTH_MISS') ? null : (outcome === 'CHALLENGER_WINS' ? challenger.userId : opponent.userId),
            loserId: (outcome === 'DRAW' || outcome === 'BOTH_MISS') ? null : (outcome === 'CHALLENGER_WINS' ? opponent.userId : challenger.userId),
            challengerGrowthPct,
            opponentGrowthPct,
            targetGrowthPct,
            challengerHitTarget,
            opponentHitTarget,
            winnerPayoutCents: (outcome === 'DRAW' || outcome === 'BOTH_MISS') ? 0 : (pool - Math.floor(pool * protocolFeeBps / 10000)),
            protocolFeeCents,
        };
    } catch (err: any) {
        return {
            success: false, outcome: null, winnerId: null, loserId: null,
            challengerGrowthPct, opponentGrowthPct, targetGrowthPct,
            challengerHitTarget, opponentHitTarget,
            winnerPayoutCents: 0, protocolFeeCents: 0, error: err.message,
        };
    }
}

// @ts-nocheck
/**
 * Rivalry Settlement Service
 * 
 * Handles settlement after verification for head-to-head duels.
 * 
 * Unlike standard contract settlement (pass/fail against threshold),
 * rivalry settlement COMPARES relative improvement between two operators
 * to determine a winner.
 * 
 * Settlement formula:
 *   growth_pct = ((final - baseline) / baseline) * 100
 *   winner = participant with higher growth_pct
 *   tie margin = 0.5% (configurable)
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
    TIE_MARGIN_PCT,
} from './rivalry.js';
import { validateRivalryFromState } from './rivalry-state-derivation.js';

// =============================================================================
// SETTLEMENT TYPES
// =============================================================================

export interface RivalrySettlementResult {
    success: boolean;
    outcome: 'WIN' | 'DRAW' | null;
    winnerId: string | null;
    loserId: string | null;
    challengerGrowthPct: number;
    opponentGrowthPct: number;
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
 * Determine winner based on growth comparison
 */
function determineOutcome(
    challengerGrowth: number,
    opponentGrowth: number,
    tieMargin: number = TIE_MARGIN_PCT
): { outcome: 'CHALLENGER_WINS' | 'OPPONENT_WINS' | 'DRAW' } {
    const diff = Math.abs(challengerGrowth - opponentGrowth);

    if (diff <= tieMargin) {
        return { outcome: 'DRAW' };
    }

    if (challengerGrowth > opponentGrowth) {
        return { outcome: 'CHALLENGER_WINS' };
    }

    return { outcome: 'OPPONENT_WINS' };
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

    // Get rivalry record
    const [rivalry] = await client.select().from(rivalries).where(eq(rivalries.id, rivalryId));
    if (!rivalry) {
        return { success: false, outcome: null, winnerId: null, loserId: null, challengerGrowthPct: 0, opponentGrowthPct: 0, winnerPayoutCents: 0, protocolFeeCents: 0, error: 'Rivalry not found' };
    }

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

    if (!challenger || !opponent) {
        return { success: false, outcome: null, winnerId: null, loserId: null, challengerGrowthPct: 0, opponentGrowthPct: 0, winnerPayoutCents: 0, protocolFeeCents: 0, error: 'Missing participant records' };
    }

    // Ensure both have final values
    if (challenger.finalValue === null || opponent.finalValue === null) {
        return { success: false, outcome: null, winnerId: null, loserId: null, challengerGrowthPct: 0, opponentGrowthPct: 0, winnerPayoutCents: 0, protocolFeeCents: 0, error: 'Both sides must have final measurements' };
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

    // Determine outcome
    const { outcome } = determineOutcome(challengerGrowthPct, opponentGrowthPct);

    // Calculate payouts
    const pool = rivalry.stakePerSideCents * 2;
    const protocolFeeCents = Math.floor(pool * rivalry.protocolFeeBps / 10000);

    try {
        await db.transaction(async (tx) => {
            if (outcome === 'DRAW') {
                // DRAW: return capital to both, minus protocol fee from each
                const feePerSide = Math.floor(protocolFeeCents / 2);
                const returnPerSide = rivalry.stakePerSideCents - feePerSide;

                // Return capital to challenger
                await tx.insert(accountLedgerEvents).values({
                    userId: challenger.userId,
                    eventType: 'CAPITAL_UNLOCKED',
                    amountCents: returnPerSide,
                    idempotencyKey: `rivalry:${rivalryId}:challenger:draw_return`,
                    metadata: { rivalryId, outcome: 'DRAW' },
                }).onConflictDoNothing();

                // Return capital to opponent
                await tx.insert(accountLedgerEvents).values({
                    userId: opponent.userId,
                    eventType: 'CAPITAL_UNLOCKED',
                    amountCents: returnPerSide,
                    idempotencyKey: `rivalry:${rivalryId}:opponent:draw_return`,
                    metadata: { rivalryId, outcome: 'DRAW' },
                }).onConflictDoNothing();

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
                        challengerGrowthPct,
                        opponentGrowthPct,
                        margin: Math.abs(challengerGrowthPct - opponentGrowthPct),
                        protocolFeeCents,
                        returnPerSide,
                    },
                }, tx);

                // Update rivalry record
                await tx.update(rivalries)
                    .set({
                        settledAt: new Date(),
                        settlementMetadata: { outcome: 'DRAW', challengerGrowthPct, opponentGrowthPct, protocolFeeCents },
                        updatedAt: new Date(),
                    })
                    .where(eq(rivalries.id, rivalryId));

            } else {
                // WIN/LOSS: winner gets pool minus protocol fee
                const winnerId = outcome === 'CHALLENGER_WINS' ? challenger.userId : opponent.userId;
                const loserId = outcome === 'CHALLENGER_WINS' ? opponent.userId : challenger.userId;
                const winnerRole = outcome === 'CHALLENGER_WINS' ? 'challenger' : 'opponent';
                const loserRole = outcome === 'CHALLENGER_WINS' ? 'opponent' : 'challenger';
                const winnerPayout = pool - protocolFeeCents;

                // Payout to winner
                await tx.insert(accountLedgerEvents).values({
                    userId: winnerId,
                    eventType: 'SETTLEMENT_WIN',
                    amountCents: winnerPayout,
                    idempotencyKey: `rivalry:${rivalryId}:${winnerRole}:win`,
                    metadata: { rivalryId, outcome: 'WIN' },
                }).onConflictDoNothing();

                // Loss event for loser (no capital returned)
                await tx.insert(accountLedgerEvents).values({
                    userId: loserId,
                    eventType: 'SETTLEMENT_LOSS',
                    amountCents: 0,
                    idempotencyKey: `rivalry:${rivalryId}:${loserRole}:loss`,
                    metadata: { rivalryId, outcome: 'LOSS' },
                }).onConflictDoNothing();

                // Update participant outcomes
                const winnerGrowth = outcome === 'CHALLENGER_WINS' ? challengerGrowthPct : opponentGrowthPct;
                const loserGrowth = outcome === 'CHALLENGER_WINS' ? opponentGrowthPct : challengerGrowthPct;
                const winnerBaseline = outcome === 'CHALLENGER_WINS' ? challengerBaseline : opponentBaseline;
                const winnerFinal = outcome === 'CHALLENGER_WINS' ? challengerFinal : opponentFinal;
                const loserBaseline = outcome === 'CHALLENGER_WINS' ? opponentBaseline : challengerBaseline;
                const loserFinal = outcome === 'CHALLENGER_WINS' ? opponentFinal : challengerFinal;

                await tx.update(rivalryParticipants)
                    .set({ outcome: 'WIN', payoutCents: winnerPayout, absoluteDelta: String(winnerFinal - winnerBaseline), percentageDelta: String(winnerGrowth) })
                    .where(and(eq(rivalryParticipants.rivalryId, rivalryId), eq(rivalryParticipants.role, winnerRole)));

                await tx.update(rivalryParticipants)
                    .set({ outcome: 'LOSS', payoutCents: 0, absoluteDelta: String(loserFinal - loserBaseline), percentageDelta: String(loserGrowth) })
                    .where(and(eq(rivalryParticipants.rivalryId, rivalryId), eq(rivalryParticipants.role, loserRole)));

                // Append SETTLED event
                await appendRivalryEvent(rivalryId, {
                    actor: 'SYSTEM',
                    eventType: RivalryEventType.RIVALRY_SETTLED,
                    amountUsdCents: winnerPayout,
                    externalRef: `rivalry:${rivalryId}:settled`,
                    metadata: {
                        winnerId,
                        loserId,
                        winnerRole,
                        challengerGrowthPct,
                        opponentGrowthPct,
                        protocolFeeCents,
                        winnerPayout,
                    },
                }, tx);

                // Update rivalry record
                await tx.update(rivalries)
                    .set({
                        winnerUserId: winnerId,
                        settledAt: new Date(),
                        settlementMetadata: {
                            outcome: 'WIN',
                            winnerId,
                            loserId,
                            challengerGrowthPct,
                            opponentGrowthPct,
                            protocolFeeCents,
                            winnerPayout,
                        },
                        updatedAt: new Date(),
                    })
                    .where(eq(rivalries.id, rivalryId));
            }
        });

        return {
            success: true,
            outcome: outcome === 'DRAW' ? 'DRAW' : 'WIN',
            winnerId: outcome === 'DRAW' ? null : (outcome === 'CHALLENGER_WINS' ? challenger.userId : opponent.userId),
            loserId: outcome === 'DRAW' ? null : (outcome === 'CHALLENGER_WINS' ? opponent.userId : challenger.userId),
            challengerGrowthPct,
            opponentGrowthPct,
            winnerPayoutCents: outcome === 'DRAW' ? 0 : (pool - protocolFeeCents),
            protocolFeeCents,
        };
    } catch (err: any) {
        return {
            success: false,
            outcome: null,
            winnerId: null,
            loserId: null,
            challengerGrowthPct,
            opponentGrowthPct,
            winnerPayoutCents: 0,
            protocolFeeCents,
            error: err.message,
        };
    }
}

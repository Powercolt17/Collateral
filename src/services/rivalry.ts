// @ts-nocheck
/**
 * Rivalry Service
 * 
 * Manages rivalry lifecycle. State is NEVER stored — derived from ledger events.
 * Every meaningful action emits a rivalry ledger event with hash chaining.
 * 
 * Follows the same architecture as contracts.ts:
 * - Immutable records
 * - Append-only ledger
 * - State derived from events
 * - Hash-chained integrity
 */

import { db, type DbLike } from '../db/client.js';
import { createHash } from 'crypto';
import { eq, and, desc, asc, or, sql } from 'drizzle-orm';
import {
    rivalries, rivalryParticipants, rivalryLedgerEvents, rivalryMetricSnapshots,
    users, identities, accountLedgerEvents, connectedAccounts, notifications,
    RivalryStatus, RivalryEventType,
    type Rivalry, type NewRivalry,
    type RivalryLedgerEvent,
    type RivalryStatusType,
} from '../db/schema.js';
import {
    deriveRivalryState,
    validateRivalryNotTerminal,
    validateRivalryFromState,
    InvalidRivalryTransitionError,
} from './rivalry-state-derivation.js';

// =============================================================================
// CONSTANTS
// =============================================================================

export const MIN_RIVALRY_STAKE_CENTS = 10000;  // $100 minimum per side
export const MAX_RIVALRY_STAKE_CENTS = 10000000; // $100,000 maximum per side
export const DEFAULT_ACCEPTANCE_TTL_HOURS = 72;
export const DEFAULT_FUNDING_TTL_HOURS = 48;
export const DEFAULT_PROTOCOL_FEE_BPS = 200; // 2%
export const TIE_MARGIN_PCT = 0.5; // 0.5% — within this, it's a draw

// =============================================================================
// HELPERS
// =============================================================================

function canonicalJsonStringify(obj: unknown): string {
    return JSON.stringify(sortObjectKeys(obj));
}

function sortObjectKeys(obj: unknown): unknown {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(sortObjectKeys);
    if (typeof obj === 'object') {
        const sorted: Record<string, unknown> = {};
        for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
            sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
        }
        return sorted;
    }
    return obj;
}

function computeRivalryEventHash(payload: Record<string, unknown>): string {
    const canonical = canonicalJsonStringify(payload);
    return createHash('sha256').update(canonical).digest('hex');
}

// =============================================================================
// STATE DERIVATION
// =============================================================================

/**
 * Get rivalry ledger events in order
 */
export async function getRivalryEvents(rivalryId: string, txClient?: DbLike): Promise<RivalryLedgerEvent[]> {
    const client = txClient || db;
    return await client
        .select()
        .from(rivalryLedgerEvents)
        .where(eq(rivalryLedgerEvents.rivalryId, rivalryId))
        .orderBy(asc(rivalryLedgerEvents.timestampUtc));
}

/**
 * Derive current rivalry state
 */
export async function getRivalryState(rivalryId: string, txClient?: DbLike): Promise<RivalryStatusType | null> {
    const events = await getRivalryEvents(rivalryId, txClient);
    return deriveRivalryState(events);
}

/**
 * Get rivalry with derived state
 */
export async function getRivalryWithState(rivalryId: string) {
    const [rivalry] = await db.select().from(rivalries).where(eq(rivalries.id, rivalryId));
    if (!rivalry) return null;

    const state = await getRivalryState(rivalryId);
    const participants = await db.select().from(rivalryParticipants).where(eq(rivalryParticipants.rivalryId, rivalryId));

    return { rivalry, state, participants };
}

// =============================================================================
// APPEND RIVALRY EVENT
// =============================================================================

/**
 * Append a hash-chained event to the rivalry ledger
 */
export async function appendRivalryEvent(
    rivalryId: string,
    options: {
        actor: 'SYSTEM' | 'USER';
        eventType: string;
        userId?: string;
        amountUsdCents?: number;
        externalRef?: string;
        metadata?: Record<string, unknown>;
    },
    txClient?: DbLike
): Promise<{ success: boolean; error?: string; eventId?: string }> {
    const client = txClient || db;

    try {
        // Get prev event for hash chaining
        const [prevEvent] = await client
            .select()
            .from(rivalryLedgerEvents)
            .where(eq(rivalryLedgerEvents.rivalryId, rivalryId))
            .orderBy(desc(rivalryLedgerEvents.timestampUtc))
            .limit(1);

        const prevHash = prevEvent?.eventHash || null;

        const hashPayload = {
            rivalryId,
            actor: options.actor,
            eventType: options.eventType,
            userId: options.userId || null,
            amountUsdCents: options.amountUsdCents || null,
            externalRef: options.externalRef || null,
            metadata: options.metadata || null,
            prevEventHash: prevHash,
            timestamp: new Date().toISOString(),
        };

        const eventHash = computeRivalryEventHash(hashPayload);

        const [inserted] = await client
            .insert(rivalryLedgerEvents)
            .values({
                rivalryId,
                actor: options.actor,
                eventType: options.eventType,
                userId: options.userId || null,
                amountUsdCents: options.amountUsdCents || null,
                externalRef: options.externalRef || null,
                metadataJson: options.metadata || null,
                prevEventHash: prevHash,
                eventHash,
            })
            .returning();

        return { success: true, eventId: inserted.id };
    } catch (err: any) {
        // Idempotency: duplicate externalRef
        if (err?.code === '23505' && err?.constraint?.includes('external_ref')) {
            return { success: true, error: 'duplicate_event' };
        }
        return { success: false, error: err.message };
    }
}

// =============================================================================
// CREATE RIVALRY (Issue Challenge)
// =============================================================================

export interface CreateRivalryParams {
    challengerUserId: string;
    opponentUsername: string;
    platform: string;
    metricType: string;
    metricKey: string;
    stakePerSideCents: number;
    durationDays: number;
}

export async function createRivalry(params: CreateRivalryParams): Promise<Rivalry> {
    const {
        challengerUserId, opponentUsername, platform, metricType,
        metricKey, stakePerSideCents, durationDays,
    } = params;

    // Validate stake
    if (stakePerSideCents < MIN_RIVALRY_STAKE_CENTS) {
        throw new Error(`Minimum stake is $${MIN_RIVALRY_STAKE_CENTS / 100}`);
    }
    if (stakePerSideCents > MAX_RIVALRY_STAKE_CENTS) {
        throw new Error(`Maximum stake is $${MAX_RIVALRY_STAKE_CENTS / 100}`);
    }

    // Validate duration
    if (![7, 14, 30, 90].includes(durationDays)) {
        throw new Error('Duration must be 7, 14, 30, or 90 days');
    }

    // Find opponent by username
    const [opponentIdentity] = await db
        .select()
        .from(identities)
        .where(eq(identities.username, opponentUsername.replace('@', '')));

    if (!opponentIdentity) {
        throw new Error(`Opponent @${opponentUsername} not found`);
    }

    if (opponentIdentity.userId === challengerUserId) {
        throw new Error('Cannot challenge yourself');
    }

    // Validate challenger has the required provider connected
    const [challengerAccount] = await db
        .select()
        .from(connectedAccounts)
        .where(
            and(
                eq(connectedAccounts.userId, challengerUserId),
                eq(connectedAccounts.platform, platform),
                eq(connectedAccounts.status, 'ACTIVE'),
            )
        )
        .limit(1);

    if (!challengerAccount) {
        const platformName = platform.charAt(0) + platform.slice(1).toLowerCase();
        throw new Error(`You must connect ${platformName} before issuing a ${metricType.toLowerCase()} challenge`);
    }

    // Create rivalry atomically
    const result = await db.transaction(async (tx) => {
        // Insert rivalry record
        const [rivalry] = await tx
            .insert(rivalries)
            .values({
                challengerUserId,
                opponentUserId: opponentIdentity.userId,
                platform: platform as any,
                metricType: metricType as any,
                metricKey,
                stakePerSideCents,
                durationDays,
                acceptanceTtlHours: DEFAULT_ACCEPTANCE_TTL_HOURS,
                fundingTtlHours: DEFAULT_FUNDING_TTL_HOURS,
                protocolFeeBps: DEFAULT_PROTOCOL_FEE_BPS,
            })
            .returning();

        // Create participant records
        await tx.insert(rivalryParticipants).values([
            { rivalryId: rivalry.id, userId: challengerUserId, role: 'challenger' },
            { rivalryId: rivalry.id, userId: opponentIdentity.userId, role: 'opponent' },
        ]);

        // Append RIVALRY_CREATED event
        await appendRivalryEvent(rivalry.id, {
            actor: 'USER',
            eventType: RivalryEventType.RIVALRY_CREATED,
            userId: challengerUserId,
            amountUsdCents: stakePerSideCents,
            externalRef: `rivalry:${rivalry.id}:created`,
            metadata: {
                challengerUserId,
                opponentUserId: opponentIdentity.userId,
                opponentUsername: opponentIdentity.username,
                platform,
                metricType,
                metricKey,
                stakePerSideCents,
                durationDays,
            },
        }, tx);

        return rivalry;
    });

    // Emit notification to opponent (outside tx — non-critical)
    try {
        const [challengerIdentity] = await db.select().from(identities).where(eq(identities.userId, challengerUserId));
        const challengerName = challengerIdentity?.username || 'An operator';
        const stake = `$${(stakePerSideCents / 100).toLocaleString()}`;

        await db.insert(notifications).values({
            userId: opponentIdentity.userId,
            type: 'RIVALRY_CHALLENGE',
            title: `⚔️ @${challengerName} challenged you`,
            body: `${metricType} duel · ${stake} per side · ${durationDays} days`,
            link: `/rivalry/${result.id}`,
            metadata: { rivalryId: result.id, challengerUserId, platform, metricType, stakePerSideCents },
        });
    } catch (err) {
        console.error('[rivalry] Failed to emit challenge notification:', err);
    }

    return result;
}

// =============================================================================
// ACCEPT / DECLINE
// =============================================================================

export async function acceptRivalry(rivalryId: string, userId: string): Promise<void> {
    const state = await getRivalryState(rivalryId);
    validateRivalryFromState(state, [RivalryStatus.CHALLENGE_ISSUED], 'accept rivalry');

    const [rivalry] = await db.select().from(rivalries).where(eq(rivalries.id, rivalryId));
    if (!rivalry) throw new Error('Rivalry not found');
    if (rivalry.opponentUserId !== userId) throw new Error('Only the opponent can accept');

    // Check TTL
    const expiresAt = new Date(rivalry.challengeIssuedAt.getTime() + rivalry.acceptanceTtlHours * 3600000);
    if (new Date() > expiresAt) {
        // Auto-expire
        await appendRivalryEvent(rivalryId, {
            actor: 'SYSTEM',
            eventType: RivalryEventType.RIVALRY_EXPIRED,
            externalRef: `rivalry:${rivalryId}:expired`,
        });
        throw new Error('Challenge has expired');
    }

    await db.transaction(async (tx) => {
        await tx
            .update(rivalries)
            .set({ acceptedAt: new Date(), updatedAt: new Date() })
            .where(eq(rivalries.id, rivalryId));

        await appendRivalryEvent(rivalryId, {
            actor: 'USER',
            eventType: RivalryEventType.RIVALRY_ACCEPTED,
            userId,
            externalRef: `rivalry:${rivalryId}:accepted`,
        }, tx);
    });
}

export async function declineRivalry(rivalryId: string, userId: string): Promise<void> {
    const state = await getRivalryState(rivalryId);
    validateRivalryFromState(state, [RivalryStatus.CHALLENGE_ISSUED], 'decline rivalry');

    const [rivalry] = await db.select().from(rivalries).where(eq(rivalries.id, rivalryId));
    if (!rivalry) throw new Error('Rivalry not found');
    if (rivalry.opponentUserId !== userId) throw new Error('Only the opponent can decline');

    await appendRivalryEvent(rivalryId, {
        actor: 'USER',
        eventType: RivalryEventType.RIVALRY_DECLINED,
        userId,
        externalRef: `rivalry:${rivalryId}:declined`,
    });
}

// =============================================================================
// FUND
// =============================================================================

export async function fundRivalry(rivalryId: string, userId: string): Promise<void> {
    const state = await getRivalryState(rivalryId);
    validateRivalryFromState(state, [RivalryStatus.CHALLENGE_ISSUED, RivalryStatus.ACCEPTED], 'fund rivalry');

    const [rivalry] = await db.select().from(rivalries).where(eq(rivalries.id, rivalryId));
    if (!rivalry) throw new Error('Rivalry not found');

    // Determine participant role
    let role: string;
    if (userId === rivalry.challengerUserId) role = 'challenger';
    else if (userId === rivalry.opponentUserId) role = 'opponent';
    else throw new Error('Not a participant in this rivalry');

    // Check not already funded
    const [participant] = await db
        .select()
        .from(rivalryParticipants)
        .where(and(
            eq(rivalryParticipants.rivalryId, rivalryId),
            eq(rivalryParticipants.userId, userId),
        ));

    if (!participant) throw new Error('Participant record not found');
    if (participant.funded) throw new Error('Already funded');

    await db.transaction(async (tx) => {
        const idempotencyKey = `rivalry:${rivalryId}:${role}:lock`;

        // Lock capital in account ledger
        const [lockEvent] = await tx
            .insert(accountLedgerEvents)
            .values({
                userId,
                eventType: 'CAPITAL_LOCKED',
                amountCents: -rivalry.stakePerSideCents,
                idempotencyKey,
                metadata: { rivalryId, role },
            })
            .onConflictDoNothing()
            .returning();

        // Update participant record
        await tx
            .update(rivalryParticipants)
            .set({
                funded: true,
                fundedAt: new Date(),
                lockEventId: lockEvent?.id || null,
            })
            .where(and(
                eq(rivalryParticipants.rivalryId, rivalryId),
                eq(rivalryParticipants.userId, userId),
            ));

        // Append funding event
        const eventType = role === 'challenger'
            ? RivalryEventType.RIVALRY_CHALLENGER_FUNDED
            : RivalryEventType.RIVALRY_OPPONENT_FUNDED;

        await appendRivalryEvent(rivalryId, {
            actor: 'USER',
            eventType,
            userId,
            amountUsdCents: rivalry.stakePerSideCents,
            externalRef: `rivalry:${rivalryId}:${role}:funded`,
        }, tx);

        // Check if both sides are now funded
        const allParticipants = await tx
            .select()
            .from(rivalryParticipants)
            .where(eq(rivalryParticipants.rivalryId, rivalryId));

        const allFunded = allParticipants.every(p => p.funded || p.userId === userId);

        if (allFunded) {
            await tx
                .update(rivalries)
                .set({ fundedAt: new Date(), updatedAt: new Date() })
                .where(eq(rivalries.id, rivalryId));

            await appendRivalryEvent(rivalryId, {
                actor: 'SYSTEM',
                eventType: RivalryEventType.RIVALRY_BOTH_FUNDED,
                amountUsdCents: rivalry.stakePerSideCents * 2,
                externalRef: `rivalry:${rivalryId}:both_funded`,
                metadata: { totalPoolCents: rivalry.stakePerSideCents * 2 },
            }, tx);
        }
    });
}

// =============================================================================
// LIST & QUERY
// =============================================================================

export async function listRivalries(options: {
    status?: string;
    userId?: string;
    limit?: number;
    offset?: number;
} = {}): Promise<{ rivalries: any[]; total: number }> {
    const { status, userId, limit = 20, offset = 0 } = options;

    let query = db.select().from(rivalries);

    if (userId) {
        query = query.where(
            or(
                eq(rivalries.challengerUserId, userId),
                eq(rivalries.opponentUserId, userId),
            )
        );
    }

    const allRivalries = await query
        .orderBy(desc(rivalries.createdAt))
        .limit(limit)
        .offset(offset);

    // Derive state for each and filter
    const results = [];
    for (const rivalry of allRivalries) {
        const state = await getRivalryState(rivalry.id);
        if (status && state !== status) continue;

        const participants = await db
            .select()
            .from(rivalryParticipants)
            .where(eq(rivalryParticipants.rivalryId, rivalry.id));

        // Get usernames
        const challengerIdentity = await db.select().from(identities).where(eq(identities.userId, rivalry.challengerUserId)).then(r => r[0]);
        const opponentIdentity = await db.select().from(identities).where(eq(identities.userId, rivalry.opponentUserId)).then(r => r[0]);

        results.push({
            ...rivalry,
            state,
            challengerUsername: challengerIdentity?.username || 'unknown',
            opponentUsername: opponentIdentity?.username || 'unknown',
            participants,
            poolCents: rivalry.stakePerSideCents * 2,
        });
    }

    return { rivalries: results, total: results.length };
}

export async function getRivalryDetail(rivalryId: string) {
    const result = await getRivalryWithState(rivalryId);
    if (!result) return null;

    const { rivalry, state, participants } = result;

    // Get usernames
    const challengerIdentity = await db.select().from(identities).where(eq(identities.userId, rivalry.challengerUserId)).then(r => r[0]);
    const opponentIdentity = await db.select().from(identities).where(eq(identities.userId, rivalry.opponentUserId)).then(r => r[0]);

    // Get events
    const events = await getRivalryEvents(rivalryId);

    // Get metric snapshots
    const metrics = await db
        .select()
        .from(rivalryMetricSnapshots)
        .where(eq(rivalryMetricSnapshots.rivalryId, rivalryId))
        .orderBy(asc(rivalryMetricSnapshots.fetchedAt));

    return {
        ...rivalry,
        state,
        challengerUsername: challengerIdentity?.username || 'unknown',
        opponentUsername: opponentIdentity?.username || 'unknown',
        participants,
        events,
        metrics,
        poolCents: rivalry.stakePerSideCents * 2,
    };
}

// =============================================================================
// EXPIRY JOB
// =============================================================================

/**
 * Expire rivalries whose acceptance TTL has passed
 */
export async function expireStaleRivalries(): Promise<number> {
    const allRivalries = await db.select().from(rivalries);
    let expired = 0;

    for (const rivalry of allRivalries) {
        const state = await getRivalryState(rivalry.id);
        if (state !== RivalryStatus.CHALLENGE_ISSUED) continue;

        const expiresAt = new Date(rivalry.challengeIssuedAt.getTime() + rivalry.acceptanceTtlHours * 3600000);
        if (new Date() > expiresAt) {
            await appendRivalryEvent(rivalry.id, {
                actor: 'SYSTEM',
                eventType: RivalryEventType.RIVALRY_EXPIRED,
                externalRef: `rivalry:${rivalry.id}:expired`,
            });
            expired++;
        }
    }

    return expired;
}

/**
 * Cancel rivalries whose funding TTL has passed after acceptance
 */
export async function cancelUnfundedRivalries(): Promise<number> {
    const allRivalries = await db.select().from(rivalries);
    let cancelled = 0;

    for (const rivalry of allRivalries) {
        const state = await getRivalryState(rivalry.id);
        if (state !== RivalryStatus.ACCEPTED) continue;

        const fundingDeadline = new Date(rivalry.acceptedAt!.getTime() + rivalry.fundingTtlHours * 3600000);
        if (new Date() > fundingDeadline) {
            await db.transaction(async (tx) => {
                // Return capital to any participant that funded
                const participants = await tx
                    .select()
                    .from(rivalryParticipants)
                    .where(eq(rivalryParticipants.rivalryId, rivalry.id));

                for (const p of participants) {
                    if (p.funded) {
                        await tx.insert(accountLedgerEvents).values({
                            userId: p.userId,
                            eventType: 'CAPITAL_UNLOCKED',
                            amountCents: rivalry.stakePerSideCents,
                            idempotencyKey: `rivalry:${rivalry.id}:${p.role}:refund`,
                            metadata: { rivalryId: rivalry.id, reason: 'funding_timeout' },
                        }).onConflictDoNothing();

                        await appendRivalryEvent(rivalry.id, {
                            actor: 'SYSTEM',
                            eventType: RivalryEventType.RIVALRY_CAPITAL_RETURNED,
                            userId: p.userId,
                            amountUsdCents: rivalry.stakePerSideCents,
                            externalRef: `rivalry:${rivalry.id}:${p.role}:capital_returned`,
                        }, tx);
                    }
                }

                await appendRivalryEvent(rivalry.id, {
                    actor: 'SYSTEM',
                    eventType: RivalryEventType.RIVALRY_CANCELLED,
                    externalRef: `rivalry:${rivalry.id}:cancelled:funding_timeout`,
                    metadata: { reason: 'funding_timeout' },
                }, tx);
            });
            cancelled++;
        }
    }

    return cancelled;
}

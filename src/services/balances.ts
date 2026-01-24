/**
 * Balance Derivation Service
 * 
 * Computes user balances from account_ledger_events (single source of truth).
 * All balance changes are append-only ledger events.
 */

import { db } from '../db/client.js';
import { accountLedgerEvents } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export interface Balances {
    availableCents: number;
    lockedCents: number;
    pendingPayoutCents: number;
}

// Account ledger event types
export const AccountEventType = {
    FUNDS_ADDED: 'FUNDS_ADDED',
    CAPITAL_LOCKED: 'CAPITAL_LOCKED',
    CAPITAL_UNLOCKED: 'CAPITAL_UNLOCKED',
    SETTLEMENT_WIN: 'SETTLEMENT_WIN',
    SETTLEMENT_LOSS: 'SETTLEMENT_LOSS',
    PAYOUT_QUEUED: 'PAYOUT_QUEUED',
    PAYOUT_SENT: 'PAYOUT_SENT',
    PAYOUT_FAILED: 'PAYOUT_FAILED',
    DISPUTE_OPENED: 'DISPUTE_OPENED',
    DISPUTE_RESOLVED: 'DISPUTE_RESOLVED',
} as const;

export type AccountEventTypeType = typeof AccountEventType[keyof typeof AccountEventType];

/**
 * Compute derived balances for a user from ledger events.
 * 
 * Rules:
 * - Available = FUNDS_ADDED + CAPITAL_UNLOCKED + SETTLEMENT_WIN - CAPITAL_LOCKED - PAYOUT_SENT
 * - Locked = sum of CAPITAL_LOCKED for contracts still locked (not yet settled/unlocked)
 * - Pending Payout = PAYOUT_QUEUED - PAYOUT_SENT
 */
export async function computeBalances(userId: string): Promise<Balances> {
    try {
        // Get all events for user in a single query with aggregation
        const result = await db.execute(sql`
            SELECT 
                COALESCE(SUM(CASE WHEN event_type = 'FUNDS_ADDED' THEN amount_cents ELSE 0 END), 0) as funds_added,
                COALESCE(SUM(CASE WHEN event_type = 'CAPITAL_LOCKED' THEN amount_cents ELSE 0 END), 0) as capital_locked,
                COALESCE(SUM(CASE WHEN event_type = 'CAPITAL_UNLOCKED' THEN amount_cents ELSE 0 END), 0) as capital_unlocked,
                COALESCE(SUM(CASE WHEN event_type = 'SETTLEMENT_WIN' THEN amount_cents ELSE 0 END), 0) as settlement_win,
                COALESCE(SUM(CASE WHEN event_type = 'SETTLEMENT_LOSS' THEN amount_cents ELSE 0 END), 0) as settlement_loss,
                COALESCE(SUM(CASE WHEN event_type = 'PAYOUT_QUEUED' THEN amount_cents ELSE 0 END), 0) as payout_queued,
                COALESCE(SUM(CASE WHEN event_type = 'PAYOUT_SENT' THEN amount_cents ELSE 0 END), 0) as payout_sent
            FROM account_ledger_events
            WHERE user_id = ${userId}
        `);

        const row = result.rows[0] as any || {};

        const fundsAdded = Number(row.funds_added) || 0;
        const capitalLocked = Number(row.capital_locked) || 0;
        const capitalUnlocked = Number(row.capital_unlocked) || 0;
        const settlementWin = Number(row.settlement_win) || 0;
        const payoutQueued = Number(row.payout_queued) || 0;
        const payoutSent = Number(row.payout_sent) || 0;

        // Compute derived balances
        const availableCents = fundsAdded + capitalUnlocked + settlementWin - capitalLocked - payoutSent;
        const lockedCents = capitalLocked - capitalUnlocked; // Net locked amount
        const pendingPayoutCents = payoutQueued - payoutSent;

        return {
            availableCents: Math.max(0, availableCents),
            lockedCents: Math.max(0, lockedCents),
            pendingPayoutCents: Math.max(0, pendingPayoutCents),
        };

    } catch (err: any) {
        console.error('[Balances] Error computing balances:', err.message);
        // Return zeros on error (graceful degradation)
        return {
            availableCents: 0,
            lockedCents: 0,
            pendingPayoutCents: 0,
        };
    }
}

/**
 * Append an event to the account ledger.
 * Idempotent via unique idempotency_key.
 */
export async function appendAccountEvent(params: {
    userId: string;
    contractId?: string;
    eventType: AccountEventTypeType;
    amountCents: number;
    idempotencyKey: string;
    metadata?: Record<string, any>;
}): Promise<{ id: string } | null> {
    try {
        const [inserted] = await db.insert(accountLedgerEvents).values({
            userId: params.userId,
            contractId: params.contractId,
            eventType: params.eventType,
            amountCents: params.amountCents,
            idempotencyKey: params.idempotencyKey,
            metadata: params.metadata,
        }).returning({ id: accountLedgerEvents.id });

        console.log(`[AccountLedger] Appended ${params.eventType}: ${params.amountCents} cents for user ${params.userId}`);
        return inserted;

    } catch (err: any) {
        // Unique constraint violation = idempotent skip
        if (err.code === '23505' || err.message?.includes('duplicate key')) {
            console.log(`[AccountLedger] Idempotent skip: ${params.idempotencyKey}`);
            return null;
        }
        throw err;
    }
}

/**
 * Ledger Service - Production-Quality Append-Only Hash-Chained Ledger
 *
 * This is the SINGLE SOURCE OF TRUTH for all contract state.
 *
 * IMMUTABILITY GUARDRAILS:
 * - This module exports ONLY appendEvent() for writes
 * - No updateEvent() or deleteEvent() functions exist
 * - ledger_events rows are NEVER modified or deleted
 * - All state is derived from ordered ledger events
 *
 * DB-level enforcement (recommended):
 * - REVOKE UPDATE, DELETE ON ledger_events FROM application_role;
 *
 * CHAIN ORDERING:
 * - Events are ordered by (timestampUtc ASC, id ASC) for deterministic sequence
 * - last element of getEventsForContract() is always the true chain head
 *
 * =============================================================================
 * CHAIN HEAD SEMANTICS (CRITICAL INVARIANT)
 * =============================================================================
 *
 * The "chain head" is the LAST APPENDED EVENT in ledger order for a contract.
 * This is determined by: ORDER BY (timestampUtc ASC, id ASC) → last element.
 *
 * IMPORTANT: ALL event types are part of the chain, including:
 * - Business events: CONTRACT_CREATED, FUNDS_LOCKED, SETTLED_SUCCESS, etc.
 * - Operational events: JOB_LOCK_ACQUIRED, RETRY_SCHEDULED
 * - Terminal events: SETTLED_SUCCESS, SETTLED_FAILURE, RECEIPT_ISSUED
 *
 * Receipts MUST capture the chain head hash at issuance time. This ensures:
 * - The receipt proves the complete event history up to that point
 * - Any subsequent events (including operational ones) create a new chain head
 * - Hash chain integrity is verifiable even with operational events
 *
 * DO NOT filter out operational events when computing chain head.
 * The chain is the COMPLETE, UNFILTERED sequence of all appended events.
 */
import { createHash } from 'crypto';
import { db } from '../db/client.js';
import { ledgerEvents, contractIndex, EventType, ContractStatus, } from '../db/schema.js';
import { eq, desc, and, or, lt, sql } from 'drizzle-orm';
// =============================================================================
// CANONICAL JSON SERIALIZATION
// =============================================================================
/**
 * Recursively sort object keys for deterministic JSON serialization.
 * This ensures identical objects produce identical hash inputs.
 */
function sortObjectKeys(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    }
    if (typeof obj === 'object') {
        const sorted = {};
        const keys = Object.keys(obj).sort();
        for (const key of keys) {
            sorted[key] = sortObjectKeys(obj[key]);
        }
        return sorted;
    }
    return obj;
}
/**
 * Produce canonical JSON string with sorted keys at all levels.
 */
function canonicalJsonStringify(obj) {
    return JSON.stringify(sortObjectKeys(obj));
}
/**
 * Compute event hash using SHA256.
 * Hash = SHA256(canonical JSON of full payload including prevEventHash).
 *
 * The payload includes ALL fields that define the event content,
 * ensuring any modification is detectable.
 */
function computeEventHash(payload) {
    const canonicalPayload = canonicalJsonStringify(payload);
    return createHash('sha256').update(canonicalPayload).digest('hex');
}
// =============================================================================
// EVENT STATE MAPPING (for contract_index updates)
// =============================================================================
const EVENT_TO_STATE = {
    [EventType.CONTRACT_CREATED]: ContractStatus.CREATED,
    [EventType.FUNDS_AUTHORIZED]: ContractStatus.FUNDS_AUTHORIZED,
    [EventType.FUNDS_LOCKED]: ContractStatus.FUNDS_LOCKED,
    [EventType.EXECUTION_CONFIRMED]: ContractStatus.LOCKED,
    [EventType.VERIFICATION_STARTED]: ContractStatus.VERIFYING,
    [EventType.VERIFICATION_SUCCEEDED]: ContractStatus.VERIFIED,
    [EventType.VERIFICATION_FAILED]: ContractStatus.VERIFIED,
    [EventType.CONTRACT_VERIFIED]: ContractStatus.VERIFIED,
    [EventType.SETTLEMENT_STARTED]: ContractStatus.SETTLING,
    [EventType.PAYOUT_DEFERRED]: ContractStatus.PAYOUT_PENDING,
    [EventType.SETTLED_SUCCESS]: ContractStatus.SETTLED,
    [EventType.SETTLED_FAILURE]: ContractStatus.FORFEITED,
    [EventType.CONTRACT_SETTLED]: ContractStatus.SETTLED,
    [EventType.CONTRACT_FORFEITED]: ContractStatus.FORFEITED,
};
const TERMINAL_STATES = new Set([ContractStatus.SETTLED, ContractStatus.FORFEITED]);
// =============================================================================
// CHAIN HEAD RETRIEVAL
// =============================================================================
/**
 * Get the current chain head for a contract (most recent event in ledger order).
 *
 * ORDER: (timestampUtc DESC, id DESC) to get the latest event.
 * This ordering is the inverse of getEventsForContract() and gives us the chain head.
 *
 * @param tx - Optional transaction client for read-your-writes inside a lock
 */
async function getChainHead(contractId, txClient) {
    const client = txClient ?? db;
    const [lastEvent] = await client
        .select()
        .from(ledgerEvents)
        .where(eq(ledgerEvents.contractId, contractId))
        .orderBy(desc(ledgerEvents.timestampUtc), desc(ledgerEvents.id))
        .limit(1);
    return lastEvent || null;
}
// =============================================================================
// IDEMPOTENCY CHECK
// =============================================================================
/**
 * Check if an event with the given externalRef already exists for a contract.
 * Used for idempotency - prevents duplicate events from webhook retries.
 *
 * @param contractId - Contract to check
 * @param externalRef - External reference (e.g., payment_intent_id, stripe_charge_id)
 * @param eventType - Optional: filter by specific event type
 * @param txClient - Optional transaction client for read-your-writes
 * @returns true if event already exists
 */
export async function eventExistsForExternalRef(contractId, externalRef, eventType, txClient) {
    const client = txClient ?? db;
    const conditions = [
        eq(ledgerEvents.contractId, contractId),
        eq(ledgerEvents.externalRef, externalRef),
    ];
    if (eventType) {
        conditions.push(eq(ledgerEvents.eventType, eventType));
    }
    const [existing] = await client
        .select({ id: ledgerEvents.id })
        .from(ledgerEvents)
        .where(and(...conditions))
        .limit(1);
    return !!existing;
}
/**
 * Lookup contractId by paymentIntentId from FUNDS_AUTHORIZED event.
 * Used for webhook fallback when metadata is missing.
 *
 * @param paymentIntentId - Stripe PaymentIntent ID (stored in externalRef)
 * @returns contractId if found, null otherwise
 */
export async function getContractIdByPaymentIntent(paymentIntentId) {
    const [event] = await db
        .select({ contractId: ledgerEvents.contractId })
        .from(ledgerEvents)
        .where(and(eq(ledgerEvents.externalRef, paymentIntentId), eq(ledgerEvents.eventType, EventType.FUNDS_AUTHORIZED)))
        .limit(1);
    return event?.contractId || null;
}
/**
 * Lookup contractId by chargeId from FUNDS_LOCKED event.
 * Used for dispute webhook lookup when metadata is missing.
 *
 * @param chargeId - Stripe Charge ID (stored in externalRef or metadata.chargeId)
 * @returns contractId if found, null otherwise
 */
export async function getContractIdByChargeId(chargeId) {
    // First try: chargeId is stored as externalRef in FUNDS_LOCKED event
    const [eventByRef] = await db
        .select({ contractId: ledgerEvents.contractId })
        .from(ledgerEvents)
        .where(and(eq(ledgerEvents.externalRef, chargeId), eq(ledgerEvents.eventType, EventType.FUNDS_LOCKED)))
        .limit(1);
    if (eventByRef?.contractId) {
        return eventByRef.contractId;
    }
    // Second try: chargeId might be in metadata.chargeId
    // Use raw SQL for JSON field search
    const [eventByMeta] = await db
        .select({ contractId: ledgerEvents.contractId })
        .from(ledgerEvents)
        .where(and(eq(ledgerEvents.eventType, EventType.FUNDS_LOCKED), sql `${ledgerEvents.metadataJson}->>'chargeId' = ${chargeId}`))
        .limit(1);
    return eventByMeta?.contractId || null;
}
/**
 * Get existing event by externalRef (for returning idempotent duplicates).
 *
 * @param txClient - Optional transaction client for read-your-writes
 */
async function getEventByExternalRef(contractId, externalRef, eventType, txClient) {
    const client = txClient ?? db;
    const conditions = [
        eq(ledgerEvents.contractId, contractId),
        eq(ledgerEvents.externalRef, externalRef),
    ];
    if (eventType) {
        conditions.push(eq(ledgerEvents.eventType, eventType));
    }
    const [existing] = await client
        .select()
        .from(ledgerEvents)
        .where(and(...conditions))
        .limit(1);
    return existing || null;
}
// =============================================================================
// CONTRACT INDEX UPDATE (done inside appendEvent transaction)
// =============================================================================
// NOTE: Contract index updates are performed INSIDE the appendEvent transaction
// to ensure atomicity. No standalone function needed.
// 
// KEY BEHAVIORS:
// - Only state-changing events update currentState
// - Operational events (RETRY_SCHEDULED, JOB_LOCK_ACQUIRED) preserve currentState
// - nextRetryDueUtc is set from RETRY_SCHEDULED metadata
// - isTerminal only flips to 1 for SETTLED/FORFEITED
// =============================================================================
// =============================================================================
// APPEND EVENT (Primary Write API)
// =============================================================================
/**
 * Append a new event to the ledger.
 *
 * This is the ONLY way to add events - ensures hash chain integrity.
 *
 * Guarantees:
 * - prevEventHash links to the current chain head's eventHash
 * - eventHash is computed from canonical payload including prevEventHash
 * - contract_index is updated ATOMICALLY in the same transaction
 * - Idempotent when externalRef is provided:
 *   - First checks for existing event
 *   - On unique constraint violation (race), returns existing event
 *
 * CONCURRENCY SAFETY:
 * - Uses DB unique constraint (contract_id, external_ref) as ultimate guard
 * - Transaction ensures ledger + index are consistent
 *
 * @param params - Event parameters
 * @returns The inserted (or existing if idempotent) event row
 */
export async function appendEvent(params) {
    const { contractId, actor, eventType, amountUsdCents, metadata } = params;
    // DEFENSIVE NORMALIZATION: Treat empty string as null for externalRef
    // This prevents accidental dedupe collisions since '' is not NULL in Postgres
    // and would trigger the unique constraint (contract_id, external_ref)
    const externalRef = params.externalRef?.trim() || null;
    // Idempotency check: if externalRef provided, check for duplicate BEFORE insert
    // CRITICAL: Use tx for read-your-writes when tx is provided
    if (externalRef) {
        const existing = await getEventByExternalRef(contractId, externalRef, eventType, params.tx);
        if (existing) {
            // Return existing event (idempotent - fast path)
            return existing;
        }
    }
    // Get current chain head for hash chaining
    // CRITICAL: Use tx for read-your-writes when tx is provided
    const chainHead = await getChainHead(contractId, params.tx);
    const prevEventHash = chainHead?.eventHash || null;
    // Generate timestamp
    const timestampUtc = new Date();
    // Build canonical payload for hashing
    const hashPayload = {
        contractId,
        actor,
        eventType,
        timestampUtc: timestampUtc.toISOString(),
        amountUsdCents: amountUsdCents ?? null,
        externalRef: externalRef ?? null,
        metadataJson: metadata ?? null,
        prevEventHash,
    };
    // Compute tamper-evident hash
    const eventHash = computeEventHash(hashPayload);
    // Build insert row
    const newEvent = {
        contractId,
        actor,
        eventType,
        timestampUtc,
        amountUsdCents: amountUsdCents ?? null,
        externalRef: externalRef ?? null,
        metadataJson: metadata ?? null,
        prevEventHash,
        eventHash,
    };
    try {
        // If tx is provided, use it directly (we're inside a lock-holding transaction)
        // Otherwise, create our own transaction for atomicity
        const executeInsert = async (txClient) => {
            // Insert ledger event with idempotency - onConflictDoNothing for (contractId, externalRef)
            const [event] = await txClient
                .insert(ledgerEvents)
                .values(newEvent)
                .onConflictDoNothing({
                target: [ledgerEvents.contractId, ledgerEvents.externalRef],
            })
                .returning();
            // If insert was skipped due to conflict (idempotent duplicate), fetch existing
            if (!event && externalRef) {
                const existing = await getEventByExternalRef(contractId, externalRef, eventType, txClient);
                if (existing) {
                    return existing;
                }
                // Should not happen - constraint fired but can't find the row
                throw new Error(`appendEvent: conflict on externalRef but existing event not found`);
            }
            if (!event) {
                throw new Error(`appendEvent: insert returned nothing for ${eventType}`);
            }
            // ==================================================================
            // Update derived contract_index (performance index only)
            // ==================================================================
            const derivedState = EVENT_TO_STATE[eventType];
            const isStateChangingEvent = derivedState !== undefined;
            const isTerminal = isStateChangingEvent && TERMINAL_STATES.has(derivedState) ? 1 : 0;
            let nextRetryDueUtc = null;
            if (eventType === EventType.RETRY_SCHEDULED && metadata) {
                const retryMeta = metadata;
                if (retryMeta.nextAttemptAtUtc) {
                    nextRetryDueUtc = new Date(retryMeta.nextAttemptAtUtc);
                }
            }
            const updateFields = {
                lastEventType: eventType,
                lastEventAtUtc: timestampUtc,
                chainHeadHash: eventHash,
            };
            if (isStateChangingEvent) {
                updateFields.currentState = derivedState;
                updateFields.isTerminal = isTerminal;
            }
            if (nextRetryDueUtc) {
                updateFields.nextRetryDueUtc = nextRetryDueUtc;
            }
            if (isStateChangingEvent && TERMINAL_STATES.has(derivedState)) {
                updateFields.nextRetryDueUtc = null;
            }
            const insertValues = {
                contractId,
                currentState: derivedState || ContractStatus.CREATED,
                isTerminal,
                lastEventType: eventType,
                lastEventAtUtc: timestampUtc,
                chainHeadHash: eventHash,
            };
            if (nextRetryDueUtc) {
                insertValues.nextRetryDueUtc = nextRetryDueUtc;
            }
            if (params.deadlineUtc) {
                insertValues.deadlineUtc = params.deadlineUtc;
                updateFields.deadlineUtc = params.deadlineUtc;
            }
            await txClient
                .insert(contractIndex)
                .values(insertValues)
                .onConflictDoUpdate({
                target: contractIndex.contractId,
                set: updateFields,
            });
            return event;
        };
        // Execute: use provided tx directly, or wrap in new transaction
        const inserted = params.tx
            ? await executeInsert(params.tx)
            : await db.transaction(async (tx) => executeInsert(tx));
        return inserted;
    }
    catch (error) {
        // Handle unique constraint violation (race condition on externalRef)
        // PostgreSQL error code 23505 = unique_violation
        if (error?.code === '23505' && externalRef) {
            // Another worker inserted first - return existing event
            const existing = await getEventByExternalRef(contractId, externalRef, eventType);
            if (existing) {
                return existing;
            }
        }
        // Re-throw other errors
        throw error;
    }
}
// =============================================================================
// GET EVENTS FOR CONTRACT (Read API)
// =============================================================================
/**
 * Get all events for a contract in deterministic ledger sequence order.
 *
 * ORDER: (timestampUtc ASC, id ASC)
 * - Primary: timestampUtc ascending (chronological)
 * - Secondary: id ascending (tiebreaker for same-timestamp events)
 *
 * GUARANTEE: events[events.length - 1] is the true chain head.
 * Settlement receipt code relies on this for correct chainHeadHash.
 *
 * @param contractId - Contract to fetch events for
 * @param txClient - Optional transaction client for read-your-writes inside a lock
 * @returns All events in deterministic chain order
 */
export async function getEventsForContract(contractId, txClient) {
    const client = txClient ?? db;
    return client
        .select()
        .from(ledgerEvents)
        .where(eq(ledgerEvents.contractId, contractId))
        .orderBy(ledgerEvents.timestampUtc, ledgerEvents.id);
}
// =============================================================================
// GET LEDGER EVENTS (Paginated Global Feed)
// =============================================================================
/**
 * Parse cursor string into timestamp and id components.
 * Cursor format: "timestampIso|id"
 */
function parseCursor(cursor) {
    const parts = cursor.split('|');
    if (parts.length !== 2) {
        return null;
    }
    const timestamp = new Date(parts[0]);
    if (isNaN(timestamp.getTime())) {
        return null;
    }
    return { timestamp, id: parts[1] };
}
/**
 * Create cursor string from event.
 * Cursor format: "timestampIso|id"
 */
function createCursor(event) {
    return `${event.timestampUtc.toISOString()}|${event.id}`;
}
/**
 * Get global ledger events with cursor-based pagination.
 *
 * ORDER: (timestampUtc DESC, id DESC) - newest first for global feed.
 *
 * PAGINATION: Uses seek method for stable pagination without duplicates:
 * - Cursor encodes (timestampUtc, id) of last returned event
 * - Query: WHERE (timestampUtc < cursorTimestamp)
 *          OR (timestampUtc = cursorTimestamp AND id < cursorId)
 *
 * @param options - Pagination options (cursor, limit)
 * @returns Paginated events with nextCursor
 */
export async function getLedgerEvents(options = {}) {
    const limit = Math.min(Math.max(options.limit || 50, 1), 100);
    let events;
    if (options.cursor) {
        const parsed = parseCursor(options.cursor);
        if (parsed) {
            // Seek method: get events older than cursor position
            // (timestampUtc < cursorTimestamp) OR (timestampUtc = cursorTimestamp AND id < cursorId)
            events = await db
                .select()
                .from(ledgerEvents)
                .where(or(lt(ledgerEvents.timestampUtc, parsed.timestamp), and(eq(ledgerEvents.timestampUtc, parsed.timestamp), lt(ledgerEvents.id, parsed.id))))
                .orderBy(desc(ledgerEvents.timestampUtc), desc(ledgerEvents.id))
                .limit(limit + 1);
        }
        else {
            // Invalid cursor - start from beginning
            events = await db
                .select()
                .from(ledgerEvents)
                .orderBy(desc(ledgerEvents.timestampUtc), desc(ledgerEvents.id))
                .limit(limit + 1);
        }
    }
    else {
        // No cursor - start from newest
        events = await db
            .select()
            .from(ledgerEvents)
            .orderBy(desc(ledgerEvents.timestampUtc), desc(ledgerEvents.id))
            .limit(limit + 1);
    }
    // Check if there are more results
    const hasMore = events.length > limit;
    const resultEvents = hasMore ? events.slice(0, limit) : events;
    // Create cursor from last returned event
    const nextCursor = hasMore && resultEvents.length > 0
        ? createCursor(resultEvents[resultEvents.length - 1])
        : null;
    return { events: resultEvents, nextCursor };
}
// =============================================================================
// HASH CHAIN VERIFICATION (Audit API)
// =============================================================================
/**
 * Verify hash chain integrity for a contract.
 *
 * Checks that:
 * - Each event's prevEventHash matches the previous event's eventHash
 * - Each event's eventHash matches the recomputed hash from its payload
 *
 * @param contractId - Contract to verify
 * @returns true if chain is valid, false if tampered
 */
export async function verifyHashChain(contractId) {
    const events = await getEventsForContract(contractId);
    if (events.length === 0) {
        return true; // Empty chain is valid
    }
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const expectedPrevHash = i === 0 ? null : events[i - 1].eventHash;
        // Check prevEventHash links correctly
        if (event.prevEventHash !== expectedPrevHash) {
            return false;
        }
        // Recompute expected hash
        const hashPayload = {
            contractId: event.contractId,
            actor: event.actor,
            eventType: event.eventType,
            timestampUtc: event.timestampUtc.toISOString(),
            amountUsdCents: event.amountUsdCents,
            externalRef: event.externalRef,
            metadataJson: event.metadataJson,
            prevEventHash: event.prevEventHash,
        };
        const expectedHash = computeEventHash(hashPayload);
        // Check eventHash is correct
        if (event.eventHash !== expectedHash) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=ledger.js.map
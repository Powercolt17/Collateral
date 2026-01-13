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
import { type DbLike } from '../db/client.js';
import { type LedgerEvent, type EventTypeType } from '../db/schema.js';
export interface AppendEventParams {
    contractId: string;
    actor: 'SYSTEM' | 'USER';
    eventType: EventTypeType;
    amountUsdCents?: number;
    externalRef?: string;
    metadata?: Record<string, unknown>;
    /** Optional: Set deadlineUtc in contract_index (for CONTRACT_CREATED) */
    deadlineUtc?: Date;
    /** Optional: Transaction client to use (for lock-pinned writes) */
    tx?: DbLike;
}
export interface PaginationOptions {
    cursor?: string;
    limit?: number;
}
export interface PaginatedEvents {
    events: LedgerEvent[];
    nextCursor: string | null;
}
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
export declare function eventExistsForExternalRef(contractId: string, externalRef: string, eventType?: string, txClient?: DbLike): Promise<boolean>;
/**
 * Lookup contractId by paymentIntentId from FUNDS_AUTHORIZED event.
 * Used for webhook fallback when metadata is missing.
 *
 * @param paymentIntentId - Stripe PaymentIntent ID (stored in externalRef)
 * @returns contractId if found, null otherwise
 */
export declare function getContractIdByPaymentIntent(paymentIntentId: string): Promise<string | null>;
/**
 * Lookup contractId by chargeId from FUNDS_LOCKED event.
 * Used for dispute webhook lookup when metadata is missing.
 *
 * @param chargeId - Stripe Charge ID (stored in externalRef or metadata.chargeId)
 * @returns contractId if found, null otherwise
 */
export declare function getContractIdByChargeId(chargeId: string): Promise<string | null>;
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
export declare function appendEvent(params: AppendEventParams): Promise<LedgerEvent>;
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
export declare function getEventsForContract(contractId: string, txClient?: DbLike): Promise<LedgerEvent[]>;
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
export declare function getLedgerEvents(options?: PaginationOptions): Promise<PaginatedEvents>;
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
export declare function verifyHashChain(contractId: string): Promise<boolean>;

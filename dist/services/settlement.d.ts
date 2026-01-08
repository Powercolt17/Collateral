/**
 * Settlement Service
 *
 * Handles settlement after verification.
 * NO PAYOUT MATH - uses precommitted amounts from contract.
 *
 * State is NEVER stored - derived from ledger events.
 */
import { type DbLike } from '../db/client.js';
import { type Contract } from '../db/schema.js';
/**
 * Settlement result with Stripe references
 */
export interface SettlementResult {
    success: boolean;
    outcome: 'SUCCESS' | 'FAILURE' | null;
    amountUsdCents: number;
    stripeRefs: {
        transferId?: string;
        payoutId?: string;
    };
    error?: string;
    retryable?: boolean;
}
/**
 * Issue receipt for a contract (idempotent helper)
 * ALWAYS fetches fresh events for correct chainHeadHash and eventCount
 *
 * @param tx - Optional transaction client for lock-pinned writes
 */
export declare function issueReceiptForContract(contractId: string, contract: Contract, terminalEvent: {
    eventType: string;
    amountUsdCents: number | null;
    metadataJson: unknown;
}, tx?: DbLike): Promise<void>;
/**
 * Check if a contract can be settled
 * - Must be in VERIFIED state
 * - Must have terminal verification event (SUCCEEDED or FAILED)
 */
export declare function canSettle(currentState: string | null, events: {
    eventType: string;
}[]): {
    allowed: boolean;
    reason?: string;
    verificationOutcome?: 'SUCCEEDED' | 'FAILED';
};
/**
 * Settle a single contract
 *
 * From-state: VERIFIED (or SETTLING if retrying)
 * Appends: SETTLEMENT_STARTED (if not exists), then SETTLED_SUCCESS or SETTLED_FAILURE
 * To-state: SETTLED or FORFEITED
 *
 * IDEMPOTENCY:
 * - Terminal events: SETTLED_SUCCESS or SETTLED_FAILURE
 * - Skip if terminal event exists (return cached result)
 * - Allow retry if only SETTLEMENT_STARTED exists (prevents stuck SETTLING state)
 *
 * INVARIANT: System never gets stuck in SETTLING
 *
 * @param contractId - Contract ID to settle
 * @param tx - Optional transaction client (for lock-pinned writes from withContractLock)
 */
export declare function settleContract(contractId: string, tx?: DbLike): Promise<SettlementResult>;
/**
 * Run settlement for all verified contracts
 *
 * CANDIDATE SELECTION (via contract_index - O(1) index lookup):
 * - currentState = VERIFIED
 * - isTerminal = 0
 * - nextRetryDueUtc IS NULL OR nextRetryDueUtc <= now
 */
export declare function runSettlementJob(): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
}>;

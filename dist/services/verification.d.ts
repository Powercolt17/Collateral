/**
 * Verification Service
 *
 * Handles contract verification for X/Twitter metrics only.
 * NO SETTLEMENT - verification-only slice.
 *
 * State is NEVER stored - derived from ledger events.
 */
import { type DbLike } from '../db/client.js';
/**
 * Verification result with evidence
 */
export interface VerificationResult {
    success: boolean;
    pass: boolean;
    observedValue: number;
    threshold: number;
    operator: string;
    evidence: {
        snapshotAt: string;
        metrics: Record<string, number>;
        source: string;
    };
    error?: string;
    retryable?: boolean;
}
/**
 * Check if a contract can be verified
 * - Must be in LOCKED state
 * - Must be at/after deadline
 */
export declare function canVerify(currentState: string | null, deadlineUtc: Date): {
    allowed: boolean;
    reason?: string;
};
/**
 * Verify a single contract (X platform only)
 *
 * From-state: LOCKED (or VERIFYING if retrying)
 * Appends: VERIFICATION_STARTED (if not exists), then VERIFICATION_SUCCEEDED or VERIFICATION_FAILED
 * To-state: VERIFIED
 *
 * IDEMPOTENCY:
 * - Terminal events: VERIFICATION_SUCCEEDED or VERIFICATION_FAILED
 * - Skip if terminal event exists (return cached result)
 * - Allow retry if only VERIFICATION_STARTED exists (prevents stuck VERIFYING state)
 *
 * INVARIANT: System never gets stuck in VERIFYING
 *
 * @param contractId - Contract ID to verify
 * @param tx - Optional transaction client (for lock-pinned writes from withContractLock)
 */
export declare function verifyContract(contractId: string, tx?: DbLike): Promise<VerificationResult>;
/**
 * Run verification for all eligible contracts
 *
 * CANDIDATE SELECTION (via contract_index - O(1) index lookup):
 * - currentState = LOCKED
 * - isTerminal = 0
 * - deadlineUtc <= now
 * - nextRetryDueUtc IS NULL OR nextRetryDueUtc <= now
 */
export declare function runVerificationJob(): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
}>;

/**
 * Contract Locks - I3 Single-Writer Contract Drivers
 *
 * CRITICAL: Uses TRANSACTION-SCOPED advisory locks inside db.transaction()
 * to guarantee the lock pins the same connection that executes fn().
 *
 * This is the ONLY correct approach in a connection-pooled environment.
 *
 * INVARIANT: Only one process can drive a contract's state at a time.
 *
 * HOW IT WORKS:
 * 1. Open a Drizzle transaction (pins a connection)
 * 2. Acquire pg_advisory_xact_lock INSIDE that transaction
 * 3. Execute fn(tx) using the SAME transaction client
 * 4. Lock auto-releases on commit/rollback (no manual unlock needed)
 */
import { db } from '../db/client.js';
import { sql } from 'drizzle-orm';
// =============================================================================
// LOCK KEY DERIVATION
// =============================================================================
/**
 * Convert contract ID (UUID) to a BIGINT for advisory lock
 *
 * Takes first 8 bytes of the UUID and converts to a signed 64-bit integer.
 * This is stable and deterministic for the same contract ID.
 */
function hashContractIdToLockKey(contractId) {
    // Remove dashes and take first 16 hex chars (8 bytes)
    const hex = contractId.replace(/-/g, '').slice(0, 16);
    // Parse as unsigned, then interpret as signed for advisory lock
    const unsigned = BigInt('0x' + hex);
    // Convert to signed (advisory locks use signed BIGINT)
    const maxSigned = BigInt('0x7FFFFFFFFFFFFFFF');
    if (unsigned > maxSigned) {
        return unsigned - BigInt('0x10000000000000000');
    }
    return unsigned;
}
export class ContractLockError extends Error {
    code;
    contractId;
    constructor(message, code, contractId) {
        super(message);
        this.name = 'ContractLockError';
        this.code = code;
        this.contractId = contractId;
    }
}
/**
 * Execute a function while holding an exclusive lock on a contract
 *
 * CRITICAL: Uses TRANSACTION-SCOPED advisory lock inside db.transaction()
 * - Lock is acquired inside the transaction (connection-pinned)
 * - fn receives the transaction client and MUST use it for all DB writes
 * - Lock auto-releases on commit/rollback
 *
 * @param contractId Contract ID to lock
 * @param fn Function to execute while holding lock - receives transaction client
 * @param options Lock options
 */
export async function withContractLock(contractId, fn, options = {}) {
    const { noWait = false } = options;
    const lockKey = hashContractIdToLockKey(contractId);
    return await db.transaction(async (tx) => {
        // Acquire lock INSIDE the transaction (connection-pinned)
        if (noWait) {
            const result = await tx.execute(sql `SELECT pg_try_advisory_xact_lock(${lockKey.toString()}::bigint) as acquired`);
            const acquired = result.rows[0]?.acquired === true;
            if (!acquired) {
                throw new ContractLockError(`Failed to acquire lock for contract ${contractId}`, 'LOCK_UNAVAILABLE', contractId);
            }
        }
        else {
            // Blocking acquire
            await tx.execute(sql `SELECT pg_advisory_xact_lock(${lockKey.toString()}::bigint)`);
        }
        // Execute fn with the SAME transaction client
        // All DB writes inside fn() MUST use tx
        return await fn(tx);
        // Lock auto-releases when transaction commits/rollbacks
    });
}
// =============================================================================
// JOB-SPECIFIC LOCK WRAPPERS
// =============================================================================
/**
 * Execute verification job with contract lock (non-blocking)
 */
export async function withVerificationLock(contractId, fn) {
    return withContractLock(contractId, fn, { noWait: true });
}
/**
 * Execute settlement job with contract lock (non-blocking)
 */
export async function withSettlementLock(contractId, fn) {
    return withContractLock(contractId, fn, { noWait: true });
}
//# sourceMappingURL=contract-locks.js.map
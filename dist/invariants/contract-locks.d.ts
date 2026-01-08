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
/**
 * Transaction client type for use in locked operations
 * All DB writes inside withContractLock MUST use this client
 */
export type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0];
export interface LockOptions {
    /** If true, fail immediately if lock unavailable instead of blocking */
    noWait?: boolean;
}
export declare class ContractLockError extends Error {
    code: string;
    contractId: string;
    constructor(message: string, code: string, contractId: string);
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
export declare function withContractLock<T>(contractId: string, fn: (tx: TransactionClient) => Promise<T>, options?: LockOptions): Promise<T>;
/**
 * Execute verification job with contract lock (non-blocking)
 */
export declare function withVerificationLock<T>(contractId: string, fn: (tx: TransactionClient) => Promise<T>): Promise<T>;
/**
 * Execute settlement job with contract lock (non-blocking)
 */
export declare function withSettlementLock<T>(contractId: string, fn: (tx: TransactionClient) => Promise<T>): Promise<T>;

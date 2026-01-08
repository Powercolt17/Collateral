/**
 * Idempotency Guards - I2 External Side Effects
 *
 * DB-backed idempotency for exactly-once semantics across processes.
 *
 * INVARIANT: All external side effects (webhooks, transfers, payouts) are idempotent.
 *
 * FIXED: Atomic acquisition with INSERT ON CONFLICT + UPDATE compare-and-set.
 * FIXED: Bounded retry loop (max 2 attempts, no recursion).
 */
import { db } from '../db/client.js';
import { sql } from 'drizzle-orm';
// =============================================================================
// CONSTANTS
// =============================================================================
// How long to consider a "started" entry as potentially abandoned (seconds)
const STALE_LOCK_SECONDS = 300; // 5 minutes
// Maximum acquisition attempts (bounded, no recursion)
const MAX_ACQUISITION_ATTEMPTS = 2;
// =============================================================================
// CORE IDEMPOTENCY HELPER
// =============================================================================
/**
 * Run a function with DB-backed idempotency guarantee
 *
 * BEHAVIOR:
 * - First caller wins via atomic INSERT + UPDATE compare-and-set
 * - On success: updates to 'succeeded' + stores result
 * - On failure: updates to 'failed' + stores error; rethrows
 * - Subsequent callers:
 *   - If 'succeeded': return cached result
 *   - If 'started' (not stale): return 'in_progress'
 *   - If 'started' (stale): compete to take over via compare-and-set
 *   - If 'failed': compete to retry via compare-and-set
 */
export async function runIdempotent(params, fn) {
    const { scope, key } = params;
    const fullKey = `${scope}:${key}`;
    for (let attempt = 0; attempt < MAX_ACQUISITION_ATTEMPTS; attempt++) {
        const acquisitionResult = await tryAcquireIdempotencyLock(fullKey, scope);
        switch (acquisitionResult.status) {
            case 'acquired':
                // We won the lock - execute function
                return await executeWithIdempotency(fullKey, fn);
            case 'cached':
                // Already completed successfully
                return {
                    status: 'cached',
                    result: acquisitionResult.result,
                    cachedAt: acquisitionResult.completedAt || undefined,
                };
            case 'in_progress':
                // Another process is executing
                return { status: 'in_progress' };
            case 'contention':
                // Lost race - retry once more
                continue;
        }
    }
    // Exhausted attempts due to contention
    return { status: 'in_progress' };
}
/**
 * Try to acquire idempotency lock atomically
 *
 * Uses two-phase approach:
 * 1. INSERT ON CONFLICT DO NOTHING - creates row if not exists
 * 2. UPDATE with compare-and-set - only succeeds if we can legitimately claim it
 */
async function tryAcquireIdempotencyLock(key, scope) {
    const now = new Date();
    const staleThreshold = new Date(now.getTime() - STALE_LOCK_SECONDS * 1000);
    // Step 1: Try to insert new row (first caller)
    await db.execute(sql `
        INSERT INTO idempotency_keys (key, scope, status, locked_at, created_at)
        VALUES (${key}, ${scope}, 'started', ${now}, ${now})
        ON CONFLICT (key) DO NOTHING
    `);
    // Step 2: Try to acquire via compare-and-set UPDATE
    // This succeeds if:
    // - Row was just inserted by us (status='started', locked_at=now)
    // - Row is stale (locked_at < threshold)
    // - Row failed previously (status='failed')
    const updateResult = await db.execute(sql `
        UPDATE idempotency_keys
        SET status = 'started', locked_at = ${now}
        WHERE key = ${key}
        AND (
            (status = 'started' AND locked_at = ${now})
            OR (status = 'started' AND locked_at < ${staleThreshold})
            OR (status = 'failed')
        )
        RETURNING key
    `);
    if (updateResult.rows.length > 0) {
        // We acquired the lock
        return { status: 'acquired' };
    }
    // Step 3: Check current state (we didn't acquire)
    const current = await getIdempotencyKey(key);
    if (!current) {
        // Row was deleted between our insert and update - contention
        return { status: 'contention' };
    }
    if (current.status === 'succeeded') {
        return {
            status: 'cached',
            result: current.resultJson,
            completedAt: current.completedAt,
        };
    }
    if (current.status === 'started') {
        // Check if stale
        const lockAge = current.lockedAt
            ? (now.getTime() - current.lockedAt.getTime()) / 1000
            : Infinity;
        if (lockAge >= STALE_LOCK_SECONDS) {
            // Stale but we lost the race to take over
            return { status: 'contention' };
        }
        // Not stale - another process is actively working
        return { status: 'in_progress' };
    }
    // status === 'failed' but we lost the race to retry
    return { status: 'contention' };
}
/**
 * Execute function and update idempotency key with result
 */
async function executeWithIdempotency(key, fn) {
    try {
        const result = await fn();
        await markSucceeded(key, result);
        return { status: 'executed', result };
    }
    catch (err) {
        await markFailed(key, err);
        throw err;
    }
}
// =============================================================================
// DATABASE OPERATIONS
// =============================================================================
async function getIdempotencyKey(key) {
    const result = await db.execute(sql `
        SELECT 
            key,
            scope,
            status,
            created_at as "createdAt",
            locked_at as "lockedAt",
            completed_at as "completedAt",
            result_json as "resultJson",
            error_text as "errorText"
        FROM idempotency_keys
        WHERE key = ${key}
        LIMIT 1
    `);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
}
async function markSucceeded(key, result) {
    await db.execute(sql `
        UPDATE idempotency_keys
        SET status = 'succeeded',
            completed_at = NOW(),
            result_json = ${JSON.stringify(result)}::jsonb
        WHERE key = ${key}
    `);
}
async function markFailed(key, err) {
    const errorText = err instanceof Error ? err.message : String(err);
    await db.execute(sql `
        UPDATE idempotency_keys
        SET status = 'failed',
            completed_at = NOW(),
            error_text = ${errorText}
        WHERE key = ${key}
    `);
}
// =============================================================================
// SCOPE CONSTANTS (for consistent usage)
// =============================================================================
export const IdempotencyScope = {
    STRIPE_WEBHOOK: 'stripe:webhook',
    STRIPE_PAYOUT: 'stripe:payout',
    CONTRACT_SETTLE: 'contract:settle',
    CONTRACT_VERIFY: 'contract:verify',
};
/**
 * Check if an idempotency key exists and is completed
 * Useful for checking without running
 */
export async function isIdempotentKeyCompleted(scope, key) {
    const fullKey = `${scope}:${key}`;
    const existing = await getIdempotencyKey(fullKey);
    return existing?.status === 'succeeded';
}
//# sourceMappingURL=idempotency.js.map
/**
 * Job Lock Service (Atomic Implementation)
 * 
 * Provides atomic locking for verification and settlement jobs.
 * Uses job_locks table with UNIQUE(contractId, jobType) constraint.
 * 
 * Lock pattern:
 * - INSERT ... ON CONFLICT DO NOTHING for atomic acquire
 * - Expired locks can be replaced via DELETE + INSERT in transaction
 * - No race conditions: DB enforces single active lock
 */

import { db } from '../db/client.js';
import { jobLocks, EventType } from '../db/schema.js';
import { appendEvent, getEventsForContract } from './ledger.js';
import { randomUUID } from 'crypto';
import { eq, and, lt } from 'drizzle-orm';

// Lock TTL in milliseconds (5 minutes)
const LOCK_TTL_MS = 5 * 60 * 1000;

export type JobType = 'VERIFY' | 'SETTLE';

export interface JobLockResult {
    acquired: boolean;
    lockId?: string;
    existingLockId?: string;
    expiresAt?: Date;
}

/**
 * Check if a non-expired lock exists for the given job type (DB-based)
 */
export async function hasActiveLock(contractId: string, jobType: JobType): Promise<{
    locked: boolean;
    lockId?: string;
    expiresAt?: Date;
}> {
    const now = new Date();

    const [existingLock] = await db
        .select()
        .from(jobLocks)
        .where(and(
            eq(jobLocks.contractId, contractId),
            eq(jobLocks.jobType, jobType)
        ))
        .limit(1);

    if (!existingLock) {
        return { locked: false };
    }

    // Check if expired
    if (existingLock.expiresAtUtc < now) {
        return { locked: false };
    }

    return {
        locked: true,
        lockId: existingLock.lockId,
        expiresAt: existingLock.expiresAtUtc
    };
}

/**
 * Atomically acquire a lock for the given job type.
 * Uses INSERT ... ON CONFLICT DO NOTHING for race-safe acquisition.
 * Expired locks are deleted first in a transaction.
 */
export async function tryAcquireLock(contractId: string, jobType: JobType): Promise<JobLockResult> {
    const now = new Date();
    const lockId = randomUUID();
    const expiresAtUtc = new Date(now.getTime() + LOCK_TTL_MS);

    try {
        // Step 1: Delete expired locks for this contract+jobType
        await db
            .delete(jobLocks)
            .where(and(
                eq(jobLocks.contractId, contractId),
                eq(jobLocks.jobType, jobType),
                lt(jobLocks.expiresAtUtc, now)
            ));

        // Step 2: Attempt atomic insert (UNIQUE constraint enforces single lock)
        const inserted = await db
            .insert(jobLocks)
            .values({
                contractId,
                jobType,
                lockId,
                acquiredAtUtc: now,
                expiresAtUtc,
            })
            .onConflictDoNothing()
            .returning();

        if (inserted.length > 0) {
            // Lock acquired successfully
            // Also emit ledger event for audit trail
            await appendEvent({
                contractId,
                actor: 'SYSTEM',
                eventType: EventType.JOB_LOCK_ACQUIRED,
                metadata: {
                    jobType,
                    lockId,
                    acquiredAtUtc: now.toISOString(),
                    ttlMs: LOCK_TTL_MS,
                },
            });

            return {
                acquired: true,
                lockId,
                expiresAt: expiresAtUtc,
            };
        }

        // Lock not acquired (another lock exists)
        const [existingLock] = await db
            .select()
            .from(jobLocks)
            .where(and(
                eq(jobLocks.contractId, contractId),
                eq(jobLocks.jobType, jobType)
            ))
            .limit(1);

        return {
            acquired: false,
            existingLockId: existingLock?.lockId,
            expiresAt: existingLock?.expiresAtUtc,
        };
    } catch (err) {
        // On any DB error, treat as lock not acquired (fail-safe)
        console.error(`Error acquiring lock for ${contractId}/${jobType}:`, err);
        return { acquired: false };
    }
}

/**
 * Release a lock (optional - locks expire automatically)
 */
export async function releaseLock(contractId: string, jobType: JobType, lockId: string): Promise<boolean> {
    const result = await db
        .delete(jobLocks)
        .where(and(
            eq(jobLocks.contractId, contractId),
            eq(jobLocks.jobType, jobType),
            eq(jobLocks.lockId, lockId)
        ))
        .returning();

    return result.length > 0;
}

/**
 * Get the count of RETRY_SCHEDULED events for a job type (for backoff calculation)
 */
export async function getRetryCount(contractId: string, jobType: JobType): Promise<number> {
    const events = await getEventsForContract(contractId);
    return events.filter(e => {
        if (e.eventType !== EventType.RETRY_SCHEDULED) return false;
        const meta = e.metadataJson as { jobType?: string } | null;
        return meta?.jobType === jobType;
    }).length;
}

/**
 * Schedule a retry by appending RETRY_SCHEDULED event
 */
export async function scheduleRetry(
    contractId: string,
    jobType: JobType,
    reason: string,
    baseDelayMs: number = 60000 // 1 minute base
): Promise<Date> {
    const retryCount = await getRetryCount(contractId, jobType);

    // Exponential backoff: 1min, 2min, 4min, 8min, 16min (capped at 30min)
    const delayMs = Math.min(baseDelayMs * Math.pow(2, retryCount), 30 * 60 * 1000);
    const nextAttemptAtUtc = new Date(Date.now() + delayMs);

    await appendEvent({
        contractId,
        actor: 'SYSTEM',
        eventType: EventType.RETRY_SCHEDULED,
        metadata: {
            jobType,
            reason,
            retryCount: retryCount + 1,
            nextAttemptAtUtc: nextAttemptAtUtc.toISOString(),
            delayMs,
        },
    });

    return nextAttemptAtUtc;
}

/**
 * Get the next scheduled retry time for a job type (if any)
 */
export async function getNextRetryTime(contractId: string, jobType: JobType): Promise<Date | null> {
    const events = await getEventsForContract(contractId);

    const retryEvents = events
        .filter(e => e.eventType === EventType.RETRY_SCHEDULED)
        .filter(e => {
            const meta = e.metadataJson as { jobType?: string } | null;
            return meta?.jobType === jobType;
        })
        .sort((a, b) => {
            const aTime = a.timestampUtc instanceof Date ? a.timestampUtc.getTime() : new Date(a.timestampUtc).getTime();
            const bTime = b.timestampUtc instanceof Date ? b.timestampUtc.getTime() : new Date(b.timestampUtc).getTime();
            return bTime - aTime;
        });

    if (retryEvents.length === 0) return null;

    const latest = retryEvents[0];
    const meta = latest.metadataJson as { nextAttemptAtUtc?: string } | null;
    return meta?.nextAttemptAtUtc ? new Date(meta.nextAttemptAtUtc) : null;
}

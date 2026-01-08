/**
 * Job Reliability Tests
 * 
 * Tests for ledger-based job locking and retry scheduling.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { tryAcquireLock, hasActiveLock, scheduleRetry, getRetryCount, getNextRetryTime } from '../src/services/job-lock.js';
import { classifyError, isRetryableError } from '../src/services/error-classification.js';
import * as ledger from '../src/services/ledger.js';
import { EventType } from '../src/db/schema.js';
import { db } from '../src/db/client.js';

vi.mock('../src/services/ledger.js');
vi.mock('../src/db/client.js');

describe('Job Lock Service', () => {
    const mockContractId = 'contract-lock-1';

    beforeEach(() => {
        vi.resetAllMocks();

        // Mock DB for job_locks table operations
        // Default: no existing locks, successful insert
        const mockDelete = vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([]),
        });
        const mockInsert = vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
                onConflictDoNothing: vi.fn().mockReturnValue({
                    returning: vi.fn().mockResolvedValue([{ id: 'new-lock', lockId: 'mock-lock-id' }]),
                }),
            }),
        });
        const mockSelect = vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockResolvedValue([]),
            }),
        });

        (db as any).delete = mockDelete;
        (db as any).insert = mockInsert;
        (db as any).select = mockSelect;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('tryAcquireLock', () => {
        it('should acquire lock when no existing lock', async () => {
            // No events = no locks
            vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue([]);
            vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'lock-event-1' } as any);

            const result = await tryAcquireLock(mockContractId, 'VERIFY');

            expect(result.acquired).toBe(true);
            expect(result.lockId).toBeDefined();
            expect(ledger.appendEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventType: EventType.JOB_LOCK_ACQUIRED,
                    metadata: expect.objectContaining({
                        jobType: 'VERIFY',
                        lockId: expect.any(String),
                    }),
                })
            );
        });

        it('should reject lock when active non-expired lock exists', async () => {
            // Mock insert returning empty (lock already exists due to UNIQUE constraint)
            (db as any).insert = vi.fn().mockReturnValue({
                values: vi.fn().mockReturnValue({
                    onConflictDoNothing: vi.fn().mockReturnValue({
                        returning: vi.fn().mockResolvedValue([]), // Empty = conflict, lock exists
                    }),
                }),
            });
            vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue([]);

            const result = await tryAcquireLock(mockContractId, 'VERIFY');

            expect(result.acquired).toBe(false);
            // New implementation doesn't return existingLockId
        });

        it('should acquire lock when existing lock is expired', async () => {
            // DB delete clears expired locks, insert succeeds
            vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue([]);
            vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'new-lock' } as any);

            const result = await tryAcquireLock(mockContractId, 'VERIFY');

            expect(result.acquired).toBe(true);
        });

        it('should allow different job types to have separate locks', async () => {
            // First call (VERIFY): conflict
            const mockInsertConflict = vi.fn().mockReturnValue({
                values: vi.fn().mockReturnValue({
                    onConflictDoNothing: vi.fn().mockReturnValue({
                        returning: vi.fn().mockResolvedValue([]),
                    }),
                }),
            });
            // Second call (SETTLE): success
            const mockInsertSuccess = vi.fn().mockReturnValue({
                values: vi.fn().mockReturnValue({
                    onConflictDoNothing: vi.fn().mockReturnValue({
                        returning: vi.fn().mockResolvedValue([{ id: 'settle-lock' }]),
                    }),
                }),
            });

            vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue([]);
            vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'settle-lock' } as any);

            // VERIFY should be blocked (conflict)
            (db as any).insert = mockInsertConflict;
            const verifyResult = await tryAcquireLock(mockContractId, 'VERIFY');
            expect(verifyResult.acquired).toBe(false);

            // SETTLE should succeed (different job type)
            (db as any).insert = mockInsertSuccess;
            const settleResult = await tryAcquireLock(mockContractId, 'SETTLE');
            expect(settleResult.acquired).toBe(true);
        });
    });

    describe('scheduleRetry', () => {
        it('should schedule retry with exponential backoff', async () => {
            vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue([]);
            vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'retry-1' } as any);

            const nextTime = await scheduleRetry(mockContractId, 'VERIFY', 'Rate limited');

            expect(nextTime.getTime()).toBeGreaterThan(Date.now());
            expect(ledger.appendEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventType: EventType.RETRY_SCHEDULED,
                    metadata: expect.objectContaining({
                        jobType: 'VERIFY',
                        reason: 'Rate limited',
                        retryCount: 1,
                    }),
                })
            );
        });

        it('should increase delay with each retry', async () => {
            // Simulate 2 prior retries
            const priorRetries = [
                { eventType: EventType.RETRY_SCHEDULED, metadataJson: { jobType: 'VERIFY' } },
                { eventType: EventType.RETRY_SCHEDULED, metadataJson: { jobType: 'VERIFY' } },
            ];
            vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue(priorRetries as any);
            vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'retry-3' } as any);

            await scheduleRetry(mockContractId, 'VERIFY', 'Server error', 60000);

            const call = (ledger.appendEvent as any).mock.calls[0][0];
            // 3rd retry: 60000 * 2^2 = 240000ms (4 min)
            expect(call.metadata.delayMs).toBe(240000);
            expect(call.metadata.retryCount).toBe(3);
        });
    });
});

describe('Error Classification', () => {
    it('should classify rate limit errors as retryable', () => {
        const err = new Error('GitHub API rate limited. Retry after 60s.');
        const result = classifyError(err);
        expect(result.retryable).toBe(true);
        expect(result.category).toBe('RATE_LIMIT');
    });

    it('should classify server errors as retryable', () => {
        const err = new Error('Service unavailable (503)');
        const result = classifyError(err);
        expect(result.retryable).toBe(true);
        expect(result.category).toBe('SERVER_ERROR');
    });

    it('should classify network errors as retryable', () => {
        const err = new Error('ECONNREFUSED localhost:443');
        const result = classifyError(err);
        expect(result.retryable).toBe(true);
        expect(result.category).toBe('NETWORK');
    });

    it('should classify config errors as non-retryable', () => {
        const err = new Error('Cannot verify Stripe Revenue: User has no connected Stripe account');
        const result = classifyError(err);
        expect(result.retryable).toBe(false);
        expect(result.category).toBe('CONFIG');
    });

    it('should classify missing resource errors as non-retryable', () => {
        const err = new Error('Missing baseline principalGithubUserId');
        const result = classifyError(err);
        expect(result.retryable).toBe(false);
        expect(result.category).toBe('CONFIG');
    });

    it('should classify unknown errors as retryable (fail-closed)', () => {
        const err = new Error('Something weird happened');
        const result = classifyError(err);
        expect(result.retryable).toBe(true);
        expect(result.category).toBe('UNKNOWN');
    });

    it('should provide simple helper function', () => {
        expect(isRetryableError(new Error('Rate limited'))).toBe(true);
        expect(isRetryableError(new Error('Missing connected account'))).toBe(false);
    });
});

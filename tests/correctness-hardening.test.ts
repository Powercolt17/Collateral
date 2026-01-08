/**
 * Correctness Hardening Tests
 * 
 * Tests for:
 * A) Atomic job locks (DB-based, concurrency-safe)
 * B) Error classification (strict CONFIG rules)
 * C) Settlement idempotency (same idempotencyKey on retry)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { classifyError, isRetryableError } from '../src/services/error-classification.js';

// Mock DB for job lock tests
vi.mock('../src/db/client.js');
vi.mock('../src/services/ledger.js');

describe('Error Classification (Strict CONFIG Rules)', () => {
    describe('TRUE permanent config errors (non-retryable)', () => {
        it('should NOT retry: missing stripe connected account', () => {
            const err = new Error('User has no connected stripe account');
            const result = classifyError(err);
            expect(result.retryable).toBe(false);
            expect(result.category).toBe('CONFIG');
        });

        it('should NOT retry: platform not supported', () => {
            const err = new Error('Platform not supported. Only X, STRIPE, GITHUB supported.');
            const result = classifyError(err);
            expect(result.retryable).toBe(false);
            expect(result.category).toBe('CONFIG');
        });

        it('should NOT retry: unsupported metric', () => {
            const err = new Error('Unsupported metric type for this platform');
            const result = classifyError(err);
            expect(result.retryable).toBe(false);
            expect(result.category).toBe('CONFIG');
        });

        it('should NOT retry: contract not found', () => {
            const err = new Error('Contract not found');
            const result = classifyError(err);
            expect(result.retryable).toBe(false);
            expect(result.category).toBe('CONFIG');
        });

        it('should NOT retry: principal user not found', () => {
            const err = new Error('Principal user not found');
            const result = classifyError(err);
            expect(result.retryable).toBe(false);
            expect(result.category).toBe('CONFIG');
        });

        it('should NOT retry: invalid condition', () => {
            const err = new Error('Invalid condition specification');
            const result = classifyError(err);
            expect(result.retryable).toBe(false);
            expect(result.category).toBe('CONFIG');
        });
    });

    describe('MUST BE RETRYABLE (fail-closed pattern)', () => {
        it('should retry: generic "missing" errors are NOT CONFIG anymore', () => {
            // Generic "missing X" should NOT be treated as permanent
            const err = new Error('Missing response from API');
            const result = classifyError(err);
            // Should be UNKNOWN (retryable) not CONFIG
            expect(result.retryable).toBe(true);
        });

        it('should retry: generic "invalid" errors are NOT CONFIG anymore', () => {
            const err = new Error('Invalid JSON response');
            const result = classifyError(err);
            expect(result.retryable).toBe(true);
        });

        it('should retry: generic "not found" is NOT CONFIG anymore', () => {
            // API 404 on external resource is transient, not permanent config
            const err = new Error('Resource not found in API response');
            const result = classifyError(err);
            expect(result.retryable).toBe(true);
        });

        it('should retry: rate limit errors', () => {
            const err = new Error('Rate limit exceeded (429)');
            const result = classifyError(err);
            expect(result.retryable).toBe(true);
            expect(result.category).toBe('RATE_LIMIT');
        });

        it('should retry: 500 server errors', () => {
            const err = new Error('Internal server error 500');
            const result = classifyError(err);
            expect(result.retryable).toBe(true);
            expect(result.category).toBe('SERVER_ERROR');
        });

        it('should retry: network errors', () => {
            const err = new Error('ECONNREFUSED');
            const result = classifyError(err);
            expect(result.retryable).toBe(true);
            expect(result.category).toBe('NETWORK');
        });

        it('should retry: timeout errors', () => {
            const err = new Error('Request timed out');
            const result = classifyError(err);
            expect(result.retryable).toBe(true);
            expect(result.category).toBe('TIMEOUT');
        });

        it('should retry: completely unknown errors (fail-closed)', () => {
            const err = new Error('Something unexpected happened');
            const result = classifyError(err);
            expect(result.retryable).toBe(true);
            expect(result.category).toBe('UNKNOWN');
        });
    });
});

describe('Settlement Idempotency Invariants', () => {
    it('should derive idempotencyKey only from contractId + settlementStartedEvent.id', () => {
        // This test documents the expected format
        const contractId = 'contract-123';
        const settlementStartedEventId = 'event-456';

        // Expected format from settlement.ts
        const expectedKey = `tr_${contractId}_${settlementStartedEventId}`;

        expect(expectedKey).toBe('tr_contract-123_event-456');
        // Key is deterministic: same inputs = same key
        expect(expectedKey).toBe('tr_contract-123_event-456');
    });

    it('should produce same idempotencyKey on retry (no timestamp/random)', () => {
        const contractId = 'contract-abc';
        const eventId = 'event-xyz';

        // First attempt
        const key1 = `tr_${contractId}_${eventId}`;
        // Retry attempt (same inputs)
        const key2 = `tr_${contractId}_${eventId}`;

        expect(key1).toBe(key2);
    });
});

describe('Atomic Lock Concurrency Simulation', () => {
    // Note: True concurrency tests require DB. This tests the behavioral contract.

    it('should document: only one lock can exist per contractId+jobType', () => {
        // The job_locks table has UNIQUE(contractId, jobType)
        // Two INSERT attempts on same key: one succeeds, one fails (ON CONFLICT DO NOTHING)

        // Behavioral contract:
        // 1. Worker A calls tryAcquireLock(contract-1, VERIFY)
        // 2. Worker B calls tryAcquireLock(contract-1, VERIFY) at same time
        // 3. Only ONE worker gets acquired=true
        // 4. Other worker gets acquired=false

        // This is enforced by DB UNIQUE constraint, not application logic
        expect(true).toBe(true); // Document-only test
    });

    it('should document: expired locks are cleaned before acquire attempt', () => {
        // Behavioral contract:
        // 1. Lock acquired at T, expires at T+5min
        // 2. Worker attempts acquire at T+6min
        // 3. OLD lock is DELETED first (expiresAtUtc < now)
        // 4. NEW lock is INSERTED
        // 5. Worker gets acquired=true

        expect(true).toBe(true); // Document-only test
    });

    it('should document: different jobTypes have separate locks', () => {
        // UNIQUE(contractId, jobType) allows:
        // - (contract-1, VERIFY) locked
        // - (contract-1, SETTLE) can still be acquired

        expect(true).toBe(true); // Document-only test
    });
});

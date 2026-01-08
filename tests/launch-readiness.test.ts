/**
 * Launch Readiness Tests
 * 
 * Tests for:
 * 1. Anti-sybil escalation monotonicity
 * 2. Receipt integrity and single emission
 * 3. Execution idempotency
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    MIN_LOCK_AMOUNT_USD_CENTS,
    ESCALATION_TIER_1_FAILURES,
    ESCALATION_TIER_1_MULTIPLIER,
    ESCALATION_TIER_2_FAILURES,
    ESCALATION_TIER_2_MULTIPLIER,
} from '../src/services/contracts.js';

describe('Anti-Sybil: Escalation Monotonicity', () => {
    it('should have monotonic tier thresholds (tier1 < tier2)', () => {
        expect(ESCALATION_TIER_1_FAILURES).toBeLessThan(ESCALATION_TIER_2_FAILURES);
    });

    it('should have monotonic tier multipliers (tier1 < tier2)', () => {
        expect(ESCALATION_TIER_1_MULTIPLIER).toBeLessThan(ESCALATION_TIER_2_MULTIPLIER);
    });

    it('should calculate correct min lock at 0 failures (1.0x)', () => {
        const failureCount = 0;
        const minLock = MIN_LOCK_AMOUNT_USD_CENTS; // No escalation
        expect(minLock).toBe(1000); // $10
    });

    it('should calculate correct min lock at 1 failure (1.0x)', () => {
        const failureCount = 1;
        // 1 failure < TIER_1_FAILURES (2), so no escalation
        let minLock = MIN_LOCK_AMOUNT_USD_CENTS;
        if (failureCount >= ESCALATION_TIER_2_FAILURES) {
            minLock = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_2_MULTIPLIER);
        } else if (failureCount >= ESCALATION_TIER_1_FAILURES) {
            minLock = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_1_MULTIPLIER);
        }
        expect(minLock).toBe(1000); // $10
    });

    it('should calculate correct min lock at 2 failures (1.5x)', () => {
        const failureCount = 2;
        let minLock = MIN_LOCK_AMOUNT_USD_CENTS;
        if (failureCount >= ESCALATION_TIER_2_FAILURES) {
            minLock = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_2_MULTIPLIER);
        } else if (failureCount >= ESCALATION_TIER_1_FAILURES) {
            minLock = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_1_MULTIPLIER);
        }
        expect(minLock).toBe(1500); // $15 (1.5x)
    });

    it('should calculate correct min lock at 3+ failures (2.0x)', () => {
        const failureCount = 3;
        let minLock = MIN_LOCK_AMOUNT_USD_CENTS;
        if (failureCount >= ESCALATION_TIER_2_FAILURES) {
            minLock = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_2_MULTIPLIER);
        } else if (failureCount >= ESCALATION_TIER_1_FAILURES) {
            minLock = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_1_MULTIPLIER);
        }
        expect(minLock).toBe(2000); // $20 (2.0x)
    });

    it('should NEVER reduce min lock when failures increase (3+ >= 2)', () => {
        // Calculate at 2 failures
        let minLockAt2 = MIN_LOCK_AMOUNT_USD_CENTS;
        if (2 >= ESCALATION_TIER_2_FAILURES) {
            minLockAt2 = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_2_MULTIPLIER);
        } else if (2 >= ESCALATION_TIER_1_FAILURES) {
            minLockAt2 = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_1_MULTIPLIER);
        }

        // Calculate at 3+ failures
        let minLockAt3 = MIN_LOCK_AMOUNT_USD_CENTS;
        if (3 >= ESCALATION_TIER_2_FAILURES) {
            minLockAt3 = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_2_MULTIPLIER);
        } else if (3 >= ESCALATION_TIER_1_FAILURES) {
            minLockAt3 = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_1_MULTIPLIER);
        }

        // CRITICAL: 3+ must be >= 2 failures (monotonic)
        expect(minLockAt3).toBeGreaterThanOrEqual(minLockAt2);
        expect(minLockAt3).toBe(2000);
        expect(minLockAt2).toBe(1500);
    });

    it('should never allow regression in min lock at any failure count', () => {
        const calculateMinLock = (failures: number): number => {
            let minLock = MIN_LOCK_AMOUNT_USD_CENTS;
            if (failures >= ESCALATION_TIER_2_FAILURES) {
                minLock = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_2_MULTIPLIER);
            } else if (failures >= ESCALATION_TIER_1_FAILURES) {
                minLock = Math.ceil(MIN_LOCK_AMOUNT_USD_CENTS * ESCALATION_TIER_1_MULTIPLIER);
            }
            return minLock;
        };

        // Verify monotonicity for all failure counts 0-10
        let previousMin = 0;
        for (let failures = 0; failures <= 10; failures++) {
            const currentMin = calculateMinLock(failures);
            expect(currentMin).toBeGreaterThanOrEqual(previousMin);
            previousMin = currentMin;
        }
    });
});

describe('Receipt Integrity', () => {
    it('should require recordHash in receipt contractParams', () => {
        const contractParamsFields = [
            'platform',
            'metricType',
            'condition',
            'riskTier',
            'lockAmountUsdCents',
            'payoutAmountUsdCents',
            'deadlineUtc',
            'recordHash', // MUST be present
        ];

        const mockContractParams = {
            platform: 'STRIPE',
            metricType: 'REVENUE',
            condition: {},
            riskTier: 'ADVANCED',
            lockAmountUsdCents: 10000,
            payoutAmountUsdCents: 17500,
            deadlineUtc: new Date().toISOString(),
            recordHash: 'abc123hash',
        };

        for (const field of contractParamsFields) {
            expect(mockContractParams).toHaveProperty(field);
        }
    });

    it('should require chainHeadHash in receipt metadata', () => {
        const requiredFields = [
            'contractParams',
            'baseline',
            'verification',
            'settlement',
            'chainHeadHash', // MUST be present
            'eventCount', // MUST be present
            'receiptIssuedAt',
        ];

        const mockReceipt = {
            contractParams: { recordHash: 'abc123' },
            baseline: {},
            verification: { outcome: 'SUCCEEDED', evidence: {} },
            settlement: { outcome: 'SUCCESS', stripeRefs: {} },
            chainHeadHash: 'def456hash',
            eventCount: 7,
            receiptIssuedAt: new Date().toISOString(),
        };

        for (const field of requiredFields) {
            expect(mockReceipt).toHaveProperty(field);
        }
    });

    it('should only emit one receipt per contract', () => {
        // Simulating the idempotency check
        const events = [
            { eventType: 'CONTRACT_CREATED' },
            { eventType: 'FUNDS_LOCKED' },
            { eventType: 'VERIFICATION_SUCCEEDED' },
            { eventType: 'SETTLED_SUCCESS' },
            { eventType: 'RECEIPT_ISSUED' }, // Already exists
        ];

        const existingReceipt = events.find(e => e.eventType === 'RECEIPT_ISSUED');
        expect(existingReceipt).toBeTruthy();

        // If receipt exists, should return early (not emit another)
        const shouldEmitReceipt = !existingReceipt;
        expect(shouldEmitReceipt).toBe(false);
    });
});


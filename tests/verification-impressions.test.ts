/**
 * Verification Tests - X Impressions Logic
 * 
 * SKIPPED FOR V1: IMPRESSIONS metric is not supported yet.
 * xAdapter.evaluate only supports FOLLOWERS in V1.
 * These tests verify the future Outcome Coverage Slice 1 requirements:
 * - Metric: IMPRESSIONS
 * - Platform: X
 * - Evidence structure correctness
 * - Success/Failure paths
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { db } from '../src/db/client.js';
import { contracts, EventType, ContractStatus } from '../src/db/schema.js';
import { verifyContract } from '../src/services/verification.js';
import * as ledger from '../src/services/ledger.js';
import * as jobLock from '../src/services/job-lock.js';
import { xAdapter, setXClient, MockXClient } from '../src/adapters/x.js';

// Mock DB, Ledger, and Job Lock
vi.mock('../src/db/client.js');
vi.mock('../src/services/ledger.js');
vi.mock('../src/services/job-lock.js');

// SKIPPED: IMPRESSIONS not supported in V1 - only FOLLOWERS
describe.skip('Verification: X Impressions', () => {
    const mockContractId = 'contract-impressions-1';
    const mockNow = new Date('2025-06-01T12:00:00Z');
    const mockDeadline = new Date('2025-05-31T12:00:00Z'); // Deadline passed
    const mockCreatedAt = new Date('2025-05-01T12:00:00Z');
    // Activation happened later 
    const mockActivationAt = new Date('2025-05-02T10:00:00Z');

    const baseContract = {
        id: mockContractId,
        platform: 'X',
        metricType: 'IMPRESSIONS',
        status: ContractStatus.LOCKED,
        createdAt: mockCreatedAt,
        deadlineUtc: mockDeadline,
        conditionJson: { operator: 'GTE', threshold: 10000 }, // Target: 10k impressions
        lockAmountUsdCents: 5000,
    };

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(mockNow);
        vi.resetAllMocks();

        // Mock job lock to always acquire successfully
        vi.spyOn(jobLock, 'tryAcquireLock').mockResolvedValue({ acquired: true, lockId: 'mock-lock' });
        vi.spyOn(jobLock, 'getNextRetryTime').mockResolvedValue(null);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('should use activation event timestamp as window start', async () => {
        // Setup successful deterministic client
        setXClient(new MockXClient(12500)); // 12.5k observed

        vi.spyOn(db, 'select').mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([baseContract]),
                }),
            }),
        } as any);

        const lockedEvents = [
            { eventType: EventType.CONTRACT_CREATED, id: 'e1', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_AUTHORIZED, id: 'e2', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_LOCKED, id: 'e3', timestampUtc: mockCreatedAt },
            { eventType: EventType.EXECUTION_CONFIRMED, id: 'e4', timestampUtc: mockActivationAt }, // ACTIVATION
        ];
        vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue(lockedEvents as any);
        vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'e_ver' } as any);

        const result = await verifyContract(mockContractId);

        expect(result.success).toBe(true);
        // Check evidence payload for correct window start
        // Note: verifyContract depends on VERIFICATION_STARTED which might be appended first
        // We need to find VERIFICATION_SUCCEEDED or VERIFICATION_FAILED
        const calls = (ledger.appendEvent as any).mock.calls;
        const resultEventParams = calls.find((c: any) =>
            c[0].eventType === EventType.VERIFICATION_SUCCEEDED ||
            c[0].eventType === EventType.VERIFICATION_FAILED
        )[0];

        const evidence = resultEventParams.metadata.evidence;
        expect(evidence.windowStartUtc).toBe(mockActivationAt.toISOString());
        expect(evidence.windowStartUtc).not.toBe(mockCreatedAt.toISOString());
    });

    // NOTE: Testing "missing activation event" is practically impossible with strict state derivation
    // because deriving LOCKED state requires the event to exist. 
    // We skip that negative test as protected by type system and state machine.

    it('should verify SUCCESS deterministically with MockXClient', async () => {
        setXClient(new MockXClient(11000)); // Exactly 11000, threshold 10000

        vi.spyOn(db, 'select').mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([baseContract]),
                }),
            }),
        } as any);

        const lockedEvents = [
            { eventType: EventType.CONTRACT_CREATED, id: 'e1', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_AUTHORIZED, id: 'e2', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_LOCKED, id: 'e3', timestampUtc: mockCreatedAt },
            { eventType: EventType.EXECUTION_CONFIRMED, id: 'e4', timestampUtc: mockActivationAt },
        ];
        vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue(lockedEvents as any);
        vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'e_ver' } as any);

        const result = await verifyContract(mockContractId);

        expect(result.success).toBe(true);
        expect(result.pass).toBe(true);
        expect(result.observedValue).toBe(11000);
    });

    it('should verify FAILURE deterministically with MockXClient', async () => {
        setXClient(new MockXClient(9000)); // Below 10000

        vi.spyOn(db, 'select').mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([baseContract]),
                }),
            }),
        } as any);

        const lockedEvents = [
            { eventType: EventType.CONTRACT_CREATED, id: 'e1', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_AUTHORIZED, id: 'e2', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_LOCKED, id: 'e3', timestampUtc: mockCreatedAt },
            { eventType: EventType.EXECUTION_CONFIRMED, id: 'e4', timestampUtc: mockActivationAt },
        ];
        vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue(lockedEvents as any);
        vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'e_ver_fail' } as any);

        const result = await verifyContract(mockContractId);

        expect(result.success).toBe(true);
        expect(result.pass).toBe(false);
        expect(result.observedValue).toBe(9000);
    });

    it('should include all required evidence fields in payload', async () => {
        setXClient(new MockXClient(12500)); // Ensure a passing result for evidence check

        // Mock DB: Return contract
        vi.spyOn(db, 'select').mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([baseContract]),
                }),
            }),
        } as any);

        // Mock Ledger: Events to derive LOCKED state
        const lockedEvents = [
            { eventType: EventType.CONTRACT_CREATED, id: 'e1', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_AUTHORIZED, id: 'e2', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_LOCKED, id: 'e3', timestampUtc: mockCreatedAt },
            { eventType: EventType.EXECUTION_CONFIRMED, id: 'e4', timestampUtc: mockActivationAt },
        ];
        vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue(lockedEvents as any);
        vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'e_ver_ev' } as any);

        const result = await verifyContract(mockContractId);

        expect(result.success).toBe(true);
        const evidence = result.evidence as any;

        // Requirement:
        // observedImpressions, threshold, windowStartUtc, windowEndUtc, measuredAtUtc, source="X"
        expect(evidence.source).toBe('X');
        expect(evidence.windowStartUtc).toBe(mockActivationAt.toISOString());
        expect(evidence.windowEndUtc).toBe(mockDeadline.toISOString());
        expect(evidence.measuredAtUtc).toBeDefined();
        expect(typeof evidence.observedImpressions).toBe('number');
        expect(evidence.threshold).toBe(10000);
        expect(evidence.adapterRequestId).toBeDefined();
    });
});

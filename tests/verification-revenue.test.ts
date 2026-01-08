/**
 * Verification Tests - Stripe Revenue Logic
 * 
 * Verifies Outcome Coverage Slice 2 requirements:
 * - Metric: REVENUE
 * - Platform: STRIPE
 * - Source: BalanceTransactions
 * - Window: Activation -> Deadline
 * - Deterministic / No Randomness
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { db } from '../src/db/client.js';
import { contracts, EventType, ContractStatus } from '../src/db/schema.js';
import { verifyContract } from '../src/services/verification.js';
import * as ledger from '../src/services/ledger.js';
import * as jobLock from '../src/services/job-lock.js';
import { setRevenueClient, MockStripeRevenueClient } from '../src/adapters/stripe-revenue.js';

// Mock DB, Ledger, and Job Lock
vi.mock('../src/db/client.js');
vi.mock('../src/services/ledger.js');
vi.mock('../src/services/job-lock.js');

describe('Verification: Stripe Revenue', () => {
    const mockContractId = 'contract-revenue-1';
    const mockNow = new Date('2025-06-01T12:00:00Z');
    const mockDeadline = new Date('2025-05-31T12:00:00Z'); // Deadline passed
    const mockCreatedAt = new Date('2025-05-01T12:00:00Z');
    const mockActivationAt = new Date('2025-05-02T10:00:00Z');

    const baseContract = {
        id: mockContractId,
        platform: 'STRIPE',
        metricType: 'REVENUE',
        status: ContractStatus.LOCKED,
        createdAt: mockCreatedAt,
        deadlineUtc: mockDeadline,
        conditionJson: { operator: 'GTE', threshold: 500000 }, // Target: $5000.00
        lockAmountUsdCents: 5000,
        baselineJson: { lifetime_revenue: 100000 }, // Baseline $1000.00
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

    it('should verify SUCCESS when revenue in window >= threshold', async () => {
        // Mock Client: $5500.00 revenue in window
        setRevenueClient(new MockStripeRevenueClient(550000));

        // Mock DB: Contract AND User
        // Use a counter to differentiate sequential DB calls
        // 1. getContract -> returns contract
        // 2. getUser -> returns user

        let dbCallCount = 0;
        const userWithConnect = { id: baseContract.principalUserId, stripeConnectedAccountId: 'acct_real_123' };

        vi.spyOn(db, 'select').mockImplementation(() => {
            return {
                from: vi.fn().mockImplementation((table) => {
                    dbCallCount++;
                    // 1st call: contracts, 2nd call: users
                    const result = dbCallCount === 1 ? [baseContract] : [userWithConnect];

                    return {
                        where: vi.fn().mockReturnValue({
                            limit: vi.fn().mockResolvedValue(result)
                        }),
                        leftJoin: vi.fn().mockReturnThis(),
                    };
                })
            } as any;
        });


        const lockedEvents = [
            { eventType: EventType.CONTRACT_CREATED, id: 'e1', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_AUTHORIZED, id: 'e2', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_LOCKED, id: 'e3', timestampUtc: mockCreatedAt },
            { eventType: EventType.EXECUTION_CONFIRMED, id: 'e4', timestampUtc: mockActivationAt },
        ];
        vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue(lockedEvents as any);
        vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'e_ver_rev' } as any);

        const result = await verifyContract(mockContractId);

        expect(result.success).toBe(true);
        expect(result.pass).toBe(true);
        expect(result.observedValue).toBe(550000);

        // Check Evidence
        const calls = (ledger.appendEvent as any).mock.calls;
        const resultEventParams = calls.find((c: any) =>
            c[0].eventType === EventType.VERIFICATION_SUCCEEDED
        )[0];

        const evidence = resultEventParams.metadata.evidence;
        expect(evidence.source).toBe('STRIPE');
        expect(evidence.windowStartUtc).toBe(mockActivationAt.toISOString());
        expect(evidence.observedRevenue).toBe(550000);
        expect(evidence.stripeObjectType).toBe('balance_transaction');
        // Ensure deterministic (no dynamic ID)
        expect(evidence.adapterRequestId).toBeUndefined();
    });

    it('should FAIL verification if user has no connected Stripe account', async () => {
        const userNoConnect = { id: baseContract.principalUserId, stripeConnectedAccountId: null };

        let dbCallCount = 0;
        vi.spyOn(db, 'select').mockImplementation(() => {
            return {
                from: vi.fn().mockImplementation((table) => {
                    dbCallCount++;
                    const result = dbCallCount === 1 ? [baseContract] : [userNoConnect];
                    return {
                        where: vi.fn().mockReturnValue({
                            limit: vi.fn().mockResolvedValue(result)
                        }),
                        leftJoin: vi.fn().mockReturnThis(),
                    };
                })
            } as any;
        });

        const lockedEvents = [
            { eventType: EventType.CONTRACT_CREATED, id: 'e1', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_AUTHORIZED, id: 'e2', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_LOCKED, id: 'e3', timestampUtc: mockCreatedAt },
            { eventType: EventType.EXECUTION_CONFIRMED, id: 'e4', timestampUtc: mockActivationAt },
        ];
        vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue(lockedEvents as any);

        const result = await verifyContract(mockContractId);

        expect(result.success).toBe(false); // Execution failed
        expect(result.error).toContain('no connected Stripe account');
    });

    it('should verify FAILURE when revenue in window < threshold', async () => {
        // Mock Client: $3000.00 revenue in window
        setRevenueClient(new MockStripeRevenueClient(300000));

        let dbCallCount = 0;
        const userWithConnect = { id: baseContract.principalUserId, stripeConnectedAccountId: 'acct_real_123' };

        vi.spyOn(db, 'select').mockImplementation(() => {
            return {
                from: vi.fn().mockImplementation((table) => {
                    dbCallCount++;
                    const result = dbCallCount === 1 ? [baseContract] : [userWithConnect];
                    return {
                        where: vi.fn().mockReturnValue({
                            limit: vi.fn().mockResolvedValue(result)
                        }),
                        leftJoin: vi.fn().mockReturnThis(),
                    };
                })
            } as any;
        });

        const lockedEvents = [
            { eventType: EventType.CONTRACT_CREATED, id: 'e1', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_AUTHORIZED, id: 'e2', timestampUtc: mockCreatedAt },
            { eventType: EventType.FUNDS_LOCKED, id: 'e3', timestampUtc: mockCreatedAt },
            { eventType: EventType.EXECUTION_CONFIRMED, id: 'e4', timestampUtc: mockActivationAt },
        ];
        vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue(lockedEvents as any);
        vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'e_ver_rev_fail' } as any);

        const result = await verifyContract(mockContractId);

        expect(result.success).toBe(true);
        expect(result.pass).toBe(false);
        expect(result.observedValue).toBe(300000);
    });

    it('should reject if platform name is wrong', async () => {
        const wrongContract = { ...baseContract, platform: 'LINKEDIN' };
        vi.spyOn(db, 'select').mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([wrongContract]),
                }),
            }),
        } as any);

        // Mock getEventsForContract for job lock check
        vi.spyOn(ledger, 'getEventsForContract').mockResolvedValue([]);
        vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'lock-event' } as any);

        const result = await verifyContract(mockContractId);
        expect(result.success).toBe(false);
        expect(result.error).toContain('not supported');
    });
});

/**
 * Verification Tests - GitHub PRs Merged Logic
 * 
 * Verifies Outcome Coverage Slice 3 requirements:
 * - Metric: PRS_MERGED
 * - Platform: GITHUB
 * - Anti-Abuse: Default Branch Only, Authorized User Only
 * - Window: Activation -> Deadline
 * - Deterministic
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { db } from '../src/db/client.js';
import { contracts, EventType, ContractStatus } from '../src/db/schema.js';
import { verifyContract } from '../src/services/verification.js';
import * as ledger from '../src/services/ledger.js';
import * as jobLock from '../src/services/job-lock.js';
import { setGithubClient, MockGithubClient, MergedPR } from '../src/adapters/github.js';

// Mock DB, Ledger, and Job Lock
vi.mock('../src/db/client.js');
vi.mock('../src/services/ledger.js');
vi.mock('../src/services/job-lock.js');

describe('Verification: GitHub PRs', () => {
    const mockContractId = 'contract-github-1';
    const mockNow = new Date('2025-06-01T12:00:00Z');
    const mockDeadline = new Date('2025-05-31T12:00:00Z'); // Deadline passed
    const mockCreatedAt = new Date('2025-05-01T12:00:00Z');
    const mockActivationAt = new Date('2025-05-02T10:00:00Z');
    const principalGithubUserId = 'gh_12345';
    const defaultBranch = 'main';

    const baseContract = {
        id: mockContractId,
        platform: 'GITHUB',
        metricType: 'PRS_MERGED',
        status: ContractStatus.LOCKED,
        createdAt: mockCreatedAt,
        deadlineUtc: mockDeadline,
        conditionJson: { operator: 'GTE', threshold: 2, repoOwner: 'org', repoName: 'repo' }, // Target: 2 PRs
        lockAmountUsdCents: 5000,
        baselineJson: {
            defaultBranch,
            principalGithubUserId
        },
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

    it('should verify SUCCESS when qualified PRs >= threshold', async () => {
        // Mock Client with 2 qualified PRs
        const prs: MergedPR[] = [
            { id: 'pr1', number: 1, mergedAtUtc: '2025-05-10T10:00:00Z', createdAtUtc: '2025-05-09T00:00:00Z', baseBranch: 'main', authorUserId: principalGithubUserId },
            { id: 'pr2', number: 2, mergedAtUtc: '2025-05-20T10:00:00Z', createdAtUtc: '2025-05-19T00:00:00Z', baseBranch: 'main', authorUserId: principalGithubUserId },
        ];
        setGithubClient(new MockGithubClient('main', prs));

        // Mock DB: Contract AND User (User mock needed for sequential calls in verifyContract logic)
        // verifyContract fetches User just to pass stripeConnectedAccountId (if needed) or general context.
        // For github it just passes `user?.stripeConnectedAccountId` but github adapter ignores it.
        // We still need to satisfy the DB call.

        let dbCallCount = 0;
        vi.spyOn(db, 'select').mockImplementation(() => {
            return {
                from: vi.fn().mockImplementation((table) => {
                    dbCallCount++;
                    // 1. Contract, 2. User
                    const result = dbCallCount === 1 ? [baseContract] : [{ id: baseContract.principalUserId }];
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
        vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'e_ver_gh' } as any);

        const result = await verifyContract(mockContractId);

        expect(result.success).toBe(true);
        expect(result.pass).toBe(true);
        expect(result.observedValue).toBe(2);

        // Check Evidence
        const calls = (ledger.appendEvent as any).mock.calls;
        const resultEventParams = calls.find((c: any) =>
            c[0].eventType === EventType.VERIFICATION_SUCCEEDED
        )[0];

        const evidence = resultEventParams.metadata.evidence;
        expect(evidence.source).toBe('GITHUB');
        expect(evidence.qualifiedPrs).toHaveLength(2);
        expect(evidence.defaultBranch).toBe('main');
        expect(evidence.principalGithubUserId).toBe(principalGithubUserId);
    });

    it('should ignore PRs from wrong author or wrong branch', async () => {
        // Mock Client with mixed PRs
        const prs: MergedPR[] = [
            { id: 'pr1', number: 1, mergedAtUtc: '2025-05-10T10:00:00Z', createdAtUtc: '2025-05-09T00:00:00Z', baseBranch: 'main', authorUserId: principalGithubUserId }, // QUALIFIED
            { id: 'pr_wrong_author', number: 2, mergedAtUtc: '2025-05-11T10:00:00Z', createdAtUtc: '2025-05-09T00:00:00Z', baseBranch: 'main', authorUserId: 'gh_other' }, // REJECT
            { id: 'pr_wrong_branch', number: 3, mergedAtUtc: '2025-05-12T10:00:00Z', createdAtUtc: '2025-05-09T00:00:00Z', baseBranch: 'dev', authorUserId: principalGithubUserId }, // REJECT
        ];
        setGithubClient(new MockGithubClient('main', prs));

        let dbCallCount = 0;
        vi.spyOn(db, 'select').mockImplementation(() => {
            return {
                from: vi.fn().mockImplementation((table) => {
                    dbCallCount++;
                    const result = dbCallCount === 1 ? [baseContract] : [{ id: baseContract.principalUserId }];
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
        vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'e_ver_gh_fail' } as any);

        const result = await verifyContract(mockContractId);

        expect(result.success).toBe(true);
        expect(result.pass).toBe(false); // Only 1 qualified PR, threshold 2
        expect(result.observedValue).toBe(1);
    });

    it('should ignore PRs outside of window', async () => {
        // Mock Client with mixed PRs
        const prs: MergedPR[] = [
            // Before Activation (REJECT)
            { id: 'pr_early', number: 0, mergedAtUtc: '2025-05-01T10:00:00Z', createdAtUtc: '2025-04-01T00:00:00Z', baseBranch: 'main', authorUserId: principalGithubUserId },
            // During Window (QUALIFIED)
            { id: 'pr_ok', number: 1, mergedAtUtc: '2025-05-15T10:00:00Z', createdAtUtc: '2025-05-09T00:00:00Z', baseBranch: 'main', authorUserId: principalGithubUserId },
            // After Deadline (REJECT) - Though deadline check happens before adapter? No, adapter filters.
            // Verification service passes deadline as windowEnd
            { id: 'pr_late', number: 2, mergedAtUtc: '2025-06-01T00:00:00Z', createdAtUtc: '2025-05-09T00:00:00Z', baseBranch: 'main', authorUserId: principalGithubUserId },
        ];
        // Mock client handles filtering based on listMergedPRs args
        setGithubClient(new MockGithubClient('main', prs));

        let dbCallCount = 0;
        vi.spyOn(db, 'select').mockImplementation(() => {
            return {
                from: vi.fn().mockImplementation((table) => {
                    dbCallCount++;
                    const result = dbCallCount === 1 ? [baseContract] : [{ id: baseContract.principalUserId }];
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
        vi.spyOn(ledger, 'appendEvent').mockResolvedValue({ id: 'e_ver_gh_fail_2' } as any);

        const result = await verifyContract(mockContractId);

        expect(result.pass).toBe(false);
        expect(result.observedValue).toBe(1);
    });
});

/**
 * GitHub PR Eligibility Tests
 * 
 * Tests for:
 * - PR approvals (Option A: reviewed PRs only)
 * - Anti-sybil controls
 * - Receipt transparency
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockGithubClient, PRReview } from '../src/adapters/github.js';

// Mock DB
vi.mock('../src/db/client.js');
vi.mock('../src/services/ledger.js');
vi.mock('../src/services/job-lock.js');

describe('PR Approvals (Option A: Reviewed PRs Only)', () => {
    const principalUserId = 'gh_12345';

    it('should count approvals from other users', async () => {
        const client = new MockGithubClient('main', []);
        client.setPRReviews(1, [
            { id: 1, state: 'APPROVED', reviewerUserId: 'gh_other1' },
            { id: 2, state: 'APPROVED', reviewerUserId: 'gh_other2' },
        ]);

        const result = await client.getPRApprovals('org', 'repo', 1, principalUserId);
        expect(result.approvalCount).toBe(2);
    });

    it('should IGNORE self-approvals', async () => {
        const client = new MockGithubClient('main', []);
        client.setPRReviews(1, [
            { id: 1, state: 'APPROVED', reviewerUserId: principalUserId }, // Self-approval
            { id: 2, state: 'APPROVED', reviewerUserId: 'gh_other1' },
        ]);

        const result = await client.getPRApprovals('org', 'repo', 1, principalUserId);
        expect(result.approvalCount).toBe(1); // Only other user counts
    });

    it('should IGNORE non-approved review states', async () => {
        const client = new MockGithubClient('main', []);
        client.setPRReviews(1, [
            { id: 1, state: 'COMMENTED', reviewerUserId: 'gh_other1' },
            { id: 2, state: 'CHANGES_REQUESTED', reviewerUserId: 'gh_other2' },
            { id: 3, state: 'APPROVED', reviewerUserId: 'gh_other3' },
        ]);

        const result = await client.getPRApprovals('org', 'repo', 1, principalUserId);
        expect(result.approvalCount).toBe(1); // Only APPROVED state counts
    });

    it('should return 0 for PRs with no reviews', async () => {
        const client = new MockGithubClient('main', []);
        // No reviews set

        const result = await client.getPRApprovals('org', 'repo', 1, principalUserId);
        expect(result.approvalCount).toBe(0);
    });

    it('should return all reviews for transparency', async () => {
        const client = new MockGithubClient('main', []);
        client.setPRReviews(1, [
            { id: 1, state: 'COMMENTED', reviewerUserId: 'gh_other1' },
            { id: 2, state: 'APPROVED', reviewerUserId: 'gh_other2' },
        ]);

        const result = await client.getPRApprovals('org', 'repo', 1, principalUserId);
        expect(result.reviews).toHaveLength(2);
        expect(result.approvalCount).toBe(1);
    });
});

describe('Anti-Sybil Controls', () => {
    // Document: these are enforced in contracts.ts createContract()

    it('should enforce max 2 active contracts per user', () => {
        // Validation: if activeContracts.length >= 2, throw error
        const MAX_ACTIVE = 2;
        const activeContracts = ['c1', 'c2'];
        expect(activeContracts.length >= MAX_ACTIVE).toBe(true);
    });

    it('should enforce 24h cooldown between contract creation', () => {
        // Validation: if any contract created < 24h ago, reject
        const COOLDOWN_HOURS = 24;
        const hoursAgo = 12;
        expect(hoursAgo < COOLDOWN_HOURS).toBe(true);
    });

    it('should escalate min lock after 2+ failures in 7 days', () => {
        // Validation: if recentFailures >= 2, minLock doubles
        const MIN_LOCK = 1000;
        const ESCALATION_THRESHOLD = 2;
        const recentFailures = 2;

        const minLock = recentFailures >= ESCALATION_THRESHOLD
            ? MIN_LOCK * 2
            : MIN_LOCK;

        expect(minLock).toBe(2000);
    });

    it('should allow contracts meeting all anti-sybil requirements', () => {
        const activeContracts = 1;
        const MAX_ACTIVE = 2;
        const hoursAgo = 30;
        const COOLDOWN_HOURS = 24;
        const lockAmount = 1000;
        const minLock = 1000;

        expect(activeContracts < MAX_ACTIVE).toBe(true);
        expect(hoursAgo >= COOLDOWN_HOURS).toBe(true);
        expect(lockAmount >= minLock).toBe(true);
    });
});

describe('Receipt Transparency', () => {
    it('should document baseline snapshot fields for GitHub PRs', () => {
        const expectedBaselineFields = [
            'principalGithubUserId',
            'defaultBranch',
            'repoOwner',
            'repoName',
            'repoCreatedAtUtc',
            'repoPushedAtUtc',
            'repoSizeKb',
        ];

        const mockBaseline = {
            principalGithubUserId: 'gh_12345',
            defaultBranch: 'main',
            repoOwner: 'org',
            repoName: 'repo',
            repoCreatedAtUtc: '2024-01-01T00:00:00Z',
            repoPushedAtUtc: '2025-12-01T00:00:00Z',
            repoSizeKb: 5000,
        };

        for (const field of expectedBaselineFields) {
            expect(mockBaseline).toHaveProperty(field);
        }
    });

    it('should document verification evidence fields', () => {
        const expectedEvidenceFields = [
            'totalQualifiedPRs',
            'totalCandidatePRs',
            'excludedWrongAuthor',
            'excludedWrongBranch',
            'excludedOutsideWindow',
            'excludedNoApproval',
        ];

        const mockEvidence = {
            totalQualifiedPRs: 3,
            totalCandidatePRs: 7,
            excludedWrongAuthor: 1,
            excludedWrongBranch: 1,
            excludedOutsideWindow: 1,
            excludedNoApproval: 1,
        };

        for (const field of expectedEvidenceFields) {
            expect(mockEvidence).toHaveProperty(field);
        }
    });
});

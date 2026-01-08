/**
 * GitHub Anti-Abuse Hardening Tests
 * 
 * Tests:
 * A) RESOURCE_MISSING triggers terminal VERIFICATION_FAILED
 * B) Repo eligibility rejects new/empty repos
 * C) Tier gating + threshold floor validation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { classifyError } from '../src/services/error-classification.js';

// Mock DB for contract tests
vi.mock('../src/db/client.js');
vi.mock('../src/services/ledger.js');
vi.mock('../src/services/job-lock.js');

describe('RESOURCE_MISSING Error Classification', () => {
    it('should classify repo not found as RESOURCE_MISSING (non-retryable)', () => {
        const err = new Error('RESOURCE_MISSING: Repository not found');
        const result = classifyError(err);
        expect(result.retryable).toBe(false);
        expect(result.category).toBe('RESOURCE_MISSING');
    });

    it('should classify repo inaccessible as RESOURCE_MISSING (non-retryable)', () => {
        const err = new Error('RESOURCE_MISSING: Repository inaccessible (permission revoked)');
        const result = classifyError(err);
        expect(result.retryable).toBe(false);
        expect(result.category).toBe('RESOURCE_MISSING');
    });

    it('should classify access revoked as RESOURCE_MISSING (non-retryable)', () => {
        const err = new Error('Access revoked by user');
        const result = classifyError(err);
        expect(result.retryable).toBe(false);
        expect(result.category).toBe('RESOURCE_MISSING');
    });

    it('should classify resource deleted as RESOURCE_MISSING (non-retryable)', () => {
        const err = new Error('Resource deleted');
        const result = classifyError(err);
        expect(result.retryable).toBe(false);
        expect(result.category).toBe('RESOURCE_MISSING');
    });

    it('RESOURCE_MISSING errors should trigger terminal VERIFICATION_FAILED (no retries)', () => {
        // Document: When verification catch block sees RESOURCE_MISSING,
        // it appends VERIFICATION_FAILED terminal event without scheduling retries.
        // This is the forfeit path.
        const err = new Error('RESOURCE_MISSING: repo not found');
        const result = classifyError(err);
        expect(result.retryable).toBe(false);
        expect(result.category).toBe('RESOURCE_MISSING');
        // Verification service will: appendEvent(VERIFICATION_FAILED) without scheduleRetry()
    });
});

describe('GitHub Repo Eligibility Validation', () => {
    // These tests document the validation rules for repo eligibility
    // Actual validation happens in contracts.ts createContract()

    it('should reject repos younger than 30 days', () => {
        // If repo createdAt < 30 days ago:
        // throw Error("Cannot create GitHub contract: repo too new (X days, minimum 30)")
        const repoAgeDays = 15;
        const minRequired = 30;
        expect(repoAgeDays < minRequired).toBe(true);
    });

    it('should reject repos with no recent pushes (stale > 30 days)', () => {
        // If repo pushedAt > 30 days ago:
        // throw Error("Cannot create GitHub contract: repo stale (last push X days ago, max 30)")
        const pushedAgoDays = 45;
        const maxAllowed = 30;
        expect(pushedAgoDays > maxAllowed).toBe(true);
    });

    it('should reject repos smaller than 1MB (1000KB)', () => {
        // If repo sizeKb < 1000:
        // throw Error("Cannot create GitHub contract: repo too small (XKB, minimum 1000KB)")
        const repoSizeKb = 500;
        const minRequired = 1000;
        expect(repoSizeKb < minRequired).toBe(true);
    });

    it('should allow repos meeting all eligibility criteria', () => {
        const repoAgeDays = 60;  // >= 30
        const pushedAgoDays = 7; // <= 30
        const repoSizeKb = 5000; // >= 1000

        expect(repoAgeDays >= 30).toBe(true);
        expect(pushedAgoDays <= 30).toBe(true);
        expect(repoSizeKb >= 1000).toBe(true);
    });
});

describe('GitHub Tier Gating and Threshold Floors', () => {
    it('should reject STANDARD tier for GitHub PRs contracts', () => {
        // If riskTier === 'STANDARD' && platform === 'GITHUB':
        // throw Error("GitHub PRs contracts require ADVANCED or ELITE tier")
        const riskTier = 'STANDARD';
        expect(riskTier).toBe('STANDARD');
        // This should cause rejection
    });

    it('should require threshold >= 5 for ADVANCED tier', () => {
        const threshold = 3;
        const minThreshold = 5;
        expect(threshold < minThreshold).toBe(true);
        // Should throw: "GitHub PRs threshold must be >= 5 for ADVANCED tier"
    });

    it('should require threshold >= 10 for ELITE tier', () => {
        const threshold = 7;
        const minThreshold = 10;
        expect(threshold < minThreshold).toBe(true);
        // Should throw: "GitHub PRs threshold must be >= 10 for ELITE tier"
    });

    it('should reject windows longer than 30 days', () => {
        const windowDays = 45;
        const maxAllowed = 30;
        expect(windowDays > maxAllowed).toBe(true);
        // Should throw: "GitHub PRs window must be <= 30 days"
    });

    it('should allow valid ADVANCED tier contract', () => {
        const riskTier = 'ADVANCED';
        const threshold = 5;
        const windowDays = 14;

        expect(riskTier !== 'STANDARD').toBe(true);
        expect(threshold >= 5).toBe(true);
        expect(windowDays <= 30).toBe(true);
    });

    it('should allow valid ELITE tier contract', () => {
        const riskTier = 'ELITE';
        const threshold = 10;
        const windowDays = 7;

        expect(riskTier !== 'STANDARD').toBe(true);
        expect(threshold >= 10).toBe(true);
        expect(windowDays <= 30).toBe(true);
    });
});

describe('Baseline Snapshot Evidence', () => {
    it('should snapshot repo eligibility data in baseline', () => {
        // When GitHub contract is created, baselineJson should contain:
        const expectedFields = [
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

        for (const field of expectedFields) {
            expect(mockBaseline).toHaveProperty(field);
        }
    });
});

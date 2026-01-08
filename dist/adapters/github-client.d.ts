/**
 * Real GitHub Client
 *
 * Production implementation of GithubClient interface.
 * Uses GitHub REST API with pagination and rate-limit safety.
 *
 * Environment: GITHUB_TOKEN (Personal Access Token or GitHub App token)
 */
import type { GithubClient, MergedPR, PRReview } from './github.js';
/**
 * RealGithubClient - Production GitHub API implementation
 *
 * Features:
 * - Fetches repo default branch
 * - Queries merged PRs with all anti-abuse constraints
 * - Handles pagination (up to 100 items per page)
 * - Rate-limit aware (respects retry-after headers)
 */
export declare class RealGithubClient implements GithubClient {
    private token;
    constructor(token?: string);
    private fetch;
    /**
     * Fetch repo metadata for eligibility checks
     */
    getRepoMetadata(owner: string, repo: string): Promise<{
        defaultBranch: string;
        createdAt: Date;
        pushedAt: Date;
        sizeKb: number;
    }>;
    getRepoDefaultBranch(owner: string, repo: string): Promise<string>;
    /**
     * Get PR approvals (excluding self-approvals)
     * Uses: GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews
     */
    getPRApprovals(owner: string, repo: string, prNumber: number, principalUserId: string): Promise<{
        approvalCount: number;
        reviews: PRReview[];
    }>;
    listMergedPRs(owner: string, repo: string, baseBranch: string, start: Date, end: Date, authorUserId: string): Promise<MergedPR[]>;
    /**
     * Fetch PR detail with proper error classification.
     * - 404: returns null (deleted PR, skip)
     * - 403/429/5xx: throws (retryable, fail-closed)
     */
    private fetchPRDetail;
}
/**
 * Factory function to create the appropriate client based on environment.
 * In production (GITHUB_TOKEN set), returns RealGithubClient.
 * Otherwise, returns null (caller should use mock for tests).
 */
export declare function createRealGithubClient(): RealGithubClient | null;

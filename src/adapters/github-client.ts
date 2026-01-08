/**
 * Real GitHub Client
 * 
 * Production implementation of GithubClient interface.
 * Uses GitHub REST API with pagination and rate-limit safety.
 * 
 * Environment: GITHUB_TOKEN (Personal Access Token or GitHub App token)
 */

import type { GithubClient, MergedPR, PRReview } from './github.js';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * RealGithubClient - Production GitHub API implementation
 * 
 * Features:
 * - Fetches repo default branch
 * - Queries merged PRs with all anti-abuse constraints
 * - Handles pagination (up to 100 items per page)
 * - Rate-limit aware (respects retry-after headers)
 */
export class RealGithubClient implements GithubClient {
    private token: string;

    constructor(token?: string) {
        this.token = token || process.env.GITHUB_TOKEN || '';
        if (!this.token) {
            console.warn('⚠️ RealGithubClient: No GITHUB_TOKEN provided. API calls may be rate-limited.');
        }
    }

    private async fetch(url: string): Promise<Response> {
        const headers: Record<string, string> = {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, { headers });

        // Handle 429: Always rate limit
        if (response.status === 429) {
            const retryAfter = response.headers.get('retry-after');
            const resetTime = response.headers.get('x-ratelimit-reset');

            if (retryAfter) {
                const waitSeconds = parseInt(retryAfter, 10);
                throw new Error(`GitHub API rate limited. Retry after ${waitSeconds}s.`);
            } else if (resetTime) {
                const resetDate = new Date(parseInt(resetTime, 10) * 1000);
                throw new Error(`GitHub API rate limited. Resets at ${resetDate.toISOString()}.`);
            }
            throw new Error('GitHub API rate limited.');
        }

        // Handle 403: Distinguish rate-limit from permission revoked
        if (response.status === 403) {
            const retryAfter = response.headers.get('retry-after');
            const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
            const resetTime = response.headers.get('x-ratelimit-reset');

            // If rate-limit headers indicate exhaustion, treat as rate-limit (retryable)
            if (retryAfter || rateLimitRemaining === '0' || resetTime) {
                if (retryAfter) {
                    const waitSeconds = parseInt(retryAfter, 10);
                    throw new Error(`GitHub API rate limited. Retry after ${waitSeconds}s.`);
                } else if (resetTime) {
                    const resetDate = new Date(parseInt(resetTime, 10) * 1000);
                    throw new Error(`GitHub API rate limited. Resets at ${resetDate.toISOString()}.`);
                }
                throw new Error('GitHub API rate limited.');
            }

            // No rate-limit headers: Permission revoked / repo private (RESOURCE_MISSING)
            throw new Error('RESOURCE_MISSING: Repository inaccessible (permission revoked or repo private)');
        }

        // Handle 404: Resource deleted/missing
        if (response.status === 404) {
            throw new Error('RESOURCE_MISSING: Repository not found');
        }

        if (!response.ok) {
            const body = await response.text();
            throw new Error(`GitHub API error ${response.status}: ${body}`);
        }

        return response;
    }

    /**
     * Fetch repo metadata for eligibility checks
     */
    async getRepoMetadata(owner: string, repo: string): Promise<{
        defaultBranch: string;
        createdAt: Date;
        pushedAt: Date;
        sizeKb: number;
    }> {
        const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
        const response = await this.fetch(url);
        const data = await response.json() as {
            default_branch: string;
            created_at: string;
            pushed_at: string;
            size: number; // In KB
        };
        return {
            defaultBranch: data.default_branch,
            createdAt: new Date(data.created_at),
            pushedAt: new Date(data.pushed_at),
            sizeKb: data.size,
        };
    }

    async getRepoDefaultBranch(owner: string, repo: string): Promise<string> {
        const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
        const response = await this.fetch(url);
        const data = await response.json() as { default_branch: string };
        return data.default_branch;
    }

    /**
     * Get PR approvals (excluding self-approvals)
     * Uses: GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews
     */
    async getPRApprovals(
        owner: string,
        repo: string,
        prNumber: number,
        principalUserId: string
    ): Promise<{ approvalCount: number; reviews: PRReview[] }> {
        const reviews: PRReview[] = [];
        let page = 1;
        const perPage = 100;
        let hasMore = true;

        while (hasMore) {
            const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${prNumber}/reviews?per_page=${perPage}&page=${page}`;
            const response = await this.fetch(url);
            const data = await response.json() as Array<{
                id: number;
                state: string;
                user: { id: number } | null;
            }>;

            for (const review of data) {
                if (review.user) {
                    reviews.push({
                        id: review.id,
                        state: review.state as PRReview['state'],
                        reviewerUserId: String(review.user.id),
                    });
                }
            }

            hasMore = data.length === perPage;
            page++;

            // Safety limit
            if (page > 10) {
                console.warn(`RealGithubClient: Hit reviews pagination limit for PR #${prNumber}`);
                break;
            }
        }

        // Filter: APPROVED state, reviewer != principal
        const approvals = reviews.filter(r =>
            r.state === 'APPROVED' && r.reviewerUserId !== principalUserId
        );

        return {
            approvalCount: approvals.length,
            reviews,
        };
    }

    async listMergedPRs(
        owner: string,
        repo: string,
        baseBranch: string,
        start: Date,
        end: Date,
        authorUserId: string
    ): Promise<MergedPR[]> {
        // Use GitHub Search API for accurate windowed discovery
        // Query: repo:owner/repo type:pr is:merged base:branch merged:start..end

        const startStr = start.toISOString().split('T')[0]; // YYYY-MM-DD
        const endStr = end.toISOString().split('T')[0];

        const query = encodeURIComponent([
            `repo:${owner}/${repo}`,
            'type:pr',
            'is:merged',
            `base:${baseBranch}`,
            `merged:${startStr}..${endStr}`
        ].join(' '));

        const candidatePRs: { number: number }[] = [];
        let page = 1;
        const perPage = 100;
        let hasMore = true;

        // Step 1: Discovery via Search API
        while (hasMore) {
            const searchUrl = `${GITHUB_API_BASE}/search/issues?q=${query}&sort=updated&order=desc&per_page=${perPage}&page=${page}`;
            const response = await this.fetch(searchUrl);
            const data = await response.json() as GitHubSearchResponse;

            for (const item of data.items) {
                candidatePRs.push({ number: item.number });
            }

            // Check if more pages
            hasMore = data.items.length === perPage && candidatePRs.length < data.total_count;
            page++;

            // Safety limit
            if (page > 20) {
                console.warn('RealGithubClient: Hit search pagination limit (20 pages)');
                break;
            }
        }

        // Step 2: Fetch PR details and confirm numeric author ID
        const qualifiedPRs: MergedPR[] = [];

        for (const candidate of candidatePRs) {
            const prUrl = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${candidate.number}`;

            const prResponse = await this.fetchPRDetail(prUrl, candidate.number);

            // Skip if PR was deleted (404) or not fetchable for benign reasons
            if (!prResponse) continue;

            const pr = prResponse;

            // Skip if not actually merged
            if (!pr.merged_at) continue;

            const mergedAt = new Date(pr.merged_at);

            // Double-check window (search is date-only, we need timestamp precision)
            if (mergedAt < start || mergedAt > end) continue;

            // Confirm base branch
            if (pr.base?.ref !== baseBranch) continue;

            // Confirm numeric author ID (anti-abuse: immutable binding)
            const prAuthorId = pr.user?.id?.toString();
            if (prAuthorId !== authorUserId) continue;

            qualifiedPRs.push({
                id: pr.id.toString(),
                number: pr.number,
                mergedAtUtc: pr.merged_at,
                createdAtUtc: pr.created_at,
                baseBranch: pr.base.ref,
                authorUserId: prAuthorId,
            });
        }

        return qualifiedPRs;
    }

    /**
     * Fetch PR detail with proper error classification.
     * - 404: returns null (deleted PR, skip)
     * - 403/429/5xx: throws (retryable, fail-closed)
     */
    private async fetchPRDetail(url: string, prNumber: number): Promise<GitHubPullResponse | null> {
        const headers: Record<string, string> = {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, { headers });

        // 404: PR deleted or inaccessible - skip silently
        if (response.status === 404) {
            console.warn(`PR #${prNumber} not found (404), skipping.`);
            return null;
        }

        // Rate limited: fail-closed (retry later via VERIFYING state)
        if (response.status === 403 || response.status === 429) {
            const retryAfter = response.headers.get('retry-after');
            const resetTime = response.headers.get('x-ratelimit-reset');

            if (retryAfter) {
                throw new Error(`GitHub API rate limited fetching PR #${prNumber}. Retry after ${retryAfter}s. Verification should retry.`);
            } else if (resetTime) {
                const resetDate = new Date(parseInt(resetTime, 10) * 1000);
                throw new Error(`GitHub API rate limited fetching PR #${prNumber}. Resets at ${resetDate.toISOString()}. Verification should retry.`);
            }
            throw new Error(`GitHub API rate limited fetching PR #${prNumber}. Verification should retry.`);
        }

        // Server error: fail-closed (retry later)
        if (response.status >= 500) {
            throw new Error(`GitHub API server error (${response.status}) fetching PR #${prNumber}. Verification should retry.`);
        }

        // Other non-OK: fail-closed
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`GitHub API error ${response.status} fetching PR #${prNumber}: ${body}. Verification should retry.`);
        }

        return await response.json() as GitHubPullResponse;
    }
}

// GitHub API Response Types (minimal)
interface GitHubPullResponse {
    id: number;
    number: number;
    merged_at: string | null;
    created_at: string;
    user: {
        id: number;
        login: string;
    } | null;
    base: {
        ref: string;
    };
}

interface GitHubSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: {
        number: number;
        pull_request?: {
            merged_at: string | null;
        };
    }[];
}

/**
 * Factory function to create the appropriate client based on environment.
 * In production (GITHUB_TOKEN set), returns RealGithubClient.
 * Otherwise, returns null (caller should use mock for tests).
 */
export function createRealGithubClient(): RealGithubClient | null {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
        return new RealGithubClient(token);
    }
    return null;
}

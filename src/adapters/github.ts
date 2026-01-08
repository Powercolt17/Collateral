/**
 * GitHub Adapter
 * 
 * Outcome Spec:
 *   platform: 'GITHUB'
 *   metricType: 'PRS_MERGED'
 * 
 * Anti-Abuse Constraints:
 * - Count only PRs merged into DEFAULT branch.
 * - Count only PRs authored by the PRINCIPAL identity (immutable ID).
 * - Window: [EXECUTION_CONFIRMED, DEADLINE].
 * 
 * Source of Truth: GitHub API (Mocked for existing scope)
 */

import { Contract, User } from '../db/schema.js';

// =====================================================
// CLIENT ABSTRACTION (Deterministic)
// =====================================================

export interface MergedPR {
    id: string;
    number: number;
    mergedAtUtc: string; // ISO date
    createdAtUtc: string; // ISO date
    baseBranch: string;
    authorUserId: string;
}

export interface RepoMetadata {
    defaultBranch: string;
    createdAt: Date;
    pushedAt: Date;
    sizeKb: number;
}

export interface PRReview {
    id: number;
    state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING';
    reviewerUserId: string; // Numeric user ID
}

export interface GithubClient {
    getRepoDefaultBranch(owner: string, repo: string): Promise<string>;

    getRepoMetadata(owner: string, repo: string): Promise<RepoMetadata>;

    /**
     * Get approvals for a PR (excluding self-approvals)
     * Returns count of APPROVED reviews from users != principalUserId
     */
    getPRApprovals(
        owner: string,
        repo: string,
        prNumber: number,
        principalUserId: string
    ): Promise<{ approvalCount: number; reviews: PRReview[] }>;

    /**
     * List merged PRs.
     * In prod this would use search API: type:pr is:merged repo:owner/repo merged:start..end author:userid
     */
    listMergedPRs(
        owner: string,
        repo: string,
        baseBranch: string,
        start: Date,
        end: Date,
        authorUserId: string
    ): Promise<MergedPR[]>;
}

export class MockGithubClient implements GithubClient {
    constructor(
        private defaultBranch: string = 'main',
        private prs: MergedPR[] = [],
        private repoMetadata?: RepoMetadata,
        private prReviews: Map<number, PRReview[]> = new Map()
    ) { }

    async getRepoDefaultBranch(owner: string, repo: string): Promise<string> {
        return this.defaultBranch;
    }

    async getRepoMetadata(owner: string, repo: string): Promise<RepoMetadata> {
        if (this.repoMetadata) {
            return this.repoMetadata;
        }
        // Default mock metadata for eligible repo
        return {
            defaultBranch: this.defaultBranch,
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
            pushedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            sizeKb: 5000,
        };
    }

    async getPRApprovals(
        owner: string,
        repo: string,
        prNumber: number,
        principalUserId: string
    ): Promise<{ approvalCount: number; reviews: PRReview[] }> {
        const reviews = this.prReviews.get(prNumber) || [];
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
        // In-memory filter of injected PRs to ensure test accuracy
        return this.prs.filter(pr => {
            const mergedAt = new Date(pr.mergedAtUtc);
            return (
                pr.baseBranch === baseBranch &&
                pr.authorUserId === authorUserId &&
                mergedAt >= start &&
                mergedAt <= end
            );
        });
    }

    // Test helper: set reviews for a PR
    setPRReviews(prNumber: number, reviews: PRReview[]) {
        this.prReviews.set(prNumber, reviews);
    }
}

import { createRealGithubClient } from './github-client.js';

let clientInstance: GithubClient | null = null;

export function getGithubClient(): GithubClient {
    if (!clientInstance) {
        // In production, use real client if GITHUB_TOKEN is available
        const realClient = createRealGithubClient();
        if (realClient) {
            clientInstance = realClient;
        } else {
            // Fallback to mock for tests or when no token
            clientInstance = new MockGithubClient();
        }
    }
    return clientInstance;
}

export function setGithubClient(client: GithubClient) {
    clientInstance = client;
}

export function resetGithubClient() {
    clientInstance = null;
}

// =====================================================
// ADAPTER IMPLEMENTATION
// =====================================================

export interface VerificationContext {
    windowStartUtc: Date;
    // For GitHub, we pass the immutable identity snapshot from contract baseline
    // But we might also validate it against current connected account if required?
    // Prompt says: "bind... principalGithubUserId (if available)... snapshot... immutable"
    // So we assume the ID in reference is the immutable baseline.
}

export interface EvaluationResult {
    pass: boolean;
    observedValue: number;
    threshold: number;
    operator: string;
    evidence: Record<string, unknown>;
}

export const githubAdapter = {
    platform: 'GITHUB',

    async getBaselineData(owner: string, repo: string): Promise<{ defaultBranch: string }> {
        const client = getGithubClient();
        const defaultBranch = await client.getRepoDefaultBranch(owner, repo);
        return { defaultBranch };
    },

    async evaluate(contract: Contract, context: VerificationContext): Promise<EvaluationResult> {
        const condition = contract.conditionJson as {
            operator: string;
            threshold: number;
            repoOwner: string;
            repoName: string;
        };

        const baseline = contract.baselineJson as {
            defaultBranch?: string;
            principalGithubUserId?: string;
        } | null;

        if (!baseline?.defaultBranch) throw new Error('Cannot verify GitHub: Missing baseline defaultBranch');
        if (!baseline?.principalGithubUserId) throw new Error('Cannot verify GitHub: Missing baseline principalGithubUserId');

        const client = getGithubClient();
        const windowStartUtc = context.windowStartUtc;
        const windowEndUtc = contract.deadlineUtc;

        // Fetch Qualified PRs
        const qualifiedPrs = await client.listMergedPRs(
            condition.repoOwner,
            condition.repoName,
            baseline.defaultBranch,
            windowStartUtc,
            windowEndUtc,
            baseline.principalGithubUserId
        );

        const observedCount = qualifiedPrs.length;

        const pass = evaluateCondition(observedCount, condition.operator, condition.threshold);

        return {
            pass,
            observedValue: observedCount,
            threshold: condition.threshold,
            operator: condition.operator,
            evidence: {
                source: 'GITHUB',
                measuredAtUtc: new Date().toISOString(),
                windowStartUtc: windowStartUtc.toISOString(),
                windowEndUtc: windowEndUtc.toISOString(),
                repoOwner: condition.repoOwner,
                repoName: condition.repoName,
                defaultBranch: baseline.defaultBranch,
                principalGithubUserId: baseline.principalGithubUserId,
                observedMergedPrCount: observedCount,
                threshold: condition.threshold,
                qualifiedPrs: qualifiedPrs.map(pr => ({
                    id: pr.id,
                    number: pr.number,
                    mergedAtUtc: pr.mergedAtUtc,
                    createdAtUtc: pr.createdAtUtc
                }))
            },
        };
    },
};

function evaluateCondition(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
        case 'GTE': return value >= threshold;
        case 'GT': return value > threshold;
        case 'LTE': return value <= threshold;
        case 'LT': return value < threshold;
        case 'EQ': return value === threshold;
        default: return false;
    }
}

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
import { Contract } from '../db/schema.js';
export interface MergedPR {
    id: string;
    number: number;
    mergedAtUtc: string;
    createdAtUtc: string;
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
    reviewerUserId: string;
}
export interface GithubClient {
    getRepoDefaultBranch(owner: string, repo: string): Promise<string>;
    getRepoMetadata(owner: string, repo: string): Promise<RepoMetadata>;
    /**
     * Get approvals for a PR (excluding self-approvals)
     * Returns count of APPROVED reviews from users != principalUserId
     */
    getPRApprovals(owner: string, repo: string, prNumber: number, principalUserId: string): Promise<{
        approvalCount: number;
        reviews: PRReview[];
    }>;
    /**
     * List merged PRs.
     * In prod this would use search API: type:pr is:merged repo:owner/repo merged:start..end author:userid
     */
    listMergedPRs(owner: string, repo: string, baseBranch: string, start: Date, end: Date, authorUserId: string): Promise<MergedPR[]>;
}
export declare class MockGithubClient implements GithubClient {
    private defaultBranch;
    private prs;
    private repoMetadata?;
    private prReviews;
    constructor(defaultBranch?: string, prs?: MergedPR[], repoMetadata?: RepoMetadata | undefined, prReviews?: Map<number, PRReview[]>);
    getRepoDefaultBranch(owner: string, repo: string): Promise<string>;
    getRepoMetadata(owner: string, repo: string): Promise<RepoMetadata>;
    getPRApprovals(owner: string, repo: string, prNumber: number, principalUserId: string): Promise<{
        approvalCount: number;
        reviews: PRReview[];
    }>;
    listMergedPRs(owner: string, repo: string, baseBranch: string, start: Date, end: Date, authorUserId: string): Promise<MergedPR[]>;
    setPRReviews(prNumber: number, reviews: PRReview[]): void;
}
export declare function getGithubClient(): GithubClient;
export declare function setGithubClient(client: GithubClient): void;
export declare function resetGithubClient(): void;
export interface VerificationContext {
    windowStartUtc: Date;
}
export interface EvaluationResult {
    pass: boolean;
    observedValue: number;
    threshold: number;
    operator: string;
    evidence: Record<string, unknown>;
}
export declare const githubAdapter: {
    platform: string;
    getBaselineData(owner: string, repo: string): Promise<{
        defaultBranch: string;
    }>;
    evaluate(contract: Contract, context: VerificationContext): Promise<EvaluationResult>;
};

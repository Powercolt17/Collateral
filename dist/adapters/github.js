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
export class MockGithubClient {
    defaultBranch;
    prs;
    repoMetadata;
    prReviews;
    constructor(defaultBranch = 'main', prs = [], repoMetadata, prReviews = new Map()) {
        this.defaultBranch = defaultBranch;
        this.prs = prs;
        this.repoMetadata = repoMetadata;
        this.prReviews = prReviews;
    }
    async getRepoDefaultBranch(owner, repo) {
        return this.defaultBranch;
    }
    async getRepoMetadata(owner, repo) {
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
    async getPRApprovals(owner, repo, prNumber, principalUserId) {
        const reviews = this.prReviews.get(prNumber) || [];
        // Filter: APPROVED state, reviewer != principal
        const approvals = reviews.filter(r => r.state === 'APPROVED' && r.reviewerUserId !== principalUserId);
        return {
            approvalCount: approvals.length,
            reviews,
        };
    }
    async listMergedPRs(owner, repo, baseBranch, start, end, authorUserId) {
        // In-memory filter of injected PRs to ensure test accuracy
        return this.prs.filter(pr => {
            const mergedAt = new Date(pr.mergedAtUtc);
            return (pr.baseBranch === baseBranch &&
                pr.authorUserId === authorUserId &&
                mergedAt >= start &&
                mergedAt <= end);
        });
    }
    // Test helper: set reviews for a PR
    setPRReviews(prNumber, reviews) {
        this.prReviews.set(prNumber, reviews);
    }
}
import { createRealGithubClient } from './github-client.js';
let clientInstance = null;
export function getGithubClient() {
    if (!clientInstance) {
        // In production, use real client if GITHUB_TOKEN is available
        const realClient = createRealGithubClient();
        if (realClient) {
            clientInstance = realClient;
        }
        else {
            // Fallback to mock for tests or when no token
            clientInstance = new MockGithubClient();
        }
    }
    return clientInstance;
}
export function setGithubClient(client) {
    clientInstance = client;
}
export function resetGithubClient() {
    clientInstance = null;
}
export const githubAdapter = {
    platform: 'GITHUB',
    async getBaselineData(owner, repo) {
        const client = getGithubClient();
        const defaultBranch = await client.getRepoDefaultBranch(owner, repo);
        return { defaultBranch };
    },
    async evaluate(contract, context) {
        const condition = contract.conditionJson;
        const baseline = contract.baselineJson;
        if (!baseline?.defaultBranch)
            throw new Error('Cannot verify GitHub: Missing baseline defaultBranch');
        if (!baseline?.principalGithubUserId)
            throw new Error('Cannot verify GitHub: Missing baseline principalGithubUserId');
        const client = getGithubClient();
        const windowStartUtc = context.windowStartUtc;
        const windowEndUtc = contract.deadlineUtc;
        // Fetch Qualified PRs
        const qualifiedPrs = await client.listMergedPRs(condition.repoOwner, condition.repoName, baseline.defaultBranch, windowStartUtc, windowEndUtc, baseline.principalGithubUserId);
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
function evaluateCondition(value, operator, threshold) {
    switch (operator) {
        case 'GTE': return value >= threshold;
        case 'GT': return value > threshold;
        case 'LTE': return value <= threshold;
        case 'LT': return value < threshold;
        case 'EQ': return value === threshold;
        default: return false;
    }
}
//# sourceMappingURL=github.js.map
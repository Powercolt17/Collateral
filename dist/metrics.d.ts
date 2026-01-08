/**
 * OTel Metrics Module
 *
 * Objective, alertable counters/histograms/gauges for ops monitoring.
 * No subjective fraud scores - all metrics derived from existing invariants.
 *
 * IMPORTANT: Low cardinality labels only (no contractId/userId in metrics)
 *
 * Falls back to noop when OTel packages not installed.
 */
export declare const contractsCreatedCounter: any;
export declare const executionConfirmedCounter: any;
export declare const verificationAttemptsCounter: any;
export declare const verificationTerminalCounter: any;
export declare const settlementAttemptsCounter: any;
export declare const settlementTerminalCounter: any;
export declare const retriesScheduledCounter: any;
export declare const jobLockAcquireCounter: any;
export declare const payoutDeferredCounter: any;
export declare const resourceMissingCounter: any;
export declare const stripeNetRevenueEvalCounter: any;
export declare const stripeExcludedOutsideBufferCounter: any;
export declare const stripeUnlinkedDeductionsCounter: any;
export declare const githubRepoEligibilityRejectCounter: any;
export declare const githubSuccessAtFloorCounter: any;
export declare const verifyDurationHistogram: any;
export declare const settleDurationHistogram: any;
export declare const adapterCallDurationHistogram: any;
export declare const retryDelayHistogram: any;
export declare const githubPrsCountedHistogram: any;
declare let backlogGaugeValues: {
    activeLocks: {
        VERIFY: number;
        SETTLE: number;
    };
    retryBacklog: {
        VERIFY: number;
        SETTLE: number;
    };
    settlementBacklog: number;
    verifyingBacklog: number;
    payoutPendingBacklog: number;
};
export declare function updateContractsInState(states: Record<string, number>): void;
export declare function updateBacklogGauges(values: typeof backlogGaugeValues): void;
export declare function updateActiveLocks(jobType: 'VERIFY' | 'SETTLE', count: number): void;
export declare function updateRetryBacklog(jobType: 'VERIFY' | 'SETTLE', count: number): void;
export declare function updateSettlementBacklog(count: number): void;
export declare function updateVerifyingBacklog(count: number): void;
export declare function updatePayoutPendingBacklog(count: number): void;
/**
 * Record a contract creation
 */
export declare function recordContractCreation(platform: string, riskTier: string): void;
/**
 * Record execution confirmed
 */
export declare function recordExecutionConfirmed(platform: string): void;
/**
 * Record verification attempt
 */
export declare function recordVerificationAttempt(platform: string): void;
/**
 * Record terminal verification outcome
 */
export declare function recordVerificationTerminal(platform: string, outcome: 'SUCCEEDED' | 'FAILED', category: string): void;
/**
 * Record verification duration
 */
export declare function recordVerificationDuration(platform: string, durationMs: number): void;
/**
 * Record settlement attempt
 */
export declare function recordSettlementAttempt(platform: string): void;
/**
 * Record terminal settlement outcome
 */
export declare function recordSettlementTerminal(outcome: 'SUCCESS' | 'FAILURE', category: string): void;
/**
 * Record settlement duration
 */
export declare function recordSettlementDuration(platform: string, durationMs: number): void;
/**
 * Record retry scheduled
 */
export declare function recordRetryScheduled(jobType: string, category: string): void;
/**
 * Record job lock acquisition attempt
 */
export declare function recordJobLockAcquire(jobType: string, acquired: boolean): void;
/**
 * Record payout deferred
 */
export declare function recordPayoutDeferred(reason: string): void;
/**
 * Record resource missing
 */
export declare function recordResourceMissing(platform: string): void;
/**
 * Record adapter call duration
 */
export declare function recordAdapterCallDuration(adapter: string, platform: string, durationMs: number): void;
/**
 * Record Stripe net revenue evaluation
 */
export declare function recordStripeNetRevenueEval(pass: boolean): void;
/**
 * Record Stripe excluded outside buffer
 */
export declare function recordStripeExcludedOutsideBuffer(count: number): void;
/**
 * Record Stripe unlinked deductions
 */
export declare function recordStripeUnlinkedDeductions(count: number): void;
/**
 * Record GitHub repo eligibility rejection
 */
export declare function recordGitHubRepoReject(reason: string): void;
/**
 * Record GitHub PRs counted
 */
export declare function recordGitHubPrsCounted(riskTier: string, count: number): void;
/**
 * Record GitHub success at floor
 */
export declare function recordGitHubSuccessAtFloor(riskTier: string, floor: number): void;
export {};

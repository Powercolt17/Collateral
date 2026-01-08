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

// =============================================================================
// CONDITIONAL OTEL IMPORT
// =============================================================================

let metrics: any;
let ValueType: any = { INT: 0, DOUBLE: 1 };

try {
    const otelApi = await import('@opentelemetry/api');
    metrics = otelApi.metrics;
    ValueType = otelApi.ValueType;
} catch {
    // OTel not installed - use noop
    const noopCounter = { add: () => { } };
    const noopHistogram = { record: () => { } };
    const noopMeter = {
        createCounter: () => noopCounter,
        createHistogram: () => noopHistogram,
        createObservableGauge: () => ({ addCallback: () => { } }),
    };
    metrics = { getMeter: () => noopMeter };
}

// =============================================================================
// METER INITIALIZATION
// =============================================================================

const meter = metrics.getMeter('collateral-backend', '1.0.0');

// =============================================================================
// COUNTERS
// =============================================================================

// Contract lifecycle
export const contractsCreatedCounter = meter.createCounter('contracts_created_total', {
    description: 'Total contracts created',
    valueType: ValueType.INT,
});

export const executionConfirmedCounter = meter.createCounter('execution_confirmed_total', {
    description: 'Total contracts with execution confirmed',
    valueType: ValueType.INT,
});

// Verification
export const verificationAttemptsCounter = meter.createCounter('verification_attempts_total', {
    description: 'Total verification attempts',
    valueType: ValueType.INT,
});

export const verificationTerminalCounter = meter.createCounter('verification_terminal_total', {
    description: 'Total terminal verification outcomes',
    valueType: ValueType.INT,
});

// Settlement
export const settlementAttemptsCounter = meter.createCounter('settlement_attempts_total', {
    description: 'Total settlement attempts',
    valueType: ValueType.INT,
});

export const settlementTerminalCounter = meter.createCounter('settlement_terminal_total', {
    description: 'Total terminal settlement outcomes',
    valueType: ValueType.INT,
});

// Retries and locks
export const retriesScheduledCounter = meter.createCounter('retries_scheduled_total', {
    description: 'Total retries scheduled',
    valueType: ValueType.INT,
});

export const jobLockAcquireCounter = meter.createCounter('job_lock_acquire_total', {
    description: 'Job lock acquisition attempts',
    valueType: ValueType.INT,
});

// Payout and resources
export const payoutDeferredCounter = meter.createCounter('payout_deferred_total', {
    description: 'Payouts deferred',
    valueType: ValueType.INT,
});

export const resourceMissingCounter = meter.createCounter('resource_missing_total', {
    description: 'Missing resources (revoked access, deleted repos)',
    valueType: ValueType.INT,
});

// Stripe-specific
export const stripeNetRevenueEvalCounter = meter.createCounter('stripe_net_revenue_eval_total', {
    description: 'Stripe net revenue evaluations',
    valueType: ValueType.INT,
});

export const stripeExcludedOutsideBufferCounter = meter.createCounter('stripe_excluded_outside_buffer_total', {
    description: 'Stripe charges excluded (refund buffer)',
    valueType: ValueType.INT,
});

export const stripeUnlinkedDeductionsCounter = meter.createCounter('stripe_unlinked_deductions_total', {
    description: 'Stripe deductions not linked to counted charges',
    valueType: ValueType.INT,
});

// GitHub-specific
export const githubRepoEligibilityRejectCounter = meter.createCounter('github_repo_eligibility_reject_total', {
    description: 'GitHub repos rejected for eligibility',
    valueType: ValueType.INT,
});

export const githubSuccessAtFloorCounter = meter.createCounter('github_success_at_floor_total', {
    description: 'GitHub success at minimum floor threshold',
    valueType: ValueType.INT,
});

// =============================================================================
// HISTOGRAMS
// =============================================================================

export const verifyDurationHistogram = meter.createHistogram('verify_duration_ms', {
    description: 'Verification duration in milliseconds',
    unit: 'ms',
    valueType: ValueType.DOUBLE,
});

export const settleDurationHistogram = meter.createHistogram('settle_duration_ms', {
    description: 'Settlement duration in milliseconds',
    unit: 'ms',
    valueType: ValueType.DOUBLE,
});

export const adapterCallDurationHistogram = meter.createHistogram('adapter_call_duration_ms', {
    description: 'External adapter call duration',
    unit: 'ms',
    valueType: ValueType.DOUBLE,
});

export const retryDelayHistogram = meter.createHistogram('retry_delay_ms', {
    description: 'Retry delay duration',
    unit: 'ms',
    valueType: ValueType.DOUBLE,
});

export const githubPrsCountedHistogram = meter.createHistogram('github_prs_counted', {
    description: 'Number of PRs counted per verification',
    valueType: ValueType.INT,
});

// =============================================================================
// GAUGES (Observable)
// =============================================================================

// State for async observable gauges
let stateGaugeValues: Record<string, number> = {};
let backlogGaugeValues = {
    activeLocks: { VERIFY: 0, SETTLE: 0 },
    retryBacklog: { VERIFY: 0, SETTLE: 0 },
    settlementBacklog: 0,
    verifyingBacklog: 0,
    payoutPendingBacklog: 0,
};

// Contracts in state gauge
meter.createObservableGauge('contracts_in_state', {
    description: 'Count of contracts in each state',
    valueType: ValueType.INT,
}).addCallback((observableResult) => {
    for (const [state, count] of Object.entries(stateGaugeValues)) {
        observableResult.observe(count, { state });
    }
});

// Active locks gauge
meter.createObservableGauge('active_locks', {
    description: 'Active job locks',
    valueType: ValueType.INT,
}).addCallback((observableResult) => {
    observableResult.observe(backlogGaugeValues.activeLocks.VERIFY, { jobType: 'VERIFY' });
    observableResult.observe(backlogGaugeValues.activeLocks.SETTLE, { jobType: 'SETTLE' });
});

// Retry backlog gauge
meter.createObservableGauge('retry_backlog', {
    description: 'Contracts with scheduled retry',
    valueType: ValueType.INT,
}).addCallback((observableResult) => {
    observableResult.observe(backlogGaugeValues.retryBacklog.VERIFY, { jobType: 'VERIFY' });
    observableResult.observe(backlogGaugeValues.retryBacklog.SETTLE, { jobType: 'SETTLE' });
});

// Settlement backlog gauge
meter.createObservableGauge('settlement_backlog', {
    description: 'Verified contracts waiting for settlement',
    valueType: ValueType.INT,
}).addCallback((observableResult) => {
    observableResult.observe(backlogGaugeValues.settlementBacklog);
});

// Verifying backlog gauge
meter.createObservableGauge('verifying_backlog', {
    description: 'Contracts past deadline waiting for verification',
    valueType: ValueType.INT,
}).addCallback((observableResult) => {
    observableResult.observe(backlogGaugeValues.verifyingBacklog);
});

// Payout pending backlog gauge
meter.createObservableGauge('payout_pending_backlog', {
    description: 'Contracts waiting for payout',
    valueType: ValueType.INT,
}).addCallback((observableResult) => {
    observableResult.observe(backlogGaugeValues.payoutPendingBacklog);
});

// =============================================================================
// GAUGE UPDATE FUNCTIONS
// =============================================================================

export function updateContractsInState(states: Record<string, number>): void {
    stateGaugeValues = { ...states };
}

export function updateBacklogGauges(values: typeof backlogGaugeValues): void {
    backlogGaugeValues = { ...values };
}

export function updateActiveLocks(jobType: 'VERIFY' | 'SETTLE', count: number): void {
    backlogGaugeValues.activeLocks[jobType] = count;
}

export function updateRetryBacklog(jobType: 'VERIFY' | 'SETTLE', count: number): void {
    backlogGaugeValues.retryBacklog[jobType] = count;
}

export function updateSettlementBacklog(count: number): void {
    backlogGaugeValues.settlementBacklog = count;
}

export function updateVerifyingBacklog(count: number): void {
    backlogGaugeValues.verifyingBacklog = count;
}

export function updatePayoutPendingBacklog(count: number): void {
    backlogGaugeValues.payoutPendingBacklog = count;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Record a contract creation
 */
export function recordContractCreation(platform: string, riskTier: string): void {
    contractsCreatedCounter.add(1, { platform, riskTier });
}

/**
 * Record execution confirmed
 */
export function recordExecutionConfirmed(platform: string): void {
    executionConfirmedCounter.add(1, { platform });
}

/**
 * Record verification attempt
 */
export function recordVerificationAttempt(platform: string): void {
    verificationAttemptsCounter.add(1, { platform });
}

/**
 * Record terminal verification outcome
 */
export function recordVerificationTerminal(
    platform: string,
    outcome: 'SUCCEEDED' | 'FAILED',
    category: string
): void {
    verificationTerminalCounter.add(1, { platform, outcome, category });
}

/**
 * Record verification duration
 */
export function recordVerificationDuration(platform: string, durationMs: number): void {
    verifyDurationHistogram.record(durationMs, { platform });
}

/**
 * Record settlement attempt
 */
export function recordSettlementAttempt(platform: string): void {
    settlementAttemptsCounter.add(1, { platform });
}

/**
 * Record terminal settlement outcome
 */
export function recordSettlementTerminal(
    outcome: 'SUCCESS' | 'FAILURE',
    category: string
): void {
    settlementTerminalCounter.add(1, { outcome, category });
}

/**
 * Record settlement duration
 */
export function recordSettlementDuration(platform: string, durationMs: number): void {
    settleDurationHistogram.record(durationMs, { platform });
}

/**
 * Record retry scheduled
 */
export function recordRetryScheduled(jobType: string, category: string): void {
    retriesScheduledCounter.add(1, { jobType, category });
}

/**
 * Record job lock acquisition attempt
 */
export function recordJobLockAcquire(jobType: string, acquired: boolean): void {
    jobLockAcquireCounter.add(1, { jobType, acquired: String(acquired) });
}

/**
 * Record payout deferred
 */
export function recordPayoutDeferred(reason: string): void {
    payoutDeferredCounter.add(1, { reason });
}

/**
 * Record resource missing
 */
export function recordResourceMissing(platform: string): void {
    resourceMissingCounter.add(1, { platform });
}

/**
 * Record adapter call duration
 */
export function recordAdapterCallDuration(adapter: string, platform: string, durationMs: number): void {
    adapterCallDurationHistogram.record(durationMs, { adapter, platform });
}

/**
 * Record Stripe net revenue evaluation
 */
export function recordStripeNetRevenueEval(pass: boolean): void {
    stripeNetRevenueEvalCounter.add(1, { pass: String(pass) });
}

/**
 * Record Stripe excluded outside buffer
 */
export function recordStripeExcludedOutsideBuffer(count: number): void {
    if (count > 0) {
        stripeExcludedOutsideBufferCounter.add(count);
    }
}

/**
 * Record Stripe unlinked deductions
 */
export function recordStripeUnlinkedDeductions(count: number): void {
    if (count > 0) {
        stripeUnlinkedDeductionsCounter.add(count);
    }
}

/**
 * Record GitHub repo eligibility rejection
 */
export function recordGitHubRepoReject(reason: string): void {
    githubRepoEligibilityRejectCounter.add(1, { reason });
}

/**
 * Record GitHub PRs counted
 */
export function recordGitHubPrsCounted(riskTier: string, count: number): void {
    githubPrsCountedHistogram.record(count, { riskTier });
}

/**
 * Record GitHub success at floor
 */
export function recordGitHubSuccessAtFloor(riskTier: string, floor: number): void {
    githubSuccessAtFloorCounter.add(1, { riskTier, floor: String(floor) });
}

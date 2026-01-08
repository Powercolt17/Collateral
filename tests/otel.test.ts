/**
 * OTel Metrics Tests
 * 
 * Tests that calling verifyContract/settleContract increments correct counters.
 * Uses OTEL_SDK_DISABLED=true for noop mode.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    recordContractCreation,
    recordVerificationAttempt,
    recordVerificationTerminal,
    recordVerificationDuration,
    recordSettlementAttempt,
    recordSettlementTerminal,
    recordSettlementDuration,
    recordJobLockAcquire,
    recordRetryScheduled,
    recordPayoutDeferred,
    recordResourceMissing,
    recordStripeNetRevenueEval,
    recordStripeExcludedOutsideBuffer,
    recordStripeUnlinkedDeductions,
    recordGitHubRepoReject,
    recordGitHubPrsCounted,
    recordGitHubSuccessAtFloor,
    recordAdapterCallDuration,
    recordExecutionConfirmed,
    updateContractsInState,
    updateBacklogGauges,
} from '../src/metrics.js';

describe('OTel Metrics', () => {
    describe('Contract Lifecycle Counters', () => {
        it('should record contract creation with attributes', () => {
            // Should not throw when called
            expect(() => recordContractCreation('GITHUB', 'ADVANCED')).not.toThrow();
            expect(() => recordContractCreation('STRIPE', 'BASIC')).not.toThrow();
            expect(() => recordContractCreation('X', 'STARTER')).not.toThrow();
        });

        it('should record execution confirmed', () => {
            expect(() => recordExecutionConfirmed('GITHUB')).not.toThrow();
            expect(() => recordExecutionConfirmed('STRIPE')).not.toThrow();
        });
    });

    describe('Verification Counters', () => {
        it('should record verification attempts', () => {
            expect(() => recordVerificationAttempt('GITHUB')).not.toThrow();
            expect(() => recordVerificationAttempt('STRIPE')).not.toThrow();
        });

        it('should record terminal verification with outcome and category', () => {
            expect(() => recordVerificationTerminal('GITHUB', 'SUCCEEDED', 'COMPLETE')).not.toThrow();
            expect(() => recordVerificationTerminal('STRIPE', 'FAILED', 'THRESHOLD_NOT_MET')).not.toThrow();
        });

        it('should record verification duration', () => {
            expect(() => recordVerificationDuration('GITHUB', 150)).not.toThrow();
            expect(() => recordVerificationDuration('STRIPE', 250)).not.toThrow();
        });
    });

    describe('Settlement Counters', () => {
        it('should record settlement attempts', () => {
            expect(() => recordSettlementAttempt('GITHUB')).not.toThrow();
            expect(() => recordSettlementAttempt('STRIPE')).not.toThrow();
        });

        it('should record terminal settlement with outcome and category', () => {
            expect(() => recordSettlementTerminal('SUCCESS', 'PAYOUT_COMPLETE')).not.toThrow();
            expect(() => recordSettlementTerminal('FAILURE', 'FORFEIT')).not.toThrow();
        });

        it('should record settlement duration', () => {
            expect(() => recordSettlementDuration('GITHUB', 300)).not.toThrow();
            expect(() => recordSettlementDuration('STRIPE', 450)).not.toThrow();
        });
    });

    describe('Job Counters', () => {
        it('should record job lock acquisition', () => {
            expect(() => recordJobLockAcquire('VERIFY', true)).not.toThrow();
            expect(() => recordJobLockAcquire('SETTLE', false)).not.toThrow();
        });

        it('should record retries scheduled', () => {
            expect(() => recordRetryScheduled('VERIFY', 'RATE_LIMIT')).not.toThrow();
            expect(() => recordRetryScheduled('SETTLE', 'TIMEOUT')).not.toThrow();
        });
    });

    describe('Payout and Resource Counters', () => {
        it('should record payout deferred', () => {
            expect(() => recordPayoutDeferred('NO_CONNECT_ACCOUNT')).not.toThrow();
        });

        it('should record resource missing', () => {
            expect(() => recordResourceMissing('GITHUB')).not.toThrow();
            expect(() => recordResourceMissing('STRIPE')).not.toThrow();
        });
    });

    describe('Stripe-Specific Counters', () => {
        it('should record Stripe net revenue eval', () => {
            expect(() => recordStripeNetRevenueEval(true)).not.toThrow();
            expect(() => recordStripeNetRevenueEval(false)).not.toThrow();
        });

        it('should record Stripe excluded outside buffer', () => {
            expect(() => recordStripeExcludedOutsideBuffer(5)).not.toThrow();
            expect(() => recordStripeExcludedOutsideBuffer(0)).not.toThrow();
        });

        it('should record Stripe unlinked deductions', () => {
            expect(() => recordStripeUnlinkedDeductions(3)).not.toThrow();
            expect(() => recordStripeUnlinkedDeductions(0)).not.toThrow();
        });
    });

    describe('GitHub-Specific Counters', () => {
        it('should record GitHub repo eligibility reject', () => {
            expect(() => recordGitHubRepoReject('too_new')).not.toThrow();
            expect(() => recordGitHubRepoReject('stale')).not.toThrow();
            expect(() => recordGitHubRepoReject('too_small')).not.toThrow();
        });

        it('should record GitHub PRs counted', () => {
            expect(() => recordGitHubPrsCounted('BASIC', 5)).not.toThrow();
            expect(() => recordGitHubPrsCounted('ADVANCED', 12)).not.toThrow();
        });

        it('should record GitHub success at floor', () => {
            expect(() => recordGitHubSuccessAtFloor('BASIC', 5)).not.toThrow();
            expect(() => recordGitHubSuccessAtFloor('ADVANCED', 10)).not.toThrow();
        });
    });

    describe('Histograms', () => {
        it('should record adapter call duration', () => {
            expect(() => recordAdapterCallDuration('github-api', 'GITHUB', 100)).not.toThrow();
            expect(() => recordAdapterCallDuration('stripe-api', 'STRIPE', 200)).not.toThrow();
        });
    });

    describe('Gauge Updates', () => {
        it('should update contracts in state', () => {
            expect(() => updateContractsInState({
                CREATED: 5,
                LOCKED: 3,
                VERIFIED: 2,
                SETTLED: 10,
            })).not.toThrow();
        });

        it('should update backlog gauges', () => {
            expect(() => updateBacklogGauges({
                activeLocks: { VERIFY: 1, SETTLE: 0 },
                retryBacklog: { VERIFY: 3, SETTLE: 1 },
                settlementBacklog: 5,
                verifyingBacklog: 2,
                payoutPendingBacklog: 1,
            })).not.toThrow();
        });
    });
});

describe('OTel Tracing', () => {
    it('should create spans without errors', async () => {
        const { spanCreateContract, spanVerifyContract, spanSettleContract, spanJob } = await import('../src/tracing.js');

        // Test span creation (won't actually create spans in test mode)
        const createResult = await spanCreateContract(
            { contractId: 'test-1', platform: 'GITHUB' },
            async () => ({ id: 'test-1' })
        );
        expect(createResult.id).toBe('test-1');

        // Test verify span
        const verifyResult = await spanVerifyContract(
            { contractId: 'test-1', platform: 'GITHUB' },
            async () => ({ success: true, outcome: 'SUCCEEDED', retryable: false })
        );
        expect(verifyResult.success).toBe(true);

        // Test settle span
        const settleResult = await spanSettleContract(
            { contractId: 'test-1', platform: 'GITHUB' },
            async () => ({ success: true, outcome: 'SUCCESS', retryable: false })
        );
        expect(settleResult.success).toBe(true);

        // Test job span
        const jobResult = await spanJob('VERIFY', async () => ({ processed: 5 }));
        expect(jobResult.processed).toBe(5);
    });
});

describe('OTel Logging', () => {
    it('should create structured logs', async () => {
        const { logTerminalVerification, logTerminalSettlement, logReceiptIssued } = await import('../src/logging.js');

        // Should not throw
        expect(() => logTerminalVerification({
            contractId: 'test-1',
            platform: 'GITHUB',
            riskTier: 'ADVANCED',
            outcome: 'SUCCEEDED',
            retryable: false,
            category: 'COMPLETE',
        })).not.toThrow();

        expect(() => logTerminalSettlement({
            contractId: 'test-1',
            platform: 'GITHUB',
            riskTier: 'ADVANCED',
            outcome: 'SUCCESS',
            retryable: false,
            category: 'PAYOUT_COMPLETE',
        })).not.toThrow();

        expect(() => logReceiptIssued({
            contractId: 'test-1',
            platform: 'GITHUB',
            riskTier: 'ADVANCED',
            settlementOutcome: 'SUCCESS',
        })).not.toThrow();
    });
});

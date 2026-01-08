/**
 * Oracle Adapter Interface
 *
 * ARCHITECTURE REQUIREMENT: All platforms must implement this interface.
 *
 * Core invariants enforced:
 * 1. Baseline snapshot at contract creation
 * 2. Scaled target calculation (relative to baseline)
 * 3. Binary evaluation at deadline (pass/fail only)
 * 4. Evidence payload (verifiable, immutable)
 * 5. Strict verification (no rounding, no discretion)
 *
 * No platform-specific hacks in core logic.
 * All evaluation results append immutable ledger events.
 */
import type { Contract, User, ConnectedAccount } from '../db/schema.js';
import type { Platform, MetricType } from './platform-policy.js';
/**
 * Baseline snapshot captured at contract creation or funding
 * This is the reference point for target scaling
 */
export interface BaselineSnapshot {
    snapshotAt: string;
    platform: Platform;
    metrics: Record<string, number>;
    context: BaselineContext;
    rawApiResponse?: Record<string, unknown>;
    method: 'snapshot' | 'trailing_avg' | 'median';
    periodDays?: number;
}
export interface BaselineContext {
    accountAgeDays?: number;
    historicalVariance?: number;
    platformContext?: Record<string, unknown>;
}
/**
 * Calculated target with full breakdown
 * Targets MUST be relative to baseline, not raw numbers
 */
export interface CalculatedTarget {
    target: number;
    baseline: number;
    multiplier: number;
    metricType: MetricType;
    operator: 'GTE' | 'GT' | 'LTE' | 'LT' | 'EQ';
    formula: string;
    factors: Record<string, number>;
}
/**
 * Evaluation result - binary pass/fail with evidence
 * NO partial credit. NO rounding. NO discretion.
 */
export interface EvaluationResult {
    pass: boolean;
    observedValue: number;
    target: number;
    operator: string;
    evidence: EvaluationEvidence;
    evaluatedAt: string;
    evaluationDuration?: number;
}
/**
 * Evidence payload - stored with contract receipt
 * Must be verifiable and immutable
 */
export interface EvaluationEvidence {
    snapshotAt: string;
    platform: Platform;
    source: string;
    metrics: Record<string, number>;
    baselineMetrics: Record<string, number>;
    delta: Record<string, number>;
    rawApiResponse?: Record<string, unknown>;
    apiRequest?: {
        endpoint: string;
        timestamp: string;
        requestId?: string;
    };
    evidenceHash: string;
}
/**
 * All platform adapters MUST implement this interface
 * No exceptions. No shortcuts. No platform-specific core logic.
 */
export interface OracleAdapter {
    /**
     * Platform identifier
     */
    readonly platform: Platform;
    /**
     * Human-readable platform name
     */
    readonly displayName: string;
    /**
     * Supported metric types for this platform
     */
    readonly supportedMetrics: MetricType[];
    /**
     * Connect a user's account via OAuth
     * Stores encrypted tokens in connected_accounts
     *
     * @throws if connection fails or user denies
     */
    connect(user: User): Promise<ConnectedAccount>;
    /**
     * Disconnect/revoke access
     */
    disconnect(connectedAccount: ConnectedAccount): Promise<void>;
    /**
     * Check if connection is still valid
     */
    isConnected(connectedAccount: ConnectedAccount): Promise<boolean>;
    /**
     * Snapshot baseline metrics for a contract
     * Called at contract creation or funding (configurable)
     *
     * MUST capture all metrics needed for evaluation
     * MUST include raw API response for audit
     */
    snapshotBaseline(contract: Contract, connectedAccount: ConnectedAccount): Promise<BaselineSnapshot>;
    /**
     * Calculate target based on baseline and risk tier
     * Target MUST be relative to baseline
     *
     * @throws if baseline insufficient for this tier
     */
    calculateTarget(baseline: BaselineSnapshot, metricType: MetricType, riskTier: 'STANDARD' | 'ADVANCED' | 'ELITE', durationDays: number): CalculatedTarget;
    /**
     * Evaluate contract at deadline
     * BINARY result only - pass or fail
     *
     * NO rounding
     * NO partial credit
     * NO discretion
     *
     * @throws if evaluation fails (network error, API down)
     */
    evaluate(contract: Contract, connectedAccount: ConnectedAccount): Promise<EvaluationResult>;
    /**
     * Validate that a contract can be created for this platform
     * Checks: account connected, baseline sufficient, metric supported
     */
    validateContract(contract: Partial<Contract>, connectedAccount: ConnectedAccount): Promise<{
        valid: boolean;
        errors: string[];
    }>;
}
export declare function registerOracleAdapter(adapter: OracleAdapter): void;
export declare function getOracleAdapter(platform: Platform): OracleAdapter | undefined;
export declare function getAllOracleAdapters(): OracleAdapter[];
export declare function isAdapterRegistered(platform: Platform): boolean;
/**
 * Standard comparison function - no rounding, no discretion
 */
export declare function evaluateCondition(observed: number, operator: string, threshold: number): boolean;
/**
 * Compute evidence hash for integrity verification
 */
export declare function computeEvidenceHash(evidence: Omit<EvaluationEvidence, 'evidenceHash'>): string;

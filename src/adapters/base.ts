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

// =====================================================
// BASELINE SNAPSHOT
// =====================================================

/**
 * Baseline snapshot captured at contract creation or funding
 * This is the reference point for target scaling
 */
export interface BaselineSnapshot {
    // When snapshot was taken
    snapshotAt: string;

    // Platform identifier
    platform: Platform;

    // Primary metrics for this platform
    metrics: Record<string, number>;

    // Additional context for scaling calculations
    context: BaselineContext;

    // Raw API response for audit trail
    rawApiResponse?: Record<string, unknown>;

    // Snapshot method used
    method: 'snapshot' | 'trailing_avg' | 'median';

    // Period used for trailing calculations
    periodDays?: number;
}

export interface BaselineContext {
    // Account age (affects trust scoring)
    accountAgeDays?: number;

    // Historical variance (affects target difficulty)
    historicalVariance?: number;

    // Platform-specific context
    platformContext?: Record<string, unknown>;
}

// =====================================================
// TARGET CALCULATION
// =====================================================

/**
 * Calculated target with full breakdown
 * Targets MUST be relative to baseline, not raw numbers
 */
export interface CalculatedTarget {
    // Final target value
    target: number;

    // Baseline value used
    baseline: number;

    // Multiplier applied
    multiplier: number;

    // Metric being measured
    metricType: MetricType;

    // Comparison operator
    operator: 'GTE' | 'GT' | 'LTE' | 'LT' | 'EQ';

    // Human-readable formula used
    formula: string;

    // All factors that went into calculation
    factors: Record<string, number>;
}

// =====================================================
// EVALUATION RESULT
// =====================================================

/**
 * Evaluation result - binary pass/fail with evidence
 * NO partial credit. NO rounding. NO discretion.
 */
export interface EvaluationResult {
    // BINARY: pass or fail only
    pass: boolean;

    // Observed value at deadline
    observedValue: number;

    // Target that was set
    target: number;

    // Comparison operator
    operator: string;

    // Detailed evidence for receipt
    evidence: EvaluationEvidence;

    // Evaluation metadata
    evaluatedAt: string;
    evaluationDuration?: number;  // ms
}

/**
 * Evidence payload - stored with contract receipt
 * Must be verifiable and immutable
 */
export interface EvaluationEvidence {
    // When final snapshot was taken
    snapshotAt: string;

    // Platform source
    platform: Platform;
    source: string;  // e.g., 'x_api_v2', 'stripe_connect'

    // All metrics captured at evaluation
    metrics: Record<string, number>;

    // Baseline metrics for comparison
    baselineMetrics: Record<string, number>;

    // Delta from baseline
    delta: Record<string, number>;

    // Raw API response for verification
    rawApiResponse?: Record<string, unknown>;

    // API request details (for audit)
    apiRequest?: {
        endpoint: string;
        timestamp: string;
        requestId?: string;
    };

    // Hash of evidence for integrity
    evidenceHash: string;
}

// =====================================================
// ORACLE ADAPTER INTERFACE
// =====================================================

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
    snapshotBaseline(
        contract: Contract,
        connectedAccount: ConnectedAccount
    ): Promise<BaselineSnapshot>;

    /**
     * Calculate target based on baseline and risk tier
     * Target MUST be relative to baseline
     * 
     * @throws if baseline insufficient for this tier
     */
    calculateTarget(
        baseline: BaselineSnapshot,
        metricType: MetricType,
        riskTier: 'STANDARD' | 'ADVANCED' | 'ELITE',
        durationDays: number
    ): CalculatedTarget;

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
    evaluate(
        contract: Contract,
        connectedAccount: ConnectedAccount
    ): Promise<EvaluationResult>;

    /**
     * Validate that a contract can be created for this platform
     * Checks: account connected, baseline sufficient, metric supported
     */
    validateContract(
        contract: Partial<Contract>,
        connectedAccount: ConnectedAccount
    ): Promise<{ valid: boolean; errors: string[] }>;
}

// =====================================================
// ADAPTER REGISTRY
// =====================================================

const adapterRegistry = new Map<Platform, OracleAdapter>();

export function registerOracleAdapter(adapter: OracleAdapter): void {
    if (adapterRegistry.has(adapter.platform)) {
        throw new Error(`Adapter already registered for platform: ${adapter.platform}`);
    }
    adapterRegistry.set(adapter.platform, adapter);
}

export function getOracleAdapter(platform: Platform): OracleAdapter | undefined {
    return adapterRegistry.get(platform);
}

export function getAllOracleAdapters(): OracleAdapter[] {
    return Array.from(adapterRegistry.values());
}

export function isAdapterRegistered(platform: Platform): boolean {
    return adapterRegistry.has(platform);
}

// =====================================================
// EVALUATION HELPERS
// =====================================================

/**
 * Standard comparison function - no rounding, no discretion
 */
export function evaluateCondition(
    observed: number,
    operator: string,
    threshold: number
): boolean {
    switch (operator) {
        case 'GTE': return observed >= threshold;
        case 'GT': return observed > threshold;
        case 'LTE': return observed <= threshold;
        case 'LT': return observed < threshold;
        case 'EQ': return observed === threshold;
        default:
            throw new Error(`Unknown operator: ${operator}`);
    }
}

/**
 * Compute evidence hash for integrity verification
 */
export function computeEvidenceHash(evidence: Omit<EvaluationEvidence, 'evidenceHash'>): string {
    const { createHash } = require('crypto');
    const payload = JSON.stringify(evidence, Object.keys(evidence).sort());
    return createHash('sha256').update(payload).digest('hex');
}

/**
 * Contract Service
 *
 * Manages contract lifecycle. State is NEVER stored.
 * All state is derived from ledger events via state-derivation service.
 * Every meaningful action emits a ledger event.
 */
import { type DbLike } from '../db/client.js';
import { type Contract, EventType, type ContractStatusType } from '../db/schema.js';
import { canTransition, InvalidTransitionError } from './state-derivation.js';
export declare const GITHUB_MIN_REPO_AGE_DAYS = 30;
export declare const GITHUB_MAX_PUSHED_STALENESS_DAYS = 30;
export declare const GITHUB_MIN_REPO_SIZE_KB = 1000;
export declare const GITHUB_MIN_THRESHOLD_ADVANCED = 5;
export declare const GITHUB_MIN_THRESHOLD_ELITE = 10;
export declare const GITHUB_MAX_WINDOW_DAYS = 30;
export declare const MAX_ACTIVE_CONTRACTS_PER_USER = 3;
export declare const MAX_ACTIVE_CONTRACTS_PER_PLATFORM = 1;
export declare const CONTRACT_CREATION_COOLDOWN_HOURS = 24;
export declare const FAILURE_COOLDOWN_HOURS = 72;
export declare const FAILURE_WINDOW_DAYS = 7;
export declare const MIN_LOCK_AMOUNT_USD_CENTS = 1000;
export declare const ESCALATION_TIER_1_FAILURES = 2;
export declare const ESCALATION_TIER_1_MULTIPLIER = 1.5;
export declare const ESCALATION_TIER_2_FAILURES = 3;
export declare const ESCALATION_TIER_2_MULTIPLIER = 2;
/**
 * Get contract by ID
 * @param contractId - Contract to fetch
 * @param txClient - Optional transaction client
 */
export declare function getContract(contractId: string, txClient?: DbLike): Promise<Contract | null>;
/**
 * Get contract with derived state
 */
export declare function getContractWithState(contractId: string): Promise<{
    contract: Contract;
    state: ContractStatusType | null;
} | null>;
/**
 * Get contracts for a user with derived states
 */
export declare function getContractsForUser(userId: string): Promise<{
    contract: Contract;
    state: ContractStatusType | null;
}[]>;
export interface CreateContractParams {
    principalUserId: string;
    principalIdentityUsername: string;
    platform: 'X' | 'STRIPE' | 'GITHUB' | 'YOUTUBE' | 'TIKTOK' | 'SHOPIFY';
    metricType: 'IMPRESSIONS' | 'FOLLOWERS' | 'REVENUE' | 'VIEWS' | 'SUBSCRIBERS' | 'COMMITS' | 'PRS_MERGED' | 'STARS_GAINED';
    condition: {
        operator: 'GTE' | 'GT' | 'LTE' | 'LT' | 'EQ';
        threshold: number;
        deadline: string;
    };
    baseline?: Record<string, unknown>;
    lockAmountUsdCents: number;
    payoutAmountUsdCents: number;
    fundingMethod?: 'USD_CARD' | 'USD_ACH' | 'CRYPTO';
    riskTier?: 'STANDARD' | 'ADVANCED' | 'ELITE';
}
/**
 * Create a new contract
 * Atomically: insert contract record, append CONTRACT_CREATED event, compute record hash
 * State is CREATED after the ledger event is appended (derived, not stored)
 */
export declare function createContract(params: CreateContractParams): Promise<Contract>;
/**
 * Append a state-changing event to a contract
 * Validates that the transition is allowed before appending
 */
export declare function appendContractEvent(contractId: string, options: {
    actor: 'SYSTEM' | 'USER';
    eventType: keyof typeof EventType;
    amountUsdCents?: number;
    externalRef?: string;
    metadata?: Record<string, unknown>;
}): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Update contract baseline JSON (for freezing at execution)
 *
 * SECURITY-CRITICAL: This is the ONLY way to update baselineJson after creation.
 * Used to freeze the identity binding and baseline metrics at EXECUTION_CONFIRMED.
 *
 * IMMUTABILITY GUARD: Rejects updates if contract is already in LOCKED or terminal state.
 * This ensures the frozen baseline cannot be tampered with after execution.
 */
export declare class BaselineImmutableError extends Error {
    constructor(contractId: string, currentState: string);
}
export declare function updateContractBaseline(contractId: string, baselineJson: Record<string, unknown>): Promise<void>;
/**
 * Get contracts that are due for verification (state = LOCKED + past deadline)
 */
export declare function getContractsDueForVerification(): Promise<Contract[]>;
export { canTransition, InvalidTransitionError };

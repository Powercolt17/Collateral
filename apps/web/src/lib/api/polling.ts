/**
 * Polling Utilities
 * 
 * Provides two pollers:
 * A) Contract List Polling - Low frequency, for dashboard
 * B) Contract Detail Polling - Higher frequency, for in-flight contracts
 * 
 * RULES:
 * - Poll until state becomes stable or terminal
 * - Stop polling automatically when terminal
 * - Never poll blindly forever
 * - Polling tracks ledger truth, not simulated progress
 */

import { get } from './api.ts';
import { isTerminal, isInFlight } from '../state/contract-states.ts';
import type { ContractDerivedStateType } from '../state/contract-states.ts';

// =============================================================================
// TYPES
// =============================================================================

export interface ContractListItem {
    id: string;
    platform: string;
    metricType: string;
    deadlineUtc: string;
    lockAmountUsdCents: number;
    payoutAmountUsdCents: number;
    derivedState: ContractDerivedStateType;
    isTerminal: boolean;
    createdAt: string;
}

export interface ContractDetail {
    id: string;
    principalIdentityUsername: string;
    platform: string;
    metricType: string;
    condition: unknown;
    baseline: unknown;
    deadlineUtc: string;
    lockAmountUsdCents: number;
    payoutAmountUsdCents: number;
    fundingMethod: string;
    riskTier: string;
    createdAt: string;
    derivedState: ContractDerivedStateType;
    isTerminal: boolean;
    stripeBindingId?: string;
    githubBindingId?: string;
    recordHash?: string;
}

export interface ContractEvent {
    id: string;
    timestampUtc: string;
    eventType: string;
    actor: string;
    externalRef?: string;
    amountUsdCents?: number;
    metadata?: unknown;
    eventHash: string;
}

export interface ContractDetailResponse {
    contract: ContractDetail;
    events: ContractEvent[];
    receipt?: {
        issuedAt: string;
        eventHash: string;
    };
}

// =============================================================================
// POLLING CONFIGURATION
// =============================================================================

/** Polling interval for contract list (dashboard) */
const LIST_POLL_INTERVAL_MS = 30_000; // 30 seconds

/** Polling interval for contract detail (in-flight) */
const DETAIL_POLL_INTERVAL_MS = 5_000; // 5 seconds

/** Maximum poll attempts before giving up */
const MAX_POLL_ATTEMPTS = 360; // 30 minutes at 5s intervals

// =============================================================================
// CONTRACT LIST POLLING
// =============================================================================

/**
 * Start polling for contract list.
 * Low frequency polling suitable for dashboard views.
 * 
 * @param callback - Called with updated contracts on each poll
 * @returns Cleanup function to stop polling
 */
export function startContractListPolling(
    callback: (contracts: ContractListItem[]) => void
): () => void {
    let stopped = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
        if (stopped) return;

        try {
            const response = await get<{ contracts: ContractListItem[] }>('/v1/contracts');
            if (!stopped) {
                callback(response.contracts);
            }
        } catch (err) {
            // Silently continue polling on error
            console.error('[ContractListPoller] Error:', err);
        }

        if (!stopped) {
            timeoutId = setTimeout(poll, LIST_POLL_INTERVAL_MS);
        }
    };

    // Start immediately
    poll();

    // Return cleanup function
    return () => {
        stopped = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };
}

// =============================================================================
// CONTRACT DETAIL POLLING
// =============================================================================

/**
 * Start polling for a single contract.
 * Higher frequency, automatically stops when terminal state reached.
 * 
 * @param contractId - Contract ID to poll
 * @param callback - Called with updated contract detail on each poll
 * @param onTerminal - Called when contract reaches terminal state
 * @returns Cleanup function to stop polling
 */
export function startContractDetailPolling(
    contractId: string,
    callback: (detail: ContractDetailResponse) => void,
    onTerminal?: () => void
): () => void {
    let stopped = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;

    const poll = async () => {
        if (stopped) return;

        attempts++;

        try {
            const response = await get<ContractDetailResponse>(`/v1/contracts/${contractId}`);

            if (stopped) return;

            callback(response);

            // Check if we should stop polling
            if (isTerminal(response.contract.derivedState)) {
                stopped = true;
                if (onTerminal) onTerminal();
                return;
            }

            // Check if state is stable (not in-flight)
            if (!isInFlight(response.contract.derivedState)) {
                // Still schedule next poll, but we're not in an active transition
                // This handles CREATED state where user hasn't funded yet
            }

            // Check max attempts
            if (attempts >= MAX_POLL_ATTEMPTS) {
                console.warn(`[ContractDetailPoller] Max attempts reached for ${contractId}`);
                stopped = true;
                return;
            }
        } catch (err) {
            console.error('[ContractDetailPoller] Error:', err);
        }

        if (!stopped) {
            timeoutId = setTimeout(poll, DETAIL_POLL_INTERVAL_MS);
        }
    };

    // Start immediately
    poll();

    // Return cleanup function
    return () => {
        stopped = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };
}

// =============================================================================
// IN-FLIGHT POLLING
// =============================================================================

/**
 * Poll only while contract is in-flight.
 * Stops automatically when state leaves in-flight set.
 * 
 * Use this for the execute flow:
 * FUNDS_LOCKED → LOCKED → VERIFYING → VERIFIED → SETTLING → SETTLED/FORFEITED
 * 
 * @param contractId - Contract ID to poll
 * @param callback - Called with updated detail on each poll
 * @param onStable - Called when state becomes stable (terminal or waiting for user)
 */
export function pollUntilStable(
    contractId: string,
    callback: (detail: ContractDetailResponse) => void,
    onStable?: (finalState: ContractDerivedStateType) => void
): () => void {
    let stopped = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;

    const poll = async () => {
        if (stopped) return;

        attempts++;

        try {
            const response = await get<ContractDetailResponse>(`/v1/contracts/${contractId}`);

            if (stopped) return;

            callback(response);

            const state = response.contract.derivedState;

            // Terminal = done
            if (isTerminal(state)) {
                stopped = true;
                if (onStable) onStable(state);
                return;
            }

            // No longer in-flight = stable
            if (!isInFlight(state)) {
                stopped = true;
                if (onStable) onStable(state);
                return;
            }

            // Safety: max attempts
            if (attempts >= MAX_POLL_ATTEMPTS) {
                console.warn(`[pollUntilStable] Max attempts reached for ${contractId}`);
                stopped = true;
                return;
            }
        } catch (err) {
            console.error('[pollUntilStable] Error:', err);
        }

        if (!stopped) {
            timeoutId = setTimeout(poll, DETAIL_POLL_INTERVAL_MS);
        }
    };

    // Start immediately
    poll();

    return () => {
        stopped = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };
}

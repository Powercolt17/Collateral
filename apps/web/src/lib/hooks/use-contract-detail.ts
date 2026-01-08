/**
 * Contract Detail Hook
 * 
 * Handles contract detail viewing:
 * - Fetch contract detail with events
 * - Auto-poll when in-flight
 * - Stop polling when terminal
 */

import { get } from '../api/api.js';
import { runAction } from '../api/run-action.js';
import { startContractDetailPolling } from '../api/polling.js';
import type { ContractListItem } from '../api/polling.js';
import { isInFlight, isTerminal } from '../state/contract-states.js';
import type { ContractDerivedStateType } from '../state/contract-states.js';

// =============================================================================
// FETCH CONTRACT DETAIL
// =============================================================================

/**
 * Fetch contract detail with events timeline.
 * 
 * @param contractId - Contract to fetch
 * @returns Contract detail with events
 */
export async function fetchContractDetail(
    contractId: string
) {
    return runAction(() =>
        get<ContractDetailResponse>(`/v1/contracts/${contractId}`)
    );
}

// =============================================================================
// FETCH CONTRACT LIST
// =============================================================================

/**
 * Fetch all contracts for current user.
 * 
 * @returns Contract list
 */
export async function fetchContractList() {
    return runAction(async () => {
        const response = await get<{ contracts: ContractListItem[] }>('/v1/contracts');
        return response.contracts;
    });
}

export interface ContractDetailResponse {
    contract: {
        id: string;
        derivedState: ContractDerivedStateType;
        metricType: string;
        lockAmountUsdCents: number;
        deadlineUtc: string;
        condition: unknown;
    };
    events: {
        id: string;
        eventType: string;
        timestampUtc: string;
        eventHash: string;
    }[];
}

// =============================================================================
// AUTO-POLLING DETAIL
// =============================================================================

/**
 * Start auto-polling for contract detail.
 * Automatically stops when terminal state reached.
 * 
 * @param contractId - Contract to poll
 * @param onUpdate - Called with new detail on each poll
 * @param onTerminal - Called when terminal state reached
 * @returns Cleanup function
 */
export function startDetailPolling(
    contractId: string,
    onUpdate: (detail: ContractDetailResponse) => void,
    onTerminal?: () => void
): () => void {
    return startContractDetailPolling(contractId, onUpdate, onTerminal);
}

// =============================================================================
// SMART POLLING
// =============================================================================

/**
 * Start polling only if contract is in-flight.
 * No-op if contract is stable or terminal.
 * 
 * @param detail - Current contract detail
 * @param onUpdate - Called on updates
 * @param onTerminal - Called on terminal
 * @returns Cleanup function (may be no-op)
 */
export function startSmartPolling(
    detail: ContractDetailResponse,
    onUpdate: (detail: ContractDetailResponse) => void,
    onTerminal?: () => void
): () => void {
    const state = detail.contract.derivedState;

    // Don't poll if terminal
    if (isTerminal(state)) {
        return () => { }; // No-op cleanup
    }

    // Poll if in-flight
    if (isInFlight(state)) {
        return startContractDetailPolling(
            detail.contract.id,
            onUpdate,
            onTerminal
        );
    }

    // Not in-flight, not terminal = waiting for user action
    // Don't auto-poll, but allow manual refresh
    return () => { };
}

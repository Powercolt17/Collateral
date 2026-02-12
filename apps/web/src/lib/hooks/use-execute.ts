/**
 * Execute Contract Hook
 * 
 * Handles contract execution:
 * 1. Execute → locks funds, starts countdown
 * 2. Poll until terminal (SETTLED or FORFEITED)
 */

import { post } from '../api/api.ts';
import { runAction } from '../api/run-action.ts';
import { pollUntilStable } from '../api/polling.ts';
import type { ContractDetailResponse } from '../api/polling.ts';
import { can, ContractAction, isTerminal } from '../state/contract-states.ts';
import type { ContractDerivedStateType } from '../state/contract-states.ts';

// =============================================================================
// TYPES
// =============================================================================

export interface ExecuteResponse {
    ok: true;
    eventType: string;
    eventId: string;
    derivedState: ContractDerivedStateType;
    isTerminal: boolean;
}

// =============================================================================
// EXECUTE CONTRACT
// =============================================================================

/**
 * Execute a contract.
 * This locks funds and starts the countdown to deadline.
 * 
 * @param contractId - Contract to execute
 * @param currentState - Current contract state
 * @returns Execute result
 */
export async function executeContract(
    contractId: string,
    currentState: ContractDerivedStateType
) {
    // Guard: check if action is allowed
    if (!can(ContractAction.EXECUTE, currentState)) {
        return {
            error: {
                code: 'ACTION_NOT_ALLOWED',
                message: 'Execute is only available when funds are locked.',
            },
        };
    }

    return runAction(() =>
        post<ExecuteResponse>(`/v1/contracts/${contractId}/execute`, {})
    );
}

// =============================================================================
// WATCH EXECUTION
// =============================================================================

/**
 * Poll until contract reaches terminal state.
 * Call this after execute to track:
 * LOCKED → VERIFYING → VERIFIED → SETTLING → SETTLED/FORFEITED
 * 
 * @param contractId - Contract to watch
 * @param onUpdate - Called on each poll with current state
 * @param onComplete - Called when terminal state reached
 * @returns Cleanup function
 */
export function watchUntilTerminal(
    contractId: string,
    onUpdate: (detail: ContractDetailResponse) => void,
    onComplete: (outcome: 'SETTLED' | 'FORFEITED') => void
): () => void {
    return pollUntilStable(
        contractId,
        onUpdate,
        (finalState) => {
            if (isTerminal(finalState)) {
                onComplete(finalState as 'SETTLED' | 'FORFEITED');
            }
        }
    );
}

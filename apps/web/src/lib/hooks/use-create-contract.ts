/**
 * Create Contract Hook
 * 
 * Handles contract creation flow.
 * Only allowed when X is verified.
 */

import { post } from '../api/api.js';
import { runAction } from '../api/run-action.js';
import { can, ContractAction } from '../state/contract-states.js';
import type { ContractDerivedStateType } from '../state/contract-states.js';

// =============================================================================
// TYPES
// =============================================================================

export interface CreateContractParams {
    platform: 'X' | 'GITHUB' | 'STRIPE';
    metricType: string;
    condition: {
        operator: 'GTE' | 'GT' | 'LTE' | 'LT' | 'EQ';
        threshold: number;
        deadline: string; // ISO date
    };
    lockAmountUsdCents: number;
    payoutAmountUsdCents: number;
}

export interface CreateContractResponse {
    ok: true;
    contractId: string;
    eventType: string;
    eventId: string;
    eventHash: string;
    contract: {
        id: string;
        platform: string;
        metricType: string;
        derivedState: ContractDerivedStateType;
    };
}

// =============================================================================
// CREATE CONTRACT
// =============================================================================

/**
 * Create a new contract.
 * 
 * @param params - Contract creation parameters
 * @param xVerified - Whether X account is verified
 * @returns Contract creation result
 */
export async function createContract(
    params: CreateContractParams,
    xVerified: boolean
) {
    // Guard: check if action is allowed
    if (!can(ContractAction.CREATE_CONTRACT, null, { xVerified })) {
        return {
            error: {
                code: 'ACTION_NOT_ALLOWED',
                message: 'Cannot create contract. Please verify your X account first.',
            },
        };
    }

    return runAction(() =>
        post<CreateContractResponse>('/v1/contracts', params)
    );
}

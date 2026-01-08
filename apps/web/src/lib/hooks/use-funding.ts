/**
 * Funding Hook
 * 
 * Handles Stripe funding flow:
 * 1. Create funding intent → get Stripe checkout URL/client secret
 * 2. User completes Stripe checkout
 * 3. Webhook updates state → poll until FUNDS_LOCKED
 */

import { post } from '../api/api.js';
import { runAction } from '../api/run-action.js';
import { pollUntilStable } from '../api/polling.js';
import type { ContractDetailResponse } from '../api/polling.js';
import { can, ContractAction, ContractDerivedState } from '../state/contract-states.js';
import type { ContractDerivedStateType } from '../state/contract-states.js';

// =============================================================================
// TYPES
// =============================================================================

export interface FundingIntentResponse {
    ok: true;
    fundingIntentId: string;
    clientSecret?: string;    // For Stripe Elements
    checkoutUrl?: string;     // For Stripe Checkout redirect
    expiresAt: string;
}

export interface FundingResult {
    /** Funding intent created successfully */
    intentCreated: boolean;
    /** Stripe client secret for Elements */
    clientSecret?: string;
    /** Stripe checkout URL for redirect */
    checkoutUrl?: string;
}

// =============================================================================
// CREATE FUNDING INTENT
// =============================================================================

/**
 * Create a funding intent for a contract.
 * 
 * @param contractId - Contract to fund
 * @param currentState - Current contract state
 * @returns Funding intent with Stripe details
 */
export async function createFundingIntent(
    contractId: string,
    currentState: ContractDerivedStateType
) {
    // Guard: check if action is allowed
    if (!can(ContractAction.FUND, currentState)) {
        return {
            error: {
                code: 'ACTION_NOT_ALLOWED',
                message: 'Funding is only available for contracts in CREATED state.',
            },
        };
    }

    return runAction(() =>
        post<FundingIntentResponse>(`/v1/contracts/${contractId}/funding-intent`, {})
    );
}

// =============================================================================
// WAIT FOR FUNDING COMPLETION
// =============================================================================

/**
 * Poll until funds are locked.
 * Call this after user completes Stripe checkout.
 * 
 * @param contractId - Contract to poll
 * @param onUpdate - Called on each poll with current state
 * @param onComplete - Called when FUNDS_LOCKED is reached
 * @returns Cleanup function
 */
export function waitForFundsLocked(
    contractId: string,
    onUpdate: (detail: ContractDetailResponse) => void,
    onComplete: (locked: boolean) => void
): () => void {
    return pollUntilStable(
        contractId,
        onUpdate,
        (finalState) => {
            // Success if we reached FUNDS_LOCKED
            const locked = finalState === ContractDerivedState.FUNDS_LOCKED;
            onComplete(locked);
        }
    );
}

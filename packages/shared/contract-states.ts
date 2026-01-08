/**
 * Contract State Model - The UI's Law Book
 * 
 * This file is the SINGLE SOURCE OF TRUTH for UI state decisions.
 * Every button, every action must consult this file.
 * 
 * INVARIANTS:
 * - States mirror backend ContractStatus exactly
 * - can() is pure, deterministic, side-effect free
 * - No UI action may fire unless can() returns true
 */

// =============================================================================
// CONTRACT DERIVED STATE (Mirror of backend ContractStatus)
// =============================================================================

export const ContractDerivedState = {
    CREATED: 'CREATED',
    FUNDS_AUTHORIZED: 'FUNDS_AUTHORIZED',
    FUNDS_LOCKED: 'FUNDS_LOCKED',
    LOCKED: 'LOCKED',
    VERIFYING: 'VERIFYING',
    VERIFIED: 'VERIFIED',
    SETTLING: 'SETTLING',
    PAYOUT_PENDING: 'PAYOUT_PENDING',
    SETTLED: 'SETTLED',
    FORFEITED: 'FORFEITED',
} as const;

export type ContractDerivedStateType = typeof ContractDerivedState[keyof typeof ContractDerivedState];

// =============================================================================
// STATE CLASSIFICATIONS
// =============================================================================

/** Terminal states - no further actions possible */
export const TERMINAL_STATES = new Set<ContractDerivedStateType>([
    ContractDerivedState.SETTLED,
    ContractDerivedState.FORFEITED,
]);

/** In-flight states - polling should be active */
export const IN_FLIGHT_STATES = new Set<ContractDerivedStateType>([
    ContractDerivedState.FUNDS_AUTHORIZED,
    ContractDerivedState.FUNDS_LOCKED,
    ContractDerivedState.LOCKED,
    ContractDerivedState.VERIFYING,
    ContractDerivedState.VERIFIED,
    ContractDerivedState.SETTLING,
    ContractDerivedState.PAYOUT_PENDING,
]);

/** States where user is waiting for backend/webhook */
export const WAITING_STATES = new Set<ContractDerivedStateType>([
    ContractDerivedState.FUNDS_AUTHORIZED,  // Waiting for Stripe capture
    ContractDerivedState.LOCKED,            // Waiting for deadline/verification
    ContractDerivedState.VERIFYING,         // Waiting for verification result
    ContractDerivedState.SETTLING,          // Waiting for settlement
    ContractDerivedState.PAYOUT_PENDING,    // Waiting for payout retry
]);

// =============================================================================
// CONTRACT ACTIONS
// =============================================================================

export const ContractAction = {
    /** Connect X account (proof-of-control) */
    CONNECT_X: 'CONNECT_X',
    /** Create a new contract */
    CREATE_CONTRACT: 'CREATE_CONTRACT',
    /** Initiate funding via Stripe */
    FUND: 'FUND',
    /** Execute contract (lock funds, start countdown) */
    EXECUTE: 'EXECUTE',
    /** View contract details */
    VIEW: 'VIEW',
} as const;

export type ContractActionType = typeof ContractAction[keyof typeof ContractAction];

// =============================================================================
// CAN() - THE CORE GUARD FUNCTION
// =============================================================================

/**
 * Pure function to determine if an action is allowed given current state.
 * 
 * RULES:
 * - Every button must call can() before enabling
 * - If can() returns false, button MUST be disabled
 * - No API call may fire unless can() returns true
 * 
 * @param action - The action to check
 * @param state - Current contract state (null if no contract exists)
 * @param context - Additional context (e.g., X connection status)
 * @returns true if action is allowed, false otherwise
 */
export function can(
    action: ContractActionType,
    state: ContractDerivedStateType | null,
    context?: {
        xConnected?: boolean;
        xVerified?: boolean;
    }
): boolean {
    switch (action) {
        case ContractAction.CONNECT_X:
            // Can always attempt to connect X (even to re-connect)
            return true;

        case ContractAction.CREATE_CONTRACT:
            // Must have verified X connection, no existing contract in progress
            return context?.xVerified === true && state === null;

        case ContractAction.FUND:
            // Can only fund when contract is CREATED
            return state === ContractDerivedState.CREATED;

        case ContractAction.EXECUTE:
            // Can only execute when funds are locked
            return state === ContractDerivedState.FUNDS_LOCKED;

        case ContractAction.VIEW:
            // Can always view if contract exists
            return state !== null;

        default:
            return false;
    }
}

// =============================================================================
// STATE HELPERS
// =============================================================================

/** Check if state is terminal (no more actions possible) */
export function isTerminal(state: ContractDerivedStateType | null): boolean {
    if (state === null) return false;
    return TERMINAL_STATES.has(state);
}

/** Check if state is in-flight (polling should be active) */
export function isInFlight(state: ContractDerivedStateType | null): boolean {
    if (state === null) return false;
    return IN_FLIGHT_STATES.has(state);
}

/** Check if user is waiting (no action available, backend processing) */
export function isWaiting(state: ContractDerivedStateType | null): boolean {
    if (state === null) return false;
    return WAITING_STATES.has(state);
}

/** Get human-readable status message for state */
export function getStateMessage(state: ContractDerivedStateType | null): string {
    if (state === null) return 'No contract';

    switch (state) {
        case ContractDerivedState.CREATED:
            return 'Contract created. Awaiting funding.';
        case ContractDerivedState.FUNDS_AUTHORIZED:
            return 'Payment authorized. Processing...';
        case ContractDerivedState.FUNDS_LOCKED:
            return 'Funds locked. Ready to execute.';
        case ContractDerivedState.LOCKED:
            return 'Contract active. Awaiting deadline.';
        case ContractDerivedState.VERIFYING:
            return 'Verifying goal completion...';
        case ContractDerivedState.VERIFIED:
            return 'Verification complete. Processing settlement.';
        case ContractDerivedState.SETTLING:
            return 'Processing settlement...';
        case ContractDerivedState.PAYOUT_PENDING:
            return 'Payout pending. Connect payout method.';
        case ContractDerivedState.SETTLED:
            return 'Contract settled. Goal achieved!';
        case ContractDerivedState.FORFEITED:
            return 'Contract forfeited. Goal not met.';
        default:
            return 'Unknown state';
    }
}

/** Get next action hint for state */
export function getNextActionHint(state: ContractDerivedStateType | null, xVerified?: boolean): string | null {
    if (state === null) {
        return xVerified ? 'Create a new contract' : 'Connect your X account';
    }

    switch (state) {
        case ContractDerivedState.CREATED:
            return 'Fund your contract';
        case ContractDerivedState.FUNDS_LOCKED:
            return 'Execute to start the countdown';
        case ContractDerivedState.SETTLED:
        case ContractDerivedState.FORFEITED:
            return null; // Terminal - no next action
        default:
            return null; // Waiting states - no user action
    }
}

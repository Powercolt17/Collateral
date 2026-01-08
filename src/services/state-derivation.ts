/**
 * State Derivation Service
 * 
 * Pure function that derives contract state from ordered ledger events.
 * This is the ONLY source of truth for contract state.
 * No state is ever stored or cached.
 */

import { type LedgerEvent, EventType, ContractStatus, type ContractStatusType } from '../db/schema.js';

// Event type to resulting state mapping
const EVENT_TO_STATE: Record<string, ContractStatusType> = {
    [EventType.CONTRACT_CREATED]: ContractStatus.CREATED,
    [EventType.FUNDS_AUTHORIZED]: ContractStatus.FUNDS_AUTHORIZED,
    [EventType.FUNDS_LOCKED]: ContractStatus.FUNDS_LOCKED,
    [EventType.EXECUTION_CONFIRMED]: ContractStatus.LOCKED,
    [EventType.VERIFICATION_STARTED]: ContractStatus.VERIFYING,
    [EventType.VERIFICATION_SUCCEEDED]: ContractStatus.VERIFIED,
    [EventType.VERIFICATION_FAILED]: ContractStatus.VERIFIED,
    [EventType.CONTRACT_VERIFIED]: ContractStatus.VERIFIED,
    [EventType.SETTLEMENT_STARTED]: ContractStatus.SETTLING,
    [EventType.PAYOUT_DEFERRED]: ContractStatus.PAYOUT_PENDING,  // Success but payout rail missing
    [EventType.SETTLED_SUCCESS]: ContractStatus.SETTLED,
    [EventType.SETTLED_FAILURE]: ContractStatus.FORFEITED,
    [EventType.CONTRACT_SETTLED]: ContractStatus.SETTLED,
    [EventType.CONTRACT_FORFEITED]: ContractStatus.FORFEITED,
};

// Define allowed state transitions
const STATE_TRANSITIONS: Record<ContractStatusType, ContractStatusType[]> = {
    [ContractStatus.CREATED]: [ContractStatus.FUNDS_AUTHORIZED],
    [ContractStatus.FUNDS_AUTHORIZED]: [ContractStatus.FUNDS_LOCKED],
    [ContractStatus.FUNDS_LOCKED]: [ContractStatus.LOCKED],
    [ContractStatus.LOCKED]: [ContractStatus.VERIFYING],
    [ContractStatus.VERIFYING]: [ContractStatus.VERIFIED],
    [ContractStatus.VERIFIED]: [ContractStatus.SETTLING],
    [ContractStatus.SETTLING]: [ContractStatus.SETTLED, ContractStatus.FORFEITED, ContractStatus.PAYOUT_PENDING],
    [ContractStatus.PAYOUT_PENDING]: [ContractStatus.SETTLED],  // Retried payout succeeds
    [ContractStatus.SETTLED]: [], // Terminal
    [ContractStatus.FORFEITED]: [], // Terminal
};

// Terminal states
const TERMINAL_STATES: ContractStatusType[] = [
    ContractStatus.SETTLED,
    ContractStatus.FORFEITED,
];

export class InvalidTransitionError extends Error {
    constructor(
        public readonly fromState: ContractStatusType,
        public readonly toState: ContractStatusType,
        public readonly eventType: string
    ) {
        super(`Invalid transition: ${fromState} → ${toState} (event: ${eventType})`);
        this.name = 'InvalidTransitionError';
    }
}

/**
 * Check if a state transition is valid
 * Note: Same-state transitions are allowed as no-ops (e.g., VERIFIED → VERIFIED)
 */
export function canTransition(from: ContractStatusType, to: ContractStatusType): boolean {
    // Allow same-state "transitions" as no-ops
    if (from === to) {
        return true;
    }
    return STATE_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Check if a state is terminal
 */
export function isTerminalState(state: ContractStatusType | null): boolean {
    if (state === null) return false;
    return TERMINAL_STATES.includes(state);
}

/**
 * Error thrown when attempting a write action on a terminal state
 */
export class TerminalStateError extends Error {
    constructor(
        public readonly currentState: ContractStatusType,
        public readonly action: string
    ) {
        super(`Cannot ${action}: contract is in terminal state ${currentState}`);
        this.name = 'TerminalStateError';
    }
}

/**
 * Validate that contract is not in a terminal state
 * @throws TerminalStateError if state is terminal (SETTLED or FORFEITED)
 * 
 * INVARIANT: Once SETTLED or FORFEITED, no further write actions are allowed.
 * This includes: execute, verify, settle.
 */
export function validateNotTerminal(
    currentState: ContractStatusType | null,
    action: string
): void {
    if (currentState && isTerminalState(currentState)) {
        throw new TerminalStateError(currentState, action);
    }
}

/**
 * Validate that a transition is allowed from the current state
 * @throws InvalidTransitionError if transition is not allowed
 */
export function validateTransition(
    fromState: ContractStatusType | null,
    toState: ContractStatusType,
    eventType: string
): void {
    if (fromState === null) {
        // First event must result in CREATED state
        if (toState !== ContractStatus.CREATED) {
            throw new InvalidTransitionError('NULL' as ContractStatusType, toState, eventType);
        }
        return;
    }

    if (!canTransition(fromState, toState)) {
        throw new InvalidTransitionError(fromState, toState, eventType);
    }
}

/**
 * Validate that the current state allows a specific action
 * @throws InvalidTransitionError if not in an allowed from-state
 */
export function validateFromState(
    currentState: ContractStatusType | null,
    allowedFromStates: ContractStatusType[],
    actionName: string
): void {
    if (currentState === null || !allowedFromStates.includes(currentState)) {
        const stateStr = currentState ?? 'NULL';
        throw new InvalidTransitionError(
            stateStr as ContractStatusType,
            'UNKNOWN' as ContractStatusType,
            `${actionName} requires state to be one of: ${allowedFromStates.join(', ')}. Current: ${stateStr}`
        );
    }
}

/**
 * Derive current contract state from ordered ledger events.
 * 
 * @param events - Ledger events ordered by timestampUtc ascending
 * @returns Current derived state, or null if no events
 * @throws InvalidTransitionError if event sequence contains invalid transition
 */
export function deriveState(events: LedgerEvent[]): ContractStatusType | null {
    if (events.length === 0) {
        return null;
    }

    let currentState: ContractStatusType | null = null;

    for (const event of events) {
        const nextState = EVENT_TO_STATE[event.eventType];

        // Skip events that don't affect state (e.g., BASELINE_SNAPSHOTTED, RECEIPT_ISSUED)
        if (!nextState) {
            continue;
        }

        // First state-affecting event sets initial state
        if (currentState === null) {
            currentState = nextState;
            continue;
        }

        // Validate transition
        if (!canTransition(currentState, nextState)) {
            throw new InvalidTransitionError(currentState, nextState, event.eventType);
        }

        currentState = nextState;
    }

    return currentState;
}

/**
 * Derive state with validation but without throwing.
 * Returns state and any validation errors.
 */
export function deriveStateWithValidation(events: LedgerEvent[]): {
    state: ContractStatusType | null;
    isValid: boolean;
    error?: string;
} {
    try {
        const state = deriveState(events);
        return { state, isValid: true };
    } catch (err) {
        if (err instanceof InvalidTransitionError) {
            return {
                state: null,
                isValid: false,
                error: err.message,
            };
        }
        throw err;
    }
}

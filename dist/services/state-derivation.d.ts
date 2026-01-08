/**
 * State Derivation Service
 *
 * Pure function that derives contract state from ordered ledger events.
 * This is the ONLY source of truth for contract state.
 * No state is ever stored or cached.
 */
import { type LedgerEvent, type ContractStatusType } from '../db/schema.js';
export declare class InvalidTransitionError extends Error {
    readonly fromState: ContractStatusType;
    readonly toState: ContractStatusType;
    readonly eventType: string;
    constructor(fromState: ContractStatusType, toState: ContractStatusType, eventType: string);
}
/**
 * Check if a state transition is valid
 * Note: Same-state transitions are allowed as no-ops (e.g., VERIFIED → VERIFIED)
 */
export declare function canTransition(from: ContractStatusType, to: ContractStatusType): boolean;
/**
 * Check if a state is terminal
 */
export declare function isTerminalState(state: ContractStatusType | null): boolean;
/**
 * Error thrown when attempting a write action on a terminal state
 */
export declare class TerminalStateError extends Error {
    readonly currentState: ContractStatusType;
    readonly action: string;
    constructor(currentState: ContractStatusType, action: string);
}
/**
 * Validate that contract is not in a terminal state
 * @throws TerminalStateError if state is terminal (SETTLED or FORFEITED)
 *
 * INVARIANT: Once SETTLED or FORFEITED, no further write actions are allowed.
 * This includes: execute, verify, settle.
 */
export declare function validateNotTerminal(currentState: ContractStatusType | null, action: string): void;
/**
 * Validate that a transition is allowed from the current state
 * @throws InvalidTransitionError if transition is not allowed
 */
export declare function validateTransition(fromState: ContractStatusType | null, toState: ContractStatusType, eventType: string): void;
/**
 * Validate that the current state allows a specific action
 * @throws InvalidTransitionError if not in an allowed from-state
 */
export declare function validateFromState(currentState: ContractStatusType | null, allowedFromStates: ContractStatusType[], actionName: string): void;
/**
 * Derive current contract state from ordered ledger events.
 *
 * @param events - Ledger events ordered by timestampUtc ascending
 * @returns Current derived state, or null if no events
 * @throws InvalidTransitionError if event sequence contains invalid transition
 */
export declare function deriveState(events: LedgerEvent[]): ContractStatusType | null;
/**
 * Derive state with validation but without throwing.
 * Returns state and any validation errors.
 */
export declare function deriveStateWithValidation(events: LedgerEvent[]): {
    state: ContractStatusType | null;
    isValid: boolean;
    error?: string;
};

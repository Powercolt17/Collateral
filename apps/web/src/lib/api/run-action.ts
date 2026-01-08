/**
 * Async Action Helper
 * 
 * Reusable wrapper for all button-triggered API actions.
 * Provides consistent error handling and loading state management.
 * 
 * RULES:
 * - All button-triggered actions must use runAction
 * - No inline try/catch scattered in components
 * - One mental model everywhere
 */

import { ApiError } from './api.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ActionResult<T> {
    /** Success data (undefined if error) */
    data?: T;
    /** Error details (undefined if success) */
    error?: {
        code: string;
        message: string;
    };
}

export interface ActionState {
    /** Is the action currently running? */
    loading: boolean;
    /** Last error (cleared on new action) */
    error?: {
        code: string;
        message: string;
    };
}

// =============================================================================
// RUN ACTION
// =============================================================================

/**
 * Execute an async action with consistent error handling.
 * 
 * Usage:
 * ```
 * const result = await runAction(() => post('/v1/contracts', payload));
 * if (result.error) {
 *   // Handle error (show inline, toast, etc.)
 * } else {
 *   // Success - trigger refresh
 * }
 * ```
 * 
 * @param fn - Async function to execute
 * @returns ActionResult with either data or error
 */
export async function runAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
    try {
        const data = await fn();
        return { data };
    } catch (err) {
        if (err instanceof ApiError) {
            return {
                error: {
                    code: err.code,
                    message: err.message,
                },
            };
        }

        // Unknown error
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        return {
            error: {
                code: 'UNKNOWN_ERROR',
                message,
            },
        };
    }
}

// =============================================================================
// ERROR MESSAGES
// =============================================================================

/**
 * Map error codes to user-friendly messages.
 * Avoids vague messages like "Try again".
 */
export function getErrorMessage(code: string, fallback?: string): string {
    const messages: Record<string, string> = {
        // Auth errors
        'AUTH_REQUIRED': 'Please sign in to continue.',
        'UNAUTHORIZED': 'Your session has expired. Please sign in again.',
        'FORBIDDEN': 'You do not have permission for this action.',

        // Contract errors
        'CONTRACT_NOT_FOUND': 'Contract not found.',
        'INVALID_STATE': 'This action is not available in the current state.',
        'FUNDS_NOT_LOCKED': 'Funds must be locked before executing.',
        'ALREADY_EXECUTED': 'This contract has already been executed.',

        // X connection errors
        'X_NOT_CONNECTED': 'Please connect your X account first.',
        'X_VERIFICATION_FAILED': 'X verification failed. Please check your bio and try again.',
        'UNMET_CONDITION': 'Your account does not meet the requirements.',

        // Funding errors
        'PAYMENT_FAILED': 'Payment could not be processed.',
        'INSUFFICIENT_FUNDS': 'Insufficient funds for this amount.',

        // Generic errors
        'NETWORK_ERROR': 'Network error. Please check your connection.',
        'UNKNOWN_ERROR': 'An unexpected error occurred.',
    };

    return messages[code] || fallback || 'An error occurred. Please try again later.';
}

// =============================================================================
// ACTION STATE MANAGEMENT HOOK (for React)
// =============================================================================

/**
 * Create action state manager for component use.
 * 
 * Usage in React:
 * ```
 * const [state, execute] = useActionState(async () => {
 *   return await post('/v1/contracts', payload);
 * });
 * 
 * <button onClick={execute} disabled={state.loading}>
 *   {state.loading ? 'Loading...' : 'Submit'}
 * </button>
 * {state.error && <Error message={getErrorMessage(state.error.code)} />}
 * ```
 */
export function createActionState(): ActionState {
    return {
        loading: false,
        error: undefined,
    };
}

/**
 * Run action and update state object.
 * 
 * @param state - State object to mutate
 * @param fn - Async function to execute
 * @param onSuccess - Callback on success (e.g., refresh data)
 * @returns ActionResult
 */
export async function runActionWithState<T>(
    state: ActionState,
    fn: () => Promise<T>,
    onSuccess?: (data: T) => void
): Promise<ActionResult<T>> {
    state.loading = true;
    state.error = undefined;

    const result = await runAction(fn);

    state.loading = false;

    if (result.error) {
        state.error = result.error;
    } else if (result.data !== undefined && onSuccess) {
        onSuccess(result.data);
    }

    return result;
}

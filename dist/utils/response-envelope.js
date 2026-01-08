/**
 * Response Envelope Helpers
 *
 * Provides consistent API response shapes for the Aura frontend.
 * All write endpoints use these helpers for predictable wiring.
 *
 * Success: { ok: true, contractId?, eventType?, derivedState?, nextPollMs?, message?, ...data }
 * Error:   { ok: false, code, error, retryable?, retryAfterSeconds? }
 */
// =============================================================================
// SUCCESS HELPERS
// =============================================================================
/**
 * Build a success response envelope
 */
export function successEnvelope(data) {
    return {
        ok: true,
        ...data,
    };
}
/**
 * Send a success response with standard envelope
 */
export function sendSuccess(reply, data, statusCode = 200) {
    reply.status(statusCode).send(successEnvelope(data));
}
// =============================================================================
// ERROR HELPERS
// =============================================================================
/**
 * Build an error response envelope
 */
export function errorEnvelope(code, error, options) {
    return {
        ok: false,
        code,
        error,
        ...(options?.retryable !== undefined && { retryable: options.retryable }),
        ...(options?.retryAfterSeconds !== undefined && { retryAfterSeconds: options.retryAfterSeconds }),
    };
}
/**
 * Send an error response with standard envelope
 */
export function sendError(reply, statusCode, code, error, options) {
    reply.status(statusCode).send(errorEnvelope(code, error, options));
}
// =============================================================================
// COMMON ERROR CODES
// =============================================================================
export const ErrorCodes = {
    // Auth
    AUTH_REQUIRED: 'AUTH_REQUIRED',
    FORBIDDEN: 'FORBIDDEN',
    // Validation
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_FIELD: 'MISSING_FIELD',
    // Resource
    NOT_FOUND: 'NOT_FOUND',
    CONTRACT_NOT_FOUND: 'CONTRACT_NOT_FOUND',
    // State
    INVALID_STATE: 'INVALID_STATE',
    FUNDS_NOT_LOCKED: 'FUNDS_NOT_LOCKED',
    ALREADY_VERIFIED: 'ALREADY_VERIFIED',
    // Connect
    CHALLENGE_COOLDOWN: 'CHALLENGE_COOLDOWN',
    CHALLENGE_EXPIRED: 'CHALLENGE_EXPIRED',
    CODE_NOT_FOUND: 'CODE_NOT_FOUND',
    // Rate limiting
    RATE_LIMITED: 'RATE_LIMITED',
    // Server
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    STRIPE_ERROR: 'STRIPE_ERROR',
};
//# sourceMappingURL=response-envelope.js.map
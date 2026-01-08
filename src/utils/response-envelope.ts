/**
 * Response Envelope Helpers
 * 
 * Provides consistent API response shapes for the Aura frontend.
 * All write endpoints use these helpers for predictable wiring.
 * 
 * Success: { ok: true, contractId?, eventType?, derivedState?, nextPollMs?, message?, ...data }
 * Error:   { ok: false, code, error, retryable?, retryAfterSeconds? }
 */

import { FastifyReply } from 'fastify';

// =============================================================================
// TYPES
// =============================================================================

export interface SuccessEnvelope {
    ok: true;
    contractId?: string;
    eventType?: string;
    derivedState?: string;
    nextPollMs?: number;
    message?: string;
    [key: string]: unknown;
}

export interface ErrorEnvelope {
    ok: false;
    code: string;
    error: string;
    retryable?: boolean;
    retryAfterSeconds?: number;
}

// =============================================================================
// SUCCESS HELPERS
// =============================================================================

/**
 * Build a success response envelope
 */
export function successEnvelope(data: Omit<SuccessEnvelope, 'ok'>): SuccessEnvelope {
    return {
        ok: true,
        ...data,
    };
}

/**
 * Send a success response with standard envelope
 */
export function sendSuccess(
    reply: FastifyReply,
    data: Omit<SuccessEnvelope, 'ok'>,
    statusCode: number = 200
): void {
    reply.status(statusCode).send(successEnvelope(data));
}

// =============================================================================
// ERROR HELPERS
// =============================================================================

/**
 * Build an error response envelope
 */
export function errorEnvelope(
    code: string,
    error: string,
    options?: { retryable?: boolean; retryAfterSeconds?: number }
): ErrorEnvelope {
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
export function sendError(
    reply: FastifyReply,
    statusCode: number,
    code: string,
    error: string,
    options?: { retryable?: boolean; retryAfterSeconds?: number }
): void {
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
} as const;

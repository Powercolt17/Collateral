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
/**
 * Build a success response envelope
 */
export declare function successEnvelope(data: Omit<SuccessEnvelope, 'ok'>): SuccessEnvelope;
/**
 * Send a success response with standard envelope
 */
export declare function sendSuccess(reply: FastifyReply, data: Omit<SuccessEnvelope, 'ok'>, statusCode?: number): void;
/**
 * Build an error response envelope
 */
export declare function errorEnvelope(code: string, error: string, options?: {
    retryable?: boolean;
    retryAfterSeconds?: number;
}): ErrorEnvelope;
/**
 * Send an error response with standard envelope
 */
export declare function sendError(reply: FastifyReply, statusCode: number, code: string, error: string, options?: {
    retryable?: boolean;
    retryAfterSeconds?: number;
}): void;
export declare const ErrorCodes: {
    readonly AUTH_REQUIRED: "AUTH_REQUIRED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly INVALID_INPUT: "INVALID_INPUT";
    readonly MISSING_FIELD: "MISSING_FIELD";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly CONTRACT_NOT_FOUND: "CONTRACT_NOT_FOUND";
    readonly INVALID_STATE: "INVALID_STATE";
    readonly FUNDS_NOT_LOCKED: "FUNDS_NOT_LOCKED";
    readonly ALREADY_VERIFIED: "ALREADY_VERIFIED";
    readonly CHALLENGE_COOLDOWN: "CHALLENGE_COOLDOWN";
    readonly CHALLENGE_EXPIRED: "CHALLENGE_EXPIRED";
    readonly CODE_NOT_FOUND: "CODE_NOT_FOUND";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly STRIPE_ERROR: "STRIPE_ERROR";
};

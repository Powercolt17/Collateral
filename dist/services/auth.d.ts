/**
 * Auth Service
 *
 * JWT-based authentication for Collateral backend.
 *
 * NON-NEGOTIABLE INVARIANTS:
 * - principalUserId MUST come only from auth middleware
 * - Any userId field sent by client MUST be ignored
 * - Token transport: Authorization: Bearer <token>
 *
 * Environment:
 * - AUTH_JWT_SECRET: Secret for signing JWTs (required in production)
 * - AUTH_TOKEN_EXPIRY: Token expiry in seconds (default: 86400 = 24h)
 */
import type { FastifyRequest, FastifyReply } from 'fastify';
/**
 * Assert that payload contains no banned userId fields
 * This provides CENTRAL enforcement across all write endpoints
 *
 * @param payload - Request body object
 * @throws AuthError if banned fields are present
 */
export declare function assertNoUserIdFields(payload: unknown): void;
/**
 * Validate JWT config for testing purposes
 * Throws if config is invalid for production
 */
export declare function validateProductionConfig(): void;
/**
 * Sign an access token for a user
 * @param userId - The user ID to encode in the token
 * @returns JWT access token string
 */
export declare function signAccessToken(userId: string): string;
/**
 * Verify and decode an access token
 * @param token - JWT token string
 * @returns userId if valid, throws on invalid/expired
 */
export declare function verifyAccessToken(token: string): string;
export declare class AuthError extends Error {
    code: string;
    statusCode: number;
    constructor(message: string, code: string, statusCode?: number);
}
declare module 'fastify' {
    interface FastifyRequest {
        principalUserId?: string;
    }
}
/**
 * Parse auth token and set principalUserId on request
 * Does NOT reject if missing - use requireAuth for protection
 */
export declare function parseAuth(request: FastifyRequest): Promise<void>;
/**
 * Middleware that REQUIRES valid auth - returns 401 if missing/invalid
 * Must be used AFTER parseAuth or independently
 */
export declare function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void>;
/**
 * Get the authenticated principal userId from request
 * THROWS if not authenticated - use only in protected endpoints
 *
 * NON-NEGOTIABLE: This is the ONLY source of truth for user identity.
 * NEVER accept userId from request body/query for write operations.
 */
export declare function getPrincipal(request: FastifyRequest): string;
/**
 * Assert that any userId in payload matches principalUserId
 * Returns 400 if mismatch detected (spoof attempt)
 */
export declare function assertPrincipalMatch(request: FastifyRequest, payloadUserId: string | undefined | null): void;

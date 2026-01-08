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
import { createHmac } from 'crypto';
// =============================================================================
// CONFIGURATION
// =============================================================================
const DEV_SECRET_FALLBACK = 'dev-secret-change-in-production';
const JWT_SECRET = process.env.AUTH_JWT_SECRET || DEV_SECRET_FALLBACK;
const TOKEN_EXPIRY_SECONDS = parseInt(process.env.AUTH_TOKEN_EXPIRY || '86400', 10);
// FAIL FAST: In production, JWT secret MUST be set
if (process.env.NODE_ENV === 'production') {
    if (!process.env.AUTH_JWT_SECRET || process.env.AUTH_JWT_SECRET === DEV_SECRET_FALLBACK) {
        throw new Error('FATAL: AUTH_JWT_SECRET must be set in production. ' +
            'Cannot start with missing or default secret.');
    }
}
// =============================================================================
// BANNED USER ID FIELDS (Central enforcement)
// =============================================================================
// Fields that MUST NOT appear in write request payloads
const BANNED_USER_ID_FIELDS = ['userId', 'principalUserId', 'ownerId', 'actorId'];
/**
 * Assert that payload contains no banned userId fields
 * This provides CENTRAL enforcement across all write endpoints
 *
 * @param payload - Request body object
 * @throws AuthError if banned fields are present
 */
export function assertNoUserIdFields(payload) {
    if (!payload || typeof payload !== 'object') {
        return; // Nothing to check
    }
    const obj = payload;
    for (const field of BANNED_USER_ID_FIELDS) {
        if (field in obj && obj[field] !== undefined && obj[field] !== null) {
            throw new AuthError(`Do not supply ${field}; user identity is derived from authentication.`, 'USER_ID_NOT_ALLOWED');
        }
    }
}
/**
 * Validate JWT config for testing purposes
 * Throws if config is invalid for production
 */
export function validateProductionConfig() {
    if (process.env.NODE_ENV === 'production') {
        if (!process.env.AUTH_JWT_SECRET || process.env.AUTH_JWT_SECRET === DEV_SECRET_FALLBACK) {
            throw new Error('AUTH_JWT_SECRET must be set in production');
        }
    }
}
// =============================================================================
// BASE64URL UTILITIES
// =============================================================================
function base64UrlEncode(data) {
    return Buffer.from(data)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
function base64UrlDecode(data) {
    // Pad to make it valid base64
    const padded = data + '==='.slice((data.length + 3) % 4);
    return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
}
// =============================================================================
// JWT SIGNING / VERIFICATION
// =============================================================================
/**
 * Sign an access token for a user
 * @param userId - The user ID to encode in the token
 * @returns JWT access token string
 */
export function signAccessToken(userId) {
    const now = Math.floor(Date.now() / 1000);
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };
    const payload = {
        sub: userId,
        iat: now,
        exp: now + TOKEN_EXPIRY_SECONDS,
    };
    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const payloadB64 = base64UrlEncode(JSON.stringify(payload));
    const signingInput = `${headerB64}.${payloadB64}`;
    const signature = createHmac('sha256', JWT_SECRET)
        .update(signingInput)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return `${signingInput}.${signature}`;
}
/**
 * Verify and decode an access token
 * @param token - JWT token string
 * @returns userId if valid, throws on invalid/expired
 */
export function verifyAccessToken(token) {
    if (!token || typeof token !== 'string') {
        throw new AuthError('Token required', 'TOKEN_MISSING');
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new AuthError('Invalid token format', 'TOKEN_INVALID');
    }
    const [headerB64, payloadB64, signatureB64] = parts;
    // Verify signature
    const signingInput = `${headerB64}.${payloadB64}`;
    const expectedSignature = createHmac('sha256', JWT_SECRET)
        .update(signingInput)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    if (signatureB64 !== expectedSignature) {
        throw new AuthError('Invalid token signature', 'TOKEN_INVALID');
    }
    // Parse payload
    let payload;
    try {
        payload = JSON.parse(base64UrlDecode(payloadB64));
    }
    catch {
        throw new AuthError('Invalid token payload', 'TOKEN_INVALID');
    }
    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
        throw new AuthError('Token expired', 'TOKEN_EXPIRED');
    }
    // Validate required claims
    if (!payload.sub) {
        throw new AuthError('Token missing subject', 'TOKEN_INVALID');
    }
    return payload.sub;
}
// =============================================================================
// AUTH ERROR
// =============================================================================
export class AuthError extends Error {
    code;
    statusCode;
    constructor(message, code, statusCode = 401) {
        super(message);
        this.name = 'AuthError';
        this.code = code;
        this.statusCode = statusCode;
    }
}
// =============================================================================
// MIDDLEWARE
// =============================================================================
/**
 * Parse auth token and set principalUserId on request
 * Does NOT reject if missing - use requireAuth for protection
 */
export async function parseAuth(request) {
    // Try Authorization header first
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
            request.principalUserId = verifyAccessToken(token);
            return;
        }
        catch (err) {
            // Token present but invalid - still set to undefined
            request.principalUserId = undefined;
            return;
        }
    }
    request.principalUserId = undefined;
}
/**
 * Middleware that REQUIRES valid auth - returns 401 if missing/invalid
 * Must be used AFTER parseAuth or independently
 */
export async function requireAuth(request, reply) {
    // Parse if not already done
    if (request.principalUserId === undefined) {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthError('Authorization required', 'AUTH_REQUIRED');
        }
        const token = authHeader.slice(7);
        try {
            request.principalUserId = verifyAccessToken(token);
        }
        catch (err) {
            throw err; // verifyAccessToken already throws AuthError with statusCode
        }
    }
    if (!request.principalUserId) {
        throw new AuthError('Authorization required', 'AUTH_REQUIRED');
    }
}
// =============================================================================
// PRINCIPAL EXTRACTION
// =============================================================================
/**
 * Get the authenticated principal userId from request
 * THROWS if not authenticated - use only in protected endpoints
 *
 * NON-NEGOTIABLE: This is the ONLY source of truth for user identity.
 * NEVER accept userId from request body/query for write operations.
 */
export function getPrincipal(request) {
    if (!request.principalUserId) {
        throw new AuthError('Not authenticated', 'AUTH_REQUIRED');
    }
    return request.principalUserId;
}
/**
 * Assert that any userId in payload matches principalUserId
 * Returns 400 if mismatch detected (spoof attempt)
 */
export function assertPrincipalMatch(request, payloadUserId) {
    const principal = getPrincipal(request);
    if (payloadUserId && payloadUserId !== principal) {
        throw new AuthError(`Payload userId mismatch: request attempted to act as ${payloadUserId}`, 'USER_MISMATCH');
    }
}
//# sourceMappingURL=auth.js.map
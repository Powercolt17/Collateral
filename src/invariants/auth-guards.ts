/**
 * Auth Guards - I1 Principal Enforcement
 * 
 * Central, unbypassable enforcement of principalUserId derivation.
 * 
 * NON-NEGOTIABLE INVARIANTS:
 * - principalUserId MUST come only from auth middleware
 * - Any userId/principalUserId/ownerId/actorId in payload is REJECTED
 * - This applies to ALL write routes (POST/PUT/PATCH/DELETE)
 */

import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { requireAuth, getPrincipal, AuthError } from '../services/auth.js';

// =============================================================================
// CONFIGURATION
// =============================================================================

// Fields that MUST NOT appear in write request payloads
const BANNED_USER_ID_FIELDS = ['userId', 'principalUserId', 'ownerId', 'actorId'];

// Recursive scan limits to prevent performance issues
const MAX_SCAN_DEPTH = 4;
const MAX_SCAN_NODES = 100;

// =============================================================================
// ENHANCED RECURSIVE FIELD SCANNER
// =============================================================================

interface ScanContext {
    nodesScanned: number;
}

/**
 * Recursively scan object for banned userId fields
 * 
 * @param obj Object to scan
 * @param depth Current depth (0-indexed)
 * @param ctx Mutable context for tracking nodes scanned
 * @returns Field name if found, undefined otherwise
 */
function scanForBannedFields(
    obj: unknown,
    depth: number,
    ctx: ScanContext
): string | undefined {
    // Depth limit check
    if (depth > MAX_SCAN_DEPTH) {
        return undefined;
    }

    // Node limit check
    if (ctx.nodesScanned > MAX_SCAN_NODES) {
        return undefined;
    }

    // Skip null/undefined/non-objects
    if (!obj || typeof obj !== 'object') {
        return undefined;
    }

    ctx.nodesScanned++;

    // Handle arrays
    if (Array.isArray(obj)) {
        for (const item of obj) {
            const found = scanForBannedFields(item, depth + 1, ctx);
            if (found) return found;
        }
        return undefined;
    }

    // Handle objects
    const record = obj as Record<string, unknown>;
    for (const key of Object.keys(record)) {
        // Check if this key is banned
        if (BANNED_USER_ID_FIELDS.includes(key)) {
            const value = record[key];
            // Only trigger on non-null/non-undefined values
            if (value !== null && value !== undefined) {
                return key;
            }
        }

        // Recurse into nested objects
        const found = scanForBannedFields(record[key], depth + 1, ctx);
        if (found) return found;
    }

    return undefined;
}

/**
 * Assert that payload contains no banned userId fields (including nested)
 * 
 * @param payload Request body to check
 * @throws AuthError if banned field found
 */
export function assertNoUserIdFieldsDeep(payload: unknown): void {
    const ctx: ScanContext = { nodesScanned: 0 };
    const foundField = scanForBannedFields(payload, 0, ctx);

    if (foundField) {
        throw new AuthError(
            `Do not supply ${foundField}; user identity is derived from authentication.`,
            'USER_ID_NOT_ALLOWED'
        );
    }
}

// =============================================================================
// GLOBAL WRITE ROUTE GUARD
// =============================================================================

/**
 * Pre-handler hook for ALL write routes
 * Enforces: requireAuth + no userId fields in body
 * 
 * This MUST be applied globally to prevent any write route from
 * "forgetting" to enforce these invariants.
 */
export async function writeRouteGuard(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    // Step 1: Require authentication
    await requireAuth(request, reply);

    // Step 2: Reject any userId fields in body (including nested)
    try {
        assertNoUserIdFieldsDeep(request.body);
    } catch (err) {
        if (err instanceof AuthError) {
            reply.status(400);
            throw err;
        }
        throw err;
    }
}

/**
 * Register write route guards on a Fastify instance
 * 
 * This should be called on the write routes plugin to enforce
 * guards on ALL POST/PUT/PATCH/DELETE routes.
 * 
 * @param fastify Fastify instance for write routes
 */
export function registerWriteRouteGuards(fastify: FastifyInstance): void {
    // Add preHandler hook that runs for ALL routes in this scope
    fastify.addHook('preHandler', async (request, reply) => {
        // Only apply to write methods
        const method = request.method.toUpperCase();
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            await writeRouteGuard(request, reply);
        }
    });

    console.log('✅ Write route guards registered (requireAuth + assertNoUserIdFieldsDeep)');
}

// =============================================================================
// RE-EXPORTS FOR CONVENIENCE
// =============================================================================

export { requireAuth, getPrincipal, AuthError };

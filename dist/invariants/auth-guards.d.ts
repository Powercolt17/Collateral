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
/**
 * Assert that payload contains no banned userId fields (including nested)
 *
 * @param payload Request body to check
 * @throws AuthError if banned field found
 */
export declare function assertNoUserIdFieldsDeep(payload: unknown): void;
/**
 * Pre-handler hook for ALL write routes
 * Enforces: requireAuth + no userId fields in body
 *
 * This MUST be applied globally to prevent any write route from
 * "forgetting" to enforce these invariants.
 */
export declare function writeRouteGuard(request: FastifyRequest, reply: FastifyReply): Promise<void>;
/**
 * Register write route guards on a Fastify instance
 *
 * This should be called on the write routes plugin to enforce
 * guards on ALL POST/PUT/PATCH/DELETE routes.
 *
 * @param fastify Fastify instance for write routes
 */
export declare function registerWriteRouteGuards(fastify: FastifyInstance): void;
export { requireAuth, getPrincipal, AuthError };

/**
 * Contract Write Routes
 *
 * Write endpoints for contract lifecycle.
 * State is NEVER stored - derived from ledger events.
 *
 * NON-NEGOTIABLE INVARIANTS (ENFORCED GLOBALLY):
 * - principalUserId MUST come only from auth middleware (NEVER from request body)
 * - Any userId/principalUserId/ownerId/actorId field in body is REJECTED with 400
 * - These are enforced by registerWriteRouteGuards() - individual routes cannot bypass
 *
 * All write operations:
 * 1. Load ordered ledger events (timestampUtc, id)
 * 2. Derive current state
 * 3. Validate from-state allows the action
 * 4. Append ledger event(s)
 */
import { FastifyPluginAsync } from 'fastify';
declare const contractWriteRoutes: FastifyPluginAsync;
export default contractWriteRoutes;

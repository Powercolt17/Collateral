/**
 * Contract Read Routes (v1)
 *
 * All endpoints return derived state computed from ledger events.
 * Auth required - users can only read their own contracts.
 *
 * Endpoints:
 *   GET /v1/contracts           - List user's contracts
 *   GET /v1/contracts/:id       - Contract detail with events timeline
 *
 * SECURITY:
 * - metadataJson is deep-sanitized to remove sensitive fields at any nesting level
 * - challengeCode, Stripe secrets, raw webhook payloads NEVER returned
 */
import { FastifyPluginAsync } from 'fastify';
declare const contractReadRoutes: FastifyPluginAsync;
export default contractReadRoutes;

/**
 * Ops Routes
 *
 * Server-only administrative endpoints for operations.
 * Protected by OPS_TOKEN secret header.
 *
 * These endpoints are NOT exposed to public API.
 */
import { FastifyPluginAsync } from 'fastify';
declare const opsRoutes: FastifyPluginAsync;
export default opsRoutes;

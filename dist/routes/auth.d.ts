import { FastifyPluginAsync } from 'fastify';
/**
 * Auth Routes
 *
 * JWT-based authentication with proper token signing
 * Identity binding management with append-only audit trail
 */
declare const authRoutes: FastifyPluginAsync;
export default authRoutes;

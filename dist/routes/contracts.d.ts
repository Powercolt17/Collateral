/**
 * Contract Routes (Read-Only)
 *
 * All endpoints return derived state computed from ledger events.
 * No state is persisted on the contract record.
 */
import { FastifyPluginAsync } from 'fastify';
declare const contractRoutes: FastifyPluginAsync;
export default contractRoutes;

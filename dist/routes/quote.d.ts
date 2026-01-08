/**
 * Contract Quote Routes
 *
 * POST /v1/contracts/quote - Get pricing quote for a contract
 */
import { FastifyInstance } from 'fastify';
declare function quoteRoutes(fastify: FastifyInstance): Promise<void>;
export default quoteRoutes;

/**
 * Stripe Connect Routes
 *
 * OAuth flow for connecting user's Stripe account:
 * 1. GET /v1/connect/stripe/start - Redirect to Stripe OAuth
 * 2. GET /v1/connect/stripe/callback - Handle OAuth callback
 * 3. GET /v1/connect/stripe/status - Check connection status
 */
import { FastifyInstance } from 'fastify';
declare function stripeConnectRoutes(fastify: FastifyInstance): Promise<void>;
export default stripeConnectRoutes;

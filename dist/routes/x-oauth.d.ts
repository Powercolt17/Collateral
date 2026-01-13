/**
 * X OAuth Routes - Connect X via OAuth 2.0 PKCE
 *
 * Flow:
 * 1. GET /v1/connect/x/oauth/start - Generate OAuth URL with PKCE challenge
 * 2. GET /v1/connect/x/oauth/callback - Handle callback, exchange code for tokens
 * 3. GET /v1/connect/x/status - Check current X connection status
 *
 * X API calls happen ONLY at:
 * - OAuth callback (to get user profile)
 * - Contract execution (baseline followers)
 * - Contract verification (final followers)
 */
import { FastifyInstance } from 'fastify';
declare function xOAuthRoutes(fastify: FastifyInstance): Promise<void>;
export default xOAuthRoutes;

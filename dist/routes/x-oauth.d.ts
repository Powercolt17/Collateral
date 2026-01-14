/**
 * X OAuth Routes - Connect X via OAuth 1.0a
 *
 * Uses OAuth 1.0a because the Free tier X API blocks /2/users/me.
 * OAuth 1.0a with verify_credentials works reliably on all tiers.
 *
 * Flow:
 * 1. GET /v1/connect/x/oauth/start - Get request token, redirect to X
 * 2. GET /v1/connect/x/oauth/callback - Exchange for access token, fetch profile
 * 3. GET /v1/connect/x/status - Check current X connection status
 *
 * Requires env vars:
 * - X_API_KEY (Consumer Key)
 * - X_API_SECRET (Consumer Secret)
 * - X_OAUTH_REDIRECT_URI (Callback URL)
 */
import { FastifyInstance } from 'fastify';
declare function xOAuthRoutes(fastify: FastifyInstance): Promise<void>;
export default xOAuthRoutes;

/**
 * X (Twitter) OAuth 2.0 Helpers
 *
 * These functions help implement the OAuth 2.0 PKCE flow for X.
 * They are designed to be called from API routes, not directly from the adapter.
 *
 * FLOW:
 * 1. GET /auth/x/start -> calls getXAuthUrl(), redirect user
 * 2. X redirects back to /auth/x/callback with code
 * 3. POST /auth/x/callback -> calls exchangeCodeForToken()
 * 4. Store tokens in connected_accounts
 *
 * REQUIRED ENV VARS:
 * - X_CLIENT_ID: OAuth 2.0 Client ID from X Developer Portal
 * - X_CLIENT_SECRET: OAuth 2.0 Client Secret (for confidential clients)
 * - X_REDIRECT_URI: Callback URL registered with X (e.g., https://api.collateral.market/auth/x/callback)
 */
export interface XOAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}
export interface XTokenPayload {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
    xUserId: string;
    xUsername: string;
    scope: string;
}
/**
 * Get OAuth configuration from environment
 * Throws if not configured
 */
export declare function getXOAuthConfig(): XOAuthConfig;
/**
 * Generate the authorization URL for X OAuth 2.0 PKCE flow
 *
 * @param state - CSRF protection state (store in session)
 * @param codeChallenge - PKCE code challenge (SHA256 hash of verifier, base64url encoded)
 * @returns URL to redirect user to
 */
export declare function getXAuthUrl(state: string, codeChallenge: string): string;
/**
 * Exchange authorization code for tokens
 *
 * @param code - Authorization code from callback
 * @param codeVerifier - PKCE code verifier (original random string)
 * @returns Token payload with user info
 */
export declare function exchangeCodeForToken(code: string, codeVerifier: string): Promise<XTokenPayload>;
/**
 * Refresh an expired access token
 *
 * @param refreshToken - The refresh token
 * @returns New token payload
 */
export declare function refreshAccessToken(refreshToken: string): Promise<Omit<XTokenPayload, 'xUserId' | 'xUsername'>>;
/**
 * Generate PKCE code verifier (random string)
 */
export declare function generateCodeVerifier(): string;
/**
 * Generate PKCE code challenge from verifier
 */
export declare function generateCodeChallenge(verifier: string): string;

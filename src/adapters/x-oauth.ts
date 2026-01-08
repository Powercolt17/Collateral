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

import { XAdapterError } from './x.js';

// Required environment variables
const X_CLIENT_ID = process.env.X_CLIENT_ID;
const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET;
const X_REDIRECT_URI = process.env.X_REDIRECT_URI;

// X OAuth 2.0 endpoints
const X_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const X_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';

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
export function getXOAuthConfig(): XOAuthConfig {
    if (!X_CLIENT_ID || !X_CLIENT_SECRET || !X_REDIRECT_URI) {
        throw new XAdapterError(
            'X OAuth not configured. Set X_CLIENT_ID, X_CLIENT_SECRET, and X_REDIRECT_URI.',
            false,
            'CONFIG'
        );
    }

    return {
        clientId: X_CLIENT_ID,
        clientSecret: X_CLIENT_SECRET,
        redirectUri: X_REDIRECT_URI,
    };
}

/**
 * Generate the authorization URL for X OAuth 2.0 PKCE flow
 * 
 * @param state - CSRF protection state (store in session)
 * @param codeChallenge - PKCE code challenge (SHA256 hash of verifier, base64url encoded)
 * @returns URL to redirect user to
 */
export function getXAuthUrl(state: string, codeChallenge: string): string {
    const config = getXOAuthConfig();

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: 'tweet.read users.read offline.access',
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    });

    return `${X_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 * 
 * @param code - Authorization code from callback
 * @param codeVerifier - PKCE code verifier (original random string)
 * @returns Token payload with user info
 */
export async function exchangeCodeForToken(code: string, codeVerifier: string): Promise<XTokenPayload> {
    const config = getXOAuthConfig();

    // Token request
    const response = await fetch(X_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: config.redirectUri,
            code_verifier: codeVerifier,
        }),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new XAdapterError(
            `X token exchange failed (${response.status}): ${body}`,
            false,
            'AUTH'
        );
    }

    interface TokenResponse {
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
        scope: string;
    }

    const tokenData: TokenResponse = await response.json();

    // Get user info
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
        },
    });

    if (!userResponse.ok) {
        throw new XAdapterError(
            `Failed to get X user info (${userResponse.status})`,
            false,
            'AUTH'
        );
    }

    interface UserResponse {
        data: {
            id: string;
            username: string;
        };
    }

    const userData: UserResponse = await userResponse.json();

    return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : undefined,
        xUserId: userData.data.id,
        xUsername: userData.data.username,
        scope: tokenData.scope,
    };
}

/**
 * Refresh an expired access token
 * 
 * @param refreshToken - The refresh token
 * @returns New token payload
 */
export async function refreshAccessToken(refreshToken: string): Promise<Omit<XTokenPayload, 'xUserId' | 'xUsername'>> {
    const config = getXOAuthConfig();

    const response = await fetch(X_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new XAdapterError(
            `X token refresh failed (${response.status}): ${body}`,
            false,
            'AUTH'
        );
    }

    interface TokenResponse {
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
        scope: string;
    }

    const tokenData: TokenResponse = await response.json();

    return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : undefined,
        scope: tokenData.scope,
    };
}

// =============================================================================
// PKCE HELPERS
// =============================================================================

import { createHash, randomBytes } from 'crypto';

/**
 * Generate PKCE code verifier (random string)
 */
export function generateCodeVerifier(): string {
    return randomBytes(32).toString('base64url');
}

/**
 * Generate PKCE code challenge from verifier
 */
export function generateCodeChallenge(verifier: string): string {
    return createHash('sha256').update(verifier).digest('base64url');
}

/**
 * Connect X Flow Hook
 * 
 * Handles the X account connection flow:
 * 1. Start → generate challenge code (requires username)
 * 2. User adds code to X bio
 * 3. Verify → account linked
 */

import { get, post } from '../api/api.js';
import { runAction } from '../api/run-action.js';

// =============================================================================
// TYPES
// =============================================================================

export interface XStartResponse {
    platform: string;
    username: string;
    xUserId: string;
    verificationStatus: string;
    challengeCode?: string;      // Only in non-production
    codeMasked?: string;         // Only in production
    instructions: string;
    expiresInMinutes: number;
}

export interface XVerifyResponse {
    platform: string;
    xUserId: string;
    verificationStatus: string;
    verifiedAt?: string;
}

export interface XConnectionStatus {
    connected: boolean;
    verified: boolean;
    username?: string;
    accountId?: string;
}

// =============================================================================
// API CALLS
// =============================================================================

/**
 * Start X connection flow.
 * @param username - X username (without @)
 * @returns Challenge code response
 */
export async function startXConnection(username: string) {
    return runAction(() => post<XStartResponse>('/v1/connect/x/start', { username }));
}

/**
 * Verify X connection.
 * Backend checks bio for challenge code.
 */
export async function verifyXConnection() {
    return runAction(() => post<XVerifyResponse>('/v1/connect/x/verify', {}));
}

/**
 * Get current X connection status.
 */
export async function getXConnectionStatus() {
    return runAction(async () => {
        // Use /v1/connect/status endpoint
        const response = await get<{
            platforms: Array<{
                platform: string;
                verificationStatus: string;
                externalAccountId: string;
            }>
        }>('/v1/connect/status');

        const xAccount = response.platforms?.find(
            a => a.platform === 'X' && a.verificationStatus === 'VERIFIED'
        );

        if (xAccount) {
            return {
                connected: true,
                verified: true,
                accountId: xAccount.externalAccountId,
            };
        }

        return {
            connected: false,
            verified: false,
        };
    });
}

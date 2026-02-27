/**
 * Verified Connection Enforcement
 * 
 * Single choke point for requiring verified platform connections
 * before contract creation or execution.
 */

import { db } from '../db/client.js';
import { connectedAccounts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

// =========================================================
// ERROR CODES (Distinct for UI clarity)
// =========================================================
export type PlatformErrorCode =
    | 'PLATFORM_NOT_CONNECTED'    // No row exists
    | 'PLATFORM_CONNECTION_INACTIVE'  // status !== 'ACTIVE'
    | 'PLATFORM_NOT_VERIFIED';    // verificationStatus !== 'VERIFIED'

export class PlatformNotVerifiedError extends Error {
    public readonly code: PlatformErrorCode;
    public readonly platform: string;
    public readonly status: number = 409;

    constructor(code: PlatformErrorCode, platform: string, message?: string) {
        super(message || `${platform} connection issue: ${code}`);
        this.name = 'PlatformNotVerifiedError';
        this.code = code;
        this.platform = platform;
    }
}

// =========================================================
// TYPED METADATA (safe subsets per platform)
// =========================================================
export interface XVerifiedMetadata {
    resolvedUsername: string;
    xUserId: string;
}

export interface StripeVerifiedMetadata {
    stripeConnectedAccountId: string;
}

export interface ShopifyVerifiedMetadata {
    shopDomain: string;
    shopName: string;
}

export interface AmazonVerifiedMetadata {
    sellerId: string;
}

export type SupportedPlatform = 'X' | 'STRIPE' | 'SHOPIFY' | 'AMAZON';

export interface VerifiedConnection<T = unknown> {
    id: string;
    userId: string;
    platform: SupportedPlatform;
    externalAccountId: string;
    metadata: T;
}

/**
 * Require a verified connection for the given platform.
 * Throws PlatformNotVerifiedError with distinct codes.
 * Returns typed metadata for the platform.
 */
export async function requireVerifiedConnection(
    userId: string,
    platform: 'X'
): Promise<VerifiedConnection<XVerifiedMetadata>>;
export async function requireVerifiedConnection(
    userId: string,
    platform: 'STRIPE'
): Promise<VerifiedConnection<StripeVerifiedMetadata>>;
export async function requireVerifiedConnection(
    userId: string,
    platform: 'SHOPIFY'
): Promise<VerifiedConnection<ShopifyVerifiedMetadata>>;
export async function requireVerifiedConnection(
    userId: string,
    platform: 'AMAZON'
): Promise<VerifiedConnection<AmazonVerifiedMetadata>>;
export async function requireVerifiedConnection(
    userId: string,
    platform: SupportedPlatform
): Promise<VerifiedConnection>;
export async function requireVerifiedConnection(
    userId: string,
    platform: SupportedPlatform
): Promise<VerifiedConnection> {
    const [account] = await db
        .select({
            id: connectedAccounts.id,
            userId: connectedAccounts.userId,
            platform: connectedAccounts.platform,
            externalAccountId: connectedAccounts.externalAccountId,
            status: connectedAccounts.status,
            verificationStatus: connectedAccounts.verificationStatus,
            metadataJson: connectedAccounts.metadataJson,
        })
        .from(connectedAccounts)
        .where(
            and(
                eq(connectedAccounts.userId, userId),
                eq(connectedAccounts.platform, platform)
            )
        )
        .limit(1);

    // No row exists
    if (!account) {
        throw new PlatformNotVerifiedError(
            'PLATFORM_NOT_CONNECTED',
            platform,
            `No ${platform} account connected. Please connect your ${platform} account first.`
        );
    }

    // Connection inactive (e.g., revoked)
    if (account.status !== 'ACTIVE') {
        throw new PlatformNotVerifiedError(
            'PLATFORM_CONNECTION_INACTIVE',
            platform,
            `${platform} connection is inactive or revoked. Please reconnect.`
        );
    }

    // Not verified
    if (account.verificationStatus !== 'VERIFIED') {
        throw new PlatformNotVerifiedError(
            'PLATFORM_NOT_VERIFIED',
            platform,
            `${platform} connection not verified. Complete verification first.`
        );
    }

    // Extract typed metadata
    const rawMeta = account.metadataJson as Record<string, unknown> | null;

    if (platform === 'X') {
        const resolvedUsername = (rawMeta?.resolvedUsername as string) || '';
        const xUserId = (rawMeta?.xUserId as string) || account.externalAccountId;

        // Fail-closed: X verified but no identity data is a server bug
        if (!resolvedUsername) {
            throw new PlatformNotVerifiedError(
                'PLATFORM_CONNECTION_INACTIVE',
                platform,
                'X account verified but identity data missing. Please reconnect your X account.'
            );
        }

        const metadata: XVerifiedMetadata = {
            resolvedUsername,
            xUserId,
        };
        return {
            id: account.id,
            userId: account.userId,
            platform: 'X',
            externalAccountId: account.externalAccountId,
            metadata,
        };
    } else if (platform === 'STRIPE') {
        const metadata: StripeVerifiedMetadata = {
            stripeConnectedAccountId: account.externalAccountId,
        };
        return {
            id: account.id,
            userId: account.userId,
            platform: 'STRIPE',
            externalAccountId: account.externalAccountId,
            metadata,
        };
    } else if (platform === 'SHOPIFY') {
        const metadata: ShopifyVerifiedMetadata = {
            shopDomain: account.externalAccountId,
            shopName: (rawMeta?.shopName as string) || account.externalAccountId,
        };
        return {
            id: account.id,
            userId: account.userId,
            platform: 'SHOPIFY',
            externalAccountId: account.externalAccountId,
            metadata,
        };
    } else {
        // AMAZON or future platforms
        return {
            id: account.id,
            userId: account.userId,
            platform,
            externalAccountId: account.externalAccountId,
            metadata: { sellerId: account.externalAccountId },
        };
    }
}

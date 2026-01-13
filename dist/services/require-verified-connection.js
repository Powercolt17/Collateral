/**
 * Verified Connection Enforcement
 *
 * Single choke point for requiring verified platform connections
 * before contract creation or execution.
 */
import { db } from '../db/client.js';
import { connectedAccounts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
export class PlatformNotVerifiedError extends Error {
    code;
    platform;
    status = 409;
    constructor(code, platform, message) {
        super(message || `${platform} connection issue: ${code}`);
        this.name = 'PlatformNotVerifiedError';
        this.code = code;
        this.platform = platform;
    }
}
export async function requireVerifiedConnection(userId, platform) {
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
        .where(and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, platform)))
        .limit(1);
    // No row exists
    if (!account) {
        throw new PlatformNotVerifiedError('PLATFORM_NOT_CONNECTED', platform, `No ${platform} account connected. Please connect your ${platform} account first.`);
    }
    // Connection inactive (e.g., revoked)
    if (account.status !== 'ACTIVE') {
        throw new PlatformNotVerifiedError('PLATFORM_CONNECTION_INACTIVE', platform, `${platform} connection is inactive or revoked. Please reconnect.`);
    }
    // Not verified
    if (account.verificationStatus !== 'VERIFIED') {
        throw new PlatformNotVerifiedError('PLATFORM_NOT_VERIFIED', platform, `${platform} connection not verified. Complete verification first.`);
    }
    // Extract typed metadata
    const rawMeta = account.metadataJson;
    if (platform === 'X') {
        const resolvedUsername = rawMeta?.resolvedUsername || '';
        const xUserId = rawMeta?.xUserId || account.externalAccountId;
        // Fail-closed: X verified but no identity data is a server bug
        if (!resolvedUsername) {
            throw new PlatformNotVerifiedError('PLATFORM_CONNECTION_INACTIVE', platform, 'X account verified but identity data missing. Please reconnect your X account.');
        }
        const metadata = {
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
    }
    else {
        const metadata = {
            stripeConnectedAccountId: account.externalAccountId,
        };
        return {
            id: account.id,
            userId: account.userId,
            platform: 'STRIPE',
            externalAccountId: account.externalAccountId,
            metadata,
        };
    }
}
//# sourceMappingURL=require-verified-connection.js.map
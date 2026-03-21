import { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client.js';
import { users, identities, contracts, connectedAccounts } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { getEventsForContract } from '../services/ledger.js';
import { deriveState } from '../services/state-derivation.js';

const usersRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * GET /users/me
     * Current session user info
     * Note: In production, this would use session/JWT authentication
     * For now, we accept a userId query param for development
     */
    fastify.get<{
        Querystring: { userId?: string };
    }>('/users/me', async (request, reply) => {
        const { userId } = request.query;

        if (!userId) {
            reply.status(401);
            return { error: 'Not authenticated' };
        }

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user) {
            reply.status(404);
            return { error: 'User not found' };
        }

        // Get identity
        const [identity] = await db
            .select()
            .from(identities)
            .where(eq(identities.userId, userId))
            .limit(1);

        return {
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
            },
            identity: identity ? {
                username: identity.username,
                displayName: identity.displayName,
                bio: identity.bio,
                photoUrl: identity.photoUrl,
                status: identity.status,
            } : null,
        };
    });

    /**
     * GET /users/me/contracts
     * Current user's contracts with derived state
     */
    fastify.get<{
        Querystring: { userId?: string };
    }>('/users/me/contracts', async (request, reply) => {
        const { userId } = request.query;

        if (!userId) {
            reply.status(401);
            return { error: 'Not authenticated' };
        }

        const userContracts = await db
            .select()
            .from(contracts)
            .where(eq(contracts.principalUserId, userId))
            .orderBy(contracts.createdAt);

        // Derive state for each contract
        const contractsWithState = await Promise.all(
            userContracts.map(async (c) => {
                const events = await getEventsForContract(c.id);
                const state = deriveState(events);
                return { ...c, state };
            })
        );

        return {
            contracts: contractsWithState.map(c => ({
                id: c.id,
                platform: c.platform,
                metricType: c.metricType,
                condition: c.conditionJson,
                baseline: c.baselineJson,
                deadline: c.deadlineUtc.toISOString(),
                lockAmountUsdCents: c.lockAmountUsdCents,
                fundingMethod: c.fundingMethod,
                state: c.state, // Derived, not stored
                createdAt: c.createdAt.toISOString(),
                updatedAt: c.updatedAt.toISOString(),
            })),
        };
    });

    /**
     * GET /v1/me/connected-accounts
     * Get all connected accounts for the current user
     * Used by frontend to determine available platforms
     */
    fastify.get('/v1/me/connected-accounts', async (request, reply) => {
        const userId = (request as any).userId;

        if (!userId) {
            reply.status(401);
            return { error: 'Authentication required' };
        }

        // Import connectedAccounts here
        const { connectedAccounts } = await import('../db/schema.js');

        const accounts = await db
            .select({
                id: connectedAccounts.id,
                platform: connectedAccounts.platform,
                externalAccountId: connectedAccounts.externalAccountId,
                status: connectedAccounts.status,
                verificationStatus: connectedAccounts.verificationStatus,
                verifiedAt: connectedAccounts.verifiedAt,
                connectedAt: connectedAccounts.connectedAt,
            })
            .from(connectedAccounts)
            .where(eq(connectedAccounts.userId, userId));

        // Build platform status map
        const platforms: Record<string, { connected: boolean; verified: boolean; accountId?: string }> = {
            X: { connected: false, verified: false },
            STRIPE: { connected: false, verified: false },
            GITHUB: { connected: false, verified: false },
        };

        for (const account of accounts) {
            if (platforms[account.platform]) {
                platforms[account.platform] = {
                    connected: account.status === 'ACTIVE',
                    verified: account.verificationStatus === 'VERIFIED',
                    accountId: account.externalAccountId,
                };
            }
        }

        return {
            accounts: accounts.map(a => ({
                id: a.id,
                platform: a.platform,
                accountId: a.externalAccountId,
                status: a.status,
                verificationStatus: a.verificationStatus,
                verifiedAt: a.verifiedAt?.toISOString() || null,
                connectedAt: a.connectedAt.toISOString(),
            })),
            platforms,
        };
    });

    /**
     * GET /v1/me/profile
     * Get complete profile with stats for profile page
     * Returns: user, identity, connection info (from canonical connected_accounts), contract stats
     */
    fastify.get('/v1/me/profile', async (request, reply) => {
        const userId = (request as any).userId;

        if (!userId) {
            reply.status(401);
            return { error: 'Authentication required' };
        }

        // Get user
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user) {
            reply.status(404);
            return { error: 'User not found' };
        }

        // Get identity
        const [identity] = await db
            .select()
            .from(identities)
            .where(eq(identities.userId, userId))
            .limit(1);

        // Get connected accounts (CANONICAL source for connection status)
        const accounts = await db
            .select()
            .from(connectedAccounts)
            .where(eq(connectedAccounts.userId, userId));

        // Build X connection from connected_accounts (canonical)
        const xAccount = accounts.find(a => a.platform === 'X');
        // Parse metadataJson safely (could be null, string, or object)
        let xMeta: any = null;
        if (xAccount?.metadataJson) {
            try {
                xMeta = typeof xAccount.metadataJson === 'string'
                    ? JSON.parse(xAccount.metadataJson)
                    : xAccount.metadataJson;
            } catch (e) {
                xMeta = null;
            }
        }
        const xConnection = xAccount ? {
            connected: xAccount.status === 'ACTIVE',
            verified: xAccount.verificationStatus === 'VERIFIED',
            xUserId: xAccount.externalAccountId,
            xUsername: xMeta?.resolvedUsername || null,
            connectedAt: xAccount.connectedAt?.toISOString() || null,
        } : {
            connected: false,
            verified: false,
        };

        // Build Stripe connection from connected_accounts (canonical)
        const stripeAccount = accounts.find(a => a.platform === 'STRIPE');
        const stripeConnection = stripeAccount ? {
            connected: stripeAccount.status === 'ACTIVE',
            verified: stripeAccount.verificationStatus === 'VERIFIED',
            accountId: stripeAccount.externalAccountId,
            connectedAt: stripeAccount.connectedAt?.toISOString() || null,
        } : {
            connected: false,
            verified: false,
        };

        // Build Shopify connection from connected_accounts (canonical)
        const shopifyAccount = accounts.find(a => a.platform === 'SHOPIFY');
        let shopifyMeta: any = null;
        if (shopifyAccount?.metadataJson) {
            try {
                shopifyMeta = typeof shopifyAccount.metadataJson === 'string'
                    ? JSON.parse(shopifyAccount.metadataJson)
                    : shopifyAccount.metadataJson;
            } catch (e) {
                shopifyMeta = null;
            }
        }
        const shopifyConnection = shopifyAccount ? {
            connected: shopifyAccount.status === 'ACTIVE',
            verified: shopifyAccount.verificationStatus === 'VERIFIED',
            shop: shopifyMeta?.shop || shopifyAccount.externalAccountId || null,
            connectedAt: shopifyAccount.connectedAt?.toISOString() || null,
        } : {
            connected: false,
            verified: false,
        };

        // Build Amazon connection from connected_accounts (canonical)
        const amazonAccount = accounts.find(a => a.platform === 'AMAZON');
        const amazonConnection = amazonAccount ? {
            connected: amazonAccount.status === 'ACTIVE',
            verified: amazonAccount.verificationStatus === 'VERIFIED',
            sellerId: amazonAccount.externalAccountId || null,
            connectedAt: amazonAccount.connectedAt?.toISOString() || null,
        } : {
            connected: false,
            verified: false,
        };

        // Build YouTube connection from connected_accounts (canonical)
        const youtubeAccount = accounts.find(a => a.platform === 'YOUTUBE');
        let youtubeMeta: any = null;
        if (youtubeAccount?.metadataJson) {
            try {
                youtubeMeta = typeof youtubeAccount.metadataJson === 'string'
                    ? JSON.parse(youtubeAccount.metadataJson)
                    : youtubeAccount.metadataJson;
            } catch (e) {
                youtubeMeta = null;
            }
        }
        const youtubeConnection = youtubeAccount ? {
            connected: youtubeAccount.status === 'ACTIVE',
            verified: youtubeAccount.verificationStatus === 'VERIFIED',
            channelTitle: youtubeMeta?.channelTitle || null,
            channelId: youtubeAccount.externalAccountId || null,
            connectedAt: youtubeAccount.connectedAt?.toISOString() || null,
        } : {
            connected: false,
            verified: false,
        };

        // Get all contracts for stats
        const userContracts = await db
            .select()
            .from(contracts)
            .where(eq(contracts.principalUserId, userId));

        // Derive state for each contract
        const contractsWithState = await Promise.all(
            userContracts.map(async (c) => {
                const events = await getEventsForContract(c.id);
                const state = deriveState(events);
                return { ...c, state };
            })
        );

        // Calculate stats
        // Terminal states where contract is complete
        const TERMINAL = new Set(['SETTLED', 'FORFEITED']);

        const totalContracts = contractsWithState.length;
        // Active = non-terminal and has a state (excludes drafts/null)
        const activeContracts = contractsWithState.filter(c =>
            c.state && !TERMINAL.has(c.state)
        ).length;
        const settledContracts = contractsWithState.filter(c =>
            c.state === 'SETTLED'
        ).length;
        const forfeitedContracts = contractsWithState.filter(c =>
            c.state === 'FORFEITED'
        ).length;

        // TVL = sum of locked amounts for settled contracts
        const tvlSettledCents = contractsWithState
            .filter(c => c.state === 'SETTLED')
            .reduce((sum, c) => sum + c.lockAmountUsdCents, 0);

        // Settlement rate = settled / (settled + forfeited) OR null if no completed contracts
        const completedContracts = settledContracts + forfeitedContracts;
        const settlementRate = completedContracts > 0
            ? Math.round((settledContracts / completedContracts) * 1000) / 10 // One decimal place
            : null; // null = "—" in UI

        // Forfeited value in dollars
        const forfeitedValueCents = contractsWithState
            .filter(c => c.state === 'FORFEITED')
            .reduce((sum, c) => sum + c.lockAmountUsdCents, 0);

        return {
            ok: true,
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
            },
            identity: identity ? {
                username: identity.username,
                displayName: identity.displayName,
                bio: identity.bio,
                photoUrl: identity.photoUrl,
                status: identity.status,
            } : null,
            xConnection,
            stripeConnection,
            shopifyConnection,
            amazonConnection,
            youtubeConnection,
            stats: {
                settlementRate, // null for new users, number for others
                totalContracts,
                activeContracts,
                settledContracts,
                forfeitedContracts,
                tvlSettledUsd: tvlSettledCents / 100,
                forfeitedValueUsd: forfeitedValueCents / 100,
            },
        };
    });

    /**
     * PUT /users/:id/stripe-connect
     * Update user's Stripe Connected Account ID
     * Required for receiving payouts
     */
    fastify.put<{
        Params: { id: string };
        Body: { stripeConnectedAccountId: string };
    }>('/users/:id/stripe-connect', async (request, reply) => {
        const { id } = request.params;
        const { stripeConnectedAccountId } = request.body;

        if (!stripeConnectedAccountId) {
            reply.status(400);
            return { error: 'stripeConnectedAccountId is required' };
        }

        // Update user
        const [updatedUser] = await db
            .update(users)
            .set({ stripeConnectedAccountId })
            .where(eq(users.id, id))
            .returning();

        if (!updatedUser) {
            reply.status(404);
            return { error: 'User not found' };
        }

        console.log(`✅ User ${id} linked to Stripe Connect account ${stripeConnectedAccountId}`);

        return {
            success: true,
            user: {
                id: updatedUser.id,
                stripeConnectedAccountId: updatedUser.stripeConnectedAccountId,
            }
        };
    });
};

export default usersRoutes;

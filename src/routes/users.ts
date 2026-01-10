import { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client.js';
import { users, identities, contracts } from '../db/schema.js';
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

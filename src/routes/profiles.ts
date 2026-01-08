import { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client.js';
import { identities, contracts } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { getEventsForContract } from '../services/ledger.js';
import { deriveState } from '../services/state-derivation.js';

const profileRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * GET /profiles/:username
     * Public read-only profile view
     * Powers: Profile History page in Aura
     * State is derived from ledger events, not stored
     */
    fastify.get<{
        Params: { username: string };
    }>('/profiles/:username', async (request, reply) => {
        const { username } = request.params;

        // Normalize username to lowercase
        const normalizedUsername = username.toLowerCase();

        // Get identity
        const [identity] = await db
            .select()
            .from(identities)
            .where(eq(identities.username, normalizedUsername))
            .limit(1);

        if (!identity) {
            reply.status(404);
            return { error: 'Profile not found' };
        }

        // Get public contracts for this user
        const userContracts = await db
            .select()
            .from(contracts)
            .where(eq(contracts.principalIdentityUsername, normalizedUsername))
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
            profile: {
                username: identity.username,
                displayName: identity.displayName,
                bio: identity.bio,
                photoUrl: identity.photoUrl,
                status: identity.status,
                createdAt: identity.createdAt.toISOString(),
            },
            contracts: contractsWithState.map(c => ({
                id: c.id,
                platform: c.platform,
                metricType: c.metricType,
                condition: c.conditionJson,
                deadline: c.deadlineUtc.toISOString(),
                lockAmountUsdCents: c.lockAmountUsdCents,
                state: c.state, // Derived, not stored
                createdAt: c.createdAt.toISOString(),
            })),
            stats: {
                totalContracts: contractsWithState.length,
                settledCount: contractsWithState.filter(c => c.state === 'SETTLED').length,
                forfeitedCount: contractsWithState.filter(c => c.state === 'FORFEITED').length,
                activeCount: contractsWithState.filter(c =>
                    !['SETTLED', 'FORFEITED'].includes(c.state || '')
                ).length,
            },
        };
    });
};

export default profileRoutes;

/**
 * Contract Routes (Read-Only)
 * 
 * All endpoints return derived state computed from ledger events.
 * No state is persisted on the contract record.
 */

import { FastifyPluginAsync } from 'fastify';
import { getContract, getContractWithState, getContractsForUser } from '../services/contracts.js';
import { getEventsForContract } from '../services/ledger.js';
import { deriveState } from '../services/state-derivation.js';

const contractRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * GET /contracts/:id
     * Single contract view with derived state
     * Powers: Contract Receipt (/contract/:id) in Aura
     */
    fastify.get<{
        Params: { id: string };
    }>('/contracts/:id', async (request, reply) => {
        const { id } = request.params;

        const result = await getContractWithState(id);

        if (!result) {
            reply.status(404);
            return { error: 'Contract not found' };
        }

        const { contract, state } = result;
        const events = await getEventsForContract(id);

        return {
            contract: {
                id: contract.id,
                principalUserId: contract.principalUserId,
                principalIdentityUsername: contract.principalIdentityUsername,
                platform: contract.platform,
                metricType: contract.metricType,
                condition: contract.conditionJson,
                baseline: contract.baselineJson,
                deadline: contract.deadlineUtc.toISOString(),
                lockAmountUsdCents: contract.lockAmountUsdCents,
                fundingMethod: contract.fundingMethod,
                riskTier: contract.riskTier,
                state, // Derived from ledger events, never persisted
                recordHash: contract.recordHash,
                createdAt: contract.createdAt.toISOString(),
                updatedAt: contract.updatedAt.toISOString(),
            },
            events: events.map(event => ({
                id: event.id,
                actor: event.actor,
                eventType: event.eventType,
                timestamp: event.timestampUtc.toISOString(),
                amountUsdCents: event.amountUsdCents,
                externalRef: event.externalRef,
                metadata: event.metadataJson,
                eventHash: event.eventHash,
            })),
        };
    });

    /**
     * GET /contracts/:id/ledger
     * Ordered ledger events for a contract
     */
    fastify.get<{
        Params: { id: string };
    }>('/contracts/:id/ledger', async (request, reply) => {
        const { id } = request.params;

        const contract = await getContract(id);
        if (!contract) {
            reply.status(404);
            return { error: 'Contract not found' };
        }

        const events = await getEventsForContract(id);

        return {
            contractId: id,
            events: events.map(event => ({
                id: event.id,
                actor: event.actor,
                eventType: event.eventType,
                timestamp: event.timestampUtc.toISOString(),
                amountUsdCents: event.amountUsdCents,
                externalRef: event.externalRef,
                metadata: event.metadataJson,
                prevEventHash: event.prevEventHash,
                eventHash: event.eventHash,
            })),
        };
    });

    /**
     * GET /me/contracts
     * Authenticated user's contracts with derived states
     */
    fastify.get('/me/contracts', async (request, reply) => {
        // @ts-ignore - userId set by auth middleware
        const userId = request.userId;

        if (!userId) {
            reply.status(401);
            return { error: 'Unauthorized' };
        }

        const contractsWithState = await getContractsForUser(userId);

        return {
            contracts: contractsWithState.map(({ contract, state }) => ({
                id: contract.id,
                principalIdentityUsername: contract.principalIdentityUsername,
                platform: contract.platform,
                metricType: contract.metricType,
                condition: contract.conditionJson,
                deadline: contract.deadlineUtc.toISOString(),
                lockAmountUsdCents: contract.lockAmountUsdCents,
                riskTier: contract.riskTier,
                state, // Derived from ledger events
                createdAt: contract.createdAt.toISOString(),
            })),
        };
    });
};

export default contractRoutes;

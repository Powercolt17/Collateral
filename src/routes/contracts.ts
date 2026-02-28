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
import { db } from '../db/client.js';
import { ledgerEvents, contracts, EventType } from '../db/schema.js';
import { desc, inArray, sql } from 'drizzle-orm';

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

    /**
     * GET /v1/ledger
     * Public ledger of executed contract events
     * Powers: Public Record page (/ledger) in Aura
     * 
     * Returns events from all executed contracts (FUNDS_LOCKED and beyond).
     * No authentication required - this is a public transparency feed.
     */
    fastify.get('/v1/ledger', async (request, reply) => {
        try {
            // Fetch recent events from contracts that have been executed (FUNDS_LOCKED or beyond)
            // We'll get events that indicate execution or settlement
            const publicEventTypes = [
                EventType.FUNDS_LOCKED,
                EventType.EXECUTION_CONFIRMED,
                EventType.VERIFICATION_STARTED,
                EventType.VERIFICATION_SUCCEEDED,
                EventType.VERIFICATION_FAILED,
                EventType.SETTLED_SUCCESS,
                EventType.SETTLED_FAILURE,
                EventType.SETTLEMENT_STARTED,
                EventType.RECEIPT_ISSUED,
            ];

            // Get recent public events (last 200) with contract context
            const events = await db
                .select({
                    id: ledgerEvents.id,
                    contractId: ledgerEvents.contractId,
                    eventType: ledgerEvents.eventType,
                    timestampUtc: ledgerEvents.timestampUtc,
                    amountUsdCents: ledgerEvents.amountUsdCents,
                    eventHash: ledgerEvents.eventHash,
                    actor: ledgerEvents.actor,
                    // Contract context
                    platform: contracts.platform,
                    principalIdentityUsername: contracts.principalIdentityUsername,
                    lockAmountUsdCents: contracts.lockAmountUsdCents,
                    riskTier: contracts.riskTier,
                })
                .from(ledgerEvents)
                .innerJoin(contracts, sql`${ledgerEvents.contractId} = ${contracts.id}`)
                .where(inArray(ledgerEvents.eventType, publicEventTypes))
                .orderBy(desc(ledgerEvents.timestampUtc))
                .limit(200);

            return {
                events: events.map(event => ({
                    id: event.id,
                    contractId: event.contractId,
                    eventType: event.eventType,
                    timestamp: event.timestampUtc.toISOString(),
                    amountUsdCents: event.amountUsdCents,
                    eventHash: event.eventHash,
                    actor: event.actor,
                    platform: event.platform,
                    principal: event.principalIdentityUsername,
                    lockAmountUsdCents: event.lockAmountUsdCents,
                    riskTier: event.riskTier,
                })),
            };
        } catch (error) {
            console.error('[Ledger] Error fetching public ledger:', error);
            reply.status(500);
            return { error: 'Failed to fetch ledger events' };
        }
    });
};

export default contractRoutes;

import { FastifyPluginAsync } from 'fastify';
import { getLedgerEvents } from '../services/ledger.js';

const ledgerRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * GET /ledger
     * Global ledger view with cursor pagination
     * Powers: Global Ledger page in Aura
     */
    fastify.get<{
        Querystring: { cursor?: string; limit?: string };
    }>('/ledger', async (request, reply) => {
        const { cursor, limit } = request.query;

        const result = await getLedgerEvents({
            cursor,
            limit: limit ? parseInt(limit, 10) : 50,
        });

        return {
            events: result.events.map(event => ({
                id: event.id,
                contractId: event.contractId,
                actor: event.actor,
                eventType: event.eventType,
                timestamp: event.timestampUtc.toISOString(),
                amountUsdCents: event.amountUsdCents,
                externalRef: event.externalRef,
                metadata: event.metadataJson,
                eventHash: event.eventHash,
            })),
            nextCursor: result.nextCursor,
        };
    });
};

export default ledgerRoutes;

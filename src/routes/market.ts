import { FastifyInstance } from 'fastify';
import { getMarketFeed, getGlobalStats, publishDrop, expireInstance, getMarketListings, getMarketInstanceDetails, PublishDropParams } from '../services/market.js';
import { z } from 'zod';

// Input Schemas
const MarketFeedQuerySchema = z.object({
    sort: z.enum(['trending_1h', 'trending_24h', 'new', 'closing_soon', 'volume_24h']).optional(),
    category: z.string().optional(),
    provider: z.string().optional(),
    status: z.enum(['published', 'closing']).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    offset: z.coerce.number().min(0).optional(),
});

const PublishDropBodySchema = z.object({
    templateSlug: z.string(),
    fundingCloseAt: z.string().datetime(), // ISO string
    capacityTotal: z.number().int().positive().optional(),
    overrides: z.object({
        minLockCents: z.number().int().positive().optional(),
        maxLockCents: z.number().int().positive().optional(),
        tierOptions: z.any().optional(),
    }).optional(),
});

const ExpireInstanceBodySchema = z.object({
    instanceId: z.string().uuid(),
});

export default async function marketRoutes(fastify: FastifyInstance) {

    // Public Feed
    fastify.get('/v1/market/contracts', async (request, reply) => {
        const query = MarketFeedQuerySchema.parse(request.query);

        const [contracts, stats] = await Promise.all([
            getMarketFeed({
                ...query,
                limit: query.limit || 50,
                offset: query.offset || 0,
            }),
            getGlobalStats(),
        ]);

        return {
            ok: true,
            serverTime: new Date().toISOString(),
            count: contracts.length,
            contracts, // Rename items -> contracts for frontend comformity
            stats,
        };
    });

    // Public Listings (Catalog)
    fastify.get('/v1/market/listings', async (request, reply) => {
        const query = MarketFeedQuerySchema.parse(request.query);
        const [listings, stats] = await Promise.all([
            getMarketListings(query),
            getGlobalStats()
        ]);

        return {
            listings,
            stats
        };
    });

    // Public Contract Template/Listing Details (Term Sheet)
    fastify.get('/v1/market/contracts/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        const details = await getMarketInstanceDetails(id);

        if (!details) {
            return reply.status(404).send({ error: 'Market contract not found' });
        }

        return details;
    });

    // Quote Endpoint for Term Sheet
    fastify.post('/v1/market/contracts/:id/quote', async (request, reply) => {
        const { id } = request.params as { id: string };
        const { stake } = request.body as { stake: number }; // stake in dollars

        const details = await getMarketInstanceDetails(id);
        if (!details) {
            return reply.status(404).send({ error: 'Market contract not found' });
        }

        const stakeCents = Math.round(stake * 100);

        // Simple validation
        if (stakeCents < details.minStakeCents || stakeCents > details.maxStakeCents) {
            return reply.status(400).send({ error: `Stake must be between $${details.minStakeCents / 100} and $${details.maxStakeCents / 100}` });
        }

        // Calculate payout
        const payoutCents = Math.round(stakeCents * details.multiplier);
        const feeCents = Math.round(stakeCents * (details.feeBps / 10000));

        return {
            ok: true,
            quoteId: `Q-${Date.now()}`,
            stakeCents,
            payoutCents,
            feeCents,
            multiplier: details.multiplier,
            verified: true, // Mock verification for now
            baseline: {
                metric: details.metricKey,
                value: 0, // Would fetch real baseline here if connected
                source: details.provider
            }
        };
    });

    // Admin: Publish Drop
    // TODO: Add strict admin auth (e.g. specialized header or user role check)
    fastify.post('/v1/admin/market/publish', async (request, reply) => {
        const body = PublishDropBodySchema.parse(request.body);

        // For now, simple check - allow if in dev mode or with header
        const adminKey = request.headers['x-admin-key'];
        if (adminKey !== process.env.ADMIN_API_KEY) {
            return reply.status(403).send({ error: 'Unauthorized: Admin access required' });
        }

        const instance = await publishDrop({
            ...(body as any),
            fundingCloseAt: new Date(body.fundingCloseAt),
        });

        return {
            ok: true,
            instanceId: instance.id,
            status: instance.status,
        };
    });

    // Admin: Expire Instance
    fastify.post('/v1/admin/market/expire', async (request, reply) => {
        const body = ExpireInstanceBodySchema.parse(request.body);

        const adminKey = request.headers['x-admin-key'];
        if (adminKey !== process.env.ADMIN_API_KEY) {
            return reply.status(403).send({ error: 'Unauthorized: Admin access required' });
        }

        await expireInstance(body.instanceId);

        return {
            ok: true,
            instanceId: body.instanceId,
            status: 'expired',
        };
    });
}

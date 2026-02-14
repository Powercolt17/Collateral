import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getMarketFeed, publishDrop, expireInstance, PublishDropParams } from '../services/market.js';
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

        const items = await getMarketFeed({
            ...query,
            limit: query.limit || 50,
            offset: query.offset || 0,
        });

        return {
            ok: true,
            serverTime: new Date().toISOString(),
            count: items.length,
            items,
        };
    });

    // Admin: Publish Drop
    // TODO: Add strict admin auth (e.g. specialized header or user role check)
    fastify.post('/v1/admin/market/publish', async (request, reply) => {
        const body = PublishDropBodySchema.parse(request.body);

        // For now, simple check - allow if in dev mode or with header
        const adminKey = request.headers['x-admin-key'];
        if (process.env.NODE_ENV === 'production' && adminKey !== process.env.ADMIN_API_KEY) {
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
        if (process.env.NODE_ENV === 'production' && adminKey !== process.env.ADMIN_API_KEY) {
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

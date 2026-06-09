import { FastifyInstance } from 'fastify';
import { getMarketFeed, getGlobalStats, publishDrop, expireInstance, getMarketListings, getMarketInstanceDetails, PublishDropParams } from '../services/market.js';
import { z } from 'zod';
import { db } from '../db/client.js';
import { sql } from 'drizzle-orm';

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

    // Homepage Stats
    fastify.get('/v1/market/homepage-stats', async (request, reply) => {
        // Query active capital locked
        const soloLockedRes = await db.execute(sql`
            SELECT COALESCE(SUM(lock_amount_usd_cents), 0) AS total
            FROM contracts
            WHERE lock_amount_usd_cents > 0
              AND id IN (
                  SELECT contract_id FROM ledger_events
                  WHERE event_type = 'FUNDS_LOCKED'
              )
              AND id NOT IN (
                  SELECT contract_id FROM ledger_events
                  WHERE event_type IN ('SETTLED_SUCCESS', 'SETTLED_FAILURE', 'CONTRACT_FORFEITED')
              )
        `);
        const rivalryLockedRes = await db.execute(sql`
            SELECT COALESCE(SUM(stake_per_side_cents * 2), 0) AS total
            FROM rivalries
            WHERE activated_at IS NOT NULL AND settled_at IS NULL
        `);

        const getRows = (result: any) => Array.isArray(result) ? result : (result?.rows ?? []);

        const soloLocked = Number(getRows(soloLockedRes)[0]?.total || 0);
        const rivalryLocked = Number(getRows(rivalryLockedRes)[0]?.total || 0);
        const capitalLocked = Math.round((soloLocked + rivalryLocked) / 100);

        // Query settled contracts
        const soloSettledRes = await db.execute(sql`
            SELECT COUNT(DISTINCT contract_id) AS total
            FROM ledger_events
            WHERE event_type IN ('SETTLED_SUCCESS', 'SETTLED_FAILURE', 'CONTRACT_FORFEITED')
        `);
        const rivalrySettledRes = await db.execute(sql`
            SELECT COUNT(*) AS total
            FROM rivalries
            WHERE settled_at IS NOT NULL
        `);
        const soloSettled = Number(getRows(soloSettledRes)[0]?.total || 0);
        const rivalrySettled = Number(getRows(rivalrySettledRes)[0]?.total || 0);
        const contractsSettled = soloSettled + rivalrySettled;

        // Query total paid out
        const soloPaidOutRes = await db.execute(sql`
            SELECT COALESCE(SUM(amount_usd_cents), 0) AS total
            FROM ledger_events
            WHERE event_type = 'SETTLED_SUCCESS'
        `);
        const rivalryPaidOutRes = await db.execute(sql`
            SELECT COALESCE(SUM(payout_cents), 0) AS total
            FROM rivalry_participants
            WHERE outcome = 'WIN'
        `);
        const soloPaidOut = Number(getRows(soloPaidOutRes)[0]?.total || 0);
        const rivalryPaidOut = Number(getRows(rivalryPaidOutRes)[0]?.total || 0);
        const totalPaidOut = Math.round((soloPaidOut + rivalryPaidOut) / 100);

        // Query success rate (achievementRate)
        const soloSuccessRes = await db.execute(sql`
            SELECT COUNT(DISTINCT contract_id) AS total
            FROM ledger_events
            WHERE event_type = 'SETTLED_SUCCESS'
        `);
        const rivalrySuccessRes = await db.execute(sql`
            SELECT COUNT(*) AS total
            FROM rivalries
            WHERE settled_at IS NOT NULL AND winner_user_id IS NOT NULL
        `);
        const soloSuccess = Number(getRows(soloSuccessRes)[0]?.total || 0);
        const rivalrySuccess = Number(getRows(rivalrySuccessRes)[0]?.total || 0);
        const successContracts = soloSuccess + rivalrySuccess;

        const achievementRate = contractsSettled > 0
            ? Math.round((successContracts / contractsSettled) * 100)
            : 68;

        // Query recent settlements
        const recentSettlementsRes = await db.execute(sql`
            SELECT 
              c.platform,
              c.metric_type,
              c.payout_amount_usd_cents,
              u.x_username,
              u.email
            FROM contracts c
            JOIN users u ON c.principal_user_id = u.id
            JOIN ledger_events le ON c.id = le.contract_id
            WHERE le.event_type = 'SETTLED_SUCCESS'
            ORDER BY le.timestamp_utc DESC
            LIMIT 15
        `);

        function getContractTitle(platform: string, metricType: string): string {
            const plat = (platform || '').toUpperCase();
            const met = (metricType || '').toUpperCase();
            if (plat === 'STRIPE') {
                return 'Revenue Growth Contract';
            } else if (plat === 'SHOPIFY') {
                return 'Sales Goal Contract';
            } else if (plat === 'YOUTUBE') {
                return 'YouTube Subscriber Goal';
            } else if (plat === 'X' || plat === 'TWITTER') {
                return 'Audience Growth Contract';
            }
            return 'Performance Goal Contract';
        }

        const recentSettlements = getRows(recentSettlementsRes).map((row: any) => {
            let username = row.x_username;
            if (!username && row.email) {
                username = row.email.split('@')[0];
            }
            if (username && username.startsWith('sim_')) {
                username = username.slice(4);
            }
            username = username || 'user';

            const goal = getContractTitle(row.platform, row.metric_type);
            const reward = Math.round(Number(row.payout_amount_usd_cents || 0) / 100);

            return { username, goal, reward };
        });

        return {
            ok: true,
            capitalLocked,
            contractsSettled,
            totalPaidOut,
            achievementRate,
            recentSettlements
        };
    });

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

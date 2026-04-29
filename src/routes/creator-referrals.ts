/**
 * Creator Referral Routes — Admin + Public
 */
import { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client.js';
import { creatorReferrals } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { getPrincipal, requireAuth } from '../services/auth.js';
import {
    lookupCreator, recordClick, getCreatorDashboard, getCreatorStats,
    getAllConversions, approveConversion, rejectConversion, markPaid, isAdmin,
} from '../services/creator-referral.js';

async function requireAdmin(request: any, reply: any) {
    let userId: string;
    try { userId = getPrincipal(request); } catch {
        reply.status(401); return reply.send({ ok: false, error: 'Invalid token' });
    }
    if (!isAdmin(userId)) {
        reply.status(403); return reply.send({ ok: false, error: 'Admin access required' });
    }
}

const creatorReferralRoutes: FastifyPluginAsync = async (fastify) => {
    // PUBLIC: validate slug + record click
    fastify.get<{ Params: { slug: string } }>('/v1/creator/r/:slug', async (request) => {
        const { slug } = request.params;
        if (!slug || slug.length < 2) return { valid: false };
        const creator = await lookupCreator(slug);
        if (!creator) return { valid: false, type: 'unknown' };
        recordClick(slug, { userAgent: request.headers['user-agent'], ip: request.ip }).catch(() => {});
        return { valid: true, type: 'creator', slug: creator.slug, name: creator.name };
    });

    // ADMIN: list creators
    fastify.get('/v1/admin/creators', { preHandler: [requireAuth, requireAdmin] }, async () => {
        const d = await getCreatorDashboard();
        return { ok: true, creators: d, count: d.length };
    });

    // ADMIN: single creator
    fastify.get<{ Params: { slug: string } }>('/v1/admin/creators/:slug', { preHandler: [requireAuth, requireAdmin] }, async (request, reply) => {
        const stats = await getCreatorStats(request.params.slug);
        if (!stats) { reply.status(404); return { ok: false, error: 'Not found' }; }
        return { ok: true, creator: stats };
    });

    // ADMIN: create creator
    fastify.post<{ Body: { name: string; slug: string; handle: string; platform?: string; tier?: string; bonusRateCents?: number; postFeeCents?: number; followerCount?: number; score?: number; notes?: string } }>(
        '/v1/admin/creators', { preHandler: [requireAuth, requireAdmin] }, async (request, reply) => {
        const { name, slug, handle, platform, tier, bonusRateCents, postFeeCents, followerCount, score, notes } = request.body;
        if (!name || !slug || !handle) { reply.status(400); return { ok: false, error: 'name, slug, handle required' }; }
        if (await lookupCreator(slug)) { reply.status(409); return { ok: false, error: 'Slug exists' }; }
        const [creator] = await db.insert(creatorReferrals).values({
            name, slug: slug.toLowerCase(), platform: platform || 'X', handle,
            tier: (tier || 'STANDARD') as any, bonusRateCents: bonusRateCents ?? (tier === 'A_LIST' ? 2500 : 1000),
            postFeeCents: postFeeCents ?? 0, followerCount: followerCount ?? null, score: score ?? null, notes: notes ?? null,
        } as any).returning();
        return { ok: true, creator };
    });

    // ADMIN: update creator
    fastify.patch<{ Params: { slug: string }; Body: Record<string, any> }>(
        '/v1/admin/creators/:slug', { preHandler: [requireAuth, requireAdmin] }, async (request, reply) => {
        const creator = await lookupCreator(request.params.slug);
        if (!creator) { reply.status(404); return { ok: false, error: 'Not found' }; }
        const u: Record<string, any> = { updatedAt: new Date() };
        for (const k of ['name','platform','handle','tier','bonusRateCents','postFeeCents','followerCount','score','status','notes']) {
            if ((request.body as any)[k] !== undefined) u[k] = (request.body as any)[k];
        }
        await db.update(creatorReferrals).set(u).where(eq(creatorReferrals.id, creator.id));
        return { ok: true, updated: Object.keys(u) };
    });

    // ADMIN: list conversions
    fastify.get<{ Querystring: { eventType?: string; creator?: string } }>(
        '/v1/admin/conversions', { preHandler: [requireAuth, requireAdmin] }, async (request) => {
        const { eventType, creator } = request.query as any;
        const c = await getAllConversions({ eventType, creatorSlug: creator });
        return { ok: true, conversions: c, count: c.length };
    });

    // ADMIN: approve
    fastify.post<{ Params: { id: string } }>('/v1/admin/conversions/:id/approve', { preHandler: [requireAuth, requireAdmin] }, async (request, reply) => {
        if (!(await approveConversion(request.params.id))) { reply.status(400); return { ok: false, error: 'Not in PENDING_REVIEW' }; }
        return { ok: true, message: 'Approved' };
    });

    // ADMIN: reject
    fastify.post<{ Params: { id: string }; Body: { reason: string } }>('/v1/admin/conversions/:id/reject', { preHandler: [requireAuth, requireAdmin] }, async (request, reply) => {
        const { reason } = request.body;
        if (!reason) { reply.status(400); return { ok: false, error: 'Reason required' }; }
        if (!(await rejectConversion(request.params.id, reason))) { reply.status(400); return { ok: false, error: 'Not in PENDING_REVIEW' }; }
        return { ok: true, message: 'Rejected' };
    });

    // ADMIN: mark paid
    fastify.post<{ Params: { id: string } }>('/v1/admin/conversions/:id/paid', { preHandler: [requireAuth, requireAdmin] }, async (request, reply) => {
        if (!(await markPaid(request.params.id))) { reply.status(400); return { ok: false, error: 'Not in APPROVED' }; }
        return { ok: true, message: 'Paid' };
    });
};

export default creatorReferralRoutes;

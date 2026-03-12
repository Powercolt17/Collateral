// @ts-nocheck
/**
 * Notification Routes
 * 
 * GET  /v1/notifications       — list user's notifications
 * GET  /v1/notifications/count — unread count
 * POST /v1/notifications/:id/read — mark as read
 * POST /v1/notifications/read-all — mark all as read
 */

import { db } from '../db/client.js';
import { notifications } from '../db/schema.js';
import { eq, and, desc, sql } from 'drizzle-orm';
import { requireAuth, getPrincipal } from '../services/auth.js';

const notificationRoutes = async (fastify) => {

    // GET /v1/notifications — list recent notifications
    fastify.get('/v1/notifications', { preHandler: requireAuth }, async (request, reply) => {
        try {
            const userId = getPrincipal(request);
            const limit = Math.min(parseInt(request.query?.limit || '20'), 50);

            const items = await db
                .select()
                .from(notifications)
                .where(eq(notifications.userId, userId))
                .orderBy(desc(notifications.createdAt))
                .limit(limit);

            return { ok: true, notifications: items };
        } catch (err) {
            console.error('[Notifications] List error:', err);
            reply.status(500);
            return { error: 'Failed to load notifications' };
        }
    });

    // GET /v1/notifications/count — unread count
    fastify.get('/v1/notifications/count', { preHandler: requireAuth }, async (request, reply) => {
        try {
            const userId = getPrincipal(request);

            const [result] = await db
                .select({ count: sql`count(*)::int` })
                .from(notifications)
                .where(and(
                    eq(notifications.userId, userId),
                    eq(notifications.read, false),
                ));

            return { ok: true, count: result?.count || 0 };
        } catch (err) {
            console.error('[Notifications] Count error:', err);
            return { ok: true, count: 0 };
        }
    });

    // POST /v1/notifications/:id/read — mark one as read
    fastify.post('/v1/notifications/:id/read', { preHandler: requireAuth }, async (request, reply) => {
        try {
            const userId = getPrincipal(request);

            await db.update(notifications)
                .set({ read: true })
                .where(and(
                    eq(notifications.id, request.params.id),
                    eq(notifications.userId, userId),
                ));

            return { ok: true };
        } catch (err) {
            console.error('[Notifications] Mark read error:', err);
            reply.status(500);
            return { error: 'Failed to mark notification as read' };
        }
    });

    // POST /v1/notifications/read-all — mark all as read
    fastify.post('/v1/notifications/read-all', { preHandler: requireAuth }, async (request, reply) => {
        try {
            const userId = getPrincipal(request);

            await db.update(notifications)
                .set({ read: true })
                .where(and(
                    eq(notifications.userId, userId),
                    eq(notifications.read, false),
                ));

            return { ok: true };
        } catch (err) {
            console.error('[Notifications] Mark all read error:', err);
            reply.status(500);
            return { error: 'Failed to mark notifications as read' };
        }
    });
};

export default notificationRoutes;

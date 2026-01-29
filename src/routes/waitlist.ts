/**
 * Waitlist Routes
 * 
 * Handle pre-launch email signups
 */

import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/client.js';
import { sql } from 'drizzle-orm';

interface WaitlistBody {
    email: string;
    intendedUse?: string;
}

const waitlistRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * POST /v1/waitlist/join
     * Add email to waitlist
     */
    fastify.post<{ Body: WaitlistBody }>('/v1/waitlist/join', async (request, reply) => {
        const { email, intendedUse } = request.body || {};

        // Validate email
        if (!email || !email.includes('@') || !email.includes('.')) {
            reply.status(400);
            return { error: 'Valid email required' };
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Get IP and User Agent for spam prevention
        const ipAddress = request.ip || request.headers['x-forwarded-for'] || 'unknown';
        const userAgent = request.headers['user-agent'] || 'unknown';

        try {
            // Insert into waitlist (upsert to handle duplicates gracefully)
            await db.execute(sql`
                INSERT INTO waitlist (email, intended_use, ip_address, user_agent, source)
                VALUES (${normalizedEmail}, ${intendedUse || null}, ${String(ipAddress)}, ${String(userAgent)}, 'website')
                ON CONFLICT (email) DO UPDATE SET
                    intended_use = COALESCE(EXCLUDED.intended_use, waitlist.intended_use),
                    updated_at = NOW()
            `);

            console.log(`[Waitlist] New signup: ${normalizedEmail}`);

            return {
                success: true,
                message: 'You\'re on the list. We\'ll be in touch.',
            };
        } catch (err: any) {
            console.error('[Waitlist] Error:', err.message);
            reply.status(500);
            return { error: 'Failed to join waitlist. Please try again.' };
        }
    });

    /**
     * GET /v1/waitlist/count
     * Get waitlist count (public for social proof)
     */
    fastify.get('/v1/waitlist/count', async (request, reply) => {
        try {
            const result = await db.execute(sql`SELECT COUNT(*) as count FROM waitlist`);
            const count = (result as any).rows?.[0]?.count || 0;

            return { count: Number(count) };
        } catch (err) {
            return { count: 0 };
        }
    });

    /**
     * GET /v1/admin/waitlist
     * Get all waitlist entries (admin only)
     */
    fastify.get('/v1/admin/waitlist', async (request, reply) => {
        const adminKey = request.headers['x-admin-key'];
        if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
            reply.status(403);
            return { error: 'Unauthorized' };
        }

        try {
            const result = await db.execute(sql`
                SELECT id, email, intended_use, status, created_at, ip_address
                FROM waitlist
                ORDER BY created_at DESC
                LIMIT 500
            `);

            return {
                entries: (result as any).rows || [],
                total: (result as any).rows?.length || 0,
            };
        } catch (err: any) {
            reply.status(500);
            return { error: err.message };
        }
    });
};

export default waitlistRoutes;

/**
 * Referral Routes
 * 
 * GET /me/referrals — authenticated user's referral stats
 * GET /r/:code — public, validate referral code exists
 */

import { FastifyPluginAsync } from 'fastify';
import { getReferralStats, lookupReferrer } from '../services/referral.js';
import { getPrincipal, requireAuth } from '../services/auth.js';

const referralRoutes: FastifyPluginAsync = async (fastify) => {

    /**
     * GET /me/referrals
     * Get current user's referral stats, boost, and referral list
     */
    fastify.get('/me/referrals', { preHandler: requireAuth }, async (request, reply) => {
        let userId: string;
        try {
            userId = getPrincipal(request);
        } catch {
            reply.status(401);
            return { error: 'Unauthorized' };
        }

        const stats = await getReferralStats(userId);
        if (!stats) {
            reply.status(404);
            return { error: 'User not found' };
        }

        return stats;
    });

    /**
     * GET /r/:code
     * Public endpoint — validates referral code exists
     * Checks CREATOR slugs first, then falls through to user referral codes
     */
    fastify.get<{
        Params: { code: string };
    }>('/r/:code', async (request, reply) => {
        const { code } = request.params;

        if (!code || code.length < 3) {
            reply.status(400);
            return { valid: false, error: 'Invalid referral code' };
        }

        // Check creator slugs first (priority over user referral codes)
        try {
            const { isCreatorSlug, recordClick } = await import('../services/creator-referral.js');
            const isCreator = await isCreatorSlug(code);
            if (isCreator) {
                // Record click (fire-and-forget)
                recordClick(code, {
                    userAgent: request.headers['user-agent'],
                    ip: request.ip,
                }).catch(() => {});

                return {
                    valid: true,
                    type: 'creator',
                    code: code.toLowerCase(),
                };
            }
        } catch (err: any) {
            // Creator table may not exist yet (migration pending), continue to user lookup
            console.warn('[Referral] Creator lookup failed (non-blocking):', err.message);
        }

        // Fall through to user referral code lookup
        const referrerId = await lookupReferrer(code);

        return {
            valid: !!referrerId,
            type: referrerId ? 'user' : undefined,
            code: code.toLowerCase(),
        };
    });
};

export default referralRoutes;

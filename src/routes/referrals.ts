/**
 * Referral Routes
 * 
 * GET /me/referrals — authenticated user's referral stats
 * GET /r/:code — public, validate referral code exists
 */

import { FastifyPluginAsync } from 'fastify';
import { getReferralStats, lookupReferrer } from '../services/referral.js';
import { getPrincipal } from '../services/auth.js';

const referralRoutes: FastifyPluginAsync = async (fastify) => {

    /**
     * GET /me/referrals
     * Get current user's referral stats, boost, and referral list
     */
    fastify.get('/me/referrals', async (request, reply) => {
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
     * Frontend uses this to confirm the referral link is valid
     */
    fastify.get<{
        Params: { code: string };
    }>('/r/:code', async (request, reply) => {
        const { code } = request.params;

        if (!code || code.length < 3) {
            reply.status(400);
            return { valid: false, error: 'Invalid referral code' };
        }

        const referrerId = await lookupReferrer(code);

        return {
            valid: !!referrerId,
            code: code.toLowerCase(),
        };
    });
};

export default referralRoutes;

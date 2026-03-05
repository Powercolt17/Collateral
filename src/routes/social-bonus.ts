/**
 * Social Share Bonus Routes
 * 
 * POST /contracts/:id/social-bonus — Submit tweet URL for +5% profit boost
 * DELETE /contracts/:id/social-bonus — Remove social bonus
 */

import { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client.js';
import { contracts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const TWEET_URL_REGEX = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;

const socialBonusRoutes: FastifyPluginAsync = async (fastify) => {

    /**
     * POST /contracts/:id/social-bonus
     * Submit a tweet URL to activate the social share bonus
     */
    fastify.post<{
        Params: { id: string };
        Body: { tweetUrl: string };
    }>('/contracts/:id/social-bonus', async (request, reply) => {
        // @ts-ignore - userId set by auth middleware
        const userId = request.userId;
        if (!userId) {
            reply.status(401);
            return { error: 'Unauthorized' };
        }

        const { id } = request.params;
        const { tweetUrl } = request.body || {};

        if (!tweetUrl || typeof tweetUrl !== 'string') {
            reply.status(400);
            return { error: 'tweetUrl is required' };
        }

        // Parse tweet ID from URL
        const match = tweetUrl.match(TWEET_URL_REGEX);
        if (!match) {
            reply.status(400);
            return { error: 'Invalid tweet URL. Must be a twitter.com or x.com status URL.' };
        }
        const tweetId = match[1];

        // Get contract and verify ownership
        const [contract] = await db.select().from(contracts)
            .where(eq(contracts.id, id)).limit(1);

        if (!contract) {
            reply.status(404);
            return { error: 'Contract not found' };
        }

        if (contract.principalUserId !== userId) {
            reply.status(403);
            return { error: 'Not your contract' };
        }

        // Check if already has a bonus
        if (contract.socialBonusEnabled && contract.socialBonusTweetId) {
            return {
                success: true,
                message: 'Social bonus already activated',
                tweetId: contract.socialBonusTweetId,
                alreadyActive: true
            };
        }

        // Activate social bonus
        await db.update(contracts)
            .set({
                socialBonusEnabled: true,
                socialBonusTweetId: tweetId,
                socialBonusVerified: false,
                updatedAt: new Date(),
            } as any)
            .where(eq(contracts.id, id));

        console.log(`🐦 Social bonus activated for contract ${id} (tweet: ${tweetId})`);

        return {
            success: true,
            tweetId,
            bonusMultiplier: 1.05,
            message: 'Social bonus activated! Tweet will be verified shortly.'
        };
    });

    /**
     * DELETE /contracts/:id/social-bonus
     * Remove social share bonus from a contract
     */
    fastify.delete<{
        Params: { id: string };
    }>('/contracts/:id/social-bonus', async (request, reply) => {
        // @ts-ignore
        const userId = request.userId;
        if (!userId) {
            reply.status(401);
            return { error: 'Unauthorized' };
        }

        const { id } = request.params;

        const [contract] = await db.select().from(contracts)
            .where(eq(contracts.id, id)).limit(1);

        if (!contract) {
            reply.status(404);
            return { error: 'Contract not found' };
        }

        if (contract.principalUserId !== userId) {
            reply.status(403);
            return { error: 'Not your contract' };
        }

        await db.update(contracts)
            .set({
                socialBonusEnabled: false,
                socialBonusVerified: false,
                socialBonusTweetId: null,
                updatedAt: new Date(),
            } as any)
            .where(eq(contracts.id, id));

        return { success: true, message: 'Social bonus removed' };
    });
};

export default socialBonusRoutes;

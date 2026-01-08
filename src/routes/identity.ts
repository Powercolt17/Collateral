import { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client.js';
import { identities } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Reserved usernames that cannot be claimed
const RESERVED_USERNAMES = [
    'admin', 'collateral', 'system', 'api', 'app',
    'support', 'help', 'root', 'mod', 'moderator'
];

// Username validation regex: lowercase a-z, 0-9, underscore, 3-20 chars
const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

const identityRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * POST /identity/claim
     * Claim a username (identity)
     */
    fastify.post<{
        Body: {
            userId: string;
            username: string;
            displayName?: string;
            bio?: string;
        };
    }>('/identity/claim', async (request, reply) => {
        const { userId, username, displayName, bio } = request.body;

        // Normalize username
        const normalizedUsername = username.toLowerCase().trim();

        // Validate format
        if (!USERNAME_REGEX.test(normalizedUsername)) {
            reply.status(400);
            return {
                error: 'Invalid username format. Must be 3-20 characters, lowercase letters, numbers, underscores only.'
            };
        }

        // Check reserved
        if (RESERVED_USERNAMES.includes(normalizedUsername)) {
            reply.status(400);
            return { error: 'Username is reserved' };
        }

        // Check if user already has identity
        const [existingForUser] = await db
            .select()
            .from(identities)
            .where(eq(identities.userId, userId))
            .limit(1);

        if (existingForUser) {
            reply.status(400);
            return { error: 'User already has an identity' };
        }

        // Check if username taken
        const [existingUsername] = await db
            .select()
            .from(identities)
            .where(eq(identities.username, normalizedUsername))
            .limit(1);

        if (existingUsername) {
            reply.status(409);
            return { error: 'Username already taken' };
        }

        // Validate bio length
        if (bio && bio.length > 120) {
            reply.status(400);
            return { error: 'Bio must be 120 characters or less' };
        }

        // Create identity
        const [created] = await db
            .insert(identities)
            .values({
                userId,
                username: normalizedUsername,
                displayName: displayName || null,
                bio: bio || null,
                status: 'ACTIVE',
            })
            .returning();

        return {
            identity: {
                id: created.id,
                username: created.username,
                displayName: created.displayName,
                bio: created.bio,
                status: created.status,
                createdAt: created.createdAt.toISOString(),
            },
        };
    });

    /**
     * GET /identity/me
     * Get current user's identity
     */
    fastify.get<{
        Querystring: { userId: string };
    }>('/identity/me', async (request, reply) => {
        const { userId } = request.query;

        if (!userId) {
            reply.status(401);
            return { error: 'Not authenticated' };
        }

        const [identity] = await db
            .select()
            .from(identities)
            .where(eq(identities.userId, userId))
            .limit(1);

        if (!identity) {
            reply.status(404);
            return { error: 'Identity not found. Claim a username first.' };
        }

        return {
            identity: {
                id: identity.id,
                username: identity.username,
                displayName: identity.displayName,
                bio: identity.bio,
                photoUrl: identity.photoUrl,
                status: identity.status,
                createdAt: identity.createdAt.toISOString(),
                updatedAt: identity.updatedAt.toISOString(),
            },
        };
    });

    /**
     * PATCH /identity/me
     * Update bio/photo only (no username changes)
     */
    fastify.patch<{
        Querystring: { userId: string };
        Body: { bio?: string; photoUrl?: string; displayName?: string };
    }>('/identity/me', async (request, reply) => {
        const { userId } = request.query;
        const { bio, photoUrl, displayName } = request.body;

        if (!userId) {
            reply.status(401);
            return { error: 'Not authenticated' };
        }

        const [identity] = await db
            .select()
            .from(identities)
            .where(eq(identities.userId, userId))
            .limit(1);

        if (!identity) {
            reply.status(404);
            return { error: 'Identity not found' };
        }

        // Validate bio length
        if (bio !== undefined && bio.length > 120) {
            reply.status(400);
            return { error: 'Bio must be 120 characters or less' };
        }

        const updates: Partial<typeof identity> = {
            updatedAt: new Date(),
        };
        if (bio !== undefined) updates.bio = bio;
        if (photoUrl !== undefined) updates.photoUrl = photoUrl;
        if (displayName !== undefined) updates.displayName = displayName;

        const [updated] = await db
            .update(identities)
            .set(updates)
            .where(eq(identities.id, identity.id))
            .returning();

        return {
            identity: {
                id: updated.id,
                username: updated.username,
                displayName: updated.displayName,
                bio: updated.bio,
                photoUrl: updated.photoUrl,
                status: updated.status,
                updatedAt: updated.updatedAt.toISOString(),
            },
        };
    });
};

export default identityRoutes;

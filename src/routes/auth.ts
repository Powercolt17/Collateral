import { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client.js';
import { users, identities } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { signAccessToken, requireAuth, getPrincipal } from '../services/auth.js';
import {
    getBindingsForUser,
    bindIdentity,
    type IdentityProvider
} from '../services/identity-bindings.js';

/**
 * Auth Routes
 * 
 * JWT-based authentication with proper token signing
 * Identity binding management with append-only audit trail
 */
const authRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * POST /auth/login
     * Login with email or passkey
     * Returns JWT access token
     */
    fastify.post<{
        Body: { email?: string; passkeyId?: string; displayName?: string };
    }>('/auth/login', async (request, reply) => {
        const { email, passkeyId, displayName } = request.body;

        if (!email && !passkeyId) {
            reply.status(400);
            return { error: 'Email or passkey required' };
        }

        let user;
        let isNewUser = false;

        if (email) {
            // Find or create user by email
            const [existing] = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (existing) {
                user = existing;
            } else {
                const [created] = await db
                    .insert(users)
                    .values({ email })
                    .returning();
                user = created;
                isNewUser = true;
            }
        } else if (passkeyId) {
            // Find user by passkey
            const [existing] = await db
                .select()
                .from(users)
                .where(eq(users.passkeyId, passkeyId))
                .limit(1);

            if (!existing) {
                reply.status(401);
                return { error: 'Passkey not found' };
            }
            user = existing;
        }

        if (!user) {
            reply.status(500);
            return { error: 'Failed to authenticate' };
        }

        // Get or create identity
        let [identity] = await db
            .select()
            .from(identities)
            .where(eq(identities.userId, user.id))
            .limit(1);

        // Create identity if new user with displayName, or update existing if displayName provided
        if (!identity && displayName) {
            // Create new identity with displayName as username (normalized)
            const username = displayName.toLowerCase().replace(/[^a-z0-9_]/g, '');
            const [created] = await db
                .insert(identities)
                .values({
                    userId: user.id,
                    username,
                    displayName,
                    status: 'ACTIVE' as const,
                })
                .returning();
            identity = created;
            console.log(`✅ Created identity for user ${user.id}: @${username} (${displayName})`);
        } else if (identity && displayName && identity.displayName !== displayName) {
            // Update existing identity if displayName changed
            const [updated] = await db
                .update(identities)
                .set({ displayName })
                .where(eq(identities.userId, user.id))
                .returning();
            identity = updated;
            console.log(`✅ Updated identity displayName for user ${user.id}: ${displayName}`);
        }

        // Sign JWT access token
        const accessToken = signAccessToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
            },
            identity: identity
                ? {
                    username: identity.username,
                    displayName: identity.displayName,
                    status: identity.status,
                }
                : null,
            accessToken,
        };
    });

    /**
     * GET /auth/me
     * Get current authenticated user (requires auth)
     */
    fastify.get('/auth/me', {
        preHandler: requireAuth,
    }, async (request) => {
        const userId = getPrincipal(request);

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user) {
            return { error: 'User not found' };
        }

        const [identity] = await db
            .select()
            .from(identities)
            .where(eq(identities.userId, userId))
            .limit(1);

        return {
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
            },
            identity: identity || null,
        };
    });

    /**
     * POST /identity/:provider/bind
     * Bind an identity provider to the authenticated user
     * Requires auth - uses principalUserId (NEVER from body)
     */
    fastify.post<{
        Params: { provider: string };
        Body: { providerUserId: string; providerAccountId?: string };
    }>('/identity/:provider/bind', {
        preHandler: requireAuth,
    }, async (request, reply) => {
        const userId = getPrincipal(request);
        const { provider } = request.params;
        const { providerUserId, providerAccountId } = request.body;

        // Validate provider
        const validProviders: IdentityProvider[] = ['stripe', 'github', 'x', 'google', 'youtube', 'tiktok', 'shopify'];
        if (!validProviders.includes(provider as IdentityProvider)) {
            reply.status(400);
            return { error: `Invalid provider: ${provider}` };
        }

        if (!providerUserId) {
            reply.status(400);
            return { error: 'providerUserId required' };
        }

        // Bind identity (userId comes ONLY from auth middleware)
        const result = await bindIdentity({
            userId,
            provider: provider as IdentityProvider,
            providerUserId,
            providerAccountId,
        });

        return {
            binding: result.binding,
            created: result.created,
            revokedBinding: result.revokedBinding || null,
        };
    });

    /**
     * GET /identity/bindings
     * Get all identity bindings for authenticated user (active + history)
     */
    fastify.get('/identity/bindings', {
        preHandler: requireAuth,
    }, async (request) => {
        const userId = getPrincipal(request);
        const bindings = await getBindingsForUser(userId);

        return {
            bindings,
            active: bindings.filter(b => !b.revokedAt),
            revoked: bindings.filter(b => !!b.revokedAt),
        };
    });
};

export default authRoutes;


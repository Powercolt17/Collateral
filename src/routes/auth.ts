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
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Auth Routes
 * 
 * JWT-based authentication with bcrypt password hashing
 * Identity binding management with append-only audit trail
 */
const authRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * POST /v1/auth/signup
     * Create new account with email, password, username
     * Returns JWT access token + user + identity
     */
    fastify.post<{
        Body: { email: string; password: string; username: string; displayName?: string };
    }>('/v1/auth/signup', async (request, reply) => {
        const { email, password, username, displayName } = request.body;

        // Validation
        if (!email || !password || !username) {
            reply.status(400);
            return { ok: false, error: 'Email, password, and username required' };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            reply.status(400);
            return { ok: false, error: 'Invalid email format' };
        }

        // Validate password length
        if (password.length < 8) {
            reply.status(400);
            return { ok: false, error: 'Password must be at least 8 characters' };
        }

        // Validate username (alphanumeric, underscores, 3-20 chars)
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            reply.status(400);
            return { ok: false, error: 'Username must be 3-20 characters, alphanumeric and underscores only' };
        }

        // Check if email already exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (existingUser) {
            reply.status(409);
            return { ok: false, error: 'Email already registered' };
        }

        // Check if username already exists
        const [existingUsername] = await db
            .select()
            .from(identities)
            .where(eq(identities.username, username.toLowerCase()))
            .limit(1);

        if (existingUsername) {
            reply.status(409);
            return { ok: false, error: 'Username already taken' };
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user with password hash
        const [user] = await db
            .insert(users)
            .values({
                email: email.toLowerCase(),
                passwordHash,
            })
            .returning();

        // Create identity
        const [identity] = await db
            .insert(identities)
            .values({
                userId: user.id,
                username: username.toLowerCase(),
                displayName: displayName || username,
                status: 'ACTIVE' as const,
            })
            .returning();

        console.log(`✅ Created user ${user.id} with identity @${identity.username} (${identity.displayName})`);

        // Sign JWT access token
        const accessToken = signAccessToken(user.id);

        return {
            ok: true,
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
            },
            identity: {
                username: identity.username,
                displayName: identity.displayName,
                status: identity.status,
            },
            accessToken,
        };
    });

    /**
     * POST /v1/auth/login
     * Login with email + password
     * Returns JWT access token + user + identity
     * DOES NOT create user - returns 401 if not found
     */
    fastify.post<{
        Body: { email: string; password: string };
    }>('/v1/auth/login', async (request, reply) => {
        const { email, password } = request.body;

        // Validation
        if (!email || !password) {
            reply.status(400);
            return { ok: false, error: 'Email and password required' };
        }

        // Find user by email
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (!user) {
            reply.status(401);
            return { ok: false, error: 'Invalid email or password' };
        }

        // Check if user has password (might be a legacy passwordless account)
        if (!user.passwordHash) {
            reply.status(401);
            return { ok: false, error: 'Please use the signup flow to create a password' };
        }

        // Verify password
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
            reply.status(401);
            return { ok: false, error: 'Invalid email or password' };
        }

        // Load identity
        const [identity] = await db
            .select()
            .from(identities)
            .where(eq(identities.userId, user.id))
            .limit(1);

        console.log(`✅ User ${user.id} logged in (identity: ${identity?.displayName || 'none'})`);

        // Sign JWT access token
        const accessToken = signAccessToken(user.id);

        return {
            ok: true,
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
     * POST /auth/login (DEPRECATED - Dev only)
     * Legacy passwordless login - will be removed
     * Only works in development mode
     */
    fastify.post<{
        Body: { email?: string; passkeyId?: string; displayName?: string };
    }>('/auth/login', async (request, reply) => {
        // Guard: Only allow in development
        if (process.env.NODE_ENV === 'production') {
            reply.status(410);
            return { ok: false, error: 'This endpoint is deprecated. Use /v1/auth/login' };
        }

        const { email, passkeyId, displayName } = request.body;

        if (!email && !passkeyId) {
            reply.status(400);
            return { error: 'Email or passkey required' };
        }

        let user;

        if (email) {
            // Find or create user by email (dev mode only)
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
            }
        } else if (passkeyId) {
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

        if (!identity && displayName) {
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
        }

        const accessToken = signAccessToken(user.id);

        return {
            ok: true,
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


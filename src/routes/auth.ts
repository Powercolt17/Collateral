// @ts-nocheck
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
        Body: { email: string; password: string; username: string; displayName?: string; referralCode?: string };
    }>('/v1/auth/signup', async (request, reply) => {
        const { email, password, username, displayName, referralCode } = request.body;

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
        // Use raw SQL to avoid Drizzle's RETURNING * which includes all schema columns
        // (referral columns may not exist if migration 0034 hasn't been applied)
        const { sql: rawSql } = await import('drizzle-orm');
        const userResult = await db.execute(rawSql`
            INSERT INTO users (email, password_hash)
            VALUES (${email.toLowerCase()}, ${passwordHash})
            RETURNING id, email, created_at
        `);
        const user = (userResult as any)[0] || (userResult as any).rows?.[0];
        if (!user) {
            reply.status(500);
            return { ok: false, error: 'Failed to create account' };
        }
        // Normalize field access (some drivers use snake_case)
        const userId = user.id;
        const userEmail = user.email;
        const userCreatedAt = user.created_at || user.createdAt;

        // Create identity
        const [identity] = await db
            .insert(identities)
            .values({
                userId: userId,
                username: username.toLowerCase(),
                displayName: displayName || username,
                status: 'ACTIVE' as const,
            })
            .returning();

        console.log(`✅ Created user ${userId} with identity @${identity.username} (${identity.displayName})`);

        // REFERRAL: Set referral code + track referral (non-blocking)
        // Wrapped in try/catch so signup works even if referral columns don't exist yet
        try {
            await db.execute(rawSql`
                UPDATE users SET referral_code = ${username.toLowerCase()}
                WHERE id = ${userId}
            `);
        } catch (err: any) {
            console.warn('[Auth] Could not set referral_code (migration pending?):', err.message);
        }

        if (referralCode) {
            try {
                const { lookupReferrer, createPendingReferral } = await import('../services/referral.js');
                const referrerId = await lookupReferrer(referralCode);
                if (referrerId && referrerId !== userId) {
                    await db.execute(rawSql`
                        UPDATE users SET referred_by_user_id = ${referrerId}
                        WHERE id = ${userId}
                    `);
                    await createPendingReferral(referrerId, userId);
                    console.log(`🔗 Referral tracked: ${referralCode} → ${userId}`);
                }
            } catch (err: any) {
                console.error('[Auth] Referral tracking failed (non-blocking):', err.message);
            }
        }

        // EMAIL: Welcome notification (fire-and-forget)
        import('../services/email.js').then(({ sendWelcomeEmail }) => {
            sendWelcomeEmail(userEmail, identity.username).catch(() => { });
        }).catch(() => { });

        // Sign JWT access token
        const accessToken = signAccessToken(userId);

        return {
            ok: true,
            user: {
                id: userId,
                email: userEmail,
                createdAt: typeof userCreatedAt === 'string' ? userCreatedAt : new Date(userCreatedAt).toISOString(),
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
     * POST /v1/auth/forgot-password
     * Request a password reset email.
     * Only for email/password accounts (not Clerk/OAuth).
     * Always returns success to prevent email enumeration.
     */
    fastify.post<{
        Body: { email: string };
    }>('/v1/auth/forgot-password', async (request, reply) => {
        const { email } = request.body;

        if (!email) {
            reply.status(400);
            return { ok: false, error: 'Email required' };
        }

        const successResponse = {
            ok: true,
            message: 'If an account exists with that email, a reset link has been sent.',
        };

        try {
            console.log(`[Auth] Forgot-password: Looking up ${email.toLowerCase()}...`);
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.email, email.toLowerCase()))
                .limit(1);

            if (!user) {
                console.log(`[Auth] Forgot-password: No account found for ${email} (returning generic success)`);
                return successResponse;
            }

            console.log(`[Auth] Forgot-password: User found (${user.id}). Generating reset token...`);
            const crypto = await import('crypto');
            const resetToken = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            const { sql } = await import('drizzle-orm');
            await db.execute(sql`
                UPDATE users 
                SET reset_token = ${resetToken}, 
                    reset_token_expires_at = ${expiresAt.toISOString()}
                WHERE id = ${user.id}
            `);
            console.log(`[Auth] Forgot-password: Token stored in DB. Expires ${expiresAt.toISOString()}`);

            const appUrl = process.env.APP_URL || process.env.FRONTEND_URL || 'https://collateral.market';
            const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;
            console.log(`[Auth] Forgot-password: Reset URL = ${resetUrl}`);

            // Send reset email with full error surfacing
            try {
                console.log(`[Auth] Forgot-password: Importing email service...`);
                const { sendPasswordResetEmail } = await import('../services/email.js');
                console.log(`[Auth] Forgot-password: Sending email to ${email.toLowerCase()}...`);
                await sendPasswordResetEmail(email.toLowerCase(), resetUrl);
                console.log(`[Auth] ✅ Password reset email SENT to ${email}`);
            } catch (emailErr: any) {
                console.error(`[Auth] ❌ Password reset email FAILED for ${email}:`, emailErr.message, emailErr.stack);
            }

            return successResponse;
        } catch (err: any) {
            console.error('[Auth] ❌ Forgot password flow error:', err.message, err.stack);
            return successResponse;
        }
    });

    /**
     * POST /v1/auth/reset-password
     * Reset password using token from email link.
     */
    fastify.post<{
        Body: { token: string; password: string };
    }>('/v1/auth/reset-password', async (request, reply) => {
        const { token, password } = request.body;

        if (!token || !password) {
            reply.status(400);
            return { ok: false, error: 'Token and new password required' };
        }

        if (password.length < 8) {
            reply.status(400);
            return { ok: false, error: 'Password must be at least 8 characters' };
        }

        try {
            const { sql } = await import('drizzle-orm');
            const result = await db.execute(sql`
                SELECT id, email, reset_token_expires_at 
                FROM users 
                WHERE reset_token = ${token}
                LIMIT 1
            `);

            const rows = (result as any).rows || (Array.isArray(result) ? result : []);
            const user = rows[0];

            if (!user) {
                reply.status(400);
                return { ok: false, error: 'Invalid or expired reset link. Please request a new one.' };
            }

            const expiresAt = new Date(user.reset_token_expires_at);
            if (expiresAt < new Date()) {
                await db.execute(sql`
                    UPDATE users SET reset_token = NULL, reset_token_expires_at = NULL WHERE id = ${user.id}
                `);
                reply.status(400);
                return { ok: false, error: 'Reset link has expired. Please request a new one.' };
            }

            const newHash = await bcrypt.hash(password, SALT_ROUNDS);
            await db.execute(sql`
                UPDATE users 
                SET password_hash = ${newHash}, 
                    reset_token = NULL, 
                    reset_token_expires_at = NULL
                WHERE id = ${user.id}
            `);

            console.log(`[Auth] Password reset completed for ${user.email}`);

            return {
                ok: true,
                message: 'Password updated successfully. You can now sign in.',
            };
        } catch (err: any) {
            console.error('[Auth] Reset password error:', err.message);
            reply.status(500);
            return { ok: false, error: 'Failed to reset password. Please try again.' };
        }
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


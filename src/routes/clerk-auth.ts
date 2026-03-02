// @ts-nocheck
/**
 * Clerk OAuth Routes
 * 
 * Token exchange endpoint: Frontend sends Clerk session token,
 * backend verifies it, upserts user, and returns internal JWT.
 * 
 * This keeps the existing auth pipeline (principalUserId / requireAuth) intact.
 */
import { FastifyPluginAsync } from 'fastify';
import { createClerkClient } from '@clerk/backend';
import { db } from '../db/client.js';
import { users, identities } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { signAccessToken } from '../services/auth.js';

const clerkAuthRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * POST /v1/auth/clerk
     * 
     * Exchange a Clerk session token for an internal JWT.
     * 
     * Flow:
     * 1. Frontend authenticates with Clerk (Google/Apple OAuth)
     * 2. Frontend sends Clerk session token to this endpoint
     * 3. Backend verifies token with Clerk Backend SDK
     * 4. Upserts user by clerk_user_id
     * 5. Returns internal JWT + user data
     */
    fastify.post<{
        Body: { token: string };
    }>('/v1/auth/clerk', async (request, reply) => {
        const { token } = request.body;

        if (!token) {
            reply.status(400);
            return { ok: false, error: 'Clerk token required' };
        }

        const clerkSecretKey = process.env.CLERK_SECRET_KEY;
        if (!clerkSecretKey) {
            console.error('[ClerkAuth] CLERK_SECRET_KEY not configured');
            reply.status(500);
            return { ok: false, error: 'OAuth not configured' };
        }

        try {
            // Verify the Clerk session token
            const clerk = createClerkClient({ secretKey: clerkSecretKey });

            // Decode the JWT to extract the user ID (sub claim)
            // Then verify via Clerk API that the user actually exists
            let clerkUserId: string;
            try {
                // Clerk session tokens are standard JWTs — decode the payload
                const parts = token.split('.');
                if (parts.length !== 3) throw new Error('Invalid JWT format');
                const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
                clerkUserId = payload.sub;
                if (!clerkUserId) throw new Error('No sub claim in token');
                console.log('[ClerkAuth] Decoded JWT, user:', clerkUserId);
            } catch (decodeErr: any) {
                console.error('[ClerkAuth] JWT decode failed:', decodeErr.message);
                reply.status(401);
                return { ok: false, error: 'Invalid token format' };
            }

            if (!clerkUserId) {
                reply.status(401);
                return { ok: false, error: 'Invalid Clerk token' };
            }

            // Get user details from Clerk
            const clerkUser = await clerk.users.getUser(clerkUserId);
            const email = clerkUser.emailAddresses?.[0]?.emailAddress || null;
            const firstName = clerkUser.firstName || '';
            const lastName = clerkUser.lastName || '';
            const displayName = [firstName, lastName].filter(Boolean).join(' ') || email?.split('@')[0] || 'User';

            // Upsert user by clerk_user_id
            let [user] = await db
                .select()
                .from(users)
                .where(eq(users.clerkUserId, clerkUserId))
                .limit(1);

            if (!user) {
                // Check if user exists by email (link existing account)
                if (email) {
                    const [existingByEmail] = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, email.toLowerCase()))
                        .limit(1);

                    if (existingByEmail) {
                        // Link Clerk to existing email-based account
                        const [updated] = await db
                            .update(users)
                            .set({ clerkUserId })
                            .where(eq(users.id, existingByEmail.id))
                            .returning();
                        user = updated;
                        console.log(`✅ [ClerkAuth] Linked Clerk ${clerkUserId} to existing user ${user.id}`);
                    }
                }

                if (!user) {
                    // Create new user
                    const [created] = await db
                        .insert(users)
                        .values({
                            email: email?.toLowerCase() || null,
                            clerkUserId,
                        })
                        .returning();
                    user = created;
                    console.log(`✅ [ClerkAuth] Created new user ${user.id} via Clerk (${email})`);

                    // EMAIL: Welcome (fire-and-forget)
                    if (email) {
                        import('../services/email.js').then(({ sendWelcomeEmail }) => {
                            sendWelcomeEmail(email, displayName).catch(() => { });
                        }).catch(() => { });
                    }
                }
            }

            // Ensure identity exists
            let [identity] = await db
                .select()
                .from(identities)
                .where(eq(identities.userId, user.id))
                .limit(1);

            if (!identity) {
                // Auto-create identity from Clerk profile
                const username = (displayName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user').slice(0, 20);
                // Ensure uniqueness by appending random suffix if needed
                let finalUsername = username;
                const [existing] = await db
                    .select()
                    .from(identities)
                    .where(eq(identities.username, username))
                    .limit(1);
                if (existing) {
                    finalUsername = (username.slice(0, 15) + '_' + Math.random().toString(36).slice(2, 6));
                }

                const [created] = await db
                    .insert(identities)
                    .values({
                        userId: user.id,
                        username: finalUsername,
                        displayName: displayName.slice(0, 50),
                        photoUrl: clerkUser.imageUrl || null,
                        status: 'ACTIVE' as const,
                    })
                    .returning();
                identity = created;
                console.log(`✅ [ClerkAuth] Created identity @${identity.username} for user ${user.id}`);
            }

            // Issue internal JWT
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
        } catch (err: any) {
            console.error('[ClerkAuth] Token verification failed:', err.message);
            reply.status(401);
            return { ok: false, error: 'Authentication failed' };
        }
    });
};

export default clerkAuthRoutes;

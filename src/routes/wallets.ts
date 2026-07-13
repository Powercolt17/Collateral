import { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client.js';
import { userWallets, walletNonces, users, identities } from '../db/schema.js';
import { eq, and, sql } from 'drizzle-orm';
import { verifyMessage } from 'viem';
import { requireAuth, getPrincipal, signAccessToken } from '../services/auth.js';
import crypto from 'node:crypto';

const walletsRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * POST /v1/auth/wallet/nonce
     * Request a one-time nonce for wallet linking or unlinking
     */
    fastify.post('/v1/auth/wallet/nonce', async (request) => {
        // Generate single-use random nonce
        const nonce = crypto.randomBytes(16).toString('hex');
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
        const createdAt = new Date();

        let userId = null;
        try {
            // If user is currently authenticated, link the user ID to the nonce
            userId = getPrincipal(request);
        } catch {
            // Null user if not logged in yet
        }

        await db.insert(walletNonces).values({
            nonce,
            userId,
            expiresAt,
            createdAt,
            consumed: false
        } as any);

        console.log(`[auth-wallet] Generated nonce: ${nonce} (Expires: ${expiresAt.toISOString()})`);

        return {
            ok: true,
            nonce,
            createdAt: createdAt.toISOString(),
            expiresAt: expiresAt.toISOString()
        };
    });

    /**
     * POST /v1/auth/wallet/link
     * Link verified wallet signature to authenticated user
     */
    fastify.post<{
        Body: { walletAddress: string; signature: string; nonce: string; timestamp?: string };
    }>('/v1/auth/wallet/link', {
        preHandler: requireAuth
    }, async (request, reply) => {
        const userId = getPrincipal(request);
        const { walletAddress, signature, nonce } = request.body;

        if (!walletAddress || !signature || !nonce) {
            reply.status(400);
            return { ok: false, error: 'walletAddress, signature, and nonce required' };
        }

        const normalizedAddress = walletAddress.toLowerCase();

        // 1. Fetch & validate nonce
        const [nonceRecord] = await db
            .select()
            .from(walletNonces)
            .where(eq(walletNonces.nonce, nonce))
            .limit(1);

        if (!nonceRecord || nonceRecord.consumed || nonceRecord.expiresAt < new Date()) {
            reply.status(400);
            return { ok: false, error: 'Invalid or expired verification session. Please request a new nonce.' };
        }

        // Consume nonce immediately
        await db
            .update(walletNonces)
            .set({ consumed: true } as any)
            .where(eq(walletNonces.id, nonceRecord.id));

        // 2. Format SIWE message matching standard layout
        const iatStr = nonceRecord.createdAt.toISOString();
        const expStr = nonceRecord.expiresAt.toISOString();

        const expectedMessage = `Collateral Wallet Verification\n\n` +
            `Link wallet ${walletAddress} to your Collateral account.\n\n` +
            `User ID: ${userId}\n` +
            `Domain: collateral.market\n` +
            `Chain ID: 4663\n` +
            `Nonce: ${nonce}\n` +
            `Issued At: ${iatStr}\n` +
            `Expiration Time: ${expStr}`;

        // 3. Verify signature
        try {
            const isValid = await verifyMessage({
                address: walletAddress as `0x${string}`,
                message: expectedMessage,
                signature: signature as `0x${string}`
            });

            if (!isValid) {
                reply.status(401);
                return { ok: false, error: 'Invalid message signature' };
            }
        } catch (err: any) {
            console.error('[auth-wallet] Signature recovery failed:', err);
            reply.status(400);
            return { ok: false, error: 'Signature verification failed. Invalid payload.' };
        }

        // 4. Check unique constraints: is this wallet already linked to another account?
        const [otherLink] = await db
            .select()
            .from(userWallets)
            .where(eq(sql`lower(${userWallets.walletAddress})`, normalizedAddress))
            .limit(1);

        if (otherLink) {
            if (otherLink.userId !== userId) {
                reply.status(409);
                return {
                    ok: false,
                    error: 'This wallet is already linked to another Collateral account. Sign into that account or unlink the wallet there first.'
                };
            }

            // Already linked to THIS user. Just update lastConnectedAt
            await db
                .update(userWallets)
                .set({ lastConnectedAt: new Date() } as any)
                .where(eq(userWallets.id, otherLink.id));

            console.log(`[auth-wallet] Wallet ${normalizedAddress} re-verified for user ${userId}.`);
            return { ok: true, message: 'Wallet verification successful' };
        }

        // 5. Determine if this should be the primary wallet (primary if no other wallets exist)
        const [existingWallets] = await db
            .select()
            .from(userWallets)
            .where(eq(userWallets.userId, userId))
            .limit(1);

        const isPrimary = !existingWallets;

        // Insert new wallet link
        await db.insert(userWallets).values({
            userId,
            walletAddress: normalizedAddress,
            chainId: 4663,
            isPrimary,
            verifiedAt: new Date(),
            lastConnectedAt: new Date()
        } as any);

        console.log(`[auth-wallet] LINK AUDIT LOG: Linked wallet ${normalizedAddress} as primary=${isPrimary} for user ${userId}`);

        return {
            ok: true,
            message: 'Wallet linked successfully'
        };
    });

    /**
     * POST /v1/auth/wallet/unlink
     * Unlink a wallet address from currently logged-in account
     */
    fastify.post<{
        Body: { walletAddress: string; signature: string; nonce: string };
    }>('/v1/auth/wallet/unlink', {
        preHandler: requireAuth
    }, async (request, reply) => {
        const userId = getPrincipal(request);
        const { walletAddress, signature, nonce } = request.body;

        if (!walletAddress || !signature || !nonce) {
            reply.status(400);
            return { ok: false, error: 'walletAddress, signature, and nonce required' };
        }

        const normalizedAddress = walletAddress.toLowerCase();

        // 1. Fetch & validate nonce
        const [nonceRecord] = await db
            .select()
            .from(walletNonces)
            .where(eq(walletNonces.nonce, nonce))
            .limit(1);

        if (!nonceRecord || nonceRecord.consumed || nonceRecord.expiresAt < new Date()) {
            reply.status(400);
            return { ok: false, error: 'Invalid or expired verification session. Please request a new nonce.' };
        }

        // Consume nonce immediately
        await db
            .update(walletNonces)
            .set({ consumed: true } as any)
            .where(eq(walletNonces.id, nonceRecord.id));

        // 2. Format SIWE message matching standard layout
        const iatStr = nonceRecord.createdAt.toISOString();
        const expStr = nonceRecord.expiresAt.toISOString();

        const expectedMessage = `Collateral Wallet Verification\n\n` +
            `Unlink wallet ${walletAddress} from your Collateral account.\n\n` +
            `User ID: ${userId}\n` +
            `Domain: collateral.market\n` +
            `Chain ID: 4663\n` +
            `Nonce: ${nonce}\n` +
            `Issued At: ${iatStr}\n` +
            `Expiration Time: ${expStr}`;

        // 3. Verify signature
        try {
            const isValid = await verifyMessage({
                address: walletAddress as `0x${string}`,
                message: expectedMessage,
                signature: signature as `0x${string}`
            });

            if (!isValid) {
                reply.status(401);
                return { ok: false, error: 'Invalid message signature' };
            }
        } catch (err: any) {
            reply.status(400);
            return { ok: false, error: 'Signature verification failed' };
        }

        // 4. Retrieve link
        const [link] = await db
            .select()
            .from(userWallets)
            .where(and(
                eq(userWallets.userId, userId),
                eq(sql`lower(${userWallets.walletAddress})`, normalizedAddress)
            ))
            .limit(1);

        if (!link) {
            reply.status(404);
            return { ok: false, error: 'Wallet link not found on this account' };
        }

        // Delete link
        await db
            .delete(userWallets)
            .where(eq(userWallets.id, link.id));

        console.log(`[auth-wallet] UNLINK AUDIT LOG: Unlinked wallet ${normalizedAddress} from user ${userId}`);

        // If unlinked wallet was primary, promote another linked wallet to primary
        if (link.isPrimary) {
            const [nextWallet] = await db
                .select()
                .from(userWallets)
                .where(eq(userWallets.userId, userId))
                .limit(1);

            if (nextWallet) {
                await db
                    .update(userWallets)
                    .set({ isPrimary: true } as any)
                    .where(eq(userWallets.id, nextWallet.id));
                console.log(`[auth-wallet] Promoted wallet ${nextWallet.walletAddress} to primary for user ${userId}`);
            }
        }

        return {
            ok: true,
            message: 'Wallet unlinked successfully'
        };
    });

    /**
     * POST /v1/auth/wallet/primary
     * Set a linked wallet as the user's primary wallet
     */
    fastify.post<{
        Body: { walletAddress: string };
    }>('/v1/auth/wallet/primary', {
        preHandler: requireAuth
    }, async (request, reply) => {
        const userId = getPrincipal(request);
        const { walletAddress } = request.body;

        if (!walletAddress) {
            reply.status(400);
            return { ok: false, error: 'walletAddress required' };
        }

        const normalizedAddress = walletAddress.toLowerCase();

        // Retrieve link
        const [link] = await db
            .select()
            .from(userWallets)
            .where(and(
                eq(userWallets.userId, userId),
                eq(sql`lower(${userWallets.walletAddress})`, normalizedAddress)
            ))
            .limit(1);

        if (!link) {
            reply.status(404);
            return { ok: false, error: 'Wallet must be verified and linked before setting as primary' };
        }

        // Reset all primary flags
        await db
            .update(userWallets)
            .set({ isPrimary: false } as any)
            .where(eq(userWallets.userId, userId));

        // Mark target wallet as primary
        await db
            .update(userWallets)
            .set({ isPrimary: true } as any)
            .where(eq(userWallets.id, link.id));

        console.log(`[auth-wallet] PRIMARY CHANGE AUDIT LOG: Set wallet ${normalizedAddress} as primary for user ${userId}`);

        return {
            ok: true,
            message: 'Primary wallet updated successfully'
        };
    });

    /**
     * GET /v1/auth/wallet/list
     * List all linked wallets for the authenticated user
     */
    fastify.get('/v1/auth/wallet/list', {
        preHandler: requireAuth
    }, async (request) => {
        const userId = getPrincipal(request);

        const list = await db
            .select()
            .from(userWallets)
            .where(eq(userWallets.userId, userId));

        return {
            ok: true,
            wallets: list.map(item => ({
                walletAddress: item.walletAddress,
                chainId: item.chainId,
                isPrimary: item.isPrimary,
                verifiedAt: item.verifiedAt.toISOString(),
                lastConnectedAt: item.lastConnectedAt.toISOString()
            }))
        };
    });

    /**
     * POST /v1/auth/wallet/login
     * Authenticate or register a new user using a SIWE message signature.
     */
    fastify.post<{
        Body: { walletAddress: string; signature: string; nonce: string; referralCode?: string };
    }>('/v1/auth/wallet/login', async (request, reply) => {
        const { walletAddress, signature, nonce, referralCode } = request.body;

        if (!walletAddress || !signature || !nonce) {
            reply.status(400);
            return { ok: false, error: 'walletAddress, signature, and nonce required' };
        }

        const normalizedAddress = walletAddress.toLowerCase();

        // 1. Fetch & validate nonce
        const [nonceRecord] = await db
            .select()
            .from(walletNonces)
            .where(eq(walletNonces.nonce, nonce))
            .limit(1);

        if (!nonceRecord || nonceRecord.consumed || nonceRecord.expiresAt < new Date()) {
            reply.status(400);
            return { ok: false, error: 'Invalid or expired login session. Please request a new nonce.' };
        }

        // Consume nonce immediately
        await db
            .update(walletNonces)
            .set({ consumed: true } as any)
            .where(eq(walletNonces.id, nonceRecord.id));

        // 2. Format SIWE login message
        const iatStr = nonceRecord.createdAt.toISOString();
        const expStr = nonceRecord.expiresAt.toISOString();

        const expectedMessage = `Collateral Wallet Login\n\n` +
            `Authenticate with wallet ${walletAddress}.\n\n` +
            `Domain: collateral.market\n` +
            `Chain ID: 4663\n` +
            `Nonce: ${nonce}\n` +
            `Issued At: ${iatStr}\n` +
            `Expiration Time: ${expStr}`;

        // 3. Verify signature
        try {
            const isValid = await verifyMessage({
                address: walletAddress as `0x${string}`,
                message: expectedMessage,
                signature: signature as `0x${string}`
            });

            if (!isValid) {
                reply.status(401);
                return { ok: false, error: 'Invalid wallet signature' };
            }
        } catch (err: any) {
            console.error('[auth-wallet-login] Signature recovery failed:', err);
            reply.status(400);
            return { ok: false, error: 'Signature verification failed. Invalid payload.' };
        }

        // 4. Find if this wallet is already linked to a user
        const [link] = await db
            .select()
            .from(userWallets)
            .where(eq(sql`lower(${userWallets.walletAddress})`, normalizedAddress))
            .limit(1);

        let userId: string;
        let user;
        let identity;

        if (link) {
            // Existing user - load their profile
            userId = link.userId;
            
            const [existingUser] = await db
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (!existingUser) {
                reply.status(404);
                return { ok: false, error: 'User associated with this wallet not found' };
            }
            user = existingUser;

            const [existingIdentity] = await db
                .select()
                .from(identities)
                .where(eq(identities.userId, userId))
                .limit(1);
            identity = existingIdentity || null;

            // Update lastConnectedAt
            await db
                .update(userWallets)
                .set({ lastConnectedAt: new Date() } as any)
                .where(eq(userWallets.id, link.id));

            console.log(`[auth-wallet-login] Wallet logged in user ${userId}`);
        } else {
            // New user registration!
            const email = `wallet-${normalizedAddress.slice(0, 10)}-${Date.now()}@collateral.market`;
            const mockUsername = `user_${normalizedAddress.slice(2, 10)}`;

            // Check if mock username is taken (highly unlikely, but safe check)
            const [existingUsername] = await db
                .select()
                .from(identities)
                .where(eq(identities.username, mockUsername))
                .limit(1);
            
            const finalUsername = existingUsername 
                ? `${mockUsername}_${Math.floor(Math.random() * 1000)}`
                : mockUsername;

            // Create new user record
            const { sql: rawSql } = await import('drizzle-orm');
            const userResult = await db.execute(rawSql`
                INSERT INTO users (email, password_hash)
                VALUES (${email}, 'wallet-authenticated-account')
                RETURNING id, email, created_at
            `);
            const createdUser = (userResult as any)[0] || (userResult as any).rows?.[0];
            if (!createdUser) {
                reply.status(500);
                return { ok: false, error: 'Failed to create user account' };
            }
            
            userId = createdUser.id;
            user = {
                id: userId,
                email: createdUser.email,
                createdAt: createdUser.created_at || createdUser.createdAt
            };

            // Create identity
            const [createdIdentity] = await db
                .insert(identities)
                .values({
                    userId: userId,
                    username: finalUsername,
                    displayName: `Wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
                    status: 'ACTIVE' as const,
                } as any)
                .returning();
            identity = createdIdentity;

            // Create wallet link as primary
            await db.insert(userWallets).values({
                userId,
                walletAddress: normalizedAddress,
                chainId: 4663,
                isPrimary: true,
                verifiedAt: new Date(),
                lastConnectedAt: new Date()
            } as any);

            // Set referral code
            try {
                await db.execute(rawSql`
                    UPDATE users SET referral_code = ${finalUsername}
                    WHERE id = ${userId}
                `);
            } catch (err: any) {
                console.warn('[WalletLogin] Could not set referral_code:', err.message);
            }

            // Track referral if set
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
                        console.log(`🔗 Wallet signup referral tracked: ${referralCode} → ${userId}`);
                    }
                } catch (err: any) {
                    console.error('[WalletLogin] Referral tracking failed:', err.message);
                }
            }

            console.log(`[auth-wallet-login] Registered new wallet-based user ${userId} (@${finalUsername})`);
        }

        // Sign access token
        const accessToken = signAccessToken(userId);

        return {
            ok: true,
            user: {
                id: user.id,
                email: user.email,
                createdAt: typeof user.createdAt === 'string' ? user.createdAt : new Date(user.createdAt).toISOString(),
            },
            identity: identity
                ? {
                    username: identity.username,
                    displayName: identity.displayName,
                    status: identity.status,
                }
                : null,
            accessToken
        };
    });
};

export default walletsRoutes;

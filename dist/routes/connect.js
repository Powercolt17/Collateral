/**
 * Platform Connection Routes - V2 with Proof-of-Control (Production-Hardened)
 *
 * Two-step challenge flow for X:
 * 1. POST /v1/connect/x/start - Generate challenge code
 * 2. POST /v1/connect/x/verify - Verify challenge in bio
 *
 * SECURITY:
 * - challengeCode never exposed in production responses (including instructions)
 * - 60-second cooldown between /start calls (atomic check)
 * - Case-insensitive bio matching
 *
 * STATUS SEMANTICS:
 * - status: 'ACTIVE' = account row exists and is usable
 * - verificationStatus: 'PENDING' = awaiting bio verification
 * - verificationStatus: 'VERIFIED' = proof-of-control completed
 */
import { db } from '../db/client.js';
import { connectedAccounts } from '../db/schema.js';
import { getXClient, XAdapterError } from '../adapters/x.js';
import { eq, and, sql, lt, or, isNull } from 'drizzle-orm';
import { randomBytes } from 'crypto';
// =============================================================================
// CONSTANTS
// =============================================================================
const CHALLENGE_CODE_LENGTH = 8;
const CHALLENGE_EXPIRY_MINUTES = 30;
const CHALLENGE_COOLDOWN_SECONDS = 60;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// =============================================================================
// HTTP STATUS MAPPING FOR XAdapterError
// =============================================================================
function mapXAdapterErrorToHttp(error) {
    switch (error.category) {
        case 'RATE_LIMIT':
            return { status: 429, body: { error: error.message, retryable: true } };
        case 'AUTH':
            return { status: 401, body: { error: error.message, retryable: false } };
        case 'API':
            return { status: 502, body: { error: error.message, retryable: error.retryable } };
        case 'CONFIG':
            return { status: 500, body: { error: error.message, retryable: false } };
        case 'UNSUPPORTED':
            return { status: 400, body: { error: error.message, retryable: false } };
        default:
            return { status: 500, body: { error: 'Unknown X adapter error', retryable: false } };
    }
}
// =============================================================================
// HELPERS
// =============================================================================
function generateChallengeCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = randomBytes(CHALLENGE_CODE_LENGTH);
    let code = '';
    for (let i = 0; i < CHALLENGE_CODE_LENGTH; i++) {
        code += chars[bytes[i] % chars.length];
    }
    return code;
}
function isExpired(issuedAt) {
    if (!issuedAt)
        return true;
    const expiryTime = issuedAt.getTime() + CHALLENGE_EXPIRY_MINUTES * 60 * 1000;
    return Date.now() > expiryTime;
}
/**
 * Normalize text for bio comparison:
 * - Collapse whitespace
 * - Convert to uppercase
 */
function normalizeBioText(text) {
    return text.replace(/\s+/g, ' ').trim().toUpperCase();
}
/**
 * Check if bio contains challenge code (case-insensitive, whitespace-normalized)
 */
function bioContainsChallenge(bio, challengeCode) {
    const normalizedBio = normalizeBioText(bio);
    const normalizedCode = challengeCode.toUpperCase();
    return normalizedBio.includes(normalizedCode);
}
/**
 * Mask challenge code for production responses
 */
function maskChallengeCode(code) {
    if (code.length <= 4)
        return '••••••••';
    return code.substring(0, 4) + '••••';
}
// =============================================================================
// ROUTES
// =============================================================================
async function connectRoutes(fastify) {
    /**
     * POST /v1/connect/x/start
     *
     * Start X connection by generating a challenge code.
     * User must add this code to their X bio.
     *
     * ATOMIC: Uses conditional update to prevent race conditions
     * RATE LIMITED: 60-second cooldown per user
     * IDEMPOTENT: If already VERIFIED, returns success without new challenge
     */
    fastify.post('/v1/connect/x/start', {
        preHandler: async (request, reply) => {
            console.log('[connect.ts preHandler] userId:', request.userId);
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId;
        const rawUsername = request.body?.username;
        if (!rawUsername || typeof rawUsername !== 'string') {
            return reply.status(400).send({ error: 'username is required' });
        }
        const normalizedUsername = rawUsername.trim().replace(/^@/, '').toLowerCase();
        if (!normalizedUsername || normalizedUsername.length < 1) {
            return reply.status(400).send({ error: 'Invalid username' });
        }
        // Check existing account state FIRST (before X API call)
        const [existingAccount] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, 'X')))
            .limit(1);
        // IDEMPOTENT: Already VERIFIED - return success, no new challenge
        if (existingAccount?.verificationStatus === 'VERIFIED') {
            const metadata = existingAccount.metadataJson;
            return reply.status(200).send({
                platform: 'X',
                username: metadata?.resolvedUsername || normalizedUsername,
                xUserId: existingAccount.externalAccountId,
                verificationStatus: 'VERIFIED',
                verifiedAt: existingAccount.verifiedAt?.toISOString(),
            });
        }
        // EARLY COOLDOWN CHECK: Return 429 BEFORE calling X API to save rate limit
        if (existingAccount?.verificationStatus === 'PENDING' && existingAccount.challengeIssuedAt) {
            const cooldownEnd = existingAccount.challengeIssuedAt.getTime() + CHALLENGE_COOLDOWN_SECONDS * 1000;
            if (Date.now() < cooldownEnd) {
                const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000);
                return reply.status(429).send({
                    code: 'CHALLENGE_COOLDOWN',
                    error: 'Please wait before requesting a new challenge code.',
                    retryable: true,
                    retryAfterSeconds: Math.max(1, remaining),
                    ...(IS_PRODUCTION
                        ? { codeMasked: maskChallengeCode(existingAccount.challengeCode || '') }
                        : { challengeCode: existingAccount.challengeCode }),
                });
            }
        }
        // Resolve username via X API
        const client = getXClient();
        let xUser;
        try {
            xUser = await client.getUserByUsername(normalizedUsername);
        }
        catch (err) {
            if (err instanceof XAdapterError) {
                const { status, body } = mapXAdapterErrorToHttp(err);
                return reply.status(status).send(body);
            }
            throw err;
        }
        if (!xUser) {
            return reply.status(404).send({
                error: `X user not found: @${normalizedUsername}`,
                retryable: false,
            });
        }
        const now = new Date();
        const cooldownThreshold = new Date(now.getTime() - CHALLENGE_COOLDOWN_SECONDS * 1000);
        const challengeCode = generateChallengeCode();
        const metadata = {
            normalizedUsername,
            resolvedUsername: xUser.username,
            xUserId: xUser.id,
            challengeIssuedAt: now.toISOString(),
        };
        // RACE-SAFE UPSERT (Option B):
        // 1. Always try conditional UPDATE first (handles both existing rows and cooldown)
        // 2. If 0 rows updated, try INSERT with onConflictDoNothing
        // 3. If insert did nothing (conflict), re-select and return cooldown/verified
        const updateResult = await db
            .update(connectedAccounts)
            .set({
            externalAccountId: xUser.id,
            status: 'ACTIVE',
            verificationStatus: 'PENDING',
            challengeCode,
            challengeIssuedAt: now,
            connectedAt: now,
            metadataJson: metadata,
        })
            .where(and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, 'X'), 
        // Only update if NOT verified AND past cooldown
        sql `${connectedAccounts.verificationStatus} != 'VERIFIED'`, or(isNull(connectedAccounts.challengeIssuedAt), lt(connectedAccounts.challengeIssuedAt, cooldownThreshold))))
            .returning();
        if (updateResult.length === 0) {
            // No row updated - either no row exists, or VERIFIED, or in cooldown
            // Try to insert (onConflictDoNothing handles race)
            const insertResult = await db
                .insert(connectedAccounts)
                .values({
                userId,
                platform: 'X',
                externalAccountId: xUser.id,
                status: 'ACTIVE',
                verificationStatus: 'PENDING',
                challengeCode,
                challengeIssuedAt: now,
                connectedAt: now,
                metadataJson: metadata,
            })
                .onConflictDoNothing({
                target: [connectedAccounts.userId, connectedAccounts.platform],
            })
                .returning();
            if (insertResult.length > 0) {
                // Insert succeeded - continue to response
            }
            else {
                // Insert did nothing (conflict) - row exists but update predicate failed
                // Re-select to determine why and return appropriate response
                const [current] = await db
                    .select()
                    .from(connectedAccounts)
                    .where(and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, 'X')))
                    .limit(1);
                if (current?.verificationStatus === 'VERIFIED') {
                    const meta = current.metadataJson;
                    return reply.status(200).send({
                        platform: 'X',
                        username: meta?.resolvedUsername || normalizedUsername,
                        xUserId: current.externalAccountId,
                        verificationStatus: 'VERIFIED',
                        verifiedAt: current.verifiedAt?.toISOString(),
                    });
                }
                // Must be cooldown
                return reply.status(429).send({
                    error: 'Please wait before requesting a new challenge code.',
                    code: 'CHALLENGE_COOLDOWN',
                    retryable: true,
                    retryAfterSeconds: CHALLENGE_COOLDOWN_SECONDS,
                    ...(IS_PRODUCTION
                        ? { codeMasked: maskChallengeCode(current?.challengeCode || '') }
                        : { challengeCode: current?.challengeCode }),
                });
            }
        }
        // Always return challengeCode - our frontend IS the trusted app that displays it
        return reply.status(200).send({
            platform: 'X',
            username: xUser.username,
            xUserId: xUser.id,
            verificationStatus: 'PENDING',
            challengeCode,
            instructions: `Add code "${challengeCode}" to your X bio, then click Verify`,
            expiresInMinutes: CHALLENGE_EXPIRY_MINUTES,
        });
    });
    /**
     * POST /v1/connect/x/verify
     *
     * Verify the challenge code exists in user's X bio.
     * Case-insensitive, whitespace-normalized matching.
     */
    fastify.post('/v1/connect/x/verify', {
        preHandler: async (request, reply) => {
            console.log('[connect.ts /verify preHandler] userId:', request.userId);
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        console.log('[connect.ts /verify handler] Starting...');
        const userId = request.userId;
        const [account] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, 'X')))
            .limit(1);
        if (!account) {
            return reply.status(400).send({
                error: 'X account not connected. Call POST /v1/connect/x/start first.',
                code: 'X_NOT_CONNECTED',
            });
        }
        // Idempotent: already verified
        if (account.verificationStatus === 'VERIFIED') {
            return reply.status(200).send({
                platform: 'X',
                xUserId: account.externalAccountId,
                verificationStatus: 'VERIFIED',
                verifiedAt: account.verifiedAt?.toISOString(),
            });
        }
        if (!account.challengeCode) {
            return reply.status(400).send({
                error: 'No challenge code found. Call POST /v1/connect/x/start first.',
                code: 'NO_CHALLENGE',
            });
        }
        if (isExpired(account.challengeIssuedAt)) {
            return reply.status(400).send({
                error: 'Challenge code expired. Call POST /v1/connect/x/start to get a new code.',
                code: 'CHALLENGE_EXPIRED',
            });
        }
        const client = getXClient();
        let profile;
        try {
            profile = await client.getUserProfile(account.externalAccountId);
        }
        catch (err) {
            if (err instanceof XAdapterError) {
                const { status, body } = mapXAdapterErrorToHttp(err);
                return reply.status(status).send(body);
            }
            throw err;
        }
        if (!profile) {
            return reply.status(502).send({
                error: 'Failed to fetch X profile',
                retryable: true,
            });
        }
        const bio = profile.description || '';
        // DEBUG: Log what we're checking
        console.log('[X Verify] Expected code:', account.challengeCode);
        console.log('[X Verify] Bio text from X API:', bio);
        console.log('[X Verify] Bio contains code?', bioContainsChallenge(bio, account.challengeCode));
        if (!bioContainsChallenge(bio, account.challengeCode)) {
            return reply.status(409).send({
                error: 'CHALLENGE_NOT_FOUND_IN_BIO',
                message: 'Challenge code not found in your X bio. Please add it (case doesn\'t matter) and try again.',
                expectedCode: account.challengeCode, // Include for debugging
                bioReceived: bio.substring(0, 100), // Truncated for privacy
                retryable: false,
            });
        }
        // Verification successful - preserve existing metadata, add verifiedAt
        const now = new Date();
        const existingMetadata = account.metadataJson;
        const updatedMetadata = {
            normalizedUsername: existingMetadata?.normalizedUsername ?? '',
            resolvedUsername: existingMetadata?.resolvedUsername ?? '',
            xUserId: existingMetadata?.xUserId ?? account.externalAccountId,
            challengeIssuedAt: existingMetadata?.challengeIssuedAt,
            verifiedAt: now.toISOString(),
        };
        await db
            .update(connectedAccounts)
            .set({
            verificationStatus: 'VERIFIED',
            verifiedAt: now,
            challengeCode: null,
            challengeIssuedAt: null,
            metadataJson: updatedMetadata,
        })
            .where(eq(connectedAccounts.id, account.id));
        return reply.status(200).send({
            platform: 'X',
            xUserId: account.externalAccountId,
            verificationStatus: 'VERIFIED',
            verifiedAt: now.toISOString(),
        });
    });
    /**
     * GET /v1/connect/status
     *
     * Get connected platform status for current user
     */
    fastify.get('/v1/connect/status', {
        preHandler: async (request, reply) => {
            if (!request.userId) {
                return reply.status(401).send({ error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        const userId = request.userId;
        const accounts = await db
            .select({
            platform: connectedAccounts.platform,
            externalAccountId: connectedAccounts.externalAccountId,
            status: connectedAccounts.status,
            verificationStatus: connectedAccounts.verificationStatus,
            connectedAt: connectedAccounts.connectedAt,
            verifiedAt: connectedAccounts.verifiedAt,
        })
            .from(connectedAccounts)
            .where(eq(connectedAccounts.userId, userId));
        return reply.status(200).send({
            platforms: accounts.map(a => ({
                platform: a.platform,
                externalAccountId: a.externalAccountId,
                status: a.status,
                verificationStatus: a.verificationStatus,
                connectedAt: a.connectedAt?.toISOString(),
                verifiedAt: a.verifiedAt?.toISOString(),
            })),
        });
    });
}
export default connectRoutes;
//# sourceMappingURL=connect.js.map
/**
 * Platform Connection Routes - V2 with Proof-of-Control (Production-Hardened)
 *
 * Two-step challenge flow for X:
 * 1. POST /v1/connect/x/start - Generate challenge code
 * 2. POST /v1/connect/x/verify - Verify challenge in bio
 *
 * SECURITY:
 * - 60-second cooldown between /start calls (atomic check)
 * - 60-second cooldown between /verify calls (atomic check, prevents rate limit exhaustion)
 * - Case-insensitive bio matching
 *
 * NOTE: challengeCode IS returned to frontend (first-party app needs to display it)
 *
 * STATUS SEMANTICS:
 * - status: 'ACTIVE' = account row exists and is usable
 * - verificationStatus: 'PENDING' = awaiting bio verification
 * - verificationStatus: 'VERIFIED' = proof-of-control completed
 */
import { db } from '../db/client.js';
import { connectedAccounts } from '../db/schema.js';
import { getXClient, XAdapterError } from '../adapters/x.js';
import { eq, and, sql, or, isNull } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { checkGlobalRateLimit } from '../services/x-rate-limit-circuit.js';
// =============================================================================
// CONSTANTS
// =============================================================================
const CHALLENGE_CODE_LENGTH = 8;
const CHALLENGE_EXPIRY_MINUTES = 30;
const CHALLENGE_COOLDOWN_SECONDS = 60; // Cooldown between /start requests
const VERIFY_COOLDOWN_SECONDS = 60; // Cooldown between /verify requests (was 15 min, reduced for UX)
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// =============================================================================
// HTTP STATUS MAPPING FOR XAdapterError
// =============================================================================
function mapXAdapterErrorToHttp(error) {
    switch (error.category) {
        case 'RATE_LIMIT': {
            // Use typed resetAt from XAdapterError
            const resetAt = error.resetAt ?? null;
            const nowSec = Math.floor(Date.now() / 1000);
            const retryAfterSeconds = resetAt ? Math.max(1, resetAt - nowSec) : 60;
            return {
                status: 429,
                body: {
                    error: error.message,
                    code: error.code || 'X_API_RATE_LIMITED',
                    retryable: true,
                    resetAt,
                    retryAfterSeconds,
                }
            };
        }
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
        // NOTE: VERIFIED check moved to AFTER X API resolution to compare xUser.id
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
        // =========================================================
        // GLOBAL CIRCUIT BREAKER - Block if X API is rate limited
        // =========================================================
        const circuitState = checkGlobalRateLimit();
        if (circuitState) {
            console.log(`[X Start] CIRCUIT OPEN - Blocked for ${circuitState.retryAfterSeconds}s`);
            return reply.status(429).send({
                code: 'X_GLOBAL_RATE_LIMIT',
                error: 'X API is temporarily unavailable. Please try again later.',
                retryable: true,
                resetAt: circuitState.resetAt,
                retryAfterSeconds: circuitState.retryAfterSeconds,
            });
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
        // =========================================================
        // USER ALREADY HAS X CHECK - Does THIS user already have a verified X account?
        // =========================================================
        if (existingAccount?.verificationStatus === 'VERIFIED') {
            // User already has a verified X account
            if (existingAccount.externalAccountId === xUser.id) {
                // Same X account - return success (idempotent)
                const metadata = existingAccount.metadataJson;
                return reply.status(200).send({
                    platform: 'X',
                    alreadyVerified: true,
                    username: metadata?.resolvedUsername || xUser.username,
                    xUserId: xUser.id,
                    verificationStatus: 'VERIFIED',
                    verifiedAt: existingAccount.verifiedAt?.toISOString(),
                });
            }
            else {
                // DIFFERENT X account - BLOCK (one user can only have one X)
                const metadata = existingAccount.metadataJson;
                console.log(`[X Verify] BLOCKED: User ${userId} already has verified X: ${existingAccount.externalAccountId}, tried to verify ${xUser.id}`);
                return reply.status(409).send({
                    code: 'USER_ALREADY_HAS_X',
                    error: 'This account already has a verified X profile.',
                    existingUsername: metadata?.resolvedUsername,
                    existingXUserId: existingAccount.externalAccountId,
                });
            }
        }
        // =========================================================
        // GLOBAL UNIQUENESS CHECK - Is this X account already verified by ANYONE?
        // =========================================================
        const [globallyVerified] = await db
            .select({
            userId: connectedAccounts.userId,
        })
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.platform, 'X'), eq(connectedAccounts.externalAccountId, xUser.id), sql `${connectedAccounts.verificationStatus} = 'VERIFIED'`))
            .limit(1);
        // If another user has verified this X account, block
        if (globallyVerified && globallyVerified.userId !== userId) {
            console.log(`[X Verify] BLOCKED: @${xUser.username} (${xUser.id}) already verified by user ${globallyVerified.userId}`);
            return reply.status(409).send({
                code: 'X_ALREADY_VERIFIED_GLOBAL',
                error: 'This X username is already verified by another account.',
                username: xUser.username,
                xUserId: xUser.id,
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
        // =========================================================
        // GLOBAL UNIQUENESS CHECK - Ensure no one else verified this X account
        // =========================================================
        const [globallyVerified] = await db
            .select({ userId: connectedAccounts.userId })
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.platform, 'X'), eq(connectedAccounts.externalAccountId, account.externalAccountId), sql `${connectedAccounts.verificationStatus} = 'VERIFIED'`))
            .limit(1);
        if (globallyVerified && globallyVerified.userId !== userId) {
            console.log(`[X Verify] BLOCKED: xUserId ${account.externalAccountId} already verified by user ${globallyVerified.userId}`);
            return reply.status(409).send({
                code: 'X_ALREADY_VERIFIED_GLOBAL',
                error: 'This X username is already verified by another account.',
                retryable: false,
            });
        }
        // ===========================================================
        // ATOMIC VERIFY COOLDOWN - Single UPDATE with WHERE guard
        // Prevents race condition where concurrent requests both pass cooldown
        // ===========================================================
        const now = new Date();
        const nowIso = now.toISOString();
        const cooldownThreshold = new Date(now.getTime() - VERIFY_COOLDOWN_SECONDS * 1000);
        // Attempt atomic update: only succeeds if cooldown has passed
        // This query updates lastVerifyAttemptAt ONLY if enough time has passed
        // Using timestamptz for timezone-safe comparison
        const updateResult = await db
            .update(connectedAccounts)
            .set({
            metadataJson: sql `
                        COALESCE(${connectedAccounts.metadataJson}, '{}'::jsonb) || 
                        jsonb_build_object('lastVerifyAttemptAt', ${nowIso}::text)
                    `,
        })
            .where(and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, 'X'), 
        // Only update if cooldown has passed (atomic guard)
        // Using timestamptz for timezone-safe comparison
        or(sql `${connectedAccounts.metadataJson}->>'lastVerifyAttemptAt' IS NULL`, sql `(${connectedAccounts.metadataJson}->>'lastVerifyAttemptAt')::timestamptz < ${cooldownThreshold.toISOString()}::timestamptz`)))
            .returning({ id: connectedAccounts.id });
        // If no rows updated, cooldown is still active
        if (updateResult.length === 0) {
            // Re-select to get accurate remaining time (handles concurrent update race)
            const [freshAccount] = await db
                .select({ metadataJson: connectedAccounts.metadataJson })
                .from(connectedAccounts)
                .where(and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, 'X')))
                .limit(1);
            const freshMetadata = freshAccount?.metadataJson;
            const lastAttempt = freshMetadata?.lastVerifyAttemptAt
                ? new Date(freshMetadata.lastVerifyAttemptAt).getTime()
                : Date.now(); // Fallback to now if somehow missing
            const cooldownEnd = lastAttempt + VERIFY_COOLDOWN_SECONDS * 1000;
            const remaining = Math.max(1, Math.ceil((cooldownEnd - Date.now()) / 1000));
            const resetAt = Math.ceil(cooldownEnd / 1000);
            console.log(`[X Verify] ATOMIC COOLDOWN: Blocked user ${userId}. ${remaining}s remaining.`);
            return reply.status(429).send({
                code: 'X_VERIFY_COOLDOWN',
                error: 'Please wait before trying again.',
                retryable: true,
                retryAfterSeconds: remaining,
                resetAt,
            });
        }
        console.log(`[X Verify] ATOMIC COOLDOWN: Granted user ${userId} at ${nowIso}`);
        // =========================================================
        // GLOBAL CIRCUIT BREAKER - Block if X API is rate limited
        // =========================================================
        const circuitState = checkGlobalRateLimit();
        if (circuitState) {
            console.log(`[X Verify] CIRCUIT OPEN - Blocked for ${circuitState.retryAfterSeconds}s`);
            return reply.status(429).send({
                code: 'X_GLOBAL_RATE_LIMIT',
                error: 'X API is temporarily unavailable. Please try again later.',
                retryable: true,
                resetAt: circuitState.resetAt,
                retryAfterSeconds: circuitState.retryAfterSeconds,
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
                code: 'CHALLENGE_NOT_FOUND_IN_BIO',
                error: 'Challenge code not found in your X bio. Please add it and try again.',
                retryable: false,
                // Debug fields only in dev (don't leak in production)
                ...(IS_PRODUCTION ? {} : {
                    expectedCode: account.challengeCode,
                    bioReceived: bio.substring(0, 100),
                }),
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
        // Wrap in try-catch to handle unique constraint violation (race condition protection)
        try {
            // Conditional update: only set VERIFIED if still PENDING (state machine guard)
            const updateResult = await db
                .update(connectedAccounts)
                .set({
                verificationStatus: 'VERIFIED',
                verifiedAt: now,
                challengeCode: null,
                challengeIssuedAt: null,
                metadataJson: updatedMetadata,
            })
                .where(and(eq(connectedAccounts.id, account.id), sql `${connectedAccounts.verificationStatus} = 'PENDING'`))
                .returning({ id: connectedAccounts.id });
            // If no rows updated, state changed - check if already VERIFIED (idempotent)
            if (updateResult.length === 0) {
                console.log(`[X Verify] State changed: account ${account.id} no longer PENDING`);
                // Re-fetch to check current state
                const [currentState] = await db
                    .select({
                    verificationStatus: connectedAccounts.verificationStatus,
                    verifiedAt: connectedAccounts.verifiedAt,
                })
                    .from(connectedAccounts)
                    .where(eq(connectedAccounts.id, account.id))
                    .limit(1);
                // If already VERIFIED, return success (idempotent / retry-safe)
                if (currentState?.verificationStatus === 'VERIFIED') {
                    return reply.status(200).send({
                        platform: 'X',
                        alreadyVerified: true,
                        xUserId: account.externalAccountId,
                        verificationStatus: 'VERIFIED',
                        verifiedAt: currentState.verifiedAt?.toISOString(),
                    });
                }
                // Otherwise, state truly changed (challenge reset, etc)
                return reply.status(409).send({
                    code: 'STATE_CHANGED',
                    error: 'Verification state changed. Please restart verification.',
                    retryable: true,
                });
            }
        }
        catch (err) {
            // Check for unique constraint violation - only our specific index
            const isUnique = err?.code === '23505';
            const isThisIndex = err?.constraint === 'ux_connected_accounts_x_verified' ||
                String(err?.detail || '').includes('ux_connected_accounts_x_verified') ||
                String(err?.message || '').includes('ux_connected_accounts_x_verified');
            if (isUnique && isThisIndex) {
                console.log(`[X Verify] RACE BLOCKED: Unique constraint violation for xUserId ${account.externalAccountId}`);
                return reply.status(409).send({
                    code: 'X_ALREADY_VERIFIED_GLOBAL',
                    error: 'This X username was just verified by another account.',
                    retryable: false,
                });
            }
            throw err;
        }
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
            metadataJson: connectedAccounts.metadataJson,
        })
            .from(connectedAccounts)
            .where(eq(connectedAccounts.userId, userId));
        return reply.status(200).send({
            platforms: accounts.map(a => {
                // Extract safe subset of metadata
                const meta = a.metadataJson;
                return {
                    platform: a.platform,
                    externalAccountId: a.externalAccountId,
                    status: a.status,
                    verificationStatus: a.verificationStatus,
                    connectedAt: a.connectedAt?.toISOString(),
                    verifiedAt: a.verifiedAt?.toISOString(),
                    metadata: meta ? {
                        resolvedUsername: meta.resolvedUsername,
                    } : null,
                };
            }),
        });
    });
}
export default connectRoutes;
//# sourceMappingURL=connect.js.map
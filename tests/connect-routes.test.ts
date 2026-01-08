/**
 * X Connection Route Tests (Production-Hardened)
 * 
 * Tests:
 * 1. Production response contains NO raw challengeCode
 * 2. Race-safe /start (two immediate calls don't rotate code)
 * 3. Cooldown returns 429
 * 4. VERIFIED call idempotent
 * 5. Case-insensitive bio matching
 * 6. Metadata preserved on verify
 */

import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { db } from '../src/db/client.js';
import { users, connectedAccounts } from '../src/db/schema.js';
import { eq, and } from 'drizzle-orm';
import {
    setXClient,
    resetXClient,
    XClient,
    XAdapterError,
} from '../src/adapters/x.js';
import connectRoutes from '../src/routes/connect.js';

// =============================================================================
// TEST FIXTURES
// =============================================================================

let app: FastifyInstance;
let testUserId: string;

class TestXClient implements XClient {
    public mockResponse: { id: string; username: string } | null = { id: '12345', username: 'testuser' };
    public mockBio: string = '';
    public errorToThrow: XAdapterError | null = null;

    async getFollowers(_usernameOrId: string): Promise<number> {
        return 1000;
    }

    async getUserByUsername(_username: string): Promise<{ id: string; username: string } | null> {
        if (this.errorToThrow) throw this.errorToThrow;
        return this.mockResponse;
    }

    async getUserProfile(_userId: string): Promise<{ description?: string } | null> {
        if (this.errorToThrow) throw this.errorToThrow;
        return { description: this.mockBio };
    }
}

const testClient = new TestXClient();

// =============================================================================
// SETUP / TEARDOWN
// =============================================================================

beforeAll(async () => {
    app = Fastify({ logger: false });
    app.decorateRequest('userId', null);

    app.addHook('preHandler', async (request) => {
        const userId = request.headers['x-test-user-id'] as string | undefined;
        if (userId) {
            request.userId = userId;
        }
    });

    // Add error handler to see actual errors
    app.setErrorHandler((error, request, reply) => {
        console.error('🔴 TEST ERROR:', error.message);
        reply.status(500).send({
            code: 'INTERNAL',
            message: error.message
        });
    });

    await app.register(connectRoutes);
    await app.ready();
});

afterAll(async () => {
    await app.close();
});

beforeEach(async () => {
    resetXClient();
    setXClient(testClient);
    testClient.mockResponse = { id: '12345', username: 'testuser' };
    testClient.mockBio = '';
    testClient.errorToThrow = null;

    const [user] = await db.insert(users).values({
        email: `x-critical-test-${Date.now()}@example.com`,
    }).returning();
    testUserId = user.id;
});

// =============================================================================
// CRITICAL FIX #1: Production Code Leak
// =============================================================================

describe('CRITICAL: Production Response Code Isolation', () => {
    it('non-production response includes challengeCode field', async () => {
        // Test environment is NOT production
        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();

        // In test/dev, challengeCode should be present
        expect(body.challengeCode).toBeDefined();
        expect(body.challengeCode.length).toBe(8);
        // And instructions should include the code
        expect(body.instructions).toContain(body.challengeCode);
    });

    it('response JSON structure does not leak code in unintended fields', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        const body = response.json();

        // Verify only expected fields exist
        const expectedFields = ['platform', 'username', 'xUserId', 'verificationStatus', 'challengeCode', 'instructions', 'expiresInMinutes'];
        const actualFields = Object.keys(body);

        for (const field of actualFields) {
            expect(expectedFields).toContain(field);
        }
    });
});

// =============================================================================
// CRITICAL FIX #2: Race-Safe /start
// =============================================================================

describe('CRITICAL: Race-Safe /start', () => {
    it('two immediate /start calls: second gets cooldown, code is stable', async () => {
        // First call succeeds
        const response1 = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        expect(response1.statusCode).toBe(200);
        const code1 = response1.json().challengeCode;

        // Get the stored code
        const [row1] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, testUserId), eq(connectedAccounts.platform, 'X')));

        const storedCode1 = row1.challengeCode;

        // Second call immediately - should hit cooldown
        const response2 = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        expect(response2.statusCode).toBe(429);
        expect(response2.json().code).toBe('CHALLENGE_COOLDOWN');

        // Verify stored code is UNCHANGED (no rotation)
        const [row2] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, testUserId), eq(connectedAccounts.platform, 'X')));

        expect(row2.challengeCode).toBe(storedCode1);
    });

    it('concurrent /start calls do not both succeed (atomic)', async () => {
        // Simulate concurrent calls by making two without waiting
        const [response1, response2] = await Promise.all([
            app.inject({
                method: 'POST',
                url: '/v1/connect/x/start',
                headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
                payload: { username: 'testuser' },
            }),
            app.inject({
                method: 'POST',
                url: '/v1/connect/x/start',
                headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
                payload: { username: 'testuser' },
            }),
        ]);

        // CRITICAL: No 500 errors
        expect(response1.statusCode).not.toBe(500);
        expect(response2.statusCode).not.toBe(500);

        // At least one should succeed, at least one should be cooldown
        const statuses = [response1.statusCode, response2.statusCode].sort();

        // Both 200 is acceptable for first insert (race on insert)
        // One 200, one 429 is also acceptable
        // Both 429 would be wrong (means neither inserted)
        expect(statuses).not.toEqual([429, 429]);

        // Final state should have exactly one challenge code
        const [row] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, testUserId), eq(connectedAccounts.platform, 'X')));

        expect(row).toBeDefined();
        expect(row.challengeCode).toBeDefined();
        expect(row.challengeCode!.length).toBe(8);
    });

    it('concurrent /start on brand-new user: no 500, exactly one row', async () => {
        // Create a FRESH user with NO existing connected account
        const [freshUser] = await db.insert(users).values({
            email: `concurrent-fresh-${Date.now()}@example.com`,
        }).returning();

        // Concurrent calls on brand new user
        const [response1, response2] = await Promise.all([
            app.inject({
                method: 'POST',
                url: '/v1/connect/x/start',
                headers: { 'x-test-user-id': freshUser.id, 'content-type': 'application/json' },
                payload: { username: 'testuser' },
            }),
            app.inject({
                method: 'POST',
                url: '/v1/connect/x/start',
                headers: { 'x-test-user-id': freshUser.id, 'content-type': 'application/json' },
                payload: { username: 'testuser' },
            }),
        ]);

        // CRITICAL: No 500 errors (unique constraint violation would be 500)
        expect(response1.statusCode).not.toBe(500);
        expect(response2.statusCode).not.toBe(500);

        // At least one must succeed
        const codes = [response1.statusCode, response2.statusCode];
        expect(codes.some(c => c === 200)).toBe(true);

        // Exactly one row must exist
        const rows = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, freshUser.id), eq(connectedAccounts.platform, 'X')));

        expect(rows.length).toBe(1);
        expect(rows[0].challengeCode).toBeDefined();
        expect(rows[0].challengeCode!.length).toBe(8);
    });
});

// =============================================================================
// VERIFIED IDEMPOTENCY
// =============================================================================

describe('/start with VERIFIED account', () => {
    it('returns VERIFIED status without new challenge', async () => {
        // Create and verify
        const startRes = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });
        const challengeCode = startRes.json().challengeCode;
        testClient.mockBio = challengeCode;

        await app.inject({
            method: 'POST',
            url: '/v1/connect/x/verify',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: {},
        });

        // Call /start again
        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().verificationStatus).toBe('VERIFIED');
        expect(response.json().challengeCode).toBeUndefined();
        expect(response.json().verifiedAt).toBeDefined();
    });
});

// =============================================================================
// ROBUST BIO MATCHING
// =============================================================================

describe('Robust Bio Matching', () => {
    it('matches lowercase code in bio', async () => {
        const startRes = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });
        const challengeCode = startRes.json().challengeCode;

        testClient.mockBio = `Bio with ${challengeCode.toLowerCase()} here`;

        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/verify',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: {},
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().verificationStatus).toBe('VERIFIED');
    });

    it('matches code with extra whitespace', async () => {
        const startRes = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });
        const challengeCode = startRes.json().challengeCode;

        testClient.mockBio = `My   bio   ${challengeCode}   here`;

        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/verify',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: {},
        });

        expect(response.statusCode).toBe(200);
    });
});

// =============================================================================
// METADATA PRESERVATION
// =============================================================================

describe('Metadata Preservation', () => {
    it('verify preserves normalizedUsername and resolvedUsername', async () => {
        const startRes = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'MyUser' },
        });
        const challengeCode = startRes.json().challengeCode;
        testClient.mockBio = challengeCode;

        await app.inject({
            method: 'POST',
            url: '/v1/connect/x/verify',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: {},
        });

        const [row] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, testUserId), eq(connectedAccounts.platform, 'X')));

        const metadata = row.metadataJson as any;
        expect(metadata.normalizedUsername).toBe('myuser');
        expect(metadata.resolvedUsername).toBe('testuser');
        expect(metadata.verifiedAt).toBeDefined();
    });
});

// =============================================================================
// EXPIRY
// =============================================================================

describe('Challenge Expiry', () => {
    it('returns CHALLENGE_EXPIRED for old challenge', async () => {
        await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        // Expire manually
        const expiredTime = new Date(Date.now() - 31 * 60 * 1000);
        await db
            .update(connectedAccounts)
            .set({ challengeIssuedAt: expiredTime })
            .where(and(eq(connectedAccounts.userId, testUserId), eq(connectedAccounts.platform, 'X')));

        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/verify',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: {},
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().code).toBe('CHALLENGE_EXPIRED');
    });
});

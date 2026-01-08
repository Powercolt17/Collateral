/**
 * Production Environment Tests - Challenge Code Isolation
 * 
 * These tests verify that in production mode (NODE_ENV=production),
 * the raw challenge code is NEVER exposed in API responses.
 * 
 * Uses dynamic import to ensure IS_PRODUCTION is computed correctly.
 */

import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { db } from '../src/db/client.js';
import { users, connectedAccounts } from '../src/db/schema.js';
import { eq, and } from 'drizzle-orm';
// NOTE: Do NOT import setXClient/resetXClient statically - see dynamic import below

// =============================================================================
// TEST X CLIENT
// =============================================================================

interface XClient {
    getFollowers(usernameOrId: string): Promise<number>;
    getUserByUsername(username: string): Promise<{ id: string; username: string } | null>;
    getUserProfile(userId: string): Promise<{ description?: string } | null>;
    getUserWithHealth(userId: string): Promise<any>;
}

class TestXClient implements XClient {
    public mockBio: string = '';

    async getFollowers(_usernameOrId: string): Promise<number> {
        return 1000;
    }

    async getUserByUsername(_username: string): Promise<{ id: string; username: string } | null> {
        return { id: '12345', username: 'testuser' };
    }

    async getUserProfile(_userId: string): Promise<{ description?: string } | null> {
        return { description: this.mockBio };
    }

    async getUserWithHealth(_userId: string) {
        return {
            followersCount: 15000,
            accountAgeDays: 200,
            isProtected: false,
            tweetCount: 1000,
        };
    }
}

// =============================================================================
// PRODUCTION MODE TESTS
// =============================================================================

describe('Production Mode - Challenge Code Isolation', () => {
    let app: FastifyInstance;
    let testUserId: string;
    let testClient: TestXClient;
    let originalNodeEnv: string | undefined;

    // Dynamically imported functions - must be same module instance as connect routes
    let setXClient: (client: XClient) => void;
    let resetXClient: () => void;

    beforeAll(async () => {
        // Save original NODE_ENV
        originalNodeEnv = process.env.NODE_ENV;

        // Set production mode BEFORE importing the module
        process.env.NODE_ENV = 'production';

        // Reset module cache to force re-evaluation of IS_PRODUCTION
        vi.resetModules();

        // Dynamically import BOTH connect routes AND X adapter after reset
        // This ensures they share the same module instance
        const xAdapterModule = await import('../src/adapters/x.js');
        setXClient = xAdapterModule.setXClient;
        resetXClient = xAdapterModule.resetXClient;

        const connectRoutesModule = await import('../src/routes/connect.js');
        const connectRoutes = connectRoutesModule.default;

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
            console.error('🔴 TEST ERROR:', error.message, error.stack);
            reply.status(500).send({
                code: 'INTERNAL',
                message: error.message,
                stack: error.stack
            });
        });

        await app.register(connectRoutes);
        await app.ready();

        testClient = new TestXClient();
    });

    afterAll(async () => {
        // Restore original NODE_ENV
        process.env.NODE_ENV = originalNodeEnv;
        vi.resetModules();
        await app.close();
    });

    beforeEach(async () => {
        resetXClient();
        setXClient(testClient);
        testClient.mockBio = '';

        const [user] = await db.insert(users).values({
            email: `prod-test-${Date.now()}@example.com`,
        }).returning();
        testUserId = user.id;
    });

    it('response has codeMasked field', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();

        expect(body.codeMasked).toBeDefined();
        expect(body.codeMasked).toMatch(/^[A-Z0-9]{4}••••$/);
    });

    it('response has NO challengeCode field', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();

        // CRITICAL: No challengeCode field in production
        expect(body.challengeCode).toBeUndefined();
    });

    it('instructions do NOT contain raw 8-char code', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();

        // Get the actual code from DB to verify it's not in instructions
        const [row] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, testUserId), eq(connectedAccounts.platform, 'X')));

        const actualCode = row.challengeCode!;
        expect(actualCode.length).toBe(8);

        // CRITICAL: Instructions must NOT contain the raw code
        expect(body.instructions).toBeDefined();
        expect(body.instructions).not.toContain(actualCode);

        // Should be generic
        expect(body.instructions).toContain('verification code shown in the app');
    });

    it('verify still works without code in response (reads from DB)', async () => {
        // Start
        await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        // Get actual code from DB
        const [row] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, testUserId), eq(connectedAccounts.platform, 'X')));

        const actualCode = row.challengeCode!;

        // Set bio with actual code
        testClient.mockBio = actualCode;

        // Verify should work
        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/verify',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: {},
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().verificationStatus).toBe('VERIFIED');
    });

    it('full response JSON contains no 8-char uppercase codes', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        const body = response.json();
        const responseText = JSON.stringify(body);

        // Get actual code from DB
        const [row] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, testUserId), eq(connectedAccounts.platform, 'X')));

        const actualCode = row.challengeCode!;

        // The actual code should NOT appear anywhere in the response
        expect(responseText).not.toContain(actualCode);
    });

    it('cooldown response in production has codeMasked, not challengeCode', async () => {
        // First call
        await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        // Second call triggers cooldown
        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        expect(response.statusCode).toBe(429);
        const body = response.json();

        // CRITICAL: Production cooldown should have codeMasked, NOT challengeCode
        expect(body.code).toBe('CHALLENGE_COOLDOWN');
        expect(body.codeMasked).toBeDefined();
        expect(body.codeMasked).toMatch(/^[A-Z0-9]{4}••••$/);
        expect(body.challengeCode).toBeUndefined();

        // Verify the raw code is not in the response
        const [row] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, testUserId), eq(connectedAccounts.platform, 'X')));

        const actualCode = row.challengeCode!;
        expect(JSON.stringify(body)).not.toContain(actualCode);
    });

    it('verify endpoint never returns code fields', async () => {
        // Start
        await app.inject({
            method: 'POST',
            url: '/v1/connect/x/start',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: { username: 'testuser' },
        });

        // Get actual code from DB and set bio
        const [row] = await db
            .select()
            .from(connectedAccounts)
            .where(and(eq(connectedAccounts.userId, testUserId), eq(connectedAccounts.platform, 'X')));

        testClient.mockBio = row.challengeCode!;

        // Verify
        const response = await app.inject({
            method: 'POST',
            url: '/v1/connect/x/verify',
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: {},
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();

        // CRITICAL: verify response should never have code fields
        expect(body.challengeCode).toBeUndefined();
        expect(body.codeMasked).toBeUndefined();
        expect(body.verificationStatus).toBe('VERIFIED');
    });
});

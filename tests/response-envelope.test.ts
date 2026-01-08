/**
 * Response Envelope Tests
 * 
 * Verifies consistent API response shapes for frontend wiring:
 * - Success: { ok: true, contractId?, eventType?, derivedState?, message? }
 * - Error: { ok: false, code, error, retryable?, retryAfterSeconds? }
 */

import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { db } from '../src/db/client.js';
import { users, contracts, identities } from '../src/db/schema.js';
import { appendEvent, getEventsForContract } from '../src/services/ledger.js';
import { EventType, ContractStatus, connectedAccounts } from '../src/db/schema.js';
import { setXClient, MockXClient, resetXClient } from '../src/adapters/x.js';
import contractWriteRoutes from '../src/routes/contracts-write.js';
import contractReadRoutes from '../src/routes/contracts-read.js';

// =============================================================================
// SETUP
// =============================================================================

let app: FastifyInstance;
let testUserId: string;
let testIdentityUsername: string;
let testContractId: string;

beforeAll(async () => {
    app = Fastify({ logger: false });
    app.decorateRequest('userId', null);

    app.addHook('preHandler', async (request) => {
        const userId = request.headers['x-test-user-id'] as string | undefined;
        if (userId) {
            request.userId = userId;
            // Also set principalUserId for auth guards
            request.principalUserId = userId;
        }
    });

    // Error handler must be set BEFORE routes for it to catch their errors
    app.setErrorHandler((error, request, reply) => {
        const statusCode = error.statusCode || 500;
        let code = error.code || 'INTERNAL_SERVER_ERROR';
        if (statusCode === 400) code = code || 'BAD_REQUEST';
        if (statusCode === 401) code = code || 'UNAUTHORIZED';
        reply.status(statusCode).send({
            ok: false,
            code,
            error: error.message || 'Unknown error',
        });
    });

    await app.register(contractWriteRoutes);
    await app.register(contractReadRoutes);

    await app.ready();

    // Set valid X mock (15k followers > 10k min)
    setXClient(new MockXClient(15000));
});

afterAll(async () => {
    resetXClient();
    await app.close();
});

beforeEach(async () => {
    // Create test user
    const [user] = await db.insert(users).values({
        email: `envelope-test-${Date.now()}@example.com`,
    }).returning();
    testUserId = user.id;

    // Create identity
    const [identity] = await db.insert(identities).values({
        userId: testUserId,
        username: `envuser${Date.now()}`.slice(0, 20),
    }).returning();
    testIdentityUsername = identity.username;

    // Connect X account
    await db.insert(connectedAccounts).values({
        userId: testUserId,
        platform: 'X',
        externalAccountId: '123456789',
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        connectedAt: new Date(),
        metadataJson: { username: 'testuser' },
    });
});

// =============================================================================
// CONTRACT CREATE ENVELOPE
// =============================================================================

describe('POST /v1/contracts - Envelope', () => {
    it('returns ok:true with contractId and eventType on success', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/v1/contracts',
            headers: {
                'x-test-user-id': testUserId,
                'content-type': 'application/json',
            },
            payload: {
                platform: 'X',
                metricType: 'FOLLOWERS',
                condition: {
                    operator: 'GTE',
                    threshold: 5000,
                    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                },
                lockAmountUsdCents: 5000,
                payoutAmountUsdCents: 6500,
            },
        });

        if (response.statusCode !== 200) {
            throw new Error(`DEBUG: POST /v1/contracts failed: ${response.statusCode} ${JSON.stringify(response.json())}`);
        }
        expect(response.statusCode).toBe(200);
        const body = response.json();

        // Standard envelope fields
        expect(body.ok).toBe(true);
        expect(body.contractId).toBeDefined();
        expect(body.eventType).toBe('CONTRACT_CREATED');
        expect(body.derivedState).toBe(ContractStatus.CREATED);
        expect(body.message).toBeDefined();

        // Still includes contract details
        expect(body.contract).toBeDefined();
        expect(body.contract.id).toBe(body.contractId);

        testContractId = body.contractId;
    });

    it('returns ok:false with code on auth error', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/v1/contracts',
            headers: { 'content-type': 'application/json' },
            payload: {
                platform: 'X',
                metricType: 'FOLLOWERS',
                condition: { operator: 'GTE', threshold: 5000, deadline: new Date().toISOString() },
                lockAmountUsdCents: 5000,
                payoutAmountUsdCents: 6500,
            },
        });

        expect(response.statusCode).toBe(401);
        const body = response.json();

        expect(body.ok).toBe(false);
        expect(body.code).toBeDefined();
        expect(body.error).toBeDefined();
    });
});

// =============================================================================
// EXECUTE ENVELOPE
// =============================================================================

describe('POST /v1/contracts/:id/execute - Envelope', () => {
    beforeEach(async () => {
        // Create contract with FUNDS_LOCKED state
        const [contract] = await db.insert(contracts).values({
            principalUserId: testUserId,
            principalIdentityUsername: testIdentityUsername,
            platform: 'X',
            metricType: 'FOLLOWERS',
            conditionJson: { operator: '>=', threshold: 20000 },
            deadlineUtc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            lockAmountUsdCents: 5000,
            payoutAmountUsdCents: 6500,
        }).returning();
        testContractId = contract.id;

        // Setup events to reach FUNDS_LOCKED state
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.CONTRACT_CREATED,
            metadata: {},
        });
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: `pi_${Date.now()}_${Math.random()}`,
            metadata: {},
        });
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_LOCKED,
            externalRef: `pi_${Date.now()}_${Math.random()}`,
            amountUsdCents: 5000,
            metadata: {},
        });
    });

    it('returns ok:true with eventType and derivedState on success', async () => {
        const response = await app.inject({
            method: 'POST',
            url: `/v1/contracts/${testContractId}/execute`,
            headers: {
                'x-test-user-id': testUserId,
                'content-type': 'application/json',
            },
            payload: {},
        });

        if (response.statusCode !== 200) {
            throw new Error(`DEBUG: EXECUTE failed: ${response.statusCode} ${JSON.stringify(response.json())}`);
        }
        expect(response.statusCode).toBe(200);
        const body = response.json();

        expect(body.ok).toBe(true);
        expect(body.contractId).toBe(testContractId);
        expect(body.eventType).toBe('EXECUTION_CONFIRMED');
        expect(body.derivedState).toBe(ContractStatus.LOCKED);
        expect(body.message).toBeDefined();
    });

    it('idempotent execute returns same envelope structure', async () => {
        // First execute
        await app.inject({
            method: 'POST',
            url: `/v1/contracts/${testContractId}/execute`,
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: {},
        });

        // Second execute (idempotent)
        const response = await app.inject({
            method: 'POST',
            url: `/v1/contracts/${testContractId}/execute`,
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: {},
        });

        if (response.statusCode !== 200) {
            throw new Error(`DEBUG: IDEMPOTENT EXECUTE failed: ${response.statusCode} ${JSON.stringify(response.json())}`);
        }
        expect(response.statusCode).toBe(200);
        const body = response.json();

        // Same envelope structure
        expect(body.ok).toBe(true);
        expect(body.contractId).toBe(testContractId);
        expect(body.eventType).toBe('EXECUTION_CONFIRMED');
        expect(body.derivedState).toBe(ContractStatus.LOCKED);
        expect(body.message).toContain('already');
    });

    it('returns ok:false with code when FUNDS_NOT_LOCKED', async () => {
        // Create new contract without FUNDS_LOCKED
        const [newContract] = await db.insert(contracts).values({
            principalUserId: testUserId,
            principalIdentityUsername: testIdentityUsername,
            platform: 'X',
            metricType: 'FOLLOWERS',
            conditionJson: { operator: '>=', threshold: 5000 },
            deadlineUtc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            lockAmountUsdCents: 5000,
            payoutAmountUsdCents: 6500,
        }).returning();

        await appendEvent({
            contractId: newContract.id,
            actor: 'SYSTEM',
            eventType: EventType.CONTRACT_CREATED,
            metadata: {},
        });

        const response = await app.inject({
            method: 'POST',
            url: `/v1/contracts/${newContract.id}/execute`,
            headers: { 'x-test-user-id': testUserId, 'content-type': 'application/json' },
            payload: {},
        });

        expect(response.statusCode).toBe(409);
        const body = response.json();

        expect(body.ok).toBe(false);
        expect(body.code).toBe('FUNDS_NOT_LOCKED');
        expect(body.error).toBeDefined();
    });
});

// =============================================================================
// READ ENDPOINTS (should NOT have ok envelope, confirm)
// =============================================================================

describe('GET endpoints - No ok envelope (read-only)', () => {
    beforeEach(async () => {
        const [contract] = await db.insert(contracts).values({
            principalUserId: testUserId,
            principalIdentityUsername: testIdentityUsername,
            platform: 'X',
            metricType: 'FOLLOWERS',
            conditionJson: { operator: '>=', threshold: 5000 },
            deadlineUtc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            lockAmountUsdCents: 5000,
            payoutAmountUsdCents: 6500,
        }).returning();
        testContractId = contract.id;

        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.CONTRACT_CREATED,
            metadata: {},
        });
    });

    it('GET /v1/contracts returns contracts array without ok', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/v1/contracts',
            headers: { 'x-test-user-id': testUserId },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();

        // Read endpoints don't use ok envelope
        expect(body.ok).toBeUndefined();
        expect(body.contracts).toBeDefined();
    });

    it('GET /v1/contracts/:id returns contract without ok', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${testContractId}`,
            headers: { 'x-test-user-id': testUserId },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();

        // Read endpoints don't use ok envelope
        expect(body.ok).toBeUndefined();
        expect(body.contract).toBeDefined();
        expect(body.events).toBeDefined();
    });
});

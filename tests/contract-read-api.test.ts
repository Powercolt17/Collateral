/**
 * Contract Read API Tests
 * 
 * Tests:
 * 1. List endpoint returns only caller's contracts
 * 2. Detail endpoint 403 when accessing another user's contract
 * 3. derivedState matches deriveState(events) for various states
 * 4. Events timeline is ordered and contains expected types
 * 5. Metadata is sanitized (no sensitive fields)
 */

import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { randomUUID } from 'crypto';
import Fastify, { FastifyInstance } from 'fastify';
import { db } from '../src/db/client.js';
import { users, contracts, identities } from '../src/db/schema.js';
import { appendEvent, getEventsForContract } from '../src/services/ledger.js';
import { deriveState } from '../src/services/state-derivation.js';
import { EventType, ContractStatus } from '../src/db/schema.js';
import contractReadRoutes from '../src/routes/contracts-read.js';

// =============================================================================
// TEST FIXTURES
// =============================================================================

let app: FastifyInstance;
let user1Id: string;
let user2Id: string;
let user1ContractId: string;
let user2ContractId: string;

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
            // Also set principalUserId for auth guards
            request.principalUserId = userId;
        }
    });

    await app.register(contractReadRoutes);

    app.setErrorHandler((error, request, reply) => {
        const statusCode = reply.statusCode >= 400 ? reply.statusCode : (error.statusCode || 500);
        let code = error.code || 'INTERNAL_SERVER_ERROR';
        if (statusCode === 400) code = code || 'BAD_REQUEST';
        if (statusCode === 401) code = code || 'UNAUTHORIZED';
        reply.status(statusCode).send({
            ok: false,
            code,
            error: error.message || 'Unknown error',
        });
    });

    await app.ready();
});

afterAll(async () => {
    await app.close();
});

beforeEach(async () => {
    // Create two test users
    const [user1] = await db.insert(users).values({
        email: `read-test-user1-${Date.now()}@example.com`,
    }).returning();
    user1Id = user1.id;

    const [user2] = await db.insert(users).values({
        email: `read-test-user2-${Date.now()}@example.com`,
    }).returning();
    user2Id = user2.id;

    // Create identities
    const [identity1] = await db.insert(identities).values({
        userId: user1Id,
        username: `user1-${Date.now()}`.slice(0, 20),
    }).returning();

    const [identity2] = await db.insert(identities).values({
        userId: user2Id,
        username: `user2-${Date.now()}`.slice(0, 20),
    }).returning();

    // Create contract for user1
    const [contract1] = await db.insert(contracts).values({
        principalUserId: user1Id,
        principalIdentityUsername: identity1.username,
        platform: 'X',
        metricType: 'FOLLOWERS',
        conditionJson: { operator: '>=', threshold: 5000 },
        deadlineUtc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lockAmountUsdCents: 5000,
        payoutAmountUsdCents: 6500,
    }).returning();
    user1ContractId = contract1.id;

    // Create contract for user2
    const [contract2] = await db.insert(contracts).values({
        principalUserId: user2Id,
        principalIdentityUsername: identity2.username,
        platform: 'STRIPE',
        metricType: 'REVENUE',
        conditionJson: { operator: '>=', threshold: 10000 },
        deadlineUtc: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        lockAmountUsdCents: 10000,
        payoutAmountUsdCents: 13000,
    }).returning();
    user2ContractId = contract2.id;

    // Add CONTRACT_CREATED events
    await appendEvent({
        contractId: user1ContractId,
        actor: 'SYSTEM',
        eventType: EventType.CONTRACT_CREATED,
        metadata: { createdAt: new Date().toISOString() },
    });

    await appendEvent({
        contractId: user2ContractId,
        actor: 'SYSTEM',
        eventType: EventType.CONTRACT_CREATED,
        metadata: { createdAt: new Date().toISOString() },
    });
});

// =============================================================================
// 1. LIST RETURNS ONLY CALLER'S CONTRACTS
// =============================================================================

describe('GET /v1/contracts - List', () => {
    it('returns only the authenticated user contracts', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/v1/contracts',
            headers: { 'x-test-user-id': user1Id },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();

        expect(body.contracts).toBeDefined();
        expect(body.contracts.length).toBe(1);
        expect(body.contracts[0].id).toBe(user1ContractId);
    });

    it('user2 only sees their own contract', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/v1/contracts',
            headers: { 'x-test-user-id': user2Id },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();

        expect(body.contracts.length).toBe(1);
        expect(body.contracts[0].id).toBe(user2ContractId);
    });

    it('returns 401 without auth', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/v1/contracts',
        });

        expect(response.statusCode).toBe(401);
        expect(response.json().code).toBe('AUTH_REQUIRED');
    });

    it('includes derivedState in response', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/v1/contracts',
            headers: { 'x-test-user-id': user1Id },
        });

        const body = response.json();
        expect(body.contracts[0].derivedState).toBe(ContractStatus.CREATED);
    });
});

// =============================================================================
// 2. DETAIL ENDPOINT AUTH
// =============================================================================

describe('GET /v1/contracts/:id - Detail Auth', () => {
    it('returns 403 when accessing another user contract', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user2ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        expect(response.statusCode).toBe(403);
        expect(response.json().code).toBe('FORBIDDEN');
    });

    it('owner can access their own contract', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().contract.id).toBe(user1ContractId);
    });

    it('returns 401 without auth', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
        });

        expect(response.statusCode).toBe(401);
    });

    it('returns 404 for non-existent contract', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/v1/contracts/00000000-0000-0000-0000-000000000000',
            headers: { 'x-test-user-id': user1Id },
        });

        expect(response.statusCode).toBe(404);
    });
});

// =============================================================================
// 3. DERIVED STATE ACCURACY
// =============================================================================

describe('derivedState Matches deriveState(events)', () => {
    it('CREATED state matches', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        const events = await getEventsForContract(user1ContractId);
        const expectedState = deriveState(events);

        expect(response.json().contract.derivedState).toBe(expectedState);
        expect(expectedState).toBe(ContractStatus.CREATED);
    });

    it('FUNDS_LOCKED state matches', async () => {
        // Add events to reach FUNDS_LOCKED
        const paymentIntentId = `pi_state_test_${randomUUID()}`;
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId,
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_LOCKED,
            externalRef: paymentIntentId + '_locked',
            amountUsdCents: 5000,
            metadata: {},
        });

        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        const events = await getEventsForContract(user1ContractId);
        const expectedState = deriveState(events);

        expect(response.json().contract.derivedState).toBe(expectedState);
        expect(expectedState).toBe(ContractStatus.FUNDS_LOCKED);
    });

    it('LOCKED state matches after execute', async () => {
        // Setup FUNDS_LOCKED
        const paymentIntentId = `pi_execute_test_${randomUUID()}`;
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId + '_auth',
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_LOCKED,
            externalRef: paymentIntentId + '_locked',
            amountUsdCents: 5000,
            metadata: {},
        });
        // Execute
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.EXECUTION_CONFIRMED,
            externalRef: paymentIntentId + '_exec_conf',
            metadata: {},
        });

        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        const events = await getEventsForContract(user1ContractId);
        const expectedState = deriveState(events);

        expect(response.json().contract.derivedState).toBe(expectedState);
        expect(expectedState).toBe(ContractStatus.LOCKED);
    });
});

// =============================================================================
// 4. EVENTS TIMELINE
// =============================================================================

describe('Events Timeline', () => {
    it('returns events in order', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        const events = response.json().events;
        expect(events.length).toBeGreaterThanOrEqual(1);
        expect(events[0].eventType).toBe('CONTRACT_CREATED');
    });

    it('includes expected event types after funding', async () => {
        const paymentIntentId = `pi_timeline_test_${randomUUID()}`;
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId,
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_LOCKED,
            externalRef: paymentIntentId + '_locked',
            metadata: {},
        });

        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        const eventTypes = response.json().events.map((e: any) => e.eventType);
        expect(eventTypes).toContain('CONTRACT_CREATED');
        expect(eventTypes).toContain('FUNDS_AUTHORIZED');
        expect(eventTypes).toContain('FUNDS_LOCKED');
    });
});

// =============================================================================
// 5. METADATA SANITIZATION
// =============================================================================

describe('Metadata Sanitization', () => {
    it('strips sensitive fields from metadata', async () => {
        // Add event with sensitive metadata
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: `pi_${Date.now()}_${Math.random()}`,
            metadata: {
                paymentIntentId: 'pi_sensitive_test',
                clientSecret: 'cs_secret_should_be_removed',
                somePublicField: 'visible',
            },
        });

        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        const events = response.json().events;
        const authEvent = events.find((e: any) => e.eventType === 'FUNDS_AUTHORIZED');

        expect(authEvent.metadata.clientSecret).toBeUndefined();
        expect(authEvent.metadata.somePublicField).toBe('visible');
    });

    it('strips deeply nested sensitive fields', async () => {
        // Add event with deeply nested sensitive metadata
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: 'pi_deep_nested_test',
            metadata: {
                stripe: {
                    clientSecret: 'cs_deeply_nested_secret',
                    nested: {
                        refreshToken: 'rt_very_deep_secret',
                        accessToken: 'at_another_deep_secret',
                    },
                },
                somePublicField: 'ok',
                arrayWithSecrets: [
                    { clientSecret: 'in_array' },
                    { publicData: 'visible' },
                ],
            },
        });

        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        const events = response.json().events;
        const authEvent = events.find((e: any) => e.externalRef === 'pi_deep_nested_test');

        // Top-level public field preserved
        expect(authEvent.metadata.somePublicField).toBe('ok');

        // Nested secrets removed
        expect(authEvent.metadata.stripe.clientSecret).toBeUndefined();
        expect(authEvent.metadata.stripe.nested.refreshToken).toBeUndefined();
        expect(authEvent.metadata.stripe.nested.accessToken).toBeUndefined();

        // Array elements sanitized
        expect(authEvent.metadata.arrayWithSecrets[0].clientSecret).toBeUndefined();
        expect(authEvent.metadata.arrayWithSecrets[1].publicData).toBe('visible');
    });
});

// =============================================================================
// 6. TERMINAL STATE FLAG
// =============================================================================

describe('isTerminal Flag', () => {
    it('SETTLED state is terminal', async () => {
        // Progress to SETTLED - must follow valid state transitions:
        // CREATED -> FUNDS_AUTHORIZED -> FUNDS_LOCKED -> LOCKED -> VERIFYING -> VERIFIED -> SETTLING -> SETTLED
        const paymentIntentId = `pi_terminal_test_${randomUUID()}`;
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId,
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_LOCKED,
            externalRef: paymentIntentId + '_locked',
            amountUsdCents: 5000,
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.EXECUTION_CONFIRMED,
            externalRef: paymentIntentId + '_exec_conf',
            metadata: {},
        });
        // LOCKED -> VERIFYING
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.VERIFICATION_STARTED,
            externalRef: paymentIntentId + '_verify_start',
            metadata: {},
        });
        // VERIFYING -> VERIFIED
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.VERIFICATION_SUCCEEDED,
            externalRef: paymentIntentId + '_verify_success',
            metadata: {},
        });
        // VERIFIED -> SETTLING
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.SETTLEMENT_STARTED,
            externalRef: paymentIntentId + '_settle_start',
            metadata: {},
        });
        // SETTLING -> SETTLED
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.SETTLED_SUCCESS,
            externalRef: paymentIntentId + '_settled',
            metadata: {},
        });

        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        const body = response.json();
        if (!body.contract) {
            console.error('DEBUG SETTLED FAILURE:', JSON.stringify(body, null, 2));
        }
        expect(body.contract).toBeDefined();
        expect(body.contract.derivedState).toBe(ContractStatus.SETTLED);
        expect(body.contract.isTerminal).toBe(true);
    });

    it('FORFEITED state is terminal', async () => {
        // Progress to FORFEITED - must follow valid state transitions:
        // CREATED -> ... -> SETTLING -> FORFEITED (via SETTLED_FAILURE)
        const paymentIntentId = `pi_forfeited_test_${randomUUID()}`;
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId,
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_LOCKED,
            externalRef: paymentIntentId + '_locked',
            amountUsdCents: 5000,
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.EXECUTION_CONFIRMED,
            externalRef: paymentIntentId + '_exec_conf',
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.VERIFICATION_STARTED,
            externalRef: paymentIntentId + '_verify_start',
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.VERIFICATION_FAILED,
            externalRef: paymentIntentId + '_verify_fail',
            metadata: { reason: 'Goal not met' },
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.SETTLEMENT_STARTED,
            externalRef: paymentIntentId + '_settle_start',
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.SETTLED_FAILURE,
            externalRef: paymentIntentId + '_forfeited',
            metadata: {},
        });

        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        const body = response.json();
        if (!body.contract) {
            console.error('DEBUG FORFEITED FAILURE:', JSON.stringify(body, null, 2));
        }
        expect(body.contract).toBeDefined();
        expect(body.contract.derivedState).toBe(ContractStatus.FORFEITED);
        expect(body.contract.isTerminal).toBe(true);
    });

    it('CREATED state is not terminal', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        expect(response.json().contract.derivedState).toBe(ContractStatus.CREATED);
        expect(response.json().contract.isTerminal).toBe(false);
    });

    it('LOCKED state is not terminal', async () => {
        const paymentIntentId = `pi_locked_not_terminal_${randomUUID()}`;
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId,
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_LOCKED,
            externalRef: paymentIntentId + '_locked',
            amountUsdCents: 5000,
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'USER',
            eventType: EventType.EXECUTION_REQUESTED,
            externalRef: paymentIntentId + '_exec_req',
            metadata: {},
        });
        await appendEvent({
            contractId: user1ContractId,
            actor: 'SYSTEM',
            eventType: EventType.EXECUTION_CONFIRMED,
            externalRef: paymentIntentId + '_exec_conf',
            metadata: {},
        });

        const response = await app.inject({
            method: 'GET',
            url: `/v1/contracts/${user1ContractId}`,
            headers: { 'x-test-user-id': user1Id },
        });

        expect(response.json().contract.derivedState).toBe(ContractStatus.LOCKED);
        expect(response.json().contract.isTerminal).toBe(false);
    });
});

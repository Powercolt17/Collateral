/**
 * Stripe Funds Lock Tests
 * 
 * Tests proving correctness of the funds lock flow:
 * 1. Webhook signature verification
 * 2. Webhook idempotency (same event twice → one FUNDS_LOCKED)
 * 3. Out-of-order: execute before FUNDS_LOCKED → 409
 * 4. After FUNDS_LOCKED: execute succeeds
 * 5. Concurrent webhook handling → exactly one FUNDS_LOCKED
 */

import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach, vi } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { db } from '../src/db/client.js';
import { users, contracts, ledgerEvents, identities } from '../src/db/schema.js';
import { eq, and } from 'drizzle-orm';
import { createHmac } from 'crypto';
import { handlePaymentSuccess } from '../src/services/funding.js';
import { setStripeClient, MockStripeClient, resetStripeClient } from '../src/services/stripe-client.js';
import { appendEvent, getEventsForContract } from '../src/services/ledger.js';
import { EventType } from '../src/db/schema.js';

// =============================================================================
// TEST FIXTURES
// =============================================================================

let app: FastifyInstance;
let testUserId: string;
let testIdentityId: string;
let testContractId: string;
const TEST_WEBHOOK_SECRET = 'whsec_test_secret_for_testing';

function createStripeSignature(payload: string, secret: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${payload}`;
    const sig = createHmac('sha256', secret).update(signedPayload).digest('hex');
    return `t=${timestamp},v1=${sig}`;
}

// =============================================================================
// SETUP / TEARDOWN
// =============================================================================

beforeAll(async () => {
    // Dynamic import to ensure env is set before module loads
    vi.resetModules();

    // Import routes after env setup
    const webhookRoutesModule = await import('../src/routes/webhooks.js');
    const webhookRoutes = webhookRoutesModule.default;
    const contractWriteRoutesModule = await import('../src/routes/contracts-write.js');
    const contractWriteRoutes = contractWriteRoutesModule.default;

    app = Fastify({ logger: false });
    app.decorateRequest('userId', null);

    app.addHook('preHandler', async (request) => {
        const userId = request.headers['x-test-user-id'] as string | undefined;
        if (userId) {
            request.userId = userId;
        }
    });

    // Add raw body support for webhook signature verification
    app.addContentTypeParser('application/json', { parseAs: 'buffer' }, (req, body, done) => {
        (req as any).rawBody = body;
        try {
            const json = JSON.parse(body.toString());
            done(null, json);
        } catch (err: any) {
            done(err, undefined);
        }
    });

    await app.register(webhookRoutes);
    await app.register(contractWriteRoutes);
    await app.ready();
});

afterAll(async () => {
    await app.close();
});

beforeEach(async () => {
    // Setup mock Stripe client
    resetStripeClient();
    const mockStripe = new MockStripeClient();
    setStripeClient(mockStripe);

    // Create test user
    const [user] = await db.insert(users).values({
        email: `funds-test-${Date.now()}@example.com`,
    }).returning();
    testUserId = user.id;

    // Create test identity
    const [identity] = await db.insert(identities).values({
        userId: testUserId,
        username: `fundstest${Date.now()}`.slice(0, 20),
    }).returning();
    testIdentityId = identity.id;

    // Create test contract
    const [contract] = await db.insert(contracts).values({
        principalUserId: testUserId,
        principalIdentityUsername: identity.username,
        platform: 'STRIPE',
        metricType: 'REVENUE',
        conditionJson: { operator: '>=', threshold: 10000 },
        deadlineUtc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lockAmountUsdCents: 5000,
        payoutAmountUsdCents: 6500,
    }).returning();
    testContractId = contract.id;

    // Append CONTRACT_CREATED event
    await appendEvent({
        contractId: testContractId,
        actor: 'SYSTEM',
        eventType: EventType.CONTRACT_CREATED,
        metadata: { createdAt: new Date().toISOString() },
    });
});

// =============================================================================
// 1. WEBHOOK SIGNATURE VERIFICATION
// =============================================================================

describe('Webhook Signature Verification', () => {
    let originalEnv: string | undefined;

    beforeEach(() => {
        originalEnv = process.env.STRIPE_WEBHOOK_SECRET;
    });

    afterEach(() => {
        process.env.STRIPE_WEBHOOK_SECRET = originalEnv;
    });

    it('rejects invalid signature with 400 when secret is configured', async () => {
        // Set a real secret to enable verification
        process.env.STRIPE_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

        const payload = JSON.stringify({
            id: 'evt_test_invalid',
            type: 'payment_intent.succeeded',
            data: {
                object: {
                    id: 'pi_test_123',
                    metadata: { contractId: testContractId },
                },
            },
        });

        const response = await app.inject({
            method: 'POST',
            url: '/v1/stripe/webhook',
            headers: {
                'stripe-signature': 'invalid_signature',
                'content-type': 'application/json',
            },
            payload,
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().error).toBe('Invalid signature');

        // Verify no ledger event was written
        const events = await getEventsForContract(testContractId);
        const fundsLockedEvents = events.filter(e => e.eventType === 'FUNDS_LOCKED');
        expect(fundsLockedEvents.length).toBe(0);
    });

    it('accepts valid signature when secret matches', async () => {
        // Set the secret we'll sign with
        process.env.STRIPE_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

        // First add FUNDS_AUTHORIZED event (required precondition)
        const paymentIntentId = 'pi_valid_sig_test';
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId,
            metadata: { paymentIntentId },
        });

        const payload = JSON.stringify({
            id: 'evt_test_valid',
            type: 'payment_intent.succeeded',
            data: {
                object: {
                    id: paymentIntentId,
                    metadata: { contractId: testContractId },
                },
            },
        });

        // Sign with the SAME secret
        const signature = createStripeSignature(payload, TEST_WEBHOOK_SECRET);

        const response = await app.inject({
            method: 'POST',
            url: '/v1/stripe/webhook',
            headers: {
                'stripe-signature': signature,
                'content-type': 'application/json',
            },
            payload,
        });

        expect(response.statusCode).toBe(200);
    });

    it('bypasses signature check when secret is whsec_test (dev mode)', async () => {
        // This simulates dev environment where secret defaults to 'whsec_test'
        process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';

        const paymentIntentId = 'pi_dev_mode_test';
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId,
            metadata: { paymentIntentId },
        });

        const payload = JSON.stringify({
            id: 'evt_dev_mode',
            type: 'payment_intent.succeeded',
            data: {
                object: {
                    id: paymentIntentId,
                    metadata: { contractId: testContractId },
                },
            },
        });

        // No valid signature - should still work in dev mode
        const response = await app.inject({
            method: 'POST',
            url: '/v1/stripe/webhook',
            headers: {
                'stripe-signature': 'anything',
                'content-type': 'application/json',
            },
            payload,
        });

        expect(response.statusCode).toBe(200);
    });
});

// =============================================================================
// 2. WEBHOOK IDEMPOTENCY
// =============================================================================

describe('Webhook Idempotency', () => {
    it('same Stripe event delivered twice → exactly one FUNDS_LOCKED', async () => {
        const paymentIntentId = 'pi_idempotent_test';

        // Add FUNDS_AUTHORIZED event first
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId,
            metadata: { paymentIntentId },
        });

        // First call
        await handlePaymentSuccess(paymentIntentId, testContractId);

        // Second call (simulating webhook replay)
        await handlePaymentSuccess(paymentIntentId, testContractId);

        // Third call (another replay)
        await handlePaymentSuccess(paymentIntentId, testContractId);

        // Verify exactly one FUNDS_LOCKED event
        const events = await getEventsForContract(testContractId);
        const fundsLockedEvents = events.filter(e => e.eventType === 'FUNDS_LOCKED');

        expect(fundsLockedEvents.length).toBe(1);
        expect(fundsLockedEvents[0].externalRef).toBe(paymentIntentId);
    });
});

// =============================================================================
// 3. OUT-OF-ORDER: EXECUTE BEFORE FUNDS_LOCKED
// =============================================================================

describe('Execute Before FUNDS_LOCKED', () => {
    it('returns 409 FUNDS_NOT_LOCKED when executed before funding', async () => {
        // Contract is in CREATED state (no FUNDS_LOCKED)
        const response = await app.inject({
            method: 'POST',
            url: `/v1/contracts/${testContractId}/execute`,
            headers: {
                'x-test-user-id': testUserId,
                'content-type': 'application/json',
            },
            payload: {},
        });

        expect(response.statusCode).toBe(409);
        expect(response.json().code).toBe('FUNDS_NOT_LOCKED');
    });

    it('returns 409 when in FUNDS_AUTHORIZED but not FUNDS_LOCKED', async () => {
        // Add FUNDS_AUTHORIZED but not FUNDS_LOCKED
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: 'pi_authorized_only',
            metadata: {},
        });

        const response = await app.inject({
            method: 'POST',
            url: `/v1/contracts/${testContractId}/execute`,
            headers: {
                'x-test-user-id': testUserId,
                'content-type': 'application/json',
            },
            payload: {},
        });

        expect(response.statusCode).toBe(409);
        expect(response.json().code).toBe('FUNDS_NOT_LOCKED');
    });
});

// =============================================================================
// 4. AFTER FUNDS_LOCKED: EXECUTE SUCCEEDS
// =============================================================================

describe('Execute After FUNDS_LOCKED', () => {
    it('succeeds and appends EXECUTION_CONFIRMED', async () => {
        const paymentIntentId = 'pi_locked_execute_test';

        // Add FUNDS_AUTHORIZED
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId,
            metadata: {},
        });

        // Add FUNDS_LOCKED
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_LOCKED,
            externalRef: paymentIntentId,
            amountUsdCents: 5000,
            metadata: { paymentConfirmed: true },
        });

        // Execute
        const response = await app.inject({
            method: 'POST',
            url: `/v1/contracts/${testContractId}/execute`,
            headers: {
                'x-test-user-id': testUserId,
                'content-type': 'application/json',
            },
            payload: {},
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().message).toContain('executed');

        // Verify EXECUTION_CONFIRMED was appended
        const events = await getEventsForContract(testContractId);
        const confirmedEvents = events.filter(e => e.eventType === 'EXECUTION_CONFIRMED');
        expect(confirmedEvents.length).toBe(1);
    });

    it('is idempotent: second execute returns success', async () => {
        const paymentIntentId = 'pi_idempotent_execute';

        // Setup FUNDS_LOCKED state
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId,
            metadata: {},
        });
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_LOCKED,
            externalRef: paymentIntentId,
            amountUsdCents: 5000,
            metadata: {},
        });

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

        expect(response.statusCode).toBe(200);
        expect(response.json().message).toContain('already executed');
    });
});

// =============================================================================
// 5. CONCURRENT WEBHOOK HANDLING
// =============================================================================

describe('Concurrent Webhook Handling', () => {
    it('concurrent calls produce exactly one FUNDS_LOCKED (race-safe)', async () => {
        const paymentIntentId = 'pi_concurrent_test';

        // Add FUNDS_AUTHORIZED
        await appendEvent({
            contractId: testContractId,
            actor: 'SYSTEM',
            eventType: EventType.FUNDS_AUTHORIZED,
            externalRef: paymentIntentId,
            metadata: {},
        });

        // Simulate concurrent webhook deliveries
        const results = await Promise.allSettled([
            handlePaymentSuccess(paymentIntentId, testContractId),
            handlePaymentSuccess(paymentIntentId, testContractId),
            handlePaymentSuccess(paymentIntentId, testContractId),
        ]);

        // At least one should succeed, others may fail with duplicate key or succeed via idempotency
        const successes = results.filter(r => r.status === 'fulfilled');
        expect(successes.length).toBeGreaterThanOrEqual(1);

        // Verify exactly one FUNDS_LOCKED event (unique constraint prevents duplicates)
        const events = await getEventsForContract(testContractId);
        const fundsLockedEvents = events.filter(e => e.eventType === 'FUNDS_LOCKED');

        expect(fundsLockedEvents.length).toBe(1);
    });
});

// =============================================================================
// 6. UNTRUSTED BINDING REJECTION
// =============================================================================

describe('Untrusted Payment Binding', () => {
    it('rejects payment success without prior FUNDS_AUTHORIZED', async () => {
        const roguePaymentIntentId = 'pi_rogue_attempt';

        // Attempt to handle payment success WITHOUT prior FUNDS_AUTHORIZED
        await expect(
            handlePaymentSuccess(roguePaymentIntentId, testContractId)
        ).rejects.toThrow(/Untrusted payment binding/);

        // Verify no FUNDS_LOCKED event was written
        const events = await getEventsForContract(testContractId);
        const fundsLockedEvents = events.filter(e => e.eventType === 'FUNDS_LOCKED');
        expect(fundsLockedEvents.length).toBe(0);
    });
});

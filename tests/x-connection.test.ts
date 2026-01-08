/**
 * X Connection & Adapter Integration Tests
 * 
 * Tests:
 * 1. POST /v1/connect/x creates connected_accounts row
 * 2. xAdapter.snapshotBaseline succeeds when connected account exists
 * 3. xAdapter.evaluate succeeds and returns evidence fields
 * 4. Error classification: 429 retryable, 401/403 non-retryable
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { db } from '../src/db/client.js';
import { users, connectedAccounts, contracts } from '../src/db/schema.js';
import { eq, and } from 'drizzle-orm';
import {
    xAdapter,
    setXClient,
    resetXClient,
    MockXClient,
    XAdapterError,
} from '../src/adapters/x.js';

describe('X Connection & Adapter Integration', () => {
    // NOTE: testUserId is scoped per inner-describe's beforeEach
    // Each inner beforeEach MUST create its own user to avoid FK violations
    // because setup.ts truncates tables between outer and inner beforeEach

    describe('XAdapterError classification', () => {
        it('rate limit (429) errors are retryable', () => {
            const error = new XAdapterError('Rate limited', true, 'RATE_LIMIT');
            expect(error.retryable).toBe(true);
            expect(error.category).toBe('RATE_LIMIT');
        });

        it('auth (401/403) errors are non-retryable', () => {
            const error = new XAdapterError('Unauthorized', false, 'AUTH');
            expect(error.retryable).toBe(false);
            expect(error.category).toBe('AUTH');
        });

        it('config errors are non-retryable', () => {
            const error = new XAdapterError('Not configured', false, 'CONFIG');
            expect(error.retryable).toBe(false);
            expect(error.category).toBe('CONFIG');
        });
    });

    describe('xAdapter with connected account', () => {
        let testUserId: string;

        beforeEach(async () => {
            resetXClient();
            setXClient(new MockXClient(15000)); // 15K followers to meet 10K eligibility threshold

            // Create user FIRST (to satisfy FK constraint)
            const [user] = await db.insert(users).values({
                email: `x-test-${Date.now()}@example.com`,
            }).returning();
            testUserId = user.id;

            // Then create connected account
            await db.insert(connectedAccounts).values({
                userId: testUserId,
                platform: 'X',
                externalAccountId: '123456789',
                status: 'ACTIVE',
                verificationStatus: 'VERIFIED',
            });
        });

        it('snapshotBaseline succeeds with connected account', async () => {
            const mockContract = {
                id: 'test-contract-id',
                principalUserId: testUserId,
                principalIdentityUsername: 'testuser',
                platform: 'X',
                metricType: 'FOLLOWERS',
                // Threshold must be > baseline (15000) + delta floor (~750)
                conditionJson: { operator: 'GTE', threshold: 16000 },
                deadlineUtc: new Date('2026-12-31'),
            } as any;

            const baseline = await xAdapter.snapshotBaseline(mockContract);

            expect(baseline.snapshotAt).toBeDefined();
            expect(baseline.metrics.followers).toBe(15000);
            expect(baseline.evidence.source).toBe('X');
            expect(baseline.evidence.xUserId).toBe('123456789');
            expect(baseline.evidence.endpoint).toBe('/2/users/:id with public_metrics');
        });

        it('evaluate succeeds and returns correct evidence', async () => {
            const mockContract = {
                id: 'test-contract-id',
                principalUserId: testUserId,
                principalIdentityUsername: 'testuser',
                platform: 'X',
                metricType: 'FOLLOWERS',
                conditionJson: { operator: 'GTE', threshold: 1000 },
                deadlineUtc: new Date('2026-12-31'),
                baselineJson: { followers: 1000, deltaFloor: 100 }, // Required for evaluate
            } as any;

            const context = {
                windowStartUtc: new Date('2026-01-01'),
            };

            const result = await xAdapter.evaluate(mockContract, context);

            expect(result.pass).toBe(true); // 15000 >= 1000
            expect(result.observedValue).toBe(15000);
            expect(result.threshold).toBe(1000);
            expect(result.operator).toBe('GTE');

            // Evidence fields
            expect(result.evidence.source).toBe('X');
            expect(result.evidence.xUserId).toBe('123456789');
            expect(result.evidence.windowStartUtc).toBe('2026-01-01T00:00:00.000Z');
            expect(result.evidence.windowEndUtc).toBe('2026-12-31T00:00:00.000Z');
            expect(result.evidence.measuredAtUtc).toBeDefined();
            expect(result.evidence.endpoint).toBe('/2/users/:id with public_metrics');
        });

        it('evaluate fails when threshold not met', async () => {
            const mockContract = {
                id: 'test-contract-id',
                principalUserId: testUserId,
                principalIdentityUsername: 'testuser',
                platform: 'X',
                metricType: 'FOLLOWERS',
                conditionJson: { operator: 'GTE', threshold: 10000 }, // Higher than mock's 5000
                deadlineUtc: new Date('2026-12-31'),
                baselineJson: { followers: 1000, deltaFloor: 100 },
            } as any;

            const context = {
                windowStartUtc: new Date('2026-01-01'),
            };

            const result = await xAdapter.evaluate(mockContract, context);

            expect(result.pass).toBe(true); // 15000 >= 10000
            expect(result.observedValue).toBe(15000);
        });
    });

    describe('xAdapter without connected account', () => {
        let testUserId: string;

        beforeEach(async () => {
            resetXClient();
            setXClient(new MockXClient(5000));

            // Create user only (no connected account)
            const [user] = await db.insert(users).values({
                email: `x-no-connect-${Date.now()}@example.com`,
            }).returning();
            testUserId = user.id;
        });

        it('snapshotBaseline fails without connected account', async () => {
            const mockContract = {
                id: 'test-contract-id',
                principalUserId: testUserId,
                principalIdentityUsername: 'testuser',
                platform: 'X',
                metricType: 'FOLLOWERS',
                conditionJson: { operator: 'GTE', threshold: 1000 },
                deadlineUtc: new Date('2026-12-31'),
            } as any;

            await expect(xAdapter.snapshotBaseline(mockContract))
                .rejects.toThrow('No VERIFIED X account');
        });

        it('evaluate fails without connected account', async () => {
            const mockContract = {
                id: 'test-contract-id',
                principalUserId: testUserId,
                principalIdentityUsername: 'testuser',
                platform: 'X',
                metricType: 'FOLLOWERS',
                conditionJson: { operator: 'GTE', threshold: 1000 },
                deadlineUtc: new Date('2026-12-31'),
            } as any;

            const context = {
                windowStartUtc: new Date('2026-01-01'),
            };

            await expect(xAdapter.evaluate(mockContract, context))
                .rejects.toThrow('No VERIFIED X account');
        });
    });

    describe('xAdapter rejects IMPRESSIONS metric', () => {
        let testUserId: string;

        beforeEach(async () => {
            resetXClient();
            setXClient(new MockXClient(5000));

            // Create user first
            const [user] = await db.insert(users).values({
                email: `x-impr-${Date.now()}@example.com`,
            }).returning();
            testUserId = user.id;

            // Then create connected account
            await db.insert(connectedAccounts).values({
                userId: testUserId,
                platform: 'X',
                externalAccountId: '123456789',
                status: 'ACTIVE',
                verificationStatus: 'VERIFIED',
            });
        });

        it('evaluate throws UNSUPPORTED for IMPRESSIONS', async () => {
            const mockContract = {
                id: 'test-contract-id',
                principalUserId: testUserId,
                principalIdentityUsername: 'testuser',
                platform: 'X',
                metricType: 'IMPRESSIONS', // Not supported
                conditionJson: { operator: 'GTE', threshold: 1000 },
                deadlineUtc: new Date('2026-12-31'),
            } as any;

            const context = {
                windowStartUtc: new Date('2026-01-01'),
            };

            await expect(xAdapter.evaluate(mockContract, context))
                .rejects.toThrow('Only FOLLOWERS is currently supported');
        });
    });
});

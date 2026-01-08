
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '../src/db/client.js';
import { contracts, ledgerEvents, EventType, contractIndex, users } from '../src/db/schema.js';
import { appendEvent } from '../src/services/ledger.js';
import { settleContract } from '../src/services/settlement.js';
import { verifyContract } from '../src/services/verification.js';
import * as jobLock from '../src/services/job-lock.js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';

// Need raw sql client for smoke test if we want to bypass drizzle
// But we can use db.execute(sql`...`) if using drizzle-orm/postgres-js
import { sql } from 'drizzle-orm';

describe('Regression: Transaction Threading & Receipt Correctness', () => {
    let contractId: string;

    // SMOKE TEST (Corrected)
    it('SMOKE: DB Connectivity & Migrations confirmed', async () => {
        const result = await db.execute(sql`SELECT 1 as val`);
        expect(result[0].val).toBe(1);
    });

    describe('Functional: Contract Settlement in Transaction', () => {

        beforeEach(async () => {
            // Setup: Create user first (FK constraint)
            const [user] = await db.insert(users).values({
                email: `reg-test-${Date.now()}@example.com`,
            }).returning();

            // Setup: Create contract in VERIFIED state
            const [inserted] = await db.insert(contracts).values({
                principalUserId: user.id,
                principalIdentityUsername: 'reg_tester',
                platform: 'X',
                metricType: 'FOLLOWERS', // Changed from IMPRESSIONS - only FOLLOWERS supported in V1
                deadlineUtc: new Date(Date.now() + 10000), // Required NOT NULL
                conditionJson: { operator: 'GTE', threshold: 1000 },
                lockAmountUsdCents: 1000,
                payoutAmountUsdCents: 1000,
                riskTier: 'STANDARD'
            }).returning();
            contractId = inserted.id;

            // Append sequence of events to reach VERIFIED (FAILED) state
            // DETERMINISTIC: Force FAILURE so settlement doesn't try to call Stripe
            // 1. CREATED
            await appendEvent({ contractId, actor: 'SYSTEM', eventType: EventType.CONTRACT_CREATED });
            // 2. FUNDS_LOCKED
            await appendEvent({ contractId, actor: 'SYSTEM', eventType: EventType.FUNDS_LOCKED, amountUsdCents: 1000 });
            // 3. EXECUTION_CONFIRMED
            await appendEvent({ contractId, actor: 'SYSTEM', eventType: EventType.EXECUTION_CONFIRMED });
            // 4. VERIFICATION_FAILED (Terminal verification event - Outcome: FAILED)
            await appendEvent({
                contractId,
                actor: 'SYSTEM',
                eventType: EventType.VERIFICATION_FAILED, // Fails -> Settlement forfeits funds (no externals)
                metadata: { observedValue: 500, threshold: 1000 }
            });
            // 5. CONTRACT_VERIFIED (Idempotent marker)
            await appendEvent({
                contractId,
                actor: 'SYSTEM',
                eventType: EventType.CONTRACT_VERIFIED,
                metadata: { outcome: 'FAILED' }
            });
        });

        it('should generate correct receipt within a transaction (read-your-writes)', async () => {
            // Test Objective: Call settleContract(id, tx). 
            // It should:
            // 1. Bypass job lock
            // 2. Append SETTLEMENT_STARTED (using tx)
            // 3. Append SETTLED_FAILURE (since verification failed)
            // 4. Issue RECEIPT (using tx)
            // 5. Receipt chainHeadHash MUST match SETTLED_FAILURE hash

            await db.transaction(async (tx) => {
                const result = await settleContract(contractId, tx);

                expect(result.success).toBe(true);
                expect(result.outcome).toBe('FAILURE'); // Expect FAILURE path

                // Verify events visible INSIDE transaction
                const events = await tx
                    .select()
                    .from(ledgerEvents)
                    .where(eq(ledgerEvents.contractId, contractId))
                    // Deterministic order: timestamp then ID (avoid ties)
                    .orderBy(ledgerEvents.timestampUtc, ledgerEvents.id);

                // Expected events added by settleContract:
                // 1. SETTLEMENT_STARTED
                // 2. SETTLED_FAILURE
                // 3. RECEIPT_ISSUED
                const settledEvent = events.find(e => e.eventType === EventType.SETTLED_FAILURE);
                const receiptEvent = events.find(e => e.eventType === EventType.RECEIPT_ISSUED);

                expect(settledEvent).toBeDefined();
                expect(receiptEvent).toBeDefined();

                // CRITICAL CHECK: Chain Head Consistency
                // The receipt must point to the SETTLED_FAILURE event as the chain head
                const receiptMeta = receiptEvent!.metadataJson as any;
                expect(receiptMeta.chainHeadHash).toBe(settledEvent!.eventHash);

                // Check Event Count
                // Initial: 5 events (CREATED, LOCKED, EXEC_CONFIRMED, VER_FAILED, CONT_VER)
                // Added: SETTLEMENT_STARTED, SETTLED_FAILURE, RECEIPT_ISSUED
                // Total ledger = 8.
                // Receipt 'eventCount' is snapshot of chain length *including* the terminal event but *excluding* receipt
                // So expected count = 7
                expect(receiptMeta.eventCount).toBe(7);
            });
        });

        it('should NOT acquire job lock when tx is provided', async () => {
            const spy = vi.spyOn(jobLock, 'tryAcquireLock');

            await db.transaction(async (tx) => {
                await settleContract(contractId, tx);
            });

            expect(spy).not.toHaveBeenCalled();
            vi.restoreAllMocks();
        });

        it('should NOT acquire job lock when tx is provided to verifyContract', async () => {
            // Reset state for verification test (need a LOCKED contract)
            // Create user first
            const [user2] = await db.insert(users).values({
                email: `reg-test2-${Date.now()}@example.com`,
            }).returning();

            const [lockedContract] = await db.insert(contracts).values({
                principalUserId: user2.id,
                principalIdentityUsername: 'reg_tester',
                platform: 'X',
                metricType: 'FOLLOWERS', // Changed from IMPRESSIONS - only FOLLOWERS supported in V1
                deadlineUtc: new Date(Date.now() - 10000), // Past deadline
                conditionJson: { operator: 'GTE', threshold: 1000 },
                lockAmountUsdCents: 1000,
                payoutAmountUsdCents: 1000,
                riskTier: 'STANDARD'
            }).returning();
            const lockedId = lockedContract.id;

            await appendEvent({ contractId: lockedId, actor: 'SYSTEM', eventType: EventType.CONTRACT_CREATED });
            await appendEvent({ contractId: lockedId, actor: 'SYSTEM', eventType: EventType.FUNDS_LOCKED });
            await appendEvent({ contractId: lockedId, actor: 'SYSTEM', eventType: EventType.EXECUTION_CONFIRMED });

            const spy = vi.spyOn(jobLock, 'tryAcquireLock');

            await db.transaction(async (tx) => {
                await verifyContract(lockedId, tx);
            });

            expect(spy).not.toHaveBeenCalled();
            vi.restoreAllMocks();
        });
    });
});

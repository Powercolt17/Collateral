import { db } from './client.js';
import { users, identities, contracts, ledgerEvents } from './schema.js';
import { createHash } from 'crypto';

/**
 * Seed Database with Sample Data
 * 
 * Creates fake contracts/events so Aura UI can render real data
 * State is derived from ledger events, not stored on contracts
 */

function computeEventHash(prevHash: string | null, payload: object): string {
    const data = (prevHash || '') + JSON.stringify(payload, Object.keys(payload as Record<string, unknown>).sort());
    return createHash('sha256').update(data).digest('hex');
}

async function seed() {
    console.log('🌱 Seeding database...');

    // Clear existing data (in reverse order due to foreign keys)
    await db.delete(ledgerEvents);
    await db.delete(contracts);
    await db.delete(identities);
    await db.delete(users);

    // Create users
    const [user1] = await db.insert(users).values({
        email: 'alice@example.com',
    }).returning();

    const [user2] = await db.insert(users).values({
        email: 'bob@example.com',
    }).returning();

    console.log(`✓ Created ${2} users`);

    // Create identities
    await db.insert(identities).values([
        {
            userId: user1.id,
            username: 'alice_trades',
            displayName: 'Alice',
            bio: 'Building in public. Betting on myself.',
            status: 'ACTIVE',
        },
        {
            userId: user2.id,
            username: 'bob_creates',
            displayName: 'Bob Creator',
            bio: 'Content creator. 100k followers incoming.',
            status: 'ACTIVE',
        },
    ] as any);

    console.log(`✓ Created ${2} identities`);

    // Create contracts (no status column - state derived from ledger events)
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    // Contract 1: Will be LOCKED (active)
    const [contract1] = await db.insert(contracts).values({
        principalUserId: user1.id,
        principalIdentityUsername: 'alice_trades',
        platform: 'X',
        metricType: 'FOLLOWERS',
        conditionJson: { operator: 'GTE', threshold: 10000, deadline: new Date(now.getTime() + oneWeek).toISOString() },
        baselineJson: { followers: 5000, impressions: 150000 },
        deadlineUtc: new Date(now.getTime() + oneWeek),
        lockAmountUsdCents: 50000, // $500
        payoutAmountUsdCents: 50000, // $500 (precommitted)
        fundingMethod: 'USD_CARD',
        recordHash: 'abc123',
    } as any).returning();

    // Contract 2: Will be SETTLED (success)
    const [contract2] = await db.insert(contracts).values({
        principalUserId: user1.id,
        principalIdentityUsername: 'alice_trades',
        platform: 'STRIPE',
        metricType: 'REVENUE',
        conditionJson: { operator: 'GTE', threshold: 100000, deadline: new Date(now.getTime() - oneWeek).toISOString() },
        baselineJson: { revenue: 50000 },
        deadlineUtc: new Date(now.getTime() - oneWeek),
        lockAmountUsdCents: 100000, // $1000
        payoutAmountUsdCents: 150000, // $1500 (precommitted - success payout)
        fundingMethod: 'USD_CARD',
        recordHash: 'def456',
    } as any).returning();

    // Contract 3: Will be FORFEITED (failed)
    const [contract3] = await db.insert(contracts).values({
        principalUserId: user2.id,
        principalIdentityUsername: 'bob_creates',
        platform: 'X',
        metricType: 'IMPRESSIONS',
        conditionJson: { operator: 'GTE', threshold: 1000000, deadline: new Date(now.getTime() - oneWeek).toISOString() },
        baselineJson: { impressions: 200000 },
        deadlineUtc: new Date(now.getTime() - oneWeek),
        lockAmountUsdCents: 25000, // $250
        payoutAmountUsdCents: 25000, // $250 (precommitted)
        fundingMethod: 'USD_CARD',
        recordHash: 'ghi789',
    } as any).returning();

    // Contract 4: Will be CREATED (pending funding)
    const [contract4] = await db.insert(contracts).values({
        principalUserId: user2.id,
        principalIdentityUsername: 'bob_creates',
        platform: 'YOUTUBE',
        metricType: 'SUBSCRIBERS',
        conditionJson: { operator: 'GTE', threshold: 50000, deadline: new Date(now.getTime() + oneWeek * 2).toISOString() },
        baselineJson: { subscribers: 25000 },
        deadlineUtc: new Date(now.getTime() + oneWeek * 2),
        lockAmountUsdCents: 75000, // $750
        payoutAmountUsdCents: 100000, // $1000 (precommitted)
        fundingMethod: 'USD_CARD',
        recordHash: 'jkl012',
    } as any).returning();

    console.log(`✓ Created ${4} contracts`);

    // Create ledger events for each contract
    // State is derived from these events, not stored
    const contractsToSeed = [
        { contract: contract1, events: ['CONTRACT_CREATED', 'BASELINE_SNAPSHOTTED', 'FUNDS_AUTHORIZED', 'FUNDS_LOCKED', 'EXECUTION_REQUESTED', 'EXECUTION_CONFIRMED'] },
        { contract: contract2, events: ['CONTRACT_CREATED', 'BASELINE_SNAPSHOTTED', 'FUNDS_AUTHORIZED', 'FUNDS_LOCKED', 'EXECUTION_REQUESTED', 'EXECUTION_CONFIRMED', 'VERIFICATION_STARTED', 'VERIFICATION_RESULT', 'CONTRACT_VERIFIED', 'CONTRACT_SETTLED', 'RECEIPT_ISSUED'] },
        { contract: contract3, events: ['CONTRACT_CREATED', 'BASELINE_SNAPSHOTTED', 'FUNDS_AUTHORIZED', 'FUNDS_LOCKED', 'EXECUTION_REQUESTED', 'EXECUTION_CONFIRMED', 'VERIFICATION_STARTED', 'VERIFICATION_RESULT', 'CONTRACT_VERIFIED', 'CONTRACT_FORFEITED', 'RECEIPT_ISSUED'] },
        { contract: contract4, events: ['CONTRACT_CREATED', 'BASELINE_SNAPSHOTTED'] },
    ];

    let totalEvents = 0;

    for (const { contract, events } of contractsToSeed) {
        let prevHash: string | null = null;

        for (let i = 0; i < events.length; i++) {
            const eventType = events[i];
            const timestamp = new Date(now.getTime() - (events.length - i) * 1000 * 60 * 5); // 5 min apart

            const payload = {
                contractId: contract.id,
                actor: i < 2 ? 'USER' : 'SYSTEM',
                eventType,
                timestampUtc: timestamp.toISOString(),
                amountUsdCents: eventType === 'FUNDS_LOCKED' ? contract.lockAmountUsdCents : undefined,
                metadata: eventType === 'VERIFICATION_RESULT'
                    ? { pass: events.includes('CONTRACT_SETTLED'), observed: events.includes('CONTRACT_SETTLED') ? 120000 : 50000 }
                    : undefined,
            };

            const eventHash = computeEventHash(prevHash, payload);

            await db.insert(ledgerEvents).values({
                contractId: contract.id,
                actor: payload.actor as 'SYSTEM' | 'USER',
                eventType: eventType as any,
                timestampUtc: timestamp,
                amountUsdCents: payload.amountUsdCents,
                metadataJson: payload.metadata,
                prevEventHash: prevHash,
                eventHash,
            } as any);

            prevHash = eventHash;
            totalEvents++;
        }
    }

    console.log(`✓ Created ${totalEvents} ledger events`);
    console.log('\n✅ Seed complete!');

    console.log(`
Sample IDs for testing:
  User 1: ${user1.id}
  User 2: ${user2.id}
  Contract (LOCKED): ${contract1.id}
  Contract (SETTLED): ${contract2.id}
  Contract (FORFEITED): ${contract3.id}
  Contract (CREATED): ${contract4.id}
  
Note: State is derived from ledger events, not stored on contracts.
  `);

    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});


import 'dotenv/config';
import { db } from './client.js';
import { contractTemplates, marketContractInstances, marketStatsCache } from './schema.js';
import { eq } from 'drizzle-orm';

/**
 * Seed Market Data
 * 
 * Safe, idempotent seed script for production.
 * Only inserts data if the market is empty.
 */
async function main() {
    console.log('🌱 [seed] Checking market data...');

    // check if any templates exist
    const templates = await db.select().from(contractTemplates).limit(1);
    if (templates.length > 0) {
        console.log('✅ [seed] Market data already exists. Skipping seed.');
        process.exit(0);
    }

    console.log('📝 [seed] Seeding initial market data...');

    // 1. Create Template (Finance)
    const [financeTemplate] = await db.insert(contractTemplates).values({
        slug: 'stripe-revenue-growth',
        title: 'Revenue Growth',
        description: 'Grow your Stripe revenue by 15% in 30 days based on your 30-day baseline.',
        category: 'finance',
        provider: 'STRIPE',
        rulesJson: {},
        tierOptionsJson: {
            standard: { minLock: 1000, maxLock: 5000, payoutMultiplier: 1.1 },
            advanced: { minLock: 5000, maxLock: 25000, payoutMultiplier: 1.2 },
            elite: { minLock: 25000, maxLock: 100000, payoutMultiplier: 1.5 },
        }
    }).returning();

    // 2. Create Template (Social)
    const [socialTemplate] = await db.insert(contractTemplates).values({
        slug: 'x-follower-growth',
        title: 'Audience Builder',
        description: 'Gain 100 new followers on X/Twitter in 30 days.',
        category: 'social',
        provider: 'X',
        rulesJson: {},
        tierOptionsJson: {
            standard: { minLock: 500, maxLock: 2000, payoutMultiplier: 1.1 },
            advanced: { minLock: 2000, maxLock: 10000, payoutMultiplier: 1.25 },
        }
    }).returning();

    // 3. Create Instances
    const now = new Date();
    const closeIn7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [inst1] = await db.insert(marketContractInstances).values({
        templateId: financeTemplate.id,
        status: 'published',
        publishAt: now,
        fundingCloseAt: closeIn7Days,
        capacityTotal: 100,
        capacityRemaining: 85,
    }).returning();

    const [inst2] = await db.insert(marketContractInstances).values({
        templateId: socialTemplate.id,
        status: 'published',
        publishAt: now,
        fundingCloseAt: closeIn7Days,
        capacityTotal: 500,
        capacityRemaining: 492,
    }).returning();

    // 4. Init Stats
    await db.insert(marketStatsCache).values([
        { instanceId: inst1.id, executions24h: 12, capitalLocked24hCents: 1250000 },
        { instanceId: inst2.id, executions24h: 45, capitalLocked24hCents: 850000 }
    ]);

    console.log('✅ [seed] Market seeded successfully.');
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ [seed] Failed:', err);
    process.exit(1);
});

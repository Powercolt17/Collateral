
import 'dotenv/config';
import { db } from './client.js';
import { contractTemplates, marketContractInstances, marketStatsCache } from './schema.js';
import { sql } from 'drizzle-orm';

/**
 * Seed Market Data
 * 
 * Safe, idempotent seed script for production.
 * Only inserts data if the market is empty.
 */
export async function seedMarket() {
    console.log('🌱 [seed] Checking market data...');

    // Safety check: Ensure tables exist before querying
    // This prevents crash if migrations failed but app continued
    try {
        const [check] = await db.execute(sql`SELECT to_regclass('public.market_contract_instances') as exists`);
        if (!check?.exists) {
            console.warn('⚠️ [seed] "market_contract_instances" table missing. Skipping seed.');
            return;
        }
    } catch (e) {
        console.warn('⚠️ [seed] Failed to check table existence. Skipping seed.', e);
        return;
    }

    // check if any templates exist
    // Use try/catch to be robust against schema issues during boot
    try {
        const templates = await db.select().from(contractTemplates).limit(1);
        if (templates.length > 0) {
            console.log('✅ [seed] Market data already exists. Skipping seed.');
            return;
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
        } as any).returning();

        const [inst2] = await db.insert(marketContractInstances).values({
            templateId: socialTemplate.id,
            status: 'published',
            publishAt: now,
            fundingCloseAt: closeIn7Days,
            capacityTotal: 500,
            capacityRemaining: 492,
        } as any).returning();

        // 4. Init Stats
        // Insert individually to avoid array type inference issues
        await db.insert(marketStatsCache).values({
            instanceId: inst1.id,
            executions1h: 0,
            executions24h: 12,
            capitalLocked1hCents: 0,
            capitalLocked24hCents: 1250000,
            capitalLockedTotalCents: 0
        } as any);

        await db.insert(marketStatsCache).values({
            instanceId: inst2.id,
            executions1h: 0,
            executions24h: 45,
            capitalLocked1hCents: 0,
            capitalLocked24hCents: 850000,
            capitalLockedTotalCents: 0
        } as any);

        console.log('✅ [seed] Market seeded successfully.');
    } catch (err) {
        console.error('❌ [seed] Error during seed:', err);
        // Don't throw, just log. We don't want to crash boot if seed fails, 
        // as the app might still be usable or the error might be transient.
    }
}

// Allow standalone execution only if run directly
// This logic checks if the file is being run as the main entry point
// @ts-ignore
if (import.meta.url === `file://${process.argv[1]}`) {
    seedMarket().then(() => process.exit(0)).catch((err) => {
        console.error('❌ [seed] Failed:', err);
        process.exit(1);
    });
}

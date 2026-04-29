/**
 * Seed Creator Referrals
 * 
 * Seeds the 13 Tier 1+2 creators from the outreach pipeline.
 * Safe to run multiple times — uses ON CONFLICT DO NOTHING on slug.
 */

import 'dotenv/config';
import { db } from './client.js';
import { creatorReferrals } from './schema.js';
import { sql } from 'drizzle-orm';

const CREATORS = [
    // TIER 1 — A_LIST ($25 bonus)
    { name: 'Jim Raptis', slug: 'jimraptis', handle: '@jraptis_', platform: 'X', tier: 'A_LIST', bonusRateCents: 2500, followerCount: 15000, score: 9 },
    { name: 'Jakob Greenfeld', slug: 'jakobgreenfeld', handle: '@jakobgreenfeld', platform: 'X', tier: 'A_LIST', bonusRateCents: 2500, followerCount: 20000, score: 9 },

    // TIER 1 — STANDARD ($10 bonus)
    { name: 'Corey Haines', slug: 'coreyhaines', handle: '@coreyhainesco', platform: 'X', tier: 'STANDARD', bonusRateCents: 1000, followerCount: 25000, score: 8 },
    { name: 'Caleb Ulffers', slug: 'calebulffers', handle: '@calebulffers', platform: 'X', tier: 'STANDARD', bonusRateCents: 1000, followerCount: 12000, score: 8 },
    { name: 'Kunle Campbell', slug: 'kunlecampbell', handle: '@KunleCampbell', platform: 'X', tier: 'STANDARD', bonusRateCents: 1000, followerCount: 15000, score: 8 },
    { name: 'Peter Kazanjy', slug: 'kazanjy', handle: '@Kazanjy', platform: 'X', tier: 'STANDARD', bonusRateCents: 1000, followerCount: 20000, score: 7 },
    { name: 'Pierre De Wulf', slug: 'pierredewulf', handle: '@PierreDeWulf', platform: 'X', tier: 'STANDARD', bonusRateCents: 1000, followerCount: 10000, score: 7 },
    { name: 'Bhanu Teja', slug: 'bhanuteja', handle: '@bhanuteja_k_', platform: 'X', tier: 'STANDARD', bonusRateCents: 1000, followerCount: 8000, score: 7 },
    { name: 'Wilson Bright', slug: 'wilsonbright', handle: '@wilsonbright', platform: 'X', tier: 'STANDARD', bonusRateCents: 1000, followerCount: 7000, score: 7 },
    { name: 'Zach Stuck', slug: 'zachstuck', handle: '@zackmstuck', platform: 'X', tier: 'STANDARD', bonusRateCents: 1000, followerCount: 12000, score: 7 },
    { name: 'Sam McKenna', slug: 'sammckenna', handle: '@sam_mckenna_', platform: 'X', tier: 'STANDARD', bonusRateCents: 1000, followerCount: 20000, score: 7 },

    // TIER 2 — STANDARD ($10 bonus)
    { name: 'Kurt Elster', slug: 'kurtelster', handle: '@kurtinc', platform: 'X', tier: 'STANDARD', bonusRateCents: 1000, followerCount: 30000, score: 8 },
    { name: 'Scott Leese', slug: 'scottleese', handle: '@ScottLeese', platform: 'X', tier: 'STANDARD', bonusRateCents: 1000, followerCount: 35000, score: 7 },
];

export async function seedCreators() {
    console.log('[Seed] Seeding creator referrals...');
    let inserted = 0;

    for (const creator of CREATORS) {
        try {
            await db.execute(sql`
                INSERT INTO creator_referrals (name, slug, platform, handle, tier, bonus_rate_cents, follower_count, score, status)
                VALUES (${creator.name}, ${creator.slug}, ${creator.platform}, ${creator.handle}, ${creator.tier}, ${creator.bonusRateCents}, ${creator.followerCount}, ${creator.score}, 'DRAFT')
                ON CONFLICT (slug) DO NOTHING
            `);
            inserted++;
        } catch (err: any) {
            console.warn(`[Seed] Skipped ${creator.slug}: ${err.message}`);
        }
    }

    console.log(`[Seed] ✅ Seeded ${inserted}/${CREATORS.length} creators`);
}

// Allow direct execution: tsx src/db/seed-creators.ts
const isDirectRun = process.argv[1]?.includes('seed-creators');
if (isDirectRun) {
    seedCreators()
        .then(() => { console.log('[Seed] Done.'); process.exit(0); })
        .catch((err) => { console.error('[Seed] Failed:', err); process.exit(1); });
}

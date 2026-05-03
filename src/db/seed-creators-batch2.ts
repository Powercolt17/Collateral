import 'dotenv/config';
import { db } from './client.js';
import { sql } from 'drizzle-orm';

const NEW_CREATORS = [
    // Tier A
    { name: 'Marc Köhlbrugge', slug: 'marckohlbrugge', handle: '@marckohlbrugge', followerCount: 25000, score: 9 },
    { name: 'Dan Kulkov', slug: 'dankulkov', handle: '@dankulkov', followerCount: 15000, score: 8 },
    { name: 'Kevon Cheung', slug: 'kevoncheung', handle: '@MeetKevon', followerCount: 20000, score: 8 },
    { name: 'Tony Dinh', slug: 'tonydinh', handle: '@tdinh_me', followerCount: 30000, score: 9 },
    { name: 'Damon Chen', slug: 'damonchen', handle: '@damengchen', followerCount: 15000, score: 8 },
    { name: 'Lara Acosta', slug: 'laraacosta', handle: '@Laraacostar', followerCount: 40000, score: 7 },
    { name: 'John Rush', slug: 'johnrush', handle: '@johnrush', followerCount: 20000, score: 8 },
    // Tier B
    { name: 'Sandra Chuk', slug: 'sandrachuk', handle: '@SandraChuk_', followerCount: 10000, score: 7 },
    { name: 'Yannick Veys', slug: 'yannickveys', handle: '@yannickveys', followerCount: 12000, score: 7 },
    { name: 'Arvid Kahl', slug: 'arvidkahl', handle: '@arvidkahl', followerCount: 45000, score: 8 },
    { name: 'KP', slug: 'kp', handle: '@thisiskp_', followerCount: 30000, score: 7 },
    { name: 'Eelco Wiersma', slug: 'eelcowiersma', handle: '@paaborhan', followerCount: 8000, score: 6 },
    { name: 'Morgan Housel', slug: 'morganhousel', handle: '@morganhousel', followerCount: 15000, score: 7 },
    // Tier C
    { name: 'Alex West', slug: 'alexwest', handle: '@alexwestco', followerCount: 15000, score: 7 },
    { name: 'Jay Clouse', slug: 'jayclouse', handle: '@jayclouse', followerCount: 25000, score: 7 },
    { name: 'Easlo', slug: 'easlo', handle: '@haborhan', followerCount: 20000, score: 6 },
    { name: 'Jurica Dujmović', slug: 'juricadujmovic', handle: '@JuricaDujmovic', followerCount: 8000, score: 6 },
    { name: 'Priyanka Vergadia', slug: 'priyankavergadia', handle: '@pvergadia', followerCount: 30000, score: 6 },
    { name: 'Florin Pop', slug: 'florinpop', handle: '@floaborhan', followerCount: 15000, score: 6 },
    { name: 'Nick Huber', slug: 'nickhuber', handle: '@swaborhan', followerCount: 35000, score: 7 },
];

async function run() {
    console.log('[Seed] Adding 20 new creator referrals...');
    let inserted = 0;

    for (const c of NEW_CREATORS) {
        try {
            await db.execute(sql`
                INSERT INTO creator_referrals (name, slug, platform, handle, tier, bonus_rate_cents, follower_count, score, status)
                VALUES (${c.name}, ${c.slug}, 'X', ${c.handle}, 'STANDARD', 1000, ${c.followerCount}, ${c.score}, 'READY')
                ON CONFLICT (slug) DO NOTHING
            `);
            inserted++;
            console.log(`  ✅ /r/${c.slug}`);
        } catch (err: any) {
            console.warn(`  ⚠️ Skipped ${c.slug}: ${err.message}`);
        }
    }

    console.log(`\n[Seed] ✅ Added ${inserted}/${NEW_CREATORS.length} new creators`);

    // Show total count
    const total = await db.execute(sql`SELECT COUNT(*) as count FROM creator_referrals`);
    const rows = Array.isArray(total) ? total : (total as any).rows ?? [];
    console.log(`[Seed] Total creators in DB: ${rows[0]?.count}`);

    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });

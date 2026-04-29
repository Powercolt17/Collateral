import 'dotenv/config';
import { db } from './client.js';
import { sql } from 'drizzle-orm';

async function run() {
    // Get all users (show first few)
    const users = await db.execute(sql`SELECT id, email, created_at FROM users ORDER BY created_at ASC LIMIT 5`);
    console.log('=== Users (oldest first) ===');
    for (const u of users.rows || users) {
        console.log(`  ${(u as any).id}  |  ${(u as any).email}  |  ${(u as any).created_at}`);
    }
    
    // Show creator count
    const creators = await db.execute(sql`SELECT COUNT(*) as count FROM creator_referrals`);
    console.log(`\n=== Creators: ${(creators.rows || creators)[0]?.count} ===`);
    
    // Show all creators with slugs
    const allCreators = await db.execute(sql`SELECT slug, name, tier, status, bonus_rate_cents FROM creator_referrals ORDER BY tier, name`);
    console.log('\n=== Creator Registry ===');
    for (const c of allCreators.rows || allCreators) {
        const cr = c as any;
        console.log(`  /r/${cr.slug.padEnd(18)} | ${cr.name.padEnd(20)} | ${cr.tier.padEnd(8)} | $${cr.bonus_rate_cents/100} | ${cr.status}`);
    }
    
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });

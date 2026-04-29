import 'dotenv/config';
import { db } from './client.js';
import { sql } from 'drizzle-orm';

async function run() {
    const users = await db.execute(sql`SELECT id, email, created_at FROM users ORDER BY created_at ASC LIMIT 5`);
    const usersArr = Array.isArray(users) ? users : (users as any).rows ?? [];
    console.log('=== Users (oldest first) ===');
    for (const u of usersArr) {
        console.log(`  ${(u as any).id}  |  ${(u as any).email}  |  ${(u as any).created_at}`);
    }
    
    const creators = await db.execute(sql`SELECT COUNT(*) as count FROM creator_referrals`);
    const creatorsArr = Array.isArray(creators) ? creators : (creators as any).rows ?? [];
    console.log(`\n=== Creators: ${creatorsArr[0]?.count} ===`);
    
    const allCreators = await db.execute(sql`SELECT slug, name, tier, status, bonus_rate_cents FROM creator_referrals ORDER BY tier, name`);
    const allArr = Array.isArray(allCreators) ? allCreators : (allCreators as any).rows ?? [];
    console.log('\n=== Creator Registry ===');
    for (const c of allArr) {
        const cr = c as any;
        console.log(`  /r/${cr.slug.padEnd(18)} | ${cr.name.padEnd(20)} | ${cr.tier.padEnd(8)} | $${cr.bonus_rate_cents/100} | ${cr.status}`);
    }
    
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });

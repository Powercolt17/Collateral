import 'dotenv/config';
import { db } from './client.js';
import { sql } from 'drizzle-orm';

async function run() {
    const updated = await db.execute(sql`UPDATE creator_referrals SET status = 'READY', updated_at = now() WHERE status = 'DRAFT'`);
    console.log(`[Update] ✅ Marked ${(updated as any).rowCount || 'all'} creators as READY\n`);

    const creators = await db.execute(sql`
        SELECT slug, name, tier, bonus_rate_cents, follower_count, handle, status 
        FROM creator_referrals 
        ORDER BY tier DESC, name ASC
    `);
    const rows = Array.isArray(creators) ? creators : (creators as any).rows ?? [];

    console.log('=== CREATOR REFERRAL LINKS (Phase 3 Ready) ===\n');
    console.log('| # | Creator | Slug | Link | Tier | Bonus | Followers | Handle | Status |');
    console.log('|---|---------|------|------|------|-------|-----------|--------|--------|');
    
    let i = 1;
    for (const c of rows) {
        const cr = c as any;
        console.log(`| ${i} | ${cr.name} | ${cr.slug} | collateral.market/r/${cr.slug} | ${cr.tier} | $${cr.bonus_rate_cents/100} | ${cr.follower_count || '?'} | ${cr.handle} | ${cr.status} |`);
        i++;
    }

    console.log('\n=== A-LIST CREATORS (Manual Profile Check Required) ===');
    const alist = rows.filter((c: any) => c.tier === 'A_LIST');
    for (const c of alist) {
        const cr = c as any;
        console.log(`  🔴 ${cr.name} (@${cr.handle.replace('@','')}) — x.com/${cr.handle.replace('@','')} — /r/${cr.slug}`);
    }

    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });

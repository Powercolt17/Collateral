import 'dotenv/config';
import { db } from '../src/db/client.js';
import { sql } from 'drizzle-orm';
import { seedCatalog } from '../src/db/seed-catalog.js';

async function main() {
    console.log('🧹 Step 1: Nuking ALL existing listings and stats...');
    
    // Delete all stats cache first (FK dependency)
    const statsDeleted = await db.execute(sql`DELETE FROM market_stats_cache`);
    console.log('   Cleared stats cache');
    
    // Delete all instances
    const instancesDeleted = await db.execute(sql`DELETE FROM market_contract_instances`);
    console.log('   Cleared all market instances');
    
    // Delete all templates (clean slate)
    const templatesDeleted = await db.execute(sql`DELETE FROM contract_templates`);
    console.log('   Cleared all templates');

    console.log('🌱 Step 2: Re-seeding fresh catalog (16 templates × 3 tiers = 48 listings)...');
    await seedCatalog();

    // Verify
    const count = await db.execute(sql`
        SELECT count(*) as total FROM market_contract_instances 
        WHERE status = 'published' AND funding_close_at > NOW()
    `);
    const total = (count as any).rows?.[0]?.total || 0;
    console.log(`\n✅ Done! ${total} active listings live.`);
    process.exit(0);
}

main().catch(e => {
    console.error('❌ Failed:', e);
    process.exit(1);
});

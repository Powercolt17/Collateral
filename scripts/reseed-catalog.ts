import 'dotenv/config';
import { db } from '../src/db/client.js';
import { sql } from 'drizzle-orm';
import { seedCatalog } from '../src/db/seed-catalog.js';

async function main() {
    console.log('🧹 Step 1: Expiring ALL old published listings...');
    const expired = await db.execute(sql`
        UPDATE market_contract_instances 
        SET status = 'expired' 
        WHERE status = 'published'
        RETURNING id
    `);
    console.log(`   Expired ${(expired as any).rows?.length || 0} old listings`);

    console.log('🗑️  Step 2: Removing old non-14d/30d templates and their instances...');
    
    // First delete stats cache for old instances
    await db.execute(sql`
        DELETE FROM market_stats_cache 
        WHERE instance_id IN (
            SELECT mci.id FROM market_contract_instances mci
            INNER JOIN contract_templates ct ON mci.template_id = ct.id
            WHERE ct.slug NOT LIKE '%-14d' AND ct.slug NOT LIKE '%-30d'
        )
    `);
    
    // Then delete old instances
    await db.execute(sql`
        DELETE FROM market_contract_instances 
        WHERE template_id IN (
            SELECT id FROM contract_templates 
            WHERE slug NOT LIKE '%-14d' AND slug NOT LIKE '%-30d'
        )
    `);
    
    // Finally delete old templates
    const deleted = await db.execute(sql`
        DELETE FROM contract_templates 
        WHERE slug NOT LIKE '%-14d' AND slug NOT LIKE '%-30d'
        RETURNING slug
    `);
    const slugs = (deleted as any).rows?.map((r: any) => r.slug) || [];
    console.log(`   Removed ${slugs.length} old templates:`, slugs);

    console.log('🌱 Step 3: Re-seeding fresh 14d/30d catalog...');
    await seedCatalog();

    console.log('✅ Done! Only 14d Sprint + 30d Marathon listings are live.');
    process.exit(0);
}

main().catch(e => {
    console.error('❌ Failed:', e);
    process.exit(1);
});

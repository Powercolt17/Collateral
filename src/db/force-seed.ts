
import 'dotenv/config';
import { db } from './client.js';
import { marketContractInstances, marketStatsCache } from './schema.js';
import { eq } from 'drizzle-orm';
import { seedCatalog } from './seed-catalog.js';

async function forceSeed() {
    console.log('🔥 [Force Seed] Clearing existing PUBLISHED listings...');

    // Delete all stats for published instances first (foreign key constraint)
    // Actually we can just delete instances and cascade if configured, but let's be safe
    // We'll delete instances with status 'published'

    // 1. Get IDs of published instances
    const published = await db.select({ id: marketContractInstances.id })
        .from(marketContractInstances)
        .where(eq(marketContractInstances.status, 'published'));

    const ids = published.map(p => p.id);
    console.log(`[Force Seed] Found ${ids.length} published listings to remove.`);

    if (ids.length > 0) {
        // Stats cache should cascade delete if FK is set up right, but if not:
        // We'll just try deleting instances.
        await db.delete(marketContractInstances)
            .where(eq(marketContractInstances.status, 'published'));
        console.log('[Force Seed] 🗑️ Deleted published listings.');
    }

    // 2. Run Seed Catalog
    console.log('[Force Seed] 🔄 Regenerating catalog with new tiers...');
    await seedCatalog();
    console.log('[Force Seed] ✅ Done. Refresh the frontend.');
}

if (process.argv[1] === import.meta.filename) {
    forceSeed()
        .then(() => process.exit(0))
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
}

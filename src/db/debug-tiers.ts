
import 'dotenv/config';
import { db } from './client.js';
import { marketContractInstances } from './schema.js';
import { sql } from 'drizzle-orm';

async function debugTiers() {
    console.log('🔍 [Debug] Checking Tier Distribution...');

    const instances = await db.select({
        id: marketContractInstances.id,
        tier: marketContractInstances.tier,
        status: marketContractInstances.status,
    }).from(marketContractInstances);

    console.log(`Total Instances: ${instances.length}`);

    const counts = {
        controlled: 0,
        elevated: 0,
        maximum: 0,
        null: 0,
        other: 0
    };

    instances.forEach(i => {
        if (i.tier === 'controlled') counts.controlled++;
        else if (i.tier === 'elevated') counts.elevated++;
        else if (i.tier === 'maximum') counts.maximum++;
        else if (!i.tier) counts.null++;
        else counts.other++;
    });

    console.table(counts);

    if (counts.null > 0 || counts.controlled === instances.length) {
        console.warn('⚠️ Data issue detecting: mostly controlled or null tiers.');
        console.warn('Run "npm run db:seed:force" to fix.');
    } else {
        console.log('✅ Data distribution looks correct.');
    }
}

if (process.argv[1] === import.meta.filename) {
    debugTiers()
        .then(() => process.exit(0))
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
}

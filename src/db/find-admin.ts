import 'dotenv/config';
import { db } from './client.js';
import { sql } from 'drizzle-orm';

async function run() {
    const r = await db.execute(sql`SELECT id, email, created_at FROM users WHERE email IS NOT NULL AND email NOT LIKE '%collateral.internal' ORDER BY created_at ASC LIMIT 10`);
    console.log('=== Real Users ===');
    for (const u of r.rows || r) {
        console.log(`  ${(u as any).id}  |  ${(u as any).email}  |  ${(u as any).created_at}`);
    }
    if ((r.rows || r).length === 0) {
        console.log('  (No non-internal users found)');
        // Fallback: show all users
        const all = await db.execute(sql`SELECT id, email FROM users ORDER BY created_at ASC LIMIT 3`);
        console.log('\n=== Fallback: First 3 users ===');
        for (const u of all.rows || all) {
            console.log(`  ${(u as any).id}  |  ${(u as any).email}`);
        }
    }
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });

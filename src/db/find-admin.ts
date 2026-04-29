import 'dotenv/config';
import { db } from './client.js';
import { sql } from 'drizzle-orm';

async function run() {
    const r = await db.execute(sql`SELECT id, email, created_at FROM users WHERE email IS NOT NULL AND email NOT LIKE '%collateral.internal' ORDER BY created_at ASC LIMIT 10`);
    const rows = Array.isArray(r) ? r : (r as any).rows ?? [];
    console.log('=== Real Users ===');
    for (const u of rows) {
        console.log(`  ${(u as any).id}  |  ${(u as any).email}  |  ${(u as any).created_at}`);
    }
    if (rows.length === 0) {
        console.log('  (No non-internal users found)');
        const all = await db.execute(sql`SELECT id, email FROM users ORDER BY created_at ASC LIMIT 3`);
        const allRows = Array.isArray(all) ? all : (all as any).rows ?? [];
        console.log('\n=== Fallback: First 3 users ===');
        for (const u of allRows) {
            console.log(`  ${(u as any).id}  |  ${(u as any).email}`);
        }
    }
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });

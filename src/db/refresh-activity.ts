/**
 * Refresh Simulated Activity — Wipes stale sim data and re-seeds
 * with fresh timestamps so the platform looks alive.
 * 
 * Run manually: npx tsx src/db/refresh-activity.ts
 * Or via ops endpoint (added below)
 * 
 * SAFE: Only touches sim_ users (@collateral.internal) — never real users.
 */

import 'dotenv/config';
import { db } from './client.js';
import { sql } from 'drizzle-orm';

export async function refreshSimulatedActivity() {
    console.log('[Refresh] 🧹 Wiping stale simulated activity...');

    // 1. Get all sim user IDs
    const simUsers = await db.execute(sql`
        SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
    `);
    const simUserIds = (Array.isArray(simUsers) ? simUsers : (simUsers as any).rows ?? [])
        .map((u: any) => u.id);

    if (simUserIds.length === 0) {
        console.log('[Refresh] No sim users found. Running fresh seed...');
    } else {
        console.log(`[Refresh] Found ${simUserIds.length} sim users. Cleaning their data...`);

        // 2. Delete in correct FK order
        // Rivalry metric snapshots
        await db.execute(sql`
            DELETE FROM rivalry_metric_snapshots WHERE rivalry_id IN (
                SELECT id FROM rivalries WHERE challenger_user_id IN (
                    SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
                ) OR opponent_user_id IN (
                    SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
                )
            )
        `);
        console.log('[Refresh]   ✓ rivalry_metric_snapshots cleared');

        // Rivalry ledger events
        await db.execute(sql`
            DELETE FROM rivalry_ledger_events WHERE rivalry_id IN (
                SELECT id FROM rivalries WHERE challenger_user_id IN (
                    SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
                ) OR opponent_user_id IN (
                    SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
                )
            )
        `);
        console.log('[Refresh]   ✓ rivalry_ledger_events cleared');

        // Rivalry participants
        await db.execute(sql`
            DELETE FROM rivalry_participants WHERE rivalry_id IN (
                SELECT id FROM rivalries WHERE challenger_user_id IN (
                    SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
                ) OR opponent_user_id IN (
                    SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
                )
            )
        `);
        console.log('[Refresh]   ✓ rivalry_participants cleared');

        // Rivalries
        await db.execute(sql`
            DELETE FROM rivalries WHERE challenger_user_id IN (
                SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
            ) OR opponent_user_id IN (
                SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
            )
        `);
        console.log('[Refresh]   ✓ rivalries cleared');

        // Contract index
        await db.execute(sql`
            DELETE FROM contract_index WHERE contract_id IN (
                SELECT id FROM contracts WHERE principal_user_id IN (
                    SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
                )
            )
        `);
        console.log('[Refresh]   ✓ contract_index cleared');

        // Ledger events
        await db.execute(sql`
            DELETE FROM ledger_events WHERE contract_id IN (
                SELECT id FROM contracts WHERE principal_user_id IN (
                    SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
                )
            )
        `);
        console.log('[Refresh]   ✓ ledger_events cleared');

        // Contracts
        await db.execute(sql`
            DELETE FROM contracts WHERE principal_user_id IN (
                SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
            )
        `);
        console.log('[Refresh]   ✓ contracts cleared');

        // Identities
        await db.execute(sql`
            DELETE FROM identities WHERE user_id IN (
                SELECT id FROM users WHERE email LIKE 'sim_%@collateral.internal'
            )
        `);
        console.log('[Refresh]   ✓ identities cleared');

        // Users themselves
        await db.execute(sql`
            DELETE FROM users WHERE email LIKE 'sim_%@collateral.internal'
        `);
        console.log('[Refresh]   ✓ sim users cleared');
    }

    console.log('[Refresh] 🌱 Re-seeding with fresh timestamps...');
    const { seedSimulatedActivity } = await import('./seed-activity.js');
    const result = await seedSimulatedActivity();
    console.log('[Refresh] 🎉 Done!', result);
    return result;
}

// Direct execution
if (process.argv[1]?.includes('refresh-activity')) {
    refreshSimulatedActivity()
        .then(r => { console.log('Result:', r); process.exit(0); })
        .catch(e => { console.error('FATAL:', e); process.exit(1); });
}

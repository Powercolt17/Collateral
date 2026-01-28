
import { sql } from 'drizzle-orm';
import { db } from '../src/db/client.js';
import { connectAccounts, accountLedgerEvents, identities } from '../src/db/schema.js';

async function main() {
    console.log('🔍 Debugging Pending Payouts...');

    // 1. Count Total PAYOUT_QUEUED events
    const allQueued = await db.execute(sql`
        SELECT 
            e.id, 
            e.user_id, 
            e.amount_cents, 
            e.created_at
        FROM account_ledger_events e
        WHERE e.event_type = 'PAYOUT_QUEUED'
    `);

    // cast result
    const events = (allQueued as any).rows || allQueued;
    console.log(`\n📊 Total PAYOUT_QUEUED events found: ${events.length}`);

    if (events.length === 0) {
        console.log('⚠️ No PAYOUT_QUEUED events exist at all.');
        process.exit(0);
    }

    // 2. Check each event against filters
    for (const evt of events) {
        console.log(`\nChecking Event ${evt.id} (User: ${evt.user_id}, Amount: ${evt.amount_cents})`);

        // Check A: Has it been sent?
        const sentCheck = await db.execute(sql`
            SELECT count(*) as count 
            FROM account_ledger_events 
            WHERE origin_event_id = ${evt.id} 
            AND event_type IN ('PAYOUT_SENT', 'PAYOUT_FAILED')
        `);
        const sentCount = Number((sentCheck as any).rows?.[0]?.count ?? (sentCheck as any)[0]?.count ?? 0);

        if (sentCount > 0) {
            console.log(`  ❌ Already processed (sent/failed).`);
            continue;
        } else {
            console.log(`  ✅ Not processed yet.`);
        }

        // Check B: Payouts Enabled?
        const accountRes = await db.execute(sql`
            SELECT stripe_connect_account_id, payouts_enabled, onboarding_status
            FROM connect_accounts
            WHERE user_id = ${evt.user_id}
        `);
        const account = (accountRes as any).rows?.[0] || (accountRes as any)[0];

        if (!account) {
            console.log(`  ❌ No Connect Account found for user.`);
            continue;
        }

        console.log(`  ℹ️ Connect Account: ${account.stripe_connect_account_id}, Status: ${account.onboarding_status}, Payouts Enabled: ${account.payouts_enabled}`);

        if (String(account.payouts_enabled) !== 'true' && account.payouts_enabled !== 1 && account.payouts_enabled !== true) {
            console.log(`  ❌ FAILURE: Payouts NOT enabled.`);
        } else {
            console.log(`  ✅ Payouts enabled.`);
        }

        // Check C: Identity Status
        const identRes = await db.execute(sql`
            SELECT status FROM identities WHERE user_id = ${evt.user_id}
        `);
        const identity = (identRes as any).rows?.[0] || (identRes as any)[0];

        if (identity) {
            console.log(`  ℹ️ Identity Status: ${identity.status}`);
            if (identity.status === 'SUSPENDED') {
                console.log(`  ❌ FAILURE: User Suspended.`);
            } else {
                console.log(`  ✅ User Active.`);
            }
        } else {
            console.log(`  ✅ No identity record (assumed Active).`);
        }
    }

    console.log('\nDone.');
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

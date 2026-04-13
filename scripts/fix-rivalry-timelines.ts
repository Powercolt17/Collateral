/**
 * Fix active rivalry timelines — the seed script set issuedAt = daysAgo(days+1)
 * instead of daysAgo(daysBack+1), making all active rivalries expire immediately.
 * This script recalculates the correct timestamps so they show proper remaining time.
 */
import 'dotenv/config';
import { db } from '../src/db/client.js';
import { sql } from 'drizzle-orm';

function daysAgo(d: number) { return new Date(Date.now() - d * 86400000); }
function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// The active rivalries and their intended timelines
const ACTIVE_FIXES = [
    { chall: 'marcusfitz',  opp: 'chelseadev',   days: 14, daysBack: 5  }, // 5d in, 9d left
    { chall: 'devinmakes',  opp: 'ryanx01',      days: 14, daysBack: 3  }, // 3d in, 11d left
    { chall: 'priyabuilds', opp: 'aminadotcom',   days: 30, daysBack: 12 }, // 12d in, 18d left
    { chall: 'miloelabs',   opp: 'andrejcodes',   days: 14, daysBack: 7  }, // 7d in, 7d left
];

async function fixTimelines() {
    for (const r of ACTIVE_FIXES) {
        // Calculate correct timestamps
        const issuedAt = daysAgo(r.daysBack + 1);
        const acceptedAt = new Date(issuedAt.getTime() + rand(2, 8) * 3600000);
        const challFundedAt = new Date(acceptedAt.getTime() + rand(1, 4) * 3600000);
        const oppFundedAt = new Date(challFundedAt.getTime() + rand(1, 6) * 3600000);
        const activatedAt = new Date(oppFundedAt.getTime() + 60000);
        const deadlineUtc = new Date(activatedAt.getTime() + r.days * 86400000);

        console.log(`Fixing ${r.chall} vs ${r.opp}: activated ${r.daysBack}d ago, ${r.days - r.daysBack}d remaining, deadline ${deadlineUtc.toISOString()}`);

        // Find the rivalry by challenger username
        const found = await db.execute(sql`
            SELECT r.id FROM rivalries r
            JOIN users u ON r.challenger_user_id = u.id
            JOIN identities i ON i.user_id = u.id
            WHERE i.username = ${r.chall}
            AND r.settled_at IS NULL
            LIMIT 1
        `);
        const rows = (found as any).rows || found;
        if (!rows || rows.length === 0) {
            console.warn(`  ⚠ Not found: ${r.chall}`);
            continue;
        }
        const rid = rows[0].id;

        // Update rivalry timestamps
        await db.execute(sql`
            UPDATE rivalries SET
                challenge_issued_at = ${issuedAt.toISOString()},
                accepted_at = ${acceptedAt.toISOString()},
                funded_at = ${oppFundedAt.toISOString()},
                activated_at = ${activatedAt.toISOString()},
                deadline_utc = ${deadlineUtc.toISOString()},
                created_at = ${issuedAt.toISOString()},
                updated_at = ${new Date().toISOString()}
            WHERE id = ${rid}
        `);

        // Update participant funded_at and baseline_snapshot_at
        await db.execute(sql`
            UPDATE rivalry_participants SET
                funded_at = ${challFundedAt.toISOString()},
                baseline_snapshot_at = ${activatedAt.toISOString()}
            WHERE rivalry_id = ${rid} AND role = 'challenger'
        `);
        await db.execute(sql`
            UPDATE rivalry_participants SET
                funded_at = ${oppFundedAt.toISOString()},
                baseline_snapshot_at = ${activatedAt.toISOString()}
            WHERE rivalry_id = ${rid} AND role = 'opponent'
        `);

        // Update rivalry ledger event timestamps
        await db.execute(sql`
            UPDATE rivalry_ledger_events SET timestamp_utc = ${issuedAt.toISOString()}
            WHERE rivalry_id = ${rid} AND event_type = 'RIVALRY_CREATED'
        `);
        await db.execute(sql`
            UPDATE rivalry_ledger_events SET timestamp_utc = ${acceptedAt.toISOString()}
            WHERE rivalry_id = ${rid} AND event_type = 'RIVALRY_ACCEPTED'
        `);
        await db.execute(sql`
            UPDATE rivalry_ledger_events SET timestamp_utc = ${challFundedAt.toISOString()}
            WHERE rivalry_id = ${rid} AND event_type = 'RIVALRY_CHALLENGER_FUNDED'
        `);
        await db.execute(sql`
            UPDATE rivalry_ledger_events SET timestamp_utc = ${oppFundedAt.toISOString()}
            WHERE rivalry_id = ${rid} AND event_type = 'RIVALRY_OPPONENT_FUNDED'
        `);
        await db.execute(sql`
            UPDATE rivalry_ledger_events SET timestamp_utc = ${new Date(oppFundedAt.getTime() + 30000).toISOString()}
            WHERE rivalry_id = ${rid} AND event_type = 'RIVALRY_BOTH_FUNDED'
        `);
        await db.execute(sql`
            UPDATE rivalry_ledger_events SET timestamp_utc = ${activatedAt.toISOString()}
            WHERE rivalry_id = ${rid} AND event_type = 'RIVALRY_ACTIVATED'
        `);
        await db.execute(sql`
            UPDATE rivalry_ledger_events SET timestamp_utc = ${new Date(activatedAt.getTime() + 60000).toISOString()}
            WHERE rivalry_id = ${rid} AND event_type = 'RIVALRY_BASELINE_CAPTURED'
        `);

        // Fix metric snapshot timestamps — redistribute within the active period
        const snapshots = await db.execute(sql`
            SELECT id, user_id FROM rivalry_metric_snapshots
            WHERE rivalry_id = ${rid}
            ORDER BY fetched_at ASC
        `);
        const snaps = (snapshots as any).rows || snapshots;
        
        // Group by user_id
        const byUser: Record<string, string[]> = {};
        for (const s of snaps) {
            if (!byUser[s.user_id]) byUser[s.user_id] = [];
            byUser[s.user_id].push(s.id);
        }

        for (const [uid, ids] of Object.entries(byUser)) {
            for (let i = 0; i < ids.length; i++) {
                const dayOffset = i; // one snapshot per day
                const fetchedAt = new Date(activatedAt.getTime() + dayOffset * 86400000 + rand(0, 43200000));
                if (fetchedAt > new Date()) break; // don't set future timestamps
                await db.execute(sql`
                    UPDATE rivalry_metric_snapshots
                    SET fetched_at = ${fetchedAt.toISOString()},
                        created_at = ${fetchedAt.toISOString()}
                    WHERE id = ${ids[i]}
                `);
            }
        }

        console.log(`  ✅ Fixed: ${r.days - r.daysBack}d remaining`);
    }
}

fixTimelines()
    .then(() => { console.log('Done'); process.exit(0); })
    .catch(e => { console.error('Error:', e); process.exit(1); });

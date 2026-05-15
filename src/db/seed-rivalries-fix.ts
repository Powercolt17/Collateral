/**
 * Fix Rivalry Seed — Cleans bad rivalry data and re-seeds with correct
 * event types matching RivalryEventType constants so the state derivation
 * works and rivalries show up in the frontend.
 *
 * ALL rivalries are 1v1 (directed, both sides funded, active or settled).
 * NO open challenges. Rich metric snapshot data for live-looking charts.
 */

import 'dotenv/config';
import { db } from './client.js';
import { sql } from 'drizzle-orm';
import { createHash, randomUUID } from 'crypto';

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function daysAgo(d: number) { return new Date(Date.now() - d * 86400000); }
function hoursAgo(h: number) { return new Date(Date.now() - h * 3600000); }
function hashEvent(data: string): string { return createHash('sha256').update(data).digest('hex'); }

async function appendRivalryLedgerEvent(
    rid: string, eventType: string, ts: Date,
    userId: string | null, amountCents: number | null,
    prevHash: string, meta: any = { simulated: true }
): Promise<string> {
    const eid = randomUUID();
    const eventHash = hashEvent(prevHash + eid + eventType + ts.toISOString());
    await db.execute(sql`
        INSERT INTO rivalry_ledger_events (
            id, rivalry_id, actor, event_type, user_id,
            timestamp_utc, amount_usd_cents,
            metadata_json, prev_event_hash, event_hash
        ) VALUES (
            ${eid}, ${rid}, 'SYSTEM', ${eventType}, ${userId},
            ${ts.toISOString()}, ${amountCents},
            ${JSON.stringify(meta)},
            ${prevHash}, ${eventHash}
        )
    `);
    return eventHash;
}

export async function fixRivalryData() {
    console.log('[Fix Rivalries] 🧹 Cleaning old rivalry data...');

    // 1. Delete old broken rivalry data (wrong event types)
    await db.execute(sql`DELETE FROM rivalry_metric_snapshots WHERE rivalry_id IN (
        SELECT r.id FROM rivalries r
        JOIN users u ON r.challenger_user_id = u.id
        WHERE u.email LIKE '%@collateral.internal'
    )`);
    await db.execute(sql`DELETE FROM rivalry_ledger_events WHERE rivalry_id IN (
        SELECT r.id FROM rivalries r
        JOIN users u ON r.challenger_user_id = u.id
        WHERE u.email LIKE '%@collateral.internal'
    )`);
    await db.execute(sql`DELETE FROM rivalry_participants WHERE rivalry_id IN (
        SELECT r.id FROM rivalries r
        JOIN users u ON r.challenger_user_id = u.id
        WHERE u.email LIKE '%@collateral.internal'
    )`);
    await db.execute(sql`DELETE FROM rivalries WHERE id IN (
        SELECT r.id FROM rivalries r
        JOIN users u ON r.challenger_user_id = u.id
        WHERE u.email LIKE '%@collateral.internal'
    )`);
    console.log('[Fix Rivalries] ✅ Cleaned old rivalry data');

    // 2. Get sim user IDs
    const simUsers = await db.execute(sql`
        SELECT u.id, i.username FROM users u
        JOIN identities i ON i.user_id = u.id
        WHERE u.email LIKE '%@collateral.internal'
        ORDER BY i.username
    `);
    const users = (simUsers as any).rows || simUsers;
    if (!users || users.length < 8) {
        console.error('[Fix Rivalries] Not enough sim users found. Run seed-activity first.');
        return;
    }
    console.log(`[Fix Rivalries] Found ${users.length} sim users`);

    // Map usernames to IDs for easy lookup
    const userMap: Record<string, string> = {};
    for (const u of users) {
        userMap[u.username] = u.id;
    }

    // 3. Define realistic 1v1 rivalries — ALL have both sides, ALL funded
    const RIVALRIES = [
        // --- ACTIVE rivalries (happening RIGHT NOW) ---
        {
            chall: 'marcusfitz', opp: 'chelseadev',
            platform: 'STRIPE', metricType: 'REVENUE', metricKey: 'stripe_net_revenue',
            stake: 25000, days: 14, daysBack: 5,  // started 5 days ago, 9d left
            settled: false,
            challBaseline: 185000, oppBaseline: 142000,  // cents
            challGrowthRate: 8.2, oppGrowthRate: 11.4,   // % so far
        },
        {
            chall: 'devinmakes', opp: 'ryanx01',
            platform: 'X', metricType: 'FOLLOWERS', metricKey: 'x_followers',
            stake: 15000, days: 14, daysBack: 3,  // started 3 days ago, 11d left
            settled: false,
            challBaseline: 12400, oppBaseline: 8900,
            challGrowthRate: 4.1, oppGrowthRate: 6.8,
        },
        {
            chall: 'priyabuilds', opp: 'aminadotcom',
            platform: 'SHOPIFY', metricType: 'GROSS_SALES', metricKey: 'shopify_net_sales',
            stake: 50000, days: 30, daysBack: 12,  // started 12 days ago, 18d left
            settled: false,
            challBaseline: 340000, oppBaseline: 280000,
            challGrowthRate: 14.5, oppGrowthRate: 9.2,
        },
        {
            chall: 'miloelabs', opp: 'andrejcodes',
            platform: 'YOUTUBE', metricType: 'SUBSCRIBERS', metricKey: 'youtube_subscribers',
            stake: 20000, days: 14, daysBack: 7,  // started 7 days ago, 7d left — halfway!
            settled: false,
            challBaseline: 24500, oppBaseline: 31200,
            challGrowthRate: 5.6, oppGrowthRate: 3.1,
        },

        // --- SETTLED rivalries (completed, shows history) ---
        {
            chall: 'tylerbrooks', opp: 'itsnataliex',
            platform: 'X', metricType: 'FOLLOWERS', metricKey: 'x_followers',
            stake: 10000, days: 14, daysBack: 0,  // settled 0 days ago (just finished)
            settled: true, winnerSide: 'opponent',
            challBaseline: 18200, oppBaseline: 9400,
            challFinalGrowth: 12.3, oppFinalGrowth: 19.8,
        },
        {
            chall: 'sarabizops', opp: 'jakevoss',
            platform: 'STRIPE', metricType: 'REVENUE', metricKey: 'stripe_net_revenue',
            stake: 75000, days: 30, daysBack: 2,  // settled 2 days ago
            settled: true, winnerSide: 'challenger',
            challBaseline: 520000, oppBaseline: 410000,
            challFinalGrowth: 22.1, oppFinalGrowth: 11.4,
        },
        {
            chall: 'clodigital', opp: 'emmaburke',
            platform: 'YOUTUBE', metricType: 'VIEWS', metricKey: 'youtube_30day_views',
            stake: 30000, days: 14, daysBack: 5,  // settled 5 days ago
            settled: true, winnerSide: 'challenger',
            challBaseline: 450000, oppBaseline: 680000,
            challFinalGrowth: 28.4, oppFinalGrowth: 8.9,
        },
        {
            chall: 'lilydao', opp: 'maxfoundr',
            platform: 'SHOPIFY', metricType: 'ORDER_COUNT', metricKey: 'shopify_order_volume',
            stake: 20000, days: 14, daysBack: 8,  // settled 8 days ago
            settled: true, winnerSide: 'opponent',
            challBaseline: 340, oppBaseline: 520,
            challFinalGrowth: 9.4, oppFinalGrowth: 18.1,
        },
    ];

    let count = 0;
    for (const r of RIVALRIES) {
        const challengerId = userMap[r.chall];
        const opponentId = userMap[r.opp];
        if (!challengerId || !opponentId) {
            console.warn(`[Fix Rivalries] Skipping ${r.chall} vs ${r.opp}: missing user IDs`);
            continue;
        }

        const rid = randomUUID();
        const totalPeriod = r.days + (r.settled ? r.daysBack : 0);
        const issuedAt = daysAgo(totalPeriod + 1); // issued 1 day before activation
        const acceptedAt = new Date(issuedAt.getTime() + rand(2, 12) * 3600000);
        const challFundedAt = new Date(acceptedAt.getTime() + rand(1, 4) * 3600000);
        const oppFundedAt = new Date(challFundedAt.getTime() + rand(1, 6) * 3600000);
        const activatedAt = new Date(oppFundedAt.getTime() + 60000);
        const deadlineUtc = new Date(activatedAt.getTime() + r.days * 86400000);
        const settledAt = r.settled ? new Date(deadlineUtc.getTime() + rand(1, 4) * 3600000) : null;

        const winnerId = r.settled
            ? (r.winnerSide === 'challenger' ? challengerId : opponentId)
            : null;
        const poolCents = r.stake * 2;
        const feeCents = Math.round(poolCents * 0.12);
        const winnerPayout = poolCents - feeCents;

        // Insert rivalry record
        await db.execute(sql`
            INSERT INTO rivalries (
                id, challenger_user_id, opponent_user_id,
                platform, metric_type, metric_key,
                stake_per_side_cents, duration_days,
                acceptance_ttl_hours, funding_ttl_hours, protocol_fee_bps,
                target_growth_pct, rivalry_tier,
                challenge_issued_at, accepted_at, funded_at, activated_at,
                deadline_utc, settled_at, winner_user_id,
                settlement_metadata,
                created_at, updated_at
            ) VALUES (
                ${rid}, ${challengerId}, ${opponentId},
                ${r.platform}, ${r.metricType}, ${r.metricKey},
                ${r.stake}, ${r.days},
                72, 48, 1200,
                '15', 'DUEL',
                ${issuedAt.toISOString()}, ${acceptedAt.toISOString()}, ${oppFundedAt.toISOString()}, ${activatedAt.toISOString()},
                ${deadlineUtc.toISOString()}, ${settledAt?.toISOString() || null}, ${winnerId},
                ${r.settled ? JSON.stringify({ winnerPayout, feeCents, pool: poolCents }) : null},
                ${issuedAt.toISOString()}, ${(settledAt || new Date()).toISOString()}
            )
        `);

        // Insert participants with growth data
        const challCurrentGrowth = r.settled ? (r as any).challFinalGrowth : r.challGrowthRate;
        const oppCurrentGrowth = r.settled ? (r as any).oppFinalGrowth : r.oppGrowthRate;
        // Always compute final values — even for active rivalries (shows current progress)
        const challFinalValue = Math.round(r.challBaseline * (1 + challCurrentGrowth / 100));
        const oppFinalValue = Math.round(r.oppBaseline * (1 + oppCurrentGrowth / 100));

        for (const side of [
            { uid: challengerId, role: 'challenger', bv: r.challBaseline, growth: challCurrentGrowth, fv: challFinalValue },
            { uid: opponentId, role: 'opponent', bv: r.oppBaseline, growth: oppCurrentGrowth, fv: oppFinalValue }
        ]) {
            const absDelta = side.fv - side.bv;
            const isWinner = winnerId === side.uid;
            await db.execute(sql`
                INSERT INTO rivalry_participants (
                    id, rivalry_id, user_id, role, funded, funded_at,
                    baseline_value, baseline_json, baseline_snapshot_at,
                    final_value, final_json, final_snapshot_at,
                    absolute_delta, percentage_delta,
                    outcome, payout_cents
                ) VALUES (
                    ${randomUUID()}, ${rid}, ${side.uid}, ${side.role}, true,
                    ${side.role === 'challenger' ? challFundedAt.toISOString() : oppFundedAt.toISOString()},
                    ${side.bv.toString()}, ${JSON.stringify({ value: side.bv })}, ${activatedAt.toISOString()},
                    ${side.fv.toString()}, ${JSON.stringify({ value: side.fv, simulated: true })},
                    ${settledAt?.toISOString() || new Date().toISOString()},
                    ${absDelta.toString()}, ${side.growth.toFixed(2)},
                    ${r.settled ? (isWinner ? 'WIN' : 'LOSS') : null},
                    ${r.settled ? (isWinner ? winnerPayout : 0) : null}
                )
            `);
        }

        // Append CORRECT ledger events using RivalryEventType constants
        let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';

        // 1. RIVALRY_CREATED
        prevHash = await appendRivalryLedgerEvent(rid, 'RIVALRY_CREATED', issuedAt, challengerId, r.stake, prevHash, {
            simulated: true, challengerUserId: challengerId, opponentUserId: opponentId,
            platform: r.platform, metricType: r.metricType, stakePerSideCents: r.stake,
        });

        // 2. RIVALRY_ACCEPTED
        prevHash = await appendRivalryLedgerEvent(rid, 'RIVALRY_ACCEPTED', acceptedAt, opponentId, null, prevHash);

        // 3. RIVALRY_CHALLENGER_FUNDED
        prevHash = await appendRivalryLedgerEvent(rid, 'RIVALRY_CHALLENGER_FUNDED', challFundedAt, challengerId, r.stake, prevHash);

        // 4. RIVALRY_OPPONENT_FUNDED
        prevHash = await appendRivalryLedgerEvent(rid, 'RIVALRY_OPPONENT_FUNDED', oppFundedAt, opponentId, r.stake, prevHash);

        // 5. RIVALRY_BOTH_FUNDED
        prevHash = await appendRivalryLedgerEvent(rid, 'RIVALRY_BOTH_FUNDED', new Date(oppFundedAt.getTime() + 30000), null, poolCents, prevHash, {
            totalPoolCents: poolCents,
        });

        // 6. RIVALRY_ACTIVATED
        prevHash = await appendRivalryLedgerEvent(rid, 'RIVALRY_ACTIVATED', activatedAt, null, null, prevHash, {
            activatedAt: activatedAt.toISOString(),
            deadlineUtc: deadlineUtc.toISOString(),
            durationDays: r.days,
        });

        // 7. RIVALRY_BASELINE_CAPTURED (doesn't affect state, but adds realism)
        prevHash = await appendRivalryLedgerEvent(rid, 'RIVALRY_BASELINE_CAPTURED', new Date(activatedAt.getTime() + 60000), null, null, prevHash, {
            challenger: { baseline: r.challBaseline },
            opponent: { baseline: r.oppBaseline },
        });

        // 8. If settled: RIVALRY_VERIFICATION_STARTED → RIVALRY_VERIFIED → RIVALRY_SETTLEMENT_STARTED → RIVALRY_SETTLED
        if (r.settled && settledAt) {
            const verifyStart = new Date(deadlineUtc.getTime() + 600000);
            const verified = new Date(deadlineUtc.getTime() + 1800000);
            const settlementStart = new Date(settledAt.getTime() - 600000);

            prevHash = await appendRivalryLedgerEvent(rid, 'RIVALRY_VERIFICATION_STARTED', verifyStart, null, null, prevHash);
            prevHash = await appendRivalryLedgerEvent(rid, 'RIVALRY_VERIFIED', verified, null, null, prevHash, {
                challenger: { finalValue: challFinalValue, growth: challCurrentGrowth },
                opponent: { finalValue: oppFinalValue, growth: oppCurrentGrowth },
            });
            prevHash = await appendRivalryLedgerEvent(rid, 'RIVALRY_SETTLEMENT_STARTED', settlementStart, null, poolCents, prevHash);
            prevHash = await appendRivalryLedgerEvent(rid, 'RIVALRY_SETTLED', settledAt, winnerId, winnerPayout, prevHash, {
                winnerUserId: winnerId,
                winnerPayout,
                feeCents,
                pool: poolCents,
            });
        }

        // 9. Metric snapshots — realistic daily data points
        const daysActive = r.settled ? r.days : r.daysBack;
        for (let d = 0; d <= daysActive; d++) {
            const fetchedAt = new Date(activatedAt.getTime() + d * 86400000 + rand(0, 43200000));
            if (fetchedAt > new Date()) break; // don't create future snapshots

            for (const side of [
                { uid: challengerId, bv: r.challBaseline, targetGrowth: r.settled ? (r as any).challFinalGrowth : r.challGrowthRate },
                { uid: opponentId, bv: r.oppBaseline, targetGrowth: r.settled ? (r as any).oppFinalGrowth : r.oppGrowthRate }
            ]) {
                // Simulate organic growth with some noise
                const progress = d / Math.max(r.days, 1);
                const baseGrowth = side.targetGrowth * progress;
                // Add daily noise: ±2% of target growth
                const noise = (Math.random() - 0.5) * side.targetGrowth * 0.15;
                const dayGrowth = Math.max(0, baseGrowth + noise);
                const value = Math.round(side.bv * (1 + dayGrowth / 100));

                await db.execute(sql`
                    INSERT INTO rivalry_metric_snapshots (
                        id, rivalry_id, user_id, provider, metric_key,
                        metric_value, fetched_at, created_at
                    ) VALUES (
                        ${randomUUID()}, ${rid}, ${side.uid}, ${r.platform.toLowerCase()}, ${r.metricKey},
                        ${value.toString()}, ${fetchedAt.toISOString()}, ${fetchedAt.toISOString()}
                    )
                `);
            }
        }

        count++;
        console.log(`[Fix Rivalries] ✅ ${r.chall} vs ${r.opp} (${r.settled ? 'SETTLED' : 'ACTIVE'}) — $${(r.stake/100).toLocaleString()}/side`);
    }

    console.log(`[Fix Rivalries] 🎉 Created ${count} rivalries (${RIVALRIES.filter(r => r.settled).length} settled, ${RIVALRIES.filter(r => !r.settled).length} active)`);
    return { rivalries: count };
}

// CLI runner
fixRivalryData()
    .then(result => {
        console.log('[Fix Rivalries] Done:', result);
        process.exit(0);
    })
    .catch(e => {
        console.error('[Fix Rivalries] FATAL:', e);
        process.exit(1);
    });

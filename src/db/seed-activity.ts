/**
 * Seed Simulated Activity — Populates the site with realistic-looking
 * solo contracts and rivalries so the platform appears active.
 * 
 * Run via admin endpoint: POST /v1/admin/seed-activity
 * Requires x-admin-key header
 */

import 'dotenv/config';
import { db } from './client.js';
import { sql } from 'drizzle-orm';
import { createHash, randomUUID } from 'crypto';

// ============================================================================
// FAKE USERS (sim_ prefix to identify simulated accounts)
// ============================================================================
const SIM_USERS = [
    { handle: 'marcusfitz', display: 'Marcus Fitzgerald' },
    { handle: 'chelseadev', display: 'Chelsea Park' },
    { handle: 'jakevoss', display: 'Jake Voss' },
    { handle: 'itsnataliex', display: 'Natalie Chen' },
    { handle: 'tylerbrooks', display: 'Tyler Brooks' },
    { handle: 'aminadotcom', display: 'Amina Okafor' },
    { handle: 'ryanx01', display: 'Ryan Xu' },
    { handle: 'clodigital', display: 'Chloe Deschamps' },
    { handle: 'devinmakes', display: 'Devin Morales' },
    { handle: 'sarabizops', display: 'Sara Kim' },
    { handle: 'miloelabs', display: 'Milo Edwards' },
    { handle: 'priyabuilds', display: 'Priya Sharma' },
];

// Platforms and metrics for realistic contracts
const CONTRACT_SCENARIOS = [
    { platform: 'X', metric: 'FOLLOWERS', metricKey: 'x_followers', label: 'Follower Growth' },
    { platform: 'STRIPE', metric: 'REVENUE', metricKey: 'stripe_net_revenue', label: 'Net Revenue Growth' },
    { platform: 'YOUTUBE', metric: 'SUBSCRIBERS', metricKey: 'youtube_subscribers', label: 'Subscriber Growth' },
    { platform: 'YOUTUBE', metric: 'VIEWS', metricKey: 'youtube_views', label: 'Views Growth' },
    { platform: 'SHOPIFY', metric: 'REVENUE', metricKey: 'shopify_net_sales', label: 'Store Net Sales' },
    { platform: 'X', metric: 'FOLLOWERS', metricKey: 'x_followers', label: 'Follower Growth' },
    { platform: 'STRIPE', metric: 'REVENUE', metricKey: 'stripe_net_revenue', label: 'Revenue Growth' },
    { platform: 'SHOPIFY', metric: 'ORDER_COUNT', metricKey: 'shopify_order_volume', label: 'Order Volume' },
];

const TIERS = ['STANDARD', 'ADVANCED', 'ELITE'] as const;
const TIER_MULTIPLIERS = { STANDARD: 1.7, ADVANCED: 2.5, ELITE: 4.0 };
const TIER_LABELS = { STANDARD: 'controlled', ADVANCED: 'elevated', ELITE: 'maximum' };

function randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(days: number): Date {
    return new Date(Date.now() - days * 86400000);
}

function hashEvent(data: string): string {
    return createHash('sha256').update(data).digest('hex');
}

export async function seedSimulatedActivity() {
    console.log('[Seed Activity] Starting simulated activity seeding...');

    // 1. Create simulated users
    const userIds: string[] = [];
    for (const u of SIM_USERS) {
        const id = randomUUID();
        await db.execute(sql`
            INSERT INTO users (id, email, x_username, created_at)
            VALUES (${id}, ${'sim_' + u.handle + '@collateral.internal'}, ${u.handle}, ${daysAgo(randomBetween(30, 90)).toISOString()})
            ON CONFLICT DO NOTHING
        `);
        userIds.push(id);
    }
    console.log(`[Seed Activity] Created ${userIds.length} simulated users`);

    // 2. Create identities for simulated users
    for (let i = 0; i < userIds.length; i++) {
        await db.execute(sql`
            INSERT INTO identities (id, user_id, display_name, username, avatar_url, status, created_at)
            VALUES (${randomUUID()}, ${userIds[i]}, ${SIM_USERS[i].display}, ${SIM_USERS[i].handle}, NULL, 'ACTIVE', NOW())
            ON CONFLICT DO NOTHING
        `);
    }

    // 3. Create settled solo contracts (mix of wins and losses)
    const contractIds: string[] = [];
    const numContracts = 18; // 18 settled contracts

    for (let i = 0; i < numContracts; i++) {
        const cid = randomUUID();
        contractIds.push(cid);

        const userIdx = i % userIds.length;
        const userId = userIds[userIdx];
        const username = SIM_USERS[userIdx].handle;
        const scenario = CONTRACT_SCENARIOS[i % CONTRACT_SCENARIOS.length];
        const tier = TIERS[i % 3];
        const isWin = Math.random() < 0.30; // 30% win rate matches house edge
        const daysBack = randomBetween(3, 28);
        const windowDays = i % 2 === 0 ? 14 : 30;
        const lockCents = [10000, 15000, 25000, 50000, 75000, 100000][i % 6];
        const payoutCents = Math.round(lockCents * TIER_MULTIPLIERS[tier]);
        const createdAt = daysAgo(daysBack + windowDays);
        const deadline = daysAgo(daysBack);
        const settledAt = new Date(deadline.getTime() + 3600000); // 1h after deadline

        // Baseline values
        const baselineValue = scenario.metric === 'REVENUE'
            ? randomBetween(100000, 500000) // $1k-$5k
            : randomBetween(1000, 50000); // followers/subs

        const targetPct = tier === 'STANDARD' ? 25 : tier === 'ADVANCED' ? 35 : 50;
        const targetValue = Math.round(baselineValue * (1 + targetPct / 100));
        const finalValue = isWin
            ? Math.round(targetValue * (1 + Math.random() * 0.1)) // exceeded
            : Math.round(baselineValue * (1 + Math.random() * (targetPct / 100) * 0.7)); // fell short

        // Insert contract
        await db.execute(sql`
            INSERT INTO contracts (
                id, principal_user_id, principal_identity_username,
                platform, metric_type, condition_json, baseline_json,
                deadline_utc, lock_amount_usd_cents, payout_amount_usd_cents,
                funding_method, risk_tier, created_at, updated_at
            ) VALUES (
                ${cid}, ${userId}, ${username},
                ${scenario.platform}, ${scenario.metric},
                ${JSON.stringify({ threshold: targetValue, operator: 'gte', targetPct })},
                ${JSON.stringify({ platform: scenario.platform, value: baselineValue, measuredAtUtc: createdAt.toISOString() })},
                ${deadline.toISOString()}, ${lockCents}, ${payoutCents},
                'USD_CARD', ${tier},
                ${createdAt.toISOString()}, ${settledAt.toISOString()}
            )
        `);

        // Insert ledger events chain
        const events: { type: string; ts: Date; meta: Record<string, any> }[] = [
            { type: 'CONTRACT_CREATED', ts: createdAt, meta: { simulated: true } },
            { type: 'FUNDS_AUTHORIZED', ts: new Date(createdAt.getTime() + 60000), meta: { amountUsdCents: lockCents, paymentIntentId: 'pi_sim_' + cid.slice(0, 8) } },
            { type: 'FUNDS_LOCKED', ts: new Date(createdAt.getTime() + 120000), meta: { amountUsdCents: lockCents } },
            { type: 'EXECUTION_CONFIRMED', ts: new Date(createdAt.getTime() + 180000), meta: { confirmedAt: new Date(createdAt.getTime() + 180000).toISOString() } },
        ];

        // Add settlement event
        if (isWin) {
            events.push({
                type: 'SETTLED_SUCCESS',
                ts: settledAt,
                meta: { outcome: 'WIN', finalValue, payoutAmountCents: payoutCents }
            });
        } else {
            events.push({
                type: 'SETTLED_FAILURE',
                ts: settledAt,
                meta: { outcome: 'LOSS', finalValue, forfeitedCents: lockCents }
            });
        }

        let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
        for (const evt of events) {
            const eid = randomUUID();
            const eventHash = hashEvent(prevHash + eid + evt.type);
            await db.execute(sql`
                INSERT INTO ledger_events (
                    id, contract_id, actor, event_type, timestamp_utc,
                    amount_usd_cents, metadata_json, prev_event_hash, event_hash
                ) VALUES (
                    ${eid}, ${cid}, 'SYSTEM', ${evt.type}, ${evt.ts.toISOString()},
                    ${evt.meta?.amountUsdCents || null}, ${JSON.stringify(evt.meta)},
                    ${prevHash}, ${eventHash}
                )
            `);
            prevHash = eventHash;
        }
    }
    console.log(`[Seed Activity] Created ${contractIds.length} settled contracts`);

    // 4. Create simulated rivalries (mix of active, settled)
    const rivalryData = [
        { c: 0, o: 3, platform: 'X', metric: 'FOLLOWERS', key: 'x_followers', stake: 25000, days: 14, settled: true, winIdx: 0 },
        { c: 1, o: 4, platform: 'STRIPE', metric: 'REVENUE', key: 'stripe_net_revenue', stake: 50000, days: 30, settled: true, winIdx: 4 },
        { c: 2, o: 5, platform: 'YOUTUBE', metric: 'SUBSCRIBERS', key: 'youtube_subscribers', stake: 15000, days: 14, settled: true, winIdx: 2 },
        { c: 6, o: 7, platform: 'SHOPIFY', metric: 'REVENUE', key: 'shopify_net_sales', stake: 100000, days: 30, settled: true, winIdx: 7 },
        { c: 8, o: 9, platform: 'X', metric: 'FOLLOWERS', key: 'x_followers', stake: 25000, days: 14, settled: false },
        { c: 10, o: 11, platform: 'STRIPE', metric: 'REVENUE', key: 'stripe_net_revenue', stake: 75000, days: 30, settled: false },
        { c: 0, o: 6, platform: 'YOUTUBE', metric: 'VIEWS', key: 'youtube_views', stake: 20000, days: 14, settled: false },
    ];

    for (const r of rivalryData) {
        const rid = randomUUID();
        const challengerId = userIds[r.c];
        const opponentId = userIds[r.o];
        const daysBack = r.settled ? randomBetween(5, 25) : randomBetween(1, 5);
        const issuedAt = daysAgo(daysBack + r.days);
        const acceptedAt = new Date(issuedAt.getTime() + randomBetween(1, 24) * 3600000);
        const fundedAt = new Date(acceptedAt.getTime() + randomBetween(1, 12) * 3600000);
        const activatedAt = new Date(fundedAt.getTime() + 60000);
        const deadlineUtc = new Date(activatedAt.getTime() + r.days * 86400000);
        const settledAt = r.settled ? new Date(deadlineUtc.getTime() + 3600000) : null;
        const winnerId = r.settled && r.winIdx !== undefined ? userIds[r.winIdx] : null;
        const poolCents = r.stake * 2;
        const feeCents = Math.round(poolCents * 0.12);
        const winnerPayout = poolCents - feeCents;

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
                ${r.platform}, ${r.metric}, ${r.key},
                ${r.stake}, ${r.days},
                72, 48, 1200,
                '15', 'DUEL',
                ${issuedAt.toISOString()}, ${acceptedAt.toISOString()}, ${fundedAt.toISOString()}, ${activatedAt.toISOString()},
                ${deadlineUtc.toISOString()}, ${settledAt?.toISOString() || null}, ${winnerId},
                ${r.settled ? JSON.stringify({ winnerPayout, feeCents, pool: poolCents }) : null},
                ${issuedAt.toISOString()}, ${(settledAt || new Date()).toISOString()}
            )
        `);

        // Rivalry participants
        const cBaselineVal = r.metric === 'REVENUE' ? randomBetween(100000, 400000) : randomBetween(2000, 40000);
        const oBaselineVal = r.metric === 'REVENUE' ? randomBetween(100000, 400000) : randomBetween(2000, 40000);

        for (const side of [{ uid: challengerId, role: 'challenger', bv: cBaselineVal }, { uid: opponentId, role: 'opponent', bv: oBaselineVal }]) {
            const fv = r.settled
                ? Math.round(side.bv * (1 + (Math.random() * 0.4)))
                : null;
            const pctDelta = fv ? (((fv - side.bv) / side.bv) * 100).toFixed(2) : null;
            const isWinner = winnerId === side.uid;

            await db.execute(sql`
                INSERT INTO rivalry_participants (
                    id, rivalry_id, user_id, role, funded, funded_at,
                    baseline_value, baseline_json, baseline_snapshot_at,
                    final_value, final_json, final_snapshot_at,
                    absolute_delta, percentage_delta,
                    outcome, payout_cents
                ) VALUES (
                    ${randomUUID()}, ${rid}, ${side.uid}, ${side.role}, true, ${fundedAt.toISOString()},
                    ${side.bv.toString()}, ${JSON.stringify({ value: side.bv })}, ${activatedAt.toISOString()},
                    ${fv?.toString() || null}, ${fv ? JSON.stringify({ value: fv }) : null}, ${settledAt?.toISOString() || null},
                    ${fv ? (fv - side.bv).toString() : null}, ${pctDelta},
                    ${r.settled ? (isWinner ? 'WIN' : 'LOSS') : null},
                    ${r.settled ? (isWinner ? winnerPayout : 0) : null}
                )
            `);
        }

        // Rivalry ledger events
        const rEvents = [
            { type: 'CHALLENGE_ISSUED', ts: issuedAt, uid: challengerId },
            { type: 'CHALLENGE_ACCEPTED', ts: acceptedAt, uid: opponentId },
            { type: 'FUNDS_LOCKED', ts: fundedAt, uid: challengerId },
            { type: 'FUNDS_LOCKED', ts: new Date(fundedAt.getTime() + 60000), uid: opponentId },
            { type: 'RIVALRY_ACTIVATED', ts: activatedAt, uid: null },
        ];
        if (r.settled) {
            rEvents.push({ type: 'RIVALRY_SETTLED', ts: settledAt!, uid: null });
        }

        let rPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';
        for (const evt of rEvents) {
            const eid = randomUUID();
            const eventHash = hashEvent(rPrevHash + eid + evt.type);
            await db.execute(sql`
                INSERT INTO rivalry_ledger_events (
                    id, rivalry_id, actor, event_type, user_id,
                    timestamp_utc, amount_usd_cents,
                    metadata_json, prev_event_hash, event_hash
                ) VALUES (
                    ${eid}, ${rid}, 'SYSTEM', ${evt.type}, ${evt.uid},
                    ${evt.ts.toISOString()}, ${evt.type === 'FUNDS_LOCKED' ? r.stake : null},
                    ${JSON.stringify({ simulated: true })},
                    ${rPrevHash}, ${eventHash}
                )
            `);
            rPrevHash = eventHash;
        }

        // Metric snapshots for active rivalries (simulate tracking)
        if (!r.settled) {
            for (const side of [{ uid: challengerId, bv: cBaselineVal }, { uid: opponentId, bv: oBaselineVal }]) {
                for (let d = 0; d < Math.min(daysBack, r.days); d++) {
                    const fetchedAt = new Date(activatedAt.getTime() + d * 86400000 + randomBetween(0, 43200000));
                    const growthPct = (d / r.days) * (10 + Math.random() * 20);
                    const value = Math.round(side.bv * (1 + growthPct / 100));
                    await db.execute(sql`
                        INSERT INTO rivalry_metric_snapshots (
                            id, rivalry_id, user_id, provider, metric_key,
                            metric_value, fetched_at, created_at
                        ) VALUES (
                            ${randomUUID()}, ${rid}, ${side.uid}, ${r.platform}, ${r.key},
                            ${value.toString()}, ${fetchedAt.toISOString()}, ${fetchedAt.toISOString()}
                        )
                    `);
                }
            }
        }
    }

    console.log(`[Seed Activity] Created ${rivalryData.length} rivalries (${rivalryData.filter(r => r.settled).length} settled, ${rivalryData.filter(r => !r.settled).length} active)`);

    return {
        users: userIds.length,
        contracts: contractIds.length,
        rivalries: rivalryData.length,
        activeRivalries: rivalryData.filter(r => !r.settled).length,
    };
}

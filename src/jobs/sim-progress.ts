// @ts-nocheck
/**
 * Simulated Progress Updater
 * 
 * ONLY updates seed/demo rivalry contracts (users with @collateral.internal emails).
 * Real user contracts are NEVER touched by this job.
 * 
 * Creates realistic, organic-looking metric growth over time:
 * - Some contracts trend toward hitting target (win)
 * - Some contracts stall or grow too slowly (lose)
 * - Growth has natural noise, day/night variance, and occasional plateaus
 * - Runs every scheduler cycle via scheduler
 * 
 * Also ensures simulated rivalries never expire — keeps deadlines rolling forward.
 * When real users start creating contracts, this job ignores them entirely.
 */

import { db } from '../db/client.js';
import { sql } from 'drizzle-orm';
import { randomUUID, createHash } from 'crypto';

// =============================================================================
// OUTCOME ASSIGNMENT
// Deterministic based on rivalry ID — same rivalry always gets same outcome
// =============================================================================

function getOutcomeForParticipant(rivalryId: string, role: string): 'WIN' | 'LOSE' {
    const hash = createHash('md5').update(rivalryId + role).digest('hex');
    const num = parseInt(hash.slice(0, 8), 16);
    // ~35% chance of winning (realistic for Collateral's economics)
    return (num % 100) < 35 ? 'WIN' : 'LOSE';
}

// =============================================================================
// GROWTH CURVE GENERATOR
// Creates realistic organic growth with noise
// =============================================================================

function calculateTargetGrowthAtTime(
    outcome: 'WIN' | 'LOSE',
    targetPct: number,
    elapsedRatio: number, // 0.0 to 1.0 (how far through the contract)
): number {
    // Clamp elapsed ratio
    const t = Math.min(1.0, Math.max(0, elapsedRatio));
    
    if (outcome === 'WIN') {
        // Winners: S-curve growth that ends above target
        // Slow start → accelerate → reach target near end
        const sCurve = 1 / (1 + Math.exp(-8 * (t - 0.5))); // Sigmoid
        const finalPct = targetPct * (1.02 + Math.random() * 0.15); // 2-17% above target
        const basePct = sCurve * finalPct;
        
        // Add noise: ±2% of current value
        const noise = (Math.random() - 0.5) * targetPct * 0.06;
        return Math.max(0, basePct + noise);
    } else {
        // Losers: Start growing but plateau or stall
        // Fast initial growth that tapers off before reaching target
        const peakRatio = 0.4 + Math.random() * 0.25; // Plateau at 40-65% of target
        const peakPct = targetPct * peakRatio;
        
        // Quick rise then plateau
        const rise = Math.sqrt(Math.min(t * 2.5, 1.0)); // Fast initial, then flat
        const basePct = rise * peakPct;
        
        // Add noise
        const noise = (Math.random() - 0.5) * targetPct * 0.04;
        
        // Occasional small dips (bad days)
        const dip = Math.random() < 0.15 ? -(targetPct * 0.02) : 0;
        
        return Math.max(0, basePct + noise + dip);
    }
}

// =============================================================================
// STEP 0: KEEP SIMULATED RIVALRIES ALIVE
// Extends deadlines and un-settles any that the cron auto-settled
// =============================================================================

async function keepSimRivalriesAlive(): Promise<number> {
    let fixed = 0;
    
    try {
        // Find ALL sim rivalries that were activated (including auto-settled ones)
        const simRivalries = await db.execute(sql`
            SELECT r.id, r.activated_at, r.deadline_utc, r.settled_at, r.duration_days,
                   r.platform, r.metric_key, r.target_growth_pct,
                   r.challenger_user_id, r.opponent_user_id
            FROM rivalries r
            JOIN users u_c ON r.challenger_user_id = u_c.id
            JOIN users u_o ON r.opponent_user_id = u_o.id
            WHERE r.activated_at IS NOT NULL
              AND u_c.email LIKE '%@collateral.internal'
              AND u_o.email LIKE '%@collateral.internal'
        `);
        
        const rows = (simRivalries as any).rows || simRivalries;
        const now = new Date();
        
        for (const r of rows) {
            const deadline = new Date(r.deadline_utc);
            const durationDays = r.duration_days || 14;
            const durationMs = durationDays * 86400000;
            
            // If deadline is in the past or within 2 days, push it forward
            if (deadline.getTime() < now.getTime() + 2 * 86400000) {
                // Set new activation to ~40% through the contract period ago
                const newActivatedAt = new Date(now.getTime() - durationMs * 0.4);
                const newDeadline = new Date(newActivatedAt.getTime() + durationMs);
                
                await db.execute(sql`
                    UPDATE rivalries
                    SET activated_at = ${newActivatedAt.toISOString()},
                        deadline_utc = ${newDeadline.toISOString()},
                        settled_at = NULL,
                        winner_user_id = NULL,
                        settlement_metadata = NULL,
                        updated_at = ${now.toISOString()}
                    WHERE id = ${r.id}
                `);
                
                // Reset participant outcomes
                await db.execute(sql`
                    UPDATE rivalry_participants
                    SET outcome = NULL,
                        payout_cents = NULL,
                        final_snapshot_at = NULL
                    WHERE rivalry_id = ${r.id}
                `);
                
                // Remove ALL terminal/post-activation events that cause state derivation crashes
                await db.execute(sql`
                    DELETE FROM rivalry_ledger_events
                    WHERE rivalry_id = ${r.id}
                      AND event_type IN (
                        'RIVALRY_SETTLED', 'RIVALRY_EXPIRED', 'RIVALRY_CANCELLED',
                        'RIVALRY_VERIFICATION_STARTED', 'RIVALRY_VERIFIED',
                        'RIVALRY_SETTLEMENT_STARTED', 'RIVALRY_DRAW',
                        'RIVALRY_CAPITAL_RETURNED'
                      )
                `);
                
                // CRITICAL: Clear ALL old metric snapshots and backfill with clean historical data
                await db.execute(sql`
                    DELETE FROM rivalry_metric_snapshots
                    WHERE rivalry_id = ${r.id}
                `);
                
                // Get participants for backfill
                const parts = await db.execute(sql`
                    SELECT id, user_id, role, baseline_value
                    FROM rivalry_participants
                    WHERE rivalry_id = ${r.id}
                `);
                const partRows = (parts as any).rows || parts;
                const targetPct = parseFloat(r.target_growth_pct || '15');
                
                // Generate daily historical snapshots from activation to now
                const daysElapsed = Math.floor((now.getTime() - newActivatedAt.getTime()) / 86400000);
                
                for (const part of partRows) {
                    const baseline = parseFloat(part.baseline_value || '0');
                    if (baseline <= 0) continue;
                    
                    const outcome = getOutcomeForParticipant(r.id, part.role);
                    
                    for (let d = 0; d <= daysElapsed; d++) {
                        const dayRatio = d / durationDays;
                        const growthPct = calculateTargetGrowthAtTime(outcome, targetPct, dayRatio);
                        const value = Math.round(baseline * (1 + growthPct / 100));
                        
                        // Timestamp: activation + d days + random 0-12 hours
                        const snapshotTime = new Date(newActivatedAt.getTime() + d * 86400000 + Math.random() * 43200000);
                        
                        await db.execute(sql`
                            INSERT INTO rivalry_metric_snapshots (
                                id, rivalry_id, user_id, provider, metric_key,
                                metric_value, fetched_at, created_at
                            ) VALUES (
                                ${randomUUID()}, ${r.id}, ${part.user_id}, ${r.platform}, ${r.metric_key},
                                ${value.toString()}, ${snapshotTime.toISOString()}, ${snapshotTime.toISOString()}
                            )
                        `);
                    }
                    
                    // Update participant with latest growth
                    const latestRatio = daysElapsed / durationDays;
                    const latestGrowth = calculateTargetGrowthAtTime(outcome, targetPct, latestRatio);
                    const latestValue = Math.round(baseline * (1 + latestGrowth / 100));
                    
                    await db.execute(sql`
                        UPDATE rivalry_participants
                        SET percentage_delta = ${latestGrowth.toFixed(2)},
                            absolute_delta = ${(latestValue - baseline).toString()},
                            final_value = ${latestValue.toString()},
                            final_json = ${JSON.stringify({ value: latestValue, simulated: true, updatedAt: now.toISOString() })}
                        WHERE id = ${part.id}
                    `);
                }
                
                fixed++;
                console.log(`[SimProgress] 🔄 Reset rivalry ${r.id.slice(0,8)} — backfilled ${daysElapsed} days of data, new deadline: ${newDeadline.toISOString()}`);
            }
        }
        
        if (fixed > 0) {
            console.log(`[SimProgress] 🔄 Reset ${fixed} expired/near-expired simulated rivalries`);
        }
    } catch (err: any) {
        console.error('[SimProgress] keepAlive error:', err.message);
    }
    
    return fixed;
}

// =============================================================================
// MAIN JOB
// =============================================================================

export async function runSimProgressJob(): Promise<{ updated: number; snapshots: number; skipped: number; reset: number }> {
    console.log('[SimProgress] Starting simulated progress update...');
    
    let updated = 0;
    let snapshots = 0;
    let skipped = 0;
    
    // Step 0: Ensure sim rivalries haven't expired
    const reset = await keepSimRivalriesAlive();
    
    try {
        // 1. Find all ACTIVE rivalries owned by simulated users (@collateral.internal)
        const activeSimRivalries = await db.execute(sql`
            SELECT r.id, r.platform, r.metric_key, r.metric_type,
                   r.target_growth_pct, r.duration_days,
                   r.activated_at, r.deadline_utc,
                   r.challenger_user_id, r.opponent_user_id
            FROM rivalries r
            JOIN users u_c ON r.challenger_user_id = u_c.id
            JOIN users u_o ON r.opponent_user_id = u_o.id
            WHERE r.activated_at IS NOT NULL
              AND r.settled_at IS NULL
              AND u_c.email LIKE '%@collateral.internal'
              AND u_o.email LIKE '%@collateral.internal'
        `);
        
        const rows = (activeSimRivalries as any).rows || activeSimRivalries;
        
        if (!rows || rows.length === 0) {
            console.log('[SimProgress] No active simulated rivalries found. Skipping.');
            return { updated: 0, snapshots: 0, skipped: 0, reset };
        }
        
        console.log(`[SimProgress] Found ${rows.length} active simulated rivalries`);
        
        for (const rivalry of rows) {
            const rivalryId = rivalry.id;
            const activatedAt = new Date(rivalry.activated_at);
            const deadlineUtc = new Date(rivalry.deadline_utc);
            const now = new Date();
            
            // Calculate elapsed ratio (0.0 to 1.0)
            const totalDuration = deadlineUtc.getTime() - activatedAt.getTime();
            const elapsed = now.getTime() - activatedAt.getTime();
            const elapsedRatio = Math.min(1.0, elapsed / totalDuration);
            
            const targetPct = parseFloat(rivalry.target_growth_pct || '15');
            
            // Get participants
            const participants = await db.execute(sql`
                SELECT id, rivalry_id, user_id, role, baseline_value, percentage_delta
                FROM rivalry_participants
                WHERE rivalry_id = ${rivalryId}
            `);
            
            const parts = (participants as any).rows || participants;
            
            for (const part of parts) {
                if (!part.baseline_value) {
                    skipped++;
                    continue;
                }
                
                const baseline = parseFloat(part.baseline_value);
                if (baseline <= 0) {
                    skipped++;
                    continue;
                }
                
                // Get predetermined outcome for this participant
                const outcome = getOutcomeForParticipant(rivalryId, part.role);
                
                // Calculate current growth percentage
                const growthPct = calculateTargetGrowthAtTime(outcome, targetPct, elapsedRatio);
                const currentValue = Math.round(baseline * (1 + growthPct / 100));
                const absoluteDelta = currentValue - baseline;
                
                // Update rivalry_participants with current progress
                await db.execute(sql`
                    UPDATE rivalry_participants
                    SET percentage_delta = ${growthPct.toFixed(2)},
                        absolute_delta = ${absoluteDelta.toString()},
                        final_value = ${currentValue.toString()},
                        final_json = ${JSON.stringify({ value: currentValue, simulated: true, updatedAt: now.toISOString() })}
                    WHERE id = ${part.id}
                `);
                
                updated++;
                
                // Insert a new metric snapshot (the chart data source)
                // But limit to 1 snapshot per hour to avoid flooding
                const recentSnap = await db.execute(sql`
                    SELECT id FROM rivalry_metric_snapshots
                    WHERE rivalry_id = ${rivalryId}
                      AND user_id = ${part.user_id}
                      AND fetched_at > ${new Date(now.getTime() - 3600000).toISOString()}
                    LIMIT 1
                `);
                
                const recentRows = (recentSnap as any).rows || recentSnap;
                if (!recentRows || recentRows.length === 0) {
                    const snapId = randomUUID();
                    await db.execute(sql`
                        INSERT INTO rivalry_metric_snapshots (
                            id, rivalry_id, user_id, provider, metric_key,
                            metric_value, fetched_at, created_at
                        ) VALUES (
                            ${snapId}, ${rivalryId}, ${part.user_id}, ${rivalry.platform}, ${rivalry.metric_key},
                            ${currentValue.toString()}, ${now.toISOString()}, ${now.toISOString()}
                        )
                    `);
                    snapshots++;
                }
                
                const statusIcon = outcome === 'WIN' ? '📈' : '📉';
                console.log(`[SimProgress] ${statusIcon} ${part.role} in ${rivalryId.slice(0,8)}: ${growthPct.toFixed(1)}% growth (target: ${targetPct}%, elapsed: ${(elapsedRatio * 100).toFixed(0)}%, outcome: ${outcome})`);
            }
        }
        
        console.log(`[SimProgress] ✅ Complete — ${updated} participants updated, ${snapshots} snapshots, ${skipped} skipped, ${reset} reset`);
        
    } catch (err: any) {
        console.error('[SimProgress] Error:', err.message);
    }
    
    return { updated, snapshots, skipped, reset };
}

// =============================================================================
// ALSO UPDATE SOLO CONTRACTS
// Updates simulated solo contracts with progress too
// =============================================================================

export async function runSimSoloProgressJob(): Promise<{ updated: number }> {
    console.log('[SimProgress] Updating simulated solo contract progress...');
    let updated = 0;
    
    try {
        // Find active solo contracts owned by sim users
        const activeContracts = await db.execute(sql`
            SELECT c.id, c.principal_user_id, c.platform, c.metric_type,
                   c.condition_json, c.baseline_json,
                   c.created_at, c.deadline_utc,
                   ci.current_state
            FROM contracts c
            JOIN users u ON c.principal_user_id = u.id
            LEFT JOIN contract_index ci ON ci.contract_id = c.id
            WHERE u.email LIKE '%@collateral.internal'
              AND ci.current_state = 'EXECUTION_CONFIRMED'
              AND ci.is_terminal = 0
        `);
        
        const rows = (activeContracts as any).rows || activeContracts;
        
        for (const contract of rows) {
            const baseline = JSON.parse(contract.baseline_json || '{}');
            const condition = JSON.parse(contract.condition_json || '{}');
            const baseVal = baseline.value || 0;
            const targetVal = condition.threshold || 0;
            if (!baseVal || !targetVal) continue;
            
            const targetPct = ((targetVal - baseVal) / baseVal) * 100;
            const createdAt = new Date(contract.created_at);
            const deadline = new Date(contract.deadline_utc);
            const now = new Date();
            
            const totalDuration = deadline.getTime() - createdAt.getTime();
            const elapsed = now.getTime() - createdAt.getTime();
            const elapsedRatio = Math.min(1.0, elapsed / totalDuration);
            
            // Use contract ID to deterministically decide outcome
            const outcome = getOutcomeForParticipant(contract.id, 'solo');
            const growthPct = calculateTargetGrowthAtTime(outcome, targetPct, elapsedRatio);
            const currentValue = Math.round(baseVal * (1 + growthPct / 100));
            
            // Store in condition_json as currentValue for frontend
            const updatedCondition = {
                ...condition,
                currentValue,
                lastSimUpdate: now.toISOString(),
            };
            
            await db.execute(sql`
                UPDATE contracts
                SET condition_json = ${JSON.stringify(updatedCondition)},
                    updated_at = ${now.toISOString()}
                WHERE id = ${contract.id}
            `);
            
            updated++;
        }
        
        console.log(`[SimProgress] ✅ Updated ${updated} solo contracts`);
    } catch (err: any) {
        console.error('[SimProgress] Solo update error:', err.message);
    }
    
    return { updated };
}

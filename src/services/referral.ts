/**
 * Referral Service
 * 
 * Core logic for the referral system with profit boost tiers.
 * Users earn permanent profit boosts by referring others who execute contracts.
 */

import { db } from '../db/client.js';
import { users, referrals } from '../db/schema.js';
import { eq, and, sql, gte } from 'drizzle-orm';

// =============================================
// BOOST TIER TABLE
// =============================================
// referral_count → boost_pct
const BOOST_TIERS = [
    { minReferrals: 20, boostPct: 25 },
    { minReferrals: 10, boostPct: 20 },
    { minReferrals: 5, boostPct: 15 },
    { minReferrals: 3, boostPct: 10 },
    { minReferrals: 1, boostPct: 5 },
];

const MAX_BOOST_PCT = 25;
const MIN_STAKE_CENTS = 5000; // $50 minimum stake for activation
const MAX_ACTIVATIONS_PER_DAY = 5; // Rate limit per referrer
const REFERRED_USER_FIRST_BONUS_PCT = 5; // +5% bonus on first contract for referred users

/**
 * Calculate boost percentage from referral count
 */
export function calculateBoostPct(referralCount: number): number {
    for (const tier of BOOST_TIERS) {
        if (referralCount >= tier.minReferrals) {
            return tier.boostPct;
        }
    }
    return 0;
}

/**
 * Get the next tier info for a given count
 */
export function getNextTier(referralCount: number): { needed: number; boostPct: number } | null {
    const currentBoost = calculateBoostPct(referralCount);
    const sortedAsc = [...BOOST_TIERS].reverse();
    for (const tier of sortedAsc) {
        if (tier.boostPct > currentBoost) {
            return { needed: tier.minReferrals, boostPct: tier.boostPct };
        }
    }
    return null; // Already at max
}

/**
 * Create a pending referral when a new user signs up with a referral code
 */
export async function createPendingReferral(referrerUserId: string, referredUserId: string): Promise<void> {
    try {
        await db.insert(referrals).values({
            referrerUserId,
            referredUserId,
            status: 'PENDING',
        } as any);
        console.log(`🔗 Pending referral created: ${referrerUserId} → ${referredUserId}`);
    } catch (err: any) {
        // Unique constraint violation = already referred, ignore
        if (err.code === '23505') {
            console.log(`[Referral] User ${referredUserId} already has a referral, skipping`);
            return;
        }
        throw err;
    }
}

/**
 * Check if referrer has hit daily activation limit
 */
async function checkDailyRateLimit(referrerUserId: string): Promise<boolean> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [result] = await db.select({ count: sql<number>`count(*)` })
        .from(referrals)
        .where(and(
            eq(referrals.referrerUserId, referrerUserId),
            eq(referrals.status, 'ACTIVATED'),
            gte(referrals.activatedAt, todayStart)
        ));

    const todayCount = Number(result?.count ?? 0);
    return todayCount < MAX_ACTIVATIONS_PER_DAY;
}

/**
 * Activate a referral when the referred user executes their first contract
 * - Marks referral as ACTIVATED
 * - Increments referrer's referral_count
 * - Recalculates referrer's boost tier
 * - Rate limited to 5 activations per day per referrer
 * 
 * @param referredUserId The user who was referred and just executed a contract
 * @param stakeCents The stake amount in cents (must be >= MIN_STAKE_CENTS)
 * @returns true if activation happened
 */
export async function activateReferral(referredUserId: string, stakeCents: number): Promise<boolean> {
    // Check minimum stake ($50)
    if (stakeCents < MIN_STAKE_CENTS) {
        console.log(`[Referral] Stake ${stakeCents} below minimum ${MIN_STAKE_CENTS} ($${MIN_STAKE_CENTS / 100}), skipping activation`);
        return false;
    }

    // Find pending referral for this user
    const [referral] = await db.select().from(referrals)
        .where(and(
            eq(referrals.referredUserId, referredUserId),
            eq(referrals.status, 'PENDING')
        ))
        .limit(1);

    if (!referral) {
        return false; // No pending referral
    }

    // Rate limit check: max 5 activations per day per referrer
    const withinLimit = await checkDailyRateLimit(referral.referrerUserId);
    if (!withinLimit) {
        console.log(`[Referral] Rate limit: ${referral.referrerUserId} has reached ${MAX_ACTIVATIONS_PER_DAY} activations today`);
        return false;
    }

    // Activate referral
    await db.update(referrals)
        .set({
            status: 'ACTIVATED',
            activatedAt: new Date(),
        } as any)
        .where(eq(referrals.id, referral.id));

    // Increment referrer's count and recalculate boost
    const [referrer] = await db.select().from(users)
        .where(eq(users.id, referral.referrerUserId))
        .limit(1);

    if (referrer) {
        const newCount = (referrer.referralCount ?? 0) + 1;
        const newBoost = calculateBoostPct(newCount);

        await db.update(users)
            .set({
                referralCount: newCount,
                referralBoostPct: newBoost,
            } as any)
            .where(eq(users.id, referral.referrerUserId));

        console.log(`🎉 Referral activated! ${referral.referrerUserId} now has ${newCount} referrals, boost: ${newBoost}%`);
    }

    return true;
}

/**
 * Get referral stats for a user (for the /referrals page)
 */
export async function getReferralStats(userId: string) {
    const [user] = await db.select().from(users)
        .where(eq(users.id, userId)).limit(1);

    if (!user) return null;

    // Get referral list
    const referralList = await db.select().from(referrals)
        .where(eq(referrals.referrerUserId, userId));

    const nextTier = getNextTier(user.referralCount ?? 0);

    // Get identity for referral code
    const { identities } = await import('../db/schema.js');
    const [identity] = await db.select().from(identities)
        .where(eq(identities.userId, userId)).limit(1);

    const referralCode = user.referralCode || identity?.username || null;

    // Check if this user was referred (for first-contract bonus display)
    const wasReferred = !!(user as any).referredByUserId;
    const firstBonusUsed = !!(user as any).referralFirstBonusUsed;

    return {
        referralCode,
        referralCount: user.referralCount ?? 0,
        boostPct: user.referralBoostPct ?? 0,
        maxBoostPct: MAX_BOOST_PCT,
        nextTier,
        wasReferred,
        firstBonusAvailable: wasReferred && !firstBonusUsed,
        firstBonusPct: REFERRED_USER_FIRST_BONUS_PCT,
        referrals: referralList.map(r => ({
            id: r.id,
            status: r.status,
            createdAt: r.createdAt.toISOString(),
            activatedAt: r.activatedAt?.toISOString() || null,
        })),
        tiers: BOOST_TIERS.map(t => ({
            minReferrals: t.minReferrals,
            boostPct: t.boostPct,
        })).reverse(),
    };
}

/**
 * Look up a referrer by their referral code (username)
 * Returns the user ID if found
 */
export async function lookupReferrer(referralCode: string): Promise<string | null> {
    // First check users.referral_code
    const [byCode] = await db.select().from(users)
        .where(eq(users.referralCode, referralCode.toLowerCase()))
        .limit(1);
    if (byCode) return byCode.id;

    // Fall back to identity username
    const { identities } = await import('../db/schema.js');
    const [byUsername] = await db.select().from(identities)
        .where(eq(identities.username, referralCode.toLowerCase()))
        .limit(1);
    if (byUsername) return byUsername.userId;

    return null;
}

/**
 * Check and apply first-contract bonus for referred users
 * Returns the bonus percentage if applicable, 0 otherwise
 * Marks the bonus as consumed after first use
 */
export async function checkFirstContractBonus(userId: string): Promise<number> {
    const [user] = await db.select().from(users)
        .where(eq(users.id, userId)).limit(1);

    if (!user) return 0;

    const wasReferred = !!(user as any).referredByUserId;
    const firstBonusUsed = !!(user as any).referralFirstBonusUsed;

    if (wasReferred && !firstBonusUsed) {
        // Mark bonus as consumed
        await db.update(users)
            .set({ referralFirstBonusUsed: true } as any)
            .where(eq(users.id, userId));

        console.log(`🎁 First-contract referral bonus applied for ${userId}: +${REFERRED_USER_FIRST_BONUS_PCT}%`);
        return REFERRED_USER_FIRST_BONUS_PCT;
    }

    return 0;
}

export { MIN_STAKE_CENTS, MAX_BOOST_PCT, BOOST_TIERS, REFERRED_USER_FIRST_BONUS_PCT, MAX_ACTIVATIONS_PER_DAY };

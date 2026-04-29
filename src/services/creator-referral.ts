/**
 * Creator Referral Service
 * 
 * Tracks paid creator partnerships for the outreach program.
 * Separate from the user-to-user referral boost system.
 * 
 * Creators earn a flat bonus per qualified funded contract:
 * - A_LIST: $25 per qualified funded contract
 * - STANDARD: $10 per qualified funded contract
 * 
 * Conversion funnel: CLICKED → SIGNED_UP → FUNDED_CONTRACT → PENDING_REVIEW → APPROVED/REJECTED → PAID
 */

import { db } from '../db/client.js';
import { creatorReferrals, creatorConversions, users } from '../db/schema.js';
import { eq, and, sql, desc } from 'drizzle-orm';

// Minimum stake for a funded contract to count as a qualified conversion
const MIN_STAKE_CENTS = 2500; // $25

// Admin user IDs (comma-separated in env var)
function getAdminUserIds(): string[] {
    const ids = process.env.ADMIN_USER_IDS || '';
    return ids.split(',').map(id => id.trim()).filter(Boolean);
}

export function isAdmin(userId: string): boolean {
    return getAdminUserIds().includes(userId);
}

// =============================================================================
// LOOKUP
// =============================================================================

/**
 * Look up a creator by their slug.
 * Returns the creator record if found and active.
 */
export async function lookupCreator(slug: string) {
    if (!slug || slug.length < 2) return null;

    const [creator] = await db.select()
        .from(creatorReferrals)
        .where(eq(creatorReferrals.slug, slug.toLowerCase()))
        .limit(1);

    return creator || null;
}

/**
 * Check if a slug belongs to a creator (fast check, no full record load)
 */
export async function isCreatorSlug(slug: string): Promise<boolean> {
    if (!slug || slug.length < 2) return false;

    const [result] = await db.select({ id: creatorReferrals.id })
        .from(creatorReferrals)
        .where(eq(creatorReferrals.slug, slug.toLowerCase()))
        .limit(1);

    return !!result;
}

// =============================================================================
// CONVERSION TRACKING
// =============================================================================

/**
 * Record a click event when someone visits a creator referral link.
 */
export async function recordClick(slug: string, metadata?: Record<string, any>): Promise<boolean> {
    const creator = await lookupCreator(slug);
    if (!creator) return false;

    try {
        await db.insert(creatorConversions).values({
            creatorId: creator.id,
            eventType: 'CLICKED',
            metadataJson: metadata || {},
        } as any);
        console.log(`[CreatorRef] Click recorded for ${slug}`);
        return true;
    } catch (err: any) {
        console.error(`[CreatorRef] Failed to record click for ${slug}:`, err.message);
        return false;
    }
}

/**
 * Record a signup event when a user signs up via a creator referral.
 */
export async function recordSignup(slug: string, userId: string): Promise<boolean> {
    const creator = await lookupCreator(slug);
    if (!creator) return false;

    // Anti-abuse: check if this user already has a signup event for this creator
    const [existing] = await db.select({ id: creatorConversions.id })
        .from(creatorConversions)
        .where(and(
            eq(creatorConversions.creatorId, creator.id),
            eq(creatorConversions.userId, userId),
            eq(creatorConversions.eventType, 'SIGNED_UP' as any),
        ))
        .limit(1);

    if (existing) {
        console.log(`[CreatorRef] Duplicate signup ignored for ${slug} / user ${userId}`);
        return false;
    }

    try {
        await db.insert(creatorConversions).values({
            creatorId: creator.id,
            userId,
            eventType: 'SIGNED_UP',
            metadataJson: { signedUpAt: new Date().toISOString() },
        } as any);
        console.log(`[CreatorRef] ✅ Signup recorded: ${slug} → user ${userId}`);
        return true;
    } catch (err: any) {
        console.error(`[CreatorRef] Failed to record signup for ${slug}:`, err.message);
        return false;
    }
}

/**
 * Record a funded contract event and create PENDING_REVIEW if qualified.
 * Called when a referred user funds their first contract with stake >= $25.
 */
export async function recordFundedContract(
    userId: string,
    contractId: string,
    stakeCents: number
): Promise<{ recorded: boolean; reason?: string }> {
    // Find which creator referred this user
    // Look up the user's referral code, then check if it's a creator slug
    const [user] = await db.select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

    if (!user) return { recorded: false, reason: 'User not found' };

    // Get the referral code that brought this user
    const referralCode = (user as any).referralCode || (user as any).referral_code;
    
    // Also check the referrals table for the referrer's code
    let creatorSlug: string | null = null;

    // Try to find the creator from the user's referred_by path
    // Check if there's a creator signup event for this user
    const [signupEvent] = await db.select()
        .from(creatorConversions)
        .where(and(
            eq(creatorConversions.userId, userId),
            eq(creatorConversions.eventType, 'SIGNED_UP' as any),
        ))
        .limit(1);

    if (!signupEvent) {
        return { recorded: false, reason: 'User was not referred by a creator' };
    }

    const creator = await db.select()
        .from(creatorReferrals)
        .where(eq(creatorReferrals.id, signupEvent.creatorId))
        .limit(1)
        .then(r => r[0]);

    if (!creator) return { recorded: false, reason: 'Creator not found' };

    // Anti-abuse: minimum stake
    if (stakeCents < MIN_STAKE_CENTS) {
        return { recorded: false, reason: `Stake ${stakeCents} below minimum ${MIN_STAKE_CENTS} ($${MIN_STAKE_CENTS / 100})` };
    }

    // Anti-abuse: no self-referral (creator can't refer themselves)
    // Check if the user's email/id matches the creator handle somehow
    // For now, just check if there's already a funded contract event for this user+creator
    const [existingFunded] = await db.select({ id: creatorConversions.id })
        .from(creatorConversions)
        .where(and(
            eq(creatorConversions.creatorId, creator.id),
            eq(creatorConversions.userId, userId),
            eq(creatorConversions.eventType, 'FUNDED_CONTRACT' as any),
        ))
        .limit(1);

    if (existingFunded) {
        return { recorded: false, reason: 'Funded contract already recorded for this user+creator' };
    }

    // Record FUNDED_CONTRACT event
    try {
        await db.insert(creatorConversions).values({
            creatorId: creator.id,
            userId,
            contractId,
            eventType: 'FUNDED_CONTRACT',
            stakeAmountCents: stakeCents,
            bonusAmountCents: creator.bonusRateCents,
            metadataJson: {
                fundedAt: new Date().toISOString(),
                stakeCents,
                tier: creator.tier,
            },
        } as any);

        // Also create PENDING_REVIEW event
        await db.insert(creatorConversions).values({
            creatorId: creator.id,
            userId,
            contractId,
            eventType: 'PENDING_REVIEW',
            stakeAmountCents: stakeCents,
            bonusAmountCents: creator.bonusRateCents,
            metadataJson: {
                awaitingReview: true,
                createdAt: new Date().toISOString(),
            },
        } as any);

        console.log(`[CreatorRef] ✅ Funded contract recorded: creator=${creator.slug}, user=${userId}, contract=${contractId}, stake=$${stakeCents / 100}, bonus=$${creator.bonusRateCents / 100}`);
        return { recorded: true };
    } catch (err: any) {
        console.error(`[CreatorRef] Failed to record funded contract:`, err.message);
        return { recorded: false, reason: err.message };
    }
}

// =============================================================================
// ADMIN OPERATIONS
// =============================================================================

/**
 * Approve a pending conversion — bonus becomes payable.
 */
export async function approveConversion(conversionId: string): Promise<boolean> {
    try {
        // Find the PENDING_REVIEW conversion
        const [conv] = await db.select()
            .from(creatorConversions)
            .where(and(
                eq(creatorConversions.id, conversionId),
                eq(creatorConversions.eventType, 'PENDING_REVIEW' as any),
            ))
            .limit(1);

        if (!conv) {
            console.warn(`[CreatorRef] Conversion ${conversionId} not found or not in PENDING_REVIEW`);
            return false;
        }

        // Update to APPROVED
        await db.update(creatorConversions)
            .set({
                eventType: 'APPROVED',
                reviewedAt: new Date(),
            } as any)
            .where(eq(creatorConversions.id, conversionId));

        console.log(`[CreatorRef] ✅ Conversion ${conversionId} APPROVED`);
        return true;
    } catch (err: any) {
        console.error(`[CreatorRef] Failed to approve conversion:`, err.message);
        return false;
    }
}

/**
 * Reject a pending conversion.
 */
export async function rejectConversion(conversionId: string, reason: string): Promise<boolean> {
    try {
        const [conv] = await db.select()
            .from(creatorConversions)
            .where(and(
                eq(creatorConversions.id, conversionId),
                eq(creatorConversions.eventType, 'PENDING_REVIEW' as any),
            ))
            .limit(1);

        if (!conv) return false;

        await db.update(creatorConversions)
            .set({
                eventType: 'REJECTED',
                rejectionReason: reason,
                reviewedAt: new Date(),
            } as any)
            .where(eq(creatorConversions.id, conversionId));

        console.log(`[CreatorRef] ❌ Conversion ${conversionId} REJECTED: ${reason}`);
        return true;
    } catch (err: any) {
        console.error(`[CreatorRef] Failed to reject conversion:`, err.message);
        return false;
    }
}

/**
 * Mark an approved conversion as paid.
 */
export async function markPaid(conversionId: string): Promise<boolean> {
    try {
        const [conv] = await db.select()
            .from(creatorConversions)
            .where(and(
                eq(creatorConversions.id, conversionId),
                eq(creatorConversions.eventType, 'APPROVED' as any),
            ))
            .limit(1);

        if (!conv) return false;

        await db.update(creatorConversions)
            .set({
                eventType: 'PAID',
                paidAt: new Date(),
            } as any)
            .where(eq(creatorConversions.id, conversionId));

        console.log(`[CreatorRef] 💰 Conversion ${conversionId} PAID`);
        return true;
    } catch (err: any) {
        console.error(`[CreatorRef] Failed to mark paid:`, err.message);
        return false;
    }
}

// =============================================================================
// DASHBOARD / STATS
// =============================================================================

/**
 * Get aggregated stats for all creators (admin dashboard).
 */
export async function getCreatorDashboard() {
    const creators = await db.select().from(creatorReferrals).orderBy(desc(creatorReferrals.createdAt));

    const dashboard = await Promise.all(creators.map(async (creator) => {
        const conversions = await db.select()
            .from(creatorConversions)
            .where(eq(creatorConversions.creatorId, creator.id));

        const clicks = conversions.filter(c => c.eventType === 'CLICKED').length;
        const signups = conversions.filter(c => c.eventType === 'SIGNED_UP').length;
        const funded = conversions.filter(c => c.eventType === 'FUNDED_CONTRACT').length;
        const pending = conversions.filter(c => c.eventType === 'PENDING_REVIEW').length;
        const approved = conversions.filter(c => c.eventType === 'APPROVED').length;
        const rejected = conversions.filter(c => c.eventType === 'REJECTED').length;
        const paid = conversions.filter(c => c.eventType === 'PAID').length;

        const amountOwed = (approved) * creator.bonusRateCents;
        const amountPaid = (paid) * creator.bonusRateCents;

        return {
            id: creator.id,
            name: creator.name,
            slug: creator.slug,
            platform: creator.platform,
            handle: creator.handle,
            tier: creator.tier,
            bonusRate: `$${creator.bonusRateCents / 100}`,
            bonusRateCents: creator.bonusRateCents,
            postFeeCents: creator.postFeeCents,
            followerCount: creator.followerCount,
            score: creator.score,
            status: creator.status,
            stats: {
                clicks,
                signups,
                fundedContracts: funded,
                pendingReview: pending,
                approved,
                rejected,
                paid,
                amountOwedCents: amountOwed,
                amountOwed: `$${amountOwed / 100}`,
                amountPaidCents: amountPaid,
                amountPaid: `$${amountPaid / 100}`,
            },
        };
    }));

    return dashboard;
}

/**
 * Get stats for a single creator.
 */
export async function getCreatorStats(slug: string) {
    const dashboard = await getCreatorDashboard();
    return dashboard.find(c => c.slug === slug) || null;
}

/**
 * Get all conversions (admin view).
 */
export async function getAllConversions(filters?: { eventType?: string; creatorSlug?: string }) {
    let query = db.select({
        conversion: creatorConversions,
        creatorName: creatorReferrals.name,
        creatorSlug: creatorReferrals.slug,
        creatorTier: creatorReferrals.tier,
    })
    .from(creatorConversions)
    .innerJoin(creatorReferrals, eq(creatorConversions.creatorId, creatorReferrals.id))
    .orderBy(desc(creatorConversions.createdAt));

    const results = await query;

    // Apply filters in-memory (simpler for MVP)
    let filtered = results;
    if (filters?.eventType) {
        filtered = filtered.filter(r => r.conversion.eventType === filters.eventType);
    }
    if (filters?.creatorSlug) {
        filtered = filtered.filter(r => r.creatorSlug === filters.creatorSlug);
    }

    return filtered.map(r => ({
        id: r.conversion.id,
        creatorName: r.creatorName,
        creatorSlug: r.creatorSlug,
        creatorTier: r.creatorTier,
        userId: r.conversion.userId,
        contractId: r.conversion.contractId,
        eventType: r.conversion.eventType,
        stakeAmountCents: r.conversion.stakeAmountCents,
        bonusAmountCents: r.conversion.bonusAmountCents,
        rejectionReason: r.conversion.rejectionReason,
        createdAt: r.conversion.createdAt?.toISOString(),
        reviewedAt: r.conversion.reviewedAt?.toISOString(),
        paidAt: r.conversion.paidAt?.toISOString(),
    }));
}

export { MIN_STAKE_CENTS };

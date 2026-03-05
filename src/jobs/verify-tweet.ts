/**
 * Tweet Verification Job
 * 
 * Verifies that social bonus tweets exist and are public.
 * Runs periodically to check pending verifications and re-verify at settlement.
 */

import { db } from '../db/client.js';
import { contracts, connectedAccounts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

const SOCIAL_BONUS_MULTIPLIER = 0.05; // 5% profit boost

/**
 * Verify a single tweet exists and is public using X API v2
 * Returns true if tweet is valid for bonus
 */
async function verifyTweetExists(tweetId: string): Promise<{ valid: boolean; reason?: string }> {
    const bearerToken = process.env.X_BEARER_TOKEN;
    if (!bearerToken) {
        console.warn('[TweetVerify] No X_BEARER_TOKEN configured, auto-approving tweet');
        return { valid: true, reason: 'no_bearer_token_configured' };
    }

    try {
        const response = await fetch(`https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=author_id,text`, {
            headers: { 'Authorization': `Bearer ${bearerToken}` }
        });

        if (response.status === 200) {
            const data = await response.json() as any;
            if (data.data?.id) {
                return { valid: true };
            }
            return { valid: false, reason: 'tweet_not_found_in_response' };
        }

        if (response.status === 404) {
            return { valid: false, reason: 'tweet_deleted' };
        }

        if (response.status === 403) {
            return { valid: false, reason: 'tweet_private_or_suspended' };
        }

        if (response.status === 429) {
            console.warn('[TweetVerify] Rate limited, skipping verification');
            return { valid: true, reason: 'rate_limited_skip' }; // Don't penalize user for rate limit
        }

        return { valid: false, reason: `unexpected_status_${response.status}` };
    } catch (err) {
        console.error('[TweetVerify] API error:', (err as any).message);
        return { valid: true, reason: 'api_error_skip' }; // Don't penalize on network errors
    }
}

/**
 * Run verification for all pending social bonus tweets
 */
export async function runTweetVerificationJob(): Promise<{
    checked: number;
    verified: number;
    revoked: number;
}> {
    console.log('🐦 [TweetVerify] Starting tweet verification job...');

    // Find contracts with social bonus enabled but not yet verified
    const pendingContracts = await db.execute(sql`
        SELECT id, social_bonus_tweet_id 
        FROM contracts 
        WHERE social_bonus_enabled = true 
          AND social_bonus_verified = false 
          AND social_bonus_tweet_id IS NOT NULL
    `);

    const rows = (pendingContracts as any).rows || pendingContracts;
    console.log(`[TweetVerify] Found ${rows.length} pending tweet verifications`);

    let verified = 0;
    let revoked = 0;

    for (const row of rows) {
        const { id, social_bonus_tweet_id } = row;
        const result = await verifyTweetExists(social_bonus_tweet_id);

        if (result.valid) {
            await db.update(contracts)
                .set({ socialBonusVerified: true, updatedAt: new Date() } as any)
                .where(eq(contracts.id, id));
            verified++;
            console.log(`✅ [TweetVerify] Verified tweet for contract ${id}`);
        } else {
            await db.update(contracts)
                .set({ socialBonusEnabled: false, socialBonusVerified: false, updatedAt: new Date() } as any)
                .where(eq(contracts.id, id));
            revoked++;
            console.log(`❌ [TweetVerify] Revoked bonus for contract ${id}: ${result.reason}`);
        }

        // Rate limit protection: 1 second between checks
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`🐦 [TweetVerify] Done: ${verified} verified, ${revoked} revoked`);
    return { checked: rows.length, verified, revoked };
}

/**
 * Pre-settlement re-verification
 * Called before applying social bonus at settlement time
 * Returns true if bonus should be applied
 */
export async function verifyTweetForSettlement(contractId: string): Promise<boolean> {
    const [contract] = await db.select().from(contracts)
        .where(eq(contracts.id, contractId)).limit(1);

    if (!contract?.socialBonusEnabled || !contract?.socialBonusTweetId) {
        return false;
    }

    const result = await verifyTweetExists(contract.socialBonusTweetId);

    if (!result.valid) {
        // Tweet deleted before settlement — revoke bonus
        await db.update(contracts)
            .set({ socialBonusVerified: false, socialBonusEnabled: false, updatedAt: new Date() } as any)
            .where(eq(contracts.id, contractId));
        console.log(`❌ [Settlement] Tweet deleted for contract ${contractId}, bonus revoked`);
        return false;
    }

    // Mark as verified if not already
    if (!contract.socialBonusVerified) {
        await db.update(contracts)
            .set({ socialBonusVerified: true, updatedAt: new Date() } as any)
            .where(eq(contracts.id, contractId));
    }

    return true;
}

export { SOCIAL_BONUS_MULTIPLIER };

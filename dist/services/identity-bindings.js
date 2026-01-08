/**
 * Identity Binding Service
 *
 * Manages immutable, append-only identity bindings for Stripe, GitHub, etc.
 *
 * INVARIANTS:
 * - Bindings are APPEND-ONLY: to switch, revoke old + insert new
 * - Only ONE active binding per (user_id, provider) where revoked_at IS NULL
 * - Each binding change creates audit trail via ledger events
 * - Contracts snapshot binding reference at creation (immutable)
 */
import { db } from '../db/client.js';
import { identityBindings } from '../db/schema.js';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
// =============================================================================
// CORE FUNCTIONS
// =============================================================================
/**
 * Get the current active binding for a user+provider
 * Returns null if no active binding exists
 */
export async function getActiveBinding(userId, provider) {
    const [binding] = await db
        .select()
        .from(identityBindings)
        .where(and(eq(identityBindings.userId, userId), eq(identityBindings.provider, provider), isNull(identityBindings.revokedAt)))
        .limit(1);
    return binding;
}
/**
 * Get all bindings for a user (active + history)
 * Ordered by createdAt descending (most recent first)
 */
export async function getBindingsForUser(userId) {
    const bindings = await db
        .select()
        .from(identityBindings)
        .where(eq(identityBindings.userId, userId))
        .orderBy(desc(identityBindings.createdAt));
    return bindings;
}
/**
 * Get a specific binding by ID
 */
export async function getBindingById(bindingId) {
    const [binding] = await db
        .select()
        .from(identityBindings)
        .where(eq(identityBindings.id, bindingId))
        .limit(1);
    return binding;
}
/**
 * Bind an identity to a user
 *
 * BEHAVIOR:
 * - If no active binding exists: creates new binding
 * - If active binding exists with SAME providerUserId/providerAccountId: idempotent, returns existing
 * - If active binding exists with DIFFERENT provider IDs: revokes old, creates new
 *
 * @param params Binding parameters (userId MUST come from auth middleware)
 * @returns BindResult with binding info and creation status
 */
export async function bindIdentity(params) {
    const { userId, provider, providerUserId, providerAccountId, auditEventId } = params;
    // Generate audit ID if not provided
    const eventId = auditEventId || randomUUID();
    // 1. Check for existing active binding
    const existingBinding = await getActiveBinding(userId, provider);
    if (existingBinding) {
        // 2a. Check if it's the same identity (idempotent)
        const sameProviderUser = existingBinding.providerUserId === providerUserId;
        const sameProviderAccount = existingBinding.providerAccountId === (providerAccountId || null);
        if (sameProviderUser && sameProviderAccount) {
            // Idempotent: return existing binding without changes
            // IMPORTANT: Do not modify audit fields on idempotent return
            return {
                binding: existingBinding,
                created: false,
            };
        }
        // 2b. Different identity: revoke old binding first
        const revokedBinding = await revokeBinding(existingBinding.id, eventId);
        // 3. Create new binding
        const newBinding = await createBinding({ ...params, auditEventId: eventId });
        return {
            binding: newBinding,
            created: true,
            revokedBinding,
        };
    }
    // 4. No existing binding: create new
    const newBinding = await createBinding({ ...params, auditEventId: eventId });
    return {
        binding: newBinding,
        created: true,
    };
}
/**
 * Create a new identity binding (internal)
 * Does NOT check for existing active bindings - use bindIdentity for that
 */
async function createBinding(params) {
    const { userId, provider, providerUserId, providerAccountId, auditEventId } = params;
    const [inserted] = await db
        .insert(identityBindings)
        .values({
        userId,
        provider,
        providerUserId,
        providerAccountId: providerAccountId || null,
        createdByEventId: auditEventId || null,
    })
        .returning();
    console.log(`🔗 Identity bound: ${provider} → user ${userId.slice(0, 8)}... (auditId: ${auditEventId?.slice(0, 8) || 'none'})`);
    return inserted;
}
/**
 * Revoke an identity binding (internal)
 * Sets revokedAt timestamp and revokedByEventId, making it inactive
 */
async function revokeBinding(bindingId, auditEventId) {
    const [revoked] = await db
        .update(identityBindings)
        .set({
        revokedAt: new Date(),
        revokedByEventId: auditEventId || null,
    })
        .where(eq(identityBindings.id, bindingId))
        .returning();
    if (!revoked) {
        throw new Error(`Binding ${bindingId} not found for revocation`);
    }
    console.log(`⛔ Identity revoked: binding ${bindingId.slice(0, 8)}... (auditId: ${auditEventId?.slice(0, 8) || 'none'})`);
    return revoked;
}
// =============================================================================
// PLATFORM-SPECIFIC HELPERS
// =============================================================================
/**
 * Get active Stripe binding for a user
 */
export async function getStripeBinding(userId) {
    return getActiveBinding(userId, 'stripe');
}
/**
 * Get active GitHub binding for a user
 */
export async function getGithubBinding(userId) {
    return getActiveBinding(userId, 'github');
}
/**
 * Bind Stripe identity
 * @param userId From auth middleware
 * @param stripeAccountId Stripe connected account ID
 */
export async function bindStripeIdentity(userId, stripeAccountId) {
    return bindIdentity({
        userId,
        provider: 'stripe',
        providerUserId: stripeAccountId,
        providerAccountId: stripeAccountId,
    });
}
/**
 * Bind GitHub identity
 * @param userId From auth middleware
 * @param githubUserId GitHub user ID (stable numeric ID)
 * @param githubLogin GitHub username (for display, may change)
 */
export async function bindGithubIdentity(userId, githubUserId, githubLogin) {
    return bindIdentity({
        userId,
        provider: 'github',
        providerUserId: githubUserId,
        providerAccountId: githubLogin || null,
    });
}
// =============================================================================
// SNAPSHOT HELPERS (for contract creation)
// =============================================================================
/**
 * Get binding snapshot for contract creation
 * Returns binding ID that should be stored in contract.stripeBindingId/githubBindingId
 */
export async function getBindingSnapshotForContract(userId, platform) {
    const provider = platformToProvider(platform);
    if (!provider) {
        return { bindingId: null, binding: null };
    }
    const binding = await getActiveBinding(userId, provider);
    return {
        bindingId: binding?.id || null,
        binding,
    };
}
/**
 * Map platform enum to identity provider
 */
function platformToProvider(platform) {
    const mapping = {
        'STRIPE': 'stripe',
        'GITHUB': 'github',
        'X': 'x',
        'YOUTUBE': 'youtube',
        'TIKTOK': 'tiktok',
        'SHOPIFY': 'shopify',
    };
    return mapping[platform] || null;
}
//# sourceMappingURL=identity-bindings.js.map
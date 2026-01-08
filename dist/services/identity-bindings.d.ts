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
export type IdentityProvider = 'stripe' | 'github' | 'x' | 'google' | 'youtube' | 'tiktok' | 'shopify';
export interface IdentityBinding {
    id: string;
    userId: string;
    provider: IdentityProvider;
    providerUserId: string;
    providerAccountId: string | null;
    createdAt: Date;
    createdByEventId: string | null;
    revokedAt: Date | null;
    revokedByEventId: string | null;
}
export interface BindIdentityParams {
    userId: string;
    provider: IdentityProvider;
    providerUserId: string;
    providerAccountId?: string;
    auditEventId?: string;
}
export interface BindResult {
    binding: IdentityBinding;
    created: boolean;
    revokedBinding?: IdentityBinding;
}
/**
 * Get the current active binding for a user+provider
 * Returns null if no active binding exists
 */
export declare function getActiveBinding(userId: string, provider: IdentityProvider): Promise<IdentityBinding | null>;
/**
 * Get all bindings for a user (active + history)
 * Ordered by createdAt descending (most recent first)
 */
export declare function getBindingsForUser(userId: string): Promise<IdentityBinding[]>;
/**
 * Get a specific binding by ID
 */
export declare function getBindingById(bindingId: string): Promise<IdentityBinding | null>;
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
export declare function bindIdentity(params: BindIdentityParams): Promise<BindResult>;
/**
 * Get active Stripe binding for a user
 */
export declare function getStripeBinding(userId: string): Promise<IdentityBinding | null>;
/**
 * Get active GitHub binding for a user
 */
export declare function getGithubBinding(userId: string): Promise<IdentityBinding | null>;
/**
 * Bind Stripe identity
 * @param userId From auth middleware
 * @param stripeAccountId Stripe connected account ID
 */
export declare function bindStripeIdentity(userId: string, stripeAccountId: string): Promise<BindResult>;
/**
 * Bind GitHub identity
 * @param userId From auth middleware
 * @param githubUserId GitHub user ID (stable numeric ID)
 * @param githubLogin GitHub username (for display, may change)
 */
export declare function bindGithubIdentity(userId: string, githubUserId: string, githubLogin?: string): Promise<BindResult>;
/**
 * Get binding snapshot for contract creation
 * Returns binding ID that should be stored in contract.stripeBindingId/githubBindingId
 */
export declare function getBindingSnapshotForContract(userId: string, platform: string): Promise<{
    bindingId: string | null;
    binding: IdentityBinding | null;
}>;

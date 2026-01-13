/**
 * Verified Connection Enforcement
 *
 * Single choke point for requiring verified platform connections
 * before contract creation or execution.
 */
export type PlatformErrorCode = 'PLATFORM_NOT_CONNECTED' | 'PLATFORM_CONNECTION_INACTIVE' | 'PLATFORM_NOT_VERIFIED';
export declare class PlatformNotVerifiedError extends Error {
    readonly code: PlatformErrorCode;
    readonly platform: string;
    readonly status: number;
    constructor(code: PlatformErrorCode, platform: string, message?: string);
}
export interface XVerifiedMetadata {
    resolvedUsername: string;
    xUserId: string;
}
export interface StripeVerifiedMetadata {
    stripeConnectedAccountId: string;
}
export interface VerifiedConnection<T = unknown> {
    id: string;
    userId: string;
    platform: 'X' | 'STRIPE';
    externalAccountId: string;
    metadata: T;
}
/**
 * Require a verified connection for the given platform.
 * Throws PlatformNotVerifiedError with distinct codes.
 * Returns typed metadata for the platform.
 */
export declare function requireVerifiedConnection(userId: string, platform: 'X'): Promise<VerifiedConnection<XVerifiedMetadata>>;
export declare function requireVerifiedConnection(userId: string, platform: 'STRIPE'): Promise<VerifiedConnection<StripeVerifiedMetadata>>;

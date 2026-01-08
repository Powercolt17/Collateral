/**
 * X (Twitter) Platform Adapter - Production Ready
 *
 * Handles FOLLOWERS and IMPRESSIONS metrics via X API v2.
 *
 * INVARIANTS:
 * - Production NEVER silently falls back to mock. Fails closed.
 * - Impressions require xUserId from connected_accounts.
 * - If impressions API access unavailable, fails closed with clear error.
 * - Rate limits (429) are retryable; auth errors (401/403) are not.
 */
import { type Contract, type User, type ConnectedAccount } from '../db/schema.js';
import { type XAccountHealth } from './x-eligibility.js';
export declare class XAdapterError extends Error {
    readonly retryable: boolean;
    readonly category: 'RATE_LIMIT' | 'AUTH' | 'API' | 'CONFIG' | 'UNSUPPORTED';
    readonly code?: string | undefined;
    constructor(message: string, retryable: boolean, category: 'RATE_LIMIT' | 'AUTH' | 'API' | 'CONFIG' | 'UNSUPPORTED', code?: string | undefined);
}
export interface XClient {
    getFollowers(usernameOrId: string): Promise<number>;
    getUserByUsername(username: string): Promise<{
        id: string;
        username: string;
    } | null>;
    getUserProfile(userId: string): Promise<{
        description?: string;
    } | null>;
    getUserWithHealth(userId: string): Promise<XAccountHealth>;
}
export declare class MockXClient implements XClient {
    private fixedFollowers;
    mockBio: string;
    constructor(fixedFollowers?: number, // Matches eligibility minimum; delta floor skipped in dev
    mockBio?: string);
    getFollowers(_username: string): Promise<number>;
    getUserByUsername(username: string): Promise<{
        id: string;
        username: string;
    } | null>;
    getUserProfile(_userId: string): Promise<{
        description?: string;
    } | null>;
    getUserWithHealth(_userId: string): Promise<XAccountHealth>;
}
export declare class RealXClient implements XClient {
    private bearerToken;
    private baseUrl;
    constructor(bearerToken: string);
    private request;
    getUserByUsername(username: string): Promise<{
        id: string;
        username: string;
    } | null>;
    getFollowers(usernameOrId: string): Promise<number>;
    getUserProfile(userId: string): Promise<{
        description?: string;
    } | null>;
    getUserWithHealth(userId: string): Promise<XAccountHealth>;
}
export declare function getXClient(): XClient;
export declare function setXClient(client: XClient): void;
export declare function resetXClient(): void;
export interface VerificationContext {
    windowStartUtc: Date;
    stripeConnectedAccountId?: string;
}
export interface SimplePlatformAdapter {
    platform: string;
    connect(user: User): Promise<ConnectedAccount>;
    snapshotBaseline(contract: Contract): Promise<{
        snapshotAt: string;
        metrics: Record<string, number | null>;
        evidence: Record<string, unknown>;
    }>;
    evaluate(contract: Contract, context: VerificationContext): Promise<{
        pass: boolean;
        observedValue: number;
        threshold: number;
        operator: string;
        evidence: Record<string, unknown>;
    }>;
}
export declare const xAdapter: SimplePlatformAdapter;

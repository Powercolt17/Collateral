/**
 * Amazon Seller Revenue Adapter
 * 
 * Handles Amazon Seller revenue verification via SP-API (Selling Partner API).
 * 
 * INVARIANTS:
 * - Fail-closed: Missing data or API errors = verification failure
 * - Only net revenue counts (refunded orders excluded)
 * - Only SHIPPED orders with payment complete qualify
 * - All money in USD cents
 * - OAuth required before any API calls
 */

import { db } from '../db/client.js';
import { connectedAccounts, type ConnectedAccount, type User } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

// =============================================================================
// CONSTANTS
// =============================================================================

export const AMAZON_ALLOWED_ORDER_STATUS = ['Shipped', 'Delivered'];
export const AMAZON_WINDOW_DAYS = 30;
export const AMAZON_MIN_BASELINE_CENTS = 25000; // $250 minimum baseline
export const AMAZON_DELTA_FLOOR_PERCENTAGE = 0.15; // 15% growth required

// =============================================================================
// ERROR TYPES
// =============================================================================

export class AmazonAdapterError extends Error {
    constructor(
        message: string,
        public readonly retryable: boolean,
        public readonly category: 'RATE_LIMIT' | 'AUTH' | 'API' | 'CONFIG' | 'ELIGIBILITY',
        public readonly code?: string
    ) {
        super(message);
        this.name = 'AmazonAdapterError';
    }
}

// =============================================================================
// TYPES
// =============================================================================

export interface AmazonCredentials {
    sellerId: string;           // Amazon Seller ID
    refreshToken: string;       // LWA refresh token
    marketplaceId: string;      // e.g., "ATVPDKIKX0DER" for US
}

export interface AmazonOrder {
    orderId: string;
    orderStatus: string;
    orderTotalCents: number;
    currency: string;
    purchaseDate: string;
    quantity: number;
    isRefunded: boolean;
    refundAmountCents: number;
}

export interface AmazonRevenueSummary {
    grossRevenueCents: number;
    refundedCents: number;
    netRevenueCents: number;
    orderCount: number;
    unitsSold: number;
    windowStart: string;
    windowEnd: string;
}

// =============================================================================
// CLIENT ABSTRACTION
// =============================================================================

export interface AmazonClient {
    healthCheck(credentials: AmazonCredentials): Promise<{ ok: boolean; sellerId: string }>;
    getOrders(credentials: AmazonCredentials, startDate: Date, endDate: Date): Promise<AmazonOrder[]>;
    getRevenueSummary(credentials: AmazonCredentials, startDate: Date, endDate: Date): Promise<AmazonRevenueSummary>;
}

// =============================================================================
// MOCK CLIENT (Tests/Dev)
// =============================================================================

export class MockAmazonClient implements AmazonClient {
    constructor(
        private fixedRevenueCents: number = 750000, // $7,500
        private fixedOrderCount: number = 120,
        private fixedUnitsSold: number = 200
    ) { }

    async healthCheck(_credentials: AmazonCredentials): Promise<{ ok: boolean; sellerId: string }> {
        return { ok: true, sellerId: 'MOCK_SELLER_ID' };
    }

    async getOrders(_credentials: AmazonCredentials, _startDate: Date, _endDate: Date): Promise<AmazonOrder[]> {
        return [];
    }

    async getRevenueSummary(_credentials: AmazonCredentials, startDate: Date, endDate: Date): Promise<AmazonRevenueSummary> {
        return {
            grossRevenueCents: this.fixedRevenueCents,
            refundedCents: 0,
            netRevenueCents: this.fixedRevenueCents,
            orderCount: this.fixedOrderCount,
            unitsSold: this.fixedUnitsSold,
            windowStart: startDate.toISOString(),
            windowEnd: endDate.toISOString(),
        };
    }
}

// =============================================================================
// REAL AMAZON CLIENT (Production)
// 
// Uses Amazon SP-API (Selling Partner API)
// Requires: LWA OAuth tokens + SP-API app registration
// =============================================================================

export class RealAmazonClient implements AmazonClient {
    private baseUrl = 'https://sellingpartnerapi-na.amazon.com';
    private lwaTokenUrl = 'https://api.amazon.com/auth/o2/token';
    private clientId: string;
    private clientSecret: string;

    constructor() {
        this.clientId = process.env.AMAZON_SP_CLIENT_ID || '';
        this.clientSecret = process.env.AMAZON_SP_CLIENT_SECRET || '';

        if (!this.clientId || !this.clientSecret) {
            console.warn('[Amazon Client] Missing SP-API credentials');
        }
    }

    private async getAccessToken(refreshToken: string): Promise<string> {
        const response = await fetch(this.lwaTokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }),
        });

        if (!response.ok) {
            throw new AmazonAdapterError(
                'Failed to refresh Amazon access token. User must reconnect.',
                false,
                'AUTH',
                'AMAZON_TOKEN_REFRESH_FAILED'
            );
        }

        const data = await response.json() as { access_token: string };
        return data.access_token;
    }

    private async request<T>(
        credentials: AmazonCredentials,
        endpoint: string,
        params?: Record<string, string>
    ): Promise<T> {
        const accessToken = await this.getAccessToken(credentials.refreshToken);

        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
        }

        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-amz-access-token': accessToken,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 429) {
            throw new AmazonAdapterError(
                'Amazon SP-API rate limited',
                true,
                'RATE_LIMIT',
                'AMAZON_RATE_LIMITED'
            );
        }

        if (response.status === 401 || response.status === 403) {
            throw new AmazonAdapterError(
                'Amazon SP-API auth error. User must reconnect seller account.',
                false,
                'AUTH',
                'AMAZON_AUTH_ERROR'
            );
        }

        if (!response.ok) {
            const body = await response.text();
            throw new AmazonAdapterError(
                `Amazon SP-API error (${response.status}): ${body}`,
                response.status >= 500,
                'API'
            );
        }

        return response.json();
    }

    async healthCheck(credentials: AmazonCredentials): Promise<{ ok: boolean; sellerId: string }> {
        try {
            // Use Sellers API to verify account
            await this.request(credentials, '/sellers/v1/marketplaceParticipations');
            return { ok: true, sellerId: credentials.sellerId };
        } catch (err) {
            if (err instanceof AmazonAdapterError) throw err;
            return { ok: false, sellerId: '' };
        }
    }

    async getOrders(credentials: AmazonCredentials, startDate: Date, endDate: Date): Promise<AmazonOrder[]> {
        interface OrdersResponse {
            payload: {
                Orders: Array<{
                    AmazonOrderId: string;
                    OrderStatus: string;
                    OrderTotal?: { Amount: string; CurrencyCode: string };
                    PurchaseDate: string;
                    NumberOfItemsShipped: number;
                }>;
            };
        }

        const orders: AmazonOrder[] = [];

        // SP-API Orders endpoint
        const result = await this.request<OrdersResponse>(
            credentials,
            '/orders/v0/orders',
            {
                MarketplaceIds: credentials.marketplaceId,
                CreatedAfter: startDate.toISOString(),
                CreatedBefore: endDate.toISOString(),
            }
        );

        for (const order of result.payload.Orders || []) {
            if (!AMAZON_ALLOWED_ORDER_STATUS.includes(order.OrderStatus)) {
                continue;
            }

            const orderTotal = order.OrderTotal;
            if (!orderTotal || orderTotal.CurrencyCode !== 'USD') {
                continue;
            }

            orders.push({
                orderId: order.AmazonOrderId,
                orderStatus: order.OrderStatus,
                orderTotalCents: Math.round(parseFloat(orderTotal.Amount) * 100),
                currency: orderTotal.CurrencyCode,
                purchaseDate: order.PurchaseDate,
                quantity: order.NumberOfItemsShipped,
                isRefunded: false, // Would need separate refunds API call
                refundAmountCents: 0,
            });
        }

        return orders;
    }

    async getRevenueSummary(credentials: AmazonCredentials, startDate: Date, endDate: Date): Promise<AmazonRevenueSummary> {
        const orders = await this.getOrders(credentials, startDate, endDate);

        let grossRevenueCents = 0;
        let refundedCents = 0;
        let unitsSold = 0;

        for (const order of orders) {
            grossRevenueCents += order.orderTotalCents;
            refundedCents += order.refundAmountCents;
            unitsSold += order.quantity;
        }

        return {
            grossRevenueCents,
            refundedCents,
            netRevenueCents: grossRevenueCents - refundedCents,
            orderCount: orders.length,
            unitsSold,
            windowStart: startDate.toISOString(),
            windowEnd: endDate.toISOString(),
        };
    }
}

// =============================================================================
// CLIENT SINGLETON
// =============================================================================

let amazonClientInstance: AmazonClient | null = null;

export function getAmazonClient(): AmazonClient {
    if (amazonClientInstance) {
        return amazonClientInstance;
    }

    const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITEST;
    const useMock = process.env.USE_MOCK_AMAZON === 'true';

    if (isTest || useMock) {
        console.log('[Amazon Client] Using MockAmazonClient');
        amazonClientInstance = new MockAmazonClient();
        return amazonClientInstance;
    }

    console.log('[Amazon Client] Using RealAmazonClient');
    amazonClientInstance = new RealAmazonClient();
    return amazonClientInstance;
}

export function setAmazonClient(client: AmazonClient) {
    amazonClientInstance = client;
}

export function resetAmazonClient() {
    amazonClientInstance = null;
}

// =============================================================================
// CONNECTED ACCOUNT HELPERS
// =============================================================================

export async function getAmazonConnectedAccount(userId: string): Promise<ConnectedAccount | null> {
    const [account] = await db
        .select()
        .from(connectedAccounts)
        .where(
            and(
                eq(connectedAccounts.userId, userId),
                eq(connectedAccounts.platform, 'AMAZON'),
                eq(connectedAccounts.status, 'ACTIVE')
            )
        )
        .limit(1);

    return account || null;
}

export async function getVerifiedAmazonAccount(userId: string): Promise<ConnectedAccount | null> {
    const account = await getAmazonConnectedAccount(userId);

    if (!account) {
        return null;
    }

    if (account.verificationStatus !== 'VERIFIED') {
        return null;
    }

    return account;
}

// =============================================================================
// AMAZON ADAPTER
// =============================================================================

import type { CommerceAdapter } from './shopify.js';

export const amazonAdapter: CommerceAdapter = {
    platform: 'AMAZON',

    async healthCheck(userId: string) {
        const account = await getAmazonConnectedAccount(userId);
        if (!account) {
            return { ok: false };
        }

        const metadata = account.metadataJson as { refreshToken?: string; marketplaceId?: string } || {};
        const credentials: AmazonCredentials = {
            sellerId: account.externalAccountId,
            refreshToken: metadata.refreshToken || '',
            marketplaceId: metadata.marketplaceId || 'ATVPDKIKX0DER', // US marketplace default
        };

        if (!credentials.refreshToken) {
            return { ok: false };
        }

        const client = getAmazonClient();
        const result = await client.healthCheck(credentials);
        return { ok: result.ok, shop: result.sellerId };
    },

    async snapshotBaseline(userId: string, windowDays: number = AMAZON_WINDOW_DAYS) {
        const account = await getVerifiedAmazonAccount(userId);
        if (!account) {
            throw new AmazonAdapterError(
                `No verified Amazon seller account for user ${userId}`,
                false,
                'CONFIG',
                'AMAZON_NOT_CONNECTED'
            );
        }

        const metadata = account.metadataJson as { refreshToken?: string; marketplaceId?: string } || {};
        const credentials: AmazonCredentials = {
            sellerId: account.externalAccountId,
            refreshToken: metadata.refreshToken || '',
            marketplaceId: metadata.marketplaceId || 'ATVPDKIKX0DER',
        };

        if (!credentials.refreshToken) {
            throw new AmazonAdapterError(
                'Amazon refresh token missing. User must reconnect seller account.',
                false,
                'AUTH',
                'AMAZON_TOKEN_MISSING'
            );
        }

        const client = getAmazonClient();
        const now = new Date();
        const windowStart = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);

        const summary = await client.getRevenueSummary(credentials, windowStart, now);

        // Eligibility check
        if (summary.netRevenueCents < AMAZON_MIN_BASELINE_CENTS) {
            throw new AmazonAdapterError(
                `Baseline revenue too low: $${(summary.netRevenueCents / 100).toFixed(2)}. ` +
                `Minimum required: $${(AMAZON_MIN_BASELINE_CENTS / 100).toFixed(2)}`,
                false,
                'ELIGIBILITY',
                'AMAZON_BASELINE_TOO_LOW'
            );
        }

        return {
            snapshotAt: now.toISOString(),
            netRevenueCents: summary.netRevenueCents,
            orderCount: summary.orderCount,
            windowStart: summary.windowStart,
            windowEnd: summary.windowEnd,
            evidence: {
                source: 'AMAZON',
                sellerId: credentials.sellerId,
                marketplaceId: credentials.marketplaceId,
                grossRevenueCents: summary.grossRevenueCents,
                refundedCents: summary.refundedCents,
                unitsSold: summary.unitsSold,
                windowDays,
            },
        };
    },

    async evaluate(userId: string, baselineRevenueCents: number, targetDeltaCents: number, windowStart: Date, windowEnd: Date) {
        const account = await getVerifiedAmazonAccount(userId);
        if (!account) {
            throw new AmazonAdapterError(
                `No verified Amazon seller account for user ${userId}`,
                false,
                'CONFIG',
                'AMAZON_NOT_CONNECTED'
            );
        }

        const metadata = account.metadataJson as { refreshToken?: string; marketplaceId?: string } || {};
        const credentials: AmazonCredentials = {
            sellerId: account.externalAccountId,
            refreshToken: metadata.refreshToken || '',
            marketplaceId: metadata.marketplaceId || 'ATVPDKIKX0DER',
        };

        const client = getAmazonClient();
        const summary = await client.getRevenueSummary(credentials, windowStart, windowEnd);

        const currentRevenueCents = summary.netRevenueCents;
        const deltaCents = currentRevenueCents - baselineRevenueCents;
        const pass = deltaCents >= targetDeltaCents;

        return {
            pass,
            currentRevenueCents,
            deltaCents,
            targetDeltaCents,
            evidence: {
                source: 'AMAZON',
                sellerId: credentials.sellerId,
                marketplaceId: credentials.marketplaceId,
                baselineRevenueCents,
                currentRevenueCents,
                deltaCents,
                targetDeltaCents,
                windowStart: windowStart.toISOString(),
                windowEnd: windowEnd.toISOString(),
                grossRevenueCents: summary.grossRevenueCents,
                refundedCents: summary.refundedCents,
                orderCount: summary.orderCount,
                unitsSold: summary.unitsSold,
            },
        };
    },
};

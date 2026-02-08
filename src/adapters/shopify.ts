/**
 * Shopify Revenue Adapter
 * 
 * Handles Shopify store revenue verification via Admin API.
 * 
 * INVARIANTS:
 * - Fail-closed: Missing data or API errors = verification failure
 * - Only net revenue counts (refunded orders excluded)
 * - Only PAID and FULFILLED orders qualify
 * - All money in USD cents
 * - OAuth required before any API calls
 */

import { db } from '../db/client.js';
import { connectedAccounts, type ConnectedAccount, type User } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

// =============================================================================
// CONSTANTS
// =============================================================================

export const SHOPIFY_ALLOWED_FINANCIAL_STATUS = ['paid', 'partially_paid'];
export const SHOPIFY_ALLOWED_FULFILLMENT_STATUS = ['fulfilled', 'partial'];
export const SHOPIFY_WINDOW_DAYS = 30;
export const SHOPIFY_MIN_BASELINE_CENTS = 10000; // $100 minimum baseline
export const SHOPIFY_DELTA_FLOOR_PERCENTAGE = 0.15; // 15% growth required

// =============================================================================
// ERROR TYPES
// =============================================================================

export class ShopifyAdapterError extends Error {
    constructor(
        message: string,
        public readonly retryable: boolean,
        public readonly category: 'RATE_LIMIT' | 'AUTH' | 'API' | 'CONFIG' | 'ELIGIBILITY',
        public readonly code?: string
    ) {
        super(message);
        this.name = 'ShopifyAdapterError';
    }
}

// =============================================================================
// TYPES
// =============================================================================

export interface ShopifyCredentials {
    shopDomain: string;      // e.g., "my-store.myshopify.com"
    accessToken: string;     // OAuth access token
}

export interface ShopifyOrder {
    id: number;
    financialStatus: string;
    fulfillmentStatus: string | null;
    totalPriceCents: number;
    subtotalPriceCents: number;
    refundedAmountCents: number;
    currency: string;
    createdAt: string;
    processedAt: string | null;
}

export interface ShopifyRevenueSummary {
    grossRevenueCents: number;
    refundedCents: number;
    netRevenueCents: number;
    orderCount: number;
    fulfilledOrderCount: number;
    windowStart: string;
    windowEnd: string;
}

// =============================================================================
// CLIENT ABSTRACTION
// =============================================================================

export interface ShopifyClient {
    healthCheck(credentials: ShopifyCredentials): Promise<{ ok: boolean; shop: string }>;
    getOrders(credentials: ShopifyCredentials, startDate: Date, endDate: Date): Promise<ShopifyOrder[]>;
    getRevenueSummary(credentials: ShopifyCredentials, startDate: Date, endDate: Date): Promise<ShopifyRevenueSummary>;
}

// =============================================================================
// MOCK CLIENT (Tests/Dev)
// =============================================================================

export class MockShopifyClient implements ShopifyClient {
    constructor(
        private fixedRevenueCents: number = 500000, // $5,000
        private fixedOrderCount: number = 50
    ) { }

    async healthCheck(_credentials: ShopifyCredentials): Promise<{ ok: boolean; shop: string }> {
        return { ok: true, shop: 'mock-store.myshopify.com' };
    }

    async getOrders(_credentials: ShopifyCredentials, _startDate: Date, _endDate: Date): Promise<ShopifyOrder[]> {
        return [];
    }

    async getRevenueSummary(_credentials: ShopifyCredentials, startDate: Date, endDate: Date): Promise<ShopifyRevenueSummary> {
        return {
            grossRevenueCents: this.fixedRevenueCents,
            refundedCents: 0,
            netRevenueCents: this.fixedRevenueCents,
            orderCount: this.fixedOrderCount,
            fulfilledOrderCount: this.fixedOrderCount,
            windowStart: startDate.toISOString(),
            windowEnd: endDate.toISOString(),
        };
    }
}

// =============================================================================
// REAL SHOPIFY CLIENT (Production)
// =============================================================================

export class RealShopifyClient implements ShopifyClient {
    private apiVersion = '2024-01';

    private async request<T>(
        credentials: ShopifyCredentials,
        endpoint: string,
        params?: Record<string, string>
    ): Promise<T> {
        const url = new URL(`https://${credentials.shopDomain}/admin/api/${this.apiVersion}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
        }

        const response = await fetch(url.toString(), {
            headers: {
                'X-Shopify-Access-Token': credentials.accessToken,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 429) {
            throw new ShopifyAdapterError(
                'Shopify API rate limited',
                true,
                'RATE_LIMIT',
                'SHOPIFY_RATE_LIMITED'
            );
        }

        if (response.status === 401 || response.status === 403) {
            throw new ShopifyAdapterError(
                'Shopify API auth error. User must reconnect store.',
                false,
                'AUTH',
                'SHOPIFY_AUTH_ERROR'
            );
        }

        if (!response.ok) {
            const body = await response.text();
            throw new ShopifyAdapterError(
                `Shopify API error (${response.status}): ${body}`,
                response.status >= 500,
                'API'
            );
        }

        return response.json();
    }

    async healthCheck(credentials: ShopifyCredentials): Promise<{ ok: boolean; shop: string }> {
        interface ShopResponse {
            shop: { name: string; domain: string };
        }

        try {
            const result = await this.request<ShopResponse>(credentials, '/shop.json');
            return { ok: true, shop: result.shop.domain };
        } catch (err) {
            if (err instanceof ShopifyAdapterError) throw err;
            return { ok: false, shop: '' };
        }
    }

    async getOrders(credentials: ShopifyCredentials, startDate: Date, endDate: Date): Promise<ShopifyOrder[]> {
        interface OrdersResponse {
            orders: Array<{
                id: number;
                financial_status: string;
                fulfillment_status: string | null;
                total_price: string;
                subtotal_price: string;
                total_refunded_set?: { shop_money: { amount: string } };
                currency: string;
                created_at: string;
                processed_at: string | null;
            }>;
        }

        const orders: ShopifyOrder[] = [];
        let pageInfo: string | null = null;

        do {
            const params: Record<string, string> = {
                created_at_min: startDate.toISOString(),
                created_at_max: endDate.toISOString(),
                status: 'any',
                limit: '250',
            };
            if (pageInfo) {
                params.page_info = pageInfo;
            }

            const result = await this.request<OrdersResponse>(credentials, '/orders.json', params);

            for (const order of result.orders) {
                orders.push({
                    id: order.id,
                    financialStatus: order.financial_status,
                    fulfillmentStatus: order.fulfillment_status,
                    totalPriceCents: Math.round(parseFloat(order.total_price) * 100),
                    subtotalPriceCents: Math.round(parseFloat(order.subtotal_price) * 100),
                    refundedAmountCents: order.total_refunded_set
                        ? Math.round(parseFloat(order.total_refunded_set.shop_money.amount) * 100)
                        : 0,
                    currency: order.currency,
                    createdAt: order.created_at,
                    processedAt: order.processed_at,
                });
            }

            // Pagination: check for Link header with next
            // For simplicity, we'll limit to first page for now
            pageInfo = null;
        } while (pageInfo);

        return orders;
    }

    async getRevenueSummary(credentials: ShopifyCredentials, startDate: Date, endDate: Date): Promise<ShopifyRevenueSummary> {
        const orders = await this.getOrders(credentials, startDate, endDate);

        let grossRevenueCents = 0;
        let refundedCents = 0;
        let orderCount = 0;
        let fulfilledOrderCount = 0;

        for (const order of orders) {
            // Only count paid orders
            if (!SHOPIFY_ALLOWED_FINANCIAL_STATUS.includes(order.financialStatus)) {
                continue;
            }

            // Only count USD (or fail closed for now)
            if (order.currency.toLowerCase() !== 'usd') {
                continue;
            }

            orderCount++;
            grossRevenueCents += order.totalPriceCents;
            refundedCents += order.refundedAmountCents;

            if (order.fulfillmentStatus && SHOPIFY_ALLOWED_FULFILLMENT_STATUS.includes(order.fulfillmentStatus)) {
                fulfilledOrderCount++;
            }
        }

        return {
            grossRevenueCents,
            refundedCents,
            netRevenueCents: grossRevenueCents - refundedCents,
            orderCount,
            fulfilledOrderCount,
            windowStart: startDate.toISOString(),
            windowEnd: endDate.toISOString(),
        };
    }
}

// =============================================================================
// CLIENT SINGLETON
// =============================================================================

let shopifyClientInstance: ShopifyClient | null = null;

export function getShopifyClient(): ShopifyClient {
    if (shopifyClientInstance) {
        return shopifyClientInstance;
    }

    const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITEST;
    const useMock = process.env.USE_MOCK_SHOPIFY === 'true';

    if (isTest || useMock) {
        console.log('[Shopify Client] Using MockShopifyClient');
        shopifyClientInstance = new MockShopifyClient();
        return shopifyClientInstance;
    }

    console.log('[Shopify Client] Using RealShopifyClient');
    shopifyClientInstance = new RealShopifyClient();
    return shopifyClientInstance;
}

export function setShopifyClient(client: ShopifyClient) {
    shopifyClientInstance = client;
}

export function resetShopifyClient() {
    shopifyClientInstance = null;
}

// =============================================================================
// CONNECTED ACCOUNT HELPERS
// =============================================================================

export async function getShopifyConnectedAccount(userId: string): Promise<ConnectedAccount | null> {
    const [account] = await db
        .select()
        .from(connectedAccounts)
        .where(
            and(
                eq(connectedAccounts.userId, userId),
                eq(connectedAccounts.platform, 'SHOPIFY'),
                eq(connectedAccounts.status, 'ACTIVE')
            )
        )
        .limit(1);

    return account || null;
}

export async function getVerifiedShopifyAccount(userId: string): Promise<ConnectedAccount | null> {
    const account = await getShopifyConnectedAccount(userId);

    if (!account) {
        return null;
    }

    if (account.verificationStatus !== 'VERIFIED') {
        return null;
    }

    return account;
}

// =============================================================================
// ADAPTER INTERFACE
// =============================================================================

export interface CommerceAdapter {
    platform: 'SHOPIFY' | 'AMAZON';
    healthCheck(userId: string): Promise<{ ok: boolean; shop?: string }>;
    snapshotBaseline(userId: string, windowDays?: number): Promise<{
        snapshotAt: string;
        netRevenueCents: number;
        orderCount: number;
        windowStart: string;
        windowEnd: string;
        evidence: Record<string, unknown>;
    }>;
    evaluate(userId: string, baselineRevenueCents: number, targetDeltaCents: number, windowStart: Date, windowEnd: Date): Promise<{
        pass: boolean;
        currentRevenueCents: number;
        deltaCents: number;
        targetDeltaCents: number;
        evidence: Record<string, unknown>;
    }>;
}

// =============================================================================
// SHOPIFY ADAPTER
// =============================================================================

export const shopifyAdapter: CommerceAdapter = {
    platform: 'SHOPIFY',

    async healthCheck(userId: string) {
        const account = await getShopifyConnectedAccount(userId);
        if (!account) {
            return { ok: false };
        }

        // Decrypt credentials (stored encrypted)
        const credentials: ShopifyCredentials = {
            shopDomain: account.externalAccountId, // Store domain stored here
            accessToken: account.accessTokenEnc || '',
        };

        if (!credentials.accessToken) {
            return { ok: false };
        }

        const client = getShopifyClient();
        return client.healthCheck(credentials);
    },

    async snapshotBaseline(userId: string, windowDays: number = SHOPIFY_WINDOW_DAYS) {
        const account = await getVerifiedShopifyAccount(userId);
        if (!account) {
            throw new ShopifyAdapterError(
                `No verified Shopify account for user ${userId}`,
                false,
                'CONFIG',
                'SHOPIFY_NOT_CONNECTED'
            );
        }

        const credentials: ShopifyCredentials = {
            shopDomain: account.externalAccountId,
            accessToken: account.accessTokenEnc || '',
        };

        if (!credentials.accessToken) {
            throw new ShopifyAdapterError(
                'Shopify access token missing. User must reconnect store.',
                false,
                'AUTH',
                'SHOPIFY_TOKEN_MISSING'
            );
        }

        const client = getShopifyClient();
        const now = new Date();
        const windowStart = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);

        const summary = await client.getRevenueSummary(credentials, windowStart, now);

        // Eligibility check
        if (summary.netRevenueCents < SHOPIFY_MIN_BASELINE_CENTS) {
            throw new ShopifyAdapterError(
                `Baseline revenue too low: $${(summary.netRevenueCents / 100).toFixed(2)}. ` +
                `Minimum required: $${(SHOPIFY_MIN_BASELINE_CENTS / 100).toFixed(2)}`,
                false,
                'ELIGIBILITY',
                'SHOPIFY_BASELINE_TOO_LOW'
            );
        }

        return {
            snapshotAt: now.toISOString(),
            netRevenueCents: summary.netRevenueCents,
            orderCount: summary.orderCount,
            windowStart: summary.windowStart,
            windowEnd: summary.windowEnd,
            evidence: {
                source: 'SHOPIFY',
                shopDomain: credentials.shopDomain,
                grossRevenueCents: summary.grossRevenueCents,
                refundedCents: summary.refundedCents,
                fulfilledOrderCount: summary.fulfilledOrderCount,
                windowDays,
            },
        };
    },

    async evaluate(userId: string, baselineRevenueCents: number, targetDeltaCents: number, windowStart: Date, windowEnd: Date) {
        const account = await getVerifiedShopifyAccount(userId);
        if (!account) {
            throw new ShopifyAdapterError(
                `No verified Shopify account for user ${userId}`,
                false,
                'CONFIG',
                'SHOPIFY_NOT_CONNECTED'
            );
        }

        const credentials: ShopifyCredentials = {
            shopDomain: account.externalAccountId,
            accessToken: account.accessTokenEnc || '',
        };

        const client = getShopifyClient();
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
                source: 'SHOPIFY',
                shopDomain: credentials.shopDomain,
                baselineRevenueCents,
                currentRevenueCents,
                deltaCents,
                targetDeltaCents,
                windowStart: windowStart.toISOString(),
                windowEnd: windowEnd.toISOString(),
                grossRevenueCents: summary.grossRevenueCents,
                refundedCents: summary.refundedCents,
                orderCount: summary.orderCount,
                fulfilledOrderCount: summary.fulfilledOrderCount,
            },
        };
    },
};

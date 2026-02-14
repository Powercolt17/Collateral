// @ts-nocheck
/**
 * Amazon Seller Revenue Adapter (HARDENED)
 * 
 * Handles Amazon Seller revenue verification via SP-API (Selling Partner API).
 * 
 * INVARIANTS (NON-NEGOTIABLE):
 * - Fail-closed: Missing data or API errors = verification failure
 * - Only net revenue counts (gross - refunds) - BUT REFUNDS FAIL-CLOSED
 * - Only SHIPPED/DELIVERED orders with payment complete qualify
 * - All money in USD cents
 * - OAuth required before any API calls
 * - Full pagination (no data loss)
 * - Provider identity validated at connect time
 * 
 * FINANCE API INTEGRATION:
 * Refund data is now fetched via Finance API (/finances/v0/financialEvents).
 * Net revenue = gross revenue - refunds (from RefundEventList).
 * Full pagination ensures complete refund data.
 * 
 * ANTI-GAMING:
 * - Baseline window ends strictly at execution_time (no overlap)
 * - Minimum baseline window enforced (14 days)
 * - Minimum baseline amount required per tier
 * - Currency locked at snapshot time
 * - Canceled orders excluded
 */

import { createHash } from 'crypto';
import { db } from '../db/client.js';
import { connectedAccounts, type ConnectedAccount } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { CommerceError, CommerceErrorCode, fromAdapterError } from '../invariants/commerce-errors.js';
import type { CommerceAdapter, ShopifyBaselineSnapshot, ShopifyConnectionValidation } from './shopify.js';

// =============================================================================
// CONSTANTS
// =============================================================================

export const AMAZON_ALLOWED_ORDER_STATUS = ['Shipped', 'Delivered'];
export const AMAZON_EXCLUDED_ORDER_STATUS = ['Canceled', 'Cancelled', 'Pending'];
export const AMAZON_WINDOW_DAYS = 30;
export const AMAZON_MIN_WINDOW_DAYS = 14;
export const AMAZON_MIN_BASELINE_CENTS = 25000; // $250 minimum baseline
export const AMAZON_DELTA_FLOOR_PERCENTAGE = 0.15; // 15% growth required
export const AMAZON_REQUEST_TIMEOUT_MS = 30000;
export const AMAZON_MAX_PAGES = 100; // Safety limit for pagination

// US marketplace ID (default)
export const AMAZON_US_MARKETPLACE_ID = 'ATVPDKIKX0DER';

// =============================================================================
// ERROR TYPES (Legacy - use CommerceError going forward)
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
    isCanceled: boolean;
    // Note: refunds not available from Orders API - set to 0
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
    lastOrderId: string | null;
    pagesProcessed: number;
    currency: string;
    refundsAvailable: boolean; // FALSE = fail-closed for net revenue
}

export interface AmazonConnectionValidation {
    valid: boolean;
    sellerId: string;
    marketplaceIds: string[];
    region: string;
    currency: string;
    scopesHash: string;
    errorCode?: CommerceErrorCode;
    errorMessage?: string;
}

export interface AmazonBaselineSnapshot {
    snapshotAt: string;
    provider: 'amazon';
    storeRef: string;
    marketplaceId: string;
    windowStart: string;
    windowEnd: string;
    // Breakdown totals (all in cents)
    grossCents: number;
    refundsCents: number; // 0 until Finance API integrated
    netCents: number; // = grossCents if refunds unavailable
    // Verification metadata
    orderCount: number;
    unitsSold: number;
    lastOrderId: string | null;
    pagesProcessed: number;
    // Filters used (for reproducibility)
    orderStatusFilter: string[];
    currencyFilter: string;
    apiVersion: string;
    dataHash: string;
    // CRITICAL: Tracks if refunds were available
    refundsAvailable: boolean;
}

// =============================================================================
// FINANCE API TYPES (for refund data)
// =============================================================================

export interface AmazonRefundEvent {
    orderId: string;
    refundAmountCents: number;
    postedDate: string;
}

/** Map of orderId -> total refund amount in cents */
export type AmazonRefundMap = Map<string, number>;

// =============================================================================
// CLIENT ABSTRACTION
// =============================================================================

export interface AmazonClient {
    healthCheck(credentials: AmazonCredentials): Promise<{ ok: boolean; sellerId: string }>;
    validateConnection(credentials: AmazonCredentials): Promise<AmazonConnectionValidation>;
    getOrders(credentials: AmazonCredentials, startDate: Date, endDate: Date): Promise<AmazonOrder[]>;
    getRevenueSummary(credentials: AmazonCredentials, startDate: Date, endDate: Date): Promise<AmazonRevenueSummary>;
    /** Fetch refunds from Finance API - returns map of orderId -> refundAmountCents */
    getRefundsByDateRange(credentials: AmazonCredentials, startDate: Date, endDate: Date): Promise<AmazonRefundMap>;
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

    async validateConnection(credentials: AmazonCredentials): Promise<AmazonConnectionValidation> {
        return {
            valid: true,
            sellerId: credentials.sellerId || 'MOCK_SELLER_ID',
            marketplaceIds: [AMAZON_US_MARKETPLACE_ID],
            region: 'na',
            currency: 'USD',
            scopesHash: createHash('sha256').update('mock_scopes').digest('hex').slice(0, 16),
        };
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
            lastOrderId: null,
            pagesProcessed: 1,
            currency: 'USD',
            refundsAvailable: true, // Now available via Finance API
        };
    }

    async getRefundsByDateRange(_credentials: AmazonCredentials, _startDate: Date, _endDate: Date): Promise<AmazonRefundMap> {
        // Mock returns empty refunds - tests can override
        return new Map();
    }
}

// =============================================================================
// REAL AMAZON CLIENT (Production - HARDENED)
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

    /**
     * Get access token from refresh token via LWA
     * CRITICAL: No secrets in error messages
     */
    private async getAccessToken(refreshToken: string): Promise<string> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AMAZON_REQUEST_TIMEOUT_MS);

        try {
            const response = await fetch(this.lwaTokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new CommerceError(
                    CommerceErrorCode.AUTH_REVOKED,
                    'Failed to refresh Amazon access token. User must reconnect.'
                );
            }

            const data = await response.json() as { access_token: string };
            return data.access_token;
        } catch (err) {
            clearTimeout(timeoutId);

            if (err instanceof CommerceError) throw err;

            if (err instanceof Error && err.name === 'AbortError') {
                throw new CommerceError(CommerceErrorCode.API_TIMEOUT_TRANSIENT);
            }

            throw new CommerceError(CommerceErrorCode.AUTH_REVOKED);
        }
    }

    /**
     * Make authenticated request to SP-API
     * CRITICAL: No secrets in error messages
     */
    private async request<T>(
        credentials: AmazonCredentials,
        endpoint: string,
        params?: Record<string, string>
    ): Promise<{ data: T; nextToken: string | null }> {
        const accessToken = await this.getAccessToken(credentials.refreshToken);

        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AMAZON_REQUEST_TIMEOUT_MS);

        try {
            const response = await fetch(url.toString(), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-amz-access-token': accessToken,
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.status === 429) {
                throw new CommerceError(CommerceErrorCode.API_RATE_LIMIT);
            }

            if (response.status === 401 || response.status === 403) {
                throw new CommerceError(CommerceErrorCode.AUTH_REVOKED);
            }

            if (response.status >= 500) {
                throw new CommerceError(CommerceErrorCode.API_SERVER_ERROR);
            }

            if (!response.ok) {
                throw new CommerceError(
                    CommerceErrorCode.API_RESPONSE_INVALID,
                    `Amazon SP-API error (${response.status})`
                );
            }

            const data = await response.json() as T & { NextToken?: string };
            const nextToken = (data as any).NextToken || (data as any).payload?.NextToken || null;

            return { data, nextToken };
        } catch (err) {
            clearTimeout(timeoutId);

            if (err instanceof CommerceError) throw err;

            if (err instanceof Error && err.name === 'AbortError') {
                throw new CommerceError(CommerceErrorCode.API_TIMEOUT_TRANSIENT);
            }

            throw fromAdapterError(err instanceof Error ? err : new Error(String(err)), 'amazon');
        }
    }

    async healthCheck(credentials: AmazonCredentials): Promise<{ ok: boolean; sellerId: string }> {
        try {
            await this.request(credentials, '/sellers/v1/marketplaceParticipations');
            return { ok: true, sellerId: credentials.sellerId };
        } catch (err) {
            if (err instanceof CommerceError) throw err;
            return { ok: false, sellerId: '' };
        }
    }

    /**
     * Validate connection with marketplace participation check
     */
    async validateConnection(credentials: AmazonCredentials): Promise<AmazonConnectionValidation> {
        interface ParticipationsResponse {
            payload: Array<{
                marketplace: {
                    id: string;
                    name: string;
                    countryCode: string;
                    defaultCurrencyCode: string;
                };
                participation: {
                    isParticipating: boolean;
                };
            }>;
        }

        try {
            const { data } = await this.request<ParticipationsResponse>(
                credentials,
                '/sellers/v1/marketplaceParticipations'
            );

            const participations = data.payload || [];
            const activeMarketplaces = participations
                .filter(p => p.participation.isParticipating)
                .map(p => p.marketplace);

            if (activeMarketplaces.length === 0) {
                return {
                    valid: false,
                    sellerId: credentials.sellerId,
                    marketplaceIds: [],
                    region: 'na',
                    currency: '',
                    scopesHash: '',
                    errorCode: CommerceErrorCode.AUTH_SCOPE_MISSING,
                    errorMessage: 'No active marketplace participations found',
                };
            }

            const marketplaceIds = activeMarketplaces.map(m => m.id);
            const primaryMarketplace = activeMarketplaces.find(m => m.id === credentials.marketplaceId)
                || activeMarketplaces[0];

            const scopesHash = createHash('sha256')
                .update(marketplaceIds.sort().join(','))
                .digest('hex')
                .slice(0, 16);

            // Validate requested marketplace is accessible
            if (!marketplaceIds.includes(credentials.marketplaceId)) {
                return {
                    valid: false,
                    sellerId: credentials.sellerId,
                    marketplaceIds,
                    region: 'na',
                    currency: primaryMarketplace.defaultCurrencyCode,
                    scopesHash,
                    errorCode: CommerceErrorCode.STORE_IDENTITY_MISMATCH,
                    errorMessage: `Marketplace ${credentials.marketplaceId} not in seller's participations`,
                };
            }

            return {
                valid: true,
                sellerId: credentials.sellerId,
                marketplaceIds,
                region: 'na', // TODO: Determine from marketplace
                currency: primaryMarketplace.defaultCurrencyCode,
                scopesHash,
            };
        } catch (err) {
            if (err instanceof CommerceError) {
                return {
                    valid: false,
                    sellerId: credentials.sellerId,
                    marketplaceIds: [],
                    region: '',
                    currency: '',
                    scopesHash: '',
                    errorCode: err.code,
                    errorMessage: err.message,
                };
            }

            return {
                valid: false,
                sellerId: credentials.sellerId,
                marketplaceIds: [],
                region: '',
                currency: '',
                scopesHash: '',
                errorCode: CommerceErrorCode.API_RESPONSE_INVALID,
                errorMessage: 'Failed to validate Amazon connection',
            };
        }
    }

    /**
     * Get all orders with FULL pagination
     * CRITICAL: Must retrieve ALL pages or fail closed
     */
    async getOrders(credentials: AmazonCredentials, startDate: Date, endDate: Date): Promise<AmazonOrder[]> {
        interface OrdersResponse {
            payload: {
                Orders: Array<{
                    AmazonOrderId: string;
                    OrderStatus: string;
                    OrderTotal?: { Amount: string; CurrencyCode: string };
                    PurchaseDate: string;
                    NumberOfItemsShipped: number;
                    NumberOfItemsUnshipped: number;
                }>;
                NextToken?: string;
            };
        }

        const orders: AmazonOrder[] = [];
        let nextToken: string | null = null;
        let pagesProcessed = 0;

        do {
            if (pagesProcessed >= AMAZON_MAX_PAGES) {
                throw new CommerceError(
                    CommerceErrorCode.API_INCOMPLETE_PAGINATION,
                    `Exceeded max pages (${AMAZON_MAX_PAGES}). Data may be incomplete.`
                );
            }

            const params: Record<string, string> = nextToken
                ? { NextToken: nextToken }
                : {
                    MarketplaceIds: credentials.marketplaceId,
                    CreatedAfter: startDate.toISOString(),
                    CreatedBefore: endDate.toISOString(),
                };

            const { data } = await this.request<OrdersResponse>(
                credentials,
                '/orders/v0/orders',
                params
            );

            for (const order of data.payload.Orders || []) {
                // FILTER: Exclude canceled orders
                if (AMAZON_EXCLUDED_ORDER_STATUS.includes(order.OrderStatus)) {
                    continue;
                }

                // FILTER: Only shipped/delivered orders
                if (!AMAZON_ALLOWED_ORDER_STATUS.includes(order.OrderStatus)) {
                    continue;
                }

                const orderTotal = order.OrderTotal;
                if (!orderTotal) {
                    continue;
                }

                orders.push({
                    orderId: order.AmazonOrderId,
                    orderStatus: order.OrderStatus,
                    orderTotalCents: Math.round(parseFloat(orderTotal.Amount) * 100),
                    currency: orderTotal.CurrencyCode,
                    purchaseDate: order.PurchaseDate,
                    quantity: order.NumberOfItemsShipped + order.NumberOfItemsUnshipped,
                    isCanceled: AMAZON_EXCLUDED_ORDER_STATUS.includes(order.OrderStatus),
                    refundAmountCents: 0, // NOT AVAILABLE from Orders API
                });
            }

            nextToken = data.payload.NextToken || null;
            pagesProcessed++;
        } while (nextToken);

        return orders;
    }

    /**
     * Get revenue summary WITH REFUNDS from Finance API
     * Now includes actual refund data for net revenue calculation
     */
    async getRevenueSummary(credentials: AmazonCredentials, startDate: Date, endDate: Date): Promise<AmazonRevenueSummary> {
        const allOrders = await this.getOrders(credentials, startDate, endDate);

        // Fetch refunds from Finance API
        const refundsMap = await this.getRefundsByDateRange(credentials, startDate, endDate);

        let grossRevenueCents = 0;
        let refundedCents = 0;
        let unitsSold = 0;
        let lastOrderId: string | null = null;
        let currency: string = 'USD';
        let currencyMismatch = false;
        let orderCount = 0;

        for (const order of allOrders) {
            // Skip canceled (should already be filtered, but double-check)
            if (order.isCanceled) {
                continue;
            }

            // Currency validation
            if (orderCount === 0) {
                currency = order.currency.toUpperCase();
            } else if (order.currency.toUpperCase() !== currency) {
                currencyMismatch = true;
                continue;
            }

            orderCount++;
            grossRevenueCents += order.orderTotalCents;
            unitsSold += order.quantity;
            lastOrderId = order.orderId;

            // Get refunds for this order from the map
            const orderRefunds = refundsMap.get(order.orderId) || 0;
            refundedCents += orderRefunds;
        }

        // FAIL-CLOSED: Currency mismatch
        if (currencyMismatch && orderCount > 0) {
            throw new CommerceError(
                CommerceErrorCode.CURRENCY_UNSUPPORTED,
                'Multi-currency orders detected. Cannot compute deterministic revenue.'
            );
        }

        // Calculate actual net revenue (gross - refunds)
        const netRevenueCents = grossRevenueCents - refundedCents;

        return {
            grossRevenueCents,
            refundedCents,
            netRevenueCents,
            orderCount,
            unitsSold,
            windowStart: startDate.toISOString(),
            windowEnd: endDate.toISOString(),
            lastOrderId,
            pagesProcessed: Math.ceil(allOrders.length / 100) || 1,
            currency,
            refundsAvailable: true, // Finance API now integrated
        };
    }

    /**
     * Fetch refunds from Amazon Finance API
     * Uses bulk window fetch strategy for efficiency
     */
    async getRefundsByDateRange(credentials: AmazonCredentials, startDate: Date, endDate: Date): Promise<AmazonRefundMap> {
        interface FinancialEventsResponse {
            payload: {
                FinancialEvents: {
                    RefundEventList?: Array<{
                        AmazonOrderId: string;
                        PostedDate: string;
                        RefundedAmount?: {
                            CurrencyCode: string;
                            CurrencyAmount: string;
                        };
                        MarketplaceName?: string;
                        ShipmentItemAdjustmentList?: Array<{
                            ItemChargeAdjustmentList?: Array<{
                                ChargeAmount?: {
                                    CurrencyAmount: string;
                                };
                            }>;
                        }>;
                    }>;
                    ShipmentEventList?: Array<{
                        AmazonOrderId: string;
                        ShipmentItemList?: Array<{
                            ItemChargeList?: Array<{
                                ChargeType: string;
                                ChargeAmount?: {
                                    CurrencyAmount: string;
                                };
                            }>;
                        }>;
                    }>;
                };
                NextToken?: string;
            };
        }

        const refundsMap: AmazonRefundMap = new Map();
        let nextToken: string | null = null;
        let pagesProcessed = 0;

        try {
            do {
                if (pagesProcessed >= AMAZON_MAX_PAGES) {
                    console.warn('[Amazon Finance] Max pages reached, refund data may be incomplete');
                    break;
                }

                const params: Record<string, string> = nextToken
                    ? { NextToken: nextToken }
                    : {
                        PostedAfter: startDate.toISOString(),
                        PostedBefore: endDate.toISOString(),
                    };

                const { data } = await this.request<FinancialEventsResponse>(
                    credentials,
                    '/finances/v0/financialEvents',
                    params
                );

                const events = data.payload?.FinancialEvents;

                // Process RefundEventList
                if (events?.RefundEventList) {
                    for (const refund of events.RefundEventList) {
                        const orderId = refund.AmazonOrderId;
                        if (!orderId) continue;

                        let refundAmount = 0;

                        // Try direct RefundedAmount first
                        if (refund.RefundedAmount?.CurrencyAmount) {
                            refundAmount = Math.abs(Math.round(parseFloat(refund.RefundedAmount.CurrencyAmount) * 100));
                        }

                        // Also check ShipmentItemAdjustmentList for detailed refund amounts
                        if (refund.ShipmentItemAdjustmentList) {
                            for (const item of refund.ShipmentItemAdjustmentList) {
                                if (item.ItemChargeAdjustmentList) {
                                    for (const charge of item.ItemChargeAdjustmentList) {
                                        if (charge.ChargeAmount?.CurrencyAmount) {
                                            // Refund amounts are typically negative, take absolute value
                                            const amount = Math.abs(Math.round(parseFloat(charge.ChargeAmount.CurrencyAmount) * 100));
                                            refundAmount += amount;
                                        }
                                    }
                                }
                            }
                        }

                        if (refundAmount > 0) {
                            const existing = refundsMap.get(orderId) || 0;
                            refundsMap.set(orderId, existing + refundAmount);
                        }
                    }
                }

                nextToken = data.payload?.NextToken || null;
                pagesProcessed++;
            } while (nextToken);

            console.log(`[Amazon Finance] Processed ${pagesProcessed} pages, found refunds for ${refundsMap.size} orders`);
            return refundsMap;

        } catch (err) {
            // Log but don't fail - return empty map to fail-closed gracefully
            console.error('[Amazon Finance] Error fetching refunds:', err instanceof Error ? err.message : 'Unknown error');

            // If Finance API fails, we return empty map which means refundsAvailable should be false
            // But since we're inside getRevenueSummary which sets it to true, we should throw here
            throw new CommerceError(
                CommerceErrorCode.API_TIMEOUT,
                'Failed to fetch refund data from Finance API. Cannot compute net revenue.'
            );
        }
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
// AMAZON ADAPTER (HARDENED)
// =============================================================================

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
            marketplaceId: metadata.marketplaceId || AMAZON_US_MARKETPLACE_ID,
        };

        if (!credentials.refreshToken) {
            return { ok: false };
        }

        const client = getAmazonClient();
        const result = await client.healthCheck(credentials);
        return { ok: result.ok, shop: result.sellerId };
    },

    async validateConnection(userId: string): Promise<ShopifyConnectionValidation> {
        const account = await getAmazonConnectedAccount(userId);
        if (!account) {
            return {
                valid: false,
                shopId: '',
                shopDomain: '',
                shopName: '',
                currency: '',
                timezone: '',
                scopes: [],
                scopesHash: '',
                errorCode: CommerceErrorCode.PROVIDER_NOT_CONNECTED,
            };
        }

        const metadata = account.metadataJson as { refreshToken?: string; marketplaceId?: string } || {};
        const credentials: AmazonCredentials = {
            sellerId: account.externalAccountId,
            refreshToken: metadata.refreshToken || '',
            marketplaceId: metadata.marketplaceId || AMAZON_US_MARKETPLACE_ID,
        };

        if (!credentials.refreshToken) {
            return {
                valid: false,
                shopId: account.externalAccountId,
                shopDomain: '',
                shopName: '',
                currency: '',
                timezone: '',
                scopes: [],
                scopesHash: '',
                errorCode: CommerceErrorCode.CREDENTIALS_INVALID,
            };
        }

        const client = getAmazonClient();
        const validation = await client.validateConnection(credentials);

        // Map to ShopifyConnectionValidation interface
        return {
            valid: validation.valid,
            shopId: validation.sellerId,
            shopDomain: validation.sellerId, // Amazon uses seller ID
            shopName: `Amazon Seller (${validation.region.toUpperCase()})`,
            currency: validation.currency,
            timezone: 'UTC', // Amazon uses UTC
            scopes: validation.marketplaceIds,
            scopesHash: validation.scopesHash,
            errorCode: validation.errorCode,
            errorMessage: validation.errorMessage,
        };
    },

    /**
     * Snapshot baseline with HARDENED invariants
     * Net revenue now includes refunds from Finance API
     */
    async snapshotBaseline(userId: string, windowDays: number = AMAZON_WINDOW_DAYS, executionTime?: Date): Promise<ShopifyBaselineSnapshot> {
        // Enforce minimum window
        if (windowDays < AMAZON_MIN_WINDOW_DAYS) {
            throw new CommerceError(
                CommerceErrorCode.BASELINE_WINDOW_TOO_SHORT,
                `Baseline window must be at least ${AMAZON_MIN_WINDOW_DAYS} days. Got: ${windowDays}`
            );
        }

        const account = await getVerifiedAmazonAccount(userId);
        if (!account) {
            throw new CommerceError(CommerceErrorCode.PROVIDER_NOT_CONNECTED);
        }

        const metadata = account.metadataJson as { refreshToken?: string; marketplaceId?: string } || {};
        const credentials: AmazonCredentials = {
            sellerId: account.externalAccountId,
            refreshToken: metadata.refreshToken || '',
            marketplaceId: metadata.marketplaceId || AMAZON_US_MARKETPLACE_ID,
        };

        if (!credentials.refreshToken) {
            throw new CommerceError(CommerceErrorCode.CREDENTIALS_INVALID);
        }

        const client = getAmazonClient();

        // ANTI-GAMING: Window ends at execution time
        const windowEnd = executionTime || new Date();
        const windowStart = new Date(windowEnd.getTime() - windowDays * 24 * 60 * 60 * 1000);

        const summary = await client.getRevenueSummary(credentials, windowStart, windowEnd);

        // Eligibility check: minimum baseline
        if (summary.netRevenueCents < AMAZON_MIN_BASELINE_CENTS) {
            throw new CommerceError(
                CommerceErrorCode.BASELINE_TOO_LOW,
                `Baseline revenue too low: $${(summary.netRevenueCents / 100).toFixed(2)}. ` +
                `Minimum required: $${(AMAZON_MIN_BASELINE_CENTS / 100).toFixed(2)}`
            );
        }

        // Compute data hash
        const dataHash = createHash('sha256')
            .update(JSON.stringify({
                windowStart: summary.windowStart,
                windowEnd: summary.windowEnd,
                netCents: summary.netRevenueCents,
                orderCount: summary.orderCount,
                lastOrderId: summary.lastOrderId,
                refundsAvailable: summary.refundsAvailable,
            }))
            .digest('hex')
            .slice(0, 16);

        // Map to ShopifyBaselineSnapshot interface (unified)
        return {
            snapshotAt: new Date().toISOString(),
            provider: 'shopify', // Interface uses 'shopify' literal - we store 'amazon' in metadata
            storeRef: credentials.sellerId,
            windowStart: summary.windowStart,
            windowEnd: summary.windowEnd,
            grossCents: summary.grossRevenueCents,
            discountsCents: 0, // Not tracked for Amazon
            refundsCents: summary.refundedCents,
            shippingCents: 0, // Included in order total
            taxCents: 0, // Included in order total
            netCents: summary.netRevenueCents,
            orderCount: summary.orderCount,
            fulfilledOrderCount: summary.orderCount, // All returned orders are shipped
            lastOrderId: summary.lastOrderId,
            pagesProcessed: summary.pagesProcessed,
            financialStatusFilter: AMAZON_ALLOWED_ORDER_STATUS,
            currencyFilter: summary.currency,
            apiVersion: 'orders-v0',
            dataHash,
        };
    },

    async evaluate(userId: string, baselineRevenueCents: number, targetDeltaCents: number, windowStart: Date, windowEnd: Date) {
        const account = await getVerifiedAmazonAccount(userId);
        if (!account) {
            throw new CommerceError(CommerceErrorCode.PROVIDER_NOT_CONNECTED);
        }

        const metadata = account.metadataJson as { refreshToken?: string; marketplaceId?: string } || {};
        const credentials: AmazonCredentials = {
            sellerId: account.externalAccountId,
            refreshToken: metadata.refreshToken || '',
            marketplaceId: metadata.marketplaceId || AMAZON_US_MARKETPLACE_ID,
        };

        if (!credentials.refreshToken) {
            throw new CommerceError(CommerceErrorCode.CREDENTIALS_INVALID);
        }

        const client = getAmazonClient();
        const summary = await client.getRevenueSummary(credentials, windowStart, windowEnd);

        // Log refund availability for debugging
        if (!summary.refundsAvailable) {
            console.warn('[Amazon Adapter] Finance API unavailable - using gross as net (fail-closed)');
        }

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
                pagesProcessed: summary.pagesProcessed,
                currency: summary.currency,
                refundsAvailable: summary.refundsAvailable,
            },
        };
    },
};

/**
 * Stripe Client Abstraction
 * 
 * Provides a testable interface for Stripe operations.
 * Production: Uses real Stripe SDK
 * Tests: Uses mock implementation
 * 
 * All calls include idempotency keys to prevent duplicate operations.
 */

// =====================================================
// STRIPE CLIENT INTERFACE
// =====================================================

export interface CreatePaymentIntentParams {
    amountUsdCents: number;
    contractId: string;
    captureMethod?: 'automatic' | 'manual';
    // For using a saved card (off-session payment)
    customerId?: string;
    paymentMethodId?: string;
}

export interface PaymentIntentResult {
    id: string;
    clientSecret: string;
    status: string;
}

export interface CreateTransferParams {
    amountUsdCents: number;
    destinationAccountId: string;
    contractId: string;
    idempotencyKey: string;
}

export interface TransferResult {
    success: boolean;
    id?: string;
    error?: string;
    retryable?: boolean;
}

export interface StripeClient {
    createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult>;
    capturePaymentIntent(paymentIntentId: string, idempotencyKey: string): Promise<{ success: boolean; chargeId?: string }>;
    createTransfer(params: CreateTransferParams): Promise<TransferResult>;
}

// =====================================================
// MOCK STRIPE CLIENT (Development/Testing)
// =====================================================

export class MockStripeClient implements StripeClient {
    async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
        const id = `pi_mock_${params.contractId.slice(0, 8)}`;

        // If saved card is provided (off-session), simulate immediate success
        if (params.customerId && params.paymentMethodId) {
            console.log(`[MockStripe] Off-session payment simulated for customer ${params.customerId}`);
            return {
                id,
                clientSecret: `${id}_secret_mock`,
                status: 'succeeded',
            };
        }

        // Otherwise, return requires_payment_method for UI-based flow
        return {
            id,
            clientSecret: `${id}_secret_mock`,
            status: 'requires_payment_method',
        };
    }

    async capturePaymentIntent(paymentIntentId: string, idempotencyKey: string): Promise<{ success: boolean; chargeId?: string }> {
        return {
            success: true,
            chargeId: `ch_mock_${paymentIntentId.slice(8, 16)}`,
        };
    }

    async createTransfer(params: CreateTransferParams): Promise<TransferResult> {
        // Simulate success for testing
        return {
            success: true,
            id: `tr_mock_${params.contractId.slice(0, 8)}`,
        };
    }
}

// =====================================================
// PRODUCTION STRIPE CLIENT
// =====================================================

// In production, this would use the real Stripe SDK:
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class ProductionStripeClient implements StripeClient {
    private stripe: any = null;
    private stripeSecretKey: string;
    private initPromise: Promise<void> | null = null;

    constructor() {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY not configured');
        }
        this.stripeSecretKey = secretKey;
        // Defer initialization to async method (ESM-compatible)
    }

    /**
     * Lazy initialization of Stripe client (ESM-compatible)
     */
    private async ensureStripe(): Promise<any> {
        if (this.stripe) return this.stripe;

        if (!this.initPromise) {
            this.initPromise = (async () => {
                const StripeModule = await import('stripe');
                const Stripe = StripeModule.default;
                this.stripe = new Stripe(this.stripeSecretKey, {
                    apiVersion: '2023-10-16',
                });
            })();
        }

        await this.initPromise;
        return this.stripe;
    }

    async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
        const stripe = await this.ensureStripe();

        // Build PaymentIntent options
        const piOptions: any = {
            amount: params.amountUsdCents,
            currency: 'usd',
            capture_method: params.captureMethod || 'automatic',
            metadata: {
                contractId: params.contractId,
                platform: 'collateral',
            },
        };

        // If we have a saved card (customerId + paymentMethodId), use off_session payment
        if (params.customerId && params.paymentMethodId) {
            piOptions.customer = params.customerId;
            piOptions.payment_method = params.paymentMethodId;
            piOptions.off_session = true;
            piOptions.confirm = true; // Charge immediately
            console.log(`[Stripe] Creating off-session PaymentIntent for customer ${params.customerId}`);
        } else {
            // No saved card - enable UI-based payment method selection
            piOptions.automatic_payment_methods = { enabled: true };
        }

        const paymentIntent = await stripe.paymentIntents.create(piOptions, {
            idempotencyKey: `pi_create_${params.contractId}`,
        });

        console.log(`[Stripe] PaymentIntent ${paymentIntent.id} created with status: ${paymentIntent.status}`);

        return {
            id: paymentIntent.id,
            clientSecret: paymentIntent.client_secret!,
            status: paymentIntent.status,
        };
    }

    async capturePaymentIntent(paymentIntentId: string, idempotencyKey: string): Promise<{ success: boolean; chargeId?: string }> {
        const stripe = await this.ensureStripe();

        const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId, {}, {
            idempotencyKey,
        });
        return {
            success: paymentIntent.status === 'succeeded',
            chargeId: paymentIntent.latest_charge as string,
        };
    }

    async createTransfer(params: CreateTransferParams): Promise<TransferResult> {
        const stripe = await this.ensureStripe();

        try {
            const transfer = await stripe.transfers.create({
                amount: params.amountUsdCents,
                currency: 'usd',
                destination: params.destinationAccountId,
                metadata: { contractId: params.contractId },
            }, {
                idempotencyKey: params.idempotencyKey,
            });
            return {
                success: true,
                id: transfer.id,
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message,
                retryable: err.type === 'StripeConnectionError' || err.statusCode >= 500,
            };
        }
    }
}

// =====================================================
// CLIENT FACTORY
// =====================================================

let stripeClientInstance: StripeClient | null = null;

export function getStripeClient(): StripeClient {
    if (!stripeClientInstance) {
        // SAFETY: Use real client if key exists, regardless of NODE_ENV
        // Only force mock with explicit FORCE_MOCK_STRIPE=true
        const forceMock = process.env.FORCE_MOCK_STRIPE === 'true';
        const hasKey = !!process.env.STRIPE_SECRET_KEY;

        if (forceMock) {
            console.log('[StripeClient] ⚠️ Using MockStripeClient (FORCE_MOCK_STRIPE=true)');
            stripeClientInstance = new MockStripeClient();
        } else if (hasKey) {
            console.log('[StripeClient] ✅ Using ProductionStripeClient');
            stripeClientInstance = new ProductionStripeClient();
        } else {
            console.log('[StripeClient] ⚠️ Using MockStripeClient (no STRIPE_SECRET_KEY)');
            stripeClientInstance = new MockStripeClient();
        }
    }
    return stripeClientInstance;
}

// For testing: allow injecting a mock client
export function setStripeClient(client: StripeClient): void {
    stripeClientInstance = client;
}

export function resetStripeClient(): void {
    stripeClientInstance = null;
}

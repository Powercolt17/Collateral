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
    // private stripe: Stripe;

    constructor() {
        // this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    }

    async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
        // Production implementation:
        // const paymentIntent = await this.stripe.paymentIntents.create({
        //     amount: params.amountUsdCents,
        //     currency: 'usd',
        //     capture_method: params.captureMethod || 'automatic',
        //     metadata: { contractId: params.contractId },
        // }, {
        //     idempotencyKey: `pi_${params.contractId}`,
        // });
        // return {
        //     id: paymentIntent.id,
        //     clientSecret: paymentIntent.client_secret!,
        //     status: paymentIntent.status,
        // };

        throw new Error('Production Stripe not configured. Set STRIPE_SECRET_KEY.');
    }

    async capturePaymentIntent(paymentIntentId: string, idempotencyKey: string): Promise<{ success: boolean; chargeId?: string }> {
        // Production implementation:
        // const paymentIntent = await this.stripe.paymentIntents.capture(paymentIntentId, {}, {
        //     idempotencyKey,
        // });
        // return {
        //     success: paymentIntent.status === 'succeeded',
        //     chargeId: paymentIntent.latest_charge as string,
        // };

        throw new Error('Production Stripe not configured. Set STRIPE_SECRET_KEY.');
    }

    async createTransfer(params: CreateTransferParams): Promise<TransferResult> {
        // Production implementation:
        // try {
        //     const transfer = await this.stripe.transfers.create({
        //         amount: params.amountUsdCents,
        //         currency: 'usd',
        //         destination: params.destinationAccountId,
        //         metadata: { contractId: params.contractId },
        //     }, {
        //         idempotencyKey: params.idempotencyKey,
        //     });
        //     return {
        //         success: true,
        //         id: transfer.id,
        //     };
        // } catch (err: any) {
        //     return {
        //         success: false,
        //         error: err.message,
        //         retryable: err.type === 'StripeConnectionError' || err.statusCode >= 500,
        //     };
        // }

        throw new Error('Production Stripe not configured. Set STRIPE_SECRET_KEY.');
    }
}

// =====================================================
// CLIENT FACTORY
// =====================================================

let stripeClientInstance: StripeClient | null = null;

export function getStripeClient(): StripeClient {
    if (!stripeClientInstance) {
        // Use mock in development/test, production client when STRIPE_SECRET_KEY is set
        const isProduction = process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production';
        stripeClientInstance = isProduction ? new ProductionStripeClient() : new MockStripeClient();
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

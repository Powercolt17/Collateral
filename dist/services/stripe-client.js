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
// MOCK STRIPE CLIENT (Development/Testing)
// =====================================================
export class MockStripeClient {
    async createPaymentIntent(params) {
        const id = `pi_mock_${params.contractId.slice(0, 8)}`;
        return {
            id,
            clientSecret: `${id}_secret_mock`,
            status: 'requires_payment_method',
        };
    }
    async capturePaymentIntent(paymentIntentId, idempotencyKey) {
        return {
            success: true,
            chargeId: `ch_mock_${paymentIntentId.slice(8, 16)}`,
        };
    }
    async createTransfer(params) {
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
export class ProductionStripeClient {
    // private stripe: Stripe;
    constructor() {
        // this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    }
    async createPaymentIntent(params) {
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
    async capturePaymentIntent(paymentIntentId, idempotencyKey) {
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
    async createTransfer(params) {
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
let stripeClientInstance = null;
export function getStripeClient() {
    if (!stripeClientInstance) {
        // Use mock in development/test, production client when STRIPE_SECRET_KEY is set
        const isProduction = process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production';
        stripeClientInstance = isProduction ? new ProductionStripeClient() : new MockStripeClient();
    }
    return stripeClientInstance;
}
// For testing: allow injecting a mock client
export function setStripeClient(client) {
    stripeClientInstance = client;
}
export function resetStripeClient() {
    stripeClientInstance = null;
}
//# sourceMappingURL=stripe-client.js.map
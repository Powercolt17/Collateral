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
    stripe; // Using 'any' to avoid direct import issues
    constructor() {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY not configured');
        }
        // Dynamic import of Stripe to avoid bundling issues
        // In production, you'd use: import Stripe from 'stripe';
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Stripe = require('stripe').default || require('stripe');
        this.stripe = new Stripe(secretKey, {
            apiVersion: '2023-10-16',
        });
    }
    async createPaymentIntent(params) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: params.amountUsdCents,
            currency: 'usd',
            capture_method: params.captureMethod || 'automatic',
            // Enable all payment methods configured in Stripe Dashboard
            automatic_payment_methods: { enabled: true },
            metadata: {
                contractId: params.contractId,
                platform: 'collateral',
            },
        }, {
            idempotencyKey: `pi_create_${params.contractId}`,
        });
        return {
            id: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            status: paymentIntent.status,
        };
    }
    async capturePaymentIntent(paymentIntentId, idempotencyKey) {
        const paymentIntent = await this.stripe.paymentIntents.capture(paymentIntentId, {}, {
            idempotencyKey,
        });
        return {
            success: paymentIntent.status === 'succeeded',
            chargeId: paymentIntent.latest_charge,
        };
    }
    async createTransfer(params) {
        try {
            const transfer = await this.stripe.transfers.create({
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
        }
        catch (err) {
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
let stripeClientInstance = null;
export function getStripeClient() {
    if (!stripeClientInstance) {
        // SAFETY: Use real client if key exists, regardless of NODE_ENV
        // Only force mock with explicit FORCE_MOCK_STRIPE=true
        const forceMock = process.env.FORCE_MOCK_STRIPE === 'true';
        const hasKey = !!process.env.STRIPE_SECRET_KEY;
        if (forceMock) {
            console.log('[StripeClient] ⚠️ Using MockStripeClient (FORCE_MOCK_STRIPE=true)');
            stripeClientInstance = new MockStripeClient();
        }
        else if (hasKey) {
            console.log('[StripeClient] ✅ Using ProductionStripeClient');
            stripeClientInstance = new ProductionStripeClient();
        }
        else {
            console.log('[StripeClient] ⚠️ Using MockStripeClient (no STRIPE_SECRET_KEY)');
            stripeClientInstance = new MockStripeClient();
        }
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
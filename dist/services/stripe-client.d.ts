/**
 * Stripe Client Abstraction
 *
 * Provides a testable interface for Stripe operations.
 * Production: Uses real Stripe SDK
 * Tests: Uses mock implementation
 *
 * All calls include idempotency keys to prevent duplicate operations.
 */
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
    capturePaymentIntent(paymentIntentId: string, idempotencyKey: string): Promise<{
        success: boolean;
        chargeId?: string;
    }>;
    createTransfer(params: CreateTransferParams): Promise<TransferResult>;
}
export declare class MockStripeClient implements StripeClient {
    createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult>;
    capturePaymentIntent(paymentIntentId: string, idempotencyKey: string): Promise<{
        success: boolean;
        chargeId?: string;
    }>;
    createTransfer(params: CreateTransferParams): Promise<TransferResult>;
}
export declare class ProductionStripeClient implements StripeClient {
    constructor();
    createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult>;
    capturePaymentIntent(paymentIntentId: string, idempotencyKey: string): Promise<{
        success: boolean;
        chargeId?: string;
    }>;
    createTransfer(params: CreateTransferParams): Promise<TransferResult>;
}
export declare function getStripeClient(): StripeClient;
export declare function setStripeClient(client: StripeClient): void;
export declare function resetStripeClient(): void;

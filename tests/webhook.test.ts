/**
 * Webhook Signature Verification Tests
 */

import { describe, it, expect } from 'vitest';
import { createHmac } from 'crypto';

function verifyStripeSignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    const parts = signature.split(',');
    let timestamp = '';
    let sig = '';

    for (const part of parts) {
        const [key, value] = part.split('=');
        if (key === 't') timestamp = value;
        if (key === 'v1') sig = value;
    }

    if (!timestamp || !sig) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSig = createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex');

    return sig === expectedSig;
}

describe('Webhook Signature Verification', () => {
    const secret = 'whsec_test_secret';
    const payload = JSON.stringify({ type: 'payment_intent.succeeded', data: {} });
    const timestamp = '1234567890';

    it('should verify valid signature', () => {
        const signedPayload = `${timestamp}.${payload}`;
        const validSig = createHmac('sha256', secret)
            .update(signedPayload)
            .digest('hex');

        const signature = `t=${timestamp},v1=${validSig}`;

        expect(verifyStripeSignature(payload, signature, secret)).toBe(true);
    });

    it('should reject invalid signature', () => {
        const signature = `t=${timestamp},v1=invalidsignature`;

        expect(verifyStripeSignature(payload, signature, secret)).toBe(false);
    });

    it('should reject missing timestamp', () => {
        const signature = 'v1=somesignature';

        expect(verifyStripeSignature(payload, signature, secret)).toBe(false);
    });

    it('should reject missing signature', () => {
        const signature = `t=${timestamp}`;

        expect(verifyStripeSignature(payload, signature, secret)).toBe(false);
    });

    it('should reject wrong secret', () => {
        const signedPayload = `${timestamp}.${payload}`;
        const validSig = createHmac('sha256', secret)
            .update(signedPayload)
            .digest('hex');

        const signature = `t=${timestamp},v1=${validSig}`;

        expect(verifyStripeSignature(payload, signature, 'wrong_secret')).toBe(false);
    });

    it('should reject tampered payload', () => {
        const signedPayload = `${timestamp}.${payload}`;
        const validSig = createHmac('sha256', secret)
            .update(signedPayload)
            .digest('hex');

        const signature = `t=${timestamp},v1=${validSig}`;
        const tamperedPayload = JSON.stringify({ type: 'hacked', data: {} });

        expect(verifyStripeSignature(tamperedPayload, signature, secret)).toBe(false);
    });
});

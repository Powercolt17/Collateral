/**
 * Stripe Platform Adapter
 * 
 * Handles revenue metrics via Stripe Connect
 * In production: use Stripe API with Connect account
 */

import type { Contract, User, ConnectedAccount } from '../db/schema.js';
import type { SimplePlatformAdapter } from './x.js';

export const stripeAdapter: SimplePlatformAdapter = {
    platform: 'STRIPE',

    async connect(user: User): Promise<ConnectedAccount> {
        // In production: Stripe Connect OAuth flow
        throw new Error('Stripe Connect not implemented. Use connected_accounts table directly.');
    },

    async snapshotBaseline(contract: Contract) {
        // In production: fetch from Stripe API
        // For now, return mock data
        const mockRevenue = Math.floor(Math.random() * 1000000) + 10000; // $100-$10,100 in cents

        return {
            snapshotAt: new Date().toISOString(),
            metrics: {
                revenue: mockRevenue,
            },
            evidence: {},
        };
    },

    async evaluate(contract: Contract) {
        const condition = contract.conditionJson as {
            operator: string;
            threshold: number;
        };
        const baseline = contract.baselineJson as { revenue?: number } | null;

        // Mock: simulate revenue growth (varies more than social metrics)
        const growthFactor = 1 + (Math.random() * 1.0 - 0.2); // -20% to +80%
        const baseValue = baseline?.revenue || 50000;
        const observedValue = Math.floor(baseValue * growthFactor);

        const pass = evaluateCondition(observedValue, condition.operator, condition.threshold);

        return {
            pass,
            observedValue,
            threshold: condition.threshold,
            operator: condition.operator,
            evidence: {
                snapshotAt: new Date().toISOString(),
                metrics: {
                    revenue: observedValue,
                },
                source: 'stripe_api_mock',
            },
        };
    },
};

function evaluateCondition(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
        case 'GTE': return value >= threshold;
        case 'GT': return value > threshold;
        case 'LTE': return value <= threshold;
        case 'LT': return value < threshold;
        case 'EQ': return value === threshold;
        default: return false;
    }
}

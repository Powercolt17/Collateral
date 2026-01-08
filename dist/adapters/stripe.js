/**
 * Stripe Platform Adapter
 *
 * Handles revenue metrics via Stripe Connect
 * In production: use Stripe API with Connect account
 */
export const stripeAdapter = {
    platform: 'STRIPE',
    async connect(user) {
        // In production: Stripe Connect OAuth flow
        throw new Error('Stripe Connect not implemented. Use connected_accounts table directly.');
    },
    async snapshotBaseline(contract) {
        // In production: fetch from Stripe API
        // For now, return mock data
        const mockRevenue = Math.floor(Math.random() * 1000000) + 10000; // $100-$10,100 in cents
        return {
            snapshotAt: new Date().toISOString(),
            metrics: {
                revenue: mockRevenue,
            },
        };
    },
    async evaluate(contract) {
        const condition = contract.conditionJson;
        const baseline = contract.baselineJson;
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
function evaluateCondition(value, operator, threshold) {
    switch (operator) {
        case 'GTE': return value >= threshold;
        case 'GT': return value > threshold;
        case 'LTE': return value <= threshold;
        case 'LT': return value < threshold;
        case 'EQ': return value === threshold;
        default: return false;
    }
}
//# sourceMappingURL=stripe.js.map
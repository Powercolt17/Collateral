/**
 * Oracle Adapter Interface
 *
 * ARCHITECTURE REQUIREMENT: All platforms must implement this interface.
 *
 * Core invariants enforced:
 * 1. Baseline snapshot at contract creation
 * 2. Scaled target calculation (relative to baseline)
 * 3. Binary evaluation at deadline (pass/fail only)
 * 4. Evidence payload (verifiable, immutable)
 * 5. Strict verification (no rounding, no discretion)
 *
 * No platform-specific hacks in core logic.
 * All evaluation results append immutable ledger events.
 */
// =====================================================
// ADAPTER REGISTRY
// =====================================================
const adapterRegistry = new Map();
export function registerOracleAdapter(adapter) {
    if (adapterRegistry.has(adapter.platform)) {
        throw new Error(`Adapter already registered for platform: ${adapter.platform}`);
    }
    adapterRegistry.set(adapter.platform, adapter);
}
export function getOracleAdapter(platform) {
    return adapterRegistry.get(platform);
}
export function getAllOracleAdapters() {
    return Array.from(adapterRegistry.values());
}
export function isAdapterRegistered(platform) {
    return adapterRegistry.has(platform);
}
// =====================================================
// EVALUATION HELPERS
// =====================================================
/**
 * Standard comparison function - no rounding, no discretion
 */
export function evaluateCondition(observed, operator, threshold) {
    switch (operator) {
        case 'GTE': return observed >= threshold;
        case 'GT': return observed > threshold;
        case 'LTE': return observed <= threshold;
        case 'LT': return observed < threshold;
        case 'EQ': return observed === threshold;
        default:
            throw new Error(`Unknown operator: ${operator}`);
    }
}
/**
 * Compute evidence hash for integrity verification
 */
export function computeEvidenceHash(evidence) {
    const { createHash } = require('crypto');
    const payload = JSON.stringify(evidence, Object.keys(evidence).sort());
    return createHash('sha256').update(payload).digest('hex');
}
//# sourceMappingURL=base.js.map
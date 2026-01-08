/**
 * Invariants Module
 * 
 * Central, unbypassable enforcement of system invariants.
 * All write operations MUST use these guards.
 * 
 * INVARIANTS ENFORCED:
 * I1) principalUserId only from auth middleware (never from client payload)
 * I2) External side effects are idempotent (via runIdempotent)
 * I3) Single-writer contract drivers (via withContractLock)
 * I4) Fail-closed on adapter uncertainty (via classifyAdapterError)
 */

// Re-export all invariant helpers
export * from './auth-guards.js';
export * from './idempotency.js';
export * from './contract-locks.js';
export * from './adapter-errors.js';

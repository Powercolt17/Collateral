# Invariants Module

Central, unbypassable enforcement of system invariants for the Collateral backend.

## Usage

### I1: Principal Enforcement

```typescript
import { registerWriteRouteGuards, getPrincipal } from './invariants/index.js';

// In your write routes plugin:
const myWriteRoutes: FastifyPluginAsync = async (fastify) => {
    // Register global guards (runs on ALL POST/PUT/PATCH/DELETE)
    registerWriteRouteGuards(fastify);

    fastify.post('/my-endpoint', async (request) => {
        // Auth is already enforced (401 if no token)
        // userId in body is already rejected (400)
        const principalUserId = getPrincipal(request);
        // ... use principalUserId
    });
};
```

### I2: Idempotency

```typescript
import { runIdempotent, IdempotencyScope } from './invariants/index.js';

// Stripe webhook
const result = await runIdempotent(
    { scope: IdempotencyScope.STRIPE_WEBHOOK, key: stripeEventId },
    async () => {
        // Process webhook - runs exactly once
        return await handleWebhook(event);
    }
);

if (result.status === 'cached') {
    // Already processed
}
```

### I3: Contract Locks

```typescript
import { withContractLock } from './invariants/index.js';

// CRITICAL: When using withContractLock, pass tx to settle/verify.
// These functions accept tx and default to db for non-locked read-only use.

// In verification/settlement job:
await withContractLock(contractId, async (tx) => {
    // Only one caller can be here at a time for this contract
    // tx is the transaction client - ALL writes must use it
    await settleContract(contractId, tx);  // Pass tx!
});

// In reconciliation:
await withContractLock(contractId, async (tx) => {
    await verifyContract(contractId, tx);  // Pass tx!
});
```

### I4: Adapter Errors

```typescript
import { runWithFailClosed, classifyAdapterError } from './invariants/index.js';

// In adapter call:
const result = await runWithFailClosed(
    contractId,
    'VERIFY',
    attempt,
    async () => {
        return await callExternalAPI();
    }
);

if (!result.success && result.retryScheduled) {
    // Adapter failed, retry scheduled at result.nextRetryAt
    // No terminal event emitted (fail closed)
}
```

## Key Principles

| Invariant | Principle | Enforcement |
|-----------|-----------|-------------|
| I1 | principalUserId from auth only | Global preHandler hook |
| I2 | External effects idempotent | DB-backed idempotency_keys |
| I3 | Single-writer per contract | Postgres advisory locks |
| I4 | Fail closed on uncertainty | Error classifier + retry scheduler |

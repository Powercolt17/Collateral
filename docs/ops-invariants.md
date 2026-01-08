# Ops Invariants

> Backend correctness guarantees for job execution.

---

## 1. Atomic Lock Requirement

### Problem
Read-then-write patterns are race-prone. Two workers can both read "no lock exists" and both acquire.

### Solution
DB-enforced atomicity via `job_locks` table:

```sql
CREATE TABLE job_locks (
    id UUID PRIMARY KEY,
    contract_id UUID REFERENCES contracts(id),
    job_type VARCHAR(20),         -- 'VERIFY' | 'SETTLE'
    lock_id UUID,
    acquired_at_utc TIMESTAMPTZ,
    expires_at_utc TIMESTAMPTZ,
    UNIQUE(contract_id, job_type)  -- Enforces single lock
);
```

### Acquisition Pattern
```
1. DELETE expired locks (expires_at_utc < now)
2. INSERT ... ON CONFLICT DO NOTHING
3. If INSERT returns row: lock acquired
4. If INSERT returns nothing: lock held by another worker
```

### Guarantees
- **Single writer:** Only one VERIFY or SETTLE job runs per contract at a time
- **No race conditions:** DB constraint enforces atomicity
- **Auto-expiry:** 5 minute TTL prevents stuck locks

---

## 2. Retryable vs Terminal Philosophy

### Core Principle
> Fail-closed: Unknown errors are RETRYABLE, not terminal.

### Non-Retryable (CONFIG) — True Permanents ONLY
| Pattern | Example |
|---------|---------|
| Missing connected account | "No connected Stripe account" |
| Unsupported platform | "Platform not supported" |
| Unsupported metric | "Metric not supported" |
| Invalid condition | "Invalid condition specification" |
| Principal not found | "Principal user not found" |
| Contract not found | "Contract not found" |

### Retryable — Everything Else
| Category | Patterns |
|----------|----------|
| RATE_LIMIT | 429, "rate limited", "too many requests" |
| SERVER_ERROR | 500, 502, 503, 504, "service unavailable" |
| NETWORK | ECONNREFUSED, ECONNRESET, "fetch failed" |
| TIMEOUT | "timed out", "aborted" |
| UNKNOWN | Anything not matching above (fail-closed) |

### Why Fail-Closed?
- User funds are at stake
- It's better to defer payout than deny it incorrectly
- Transient failures are common (rate limits, network issues)
- Retry scheduling handles recovery automatically

---

## 3. Idempotency Guarantees

### Stripe Transfer Idempotency
```typescript
idempotencyKey = `tr_${contractId}_${settlementStartedEvent.id}`
```

| Component | Source | Guarantee |
|-----------|--------|-----------|
| `contractId` | Contract record | Immutable |
| `settlementStartedEvent.id` | First SETTLEMENT_STARTED event | Created once, reused on retry |

### Invariants
1. **SETTLEMENT_STARTED appended BEFORE Stripe call**
2. **Same event ID used on retry** (not a new event)
3. **Stripe dedupes by idempotencyKey** (safe to retry)

### Terminal Events
| Event | Finality |
|-------|----------|
| VERIFICATION_SUCCEEDED | Terminal — never re-verify |
| VERIFICATION_FAILED | Terminal — never re-verify |
| SETTLED_SUCCESS | Terminal — never re-settle |
| SETTLED_FAILURE | Terminal — never re-settle |

### Retry Loop Protection
```
1. Check terminal event exists → return cached result
2. Check retry scheduled in future → skip
3. Acquire lock → skip if locked
4. Execute job
```

---

## Summary

| Invariant | Enforcement |
|-----------|-------------|
| Single writer | DB UNIQUE constraint on job_locks |
| No duplicate payouts | Stripe idempotencyKey from immutable values |
| Fail-closed on unknowns | Error classification defaults to retryable |
| Retry scheduling | Exponential backoff via RETRY_SCHEDULED events |
| Terminal finality | Skip if SUCCEEDED/FAILED event exists |

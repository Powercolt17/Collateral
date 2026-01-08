# Operational Readiness Checklist

> V1 Launch Wiring - Complete system for staging and production.

---

## 1. Settlement Flow

| Step | Event | Terminal |
|------|-------|----------|
| Start | `SETTLEMENT_STARTED` | No |
| Success | `SETTLED_SUCCESS` | ✅ |
| Failure | `SETTLED_FAILURE` | ✅ |
| Always | `RECEIPT_ISSUED` | ✅ |

**Invariant:** Every verified contract ends in exactly one terminal settlement event and one receipt.

---

## 2. Kill Switches

Located: `src/services/kill-switches.ts`

| Switch | Effect | Tested |
|--------|--------|--------|
| `contractCreationEnabled` | Block new contract creation | ✅ |
| `executionEnabled` | Block execution/activation | ✅ |
| `settlementEnabled` | Block settlement processing | ✅ |
| `verificationEnabled` | Block verification jobs | ✅ |

**Emergency:** `disableAllOperations()` kills everything.  
**Read-only:** Ledger reads and receipt queries remain available.

---

## 3. Scheduler

Located: `src/services/scheduler.ts`

### Jobs
| Job | Interval | Kill Switch |
|-----|----------|-------------|
| `runVerificationJob` | 1 min | `verificationEnabled` |
| `runSettlementJob` | 1 min | `settlementEnabled` |
| `runReconciliationJob` | 1 min | auto |

### Structured Log Format
```json
{
  "timestamp": "ISO",
  "jobType": "VERIFICATION|SETTLEMENT|RECONCILIATION",
  "processed": 10,
  "succeeded": 8,
  "failed": 1,
  "skipped": 1,
  "durationMs": 234,
  "skipReasons": { "locked": 0, "retryScheduled": 1, "terminal": 0 }
}
```

---

## 4. Observability

Located: `src/services/observability.ts`

### State Gauges (Key Metrics)
| Gauge | Description | Threshold |
|-------|-------------|-----------|
| `verifyingCount` | Contracts in VERIFYING | **< 50** |
| `settlingCount` | Contracts in SETTLING | **< 20** |
| `payoutPendingCount` | Waiting for Connect | **< 10** |
| `retryScheduledCount` | Scheduled for retry | **< 30** |

### Reading Metrics
```typescript
import { getMetrics, getStateGauges } from './services/observability.js';

// Full metrics
const metrics = getMetrics();

// State gauges only
const gauges = getStateGauges();
console.log(gauges.verifyingCount);  // Contracts stuck in VERIFYING
console.log(gauges.payoutPendingCount);  // Users missing Connect
```

### Trouble Thresholds
| Condition | Action |
|-----------|--------|
| `verifyingCount > 50` | Check API connectivity |
| `settlingCount > 20` | Check Stripe API |
| `payoutPendingCount > 10` | Notify users to add payout rail |
| `retryScheduledCount > 30` | Check error classification |

---

## 5. Idempotency

| Operation | Dedupe Key |
|-----------|------------|
| `FUNDS_AUTHORIZED` | `payment_intent_id` |
| `FUNDS_LOCKED` | `payment_intent_id` |
| `SETTLED_SUCCESS` | `transfer_id` |
| `RECEIPT_ISSUED` | Event exists check |

---

## 6. E2E Flow

```
create → authorize → lock → verify → settle → receipt
```

**PAYOUT_DEFERRED:** When Connect account missing, reconciliation recovers after account added.

---

## 7. Pre-Launch Checklist

### Kill Switch Drills
- [x] Each switch blocks ONLY its target (13 tests)
- [x] Read-only remains available
- [x] disableAllOperations blocks all writes

### E2E Stripe Flow
- [x] Full lifecycle test (12 tests)
- [x] Idempotency tests (no duplicate events)
- [x] PAYOUT_DEFERRED recovery test

### Scheduler
- [x] Scheduler entrypoint created
- [x] Structured metrics logs
- [x] Skip reason tracking

### Observability
- [x] State gauges implemented
- [x] Threshold documentation added

---

## 8. OpenTelemetry Instrumentation

### Bootstrap
```typescript
// Import telemetry.ts FIRST before any other imports
import './telemetry.js';
```

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `OTEL_SDK_DISABLED` | `false` | Disable OTel SDK |
| `OTEL_SERVICE_NAME` | `collateral-backend` | Service name |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `http://localhost:4318` | OTLP endpoint |

### Key Metrics
| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `contracts_created_total` | Counter | platform, riskTier | Track creation volume |
| `verification_terminal_total` | Counter | platform, outcome, category | Terminal outcomes |
| `settlement_terminal_total` | Counter | outcome, category | Settlement outcomes |
| `retry_backlog` | Gauge | jobType | Pending retries |
| `settlement_backlog` | Gauge | - | Verified awaiting settlement |
| `payout_pending_backlog` | Gauge | - | Users missing Connect |

---

## 9. Alert Playbook (Grafana/Prometheus)

> Implement these alerts in your observability backend.

### Reliability Alerts
| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| HighRetryBacklog | `retry_backlog > 30` for 5m | Warning | Check API errors |
| SettlementBacklogRising | `rate(settlement_backlog[15m]) > 0` | Warning | Check Stripe API |
| PayoutPendingHigh | `payout_pending_backlog > 10` | Info | Notify users |

### Abuse Detection Alerts
| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| GitHubResourceMissing | `rate(resource_missing_total{platform="GITHUB"}[1h]) > 5` | Warning | Revoked tokens |
| StripeBufferExclusions | `rate(stripe_excluded_outside_buffer_total[1h]) > 10` | Warning | Last-minute stuffing |
| GitHubFloorFarming | `rate(github_success_at_floor_total[1h]) > 5` | Info | Potential farming |
| UnlinkedDeductions | `rate(stripe_unlinked_deductions_total[1h]) > 5` | Info | Deduction anomaly |

### Config Error Alerts
| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| SettlementConfigError | `settlement_terminal_total{category="CONFIG"} > 0` | Critical | Fix config |
| RepoEligibilitySpike | `rate(github_repo_eligibility_reject_total[1h]) > 20` | Warning | Check rules |

### Example Prometheus Rules
```yaml
groups:
  - name: collateral_alerts
    rules:
      - alert: HighRetryBacklog
        expr: retry_backlog > 30
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High retry backlog ({{ $value }})"
          
      - alert: GitHubResourceMissing
        expr: rate(resource_missing_total{platform="GITHUB"}[1h]) > 5
        labels:
          severity: warning
        annotations:
          summary: "GitHub resource missing spike"
```

---

## 10. Pre-Launch Checklist

### Completed
- [x] Escalation monotonicity verified
- [x] Receipt chain hashes added
- [x] Job indexing table created
- [x] OTel telemetry bootstrap
- [x] Metrics module (counters/histograms/gauges)
- [x] Tracing utilities
- [x] Structured logging with trace correlation

### Pending
- [ ] Kill switches tested in staging
- [ ] Settlement flow tested end-to-end
- [ ] OTel OTLP endpoint configured
- [ ] Alerts imported to Grafana/Prometheus


# Anti-Abuse Invariants

> Policy reference for Collateral backend + Aura UI enforcement.

---

## 1. Non-Negotiable Anti-Abuse Invariants

| # | Invariant | Rule | Surface |
|---|-----------|------|---------|
| 1 | **Connected Account Required** | User must have verified connected account for payout platform before Execute. | Both |
| 2 | **Activation Timestamp Start** | Verification window starts at EXECUTION_CONFIRMED; nothing before counts. | Backend |
| 3 | **Immutable Baseline Snapshot** | Baseline metrics (defaultBranch, userId, repo, accountId) are snapshotted at creation and never recalculated. | Backend |
| 4 | **Objective Filters Only** | Qualified-event filters use objective criteria (timestamps, IDs, merge status)—no subjective scoring. | Backend |
| 5 | **Fail-Closed on Transient Errors** | Rate limits, 5xx, timeouts, or partial data block payout until verification succeeds. No silent pass. | Backend |
| 6 | **Single-Writer Job Locks** | Only one VERIFY or SETTLE job runs per contract at a time via ledger-based lock. | Backend |
| 7 | **Idempotency via Terminal Events** | Once VERIFICATION_SUCCEEDED/FAILED or SETTLED_SUCCESS/FAILURE is appended, outcome is final. | Backend |
| 8 | **No Self-Minting Constraints** | Cheap-to-create metrics (empty PRs, dummy commits, throwaway repos) are filtered or ineligible. | Both |
| 9 | **Minimum Difficulty Floors** | Every metric type has minimum threshold (e.g., revenue ≥ $100, PRs ≥ 3, impressions ≥ 10k). | Both |
| 10 | **Time Compression** | Short verification windows (7–30 days) make gaming require sustained real work. | UI |
| 11 | **Anti-Sybil Throttles** | Per-user caps, cooldowns between contracts, escalating minimum lock amounts. | Both |
| 12 | **Receipt-Style Transparency** | Evidence ledger shows exactly what counted and why—visible to user post-verification. | Both |

---

## 2. Platform Hardening

### A) GitHub PRs Merged

**Current Hard Filters (enforced)**
- PR `merged_at` within `[EXECUTION_CONFIRMED, deadline]` window
- PR merged into `defaultBranch` (snapshotted at creation)
- PR author `user.id` matches principal's numeric GitHub ID (immutable binding)

**Repo Eligibility (snapshotted at creation)**
| Constraint | Rule |
|------------|------|
| Repo Age | Repo `created_at` ≥ 30 days before contract creation |
| Prior History | Repo `pushed_at` before contract creation OR commit count floor (≥ 10 prior commits) |

**PR Eligibility (optional, to enable later)**
| Constraint | Rule |
|------------|------|
| Review Threshold | ≥1 approved review on PR |
| Issue Link | PR references an issue |
| File Changes | `changed_files ≥ N` or `additions + deletions ≥ M` |

> We do NOT judge code quality. Only objective, verifiable filters + difficulty floors.

---

### B) Stripe Revenue

**Inherently Strong**  
Revenue is verified from Stripe canonical objects (BalanceTransaction / Charge). Hard to fake.

**Policy Constraints**
| Constraint | Rule |
|------------|------|
| Object Types | Count only `charge`, `payment`, `payment_refund` (net) |
| Single Currency | Contract must specify currency; conversions disallowed |
| Connected Account | `stripeConnectedAccountId` required at Execute |
| Fail-Closed | Incomplete or missing data = verification deferred, not passed |

---

### C) X (Twitter)

**Public API is Too Abusable**  
Impression/engagement counts can be gamed (bots, view farms).

**Policy**
| Constraint | Rule |
|------------|------|
| OAuth Binding | `userId` locked via OAuth at contract creation (not username) |
| Low-Stakes Only | Until OAuth: X contracts are preview-only or low-stakes (minimum payout caps) |
| Public API Restriction | Public-only X contracts ineligible for STANDARD tier payouts |

---

## 3. Tier Gating Rules

> "Easy-to-farm metrics never appear in STANDARD."

| Tier | Eligible Metrics | Additional Constraints |
|------|------------------|------------------------|
| **STANDARD** | Stripe revenue only | High-trust, verified identity |
| **ADVANCED** | GitHub PRs (with eligibility) | Repo eligibility + PR floors + ≤30 day windows |
| **ELITE** | GitHub + Stripe + future platforms | Strictest thresholds + shortest windows + highest locks |

---

## 4. UI Copy Block: "Anti-Gaming Rules"

> Shown before Execute button.

```
Before you Execute:

• Your identity is locked at execution—no switching accounts.
• Nothing counts before execution—only activity after counts.
• Only qualified events count—filtered by objective rules.
• Verification is automatic—you cannot influence the outcome.
• If data is unavailable, payout is denied until verification succeeds.
```

---

## Backlog

| Item | Priority | Surface |
|------|----------|---------|
| Repo eligibility validation at contract creation | High | Backend |
| Minimum threshold enforcement per metric type | High | Backend + UI |
| Per-user contract caps and cooldowns | Medium | Backend |
| X OAuth identity binding | Medium | Backend |
| PR eligibility constraints (reviews, file changes) | Low | Backend |
| Anti-Gaming Rules UI component | High | Aura UI |
| Evidence viewer post-verification | Medium | Aura UI |

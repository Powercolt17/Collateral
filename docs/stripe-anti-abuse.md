# Stripe Anti-Abuse Policy

> V1 Stripe hardening: Objective, automatic, appeal-free filters.

---

## Why Stripe Contracts Are Not "Free Money"

Stripe revenue contracts enforce **Net Settled Revenue** with multiple objective filters:

| Invariant | Defense |
|-----------|---------|
| **Net Revenue** | charges - refunds - disputes |
| **Charge-Only** | No transfers, payouts, topups |
| **Single-Currency** | USD only |
| **Refund Buffer** | Charges must be 5d before deadline |

---

## A) Net Settled Revenue (MANDATORY)

**Formula:**
```
observedRevenue = sum(charge.amount) - sum(refund.amount) - sum(dispute.amount)
```

**Rules:**
- Refunds reduce revenue
- Disputes reduce revenue
- No "gross revenue" counting
- Negative revenue is valid

**Effect:**
- Refund cycling fails
- Disputes punish abuse
- Revenue must be real and durable

---

## B) Charge-Only Revenue (MANDATORY)

**Counted:**
- `charge` (includes payment_intents that succeed)

> **Note:** `payment` is NOT a Stripe balance_transaction type. Payment Intents result in `charge` transactions.

**Excluded:**
- `transfer`
- `payout`
- `topup`
- `credit`
- `adjustment`
- `application_fee_refund`
- Any non-charge balance movement

**Effect:**
- Prevents internal Stripe shuffling
- Prevents balance manipulation
- Prevents self-minting via transfers

---

## Deduction Linkage (A.1)

**Rule:** Refunds and disputes are only counted if linked to a **counted charge** via `source` field.

```
refund.source == countedCharge.id → count deduction
refund.source != any countedCharge.id → ignore (unlinkedDeductions++)
```

**Effect:**
- Prevents crediting refunds for old/external charges
- Only deducts from revenue actually counted
- Evidence includes `unlinkedDeductions` count

**Rule:**
```
charge.currency == 'usd'
```

**Excluded:**
- Any charge in EUR, GBP, etc.

**Effect:**
- Prevents FX wash tricks
- Prevents rounding exploits
- Keeps accounting deterministic

---

## D) Refund Cooling Window (MANDATORY)

**Rule:**
```
charge.created <= (deadline - REFUND_BUFFER_DAYS)
```

**Constants:**
| Constant | Value |
|----------|-------|
| `STRIPE_REFUND_BUFFER_DAYS` | 5 days |

**Meaning:**
- Revenue must remain unrefunded past the buffer
- Charges created in the last 5 days before deadline are EXCLUDED
- Refund-after-verification invalidates the revenue

**Effect:**
- Kills refund-after-verification abuse
- Forces revenue to "stick"
- Preserves automatic verification

---

## Evidence Transparency

All Stripe verification evidence includes:

```json
{
  "grossCharges": 150000,
  "refunds": 20000,
  "disputes": 10000,
  "netRevenue": 120000,
  "excludedWrongCurrency": 2,
  "excludedWrongType": 1,
  "excludedOutsideBuffer": 1,
  "refundBufferDate": "2025-01-10T00:00:00Z"
}
```

---

## Failure Behavior

| Scenario | Result |
|----------|--------|
| Stripe API incomplete | Retry (fail-closed) |
| Rate limited (429) | Retry |
| Net revenue < threshold | VERIFICATION_FAILED |
| Refunds reduce below threshold | VERIFICATION_FAILED |

**Rules:**
- Never partially credit refunded revenue
- Never override results manually
- Automatic settlement preserved

---

## Explicit Non-Goals

**DO NOT implement:**
- Self-purchase detection
- Customer email/IP/name comparison
- SKU or product analysis
- Legitimacy judgement
- Heuristics or ML

**Why:**
- Fragile
- Biased
- High support cost
- Legally risky

> Collateral does not care *why* money moved — only whether it *stayed* moved.

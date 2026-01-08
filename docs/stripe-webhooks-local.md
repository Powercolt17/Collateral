# Stripe Webhooks - Local Development Setup

This guide covers setting up Stripe webhook forwarding for local development.

## Prerequisites

- Node.js 18+
- Stripe account with API keys
- Backend running on `localhost:3000`

---

## Environment Variables

Add to `backend/.env`:

```bash
# Stripe API
STRIPE_SECRET_KEY=sk_test_...

# Webhook secret (get from Stripe CLI - see below)
STRIPE_WEBHOOK_SECRET=whsec_...

# OR use test bypass for local dev without real Stripe events
STRIPE_WEBHOOK_SECRET=whsec_test
```

---

## Option 1: Stripe CLI Forwarding (Recommended)

### Install Stripe CLI

```bash
# Windows (Scoop)
scoop install stripe

# macOS (Homebrew)
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

### Login to Stripe

```bash
stripe login
```

### Start Webhook Forwarding

```bash
stripe listen --forward-to localhost:3000/v1/stripe/webhook
```

The CLI will output a webhook signing secret:
```
Ready! Your webhook signing secret is whsec_abc123...
```

**Copy this secret** and add it to your `.env`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

Then restart the backend.

### Trigger Test Events

```bash
# Trigger a payment_intent.succeeded event
stripe trigger payment_intent.succeeded
```

---

## Option 2: Manual Webhook Simulation

For testing without Stripe CLI, use `whsec_test` mode:

```bash
# In .env
STRIPE_WEBHOOK_SECRET=whsec_test
```

Then POST directly:

```powershell
# PowerShell
curl -X POST http://localhost:3000/v1/stripe/webhook `
  -H "Content-Type: application/json" `
  -d '{
    "id": "evt_test_123",
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_test_123",
        "metadata": {
          "contractId": "YOUR_CONTRACT_ID"
        }
      }
    }
  }'
```

---

## Expected Flow

```
UI: Click "Fund Contract"
  → Backend: POST /v1/contracts/:id/funding-intent
  → Backend: Creates PaymentIntent with contractId in metadata
  → Backend: Stores PI id in FUNDS_AUTHORIZED event externalRef
  → Backend: Appends FUNDS_AUTHORIZED event
  → UI: Shows "Awaiting payment confirmation"

Stripe: Payment succeeds
  → Stripe: Sends payment_intent.succeeded webhook
  → Backend: Receives webhook at /v1/stripe/webhook
  → Backend: Verifies signature (or bypasses if whsec_test)
  → Backend: Gets contractId (metadata OR fallback ledger lookup)
  → Backend: Calls handlePaymentSuccess()
  → Backend: Appends FUNDS_LOCKED event (idempotent)
  → UI: Polling sees FUNDS_LOCKED state
  → UI: Shows "Execute" button
```

### ContractId Resolution (Bulletproof)

The webhook handler uses two resolution methods:
1. **Primary**: `metadata.contractId` from PaymentIntent
2. **Fallback**: Lookup via `externalRef` in FUNDS_AUTHORIZED ledger event

This ensures webhooks work even if Stripe metadata is missing.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `Invalid signature` | Wrong secret or body modified | Use fresh CLI secret |
| `Raw body: MISSING` | Plugin not registered | Check `fastify-raw-body` in index.ts |
| `No contractId in metadata` | Wrong PaymentIntent | Use correct PI id from funding-intent response |
| 500 error | Backend crash | Check terminal logs |
| UI stuck on FUNDS_AUTHORIZED | Webhook not received | Check Stripe CLI output |

---

## Backend Logs (Expected)

```
📥 [Stripe Webhook] Incoming request
   Signature: present
   Raw body: 1234 bytes
   ✅ Signature verified
[Webhook evt_123] [payment_intent.succeeded] 🔄 Processing for contract abc123 (PI: pi_xyz)
[Webhook evt_123] [payment_intent.succeeded] ✅ Payment processed successfully
```

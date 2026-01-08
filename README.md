# Collateral Backend

USD-first self-betting platform with append-only ledger.

## Database

This project uses **Neon Postgres** (serverless Postgres). No local Postgres required.

### Environment Variables

```env
# Neon connection strings (same host, different databases)
DATABASE_URL=postgresql://<user>:<pass>@<neon-host>/collateral?sslmode=require
DATABASE_URL_TEST=postgresql://<user>:<pass>@<neon-host>/collateral_test?sslmode=require

NODE_ENV=development
```

> **CRITICAL**: `DATABASE_URL` and `DATABASE_URL_TEST` MUST point to DIFFERENT databases.
> Tests will fail-closed if isolation is broken.

## Setup

### 1. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Neon connection strings
```

### 2. Run Migrations
```bash
npm run db:generate  # Generates migration meta (first time only)
npm run db:migrate   # Applies migrations (loads .env automatically)
npm run db:seed      # (Optional) Seeds dev data
```

### 3. Run Tests
```bash
npm test
# Automatically sets NODE_ENV=test via cross-env
# Uses tests/setup.ts to:
# - Verify NODE_ENV=test (hard fail otherwise)
# - Connect to DATABASE_URL_TEST (hard fail if missing)
# - Run migrations against test DB
# - Truncate tables between tests
```

## Test Database Isolation

Tests enforce **strict isolation**:

| Check | Behavior |
|-------|----------|
| `NODE_ENV !== 'test'` | ❌ Hard fail |
| `DATABASE_URL_TEST` missing | ❌ Hard fail |
| `DATABASE_URL_TEST === DATABASE_URL` | ❌ Hard fail |
| Test truncates production tables | ❌ Impossible (different DB) |

No fallbacks. No convenience shortcuts. Fail-closed.

## X (Twitter) API Integration

### Required Environment Variables
```env
X_API_BEARER_TOKEN=AAAA...
X_CLIENT_ID=your_client_id
X_CLIENT_SECRET=your_client_secret
X_REDIRECT_URI=https://api.collateral.market/auth/x/callback
```

### API Access Levels

| Metric | Access Required | Status |
|--------|-----------------|--------|
| FOLLOWERS | App Bearer Token | ✅ Supported |
| IMPRESSIONS | - | ❌ Not implemented |

- Only **FOLLOWERS** metric is supported for X platform.
- The adapter **never silently falls back to mock** in production.

## Troubleshooting

### `CRITICAL SAFETY ERROR`
- **Cause**: `DATABASE_URL` matches `DATABASE_URL_TEST`.
- **Fix**: Ensure they point to DIFFERENT databases in Neon.

### `CRITICAL: Missing DATABASE_URL_TEST`
- **Cause**: Environment variable not set.
- **Fix**: Add `DATABASE_URL_TEST` to your `.env` file.

### `CRITICAL: Tests must run with NODE_ENV=test`
- **Cause**: Running tests without `NODE_ENV=test`.
- **Fix**: Vitest sets this automatically. If running manually, set `NODE_ENV=test`.

### `meta/_journal.json` missing
- **Cause**: Drizzle kit hasn't generated metadata.
- **Fix**: Run `npm run db:generate`.

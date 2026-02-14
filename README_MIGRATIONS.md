
# Production Migrations (Railway)

We use a self-healing migration strategy for production. The application automatically applies pending migrations on startup before serving traffic.

## How it works

1.  **Build Phase**: `tsc` compiles `src/db/migrate-prod.ts` to `dist/db/migrate-prod.js`.
2.  **Start Command**: `npm run start:migrate` is executed.
    *   First, it runs `node dist/db/migrate-prod.js`.
    *   This script connects to `DATABASE_URL` and applies migrations from `src/db/migrations`.
    *   If migrations fail, the process exits with `1`, preventing a broken deploy.
    *   If successful, it runs `node dist/index.js` to start the server.

## Manual Fixes (Emergency)

If you need to run migrations manually in the Railway Shell:

```bash
# Option 1: Using the compiled runner (Recommended)
node dist/db/migrate-prod.js

# Option 2: Using tsx (If src is available and dev dependencies are present)
npm run db:migrate
```

## Verify Migrations

To check if the `market_contract_instances` table exists:

```sql
SELECT to_regclass('public.market_contract_instances');
```

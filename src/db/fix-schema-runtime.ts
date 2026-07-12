
import { sql } from 'drizzle-orm';
import { db } from './client.js';

export async function fixSchemaDrift() {
    console.log('[schema-fix] 🛠️ Starting Runtime Schema Fix (Force Apply)...');

    try {
        // 1. Ensure Enum 'contract_tier' exists
        await db.execute(sql`
            DO $$ BEGIN
                CREATE TYPE "public"."contract_tier" AS ENUM('controlled', 'elevated', 'maximum');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        console.log('[schema-fix] ✅ Enum contract_tier ensure.');

        // 2. Fix 'market_contract_instances' - Add Smart Tier columns
        // We use individual ALTER statements wrapped in blocks to prevent "current transaction is aborted" errors
        // if one fails in a batch.

        const mciCols = [
            `ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "tier" "public"."contract_tier" DEFAULT 'controlled' NOT NULL`,
            `ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "multiplier" numeric(3, 1) DEFAULT 1.5 NOT NULL`,
            `ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "metric_key" varchar(50) DEFAULT 'generic' NOT NULL`,
            `ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "target_policy_json" jsonb DEFAULT '{}'::jsonb NOT NULL`,
            `ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "display_target_hint" varchar(100)`
        ];

        for (const colSql of mciCols) {
            try {
                await db.execute(sql.raw(colSql));
            } catch (e: any) {
                // Ignore "column already exists" or "table does not exist" type errors gently
                if (e.code === '42701') { // duplicate_column
                    continue;
                }
                console.log(`[schema-fix] ⚠️ MCI Column fix skipped: ${e.message}`);
            }
        }
        console.log('[schema-fix] ✅ MCI columns ensured.');

        // 3. Fix 'contracts' - Add 'market_instance_id'
        try {
            await db.execute(sql`ALTER TABLE "contracts" ADD COLUMN IF NOT EXISTS "market_instance_id" uuid`);
            await db.execute(sql`CREATE INDEX IF NOT EXISTS "contracts_market_instance_idx" ON "contracts" ("market_instance_id")`);
        } catch (e: any) {
            console.log(`[schema-fix] ⚠️ Contracts fix skipped: ${e.message}`);
        }
        console.log('[schema-fix] ✅ Contracts columns ensured.');

        // 4. Fix 'market_stats_cache' - Ensure 'instance_id' canonical name
        try {
            await db.execute(sql`
                DO $$ 
                BEGIN
                    -- Rename bad column from previous bad migrations if exists
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='market_stats_cache' AND column_name='market_contract_instance_id') THEN
                        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='market_stats_cache' AND column_name='instance_id') THEN
                            ALTER TABLE "market_stats_cache" RENAME COLUMN "market_contract_instance_id" TO "instance_id";
                        END IF;
                    END IF;
                END $$;
             `);
        } catch (e: any) {
            console.log(`[schema-fix] ⚠️ Stats fix skipped: ${e.message}`);
        }
        console.log('[schema-fix] ✅ Stats columns ensured.');

        // 5. Ensure password reset columns exist on users table
        try {
            await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token" TEXT`);
            await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token_expires_at" TIMESTAMPTZ`);
            await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_users_reset_token" ON "users"("reset_token") WHERE "reset_token" IS NOT NULL`);
            console.log('[schema-fix] ✅ Password reset columns ensured.');
        } catch (e: any) {
            console.log(`[schema-fix] ⚠️ Password reset columns skipped: ${e.message}`);
        }

        // 6. Update market instance tier pricing to current ranges
        try {
            await db.execute(sql`
                UPDATE market_contract_instances SET min_lock_cents = 10000, max_lock_cents = 150000 WHERE tier = 'controlled' AND (min_lock_cents != 10000 OR max_lock_cents != 150000);
                UPDATE market_contract_instances SET min_lock_cents = 25000, max_lock_cents = 300000 WHERE tier = 'elevated' AND (min_lock_cents != 25000 OR max_lock_cents != 300000);
                UPDATE market_contract_instances SET min_lock_cents = 50000, max_lock_cents = 500000 WHERE tier = 'maximum' AND (min_lock_cents != 50000 OR max_lock_cents != 500000);
            `);
            console.log('[schema-fix] ✅ Tier pricing updated (Controlled $100-$1.5K, Elevated $250-$3K, Maximum $500-$5K).');
        } catch (e: any) {
            console.log(`[schema-fix] ⚠️ Tier pricing update skipped: ${e.message}`);
        }

        // 7. Drip email tracking column on users
        try {
            await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "drip_stage_sent" integer DEFAULT 0`);
            console.log('[schema-fix] ✅ Drip email tracking column ensured.');
        } catch (e: any) {
            console.log(`[schema-fix] ⚠️ Drip column skipped: ${e.message}`);
        }

        // 8. Ensure 'cltr_blockchain_events' table exists
        try {
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS "cltr_blockchain_events" (
                    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                    "event_type" varchar(50) NOT NULL,
                    "tx_hash" varchar(255) NOT NULL,
                    "block_number" bigint NOT NULL,
                    "block_timestamp" timestamp with time zone NOT NULL,
                    "sender" varchar(255) NOT NULL,
                    "amount" numeric(36, 18) NOT NULL,
                    "metadata_json" jsonb,
                    "created_at" timestamp with time zone DEFAULT now() NOT NULL
                );
                CREATE UNIQUE INDEX IF NOT EXISTS "idx_cltr_blockchain_events_tx_hash" ON "cltr_blockchain_events" ("tx_hash");
                CREATE INDEX IF NOT EXISTS "idx_cltr_blockchain_events_type" ON "cltr_blockchain_events" ("event_type");
                CREATE INDEX IF NOT EXISTS "idx_cltr_blockchain_events_sender" ON "cltr_blockchain_events" ("sender");
            `);
            console.log('[schema-fix] ✅ cltr_blockchain_events table ensured.');
        } catch (e: any) {
            console.log(`[schema-fix] ⚠️ cltr_blockchain_events table skipped: ${e.message}`);
        }

        // 9. Ensure 'user_wallets' table exists
        try {
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS "user_wallets" (
                    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
                    "wallet_address" varchar(255) NOT NULL,
                    "chain_id" integer NOT NULL,
                    "is_primary" boolean DEFAULT false NOT NULL,
                    "verified_at" timestamp with time zone DEFAULT now() NOT NULL,
                    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
                    "last_connected_at" timestamp with time zone DEFAULT now() NOT NULL
                );
                CREATE UNIQUE INDEX IF NOT EXISTS "idx_user_wallets_address_chain" ON "user_wallets" (lower("wallet_address"), "chain_id");
                CREATE INDEX IF NOT EXISTS "idx_user_wallets_user_id" ON "user_wallets" ("user_id");
            `);
            console.log('[schema-fix] ✅ user_wallets table ensured.');
        } catch (e: any) {
            console.log(`[schema-fix] ⚠️ user_wallets table skipped: ${e.message}`);
        }

        // 10. Ensure 'wallet_nonces' table exists
        try {
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS "wallet_nonces" (
                    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                    "nonce" varchar(255) NOT NULL,
                    "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
                    "expires_at" timestamp with time zone NOT NULL,
                    "consumed" boolean DEFAULT false NOT NULL,
                    "created_at" timestamp with time zone DEFAULT now() NOT NULL
                );
                CREATE UNIQUE INDEX IF NOT EXISTS "idx_wallet_nonces_nonce" ON "wallet_nonces" ("nonce");
            `);
            console.log('[schema-fix] ✅ wallet_nonces table ensured.');
        } catch (e: any) {
            console.log(`[schema-fix] ⚠️ wallet_nonces table skipped: ${e.message}`);
        }

        console.log('[schema-fix] ✅ Runtime Schema Fix Complete.');
    } catch (err) {
        console.error('[schema-fix] ❌ Failed to run runtime schema fix:', err);
        // We do NOT throw, we try to let the app boot.
    }
}

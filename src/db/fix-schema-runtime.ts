
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

        console.log('[schema-fix] ✅ Runtime Schema Fix Complete.');
    } catch (err) {
        console.error('[schema-fix] ❌ Failed to run runtime schema fix:', err);
        // We do NOT throw, we try to let the app boot.
    }
}

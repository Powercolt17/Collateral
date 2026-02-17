-- Migration: Fix Schema Drift V2 (Consolidated Fix)
-- Description: Idempotently adds missing columns for Smart Tiers and Market Linkage.
-- Handles cases where 0026 and 0027 failed or were skipped.

-- 1. Ensure Enum 'contract_tier' exists
DO $$ BEGIN
    CREATE TYPE "public"."contract_tier" AS ENUM('controlled', 'elevated', 'maximum');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Fix 'market_contract_instances' - Add Smart Tier columns if missing
DO $$ 
BEGIN
    ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "tier" "public"."contract_tier" DEFAULT 'controlled' NOT NULL;
    ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "multiplier" numeric(3, 1) DEFAULT 1.5 NOT NULL;
    ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "metric_key" varchar(50) DEFAULT 'generic' NOT NULL;
    ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "target_policy_json" jsonb DEFAULT '{}'::jsonb NOT NULL;
    ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "display_target_hint" varchar(100);
EXCEPTION
    WHEN undefined_table THEN 
        -- If table doesn't exist, we assume 0022/0024/0025 handles it, but let's not crash here.
        null;
END $$;

-- 3. Fix 'contracts' - Add 'market_instance_id' if missing
DO $$ 
BEGIN
    ALTER TABLE "contracts" ADD COLUMN IF NOT EXISTS "market_instance_id" uuid;
    CREATE INDEX IF NOT EXISTS "contracts_market_instance_idx" ON "contracts" ("market_instance_id");
EXCEPTION
    WHEN duplicate_object THEN null; -- Index exists
    WHEN undefined_table THEN null;
END $$;

-- 4. Fix 'market_stats_cache' - Ensure 'instance_id' is correct
DO $$ 
BEGIN
    -- Rename bad column from previous bad migrations if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='market_stats_cache' AND column_name='market_contract_instance_id') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='market_stats_cache' AND column_name='instance_id') THEN
            ALTER TABLE "market_stats_cache" RENAME COLUMN "market_contract_instance_id" TO "instance_id";
        END IF;
    END IF;
EXCEPTION
    WHEN undefined_table THEN null;
END $$;

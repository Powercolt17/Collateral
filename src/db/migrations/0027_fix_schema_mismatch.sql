-- Migration: Fix Schema Mismatch for Market Columns
-- Description: Ensures market_instance_id exists on contracts and instance_id exists on market_stats_cache

-- 1. Contracts Table: Ensure market_instance_id exists
DO $$ 
BEGIN
    ALTER TABLE "contracts" ADD COLUMN IF NOT EXISTS "market_instance_id" uuid;
    CREATE INDEX IF NOT EXISTS "contracts_market_instance_idx" ON "contracts" ("market_instance_id");
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN undefined_column THEN null;
END $$;

-- 2. Market Stats Cache: Ensure instance_id is the primary key column
-- If the table was created with "market_contract_instance_id" (old migration assumption), correct it.
-- We can't easily rename if it's a PK, but we can check if instance_id exists.

-- Note: We are sticking to 'instance_id' as canonical.
DO $$ 
BEGIN
    -- If market_contract_instance_id exists and instance_id does NOT, rename it.
    -- This handles the case where a previous bad migration might have named it long.
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='market_stats_cache' AND column_name='market_contract_instance_id') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='market_stats_cache' AND column_name='instance_id') THEN
            ALTER TABLE "market_stats_cache" RENAME COLUMN "market_contract_instance_id" TO "instance_id";
        END IF;
    END IF;
END $$;

-- Custom migration for Smart Tiers
DO $$ BEGIN
    CREATE TYPE "public"."contract_tier" AS ENUM('controlled', 'elevated', 'maximum');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "tier" "public"."contract_tier" DEFAULT 'controlled' NOT NULL;
ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "multiplier" numeric(3, 1) DEFAULT 1.5 NOT NULL;
ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "metric_key" varchar(50) DEFAULT 'generic' NOT NULL;
ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "target_policy_json" jsonb DEFAULT '{}'::jsonb NOT NULL;
ALTER TABLE "market_contract_instances" ADD COLUMN IF NOT EXISTS "display_target_hint" varchar(100);

-- Migration: Add market_instance_id to contracts
ALTER TABLE "contracts" ADD COLUMN "market_instance_id" uuid;
CREATE INDEX IF NOT EXISTS "contracts_market_instance_idx" ON "contracts" ("market_instance_id");

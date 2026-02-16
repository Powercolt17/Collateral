-- Migration: RESTORE Market Tables (V2 - Force Apply)
-- Explicitly creates contract_templates and market_contract_instances if missing.

-- 1. Ensure Enum Exists
DO $$ BEGIN
    CREATE TYPE "market_instance_status" AS ENUM ('published', 'closing', 'expired', 'paused');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create contract_templates (referenced by instances)
CREATE TABLE IF NOT EXISTS "contract_templates" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "slug" varchar(100) NOT NULL UNIQUE,
    "title" varchar(255) NOT NULL,
    "description" text NOT NULL,
    "category" varchar(50) NOT NULL,
    "provider" "platform" NOT NULL,
    "rules_json" jsonb NOT NULL,
    "tier_options_json" jsonb NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "contract_templates_category_idx" ON "contract_templates" ("category");

-- 3. Create market_contract_instances
CREATE TABLE IF NOT EXISTS "market_contract_instances" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "template_id" uuid NOT NULL REFERENCES "contract_templates" ("id"),
    "status" "market_instance_status" DEFAULT 'published' NOT NULL,
    "publish_at" timestamp with time zone DEFAULT now() NOT NULL,
    "funding_close_at" timestamp with time zone NOT NULL,
    "execution_close_at" timestamp with time zone,
    "capacity_total" integer,
    "capacity_remaining" integer,
    "min_lock_cents" integer,
    "max_lock_cents" integer,
    "terms_version" integer DEFAULT 1 NOT NULL,
    "instance_terms_json" jsonb,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "market_instances_template_idx" ON "market_contract_instances" ("template_id");
CREATE INDEX IF NOT EXISTS "market_instances_status_idx" ON "market_contract_instances" ("status");
CREATE INDEX IF NOT EXISTS "market_instances_publish_idx" ON "market_contract_instances" ("publish_at");
CREATE INDEX IF NOT EXISTS "market_instances_closing_idx" ON "market_contract_instances" ("funding_close_at");

-- 4. Create market_stats_cache
CREATE TABLE IF NOT EXISTS "market_stats_cache" (
    "instance_id" uuid PRIMARY KEY REFERENCES "market_contract_instances" ("id"),
    "executions_1h" integer DEFAULT 0 NOT NULL,
    "executions_24h" integer DEFAULT 0 NOT NULL,
    "capital_locked_1h_cents" integer DEFAULT 0 NOT NULL,
    "capital_locked_24h_cents" integer DEFAULT 0 NOT NULL,
    "capital_locked_total_cents" integer DEFAULT 0 NOT NULL,
    "last_execution_at" timestamp with time zone,
    "fail_rate_rolling" integer DEFAULT 0,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "market_stats_trending_1h_idx" ON "market_stats_cache" ("executions_1h");
CREATE INDEX IF NOT EXISTS "market_stats_trending_24h_idx" ON "market_stats_cache" ("executions_24h");
CREATE INDEX IF NOT EXISTS "market_stats_volume_24h_idx" ON "market_stats_cache" ("capital_locked_24h_cents");

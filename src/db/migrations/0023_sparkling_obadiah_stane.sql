CREATE TYPE "public"."account_ledger_event_type" AS ENUM('FUNDS_ADDED', 'CAPITAL_LOCKED', 'CAPITAL_UNLOCKED', 'SETTLEMENT_WIN', 'SETTLEMENT_LOSS', 'PAYOUT_QUEUED', 'PAYOUT_SENT', 'PAYOUT_FAILED', 'DISPUTE_OPENED', 'DISPUTE_RESOLVED');--> statement-breakpoint
CREATE TYPE "public"."connect_onboarding_status" AS ENUM('not_configured', 'pending', 'connected', 'restricted', 'error');--> statement-breakpoint
CREATE TYPE "public"."funding_source_status" AS ENUM('unconfigured', 'pending_verification', 'verified', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."market_instance_status" AS ENUM('published', 'closing', 'expired', 'paused');--> statement-breakpoint
CREATE TYPE "public"."sales_metric" AS ENUM('net_settled_amount', 'closed_won_count');--> statement-breakpoint
CREATE TYPE "public"."sales_provider" AS ENUM('stripe');--> statement-breakpoint
CREATE TYPE "public"."sales_verification_status" AS ENUM('queued', 'running', 'ok', 'error');--> statement-breakpoint
ALTER TYPE "public"."identity_provider" ADD VALUE 'amazon';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'PAYMENT_DISPUTED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'SETTLED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'SALES_BASELINE_SNAPSHOTTED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'SALES_TERMS_ATTACHED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'SALES_VERIFICATION_QUEUED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'SALES_VERIFICATION_COMPUTED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_BASELINE_CAPTURED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_TARGET_LOCKED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_VERIFIED_SUCCESS';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_VERIFIED_FAIL';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_PROVIDER_CONNECTED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_PROVIDER_DISCONNECTED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_PROVIDER_VALIDATED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_ELIGIBILITY_CHECKED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_ELIGIBILITY_FAILED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_VERIFICATION_RETRY';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_VERIFICATION_UNVERIFIABLE';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_JOB_LOCK_ACQUIRED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_JOB_LOCK_CONTENTION';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'COMMERCE_JOB_LOCK_RELEASED';--> statement-breakpoint
ALTER TYPE "public"."platform" ADD VALUE 'AMAZON' BEFORE 'SUBSTACK';--> statement-breakpoint
CREATE TABLE "account_ledger_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"contract_id" uuid,
	"event_type" varchar(50) NOT NULL,
	"amount_cents" integer NOT NULL,
	"idempotency_key" varchar(255) NOT NULL,
	"metadata" jsonb,
	"origin_event_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "account_ledger_events_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "connect_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_connect_account_id" varchar(255) NOT NULL,
	"account_type" varchar(20) DEFAULT 'express' NOT NULL,
	"onboarding_status" varchar(30) DEFAULT 'pending' NOT NULL,
	"payouts_enabled" boolean DEFAULT false,
	"charges_enabled" boolean DEFAULT false,
	"details_submitted" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "connect_accounts_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "contract_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"provider" "platform" NOT NULL,
	"rules_json" jsonb NOT NULL,
	"tier_options_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "contract_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "funding_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_customer_id" varchar(255) NOT NULL,
	"stripe_payment_method_id" varchar(255),
	"stripe_setup_intent_id" varchar(255),
	"brand" varchar(20),
	"last4" varchar(4),
	"exp_month" integer,
	"exp_year" integer,
	"status" "funding_source_status" DEFAULT 'unconfigured' NOT NULL,
	"available_balance_usd_cents" integer DEFAULT 0 NOT NULL,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market_contract_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "market_stats_cache" (
	"instance_id" uuid PRIMARY KEY NOT NULL,
	"executions_1h" integer DEFAULT 0 NOT NULL,
	"executions_24h" integer DEFAULT 0 NOT NULL,
	"capital_locked_1h_cents" integer DEFAULT 0 NOT NULL,
	"capital_locked_24h_cents" integer DEFAULT 0 NOT NULL,
	"capital_locked_total_cents" integer DEFAULT 0 NOT NULL,
	"last_execution_at" timestamp with time zone,
	"fail_rate_rolling" integer DEFAULT 0,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_baseline_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" "sales_provider" DEFAULT 'stripe' NOT NULL,
	"window_days" integer DEFAULT 30 NOT NULL,
	"window_start_at" timestamp with time zone NOT NULL,
	"window_end_at" timestamp with time zone NOT NULL,
	"baseline_json" jsonb NOT NULL,
	"data_hash" varchar(64),
	"last_order_id" varchar(255),
	"api_version" varchar(20),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sales_baseline_snapshots_user_id_window_start_at_window_end_at_unique" UNIQUE("user_id","window_start_at","window_end_at")
);
--> statement-breakpoint
CREATE TABLE "sales_contract_terms" (
	"contract_id" uuid PRIMARY KEY NOT NULL,
	"provider" "sales_provider" DEFAULT 'stripe' NOT NULL,
	"metric" "sales_metric" NOT NULL,
	"window_days" integer NOT NULL,
	"baseline_snapshot_id" uuid NOT NULL,
	"baseline_value_cents" integer NOT NULL,
	"target_delta_cents" integer NOT NULL,
	"target_total_cents" integer NOT NULL,
	"qualified_rules_json" jsonb,
	"executed_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_verification_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"provider" "sales_provider" NOT NULL,
	"status" "sales_verification_status" DEFAULT 'queued' NOT NULL,
	"attempt" integer DEFAULT 1 NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"result_json" jsonb,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_job_locks" (
	"idempotency_key" varchar(255) PRIMARY KEY NOT NULL,
	"contract_id" uuid NOT NULL,
	"job_type" varchar(50) NOT NULL,
	"provider" varchar(20) NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"window_end" timestamp with time zone NOT NULL,
	"locked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"locked_by" varchar(255) NOT NULL,
	"attempt_count" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "connected_accounts" ADD COLUMN "provider_shop_id" varchar(255);--> statement-breakpoint
ALTER TABLE "connected_accounts" ADD COLUMN "provider_currency" varchar(10);--> statement-breakpoint
ALTER TABLE "connected_accounts" ADD COLUMN "provider_timezone" varchar(64);--> statement-breakpoint
ALTER TABLE "connected_accounts" ADD COLUMN "scopes_hash" varchar(64);--> statement-breakpoint
ALTER TABLE "connected_accounts" ADD COLUMN "scopes_granted" jsonb;--> statement-breakpoint
ALTER TABLE "connected_accounts" ADD COLUMN "last_validated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "connected_accounts" ADD COLUMN "validation_error_code" varchar(50);--> statement-breakpoint
ALTER TABLE "contracts" ADD COLUMN "market_instance_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "x_user_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "x_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "x_connected_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "x_access_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "x_access_token_secret" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "x_account_created_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "account_ledger_events" ADD CONSTRAINT "account_ledger_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_ledger_events" ADD CONSTRAINT "account_ledger_events_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connect_accounts" ADD CONSTRAINT "connect_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funding_sources" ADD CONSTRAINT "funding_sources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_contract_instances" ADD CONSTRAINT "market_contract_instances_template_id_contract_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."contract_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_stats_cache" ADD CONSTRAINT "market_stats_cache_instance_id_market_contract_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."market_contract_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_baseline_snapshots" ADD CONSTRAINT "sales_baseline_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_contract_terms" ADD CONSTRAINT "sales_contract_terms_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_contract_terms" ADD CONSTRAINT "sales_contract_terms_baseline_snapshot_id_sales_baseline_snapshots_id_fk" FOREIGN KEY ("baseline_snapshot_id") REFERENCES "public"."sales_baseline_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_verification_runs" ADD CONSTRAINT "sales_verification_runs_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_ledger_user_idx" ON "account_ledger_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_ledger_contract_idx" ON "account_ledger_events" USING btree ("contract_id");--> statement-breakpoint
CREATE UNIQUE INDEX "account_ledger_idempotency_idx" ON "account_ledger_events" USING btree ("idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_payout_origin_once" ON "account_ledger_events" USING btree ("origin_event_id") WHERE event_type IN ('PAYOUT_SENT', 'PAYOUT_FAILED');--> statement-breakpoint
CREATE UNIQUE INDEX "connect_accounts_user_idx" ON "connect_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "connect_accounts_stripe_idx" ON "connect_accounts" USING btree ("stripe_connect_account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "contract_templates_slug_idx" ON "contract_templates" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "contract_templates_category_idx" ON "contract_templates" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_funding_sources_user_id" ON "funding_sources" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_funding_sources_stripe_customer" ON "funding_sources" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "idx_funding_sources_setup_intent" ON "funding_sources" USING btree ("stripe_setup_intent_id");--> statement-breakpoint
CREATE INDEX "market_instances_template_idx" ON "market_contract_instances" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "market_instances_status_idx" ON "market_contract_instances" USING btree ("status");--> statement-breakpoint
CREATE INDEX "market_instances_publish_idx" ON "market_contract_instances" USING btree ("publish_at");--> statement-breakpoint
CREATE INDEX "market_instances_closing_idx" ON "market_contract_instances" USING btree ("funding_close_at");--> statement-breakpoint
CREATE INDEX "market_stats_trending_1h_idx" ON "market_stats_cache" USING btree ("executions_1h");--> statement-breakpoint
CREATE INDEX "market_stats_trending_24h_idx" ON "market_stats_cache" USING btree ("executions_24h");--> statement-breakpoint
CREATE INDEX "market_stats_volume_24h_idx" ON "market_stats_cache" USING btree ("capital_locked_24h_cents");--> statement-breakpoint
CREATE INDEX "idx_sales_baseline_snapshots_user_id" ON "sales_baseline_snapshots" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_sales_verification_runs_contract_id" ON "sales_verification_runs" USING btree ("contract_id");--> statement-breakpoint
CREATE INDEX "idx_sales_verification_runs_status" ON "sales_verification_runs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_sales_verification_runs_contract_created" ON "sales_verification_runs" USING btree ("contract_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_users_x_user_id" ON "users" USING btree ("x_user_id");
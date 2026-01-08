CREATE TYPE "public"."connected_account_status" AS ENUM('ACTIVE', 'REVOKED');--> statement-breakpoint
CREATE TYPE "public"."funding_method" AS ENUM('USD_CARD', 'USD_ACH', 'CRYPTO');--> statement-breakpoint
CREATE TYPE "public"."identity_provider" AS ENUM('stripe', 'github', 'x', 'google', 'youtube', 'tiktok', 'shopify');--> statement-breakpoint
CREATE TYPE "public"."identity_status" AS ENUM('ACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."ledger_actor" AS ENUM('SYSTEM', 'USER');--> statement-breakpoint
CREATE TYPE "public"."ledger_event_type" AS ENUM('CONTRACT_CREATED', 'BASELINE_SNAPSHOTTED', 'FUNDS_AUTHORIZED', 'FUNDS_LOCKED', 'EXECUTION_REQUESTED', 'EXECUTION_CONFIRMED', 'VERIFICATION_STARTED', 'VERIFICATION_SUCCEEDED', 'VERIFICATION_FAILED', 'VERIFICATION_RESULT', 'CONTRACT_VERIFIED', 'SETTLEMENT_STARTED', 'SETTLED_SUCCESS', 'SETTLED_FAILURE', 'PAYOUT_DEFERRED', 'CONTRACT_SETTLED', 'CONTRACT_FORFEITED', 'RECEIPT_ISSUED', 'JOB_LOCK_ACQUIRED', 'RETRY_SCHEDULED', 'IDENTITY_BOUND', 'IDENTITY_REVOKED');--> statement-breakpoint
CREATE TYPE "public"."metric_type" AS ENUM('FOLLOWERS', 'IMPRESSIONS', 'ENGAGEMENT_RATE', 'VIEWS', 'SUBSCRIBERS', 'REVENUE', 'MRR', 'CHARGE_VOLUME', 'GROSS_SALES', 'ORDER_COUNT', 'COMMITS', 'PRS_MERGED', 'REPOS_CREATED', 'STARS_GAINED', 'DOWNLOADS', 'TASKS_COMPLETED', 'PROJECTS_SHIPPED');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('X', 'STRIPE', 'GITHUB', 'YOUTUBE', 'TIKTOK', 'SHOPIFY', 'SUBSTACK', 'APP_STORE', 'PLAY_STORE', 'NOTION', 'LINEAR');--> statement-breakpoint
CREATE TYPE "public"."risk_tier" AS ENUM('STANDARD', 'ADVANCED', 'ELITE');--> statement-breakpoint
CREATE TABLE "connected_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"platform" "platform" NOT NULL,
	"external_account_id" varchar(255) NOT NULL,
	"access_token_enc" text,
	"refresh_token_enc" text,
	"metadata_json" jsonb,
	"connected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "connected_account_status" DEFAULT 'ACTIVE' NOT NULL,
	"verification_status" text DEFAULT 'PENDING' NOT NULL,
	"challenge_code" text,
	"challenge_issued_at" timestamp with time zone,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "contract_index" (
	"contract_id" uuid PRIMARY KEY NOT NULL,
	"current_state" varchar(30) NOT NULL,
	"is_terminal" integer DEFAULT 0 NOT NULL,
	"last_failure_at_utc" timestamp with time zone,
	"deadline_utc" timestamp with time zone,
	"next_retry_due_utc" timestamp with time zone,
	"last_event_type" varchar(50),
	"last_event_at_utc" timestamp with time zone,
	"chain_head_hash" varchar(64)
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"principal_user_id" uuid NOT NULL,
	"principal_identity_username" varchar(20) NOT NULL,
	"platform" "platform" NOT NULL,
	"metric_type" "metric_type" NOT NULL,
	"condition_json" jsonb NOT NULL,
	"baseline_json" jsonb,
	"deadline_utc" timestamp with time zone NOT NULL,
	"lock_amount_usd_cents" integer NOT NULL,
	"payout_amount_usd_cents" integer NOT NULL,
	"funding_method" "funding_method" DEFAULT 'USD_CARD' NOT NULL,
	"risk_tier" "risk_tier" DEFAULT 'STANDARD' NOT NULL,
	"target_calculation_metadata_json" jsonb,
	"record_hash" varchar(64),
	"stripe_binding_id" uuid,
	"github_binding_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"username" varchar(20) NOT NULL,
	"display_name" varchar(50),
	"bio" varchar(120),
	"photo_url" text,
	"status" "identity_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity_bindings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" "identity_provider" NOT NULL,
	"provider_user_id" text NOT NULL,
	"provider_account_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_event_id" uuid,
	"revoked_at" timestamp with time zone,
	"revoked_by_event_id" uuid
);
--> statement-breakpoint
CREATE TABLE "job_locks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"job_type" varchar(20) NOT NULL,
	"lock_id" uuid NOT NULL,
	"acquired_at_utc" timestamp with time zone NOT NULL,
	"expires_at_utc" timestamp with time zone NOT NULL,
	CONSTRAINT "job_locks_contract_id_job_type_unique" UNIQUE("contract_id","job_type")
);
--> statement-breakpoint
CREATE TABLE "ledger_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"actor" "ledger_actor" NOT NULL,
	"event_type" "ledger_event_type" NOT NULL,
	"timestamp_utc" timestamp with time zone DEFAULT now() NOT NULL,
	"amount_usd_cents" integer,
	"external_ref" varchar(255),
	"metadata_json" jsonb,
	"prev_event_hash" varchar(64),
	"event_hash" varchar(64) NOT NULL,
	CONSTRAINT "ledger_events_contract_id_external_ref_unique" UNIQUE("contract_id","external_ref")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255),
	"passkey_id" varchar(255),
	"stripe_connected_account_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "connected_accounts" ADD CONSTRAINT "connected_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_index" ADD CONSTRAINT "contract_index_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_principal_user_id_users_id_fk" FOREIGN KEY ("principal_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identities" ADD CONSTRAINT "identities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_bindings" ADD CONSTRAINT "identity_bindings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_locks" ADD CONSTRAINT "job_locks_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_events" ADD CONSTRAINT "ledger_events_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "identities_username_idx" ON "identities" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_identity_bindings_user_id" ON "identity_bindings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_identity_bindings_provider" ON "identity_bindings" USING btree ("provider");
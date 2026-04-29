CREATE TYPE "public"."contract_tier" AS ENUM('controlled', 'elevated', 'maximum');--> statement-breakpoint
CREATE TYPE "public"."creator_conversion_event" AS ENUM('CLICKED', 'SIGNED_UP', 'FUNDED_CONTRACT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PAID');--> statement-breakpoint
CREATE TYPE "public"."creator_status" AS ENUM('DRAFT', 'READY', 'ACTIVE', 'PAUSED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."creator_tier" AS ENUM('A_LIST', 'STANDARD');--> statement-breakpoint
CREATE TYPE "public"."rivalry_role" AS ENUM('challenger', 'opponent');--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'ORACLE_SNAPSHOT_RECORDED';--> statement-breakpoint
ALTER TYPE "public"."ledger_event_type" ADD VALUE 'WEBHOOK_SNAPSHOT_RECORDED';--> statement-breakpoint
ALTER TYPE "public"."market_instance_status" ADD VALUE 'published' BEFORE 'published';--> statement-breakpoint
ALTER TYPE "public"."market_instance_status" ADD VALUE 'closing' BEFORE 'published';--> statement-breakpoint
ALTER TYPE "public"."market_instance_status" ADD VALUE 'expired' BEFORE 'published';--> statement-breakpoint
CREATE TABLE "contract_metric_current" (
	"contract_id" uuid PRIMARY KEY NOT NULL,
	"provider" text NOT NULL,
	"metric_key" text NOT NULL,
	"metric_value" numeric NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"progress_pct" numeric DEFAULT '0' NOT NULL,
	"next_check_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract_metric_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"metric_key" text NOT NULL,
	"metric_value" numeric NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"request_id" text,
	"raw_payload_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_conversions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"user_id" uuid,
	"contract_id" uuid,
	"event_type" "creator_conversion_event" NOT NULL,
	"stake_amount_cents" integer,
	"bonus_amount_cents" integer,
	"rejection_reason" text,
	"metadata_json" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	"paid_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "creator_referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"platform" varchar(50) DEFAULT 'X' NOT NULL,
	"handle" varchar(255) NOT NULL,
	"tier" "creator_tier" DEFAULT 'STANDARD' NOT NULL,
	"bonus_rate_cents" integer DEFAULT 1000 NOT NULL,
	"post_fee_cents" integer DEFAULT 0,
	"follower_count" integer,
	"score" integer,
	"status" "creator_status" DEFAULT 'DRAFT' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "creator_referrals_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" text,
	"link" varchar(255),
	"read" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_user_id" uuid NOT NULL,
	"referred_user_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"activated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "rivalries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenger_user_id" uuid NOT NULL,
	"opponent_user_id" uuid,
	"platform" "platform" NOT NULL,
	"metric_type" "metric_type" NOT NULL,
	"metric_key" varchar(50) NOT NULL,
	"stake_per_side_cents" integer NOT NULL,
	"duration_days" integer NOT NULL,
	"acceptance_ttl_hours" integer DEFAULT 72 NOT NULL,
	"funding_ttl_hours" integer DEFAULT 48 NOT NULL,
	"protocol_fee_bps" integer DEFAULT 1200 NOT NULL,
	"target_growth_pct" numeric DEFAULT '15' NOT NULL,
	"rivalry_tier" varchar(10) DEFAULT 'DUEL' NOT NULL,
	"challenge_issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"accepted_at" timestamp with time zone,
	"funded_at" timestamp with time zone,
	"activated_at" timestamp with time zone,
	"deadline_utc" timestamp with time zone,
	"settled_at" timestamp with time zone,
	"winner_user_id" uuid,
	"settlement_metadata" jsonb,
	"record_hash" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rivalry_ledger_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rivalry_id" uuid NOT NULL,
	"actor" "ledger_actor" NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"user_id" uuid,
	"timestamp_utc" timestamp with time zone DEFAULT now() NOT NULL,
	"amount_usd_cents" integer,
	"external_ref" varchar(255),
	"metadata_json" jsonb,
	"prev_event_hash" varchar(64),
	"event_hash" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rivalry_metric_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rivalry_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"metric_key" text NOT NULL,
	"metric_value" numeric NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"request_id" text,
	"raw_payload_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rivalry_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rivalry_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(10) NOT NULL,
	"funded" boolean DEFAULT false NOT NULL,
	"funded_at" timestamp with time zone,
	"lock_event_id" uuid,
	"baseline_value" numeric,
	"baseline_json" jsonb,
	"baseline_snapshot_at" timestamp with time zone,
	"baseline_hash" varchar(64),
	"final_value" numeric,
	"final_json" jsonb,
	"final_snapshot_at" timestamp with time zone,
	"absolute_delta" numeric,
	"percentage_delta" numeric,
	"outcome" varchar(10),
	"payout_cents" integer,
	"identity_binding_id" uuid,
	"connected_account_id" uuid,
	CONSTRAINT "rivalry_participants_rivalry_id_role_unique" UNIQUE("rivalry_id","role")
);
--> statement-breakpoint
ALTER TABLE "contracts" ADD COLUMN "social_bonus_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "contracts" ADD COLUMN "social_bonus_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "contracts" ADD COLUMN "social_bonus_tweet_id" text;--> statement-breakpoint
ALTER TABLE "market_contract_instances" ADD COLUMN "tier" "contract_tier" DEFAULT 'controlled' NOT NULL;--> statement-breakpoint
ALTER TABLE "market_contract_instances" ADD COLUMN "multiplier" varchar(10) DEFAULT '1.75' NOT NULL;--> statement-breakpoint
ALTER TABLE "market_contract_instances" ADD COLUMN "metric_key" varchar(50) DEFAULT 'generic' NOT NULL;--> statement-breakpoint
ALTER TABLE "market_contract_instances" ADD COLUMN "target_policy_json" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "market_contract_instances" ADD COLUMN "display_target_hint" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_user_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "referral_code" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "referred_by_user_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "referral_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "referral_boost_pct" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "referral_first_bonus_used" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "contract_metric_current" ADD CONSTRAINT "contract_metric_current_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_metric_snapshots" ADD CONSTRAINT "contract_metric_snapshots_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_conversions" ADD CONSTRAINT "creator_conversions_creator_id_creator_referrals_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creator_referrals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_conversions" ADD CONSTRAINT "creator_conversions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_conversions" ADD CONSTRAINT "creator_conversions_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_user_id_users_id_fk" FOREIGN KEY ("referrer_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_user_id_users_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rivalries" ADD CONSTRAINT "rivalries_challenger_user_id_users_id_fk" FOREIGN KEY ("challenger_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rivalries" ADD CONSTRAINT "rivalries_opponent_user_id_users_id_fk" FOREIGN KEY ("opponent_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rivalries" ADD CONSTRAINT "rivalries_winner_user_id_users_id_fk" FOREIGN KEY ("winner_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rivalry_ledger_events" ADD CONSTRAINT "rivalry_ledger_events_rivalry_id_rivalries_id_fk" FOREIGN KEY ("rivalry_id") REFERENCES "public"."rivalries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rivalry_ledger_events" ADD CONSTRAINT "rivalry_ledger_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rivalry_metric_snapshots" ADD CONSTRAINT "rivalry_metric_snapshots_rivalry_id_rivalries_id_fk" FOREIGN KEY ("rivalry_id") REFERENCES "public"."rivalries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rivalry_metric_snapshots" ADD CONSTRAINT "rivalry_metric_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rivalry_participants" ADD CONSTRAINT "rivalry_participants_rivalry_id_rivalries_id_fk" FOREIGN KEY ("rivalry_id") REFERENCES "public"."rivalries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rivalry_participants" ADD CONSTRAINT "rivalry_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_metric_snapshots_contract_fetched" ON "contract_metric_snapshots" USING btree ("contract_id","fetched_at");--> statement-breakpoint
CREATE INDEX "idx_metric_snapshots_contract_id" ON "contract_metric_snapshots" USING btree ("contract_id");--> statement-breakpoint
CREATE INDEX "idx_creator_conversions_creator" ON "creator_conversions" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "idx_creator_conversions_user" ON "creator_conversions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_creator_conversions_event" ON "creator_conversions" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_creator_conversions_creator_event" ON "creator_conversions" USING btree ("creator_id","event_type");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_creator_referrals_slug" ON "creator_referrals" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_creator_referrals_status" ON "creator_referrals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_creator_referrals_tier" ON "creator_referrals" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_created" ON "notifications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_unread" ON "notifications" USING btree ("user_id","read");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_referrals_referred" ON "referrals" USING btree ("referred_user_id");--> statement-breakpoint
CREATE INDEX "idx_referrals_referrer" ON "referrals" USING btree ("referrer_user_id");--> statement-breakpoint
CREATE INDEX "idx_rivalries_challenger" ON "rivalries" USING btree ("challenger_user_id");--> statement-breakpoint
CREATE INDEX "idx_rivalries_opponent" ON "rivalries" USING btree ("opponent_user_id");--> statement-breakpoint
CREATE INDEX "idx_rivalries_deadline" ON "rivalries" USING btree ("deadline_utc");--> statement-breakpoint
CREATE INDEX "idx_rivalries_created" ON "rivalries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_rivalry_ledger_rivalry" ON "rivalry_ledger_events" USING btree ("rivalry_id","timestamp_utc");--> statement-breakpoint
CREATE INDEX "idx_rivalry_metrics_rivalry_user" ON "rivalry_metric_snapshots" USING btree ("rivalry_id","user_id","fetched_at");--> statement-breakpoint
CREATE INDEX "idx_rivalry_participants_rivalry" ON "rivalry_participants" USING btree ("rivalry_id");--> statement-breakpoint
CREATE INDEX "idx_rivalry_participants_user" ON "rivalry_participants" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_users_clerk_user_id" ON "users" USING btree ("clerk_user_id");
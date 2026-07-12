CREATE TABLE "cltr_blockchain_events" (
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
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "drip_stage_sent" integer DEFAULT 0;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_cltr_blockchain_events_tx_hash" ON "cltr_blockchain_events" USING btree ("tx_hash");--> statement-breakpoint
CREATE INDEX "idx_cltr_blockchain_events_type" ON "cltr_blockchain_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_cltr_blockchain_events_sender" ON "cltr_blockchain_events" USING btree ("sender");
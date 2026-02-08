-- Add origin_event_id column (idempotent)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'account_ledger_events' AND column_name = 'origin_event_id'
    ) THEN 
        ALTER TABLE "account_ledger_events" ADD COLUMN "origin_event_id" uuid;
    END IF;
END $$;

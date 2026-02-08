-- Fix account_ledger_events.event_type column
-- Change from enum to varchar to match ORM schema
-- This migration is fully idempotent

-- Only proceed if event_type is still an enum type
DO $$ 
DECLARE
    col_type text;
BEGIN
    -- Check current column type
    SELECT data_type INTO col_type
    FROM information_schema.columns 
    WHERE table_name = 'account_ledger_events' 
    AND column_name = 'event_type';
    
    -- Only migrate if it's still USER-DEFINED (enum)
    IF col_type = 'USER-DEFINED' THEN
        -- Add temporary varchar column
        ALTER TABLE account_ledger_events ADD COLUMN event_type_new VARCHAR(50);
        
        -- Copy data
        UPDATE account_ledger_events SET event_type_new = event_type::text WHERE event_type_new IS NULL;
        
        -- Drop old column and rename new
        ALTER TABLE account_ledger_events DROP COLUMN event_type CASCADE;
        ALTER TABLE account_ledger_events RENAME COLUMN event_type_new TO event_type;
        
        -- Set NOT NULL constraint
        ALTER TABLE account_ledger_events ALTER COLUMN event_type SET NOT NULL;
    END IF;
END $$;

-- Drop the enum type if no longer used
DROP TYPE IF EXISTS account_ledger_event_type CASCADE;

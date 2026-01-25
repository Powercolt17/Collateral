-- Fix account_ledger_events.event_type column
-- Change from enum to varchar to match ORM schema

-- Step 1: Add temporary varchar column
ALTER TABLE account_ledger_events ADD COLUMN IF NOT EXISTS event_type_new VARCHAR(50);

-- Step 2: Copy data (if any)
UPDATE account_ledger_events SET event_type_new = event_type::text WHERE event_type_new IS NULL;

-- Step 3: Drop old column and rename new
ALTER TABLE account_ledger_events DROP COLUMN IF EXISTS event_type CASCADE;
ALTER TABLE account_ledger_events RENAME COLUMN event_type_new TO event_type;

-- Step 4: Set NOT NULL constraint
ALTER TABLE account_ledger_events ALTER COLUMN event_type SET NOT NULL;

-- Drop the enum type if no longer used
DROP TYPE IF EXISTS account_ledger_event_type CASCADE;

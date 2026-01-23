-- Migration: Normalize legacy TWITTER platform to X
-- The connected_accounts table previously used 'TWITTER' as platform identifier
-- New canonical standard is 'X' for consistency
-- This is a one-time migration for existing data
-- Note: This UPDATE is safe - if no TWITTER records exist, it's a no-op
-- If the enum doesn't contain TWITTER, we skip silently

DO $$ 
BEGIN
    -- Only run if TWITTER is a valid enum value
    IF EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'TWITTER' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'platform')
    ) THEN
        UPDATE connected_accounts SET platform = 'X' WHERE platform = 'TWITTER';
    END IF;
END $$;

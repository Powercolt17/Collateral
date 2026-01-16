-- Migration: Normalize legacy TWITTER platform to X
-- The connected_accounts table previously used 'TWITTER' as platform identifier
-- New canonical standard is 'X' for consistency
-- This is a one-time migration for existing data

UPDATE connected_accounts SET platform = 'X' WHERE platform = 'TWITTER';

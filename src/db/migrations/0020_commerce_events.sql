-- Add Commerce Verification Ledger Events
-- For Shopify and Amazon marketplace revenue contracts

ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_BASELINE_CAPTURED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_TARGET_LOCKED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_VERIFIED_SUCCESS';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_VERIFIED_FAIL';

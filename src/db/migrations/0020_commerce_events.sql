-- Add Commerce Platform (AMAZON) and Commerce Ledger Events
-- For Shopify and Amazon marketplace revenue contracts

-- Add AMAZON to platform enum
ALTER TYPE platform ADD VALUE IF NOT EXISTS 'AMAZON';

-- Add amazon to identity_provider enum  
ALTER TYPE identity_provider ADD VALUE IF NOT EXISTS 'amazon';

-- Add Commerce Verification Ledger Events
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_BASELINE_CAPTURED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_TARGET_LOCKED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_VERIFIED_SUCCESS';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_VERIFIED_FAIL';

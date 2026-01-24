-- Add available balance column to funding_sources
-- Tracks capital that can be used for contract funding

ALTER TABLE funding_sources
ADD COLUMN IF NOT EXISTS available_balance_usd_cents INTEGER DEFAULT 0 NOT NULL;

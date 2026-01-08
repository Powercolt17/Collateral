-- Add metadataJson column for audit trail
ALTER TABLE connected_accounts ADD COLUMN IF NOT EXISTS metadata_json JSONB;

-- Add unique constraint on (userId, platform) for idempotent upserts
CREATE UNIQUE INDEX IF NOT EXISTS idx_connected_accounts_user_platform 
ON connected_accounts(user_id, platform);

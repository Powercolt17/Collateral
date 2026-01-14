-- X OAuth 1.0a token storage update
-- Store access token and secret separately (not concatenated)
-- Add account created timestamp for age verification

-- Add new columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS x_access_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS x_access_token_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS x_account_created_at TIMESTAMPTZ;

-- Migrate any existing data from x_refresh_token (if it was token:secret format)
-- This is a one-time migration, run manually if needed:
-- UPDATE users 
-- SET x_access_token = split_part(x_refresh_token, ':', 1),
--     x_access_token_secret = split_part(x_refresh_token, ':', 2)
-- WHERE x_refresh_token IS NOT NULL AND x_refresh_token LIKE '%:%';

-- Drop old columns (optional, can keep for backward compat)
-- ALTER TABLE users DROP COLUMN IF EXISTS x_refresh_token;
-- ALTER TABLE users DROP COLUMN IF EXISTS x_token_expires_at;

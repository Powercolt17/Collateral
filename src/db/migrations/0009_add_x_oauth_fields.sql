-- Add X OAuth fields to users table
-- These replace the connected_accounts approach for X
-- One user can have exactly one X account bound

ALTER TABLE users ADD COLUMN IF NOT EXISTS x_user_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS x_username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS x_connected_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS x_refresh_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS x_token_expires_at TIMESTAMPTZ;

-- Ensure 1:1 X account binding (no two users can have same X account)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_x_user_id 
ON users(x_user_id) 
WHERE x_user_id IS NOT NULL;

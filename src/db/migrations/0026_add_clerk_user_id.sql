-- Add clerk_user_id column to users table for Clerk OAuth integration
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id) WHERE clerk_user_id IS NOT NULL;

-- Add partial unique index to prevent two users from verifying the same X account
-- This enforces one-to-one mapping: one X account can only be VERIFIED by one user
CREATE UNIQUE INDEX IF NOT EXISTS ux_connected_accounts_x_verified
ON connected_accounts(platform, external_account_id)
WHERE platform = 'X' AND verification_status = 'VERIFIED';

-- Also add index for user uniqueness (one user can only have one X connection)
-- This is already enforced by (user_id, platform) unique constraint from 0006

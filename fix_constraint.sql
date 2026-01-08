-- Temporary script to add unique constraint
ALTER TABLE connected_accounts 
ADD CONSTRAINT connected_accounts_user_platform_unique 
UNIQUE (user_id, platform);

-- Social Share Bonus columns
-- Users who share contracts on X/Twitter get +5% profit boost on success

ALTER TABLE contracts ADD COLUMN IF NOT EXISTS social_bonus_enabled BOOLEAN DEFAULT false;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS social_bonus_verified BOOLEAN DEFAULT false;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS social_bonus_tweet_id TEXT;

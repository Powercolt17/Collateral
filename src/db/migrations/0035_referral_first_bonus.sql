-- Referral System v2: add first-contract bonus tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_first_bonus_used BOOLEAN DEFAULT FALSE;

-- Add verification columns to connected_accounts for proof-of-control
-- This enables the challenge-response flow for X connection

ALTER TABLE connected_accounts 
ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'PENDING';

ALTER TABLE connected_accounts 
ADD COLUMN IF NOT EXISTS challenge_code TEXT NULL;

ALTER TABLE connected_accounts 
ADD COLUMN IF NOT EXISTS challenge_issued_at TIMESTAMP WITH TIME ZONE NULL;

ALTER TABLE connected_accounts 
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE NULL;

-- Note: verification_status values: 'PENDING', 'VERIFIED'

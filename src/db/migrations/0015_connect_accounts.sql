-- Stripe Connect accounts for payout destinations
-- Tracks onboarding status and payout capabilities

-- Onboarding status enum
DO $$ BEGIN
    CREATE TYPE connect_onboarding_status AS ENUM (
        'not_configured',
        'pending',
        'connected',
        'restricted',
        'error'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Connect accounts table
CREATE TABLE IF NOT EXISTS connect_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
    stripe_connect_account_id VARCHAR(255) NOT NULL,
    onboarding_status connect_onboarding_status DEFAULT 'not_configured' NOT NULL,
    charges_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    payouts_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    details_submitted BOOLEAN DEFAULT FALSE NOT NULL,
    account_type VARCHAR(50) DEFAULT 'express',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for Stripe account lookups
CREATE INDEX IF NOT EXISTS idx_connect_accounts_stripe_id ON connect_accounts(stripe_connect_account_id);

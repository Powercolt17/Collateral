-- Add funding_sources table for Stripe card storage
-- Tracks verified payment methods for capital lock operations

-- Status enum for funding sources
CREATE TYPE funding_source_status AS ENUM ('unconfigured', 'pending_verification', 'verified', 'disabled');

-- Funding sources table (one primary card per user)
CREATE TABLE funding_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    stripe_customer_id VARCHAR(255) NOT NULL,
    stripe_payment_method_id VARCHAR(255),
    stripe_setup_intent_id VARCHAR(255),
    brand VARCHAR(20),
    last4 VARCHAR(4),
    exp_month INTEGER,
    exp_year INTEGER,
    status funding_source_status DEFAULT 'unconfigured' NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

-- Index for quick customer lookups
CREATE INDEX idx_funding_sources_stripe_customer ON funding_sources(stripe_customer_id);

-- Index for webhook processing by setup intent
CREATE INDEX idx_funding_sources_setup_intent ON funding_sources(stripe_setup_intent_id);

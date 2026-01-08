-- Migration: Add identity_bindings table for immutable provider identity binding
-- Each binding is append-only: to switch, revoke old + insert new

-- Create provider enum for identity bindings (idempotent)
DO $$ BEGIN
    CREATE TYPE identity_provider AS ENUM ('stripe', 'github', 'x', 'google', 'youtube', 'tiktok', 'shopify');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Identity bindings table
CREATE TABLE IF NOT EXISTS identity_bindings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    provider identity_provider NOT NULL,
    
    -- Provider-specific identifiers
    provider_user_id TEXT NOT NULL,           -- Stable ID from provider (e.g., Stripe account ID, GitHub user ID)
    provider_account_id TEXT,                 -- Additional ID if needed (e.g., Stripe connected account ID)
    
    -- Audit trail
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by_event_id UUID,                 -- Reference to ledger event if applicable
    
    -- Revocation (for append-only rebinding)
    revoked_at TIMESTAMPTZ,
    revoked_by_event_id UUID
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_identity_bindings_user_id ON identity_bindings(user_id);
CREATE INDEX IF NOT EXISTS idx_identity_bindings_provider ON identity_bindings(provider);
CREATE INDEX IF NOT EXISTS idx_identity_bindings_provider_user_id ON identity_bindings(provider, provider_user_id);

-- CRITICAL: Only ONE active binding per (user_id, provider) where not revoked
-- This partial unique index enforces the invariant
CREATE UNIQUE INDEX IF NOT EXISTS idx_identity_bindings_active_unique 
    ON identity_bindings(user_id, provider) 
    WHERE revoked_at IS NULL;

-- Prevent same provider identity from being bound to multiple users
-- (Optional: Remove if allowing shared accounts)
CREATE UNIQUE INDEX IF NOT EXISTS idx_identity_bindings_provider_id_unique
    ON identity_bindings(provider, provider_user_id)
    WHERE revoked_at IS NULL;

-- Add IDENTITY_BOUND and IDENTITY_REVOKED to ledger event types
-- Note: This requires modifying the enum if it exists
-- In Postgres, we use ALTER TYPE ... ADD VALUE
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'IDENTITY_BOUND';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'IDENTITY_REVOKED';

-- Add binding reference columns to contracts table for immutable snapshots
-- These store the binding ID at contract creation time
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS stripe_binding_id UUID REFERENCES identity_bindings(id);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS github_binding_id UUID REFERENCES identity_bindings(id);

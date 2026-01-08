-- Migration: 0005_add_idempotency_keys.sql
-- Purpose: DB-backed idempotency for exactly-once external side effects

-- =============================================================================
-- IDEMPOTENCY KEYS TABLE
-- =============================================================================
-- Tracks execution of idempotent operations across processes.
-- Ensures webhooks, payouts, and settlements run exactly once.

CREATE TABLE IF NOT EXISTS idempotency_keys (
    -- Composite key: scope:originalKey
    key TEXT PRIMARY KEY,
    
    -- Scope for namespacing (e.g., 'stripe:webhook', 'stripe:payout')
    scope TEXT NOT NULL,
    
    -- Status: started | succeeded | failed
    status TEXT NOT NULL DEFAULT 'started',
    
    -- Timestamps for tracking
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    locked_at TIMESTAMPTZ,        -- When current lock was acquired
    completed_at TIMESTAMPTZ,     -- When operation finished (success or fail)
    
    -- Results storage
    result_json JSONB,            -- Cached result on success
    error_text TEXT               -- Error message on failure
);

-- Index for scope-based queries
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_scope ON idempotency_keys(scope);

-- Index for finding stale locks (for recovery)
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_stale 
    ON idempotency_keys(locked_at) 
    WHERE status = 'started';

-- Cleanup old completed keys (optional - for maintenance queries)
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_cleanup 
    ON idempotency_keys(completed_at) 
    WHERE status = 'succeeded';

-- =============================================================================
-- CONSTRAINTS
-- =============================================================================

-- Ensure status is one of allowed values
ALTER TABLE idempotency_keys 
    ADD CONSTRAINT chk_idempotency_status 
    CHECK (status IN ('started', 'succeeded', 'failed'));

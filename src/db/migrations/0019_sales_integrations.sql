-- Sales Integration Backend Schema (Stripe Revenue)
-- Tables for baseline snapshots, contract terms, and verification runs.
-- Provider is now Stripe only (Authorize.net support removed).

-- =============================================================================
-- ENUMS
-- =============================================================================

-- Sales provider enum - Stripe only
DO $$ BEGIN
    CREATE TYPE sales_provider AS ENUM ('stripe');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Sales integration status enum
DO $$ BEGIN
    CREATE TYPE sales_integration_status AS ENUM (
        'disconnected',
        'connected', 
        'verified',
        'revoked',
        'error'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Sales metric enum
DO $$ BEGIN
    CREATE TYPE sales_metric AS ENUM ('net_settled_amount', 'closed_won_count');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Sales verification run status enum
DO $$ BEGIN
    CREATE TYPE sales_verification_status AS ENUM ('queued', 'running', 'ok', 'error');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- SALES BASELINE SNAPSHOTS TABLE
-- =============================================================================
-- Immutable baseline captures using Stripe revenue data

CREATE TABLE IF NOT EXISTS sales_baseline_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    provider sales_provider NOT NULL DEFAULT 'stripe',
    window_days INTEGER NOT NULL DEFAULT 30,
    window_start_at TIMESTAMPTZ NOT NULL,
    window_end_at TIMESTAMPTZ NOT NULL,
    -- Computed metrics + raw summary (immutable)
    baseline_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Unique constraint: one snapshot per user per window
    UNIQUE(user_id, window_start_at, window_end_at)
);

CREATE INDEX IF NOT EXISTS idx_sales_baseline_snapshots_user_id ON sales_baseline_snapshots(user_id);

-- =============================================================================
-- SALES CONTRACT TERMS TABLE
-- =============================================================================
-- Immutable terms captured at execution time
-- All values frozen - no reliance on mutable provider data

CREATE TABLE IF NOT EXISTS sales_contract_terms (
    contract_id UUID PRIMARY KEY REFERENCES contracts(id),
    provider sales_provider NOT NULL DEFAULT 'stripe',
    metric sales_metric NOT NULL,
    window_days INTEGER NOT NULL,
    baseline_snapshot_id UUID NOT NULL REFERENCES sales_baseline_snapshots(id),
    -- All money in BIGINT cents
    baseline_value_cents BIGINT NOT NULL,
    target_delta_cents BIGINT NOT NULL,
    target_total_cents BIGINT NOT NULL,
    -- Qualification rules (refunds/chargebacks exclusion etc.)
    qualified_rules_json JSONB,
    executed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SALES VERIFICATION RUNS TABLE
-- =============================================================================
-- Audit trail of verification attempts with retry support

CREATE TABLE IF NOT EXISTS sales_verification_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id),
    provider sales_provider NOT NULL DEFAULT 'stripe',
    status sales_verification_status NOT NULL DEFAULT 'queued',
    attempt INTEGER NOT NULL DEFAULT 1,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    -- Computed totals, counts, etc.
    result_json JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_verification_runs_contract_id ON sales_verification_runs(contract_id);
CREATE INDEX IF NOT EXISTS idx_sales_verification_runs_status ON sales_verification_runs(status);
CREATE INDEX IF NOT EXISTS idx_sales_verification_runs_contract_created 
    ON sales_verification_runs(contract_id, created_at DESC);

-- =============================================================================
-- ADD NEW LEDGER EVENT TYPES
-- =============================================================================

ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'SALES_BASELINE_SNAPSHOTTED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'SALES_TERMS_ATTACHED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'SALES_VERIFICATION_QUEUED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'SALES_VERIFICATION_COMPUTED';

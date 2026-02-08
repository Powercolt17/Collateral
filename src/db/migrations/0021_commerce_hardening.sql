-- Commerce Hardening Migration
-- Adds verification job locks table and hardening columns

-- =============================================================================
-- VERIFICATION JOB LOCKS (Idempotency + Single Writer)
-- =============================================================================

CREATE TABLE IF NOT EXISTS verification_job_locks (
    idempotency_key VARCHAR(255) PRIMARY KEY,
    contract_id UUID NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    provider VARCHAR(20) NOT NULL,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    locked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    locked_by VARCHAR(255) NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 1
);

-- Index for cleanup of expired locks
CREATE INDEX IF NOT EXISTS idx_verification_job_locks_expires 
    ON verification_job_locks(expires_at);

-- Index for contract lookup
CREATE INDEX IF NOT EXISTS idx_verification_job_locks_contract 
    ON verification_job_locks(contract_id);

-- =============================================================================
-- CONNECTED ACCOUNTS HARDENING COLUMNS
-- =============================================================================

-- Provider identity validation
ALTER TABLE connected_accounts 
    ADD COLUMN IF NOT EXISTS provider_shop_id VARCHAR(255);

ALTER TABLE connected_accounts 
    ADD COLUMN IF NOT EXISTS provider_currency VARCHAR(10);

ALTER TABLE connected_accounts 
    ADD COLUMN IF NOT EXISTS provider_timezone VARCHAR(64);

-- Scope tracking
ALTER TABLE connected_accounts 
    ADD COLUMN IF NOT EXISTS scopes_hash VARCHAR(64);

ALTER TABLE connected_accounts 
    ADD COLUMN IF NOT EXISTS scopes_granted JSONB;

-- Validation tracking
ALTER TABLE connected_accounts 
    ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE connected_accounts 
    ADD COLUMN IF NOT EXISTS validation_error_code VARCHAR(50);

-- =============================================================================
-- SALES BASELINE SNAPSHOTS HARDENING
-- =============================================================================

-- Data integrity hash
ALTER TABLE sales_baseline_snapshots 
    ADD COLUMN IF NOT EXISTS data_hash VARCHAR(64);

-- Last order ID for reproducibility
ALTER TABLE sales_baseline_snapshots 
    ADD COLUMN IF NOT EXISTS last_order_id VARCHAR(255);

-- API version used
ALTER TABLE sales_baseline_snapshots 
    ADD COLUMN IF NOT EXISTS api_version VARCHAR(20);

-- =============================================================================
-- NEW LEDGER EVENT TYPES
-- =============================================================================

-- Provider connection events
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_PROVIDER_CONNECTED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_PROVIDER_DISCONNECTED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_PROVIDER_VALIDATED';

-- Eligibility events
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_ELIGIBILITY_CHECKED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_ELIGIBILITY_FAILED';

-- Verification retry events
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_VERIFICATION_RETRY';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_VERIFICATION_UNVERIFIABLE';

-- Job lock events
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_JOB_LOCK_ACQUIRED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_JOB_LOCK_CONTENTION';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'COMMERCE_JOB_LOCK_RELEASED';

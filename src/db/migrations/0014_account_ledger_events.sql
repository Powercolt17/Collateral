-- Account-level ledger events for balance tracking
-- Separate from contract ledger_events for cleaner derivation

-- Event type enum for account ledger
DO $$ BEGIN
    CREATE TYPE account_ledger_event_type AS ENUM (
        'FUNDS_ADDED',
        'CAPITAL_LOCKED',
        'CAPITAL_UNLOCKED',
        'SETTLEMENT_WIN',
        'SETTLEMENT_LOSS',
        'PAYOUT_QUEUED',
        'PAYOUT_SENT',
        'PAYOUT_FAILED',
        'DISPUTE_OPENED',
        'DISPUTE_RESOLVED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Account ledger events table (append-only)
CREATE TABLE IF NOT EXISTS account_ledger_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    contract_id UUID REFERENCES contracts(id),
    event_type account_ledger_event_type NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd' NOT NULL,
    idempotency_key VARCHAR(255) NOT NULL UNIQUE,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for balance derivation
CREATE INDEX IF NOT EXISTS idx_account_ledger_user_id ON account_ledger_events(user_id);
CREATE INDEX IF NOT EXISTS idx_account_ledger_contract_id ON account_ledger_events(contract_id);
CREATE INDEX IF NOT EXISTS idx_account_ledger_event_type ON account_ledger_events(event_type);
CREATE INDEX IF NOT EXISTS idx_account_ledger_created_at ON account_ledger_events(created_at);

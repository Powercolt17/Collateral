-- Oracle Metric System: append-only snapshots + fast-read cache
-- Enables live contract progress bars without frontend hitting provider APIs

-- 1) Append-only metric snapshots (every fetch/webhook creates a row)
CREATE TABLE IF NOT EXISTS contract_metric_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id),
    provider TEXT NOT NULL,
    metric_key TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL,
    request_id TEXT,
    raw_payload_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_metric_snapshots_contract_fetched
    ON contract_metric_snapshots(contract_id, fetched_at DESC);

CREATE INDEX IF NOT EXISTS idx_metric_snapshots_contract_id
    ON contract_metric_snapshots(contract_id);

-- 2) Fast-read cache for UI (one row per contract, upserted on each refresh)
CREATE TABLE IF NOT EXISTS contract_metric_current (
    contract_id UUID PRIMARY KEY REFERENCES contracts(id),
    provider TEXT NOT NULL,
    metric_key TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL,
    progress_pct NUMERIC NOT NULL DEFAULT 0,
    next_check_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) Add new ledger event types for oracle/webhook snapshots
-- Using ALTER TYPE ... ADD VALUE (idempotent with IF NOT EXISTS)
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'ORACLE_SNAPSHOT_RECORDED';
ALTER TYPE ledger_event_type ADD VALUE IF NOT EXISTS 'WEBHOOK_SNAPSHOT_RECORDED';

-- Migration: 0030_rivalry_tables.sql
-- Creates the 4 core tables for Rivalry Mode (head-to-head contracts)
-- Follows existing protocol patterns: append-only ledger, immutable baselines, hash-chaining

-- ================================================================
-- 1. RIVALRIES — Core rivalry record
-- ================================================================
CREATE TABLE IF NOT EXISTS rivalries (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Participants
    challenger_user_id   UUID NOT NULL REFERENCES users(id),
    opponent_user_id     UUID NOT NULL REFERENCES users(id),
    -- Contract terms (immutable after creation)
    platform             platform NOT NULL,
    metric_type          metric_type NOT NULL,
    metric_key           VARCHAR(50) NOT NULL,
    stake_per_side_cents INTEGER NOT NULL,
    duration_days        INTEGER NOT NULL,
    acceptance_ttl_hours INTEGER NOT NULL DEFAULT 72,
    funding_ttl_hours    INTEGER NOT NULL DEFAULT 48,
    protocol_fee_bps     INTEGER NOT NULL DEFAULT 200,
    -- Timestamps
    challenge_issued_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    accepted_at          TIMESTAMPTZ,
    funded_at            TIMESTAMPTZ,
    activated_at         TIMESTAMPTZ,
    deadline_utc         TIMESTAMPTZ,
    settled_at           TIMESTAMPTZ,
    -- Outcome
    winner_user_id       UUID REFERENCES users(id),
    settlement_metadata  JSONB,
    -- Integrity
    record_hash          VARCHAR(64),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rivalries_challenger ON rivalries(challenger_user_id);
CREATE INDEX IF NOT EXISTS idx_rivalries_opponent ON rivalries(opponent_user_id);
CREATE INDEX IF NOT EXISTS idx_rivalries_deadline ON rivalries(deadline_utc);
CREATE INDEX IF NOT EXISTS idx_rivalries_created ON rivalries(created_at);

-- ================================================================
-- 2. RIVALRY_PARTICIPANTS — Per-side funding, baselines, deltas
-- ================================================================
CREATE TABLE IF NOT EXISTS rivalry_participants (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rivalry_id            UUID NOT NULL REFERENCES rivalries(id),
    user_id               UUID NOT NULL REFERENCES users(id),
    role                  VARCHAR(10) NOT NULL CHECK (role IN ('challenger', 'opponent')),
    -- Funding
    funded                BOOLEAN NOT NULL DEFAULT false,
    funded_at             TIMESTAMPTZ,
    lock_event_id         UUID,
    -- Baseline (immutable after activation)
    baseline_value        NUMERIC,
    baseline_json         JSONB,
    baseline_snapshot_at  TIMESTAMPTZ,
    baseline_hash         VARCHAR(64),
    -- Final measurement
    final_value           NUMERIC,
    final_json            JSONB,
    final_snapshot_at     TIMESTAMPTZ,
    -- Computed deltas
    absolute_delta        NUMERIC,
    percentage_delta      NUMERIC,
    -- Outcome
    outcome               VARCHAR(10) CHECK (outcome IN ('WIN', 'LOSS', 'DRAW')),
    payout_cents          INTEGER,
    -- Provider identity binding at activation
    identity_binding_id   UUID,
    connected_account_id  UUID,
    UNIQUE (rivalry_id, role)
);

CREATE INDEX IF NOT EXISTS idx_rivalry_participants_rivalry ON rivalry_participants(rivalry_id);
CREATE INDEX IF NOT EXISTS idx_rivalry_participants_user ON rivalry_participants(user_id);

-- ================================================================
-- 3. RIVALRY_LEDGER_EVENTS — Append-only hash-chained ledger
-- ================================================================
CREATE TABLE IF NOT EXISTS rivalry_ledger_events (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rivalry_id        UUID NOT NULL REFERENCES rivalries(id),
    actor             ledger_actor NOT NULL,
    event_type        VARCHAR(50) NOT NULL,
    user_id           UUID REFERENCES users(id),
    timestamp_utc     TIMESTAMPTZ NOT NULL DEFAULT now(),
    amount_usd_cents  INTEGER,
    external_ref      VARCHAR(255),
    metadata_json     JSONB,
    prev_event_hash   VARCHAR(64),
    event_hash        VARCHAR(64) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_rivalry_ledger_idempotency
    ON rivalry_ledger_events(rivalry_id, external_ref)
    WHERE external_ref IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rivalry_ledger_rivalry ON rivalry_ledger_events(rivalry_id, timestamp_utc);

-- ================================================================
-- 4. RIVALRY_METRIC_SNAPSHOTS — Live metric tracking for both sides
-- ================================================================
CREATE TABLE IF NOT EXISTS rivalry_metric_snapshots (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rivalry_id       UUID NOT NULL REFERENCES rivalries(id),
    user_id          UUID NOT NULL REFERENCES users(id),
    provider         TEXT NOT NULL,
    metric_key       TEXT NOT NULL,
    metric_value     NUMERIC NOT NULL,
    fetched_at       TIMESTAMPTZ NOT NULL,
    request_id       TEXT,
    raw_payload_hash TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rivalry_metrics_rivalry_user
    ON rivalry_metric_snapshots(rivalry_id, user_id, fetched_at);

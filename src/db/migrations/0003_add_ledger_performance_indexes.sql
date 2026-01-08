-- Migration: Add performance indexes for ledger queries
-- These indexes optimize existing query patterns without changing behavior

-- Index 1: Global ledger feed pagination (newest-first)
-- Matches: getLedgerEvents() ORDER BY (timestamp_utc DESC, id DESC)
CREATE INDEX IF NOT EXISTS idx_ledger_events_global_feed
ON ledger_events (timestamp_utc DESC, id DESC);

-- Index 2: Per-contract event scans (chronological order)
-- Matches: getEventsForContract() ORDER BY (timestamp_utc ASC, id ASC)
-- Also optimizes: getChainHead() ORDER BY (timestamp_utc DESC, id DESC) LIMIT 1
-- Also optimizes: chain verification traversals
CREATE INDEX IF NOT EXISTS idx_ledger_events_contract_chronological
ON ledger_events (contract_id, timestamp_utc ASC, id ASC);

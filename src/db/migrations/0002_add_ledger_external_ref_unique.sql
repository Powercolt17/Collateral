-- Migration: Add unique constraint for race-safe idempotency on externalRef
-- This ensures concurrent webhook retries cannot insert duplicate events

ALTER TABLE ledger_events 
ADD CONSTRAINT ledger_events_contract_external_ref_unique 
UNIQUE (contract_id, external_ref);

-- Note: This constraint allows NULL values in external_ref since
-- PostgreSQL treats NULLs as distinct in unique constraints.
-- Multiple events with external_ref = NULL are allowed (which is correct).

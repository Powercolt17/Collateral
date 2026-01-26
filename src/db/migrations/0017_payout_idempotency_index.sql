CREATE UNIQUE INDEX IF NOT EXISTS uq_payout_origin_once
ON account_ledger_events(origin_event_id)
WHERE origin_event_id IS NOT NULL
  AND event_type IN ('PAYOUT_SENT', 'PAYOUT_FAILED');

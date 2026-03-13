-- Migration: 0031_rivalry_targets.sql
-- Adds target-based rivalry model: shared growth target + tier system
-- Settlement: both hit = draw, one hit = winner, both miss = protocol keeps pool

ALTER TABLE rivalries
    ADD COLUMN IF NOT EXISTS target_growth_pct NUMERIC NOT NULL DEFAULT 15,
    ADD COLUMN IF NOT EXISTS rivalry_tier VARCHAR(10) NOT NULL DEFAULT 'DUEL';

-- Add constraint for valid tiers
ALTER TABLE rivalries
    ADD CONSTRAINT chk_rivalry_tier CHECK (rivalry_tier IN ('DUEL', 'WAR', 'BLOOD'));

-- Add BOTH_MISS as valid outcome for participants
-- (existing check allows WIN, LOSS, DRAW — we need BOTH_MISS)
ALTER TABLE rivalry_participants DROP CONSTRAINT IF EXISTS rivalry_participants_outcome_check;
ALTER TABLE rivalry_participants
    ADD CONSTRAINT rivalry_participants_outcome_check
    CHECK (outcome IN ('WIN', 'LOSS', 'DRAW', 'BOTH_MISS'));

COMMENT ON COLUMN rivalries.target_growth_pct IS 'Shared growth target both participants must hit (e.g. 15 = 15%)';
COMMENT ON COLUMN rivalries.rivalry_tier IS 'Risk tier: DUEL (15%), WAR (25%), BLOOD (40%)';

-- Migration: Allow open/public rivalries
-- opponent_user_id can be NULL for open challenges (anyone can accept)
ALTER TABLE rivalries ALTER COLUMN opponent_user_id DROP NOT NULL;

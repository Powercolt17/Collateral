-- Migration: 0037_rivalry_nullable_opponent.sql
-- Makes opponent_user_id nullable to support open challenges (no designated opponent)
-- Open challenges allow any user to accept, so opponent is NULL at creation time

ALTER TABLE rivalries ALTER COLUMN opponent_user_id DROP NOT NULL;

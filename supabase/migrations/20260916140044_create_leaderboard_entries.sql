/*
# Create leaderboard_entries table

1. New Tables
- `leaderboard_entries` — stores game results for the global leaderboard.
  - `id` (uuid, primary key)
  - `player_name` (text, not null) — name entered by the player (no login required)
  - `mode` (text, not null) — game mode: 'paraguay', 'argentina', or 'global'
  - `score` (integer, not null) — number of correct answers
  - `completed` (boolean, not null, default false) — whether the player completed the full cycle
  - `time_ms` (integer, not null) — total game duration in milliseconds (used as tiebreaker: lower is better)
  - `created_at` (timestamptz, default now())

2. Indexes
- `idx_leaderboard_mode_score_time` on (mode, score DESC, time_ms ASC) — efficient top-10 query per mode.

3. Security
- Enable RLS on `leaderboard_entries`.
- This is a no-auth app (player enters a name, no login). Policies use `TO anon, authenticated` so the anon-key client can read and write.
- SELECT: anyone can read (public leaderboard).
- INSERT: anyone can insert (submit a score).
- UPDATE / DELETE: not needed — scores are immutable once submitted.

4. Notes
- Each mode has its own filtered leaderboard; scores are never mixed between modes.
- No fake data is inserted for Argentina or Global modes.
*/

CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL CHECK (length(trim(player_name)) > 0 AND length(player_name) <= 20),
  mode text NOT NULL CHECK (mode IN ('paraguay', 'argentina', 'global')),
  score integer NOT NULL CHECK (score >= 0),
  completed boolean NOT NULL DEFAULT false,
  time_ms integer NOT NULL CHECK (time_ms >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_select_leaderboard"
ON leaderboard_entries FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_insert_leaderboard"
ON leaderboard_entries FOR INSERT
TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_leaderboard_mode_score_time
ON leaderboard_entries (mode, score DESC, time_ms ASC);

import { supabase } from '@/lib/supabase';
import type { GameMode, LeaderboardEntry } from '@/types';

export async function fetchLeaderboard(mode: GameMode, limit = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard_entries')
    .select('id, player_name, score, completed, time_ms, created_at')
    .eq('mode', mode)
    .order('score', { ascending: false })
    .order('time_ms', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as LeaderboardEntry[];
}

export async function submitScore(
  playerName: string,
  mode: GameMode,
  score: number,
  completed: boolean,
  timeMs: number
): Promise<LeaderboardEntry | null> {
  const { data, error } = await supabase
    .from('leaderboard_entries')
    .insert({
      player_name: playerName,
      mode,
      score,
      completed,
      time_ms: timeMs,
    })
    .select('id, player_name, score, completed, time_ms, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as LeaderboardEntry;
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

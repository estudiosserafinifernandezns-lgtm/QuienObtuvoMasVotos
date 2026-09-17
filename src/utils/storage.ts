import type { GameStats } from '@/types';

const BEST_STREAK_KEY = 'whv_best_streak';

export function loadBestStreak(): number {
  try {
    const value = localStorage.getItem(BEST_STREAK_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch {
    return 0;
  }
}

export function saveBestStreak(streak: number): void {
  try {
    const current = loadBestStreak();
    if (streak > current) {
      localStorage.setItem(BEST_STREAK_KEY, String(streak));
    }
  } catch {
    // ignore
  }
}

export function getGameStats(streak: number): GameStats {
  return {
    streak,
    bestStreak: Math.max(streak, loadBestStreak()),
    completed: false,
  };
}

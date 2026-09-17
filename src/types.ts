export interface President {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  electionYear: number;
  termStart: number;
  termEnd: number;
  votes: number;
  image: string;
  source: string;
  party: string;
}

export type GameMode = 'paraguay' | 'argentina' | 'global';

export type Screen = 'menu' | 'nameentry' | 'game' | 'gameover' | 'leaderboard';

export type Answer = 'more' | 'less';

export interface RoundState {
  left: President;
  right: President;
  revealed: boolean;
  wasCorrect: boolean | null;
  userAnswer: Answer | null;
}

export interface GameStats {
  streak: number;
  bestStreak: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  completed: boolean;
  time_ms: number;
  created_at: string;
}

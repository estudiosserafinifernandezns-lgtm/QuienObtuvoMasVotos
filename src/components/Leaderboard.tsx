import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Trophy, Clock, Lock, Loader2, Medal } from 'lucide-react';
import type { GameMode, LeaderboardEntry } from '@/types';
import { fetchLeaderboard, formatTime } from '@/utils/leaderboard';
import { FlagIcon } from '@/components/FlagIcon';

interface LeaderboardProps {
  initialMode: GameMode;
  onBack: () => void;
}

interface ModeTab {
  mode: GameMode;
  flag: string;
  label: string;
  available: boolean;
}

const tabs: ModeTab[] = [
  { mode: 'paraguay', flag: 'PY', label: 'Paraguay', available: true },
  { mode: 'argentina', flag: 'AR', label: 'Argentina', available: false },
  { mode: 'global', flag: 'GLOBAL', label: 'Global', available: false },
];

export function Leaderboard({ initialMode, onBack }: LeaderboardProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>(initialMode);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (mode: GameMode) => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchLeaderboard(mode);
      setEntries(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const tab = tabs.find((t) => t.mode === selectedMode);
    if (tab && tab.available) {
      load(selectedMode);
    } else {
      setLoading(false);
    }
  }, [selectedMode, load]);

  const currentTab = tabs.find((t) => t.mode === selectedMode)!;

  return (
    <div
      className="min-h-screen flex flex-col animate-fade-in"
      style={{
        background: 'linear-gradient(180deg, #f8f9fc 0%, #eef0f8 50%, #e8ecf8 100%)',
      }}
    >
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-5 py-3 bg-white border-b border-slate-200 card-shadow z-20">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all active:scale-90"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <p className="text-sm font-fun font-bold uppercase tracking-wide text-[var(--color-ink)]">
            Leaderboard
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Mode selector tabs */}
      <div className="flex-shrink-0 px-3 sm:px-5 py-3">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.mode}
              onClick={() => tab.available && setSelectedMode(tab.mode)}
              disabled={!tab.available}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border-2 transition-all text-xs font-fun font-bold ${
                selectedMode === tab.mode
                  ? 'bg-white border-violet-400 text-violet-500 card-shadow'
                  : tab.available
                  ? 'bg-white/50 border-slate-200 text-slate-500 hover:border-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
              }`}
            >
              <FlagIcon code={tab.flag} size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
              {!tab.available && <Lock className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 sm:px-5 pb-6 overflow-y-auto">
        {!currentTab.available ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-fun font-bold text-[var(--color-ink)] text-lg mb-1">
              {currentTab.label}
            </h3>
            <p className="text-slate-400 text-sm font-semibold">PRÓXIMAMENTE</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <p className="text-slate-400 text-sm font-semibold text-center">
              No se pudo cargar el leaderboard.<br />Intentá de nuevo más tarde.
            </p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-violet-300" />
            </div>
            <p className="text-slate-400 text-sm font-semibold text-center">
              Aún no hay puntajes.<br />¡Sé el primero en jugar!
            </p>
          </div>
        ) : (
          <div className="space-y-2 animate-fade-in">
            {/* Ranking header */}
            <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="w-8 text-center">#</span>
              <span className="flex-1">Jugador</span>
              <span className="w-16 text-center">Correctas</span>
              <span className="w-16 text-center">Tiempo</span>
            </div>

            {entries.map((entry, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const medalColor = rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-orange-400' : '';

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-2 px-3 py-3 rounded-2xl border-2 transition-all animate-slide-up ${
                    isTop3
                      ? 'bg-white border-amber-200 card-shadow'
                      : 'bg-white/70 border-slate-200'
                  }`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* Rank */}
                  <div className="w-8 flex items-center justify-center">
                    {isTop3 ? (
                      <Medal className={`w-5 h-5 ${medalColor}`} />
                    ) : (
                      <span className="text-sm font-fun font-bold text-slate-400">{rank}</span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-fun font-bold text-sm text-[var(--color-ink)] truncate">
                      {entry.player_name}
                    </p>
                    {entry.completed && (
                      <span className="text-[10px] text-emerald-500 font-semibold">
                        Ciclo completo
                      </span>
                    )}
                  </div>

                  {/* Score */}
                  <div className="w-16 text-center">
                    <span className="font-fun font-bold text-violet-500 text-base">{entry.score}</span>
                  </div>

                  {/* Time */}
                  <div className="w-16 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500">
                      {formatTime(entry.time_ms)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Trophy, Medal, Clock, Loader2, ChevronRight } from 'lucide-react';
import type { LeaderboardEntry } from '@/types';
import { fetchLeaderboard, formatTime } from '@/utils/leaderboard';

interface LeaderboardSidebarProps {
  onViewFull: () => void;
}

export function LeaderboardSidebar({ onViewFull }: LeaderboardSidebarProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchLeaderboard('paraguay', 5)
      .then((data) => {
        if (!cancelled) setEntries(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full bg-white border-2 border-slate-200 rounded-2xl card-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h3 className="font-fun font-bold text-sm text-[var(--color-ink)]">
            Top 5
          </h3>
        </div>
        <button
          onClick={onViewFull}
          className="flex items-center gap-0.5 text-[11px] font-bold text-violet-500 hover:text-violet-600 transition-colors"
        >
          Ver todos
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Body */}
      <div className="p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-violet-300 animate-spin" />
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <p className="text-xs text-slate-400 font-semibold">
              No se pudo cargar
            </p>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-6 text-center">
            <Trophy className="w-6 h-6 text-slate-200 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-semibold">
              Aún no hay puntajes
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {entries.map((entry, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const medalColor =
                rank === 1 ? 'text-amber-500'
                : rank === 2 ? 'text-slate-400'
                : rank === 3 ? 'text-orange-400'
                : '';

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all ${
                    isTop3 ? 'bg-amber-50/60' : 'bg-slate-50/50'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-6 flex items-center justify-center flex-shrink-0">
                    {isTop3 ? (
                      <Medal className={`w-4 h-4 ${medalColor}`} />
                    ) : (
                      <span className="text-xs font-fun font-bold text-slate-400">
                        {rank}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-fun font-bold text-xs text-[var(--color-ink)] truncate">
                      {entry.player_name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {entry.completed && (
                        <span className="text-[9px] text-emerald-500 font-bold">
                          Ciclo completo
                        </span>
                      )}
                      <span className="flex items-center gap-0.5 text-[10px] text-slate-400 font-semibold">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTime(entry.time_ms)}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0">
                    <span className="font-fun font-bold text-sm text-violet-500">
                      {entry.score}
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

import type { GameMode } from '@/types';
import { isModeAvailable } from '@/data';
import { ChevronRight, Lock, Trophy, Flame } from 'lucide-react';
import { loadBestStreak } from '@/utils/storage';
import { useEffect, useState } from 'react';
import { FlagIcon } from '@/components/FlagIcon';
import { LeaderboardSidebar } from '@/components/LeaderboardSidebar';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onViewLeaderboard: () => void;
}

interface ModeCard {
  mode: GameMode;
  flag: string;
  title: string;
  description: string;
  accent: string;
}

const modes: ModeCard[] = [
  {
    mode: 'paraguay',
    flag: 'PY',
    title: 'Presidentes Paraguayos',
    description: 'Compará los resultados de las elecciones presidenciales de Paraguay.',
    accent: 'hover:border-violet-400 hover:shadow-violet-200/50',
  },
  {
    mode: 'argentina',
    flag: 'AR',
    title: 'Presidentes Argentinos',
    description: 'Compará los resultados de las elecciones presidenciales de Argentina.',
    accent: 'hover:border-sky-400 hover:shadow-sky-200/50',
  },
  {
    mode: 'global',
    flag: 'GLOBAL',
    title: 'Presidentes del Mundo',
    description: 'Compará presidentes de todo el mundo.',
    accent: 'hover:border-emerald-400 hover:shadow-emerald-200/50',
  },
];

export function MainMenu({ onSelectMode, onViewLeaderboard }: MainMenuProps) {
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    setBestStreak(loadBestStreak());
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10 animate-fade-in"
      style={{
        background: 'linear-gradient(180deg, #f8f9fc 0%, #eef0f8 50%, #e8ecf8 100%)',
      }}
    >
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-8">
        {/* Main content block */}
        <div className="flex flex-col items-center w-full lg:flex-1 lg:max-w-md">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-fun font-bold tracking-tight text-balance leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-pink-500 to-violet-600">
                ¿Quién obtuvo
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-pink-500 to-violet-600">
                más votos?
              </span>
            </h1>
            <div className="mt-3 h-1 w-28 mx-auto rounded-full bg-gradient-to-r from-violet-300 via-pink-300 to-violet-300" />
            <p className="text-slate-500 mt-3 text-sm sm:text-base font-semibold">
              Poné a prueba tu conocimiento sobre elecciones presidenciales.
            </p>
          </div>

          {/* Best streak badge */}
          {bestStreak > 0 && (
            <div className="mb-5 streak-pill rounded-full px-5 py-2 flex items-center gap-2 animate-scale-in">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-fun font-bold text-orange-600">
                Mejor racha: {bestStreak}
              </span>
            </div>
          )}

          {/* Mode selection */}
          <div className="w-full space-y-3">
            <p className="text-xs font-fun font-bold uppercase tracking-widest text-slate-400 mb-3 text-center">
              Elegí un modo
            </p>

            {modes.map((mode) => {
              const available = isModeAvailable(mode.mode);
              return (
                <button
                  key={mode.mode}
                  onClick={() => available && onSelectMode(mode.mode)}
                  disabled={!available}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-slate-200
                    transition-all duration-200
                    ${
                      available
                        ? `${mode.accent} card-shadow cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]`
                        : 'opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-12">
                    <FlagIcon code={mode.flag} size={36} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-fun font-bold text-[var(--color-ink)] text-sm">
                      {mode.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug font-semibold">
                      {available ? mode.description : 'Próximamente'}
                    </p>
                  </div>
                  {available ? (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                      <ChevronRight className="w-5 h-5 text-violet-500" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="mt-8 flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>Conseguí la racha más larga</span>
          </div>
        </div>

        {/* Leaderboard sidebar — integrated visually */}
        <div className="w-full lg:w-64 lg:flex-shrink-0 lg:self-center">
          <LeaderboardSidebar onViewFull={onViewLeaderboard} />
        </div>
      </div>
    </div>
  );
}

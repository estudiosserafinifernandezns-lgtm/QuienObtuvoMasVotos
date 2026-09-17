import type { President, Answer } from '@/types';
import { formatVotes } from '@/utils/gameLogic';
import { FlagIcon } from '@/components/FlagIcon';
import { ChevronUp, ChevronDown, Calendar, Vote } from 'lucide-react';

interface PresidentCardProps {
  president: President;
  showVotes: boolean;
  showButtons: boolean;
  isWinner: boolean | null;
  onAnswer?: (answer: Answer) => void;
}

export function PresidentCard({
  president,
  showVotes,
  showButtons,
  isWinner,
  onAnswer,
}: PresidentCardProps) {
  const revealed = isWinner !== null;
  const isLoser = revealed && !isWinner;
  const showWinnerGlow = revealed && isWinner;

  return (
    <div
      className={`
        relative flex flex-col h-full overflow-hidden
        transition-all duration-300 bg-white
        ${isLoser ? 'opacity-50' : ''}
      `}
    >
      {/* Photo area */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200">
        {president.image ? (
          <img
            src={president.image}
            alt={president.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-violet-50 to-slate-100">
            <FlagIcon code={president.countryCode} size={64} className="opacity-15" />
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #ffffff 0%, transparent 100%)',
          }}
        />

        {/* Question + buttons overlay on photo (right card only) */}
        {showButtons && (
          <div className="absolute bottom-3 left-2 right-2 animate-fade-in z-10">
            <p className="text-[11px] sm:text-sm text-white font-fun font-bold mb-2 tracking-wide text-center drop-shadow-lg">
              ¿MÁS O MENOS VOTOS?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onAnswer?.('more')}
                className="btn-fun-more flex-1 py-2.5 sm:py-3 rounded-2xl font-fun font-bold text-xs sm:text-sm
                  flex items-center justify-center gap-1.5 text-white"
              >
                <ChevronUp className="w-4 h-4" strokeWidth={3} />
                MÁS
              </button>
              <button
                onClick={() => onAnswer?.('less')}
                className="btn-fun-less flex-1 py-2.5 sm:py-3 rounded-2xl font-fun font-bold text-xs sm:text-sm
                  flex items-center justify-center gap-1.5 text-white"
              >
                <ChevronDown className="w-4 h-4" strokeWidth={3} />
                MENOS
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="flex-shrink-0 px-4 py-3 bg-white">
        {/* Name */}
        <div className="flex items-center justify-center gap-2 mb-2.5">
          <h3 className="text-sm sm:text-lg font-fun font-bold text-[var(--color-ink)] leading-tight line-clamp-1">
            {president.name}
          </h3>
        </div>

        {/* Info pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-1">
          <div className="info-pill rounded-full px-2.5 py-1 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-violet-500" />
            <span className="text-[10px] sm:text-xs text-slate-600 font-semibold">
              {president.termStart} — {president.termEnd}
            </span>
          </div>
          <div className="info-pill rounded-full px-2.5 py-1 flex items-center gap-1.5">
            <Vote className="w-3 h-3 text-pink-500" />
            <span className="text-[10px] sm:text-xs text-slate-600 font-semibold">
              Elección {president.electionYear}
            </span>
          </div>
        </div>

        {/* Vote count display */}
        {showVotes && (
          <div className="mt-2 pt-2.5 border-t border-slate-100 animate-slide-up">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <p
                className={`text-lg sm:text-2xl font-fun font-bold tracking-tight ${
                  isWinner === true ? 'text-emerald-500' : isWinner === false ? 'text-slate-400' : 'text-[var(--color-ink)]'
                }`}
              >
                {formatVotes(president.votes)}
              </p>
            </div>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest text-center font-bold">
              votos
            </p>
            <p className="text-[8px] sm:text-[9px] text-slate-400 mt-1.5 line-clamp-1 italic text-center">
              {president.source}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

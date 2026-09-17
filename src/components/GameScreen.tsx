import { useState, useCallback, useRef, useEffect } from 'react';
import type { President, GameMode, Answer } from '@/types';
import { getPresidentsForMode } from '@/data';
import { shufflePresidents, checkAnswer, getHigherPresident, formatVotes, voteDifference } from '@/utils/gameLogic';
import { saveBestStreak, loadBestStreak } from '@/utils/storage';
import { PresidentCard } from '@/components/PresidentCard';
import { ArrowLeft, Flame, Trophy, Check, X, ArrowRight } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';

interface GameScreenProps {
  mode: GameMode;
  onGameOver: (streak: number, bestStreak: number, completed: boolean, timeMs: number) => void;
  onExit: () => void;
}

type Phase = 'asking' | 'revealing' | 'transitioning' | 'finished';

const modeConfig: Record<GameMode, { flag: string; title: string }> = {
  paraguay: { flag: 'PY', title: 'Presidentes Paraguayos' },
  argentina: { flag: 'AR', title: 'Presidentes Argentinos' },
  global: { flag: 'GLOBAL', title: 'Presidentes del Mundo' },
};

export function GameScreen({ mode, onGameOver, onExit }: GameScreenProps) {
  const pool = getPresidentsForMode(mode);
  const shuffledRef = useRef<President[]>(shufflePresidents(pool));
  const total = shuffledRef.current.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [left, setLeft] = useState<President>(shuffledRef.current[0]);
  const [right, setRight] = useState<President>(shuffledRef.current[1]);
  const [incomingRight, setIncomingRight] = useState<President | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [streakPop, setStreakPop] = useState(false);
  const [phase, setPhase] = useState<Phase>('asking');
  const [isSliding, setIsSliding] = useState(false);
  const [bestStreak, setBestStreak] = useState(() => loadBestStreak());

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const streakRef = useRef(0);
  const currentIndexRef = useRef(0);
  const startTimeRef = useRef<number>(Date.now());

  const winner = revealed ? getHigherPresident(left, right) : null;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
  }, []);

  const isLastPair = currentIndex >= total - 2;

  const handleAnswer = useCallback(
    (answer: Answer) => {
      if (phase !== 'asking') return;

      const correct = checkAnswer(left, right, answer);
      setRevealed(true);
      setWasCorrect(correct);
      setPhase('revealing');

      if (correct) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        streakRef.current = newStreak;
        setStreakPop(true);
        addTimer(() => setStreakPop(false), 400);
      } else {
        setWrongFlash(true);
        addTimer(() => setWrongFlash(false), 600);
      }

      if (!correct) {
        addTimer(() => {
          saveBestStreak(streakRef.current);
          const best = Math.max(streakRef.current, loadBestStreak());
          setBestStreak(best);
          setPhase('finished');
          const elapsed = Date.now() - startTimeRef.current;
          addTimer(() => {
            onGameOver(streakRef.current, best, false, elapsed);
          }, 600);
        }, 1600);
      } else if (isLastPair) {
        addTimer(() => {
          saveBestStreak(streakRef.current);
          const best = Math.max(streakRef.current, loadBestStreak());
          setBestStreak(best);
          setPhase('finished');
          const elapsed = Date.now() - startTimeRef.current;
          addTimer(() => {
            onGameOver(streakRef.current, best, true, elapsed);
          }, 600);
        }, 1300);
      } else {
        addTimer(() => {
          startTransition();
        }, 1300);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, left, right, streak, addTimer, isLastPair]
  );

  const startTransition = useCallback(() => {
    setPhase('transitioning');

    const newIndex = currentIndexRef.current + 1;
    const newLeft = shuffledRef.current[newIndex];
    const newRight = shuffledRef.current[newIndex + 1];

    setIncomingRight(newRight);

    requestAnimationFrame(() => {
      setIsSliding(true);
    });

    addTimer(() => {
      currentIndexRef.current = newIndex;
      setCurrentIndex(newIndex);
      setLeft(newLeft);
      setRight(newRight);
      setIncomingRight(null);
      setRevealed(false);
      setWasCorrect(null);
      setPhase('asking');
      setIsSliding(false);
    }, 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTimer]);

  const cfg = modeConfig[mode];
  const diff = revealed ? voteDifference(left.votes, right.votes) : 0;

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100dvh',
        background: 'linear-gradient(180deg, #f8f9fc 0%, #eef0f8 100%)',
      }}
    >
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-5 py-3 bg-white border-b border-slate-200 card-shadow z-20">
        <button
          onClick={() => {
            clearTimers();
            onExit();
          }}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all active:scale-90"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>

        {/* Mode label with flag */}
        <div className="flex items-center gap-2.5">
          <FlagIcon code={cfg.flag} size={28} />
          <p className="text-xs sm:text-sm font-fun font-bold uppercase tracking-wide text-[var(--color-ink)]">
            {cfg.title}
          </p>
        </div>

        {/* Streak badge */}
        <div
          className={`streak-pill rounded-full px-3.5 py-1.5 flex items-center gap-1.5 ${
            streakPop ? 'animate-pop' : ''
          }`}
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-fun font-bold text-orange-600">{streak}</span>
        </div>
      </div>

      {/* Best streak mini display */}
      {streak > 0 && (
        <div className="flex-shrink-0 flex items-center justify-center gap-1.5 py-1 text-[11px] text-slate-400 font-semibold">
          <Trophy className="w-3 h-3 text-amber-500" />
          <span>Récord: {Math.max(streak, bestStreak)}</span>
        </div>
      )}

      {/* Card area — two halves filling the screen */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        {/* VS badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div
            className={`w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center card-shadow-lg animate-bounce-in transition-colors duration-300 ${
              wrongFlash ? 'border-rose-300' : 'border-violet-300'
            }`}
          >
            <span className={`text-[11px] font-fun font-bold tracking-wider transition-colors duration-300 ${
              wrongFlash ? 'text-rose-400' : 'text-violet-500'
            }`}>VS</span>
          </div>
        </div>

        {/* Vertical divider */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 pointer-events-none z-5"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, #e0e4f0 15%, #e0e4f0 85%, transparent 100%)',
          }}
        />

        {/* Carousel */}
        <div
          className="flex h-full"
          style={{
            transform: isSliding ? 'translateX(-33.333%)' : 'translateX(0)',
            transition: isSliding ? 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          }}
        >
          {/* Left card — reference */}
          <div className="w-1/2 flex-shrink-0 h-full p-1.5 sm:p-2.5">
            <div
              className={`h-full rounded-3xl overflow-hidden border-2 transition-all duration-500 card-shadow ${
                revealed && left.id === winner?.id
                  ? 'border-emerald-300'
                  : revealed && left.id !== winner?.id
                  ? 'border-slate-200 opacity-60'
                  : 'border-slate-200'
              }`}
            >
              <PresidentCard
                president={left}
                showVotes={true}
                showButtons={false}
                isWinner={revealed ? left.id === winner?.id : null}
              />
            </div>
          </div>

          {/* Right card — the question target */}
          <div className="w-1/2 flex-shrink-0 h-full p-1.5 sm:p-2.5">
            <div
              className={`h-full rounded-3xl overflow-hidden border-2 transition-all duration-500 card-shadow ${
                revealed && right.id === winner?.id
                  ? 'border-emerald-300'
                  : revealed && right.id !== winner?.id
                  ? 'border-slate-200 opacity-60'
                  : 'border-violet-300'
              }`}
            >
              <PresidentCard
                president={right}
                showVotes={revealed}
                showButtons={phase === 'asking'}
                isWinner={revealed ? right.id === winner?.id : null}
                onAnswer={handleAnswer}
              />
            </div>
          </div>

          {/* Incoming card during transition */}
          {isSliding && incomingRight && (
            <div className="w-1/2 flex-shrink-0 h-full p-1.5 sm:p-2.5">
              <div className="h-full rounded-3xl overflow-hidden border-2 border-violet-300 card-shadow">
                <PresidentCard
                  president={incomingRight}
                  showVotes={false}
                  showButtons={true}
                  isWinner={null}
                  onAnswer={handleAnswer}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback panel */}
      {revealed && wasCorrect !== null && (
        <div className="flex-shrink-0 px-3 sm:px-5 pb-4 pt-2 animate-slide-up">
          <div
            className={`rounded-2xl px-4 py-3 flex items-start gap-3 border-2 ${
              wasCorrect
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-rose-50 border-rose-300'
            }`}
          >
            {/* Small status icon */}
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 ${
                wasCorrect ? 'bg-emerald-400' : 'bg-rose-400 animate-shake'
              }`}
            >
              {wasCorrect ? (
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              ) : (
                <X className="w-5 h-5 text-white" strokeWidth={3} />
              )}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-fun font-bold ${
                  wasCorrect ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {wasCorrect ? '¡Correcto!' : '¡Incorrecto!'}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug font-semibold">
                <span className="font-bold text-[var(--color-ink)]">{winner?.name}</span> obtuvo{' '}
                <span className={`font-fun font-bold ${wasCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatVotes(diff)}
                </span>{' '}
                votos más que{' '}
                <span className="font-bold text-[var(--color-ink)]">
                  {winner?.id === left.id ? right.name : left.name}
                </span>
                <ArrowRight className="inline w-3 h-3 ml-0.5" />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

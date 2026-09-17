import { useState, useEffect, useRef } from 'react';
import { Flame, Trophy, RotateCcw, Share2, Home, Flag, ScrollText, Clock, ListOrdered, Loader2 } from 'lucide-react';
import { submitScore, formatTime } from '@/utils/leaderboard';
import type { GameMode, LeaderboardEntry } from '@/types';

interface GameOverProps {
  streak: number;
  bestStreak: number;
  completed: boolean;
  timeMs: number;
  playerName: string;
  mode: GameMode;
  modeTitle: string;
  onPlayAgain: () => void;
  onMenu: () => void;
  onViewLeaderboard: () => void;
}

const stroessnerImage = 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Alfredo_Stroessner_at_desk_%28cropped%29_%28cropped%29.jpg';

export function GameOver({ streak, bestStreak, completed, timeMs, playerName, mode, modeTitle, onPlayAgain, onMenu, onViewLeaderboard }: GameOverProps) {
  const [shared, setShared] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const submittedRef = useRef(false);
  const isNewRecord = streak >= bestStreak && streak > 0;

  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitState('loading');
    submitScore(playerName, mode, streak, completed, timeMs)
      .then(() => setSubmitState('done'))
      .catch(() => setSubmitState('error'));
  }, []);

  const shareText = `🏁 ${completed ? 'Completé el ciclo' : 'Llegué a una racha'} de ${streak} en ${modeTitle} en ${formatTime(timeMs)}. ¿Podés superarme?`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "¿Quién obtuvo más votos?",
          text: shareText,
        });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-10 animate-fade-in max-w-md mx-auto"
      style={{
        background: 'linear-gradient(180deg, #f8f9fc 0%, #eef0f8 50%, #e8ecf8 100%)',
      }}
    >
      {/* Result */}
      <div className="text-center mb-6 animate-scale-in mt-4">
        <div className={`mb-4 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${completed ? 'bg-emerald-100' : 'bg-violet-100'}`}>
          {completed ? (
            <Flag className="w-8 h-8 text-emerald-500" />
          ) : (
            <Flame className="w-8 h-8 text-violet-500" />
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-fun font-bold text-[var(--color-ink)] mb-1">
          {completed ? '¡Fin del juego!' : '¡Te equivocaste!'}
        </h2>
        <p className="text-slate-500 text-sm font-semibold mb-4">
          {completed ? `Completaste el ciclo de ${modeTitle}` : 'La partida terminó'}
        </p>

        {isNewRecord && (
          <div className="mb-3 streak-pill rounded-full px-4 py-1.5 inline-flex items-center gap-2 animate-wiggle">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-fun font-bold text-orange-600">¡NUEVO RÉCORD!</span>
          </div>
        )}

        <h2 className="text-sm font-fun font-bold text-slate-400 mb-1 uppercase tracking-widest">
          Racha final
        </h2>
        <p className="text-7xl font-fun font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">
          {streak}
        </p>
        <p className="text-slate-500 mt-2 text-sm font-semibold">
          respuestas correctas consecutivas
        </p>

        {/* Time display */}
        <div className="mt-3 inline-flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Tiempo: {formatTime(timeMs)}</span>
        </div>

        {/* Score submission status */}
        <div className="mt-2">
          {submitState === 'loading' && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Guardando en leaderboard...
            </span>
          )}
          {submitState === 'done' && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              ¡Puntaje guardado!
            </span>
          )}
          {submitState === 'error' && (
            <span className="text-xs text-rose-400 font-semibold">
              No se pudo guardar el puntaje
            </span>
          )}
        </div>
      </div>

      {/* Best streak */}
      <div className="w-full max-w-xs bg-white border-2 border-slate-200 card-shadow rounded-2xl p-4 mb-4 flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-semibold text-slate-600">Mejor racha</span>
        </div>
        <span className="text-lg font-fun font-bold text-amber-500">{bestStreak}</span>
      </div>

      {/* View leaderboard button */}
      <button
        onClick={onViewLeaderboard}
        className="w-full max-w-xs py-3 rounded-2xl font-fun font-semibold text-sm
          bg-white border-2 border-slate-200 card-shadow
          hover:border-violet-300 transition-all duration-150 active:scale-95
          flex items-center justify-center gap-2 text-slate-700 mb-3 animate-slide-up"
      >
        <ListOrdered className="w-4 h-4 text-violet-500" />
        VER LEADERBOARD
      </button>

      {/* Historical note card */}
      <div className="w-full max-w-xs bg-white border-2 border-slate-200 card-shadow rounded-2xl p-4 mb-4 animate-slide-up">
        <div className="flex items-center gap-2 mb-3">
          <ScrollText className="w-5 h-5 text-violet-500" />
          <h3 className="font-fun font-bold text-[var(--color-ink)] text-sm">
            Nota histórica
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">
          La transición democrática de Paraguay
        </p>

        <p className="text-xs text-slate-500 leading-relaxed mb-3">
          Tras la caída del régimen de Alfredo Stroessner en 1989, Paraguay inició un proceso de
          transición hacia un sistema democrático. En ese nuevo período comenzaron a desarrollarse
          elecciones presidenciales dentro del nuevo marco institucional y electoral del país.
        </p>

        <p className="text-xs text-slate-500 leading-relaxed mb-3">
          Desde las elecciones presidenciales de 1989 hasta la actualidad, Paraguay tuvo 8
          presidentes elegidos mediante elecciones presidenciales con voto popular que forman
          parte de este juego.
        </p>

        <p className="text-xs text-slate-500 leading-relaxed">
          La lista comienza con Andrés Rodríguez (1989) y llega hasta Santiago Peña (2023).
        </p>

        {/* Clarification about non-elected presidents */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 leading-relaxed italic">
            Nota: También hubo otros presidentes durante la era democrática, como Luis Ángel González
            Macchi y Federico Franco, que asumieron el cargo por sucesión y no mediante una elección
            presidencial, por lo que no forman parte de este juego.
          </p>
        </div>

        {/* Historical photo */}
        <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
          <img
            src={stroessnerImage}
            alt="Alfredo Stroessner"
            className="w-full h-40 object-cover object-top grayscale opacity-90"
            loading="lazy"
          />
          <div className="px-3 py-2.5 bg-slate-50 border-t border-slate-200">
            <p className="text-xs font-fun font-bold text-[var(--color-ink)]">
              Alfredo Stroessner
            </p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Presidente de Paraguay, 1954–1989
            </p>
            <p className="text-[9px] text-slate-400 mt-1 italic">
              Foto: Frank Scherschel / Store norske leksikon — Wikimedia Commons
            </p>
          </div>
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full max-w-xs py-3 rounded-2xl font-fun font-semibold text-sm
          bg-white border-2 border-slate-200 card-shadow
          hover:border-violet-300 transition-all duration-150 active:scale-95
          flex items-center justify-center gap-2 text-slate-700 mb-3 animate-slide-up"
      >
        <Share2 className="w-4 h-4 text-violet-500" />
        {shared ? '¡Copiado al portapapeles!' : 'COMPARTIR RESULTADO'}
      </button>

      {/* Play again */}
      <button
        onClick={onPlayAgain}
        className="w-full max-w-xs py-4 rounded-2xl font-fun font-bold text-base
          bg-gradient-to-r from-violet-500 to-violet-600
          hover:from-violet-400 hover:to-violet-500
          border-2 border-violet-400
          transition-all duration-150 active:scale-95 active:translate-y-0.5
          text-white mb-3 animate-slide-up
          flex items-center justify-center gap-2
          shadow-[0_4px_0_#7c3aed]"
      >
        <RotateCcw className="w-5 h-5" />
        JUGAR DE NUEVO
      </button>

      {/* Back to menu */}
      <button
        onClick={onMenu}
        className="text-slate-400 hover:text-violet-500 text-sm font-semibold transition-colors animate-fade-in flex items-center gap-1.5 mb-4"
      >
        <Home className="w-4 h-4" />
        Volver al menú
      </button>
    </div>
  );
}

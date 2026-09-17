import { useState } from 'react';
import { ArrowLeft, User, ChevronRight } from 'lucide-react';
import { FlagIcon } from '@/components/FlagIcon';

interface NameEntryProps {
  modeTitle: string;
  modeFlag: string;
  onStart: (name: string) => void;
  onBack: () => void;
}

export function NameEntry({ modeTitle, modeFlag, onStart, onBack }: NameEntryProps) {
  const [name, setName] = useState('');
  const trimmed = name.trim();

  const handleStart = () => {
    if (trimmed.length > 0) {
      onStart(trimmed);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10 animate-fade-in"
      style={{
        background: 'linear-gradient(180deg, #f8f9fc 0%, #eef0f8 50%, #e8ecf8 100%)',
      }}
    >
      <button
        onClick={onBack}
        className="absolute top-5 left-5 p-2.5 rounded-xl bg-white border-2 border-slate-200 card-shadow hover:border-violet-300 transition-all active:scale-90"
      >
        <ArrowLeft className="w-5 h-5 text-slate-600" />
      </button>

      <div className="text-center mb-8 max-w-sm">
        <div className="mb-4 flex items-center justify-center gap-2.5">
          <FlagIcon code={modeFlag} size={32} />
          <h2 className="text-lg font-fun font-bold text-[var(--color-ink)]">
            {modeTitle}
          </h2>
        </div>
        <div className="mb-6 w-16 h-16 mx-auto rounded-2xl bg-violet-100 flex items-center justify-center">
          <User className="w-8 h-8 text-violet-500" />
        </div>
        <h1 className="text-2xl font-fun font-bold text-[var(--color-ink)] mb-2">
          ¿Cómo te llamás?
        </h1>
        <p className="text-slate-500 text-sm font-semibold">
          Ingresá tu nombre para aparecer en el leaderboard
        </p>
      </div>

      <div className="w-full max-w-xs">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && trimmed.length > 0) handleStart();
          }}
          placeholder="Tu nombre..."
          autoFocus
          maxLength={20}
          className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-center font-fun font-semibold text-[var(--color-ink)] placeholder:text-slate-300 focus:border-violet-400 focus:outline-none transition-colors text-base"
        />

        <button
          onClick={handleStart}
          disabled={trimmed.length === 0}
          className={`w-full mt-4 py-4 rounded-2xl font-fun font-bold text-base transition-all duration-150 active:scale-95 active:translate-y-0.5 flex items-center justify-center gap-2 ${
            trimmed.length > 0
              ? 'bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 border-2 border-violet-400 text-white shadow-[0_4px_0_#7c3aed]'
              : 'bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          JUGAR
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

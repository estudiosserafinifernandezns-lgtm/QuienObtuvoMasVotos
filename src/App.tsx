import { useState } from 'react';
import type { Screen, GameMode } from '@/types';
import { MainMenu } from '@/components/MainMenu';
import { NameEntry } from '@/components/NameEntry';
import { GameScreen } from '@/components/GameScreen';
import { GameOver } from '@/components/GameOver';
import { Leaderboard } from '@/components/Leaderboard';

const modeTitles: Record<GameMode, string> = {
  paraguay: 'Presidentes Paraguayos',
  argentina: 'Presidentes Argentinos',
  global: 'Presidentes del Mundo',
};

const modeFlags: Record<GameMode, string> = {
  paraguay: 'PY',
  argentina: 'AR',
  global: 'GLOBAL',
};

function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [mode, setMode] = useState<GameMode>('paraguay');
  const [playerName, setPlayerName] = useState('');
  const [finalStreak, setFinalStreak] = useState(0);
  const [finalBest, setFinalBest] = useState(0);
  const [finalCompleted, setFinalCompleted] = useState(false);
  const [finalTimeMs, setFinalTimeMs] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const handleSelectMode = (selected: GameMode) => {
    setMode(selected);
    setScreen('nameentry');
  };

  const handleNameSet = (name: string) => {
    setPlayerName(name);
    setGameKey((k) => k + 1);
    setScreen('game');
  };

  const handleGameOver = (
    streak: number,
    best: number,
    didComplete: boolean,
    timeMs: number
  ) => {
    setFinalStreak(streak);
    setFinalBest(best);
    setFinalCompleted(didComplete);
    setFinalTimeMs(timeMs);
    setScreen('gameover');
  };

  const handlePlayAgain = () => {
    setGameKey((k) => k + 1);
    setScreen('game');
  };

  const handleMenu = () => {
    setScreen('menu');
  };

  const handleViewLeaderboard = () => {
    setScreen('leaderboard');
  };

  const handleBackToMenu = () => {
    setScreen('menu');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fc' }}>
      {screen === 'menu' && (
        <MainMenu
          onSelectMode={handleSelectMode}
          onViewLeaderboard={handleViewLeaderboard}
        />
      )}

      {screen === 'nameentry' && (
        <NameEntry
          modeTitle={modeTitles[mode]}
          modeFlag={modeFlags[mode]}
          onStart={handleNameSet}
          onBack={handleMenu}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          key={gameKey}
          mode={mode}
          onGameOver={handleGameOver}
          onExit={handleMenu}
        />
      )}

      {screen === 'gameover' && (
        <GameOver
          streak={finalStreak}
          bestStreak={finalBest}
          completed={finalCompleted}
          timeMs={finalTimeMs}
          playerName={playerName}
          mode={mode}
          modeTitle={modeTitles[mode]}
          onPlayAgain={handlePlayAgain}
          onMenu={handleMenu}
          onViewLeaderboard={handleViewLeaderboard}
        />
      )}

      {screen === 'leaderboard' && (
        <Leaderboard
          initialMode={mode}
          onBack={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;

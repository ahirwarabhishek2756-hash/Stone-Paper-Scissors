import { useState, type ReactNode } from 'react';
import type { GameId, MatchSetup, Screen } from '@/types';
import AnimeBackdrop from '@/components/AnimeBackdrop';
import WelcomeScreen from '@/screens/WelcomeScreen';
import GameSelectScreen from '@/screens/GameSelectScreen';
import PlayerSetupScreen from '@/screens/PlayerSetupScreen';
import RpsGameScreen from '@/screens/rps/RpsGameScreen';
import SnakesGameScreen from '@/screens/snakes/SnakesGameScreen';

export default function App() {
  const [screen, setScreen] = useState<Screen>({ kind: 'welcome' });
  const [session, setSession] = useState(0);
  const [turnOffset, setTurnOffset] = useState(0);

  const goHome = () => setScreen({ kind: 'welcome' });
  const goGames = () => setScreen({ kind: 'games' });
  const openSetup = (game: GameId) => setScreen({ kind: 'setup', game });
  const startMatch = (setup: MatchSetup) => {
    setTurnOffset(0);
    setSession((s) => s + 1);
    setScreen({ kind: 'match', setup });
  };
  const restart = () => setSession((s) => s + 1);
  const rematch = () => {
    setTurnOffset((o) => o + 1);
    setSession((s) => s + 1);
  };

  let content: ReactNode;
  switch (screen.kind) {
    case 'welcome':
      content = <WelcomeScreen onStart={goGames} />;
      break;
    case 'games':
      content = <GameSelectScreen onHome={goHome} onSelect={openSetup} />;
      break;
    case 'setup':
      content = (
        <PlayerSetupScreen
          game={screen.game}
          onHome={goHome}
          onBack={goGames}
          onStart={startMatch}
        />
      );
      break;
    case 'match':
      content =
        screen.setup.game === 'rps' ? (
          <RpsGameScreen
            setup={screen.setup}
            turnOffset={turnOffset}
            onHome={goHome}
            onMainMenu={goGames}
            onRestart={restart}
            onRematch={rematch}
          />
        ) : (
          <SnakesGameScreen
            setup={screen.setup}
            onHome={goHome}
            onMainMenu={goGames}
            onNewGame={restart}
          />
        );
      break;
  }

  return (
    <div className="relative min-h-screen">
      <AnimeBackdrop />
      <div key={`${screen.kind}-${session}`} className="screen-enter relative z-10 min-h-screen">
        {content}
      </div>
    </div>
  );
}

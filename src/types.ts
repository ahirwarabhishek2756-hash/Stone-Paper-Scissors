export type GameId = 'rps' | 'snakes';
export type PlayerMode = 'computer' | 2 | 3 | 4;
export type RpsFormat = 'classic' | 'best5';

export interface MatchSetup {
  game: GameId;
  mode: PlayerMode;
  names: string[];
  rpsFormat: RpsFormat;
}

export type Screen =
  | { kind: 'welcome' }
  | { kind: 'games' }
  | { kind: 'setup'; game: GameId }
  | { kind: 'match'; setup: MatchSetup };

export interface Participant {
  name: string;
  isComputer: boolean;
  color: string;
}

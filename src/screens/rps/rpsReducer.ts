import { outcomeFor, resolveRound, type Move, type Outcome } from '@/game/rps';

export const WIN_TARGET = 3;
export const ROUND_LIMIT = 5;

export type RpsPhase = 'handoff' | 'choose' | 'countdown' | 'reveal' | 'matchOver';

export interface RpsConfig {
  participantCount: number;
  order: number[];
  bestOf5: boolean;
}

export interface RoundRecord {
  moves: Move[];
  outcomes: Outcome[];
  winningMove: Move | null;
}

export interface RpsState {
  config: RpsConfig;
  phase: RpsPhase;
  round: number;
  wins: number[];
  draws: number;
  picks: (Move | null)[];
  turn: number;
  countdown: number;
  last: RoundRecord | null;
}

export type RpsAction =
  | { type: 'READY' }
  | { type: 'PICK'; move: Move; cpu?: { index: number; move: Move } }
  | { type: 'TICK' }
  | { type: 'NEXT_ROUND' }
  | { type: 'FINISH' };

function startPhase(config: RpsConfig): RpsPhase {
  return config.order.length > 1 ? 'handoff' : 'choose';
}

function emptyPicks(count: number): null[] {
  return Array.from({ length: count }, () => null);
}

export function createRpsState(config: RpsConfig): RpsState {
  return {
    config,
    phase: startPhase(config),
    round: 1,
    wins: Array.from({ length: config.participantCount }, () => 0),
    draws: 0,
    picks: emptyPicks(config.participantCount),
    turn: 0,
    countdown: 3,
    last: null,
  };
}

export function isMatchDecided(state: RpsState): boolean {
  if (!state.config.bestOf5) return false;
  return Math.max(...state.wins) >= WIN_TARGET || state.round >= ROUND_LIMIT;
}

export function getChampions(wins: number[]): number[] {
  const best = Math.max(...wins);
  return wins.flatMap((w, i) => (w === best ? [i] : []));
}

export function rpsReducer(state: RpsState, action: RpsAction): RpsState {
  switch (action.type) {
    case 'READY':
      return state.phase === 'handoff' ? { ...state, phase: 'choose' } : state;

    case 'PICK': {
      if (state.phase !== 'choose') return state;
      const picks = [...state.picks];
      picks[state.config.order[state.turn]] = action.move;
      if (action.cpu) picks[action.cpu.index] = action.cpu.move;
      const nextTurn = state.turn + 1;
      if (nextTurn < state.config.order.length) {
        return { ...state, picks, turn: nextTurn, phase: 'handoff' };
      }
      return { ...state, picks, turn: 0, phase: 'countdown', countdown: 3 };
    }

    case 'TICK': {
      if (state.phase !== 'countdown') return state;
      if (state.countdown > 1) return { ...state, countdown: state.countdown - 1 };
      const moves = state.picks.filter((m): m is Move => m !== null);
      const winningMove = resolveRound(moves);
      const outcomes = moves.map((m) => outcomeFor(m, winningMove));
      return {
        ...state,
        phase: 'reveal',
        wins: state.wins.map((w, i) => (outcomes[i] === 'win' ? w + 1 : w)),
        draws: state.draws + (winningMove === null ? 1 : 0),
        last: { moves, outcomes, winningMove },
      };
    }

    case 'NEXT_ROUND':
      if (state.phase !== 'reveal') return state;
      return {
        ...state,
        round: state.round + 1,
        picks: emptyPicks(state.config.participantCount),
        turn: 0,
        phase: startPhase(state.config),
        countdown: 3,
        last: null,
      };

    case 'FINISH':
      return state.phase === 'reveal' ? { ...state, phase: 'matchOver' } : state;
  }
}

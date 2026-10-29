export type Move = 'stone' | 'paper' | 'scissors';
export type Outcome = 'win' | 'lose' | 'draw';

export const MOVES: readonly Move[] = ['stone', 'paper', 'scissors'];

const BEATS: Record<Move, Move> = {
  stone: 'scissors',
  paper: 'stone',
  scissors: 'paper',
};

export const MOVE_LABEL: Record<Move, string> = {
  stone: 'Stone',
  paper: 'Paper',
  scissors: 'Scissors',
};

const WIN_TEXT: Record<Move, string> = {
  stone: 'Stone crushes Scissors',
  paper: 'Paper covers Stone',
  scissors: 'Scissors cut Paper',
};

export function resolveRound(moves: Move[]): Move | null {
  const unique = [...new Set(moves)];
  if (unique.length !== 2) return null;
  const [a, b] = unique;
  return BEATS[a] === b ? a : b;
}

export function outcomeFor(move: Move, winningMove: Move | null): Outcome {
  if (winningMove === null) return 'draw';
  return move === winningMove ? 'win' : 'lose';
}

export function describeWin(winningMove: Move): string {
  return WIN_TEXT[winningMove];
}

export function randomMove(): Move {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

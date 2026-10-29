export const BOARD_SIZE = 100;

export const SNAKES: Readonly<Record<number, number>> = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
};

export const LADDERS: Readonly<Record<number, number>> = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
};

export interface Jump {
  to: number;
  kind: 'snake' | 'ladder';
}

export function getJump(square: number): Jump | null {
  const snakeTo = SNAKES[square];
  if (snakeTo !== undefined) return { to: snakeTo, kind: 'snake' };
  const ladderTo = LADDERS[square];
  if (ladderTo !== undefined) return { to: ladderTo, kind: 'ladder' };
  return null;
}

export function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

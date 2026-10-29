import type { MatchSetup, Participant } from '@/types';

export const PLAYER_COLORS = ['#38bdf8', '#f472b6', '#fbbf24', '#a3e635'] as const;

const COMPUTER_NAME = 'Computer';
const SNAKES_BOTS = [
  { name: 'Nova Bot', color: '#c084fc' },
  { name: 'Blaze Bot', color: '#fb923c' },
];

export function buildParticipants(setup: MatchSetup): Participant[] {
  const humanCount = setup.mode === 'computer' ? 1 : setup.mode;
  const humans: Participant[] = Array.from({ length: humanCount }, (_, i) => ({
    name: setup.names[i] || `Player ${i + 1}`,
    isComputer: false,
    color: PLAYER_COLORS[i],
  }));

  if (setup.mode !== 'computer') return humans;

  if (setup.game === 'rps') {
    return [...humans, { name: COMPUTER_NAME, isComputer: true, color: '#94a3b8' }];
  }

  return [
    ...humans,
    ...SNAKES_BOTS.map((bot) => ({ name: bot.name, isComputer: true, color: bot.color })),
  ];
}

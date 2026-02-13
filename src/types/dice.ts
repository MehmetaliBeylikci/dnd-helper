// Dice Rolling Types

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export type RollType = 'normal' | 'advantage' | 'disadvantage';

export interface DiceRoll {
  id: string;
  diceType: DiceType;
  count: number;
  modifier: number;
  rollType: RollType;
  results: number[]; // Individual die results
  total: number;
  label?: string; // e.g., "STR Check", "Attack Roll"
  timestamp: number;
}

export interface RollRequest {
  diceType: DiceType;
  count?: number;
  modifier?: number;
  rollType?: RollType;
  label?: string;
}

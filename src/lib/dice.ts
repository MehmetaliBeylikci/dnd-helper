import type { DiceType, DiceRoll, RollType, RollRequest } from '../types/dice';

/**
 * Roll a single die with the specified number of sides
 */
export function rollSingleDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll multiple dice of the same type
 */
export function rollMultipleDice(sides: number, count: number): number[] {
  return Array.from({ length: count }, () => rollSingleDie(sides));
}

/**
 * Get the number of sides for a dice type
 */
export function getDiceSides(diceType: DiceType): number {
  const sidesMap: Record<DiceType, number> = {
    'd4': 4,
    'd6': 6,
    'd8': 8,
    'd10': 10,
    'd12': 12,
    'd20': 20,
    'd100': 100,
  };
  return sidesMap[diceType];
}

/**
 * Calculate ability modifier from ability score (D&D 5E formula)
 */
export function calculateModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

/**
 * Calculate proficiency bonus from character level (D&D 5E formula)
 */
export function calculateProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

/**
 * Roll dice with advantage (roll twice, take higher)
 */
export function rollWithAdvantage(sides: number): { rolls: number[]; result: number } {
  const roll1 = rollSingleDie(sides);
  const roll2 = rollSingleDie(sides);
  return {
    rolls: [roll1, roll2],
    result: Math.max(roll1, roll2),
  };
}

/**
 * Roll dice with disadvantage (roll twice, take lower)
 */
export function rollWithDisadvantage(sides: number): { rolls: number[]; result: number } {
  const roll1 = rollSingleDie(sides);
  const roll2 = rollSingleDie(sides);
  return {
    rolls: [roll1, roll2],
    result: Math.min(roll1, roll2),
  };
}

/**
 * Main dice rolling function
 */
export function performRoll(request: RollRequest): DiceRoll {
  const {
    diceType,
    count = 1,
    modifier = 0,
    rollType = 'normal',
    label,
  } = request;

  const sides = getDiceSides(diceType);
  let results: number[];
  let total: number;

  if (rollType === 'advantage') {
    const { rolls, result } = rollWithAdvantage(sides);
    results = rolls;
    total = result + modifier;
  } else if (rollType === 'disadvantage') {
    const { rolls, result } = rollWithDisadvantage(sides);
    results = rolls;
    total = result + modifier;
  } else {
    results = rollMultipleDice(sides, count);
    total = results.reduce((sum, val) => sum + val, 0) + modifier;
  }

  return {
    id: crypto.randomUUID(),
    diceType,
    count,
    modifier,
    rollType,
    results,
    total,
    label,
    timestamp: Date.now(),
  };
}

/**
 * Format dice roll for display (e.g., "2d20+5")
 */
export function formatDiceNotation(
  diceType: DiceType,
  count: number = 1,
  modifier: number = 0
): string {
  const countStr = count > 1 ? count.toString() : '';
  const modStr = modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier.toString()) : '';
  return `${countStr}${diceType}${modStr}`;
}

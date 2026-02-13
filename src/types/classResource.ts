/**
 * Class Resource Type Definitions
 * D&D 5E class-specific resources (Rage, Ki Points, Spell Slots, etc.)
 */

import type { DiceType } from './dice';

// Resource color coding for UI
export type ResourceColor = 'red' | 'blue' | 'green' | 'purple' | 'gold' | 'orange';

// When the resource resets
export type ResourceResetType = 'short-rest' | 'long-rest' | 'dawn' | 'never';

// Level-based scaling configuration
export interface LevelScaling {
  level: number;
  maxValue: number | 'charisma_mod' | 'wisdom_mod' | 'intelligence_mod' | 'charisma_mod_plus_one';
  dieType?: DiceType; // For resources that change die type with level
}

// Main class resource type
export interface ClassResource {
  id: string;
  name: string;
  resourceKey: string; // Unique identifier: "rage", "ki", "superiority_dice"
  current: number;
  max: number;
  resetOn: ResourceResetType;
  useCost?: number; // Cost per use (default: 1)
  dieType?: DiceType; // For Superiority Dice, Bardic Inspiration
  color?: ResourceColor;
  description?: string;
  levelScaling?: LevelScaling[];
  requiresSubclass?: string; // e.g., "Battle Master" for Superiority Dice
}

// Spell slot configuration (standard spellcasting)
export interface SpellSlotConfig {
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  current: number;
  max: number;
}

// Full spellcasting system
export interface SpellSlots {
  slots: SpellSlotConfig[];
  castingAbility: 'intelligence' | 'wisdom' | 'charisma';
  spellSaveDC?: number; // 8 + proficiency + ability mod
  spellAttackBonus?: number; // proficiency + ability mod
}

// Warlock Pact Magic (unique short-rest spell system)
export interface PactMagic {
  slotLevel: number; // 1-5
  current: number;
  max: number; // 1-4 slots
}

// Container for all character resources
export interface CharacterResources {
  classResources: ClassResource[];
  spellSlots?: SpellSlots;
  pactMagic?: PactMagic; // Warlock only
}

// Configuration for class resource initialization
export interface ClassResourceConfig {
  resources: Omit<ClassResource, 'id' | 'current' | 'max'>[];
  spellcasting?: boolean;
  spellcastingLevel?: number; // 1 = full caster, 2 = half caster
  spellcastingAbility?: 'intelligence' | 'wisdom' | 'charisma';
  pactMagic?: boolean; // Warlock
}

/**
 * Class Resource Definitions
 * D&D 5E class-specific resources and spell progression tables
 */

import type { ClassResourceConfig } from '../types/classResource';
import type { DndClass } from '../types/classDefaults';

// ============================================================================
// SPELL PROGRESSION TABLES
// ============================================================================

// Full Caster Spell Slot Progression (Bard, Cleric, Druid, Sorcerer, Wizard)
export const SPELL_SLOT_PROGRESSION: Record<number, number[]> = {
  1:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6:  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7:  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8:  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9:  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

// Half Caster Spell Slot Progression (Paladin, Ranger)
export const HALF_CASTER_SLOT_PROGRESSION: Record<number, number[]> = {
  1:  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  4:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  6:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  7:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  8:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  9:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
};

// Warlock Pact Magic Progression
export const WARLOCK_PACT_SLOTS: Record<number, { slots: number; level: number }> = {
  1:  { slots: 1, level: 1 },
  2:  { slots: 2, level: 1 },
  3:  { slots: 2, level: 2 },
  4:  { slots: 2, level: 2 },
  5:  { slots: 2, level: 3 },
  6:  { slots: 2, level: 3 },
  7:  { slots: 2, level: 4 },
  8:  { slots: 2, level: 4 },
  9:  { slots: 2, level: 5 },
  10: { slots: 2, level: 5 },
  11: { slots: 3, level: 5 },
  12: { slots: 3, level: 5 },
  13: { slots: 3, level: 5 },
  14: { slots: 3, level: 5 },
  15: { slots: 3, level: 5 },
  16: { slots: 3, level: 5 },
  17: { slots: 4, level: 5 },
  18: { slots: 4, level: 5 },
  19: { slots: 4, level: 5 },
  20: { slots: 4, level: 5 },
};

// ============================================================================
// CLASS RESOURCE DEFINITIONS
// ============================================================================

export const CLASS_RESOURCES: Record<DndClass, ClassResourceConfig> = {
  // ==========================================================================
  // BARBARIAN
  // ==========================================================================
  barbarian: {
    resources: [
      {
        resourceKey: 'rage',
        name: 'Rage',
        color: 'red',
        resetOn: 'long-rest',
        description: 'Enter a battle rage for extra damage and resistance',
        levelScaling: [
          { level: 1, maxValue: 2 },
          { level: 3, maxValue: 3 },
          { level: 6, maxValue: 4 },
          { level: 12, maxValue: 5 },
          { level: 17, maxValue: 6 },
          { level: 20, maxValue: 999 }, // Unlimited at 20
        ],
      },
    ],
  },

  // ==========================================================================
  // BARD
  // ==========================================================================
  bard: {
    resources: [
      {
        resourceKey: 'bardic_inspiration',
        name: 'Bardic Inspiration',
        color: 'purple',
        resetOn: 'long-rest', // Becomes short rest at level 5 (Font of Inspiration)
        dieType: 'd6',
        description: 'Inspire allies with a bonus die they can add to checks, attacks, or saves',
        levelScaling: [
          { level: 1, maxValue: 'charisma_mod', dieType: 'd6' },
          { level: 5, maxValue: 'charisma_mod', dieType: 'd8' },
          { level: 10, maxValue: 'charisma_mod', dieType: 'd10' },
          { level: 15, maxValue: 'charisma_mod', dieType: 'd12' },
        ],
      },
    ],
    spellcasting: true,
    spellcastingLevel: 1,
    spellcastingAbility: 'charisma',
  },

  // ==========================================================================
  // CLERIC
  // ==========================================================================
  cleric: {
    resources: [
      {
        resourceKey: 'channel_divinity',
        name: 'Channel Divinity',
        color: 'gold',
        resetOn: 'short-rest',
        description: 'Channel divine energy (Turn Undead, domain features)',
        levelScaling: [
          { level: 2, maxValue: 1 },
          { level: 6, maxValue: 2 },
          { level: 18, maxValue: 3 },
        ],
      },
    ],
    spellcasting: true,
    spellcastingLevel: 1,
    spellcastingAbility: 'wisdom',
  },

  // ==========================================================================
  // DRUID
  // ==========================================================================
  druid: {
    resources: [
      {
        resourceKey: 'wild_shape',
        name: 'Wild Shape',
        color: 'green',
        resetOn: 'short-rest',
        description: 'Transform into a beast',
        levelScaling: [
          { level: 2, maxValue: 2 },
        ],
      },
    ],
    spellcasting: true,
    spellcastingLevel: 1,
    spellcastingAbility: 'wisdom',
  },

  // ==========================================================================
  // FIGHTER
  // ==========================================================================
  fighter: {
    resources: [
      {
        resourceKey: 'second_wind',
        name: 'Second Wind',
        color: 'green',
        resetOn: 'short-rest',
        description: 'Regain hit points as a bonus action',
        levelScaling: [{ level: 1, maxValue: 1 }],
      },
      {
        resourceKey: 'action_surge',
        name: 'Action Surge',
        color: 'orange',
        resetOn: 'short-rest',
        description: 'Take an additional action on your turn',
        levelScaling: [
          { level: 2, maxValue: 1 },
          { level: 17, maxValue: 2 },
        ],
      },
      {
        resourceKey: 'superiority_dice',
        name: 'Superiority Dice',
        color: 'gold',
        resetOn: 'short-rest',
        dieType: 'd8',
        requiresSubclass: 'Battle Master',
        description: 'Fuel combat maneuvers (Battle Master)',
        levelScaling: [
          { level: 3, maxValue: 4, dieType: 'd8' },
          { level: 7, maxValue: 5, dieType: 'd8' },
          { level: 10, maxValue: 5, dieType: 'd10' },
          { level: 15, maxValue: 6, dieType: 'd10' },
          { level: 18, maxValue: 6, dieType: 'd12' },
        ],
      },
    ],
  },

  // ==========================================================================
  // MONK
  // ==========================================================================
  monk: {
    resources: [
      {
        resourceKey: 'ki',
        name: 'Ki Points',
        color: 'blue',
        resetOn: 'short-rest',
        description: 'Mystical energy for martial arts techniques',
        levelScaling: [
          { level: 2, maxValue: 2 },
          { level: 3, maxValue: 3 },
          { level: 4, maxValue: 4 },
          { level: 5, maxValue: 5 },
          { level: 6, maxValue: 6 },
          { level: 7, maxValue: 7 },
          { level: 8, maxValue: 8 },
          { level: 9, maxValue: 9 },
          { level: 10, maxValue: 10 },
          { level: 11, maxValue: 11 },
          { level: 12, maxValue: 12 },
          { level: 13, maxValue: 13 },
          { level: 14, maxValue: 14 },
          { level: 15, maxValue: 15 },
          { level: 16, maxValue: 16 },
          { level: 17, maxValue: 17 },
          { level: 18, maxValue: 18 },
          { level: 19, maxValue: 19 },
          { level: 20, maxValue: 20 },
        ],
      },
    ],
  },

  // ==========================================================================
  // PALADIN
  // ==========================================================================
  paladin: {
    resources: [
      {
        resourceKey: 'lay_on_hands',
        name: 'Lay on Hands',
        color: 'gold',
        resetOn: 'long-rest',
        description: 'Healing pool equal to Paladin level × 5',
        levelScaling: Array.from({ length: 20 }, (_, i) => ({
          level: i + 1,
          maxValue: (i + 1) * 5,
        })),
      },
      {
        resourceKey: 'divine_sense',
        name: 'Divine Sense',
        color: 'blue',
        resetOn: 'long-rest',
        description: 'Detect celestials, fiends, and undead',
        levelScaling: [{ level: 1, maxValue: 'charisma_mod_plus_one' }],
      },
      {
        resourceKey: 'channel_divinity',
        name: 'Channel Divinity',
        color: 'purple',
        resetOn: 'short-rest',
        description: 'Sacred Oath channel divinity options',
        levelScaling: [{ level: 3, maxValue: 1 }],
      },
    ],
    spellcasting: true,
    spellcastingLevel: 2, // Half caster
    spellcastingAbility: 'charisma',
  },

  // ==========================================================================
  // RANGER
  // ==========================================================================
  ranger: {
    resources: [],
    spellcasting: true,
    spellcastingLevel: 2, // Half caster
    spellcastingAbility: 'wisdom',
  },

  // ==========================================================================
  // ROGUE
  // ==========================================================================
  rogue: {
    resources: [],
  },

  // ==========================================================================
  // SORCERER
  // ==========================================================================
  sorcerer: {
    resources: [
      {
        resourceKey: 'sorcery_points',
        name: 'Sorcery Points',
        color: 'purple',
        resetOn: 'long-rest',
        description: 'Fuel Metamagic and create spell slots',
        levelScaling: Array.from({ length: 19 }, (_, i) => ({
          level: i + 2, // Starts at level 2
          maxValue: i + 2,
        })),
      },
    ],
    spellcasting: true,
    spellcastingLevel: 1,
    spellcastingAbility: 'charisma',
  },

  // ==========================================================================
  // WARLOCK
  // ==========================================================================
  warlock: {
    resources: [
      {
        resourceKey: 'mystic_arcanum_6',
        name: 'Mystic Arcanum (6th)',
        color: 'purple',
        resetOn: 'long-rest',
        description: '6th-level spell slot',
        levelScaling: [{ level: 11, maxValue: 1 }],
      },
      {
        resourceKey: 'mystic_arcanum_7',
        name: 'Mystic Arcanum (7th)',
        color: 'purple',
        resetOn: 'long-rest',
        description: '7th-level spell slot',
        levelScaling: [{ level: 13, maxValue: 1 }],
      },
      {
        resourceKey: 'mystic_arcanum_8',
        name: 'Mystic Arcanum (8th)',
        color: 'purple',
        resetOn: 'long-rest',
        description: '8th-level spell slot',
        levelScaling: [{ level: 15, maxValue: 1 }],
      },
      {
        resourceKey: 'mystic_arcanum_9',
        name: 'Mystic Arcanum (9th)',
        color: 'purple',
        resetOn: 'long-rest',
        description: '9th-level spell slot',
        levelScaling: [{ level: 17, maxValue: 1 }],
      },
    ],
    pactMagic: true,
    spellcastingAbility: 'charisma',
  },

  // ==========================================================================
  // WIZARD
  // ==========================================================================
  wizard: {
    resources: [
      {
        resourceKey: 'arcane_recovery',
        name: 'Arcane Recovery',
        color: 'blue',
        resetOn: 'long-rest',
        description: 'Recover spell slots during short rest',
        levelScaling: [{ level: 1, maxValue: 1 }],
      },
    ],
    spellcasting: true,
    spellcastingLevel: 1,
    spellcastingAbility: 'intelligence',
  },
};

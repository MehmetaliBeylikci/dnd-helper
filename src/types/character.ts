// D&D 5E Character Types

import type { CharacterResources } from './classResource';

export type AbilityType = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  subclass?: string; // Optional: selected at specific levels (usually 3)
  level: number;
  background?: string;
  alignment?: string;
  experiencePoints: number;
  
  // Core Stats
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  
  // Combat Stats
  hitPoints: {
    current: number;
    max: number;
    temp: number;
  };
  hitDice: {
    total: number;
    current: number;
    type: string; // e.g., "d10"
  };
  armorClass: number;
  initiative: number;
  speed: number;
  
  // Death Saves (when HP = 0)
  deathSaves: {
    successes: number; // 0-3
    failures: number;  // 0-3
  };
  
  // Status Conditions
  conditions: string[]; // e.g., ["poisoned", "prone", "blinded"]
  
  // Skills & Proficiencies
  skillProficiencies: string[];
  savingThrowProficiencies: AbilityType[];
  
  // Inventory & Equipment
  inventory: InventoryItem[];
  
  // Class Resources (Rage, Ki Points, Spell Slots, etc.)
  resources: CharacterResources;
  
  // Spells & Inventory (IDs)
  spellIds: string[];
  inventoryIds: string[];
  
  // Metadata
  createdAt: number;
  updatedAt: number;
}

export interface CharacterFormData {
  name: string;
  race: string;
  class: string;
  subclass?: string;
  level: number;
  background?: string;
  alignment?: string;
  abilityScores: AbilityScores;
}

// Inventory & Equipment
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  equipped: boolean;
  attuned: boolean;
  requiresAttunement: boolean;
  type: string; // weapon, armor, gear, magic, potion, scroll
  description?: string;
  properties?: string[];
  damage?: string;
  armorClass?: number;
}

// Character Actions (attacks, features, spells)
export interface CharacterAction {
  id: string;
  name: string;
  type: 'action' | 'bonus' | 'reaction';
  description: string;
  range?: string;
  toHit?: number;
  damage?: string;
  saveDC?: number;
  uses?: {
    current: number;
    max: number;
    resetOn: 'short-rest' | 'long-rest' | 'dawn';
  };
}


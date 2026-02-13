import type { Character } from '../types/character';

/**
 * Character Templates - Pre-configured characters based on D&D 5E classes
 */
export const CHARACTER_TEMPLATES = {
  fighter: {
    name: 'Fighter Template',
    race: 'Human',
    class: 'Fighter',
    subclass: 'Champion',
    level: 1,
    background: 'Soldier',
    alignment: 'Lawful Neutral',
    experiencePoints: 0,
    abilityScores: {
      strength: 16,      // Primary stat
      dexterity: 14,     // Secondary for AC
      constitution: 15,  // HP
      intelligence: 10,
      wisdom: 12,
      charisma: 8,
    },
    proficiencyBonus: 2,
    hitPoints: {
      current: 12,  // 10 (Fighter d10) + 2 (CON modifier)
      max: 12,
      temp: 0,
    },
    hitDice: {
      total: 1,
      current: 1,
      type: 'd10',
    },
    armorClass: 18,  // Chain mail (16) + 2 (DEX modifier)
    initiative: 2,   // DEX modifier
    speed: 30,
    deathSaves: {
      successes: 0,
      failures: 0,
    },
    conditions: [],
    skillProficiencies: ['Athletics', 'Intimidation'],
    savingThrowProficiencies: ['strength', 'constitution'] as const,
    inventory: [],
    spellIds: [],
    inventoryIds: [],
  },
  
  wizard: {
    name: 'Wizard Template',
    race: 'High Elf',
    class: 'Wizard',
    subclass: 'School of Evocation',
    level: 1,
    background: 'Sage',
    alignment: 'Neutral Good',
    experiencePoints: 0,
    abilityScores: {
      strength: 8,
      dexterity: 14,     // AC
      constitution: 13,  // HP
      intelligence: 16,  // Primary stat
      wisdom: 12,
      charisma: 10,
    },
    proficiencyBonus: 2,
    hitPoints: {
      current: 7,  // 6 (Wizard d6) + 1 (CON modifier)
      max: 7,
      temp: 0,
    },
    hitDice: {
      total: 1,
      current: 1,
      type: 'd6',
    },
    armorClass: 12,  // 10 + 2 (DEX modifier)
    initiative: 2,   // DEX modifier
    speed: 30,
    deathSaves: {
      successes: 0,
      failures: 0,
    },
    conditions: [],
    skillProficiencies: ['Arcana', 'History', 'Investigation'],
    savingThrowProficiencies: ['intelligence', 'wisdom'] as const,
    inventory: [],
    spellIds: [],
    inventoryIds: [],
  },
  
  rogue: {
    name: 'Rogue Template',
    race: 'Halfling',
    class: 'Rogue',
    subclass: 'Thief',
    level: 1,
    background: 'Criminal',
    alignment: 'Chaotic Neutral',
    experiencePoints: 0,
    abilityScores: {
      strength: 10,
      dexterity: 17,     // Primary stat
      constitution: 14,  // HP
      intelligence: 13,
      wisdom: 12,
      charisma: 10,
    },
    proficiencyBonus: 2,
    hitPoints: {
      current: 10,  // 8 (Rogue d8) + 2 (CON modifier)
      max: 10,
      temp: 0,
    },
    hitDice: {
      total: 1,
      current: 1,
      type: 'd8',
    },
    armorClass: 15,  // Leather armor (11) + 3 (DEX modifier) + 1 (Halfling nimbleness)
    initiative: 3,   // DEX modifier
    speed: 25,       // Halfling speed
    deathSaves: {
      successes: 0,
      failures: 0,
    },
    conditions: [],
    skillProficiencies: ['Stealth', 'Sleight of Hand', 'Deception', 'Acrobatics'],
    savingThrowProficiencies: ['dexterity', 'intelligence'] as const,
    inventory: [],
    spellIds: [],
    inventoryIds: [],
  },
  
  cleric: {
    name: 'Cleric Template',
    race: 'Dwarf',
    class: 'Cleric',
    subclass: 'Life Domain',
    level: 1,
    background: 'Acolyte',
    alignment: 'Lawful Good',
    experiencePoints: 0,
    abilityScores: {
      strength: 14,
      dexterity: 10,
      constitution: 15,  // HP
      intelligence: 10,
      wisdom: 16,        // Primary stat
      charisma: 12,
    },
    proficiencyBonus: 2,
    hitPoints: {
      current: 10,  // 8 (Cleric d8) + 2 (CON modifier)
      max: 10,
      temp: 0,
    },
    hitDice: {
      total: 1,
      current: 1,
      type: 'd8',
    },
    armorClass: 18,  // Chain mail (16) + shield (2)
    initiative: 0,   // DEX modifier
    speed: 25,       // Dwarf speed
    deathSaves: {
      successes: 0,
      failures: 0,
    },
    conditions: [],
    skillProficiencies: ['Medicine', 'Religion'],
    savingThrowProficiencies: ['wisdom', 'charisma'] as const,
    inventory: [],
    spellIds: [],
    inventoryIds: [],
  },
} as const;

export type CharacterTemplate = keyof typeof CHARACTER_TEMPLATES;

/**
 * Create a new character from a template
 * @param template - Template name (fighter, wizard, rogue, cleric)
 * @param customName - Optional custom name for the character
 * @returns Character object ready to use
 */
export function createCharacterFromTemplate(
  template: CharacterTemplate,
  customName?: string
): Omit<Character, 'id' | 'createdAt' | 'updatedAt'> {
  const templateData = CHARACTER_TEMPLATES[template];
  
  // Deep clone to avoid readonly type issues
  return {
    ...templateData,
    name: customName || templateData.name,
    skillProficiencies: [...templateData.skillProficiencies],
    savingThrowProficiencies: [...templateData.savingThrowProficiencies] as Array<keyof typeof templateData.abilityScores>,
    conditions: [...templateData.conditions],
    inventory: [...templateData.inventory],
    spellIds: [],
    inventoryIds: [],
  };
}


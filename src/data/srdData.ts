/**
 * D&D 5E SRD (System Reference Document) Data
 * Mock library for spells, items, and class features
 */

export interface SRDSpell {
  id: string;
  name: string;
  level: number;
  school: 'abjuration' | 'conjuration' | 'divination' | 'enchantment' | 'evocation' | 'illusion' | 'necromancy' | 'transmutation';
  castingTime: string;
  range: string;
  components: string[];
  duration: string;
  concentration: boolean;
  ritual: boolean;
  description: string;
  higherLevels?: string;
  classes: string[];
}

export interface SRDItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'gear' | 'magic' | 'potion' | 'scroll';
  rarity?: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary' | 'artifact';
  weight: number;
  cost?: string;
  requiresAttunement: boolean;
  description: string;
  properties?: string[];
  damage?: string;
  armorClass?: number;
  charges?: number;
}

export interface ClassFeature {
  id: string;
  name: string;
  className: string;
  level: number;
  description: string;
  actionType?: 'action' | 'bonus' | 'reaction';
  uses?: {
    type: 'per-rest' | 'per-day' | 'charges';
    count: number;
  };
}

export interface SRDClass {
  id: string;
  name: string;
  hitDie: number;
  primaryAbility: string[];
  savingThrows: string[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  skillChoices: number;
  skillOptions: string[];
  features: ClassFeature[];
}

// SPELLS DATABASE
export const SRD_SPELLS: SRDSpell[] = [
  {
    id: 'fireball',
    name: 'Fireball',
    level: 3,
    school: 'evocation',
    castingTime: '1 action',
    range: '150 feet',
    components: ['V', 'S', 'M'],
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.',
    higherLevels: 'When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'cure-wounds',
    name: 'Cure Wounds',
    level: 1,
    school: 'evocation',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    description: 'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.',
    higherLevels: 'When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.',
    classes: ['cleric', 'bard', 'druid', 'paladin', 'ranger']
  },
  {
    id: 'shield',
    name: 'Shield',
    level: 1,
    school: 'abjuration',
    castingTime: '1 reaction',
    range: 'Self',
    components: ['V', 'S'],
    duration: '1 round',
    concentration: false,
    ritual: false,
    description: 'An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'magic-missile',
    name: 'Magic Missile',
    level: 1,
    school: 'evocation',
    castingTime: '1 action',
    range: '120 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.',
    higherLevels: 'When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'healing-word',
    name: 'Healing Word',
    level: 1,
    school: 'evocation',
    castingTime: '1 bonus action',
    range: '60 feet',
    components: ['V'],
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    description: 'A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.',
    higherLevels: 'When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st.',
    classes: ['cleric', 'bard', 'druid']
  },
  {
    id: 'mage-armor',
    name: 'Mage Armor',
    level: 1,
    school: 'abjuration',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S', 'M'],
    duration: '8 hours',
    concentration: false,
    ritual: false,
    description: 'You touch a willing creature who isn\'t wearing armor, and a protective magical force surrounds it until the spell ends. The target\'s base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action.',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'bless',
    name: 'Bless',
    level: 1,
    school: 'enchantment',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V', 'S', 'M'],
    duration: '1 minute',
    concentration: true,
    ritual: false,
    description: 'You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.',
    higherLevels: 'When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.',
    classes: ['cleric', 'paladin']
  },
  {
    id: 'hex',
    name: 'Hex',
    level: 1,
    school: 'enchantment',
    castingTime: '1 bonus action',
    range: '90 feet',
    components: ['V', 'S', 'M'],
    duration: '1 hour',
    concentration: true,
    ritual: false,
    description: 'You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack. Also, choose one ability when you cast the spell. The target has disadvantage on ability checks made with the chosen ability.',
    higherLevels: 'When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours.',
    classes: ['warlock']
  }
];

// ITEMS DATABASE
export const SRD_ITEMS: SRDItem[] = [
  {
    id: 'longsword',
    name: 'Longsword',
    type: 'weapon',
    weight: 3,
    cost: '15 gp',
    requiresAttunement: false,
    description: 'Versatile (1d10)',
    properties: ['Versatile'],
    damage: '1d8 slashing'
  },
  {
    id: 'greatsword',
    name: 'Greatsword',
    type: 'weapon',
    weight: 6,
    cost: '50 gp',
    requiresAttunement: false,
    description: 'Heavy, Two-handed',
    properties: ['Heavy', 'Two-handed'],
    damage: '2d6 slashing'
  },
  {
    id: 'shortbow',
    name: 'Shortbow',
    type: 'weapon',
    weight: 2,
    cost: '25 gp',
    requiresAttunement: false,
    description: 'Ammunition (range 80/320), Two-handed',
    properties: ['Ammunition', 'Two-handed'],
    damage: '1d6 piercing'
  },
  {
    id: 'chain-mail',
    name: 'Chain Mail',
    type: 'armor',
    weight: 55,
    cost: '75 gp',
    requiresAttunement: false,
    description: 'Heavy armor. Stealth Disadvantage.',
    armorClass: 16
  },
  {
    id: 'leather-armor',
    name: 'Leather Armor',
    type: 'armor',
    weight: 10,
    cost: '10 gp',
    requiresAttunement: false,
    description: 'Light armor.',
    armorClass: 11
  },
  {
    id: 'potion-of-healing',
    name: 'Potion of Healing',
    type: 'potion',
    rarity: 'common',
    weight: 0.5,
    cost: '50 gp',
    requiresAttunement: false,
    description: 'You regain 2d4 + 2 hit points when you drink this potion. The potion\'s red liquid glimmers when agitated.'
  },
  {
    id: 'potion-greater-healing',
    name: 'Potion of Greater Healing',
    type: 'potion',
    rarity: 'uncommon',
    weight: 0.5,
    cost: '150 gp',
    requiresAttunement: false,
    description: 'You regain 4d4 + 4 hit points when you drink this potion.'
  },
  {
    id: 'bag-of-holding',
    name: 'Bag of Holding',
    type: 'magic',
    rarity: 'uncommon',
    weight: 15,
    requiresAttunement: false,
    description: 'This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet.'
  },
  {
    id: 'rope-hempen',
    name: 'Rope, Hempen (50 feet)',
    type: 'gear',
    weight: 10,
    cost: '1 gp',
    requiresAttunement: false,
    description: 'Rope has 2 hit points and can be burst with a DC 17 Strength check.'
  },
  {
    id: 'torch',
    name: 'Torch',
    type: 'gear',
    weight: 1,
    cost: '1 cp',
    requiresAttunement: false,
    description: 'A torch burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet.'
  },
  {
    id: 'ring-of-protection',
    name: 'Ring of Protection',
    type: 'magic',
    rarity: 'rare',
    weight: 0,
    requiresAttunement: true,
    description: 'You gain a +1 bonus to AC and saving throws while wearing this ring.'
  },
  {
    id: 'cloak-of-protection',
    name: 'Cloak of Protection',
    type: 'magic',
    rarity: 'uncommon',
    weight: 1,
    requiresAttunement: true,
    description: 'You gain a +1 bonus to AC and saving throws while you wear this cloak.'
  },
  {
    id: 'flame-tongue',
    name: 'Flame Tongue',
    type: 'magic',
    rarity: 'rare',
    weight: 3,
    requiresAttunement: true,
    description: 'You can use a bonus action to speak this magic sword\'s command word, causing flames to erupt from the blade. These flames shed bright light in a 40-foot radius and dim light for an additional 40 feet. While the sword is ablaze, it deals an extra 2d6 fire damage to any target it hits.',
    damage: '1d8 slashing + 2d6 fire'
  }
];

// CLASSES DATABASE
export const SRD_CLASSES: Record<string, SRDClass> = {
  fighter: {
    id: 'fighter',
    name: 'Fighter',
    hitDie: 10,
    primaryAbility: ['strength', 'dexterity'],
    savingThrows: ['strength', 'constitution'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: 2,
    skillOptions: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    features: [
      {
        id: 'second-wind',
        name: 'Second Wind',
        className: 'Fighter',
        level: 1,
        description: 'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.',
        actionType: 'bonus',
        uses: { type: 'per-rest', count: 1 }
      },
      {
        id: 'action-surge',
        name: 'Action Surge',
        className: 'Fighter',
        level: 2,
        description: 'You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before you can use it again.',
        actionType: 'action',
        uses: { type: 'per-rest', count: 1 }
      }
    ]
  },
  wizard: {
    id: 'wizard',
    name: 'Wizard',
    hitDie: 6,
    primaryAbility: ['intelligence'],
    savingThrows: ['intelligence', 'wisdom'],
    armorProficiencies: [],
    weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    skillChoices: 2,
    skillOptions: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    features: [
      {
        id: 'arcane-recovery',
        name: 'Arcane Recovery',
        className: 'Wizard',
        level: 1,
        description: 'You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.',
        uses: { type: 'per-day', count: 1 }
      }
    ]
  },
  cleric: {
    id: 'cleric',
    name: 'Cleric',
    hitDie: 8,
    primaryAbility: ['wisdom'],
    savingThrows: ['wisdom', 'charisma'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: 2,
    skillOptions: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    features: [
      {
        id: 'channel-divinity',
        name: 'Channel Divinity',
        className: 'Cleric',
        level: 2,
        description: 'You gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects. You start with two such effects: Turn Undead and an effect determined by your domain.',
        actionType: 'action',
        uses: { type: 'per-rest', count: 1 }
      }
    ]
  },
  rogue: {
    id: 'rogue',
    name: 'Rogue',
    hitDie: 8,
    primaryAbility: ['dexterity'],
    savingThrows: ['dexterity', 'intelligence'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    skillChoices: 4,
    skillOptions: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
    features: [
      {
        id: 'sneak-attack',
        name: 'Sneak Attack',
        className: 'Rogue',
        level: 1,
        description: 'You know how to strike subtly and exploit a foe\'s distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.',
        actionType: 'action'
      },
      {
        id: 'cunning-action',
        name: 'Cunning Action',
        className: 'Rogue',
        level: 2,
        description: 'Your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.',
        actionType: 'bonus'
      }
    ]
  }
};

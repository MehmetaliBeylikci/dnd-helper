// D&D 5E Class Defaults Type Definitions
import type { AbilityType } from './character';

export type DndClass = 
  | 'barbarian'
  | 'bard'
  | 'cleric'
  | 'druid'
  | 'fighter'
  | 'monk'
  | 'paladin'
  | 'ranger'
  | 'rogue'
  | 'sorcerer'
  | 'warlock'
  | 'wizard';

export interface SkillProficiencyChoice {
  choose: number;
  from: string[];
}

export interface ClassFeature {
  level: number;
  name: string;
  description: string;
}

export interface SubclassInfo {
  name: string;
  description: string;
  source: string; // "PHB", "SCAG", "DMG", "UA", etc.
}

export interface ClassDefaults {
  className: string;
  hitDie: number; // 6, 8, 10, or 12
  primaryAbility: AbilityType[];
  savingThrows: AbilityType[];
  skillProficiencies: SkillProficiencyChoice;
  armorProficiencies: string[];
  weaponProficiencies: string[];
  startingEquipment: string[];
  classFeatures: ClassFeature[];
  description: string;
  subclassLevel: number; // Level at which subclass is chosen
  availableSubclasses: SubclassInfo[];
}

export type ClassDefaultsData = Record<DndClass, ClassDefaults>;

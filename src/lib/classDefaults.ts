// Class Defaults Helper Library
import type { ClassDefaults, DndClass, ClassDefaultsData } from '../types/classDefaults';
import type { CharacterFormData, AbilityScores } from '../types/character';
import classDefaultsData from '../data/classDefaults.json';

// Type assertion for imported JSON
const CLASS_DEFAULTS = classDefaultsData as ClassDefaultsData;

/**
 * Get default values for a specific D&D class
 * @param className - The class name (lowercase)
 * @returns Class defaults or null if class not found
 */
export function getClassDefaults(className: string): ClassDefaults | null {
  const normalizedClass = className.toLowerCase() as DndClass;
  return CLASS_DEFAULTS[normalizedClass] || null;
}

/**
 * Get all available class names
 * @returns Array of all class names
 */
export function getAllClasses(): { value: DndClass; label: string }[] {
  return Object.keys(CLASS_DEFAULTS).map(key => ({
    value: key as DndClass,
    label: CLASS_DEFAULTS[key as DndClass].className
  }));
}

/**
 * Calculate starting hit points for a class at level 1
 * @param hitDie - The class's hit die (6, 8, 10, or 12)
 * @param constitutionModifier - The character's CON modifier
 * @returns Starting HP
 */
export function calculateStartingHP(hitDie: number, constitutionModifier: number): number {
  return hitDie + constitutionModifier;
}

/**
 * Calculate constitution modifier from ability score
 * @param constitution - Constitution ability score
 * @returns Constitution modifier
 */
export function getAbilityModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

/**
 * Generate suggested ability scores based on class primary abilities
 * This creates a starting point that emphasizes the class's strengths
 * @param classDefaults - The class defaults
 * @returns Suggested ability scores
 */
export function getSuggestedAbilityScores(classDefaults: ClassDefaults): AbilityScores {
  const baseScores: AbilityScores = {
    strength: 10,
    dexterity: 10,
    constitution: 12, // Everyone benefits from CON
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  };

  // Boost primary abilities
  classDefaults.primaryAbility.forEach(ability => {
    baseScores[ability] = 15;
  });

  // Boost saving throw abilities slightly
  classDefaults.savingThrows.forEach(ability => {
    if (baseScores[ability] < 13) {
      baseScores[ability] = 13;
    }
  });

  return baseScores;
}

/**
 * Apply class defaults to character form data
 * @param formData - Current form data
 * @param className - Selected class name
 * @returns Updated form data with class defaults applied
 */
export function applyClassDefaults(
  formData: CharacterFormData,
  className: string
): CharacterFormData {
  const classDefaults = getClassDefaults(className);
  
  if (!classDefaults) {
    return formData;
  }

  // Suggest ability scores if they're all at default (10)
  const allDefault = Object.values(formData.abilityScores).every(score => score === 10);
  const abilityScores = allDefault 
    ? getSuggestedAbilityScores(classDefaults)
    : formData.abilityScores;

  return {
    ...formData,
    class: classDefaults.className,
    abilityScores,
  };
}

/**
 * Get class description
 * @param className - The class name
 * @returns Class description or empty string
 */
export function getClassDescription(className: string): string {
  const classDefaults = getClassDefaults(className);
  return classDefaults?.description || '';
}

/**
 * Get hit die for a class
 * @param className - The class name
 * @returns Hit die value or 8 as default
 */
export function getClassHitDie(className: string): number {
  const classDefaults = getClassDefaults(className);
  return classDefaults?.hitDie || 8;
}

/**
 * Get subclass level requirement for a class
 * @param className - The class name
 * @returns Level at which subclass is chosen, or null if class not found
 */
export function getSubclassLevel(className: string): number | null {
  const classDefaults = getClassDefaults(className);
  return classDefaults?.subclassLevel ?? null;
}

/**
 * Check if a character should choose a subclass at their current level
 * @param className - The class name
 * @param level - Character level
 * @returns True if subclass selection should be shown
 */
export function shouldShowSubclassSelection(className: string, level: number): boolean {
  const subclassLevel = getSubclassLevel(className);
  return subclassLevel !== null && level >= subclassLevel;
}

/**
 * Get available subclasses for a class
 * @param className - The class name
 * @returns Array of available subclasses
 */
export function getAvailableSubclasses(className: string): import('../types/classDefaults').SubclassInfo[] {
  const classDefaults = getClassDefaults(className);
  return classDefaults?.availableSubclasses || [];
}

/**
 * Get subclass description
 * @param className - The class name
 * @param subclassName - The subclass name
 * @returns Subclass description or empty string
 */
export function getSubclassDescription(className: string, subclassName: string): string {
  const subclasses = getAvailableSubclasses(className);
  const subclass = subclasses.find(s => s.name === subclassName);
  return subclass?.description || '';
}


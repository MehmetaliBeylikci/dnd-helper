/**
 * Resource Utility Functions
 * Calculate and initialize character resources based on class, level, and abilities
 */

import type {
  ClassResource,
  CharacterResources,
  SpellSlots,
  PactMagic,
  LevelScaling,
} from '../types/classResource';
import type { AbilityScores } from '../types/character';
import type { DndClass } from '../types/classDefaults';
import {
  CLASS_RESOURCES,
  SPELL_SLOT_PROGRESSION,
  HALF_CASTER_SLOT_PROGRESSION,
  WARLOCK_PACT_SLOTS,
} from '../data/classResources';

// ============================================================================
// ABILITY MODIFIER CALCULATION
// ============================================================================

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

// ============================================================================
// RESOURCE MAX VALUE CALCULATION
// ============================================================================

/**
 * Calculate the max value of a resource at a given level
 */
export function getResourceMaxAtLevel(
  levelScaling: LevelScaling[],
  characterLevel: number,
  abilityScores?: AbilityScores
): number {
  // Find the appropriate scaling entry for this level
  const scaling = levelScaling
    .slice()
    .reverse()
    .find((s) => characterLevel >= s.level);

  if (!scaling) return 0;

  // Handle ability modifier-based max values
  if (typeof scaling.maxValue === 'string') {
    if (!abilityScores) return 0;

    switch (scaling.maxValue) {
      case 'charisma_mod':
        return Math.max(1, getAbilityModifier(abilityScores.charisma));
      case 'wisdom_mod':
        return Math.max(1, getAbilityModifier(abilityScores.wisdom));
      case 'intelligence_mod':
        return Math.max(1, getAbilityModifier(abilityScores.intelligence));
      case 'charisma_mod_plus_one':
        return Math.max(1, getAbilityModifier(abilityScores.charisma) + 1);
      default:
        return 0;
    }
  }

  return scaling.maxValue;
}

/**
 * Get the die type for a resource at a given level
 */
export function getResourceDieType(
  levelScaling: LevelScaling[],
  characterLevel: number
): import('../types/classResource').ClassResource['dieType'] {
  const scaling = levelScaling
    .slice()
    .reverse()
    .find((s) => characterLevel >= s.level);

  return scaling?.dieType;
}

// ============================================================================
// SPELL SLOT CALCULATION
// ============================================================================

/**
 * Get spell slots for a class at a given level
 */
export function getSpellSlotsForClass(
  className: DndClass,
  level: number,
  abilityScores: AbilityScores
): SpellSlots | undefined {
  const classConfig = CLASS_RESOURCES[className];

  if (!classConfig.spellcasting || !classConfig.spellcastingAbility) {
    return undefined;
  }

  const progression =
    classConfig.spellcastingLevel === 2
      ? HALF_CASTER_SLOT_PROGRESSION
      : SPELL_SLOT_PROGRESSION;

  const slotArray = progression[level];
  if (!slotArray) return undefined;

  const slots = slotArray
    .map((max, index) => ({
      level: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
      current: max,
      max,
    }))
    .filter((slot) => slot.max > 0);

  const castingAbility = classConfig.spellcastingAbility;
  const abilityMod = getAbilityModifier(abilityScores[castingAbility]);
  const profBonus = getProficiencyBonus(level);

  return {
    slots,
    castingAbility,
    spellSaveDC: 8 + profBonus + abilityMod,
    spellAttackBonus: profBonus + abilityMod,
  };
}

/**
 * Get Warlock pact magic at a given level
 */
export function getPactMagicForLevel(level: number): PactMagic | undefined {
  const pactData = WARLOCK_PACT_SLOTS[level];
  if (!pactData) return undefined;

  return {
    slotLevel: pactData.level,
    current: pactData.slots,
    max: pactData.slots,
  };
}

// ============================================================================
// RESOURCE INITIALIZATION
// ============================================================================

/**
 * Initialize all resources for a character
 */
export function initializeCharacterResources(
  className: DndClass,
  level: number,
  abilityScores: AbilityScores,
  subclass?: string
): CharacterResources {
  const classConfig = CLASS_RESOURCES[className];

  // Initialize class resources
  const classResources: ClassResource[] = classConfig.resources
    .filter((resourceConfig) => {
      // Filter out subclass-specific resources if subclass doesn't match
      if (resourceConfig.requiresSubclass && resourceConfig.requiresSubclass !== subclass) {
        return false;
      }

      // Filter out resources that don't start at this level
      if (resourceConfig.levelScaling) {
        const firstLevel = resourceConfig.levelScaling[0]?.level || 1;
        return level >= firstLevel;
      }

      return true;
    })
    .map((resourceConfig) => {
      const maxValue = resourceConfig.levelScaling
        ? getResourceMaxAtLevel(resourceConfig.levelScaling, level, abilityScores)
        : 0;

      const dieType =
        resourceConfig.levelScaling && resourceConfig.dieType
          ? getResourceDieType(resourceConfig.levelScaling, level)
          : resourceConfig.dieType;

      return {
        id: `${className}_${resourceConfig.resourceKey}_${Date.now()}`,
        name: resourceConfig.name,
        resourceKey: resourceConfig.resourceKey,
        current: maxValue,
        max: maxValue,
        resetOn: resourceConfig.resetOn,
        useCost: resourceConfig.useCost,
        dieType,
        color: resourceConfig.color,
        description: resourceConfig.description,
        levelScaling: resourceConfig.levelScaling,
        requiresSubclass: resourceConfig.requiresSubclass,
      };
    });

  // Initialize spell slots
  const spellSlots = getSpellSlotsForClass(className, level, abilityScores);

  // Initialize pact magic (Warlock only)
  const pactMagic = classConfig.pactMagic ? getPactMagicForLevel(level) : undefined;

  return {
    classResources,
    spellSlots,
    pactMagic,
  };
}

/**
 * Recalculate resources when a character levels up
 */
export function recalculateResourcesForLevel(
  currentResources: CharacterResources,
  className: DndClass,
  newLevel: number,
  abilityScores: AbilityScores,
  subclass?: string
): CharacterResources {
  const classConfig = CLASS_RESOURCES[className];

  // Recalculate class resources
  const updatedClassResources = currentResources.classResources.map((resource) => {
    const resourceConfig = classConfig.resources.find(
      (r) => r.resourceKey === resource.resourceKey
    );

    if (!resourceConfig || !resourceConfig.levelScaling) {
      return resource;
    }

    const newMax = getResourceMaxAtLevel(
      resourceConfig.levelScaling,
      newLevel,
      abilityScores
    );

    const newDieType = getResourceDieType(resourceConfig.levelScaling, newLevel);

    // Increase current by the difference in max
    const maxDifference = newMax - resource.max;
    const newCurrent = Math.max(0, Math.min(newMax, resource.current + maxDifference));

    return {
      ...resource,
      current: newCurrent,
      max: newMax,
      dieType: newDieType || resource.dieType,
    };
  });

  // Add new resources that unlock at this level
  const newResources = classConfig.resources
    .filter((resourceConfig) => {
      // Check if this resource unlocks at the new level
      if (resourceConfig.requiresSubclass && resourceConfig.requiresSubclass !== subclass) {
        return false;
      }

      const firstLevel = resourceConfig.levelScaling?.[0]?.level || 1;
      const alreadyHas = currentResources.classResources.some(
        (r) => r.resourceKey === resourceConfig.resourceKey
      );

      return newLevel >= firstLevel && !alreadyHas;
    })
    .map((resourceConfig) => {
      const maxValue = resourceConfig.levelScaling
        ? getResourceMaxAtLevel(resourceConfig.levelScaling, newLevel, abilityScores)
        : 0;

      const dieType =
        resourceConfig.levelScaling && resourceConfig.dieType
          ? getResourceDieType(resourceConfig.levelScaling, newLevel)
          : resourceConfig.dieType;

      return {
        id: `${className}_${resourceConfig.resourceKey}_${Date.now()}`,
        name: resourceConfig.name,
        resourceKey: resourceConfig.resourceKey,
        current: maxValue,
        max: maxValue,
        resetOn: resourceConfig.resetOn,
        useCost: resourceConfig.useCost,
        dieType,
        color: resourceConfig.color,
        description: resourceConfig.description,
        levelScaling: resourceConfig.levelScaling,
        requiresSubclass: resourceConfig.requiresSubclass,
      };
    });

  // Recalculate spell slots
  const spellSlots = getSpellSlotsForClass(className, newLevel, abilityScores);

  // Recalculate pact magic
  const pactMagic = classConfig.pactMagic
    ? getPactMagicForLevel(newLevel)
    : currentResources.pactMagic;

  return {
    classResources: [...updatedClassResources, ...newResources],
    spellSlots,
    pactMagic,
  };
}

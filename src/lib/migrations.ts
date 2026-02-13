/**
 * Character Migrations
 * Handle schema updates for existing characters
 */

import type { Character } from '../types/character';
import type { DndClass } from '../types/classDefaults';
import { initializeCharacterResources } from './resourceUtils';

/**
 * Migrate character to current schema version
 * Adds missing fields with sensible defaults
 */
export function migrateCharacterToV2(character: Character): Character {
  // Check if character already has resources
  if (character.resources) {
    return character;
  }

  console.log(`Migrating character ${character.name} to v2 (adding resources)`);

  // Initialize resources for the character's class and level
  const resources = initializeCharacterResources(
    character.class.toLowerCase() as DndClass,
    character.level,
    character.abilityScores,
    character.subclass
  );

  return {
    ...character,
    resources,
  };
}

/**
 * Migrate an array of characters
 */
export function migrateCharacters(characters: Character[]): Character[] {
  return characters.map(migrateCharacterToV2);
}

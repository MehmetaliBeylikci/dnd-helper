/**
 * Library Service for D&D 5E SRD Data
 * Provides search and query functions for spells, items, and class data
 */

import { SRD_SPELLS, SRD_ITEMS, SRD_CLASSES, type SRDSpell, type SRDItem, type SRDClass } from '../data/srdData';

export class LibraryService {
  /**
   * Search spells by name with autocomplete
   */
  static searchSpells(query: string, limit: number = 10): SRDSpell[] {
    if (!query || query.trim().length === 0) {
      return SRD_SPELLS.slice(0, limit);
    }

    const lowerQuery = query.toLowerCase();
    return SRD_SPELLS
      .filter(spell => spell.name.toLowerCase().includes(lowerQuery))
      .slice(0, limit);
  }

  /**
   * Search items by name with autocomplete
   */
  static searchItems(query: string, limit: number = 10): SRDItem[] {
    if (!query || query.trim().length === 0) {
      return SRD_ITEMS.slice(0, limit);
    }

    const lowerQuery = query.toLowerCase();
    return SRD_ITEMS
      .filter(item => item.name.toLowerCase().includes(lowerQuery))
      .slice(0, limit);
  }

  /**
   * Get spell by ID
   */
  static getSpellById(id: string): SRDSpell | undefined {
    return SRD_SPELLS.find(spell => spell.id === id);
  }

  /**
   * Get item by ID
   */
  static getItemById(id: string): SRDItem | undefined {
    return SRD_ITEMS.find(item => item.id === id);
  }

  /**
   * Get class data by name
   */
  static getClassData(className: string): SRDClass | undefined {
    const normalizedName = className.toLowerCase();
    return SRD_CLASSES[normalizedName];
  }

  /**
   * Get all spells for a specific class
   */
  static getSpellsForClass(className: string): SRDSpell[] {
    const lowerClassName = className.toLowerCase();
    return SRD_SPELLS.filter(spell => spell.classes.includes(lowerClassName));
  }

  /**
   * Get spells by level
   */
  static getSpellsByLevel(level: number, className?: string): SRDSpell[] {
    let spells = SRD_SPELLS.filter(spell => spell.level === level);
    
    if (className) {
      const lowerClassName = className.toLowerCase();
      spells = spells.filter(spell => spell.classes.includes(lowerClassName));
    }
    
    return spells;
  }

  /**
   * Get items by type
   */
  static getItemsByType(type: SRDItem['type']): SRDItem[] {
    return SRD_ITEMS.filter(item => item.type === type);
  }

  /**
   * Get magic items that require attunement
   */
  static getAttunementItems(): SRDItem[] {
    return SRD_ITEMS.filter(item => item.requiresAttunement);
  }

  /**
   * Filter items by rarity
   */
  static getItemsByRarity(rarity: SRDItem['rarity']): SRDItem[] {
    return SRD_ITEMS.filter(item => item.rarity === rarity);
  }

  /**
   * Get all available classes
   */
  static getAllClasses(): SRDClass[] {
    return Object.values(SRD_CLASSES);
  }

  /**
   * Search across all data types
   */
  static globalSearch(query: string, limit: number = 5): {
    spells: SRDSpell[];
    items: SRDItem[];
  } {
    return {
      spells: this.searchSpells(query, limit),
      items: this.searchItems(query, limit)
    };
  }
}

export default LibraryService;

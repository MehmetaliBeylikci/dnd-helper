import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, InventoryItem } from '../types/character';
import { createCharacterFromTemplate, type CharacterTemplate } from '../lib/characterTemplates';
import { characterStorage } from '../lib/storage';
import { migrateCharacters } from '../lib/migrations';

interface CharacterStore {
  characters: Character[];
  selectedCharacterId: string | null;
  setCharacters: (characters: Character[]) => void;
  selectCharacter: (id: string | null) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  loadCharacterFromTemplate: (template: CharacterTemplate, customName?: string) => Promise<Character>;
  
  // Combat Actions
  updateHP: (characterId: string, newHP: number) => void;
  addTemporaryHP: (characterId: string, amount: number) => void;
  takeDamage: (characterId: string, damage: number) => void;
  healCharacter: (characterId: string, healing: number) => void;
  updateDeathSave: (characterId: string, type: 'success' | 'failure', value: number) => void;
  resetDeathSaves: (characterId: string) => void;
  addCondition: (characterId: string, condition: string) => void;
  removeCondition: (characterId: string, condition: string) => void;
  
  // Rest Actions
  shortRest: (characterId: string, hitDiceSpent: number) => void;
  longRest: (characterId: string) => void;
  
  // Inventory Actions
  addInventoryItem: (characterId: string, item: InventoryItem) => void;
  removeInventoryItem: (characterId: string, itemId: string) => void;
  toggleEquipped: (characterId: string, itemId: string) => void;
  toggleAttuned: (characterId: string, itemId: string) => void;
  
  // Helper Functions
  getTotalWeight: (characterId: string) => number;
  getCarryingCapacity: (characterId: string) => number;
  getAttunedItemCount: (characterId: string) => number;
  
  // Resource Actions
  useResource: (characterId: string, resourceKey: string, amount?: number) => void;
  restoreResource: (characterId: string, resourceKey: string, amount?: number) => void;
  setResourceValue: (characterId: string, resourceKey: string, value: number) => void;
  
  // Spell Slot Actions
  useSpellSlot: (characterId: string, slotLevel: number) => void;
  restoreSpellSlot: (characterId: string, slotLevel: number, amount?: number) => void;
  
  // Pact Magic Actions (Warlock)
  usePactSlot: (characterId: string) => void;
  restorePactSlots: (characterId: string) => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [],
      selectedCharacterId: null,

      setCharacters: (characters) => {
        // Apply migrations to existing characters
        const migratedCharacters = migrateCharacters(characters);
        set({ characters: migratedCharacters });
      },

      selectCharacter: (id) => {
        set({ selectedCharacterId: id });
      },

      addCharacter: (character) => {
        set((state) => ({
          characters: [character, ...state.characters],
        }));
      },

      updateCharacter: (id, updates) => {
        set((state) => ({
          characters: state.characters.map((char) =>
            char.id === id ? { ...char, ...updates, updatedAt: Date.now() } : char
          ),
        }));
      },

      deleteCharacter: (id) => {
        set((state) => ({
          characters: state.characters.filter((char) => char.id !== id),
          selectedCharacterId: state.selectedCharacterId === id ? null : state.selectedCharacterId,
        }));
      },

      /**
       * Load and create a character from a template
       * @param template - Template name (fighter, wizard, rogue, cleric)
       * @param customName - Optional custom name
       * @returns Created character
       */
      loadCharacterFromTemplate: async (template, customName) => {
        const templateData = createCharacterFromTemplate(template, customName);
        
        // Initialize resources for the character's class
        const { initializeCharacterResources } = await import('../lib/resourceUtils');
        const resources = initializeCharacterResources(
          templateData.class.toLowerCase() as any,
          templateData.level,
          templateData.abilityScores,
          templateData.subclass
        );
        
        // Create character in storage with resources
        const newCharacter = await characterStorage.create({
          ...templateData,
          resources
        });
        
        // Add to store
        get().addCharacter(newCharacter);
        
        // Auto-select the new character
        get().selectCharacter(newCharacter.id);
        
        return newCharacter;
      },

      // Combat Actions
      updateHP: (characterId, newHP) => {
        get().updateCharacter(characterId, {
          hitPoints: {
            ...get().characters.find(c => c.id === characterId)!.hitPoints,
            current: Math.max(0, Math.min(newHP, get().characters.find(c => c.id === characterId)!.hitPoints.max))
          }
        });
      },

      addTemporaryHP: (characterId, amount) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;
        
        get().updateCharacter(characterId, {
          hitPoints: {
            ...char.hitPoints,
            temp: Math.max(char.hitPoints.temp, amount) // Temp HP doesn't stack, take highest
          }
        });
      },

      takeDamage: (characterId, damage) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        let remainingDamage = damage;
        let newTempHP = char.hitPoints.temp;
        let newCurrentHP = char.hitPoints.current;

        // First, absorb damage with temp HP
        if (newTempHP > 0) {
          if (remainingDamage >= newTempHP) {
            remainingDamage -= newTempHP;
            newTempHP = 0;
          } else {
            newTempHP -= remainingDamage;
            remainingDamage = 0;
          }
        }

        // Then apply to current HP
        if (remainingDamage > 0) {
          newCurrentHP = Math.max(0, newCurrentHP - remainingDamage);
        }

        get().updateCharacter(characterId, {
          hitPoints: {
            ...char.hitPoints,
            current: newCurrentHP,
            temp: newTempHP
          }
        });
      },

      healCharacter: (characterId, healing) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        get().updateCharacter(characterId, {
          hitPoints: {
            ...char.hitPoints,
            current: Math.min(char.hitPoints.max, char.hitPoints.current + healing)
          }
        });
      },

      updateDeathSave: (characterId, type, value) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        const newDeathSaves = { ...char.deathSaves };
        if (type === 'success') {
          newDeathSaves.successes = Math.max(0, Math.min(3, value));
        } else {
          newDeathSaves.failures = Math.max(0, Math.min(3, value));
        }

        get().updateCharacter(characterId, { deathSaves: newDeathSaves });
      },

      resetDeathSaves: (characterId) => {
        get().updateCharacter(characterId, {
          deathSaves: { successes: 0, failures: 0 }
        });
      },

      addCondition: (characterId, condition) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char || char.conditions.includes(condition)) return;

        get().updateCharacter(characterId, {
          conditions: [...char.conditions, condition]
        });
      },

      removeCondition: (characterId, condition) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        get().updateCharacter(characterId, {
          conditions: char.conditions.filter(c => c !== condition)
        });
      },

      // Rest Actions
      shortRest: (characterId, hitDiceSpent) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        // Calculate healing from hit dice
        const dieType = parseInt(char.hitDice.type.substring(1)); // "d10" -> 10
        const healing = hitDiceSpent * Math.floor(dieType / 2 + 1); // Average roll

        // Restore short-rest resources
        const updatedResources = char.resources.classResources.map(resource => {
          if (resource.resetOn === 'short-rest') {
            return { ...resource, current: resource.max };
          }
          return resource;
        });

        // Warlock Pact Magic short rest'te yenilenir
        const updatedPactMagic = char.resources.pactMagic
          ? { ...char.resources.pactMagic, current: char.resources.pactMagic.max }
          : undefined;

        // Update HP, hit dice, and resources
        get().updateCharacter(characterId, {
          hitPoints: {
            ...char.hitPoints,
            current: Math.min(char.hitPoints.max, char.hitPoints.current + healing)
          },
          hitDice: {
            ...char.hitDice,
            current: Math.max(0, char.hitDice.current - hitDiceSpent)
          },
          resources: {
            ...char.resources,
            classResources: updatedResources,
            pactMagic: updatedPactMagic
          }
        });
      },

      longRest: (characterId) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        // Restore HP to max
        // Restore hit dice (half of total, minimum 1)
        const hitDiceRestored = Math.max(1, Math.floor(char.hitDice.total / 2));

        // Restore ALL class resources
        const updatedResources = char.resources.classResources.map(resource => ({
          ...resource,
          current: resource.max
        }));

        // Restore ALL spell slots
        const updatedSpellSlots = char.resources.spellSlots
          ? {
              ...char.resources.spellSlots,
              slots: char.resources.spellSlots.slots.map(slot => ({
                ...slot,
                current: slot.max
              }))
            }
          : undefined;

        // Restore Pact Magic
        const updatedPactMagic = char.resources.pactMagic
          ? { ...char.resources.pactMagic, current: char.resources.pactMagic.max }
          : undefined;

        get().updateCharacter(characterId, {
          hitPoints: {
            current: char.hitPoints.max,
            max: char.hitPoints.max,
            temp: 0 // Temp HP lost on long rest
          },
          hitDice: {
            ...char.hitDice,
            current: Math.min(char.hitDice.total, char.hitDice.current + hitDiceRestored)
          },
          deathSaves: { successes: 0, failures: 0 },
          resources: {
            classResources: updatedResources,
            spellSlots: updatedSpellSlots,
            pactMagic: updatedPactMagic
          }
        });
      },

      // Inventory Actions
      addInventoryItem: (characterId, item) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        get().updateCharacter(characterId, {
          inventory: [...char.inventory, item]
        });
      },

      removeInventoryItem: (characterId, itemId) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        get().updateCharacter(characterId, {
          inventory: char.inventory.filter(item => item.id !== itemId)
        });
      },

      toggleEquipped: (characterId, itemId) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        get().updateCharacter(characterId, {
          inventory: char.inventory.map(item =>
            item.id === itemId ? { ...item, equipped: !item.equipped } : item
          )
        });
      },

      toggleAttuned: (characterId, itemId) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        const item = char.inventory.find(i => i.id === itemId);
        if (!item) return;

        // Check attunement limit (max 3)
        const currentAttunedCount = char.inventory.filter(i => i.attuned).length;
        if (!item.attuned && currentAttunedCount >= 3) {
          console.warn('Cannot attune more than 3 items');
          return;
        }

        get().updateCharacter(characterId, {
          inventory: char.inventory.map(i =>
            i.id === itemId ? { ...i, attuned: !i.attuned } : i
          )
        });
      },

      // Helper Functions
      getTotalWeight: (characterId) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char || !char.inventory) return 0;

        return char.inventory.reduce((total, item) => total + (item.weight * item.quantity), 0);
      },

      getCarryingCapacity: (characterId) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return 0;

        // Carrying capacity = Strength score * 15
        return char.abilityScores.strength * 15;
      },

      getAttunedItemCount: (characterId) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char || !char.inventory) return 0;

        return char.inventory.filter(item => item.attuned).length;
      },

      // ====================================================================
      // RESOURCE ACTIONS
      // ====================================================================

      useResource: (characterId, resourceKey, amount = 1) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        const updatedResources = char.resources.classResources.map(resource => {
          if (resource.resourceKey === resourceKey) {
            return {
              ...resource,
              current: Math.max(0, resource.current - amount)
            };
          }
          return resource;
        });

        get().updateCharacter(characterId, {
          resources: {
            ...char.resources,
            classResources: updatedResources
          }
        });
      },

      restoreResource: (characterId, resourceKey, amount) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        const updatedResources = char.resources.classResources.map(resource => {
          if (resource.resourceKey === resourceKey) {
            const newCurrent = amount !== undefined
              ? Math.min(resource.max, resource.current + amount)
              : resource.max;
            return {
              ...resource,
              current: newCurrent
            };
          }
          return resource;
        });

        get().updateCharacter(characterId, {
          resources: {
            ...char.resources,
            classResources: updatedResources
          }
        });
      },

      setResourceValue: (characterId, resourceKey, value) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char) return;

        const updatedResources = char.resources.classResources.map(resource => {
          if (resource.resourceKey === resourceKey) {
            return {
              ...resource,
              current: Math.max(0, Math.min(resource.max, value))
            };
          }
          return resource;
        });

        get().updateCharacter(characterId, {
          resources: {
            ...char.resources,
            classResources: updatedResources
          }
        });
      },

      // ====================================================================
      // SPELL SLOT ACTIONS
      // ====================================================================

      useSpellSlot: (characterId, slotLevel) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char || !char.resources.spellSlots) return;

        const updatedSlots = char.resources.spellSlots.slots.map(slot => {
          if (slot.level === slotLevel && slot.current > 0) {
            return {
              ...slot,
              current: slot.current - 1
            };
          }
          return slot;
        });

        get().updateCharacter(characterId, {
          resources: {
            ...char.resources,
            spellSlots: {
              ...char.resources.spellSlots,
              slots: updatedSlots
            }
          }
        });
      },

      restoreSpellSlot: (characterId, slotLevel, amount = 1) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char || !char.resources.spellSlots) return;

        const updatedSlots = char.resources.spellSlots.slots.map(slot => {
          if (slot.level === slotLevel) {
            return {
              ...slot,
              current: Math.min(slot.max, slot.current + amount)
            };
          }
          return slot;
        });

        get().updateCharacter(characterId, {
          resources: {
            ...char.resources,
            spellSlots: {
              ...char.resources.spellSlots,
              slots: updatedSlots
            }
          }
        });
      },

      // ====================================================================
      // PACT MAGIC ACTIONS (Warlock)
      // ====================================================================

      usePactSlot: (characterId) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char || !char.resources.pactMagic) return;

        get().updateCharacter(characterId, {
          resources: {
            ...char.resources,
            pactMagic: {
              ...char.resources.pactMagic,
              current: Math.max(0, char.resources.pactMagic.current - 1)
            }
          }
        });
      },

      restorePactSlots: (characterId) => {
        const char = get().characters.find(c => c.id === characterId);
        if (!char || !char.resources.pactMagic) return;

        get().updateCharacter(characterId, {
          resources: {
            ...char.resources,
            pactMagic: {
              ...char.resources.pactMagic,
              current: char.resources.pactMagic.max
            }
          }
        });
      },
    }),
    {
      name: 'dnd-character-storage', // LocalStorage key
      partialize: (state) => ({
        // Only persist these fields
        selectedCharacterId: state.selectedCharacterId,
        // Note: characters are persisted separately in IndexedDB via characterStorage
      }),
    }
  )
);

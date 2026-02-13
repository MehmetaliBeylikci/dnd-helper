import localforage from 'localforage';
import type { Character } from '../types/character';
import type { Spell } from '../types/spell';
import type { InventoryItem } from '../types/inventory';

// Configure LocalForage instances
const characterStore = localforage.createInstance({
  name: 'dnd-helper',
  storeName: 'characters',
});

const spellStore = localforage.createInstance({
  name: 'dnd-helper',
  storeName: 'spells',
});

const inventoryStore = localforage.createInstance({
  name: 'dnd-helper',
  storeName: 'inventory',
});

// Character CRUD Operations
export const characterStorage = {
  async getAll(): Promise<Character[]> {
    const characters: Character[] = [];
    await characterStore.iterate<Character, void>((value) => {
      characters.push(value);
    });
    return characters.sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async getById(id: string): Promise<Character | null> {
    return characterStore.getItem<Character>(id);
  },

  async create(character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Promise<Character> {
    const newCharacter: Character = {
      ...character,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await characterStore.setItem(newCharacter.id, newCharacter);
    return newCharacter;
  },

  async update(id: string, updates: Partial<Character>): Promise<Character | null> {
    const existing = await characterStore.getItem<Character>(id);
    if (!existing) return null;

    const updated: Character = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: Date.now(),
    };
    await characterStore.setItem(id, updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    await characterStore.removeItem(id);
  },

  async clear(): Promise<void> {
    await characterStore.clear();
  },
};

// Spell CRUD Operations
export const spellStorage = {
  async getAll(): Promise<Spell[]> {
    const spells: Spell[] = [];
    await spellStore.iterate<Spell, void>((value) => {
      spells.push(value);
    });
    return spells.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  },

  async getById(id: string): Promise<Spell | null> {
    return spellStore.getItem<Spell>(id);
  },

  async getByIds(ids: string[]): Promise<Spell[]> {
    const spells = await Promise.all(
      ids.map(id => spellStore.getItem<Spell>(id))
    );
    return spells.filter((spell): spell is Spell => spell !== null);
  },

  async create(spell: Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>): Promise<Spell> {
    const newSpell: Spell = {
      ...spell,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await spellStore.setItem(newSpell.id, newSpell);
    return newSpell;
  },

  async update(id: string, updates: Partial<Spell>): Promise<Spell | null> {
    const existing = await spellStore.getItem<Spell>(id);
    if (!existing) return null;

    const updated: Spell = {
      ...existing,
      ...updates,
      id,
      updatedAt: Date.now(),
    };
    await spellStore.setItem(id, updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    await spellStore.removeItem(id);
  },

  async clear(): Promise<void> {
    await spellStore.clear();
  },
};

// Inventory CRUD Operations
export const inventoryStorage = {
  async getAll(): Promise<InventoryItem[]> {
    const items: InventoryItem[] = [];
    await inventoryStore.iterate<InventoryItem, void>((value) => {
      items.push(value);
    });
    return items.sort((a, b) => a.name.localeCompare(b.name));
  },

  async getById(id: string): Promise<InventoryItem | null> {
    return inventoryStore.getItem<InventoryItem>(id);
  },

  async getByIds(ids: string[]): Promise<InventoryItem[]> {
    const items = await Promise.all(
      ids.map(id => inventoryStore.getItem<InventoryItem>(id))
    );
    return items.filter((item): item is InventoryItem => item !== null);
  },

  async create(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const newItem: InventoryItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await inventoryStore.setItem(newItem.id, newItem);
    return newItem;
  },

  async update(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    const existing = await inventoryStore.getItem<InventoryItem>(id);
    if (!existing) return null;

    const updated: InventoryItem = {
      ...existing,
      ...updates,
      id,
      updatedAt: Date.now(),
    };
    await inventoryStore.setItem(id, updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    await inventoryStore.removeItem(id);
  },

  async clear(): Promise<void> {
    await inventoryStore.clear();
  },
};

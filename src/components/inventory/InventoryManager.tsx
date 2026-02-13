/**
 * Inventory Manager Component
 * Item management with weight tracking, attunement limits, and autocomplete search
 */

import React, { useState } from 'react';
import { Package, Plus, Trash2, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { useCharacterStore } from '../../store/characterStore';
import type { Character, InventoryItem } from '../../types/character';
import type { SRDItem } from '../../data/srdData';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import AutocompleteDropdown from '../ui/AutocompleteDropdown';

interface InventoryManagerProps {
  character: Character;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ character }) => {
  const {
    addInventoryItem,
    removeInventoryItem,
    toggleEquipped,
    toggleAttuned,
    getTotalWeight,
    getCarryingCapacity,
    getAttunedItemCount
  } = useCharacterStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [customQuantity, setCustomQuantity] = useState(1);

  // Safety: Provide default empty inventory if character doesn't have it
  const inventory = character.inventory || [];

  // Safety: Wrap store calls in defaults in case character data is incomplete
  let totalWeight = 0;
  let carryingCapacity = 150; // Default carrying capacity
  let attunedCount = 0;
  
  try {
    totalWeight = getTotalWeight(character.id);
    carryingCapacity = getCarryingCapacity(character.id);
    attunedCount = getAttunedItemCount(character.id);
  } catch (error) {
    // Use defaults if character data is incomplete
    console.warn('Character data incomplete, using defaults for inventory', error);
  }

  const weightPercentage = carryingCapacity >  0 ? (totalWeight / carryingCapacity) * 100 : 0;
  const isOverCapacity = totalWeight > carryingCapacity;

  const handleAddItem = (srdItem: SRDItem) => {
    const newItem: InventoryItem = {
      id: `${srdItem.id}-${Date.now()}`,
      name: srdItem.name,
      quantity: customQuantity,
      weight: srdItem.weight,
      equipped: false,
      attuned: false,
      requiresAttunement: srdItem.requiresAttunement,
      type: srdItem.type,
      description: srdItem.description,
      properties: srdItem.properties,
      damage: srdItem.damage,
      armorClass: srdItem.armorClass
    };

    addInventoryItem(character.id, newItem);
    setShowAddModal(false);
    setCustomQuantity(1);
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm('Remove this item from inventory?')) {
      removeInventoryItem(character.id, itemId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Weight & Attunement Status */}
      <Card glass className={isOverCapacity ? 'border-2 border-red-600' : ''}>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-parchment-600 dark:text-parchment-400">
                  Weight
                </span>
                <span className={`text-sm font-bold ${
                  isOverCapacity 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-parchment-900 dark:text-parchment-100'
                }`}>
                  {totalWeight.toFixed(1)} / {carryingCapacity} lbs
                </span>
              </div>
              <div className="h-2 bg-parchment-200 dark:bg-dark-border rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    isOverCapacity 
                      ? 'bg-red-600' 
                      : weightPercentage > 80 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(weightPercentage, 100)}%` }}
                />
              </div>
              {isOverCapacity && (
                <div className="flex items-center gap-1 mt-1 text-xs text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-3 h-3" />
                  Encumbered!
                </div>
              )}
            </div>

            {/* Attunement */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-parchment-600 dark:text-parchment-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Attuned
                </span>
                <span className={`text-sm font-bold ${
                  attunedCount >= 3 
                    ? 'text-yellow-600 dark:text-yellow-400' 
                    : 'text-parchment-900 dark:text-parchment-100'
                }`}>
                  {attunedCount} / 3
                </span>
              </div>
              <div className="h-2 bg-parchment-200 dark:bg-dark-border rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    attunedCount >= 3 ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${(attunedCount / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Item Button */}
      <button
        onClick={() => setShowAddModal(!showAddModal)}
        className="w-full px-4 py-3 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors flex items-center justify-center gap-2 font-semibold"
      >
        <Plus className="w-5 h-5" />
        Add Item
      </button>

      {/* Add Item Modal/Panel */}
      {showAddModal && (
        <Card glass className="border-2 border-forest-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Items</span>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-parchment-500 hover:text-parchment-700"
              >
                ✕
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AutocompleteDropdown
              dataSource="items"
              onSelect={(item) => handleAddItem(item as SRDItem)}
              placeholder="Search for an item..."
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-parchment-600 dark:text-parchment-400">
                Quantity:
              </label>
              <input
                type="number"
                min="1"
                value={customQuantity}
                onChange={(e) => setCustomQuantity(parseInt(e.target.value) || 1)}
                className="w-20 px-2 py-1 rounded border border-parchment-300 dark:border-dark-border bg-white dark:bg-dark-secondary"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory List */}
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory ({inventory.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-8 text-parchment-600 dark:text-parchment-400">
              No items in inventory
            </div>
          ) : (
            <div className="space-y-2">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-parchment-100 dark:bg-dark-hover rounded-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-parchment-900 dark:text-parchment-100">
                          {item.name}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-xs bg-parchment-200 dark:bg-dark-border px-2 py-0.5 rounded">
                            ×{item.quantity}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-parchment-600 dark:text-parchment-400 mt-1">
                        {item.type} • {item.weight * item.quantity} lbs
                        {item.damage && ` • ${item.damage}`}
                        {item.armorClass && ` • AC ${item.armorClass}`}
                      </div>
                      {item.description && (
                        <div className="text-xs text-parchment-500 dark:text-parchment-400 mt-1 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1">
                      {/* Equipped Toggle */}
                      <button
                        onClick={() => toggleEquipped(character.id, item.id)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          item.equipped
                            ? 'bg-green-600 text-white'
                            : 'bg-parchment-200 dark:bg-dark-border text-parchment-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-dark-secondary'
                        }`}
                        title="Toggle equipped"
                      >
                        {item.equipped ? <Check className="w-3 h-3" /> : 'E'}
                      </button>

                      {/* Attunement Toggle */}
                      {item.requiresAttunement && (
                        <button
                          onClick={() => toggleAttuned(character.id, item.id)}
                          disabled={!item.attuned && attunedCount >= 3}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            item.attuned
                              ? 'bg-purple-600 text-white'
                              : attunedCount >= 3
                                ? 'bg-parchment-200 dark:bg-dark-border text-parchment-400 cursor-not-allowed'
                                : 'bg-parchment-200 dark:bg-dark-border text-parchment-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-dark-secondary'
                          }`}
                          title={item.attuned ? 'Attuned' : attunedCount >= 3 ? 'Max attunement reached' : 'Attune'}
                        >
                          <Sparkles className="w-3 h-3" />
                        </button>
                      )}

                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;

/**
 * SpellSlotTracker Component
 * Manages spell slots and pact magic for spellcasting classes
 */

import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import type { Character } from '../../types/character';
import { useCharacterStore } from '../../store/characterStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface SpellSlotTrackerProps {
  character: Character;
  compact?: boolean;
}

export const SpellSlotTracker: React.FC<SpellSlotTrackerProps> = ({ 
  character, 
  compact = false 
}) => {
  const { useSpellSlot, restoreSpellSlot, usePactSlot, restorePactSlots } = useCharacterStore();

  const { spellSlots, pactMagic } = character.resources;

  // Don't render if character has no spellcasting
  if (!spellSlots && !pactMagic) {
    return null;
  }

  return (
    <Card glass>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Spell Slots
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Standard Spell Slots */}
        {spellSlots && spellSlots.slots.length > 0 && (
          <div className="space-y-3">
            {spellSlots.slots.map((slot) => {
              const percentage = slot.max > 0 ? (slot.current / slot.max) * 100 : 0;
              
              return (
                <div key={slot.level} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-parchment-700 dark:text-parchment-300">
                      Level {slot.level}
                    </span>
                    <span className="text-sm text-parchment-600 dark:text-parchment-400">
                      {slot.current} / {slot.max}
                    </span>
                  </div>

                  {compact ? (
                    // Compact view: just progress bar
                    <div className="h-2 bg-parchment-200 dark:bg-dark-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  ) : (
                    // Expanded view: clickable circles
                    <div className="flex gap-1">
                      {Array.from({ length: slot.max }).map((_, index) => {
                        const isUsed = index >= slot.current;
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              if (isUsed) {
                                restoreSpellSlot(character.id, slot.level, 1);
                              } else {
                                useSpellSlot(character.id, slot.level);
                              }
                            }}
                            className={`w-6 h-6 rounded-full border-2 transition-colors ${
                              isUsed
                                ? 'border-parchment-300 dark:border-dark-border bg-transparent hover:bg-parchment-100 dark:hover:bg-dark-secondary'
                                : 'border-indigo-500 bg-indigo-500 hover:bg-indigo-600'
                            }`}
                            title={isUsed ? 'Restore slot' : 'Use slot'}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Spell Save DC & Attack Bonus */}
            {spellSlots.spellSaveDC && (
              <div className="pt-2 border-t border-parchment-200 dark:border-dark-border">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-parchment-600 dark:text-parchment-400">Save DC:</span>
                    <span className="ml-1 font-semibold text-parchment-900 dark:text-parchment-100">
                      {spellSlots.spellSaveDC}
                    </span>
                  </div>
                  <div>
                    <span className="text-parchment-600 dark:text-parchment-400">Attack:</span>
                    <span className="ml-1 font-semibold text-parchment-900 dark:text-parchment-100">
                      +{spellSlots.spellAttackBonus}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Warlock Pact Magic */}
        {pactMagic && (
          <div className="space-y-2">
            {spellSlots && <div className="border-t border-parchment-200 dark:border-dark-border" />}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-semibold text-parchment-700 dark:text-parchment-300">
                  Pact Magic (Level {pactMagic.slotLevel})
                </span>
              </div>
              <span className="text-sm text-parchment-600 dark:text-parchment-400">
                {pactMagic.current} / {pactMagic.max}
              </span>
            </div>

            <div className="flex gap-1">
              {Array.from({ length: pactMagic.max }).map((_, index) => {
                const isUsed = index >= pactMagic.current;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (isUsed) {
                        restorePactSlots(character.id);
                      } else {
                        usePactSlot(character.id);
                      }
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      isUsed
                        ? 'border-parchment-300 dark:border-dark-border bg-transparent hover:bg-parchment-100 dark:hover:bg-dark-secondary'
                        : 'border-purple-500 bg-purple-500 hover:bg-purple-600'
                    }`}
                    title={isUsed ? 'Restore slot' : 'Use slot'}
                  />
                );
              })}
            </div>

            <p className="text-xs text-parchment-500 dark:text-parchment-400">
              Recharges on Short Rest
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpellSlotTracker;

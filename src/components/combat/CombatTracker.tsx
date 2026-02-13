/**
 * Combat Tracker Component
 * Displays HP, temporary HP, death saves, hit dice, and rest buttons
 */

import React, { useState } from 'react';
import { Heart, Shield, Skull, Sparkles } from 'lucide-react';
import { useCharacterStore } from '../../store/characterStore';
import type { Character } from '../../types/character';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface CombatTrackerProps {
  character: Character;
}

export const CombatTracker: React.FC<CombatTrackerProps> = ({ character }) => {
  const {
    updateHP,
    addTemporaryHP,
    takeDamage,
    healCharacter,
    updateDeathSave,
    resetDeathSaves,
    shortRest,
    longRest
  } = useCharacterStore();

  const [damageInput, setDamageInput] = useState('');
  const [healInput, setHealInput] = useState('');
  const [tempHPInput, setTempHPInput] = useState('');
  const [hitDiceToSpend, setHitDiceToSpend] = useState(1);

  // Safety: Provide defaults for new fields if character data doesn't have them yet
  const hitDice = character.hitDice || { total: 1, current: 1, type: 'd8' };
  const deathSaves = character.deathSaves || { successes: 0, failures: 0 };
  const conditions = character.conditions || [];

  const hpPercentage = (character.hitPoints.current / character.hitPoints.max) * 100;
  const isDying = character.hitPoints.current === 0;

  const handleDamage = () => {
    const amount = parseInt(damageInput);
    if (amount > 0) {
      takeDamage(character.id, amount);
      setDamageInput('');
    }
  };

  const handleHeal = () => {
    const amount = parseInt(healInput);
    if (amount > 0) {
      healCharacter(character.id, amount);
      setHealInput('');
      
      // If character was dying, reset death save s
      if (isDying) {
        resetDeathSaves(character.id);
      }
    }
  };

  const handleTempHP = () => {
    const amount = parseInt(tempHPInput);
    if (amount > 0) {
      addTemporaryHP(character.id, amount);
      setTempHPInput('');
    }
  };

  const handleShortRest = () => {
    if (hitDiceToSpend > 0 && hitDiceToSpend <= hitDice.current) {
      shortRest(character.id, hitDiceToSpend);
      setHitDiceToSpend(1);
    }
  };

  const handleLongRest = () => {
    longRest(character.id);
  };

  const handleDeathSaveClick = (type: 'success' | 'failure', index: number) => {
    const currentValue = type === 'success' 
      ? deathSaves.successes 
      : deathSaves.failures;
    
    // Toggle the checkbox
    const newValue = currentValue === index + 1 ? index : index + 1;
    updateDeathSave(character.id, type, newValue);
  };

  return (
    <div className="space-y-4">
      {/* HP Display Card */}
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400" />
            Hit Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* HP Numbers */}
          <div className="text-center">
            <div className="text-4xl font-bold text-parchment-900 dark:text-parchment-100">
              {character.hitPoints.current} / {character.hitPoints.max}
            </div>
            {character.hitPoints.temp > 0 && (
              <div className="text-sm text-forest-600 dark:text-forest-400 flex items-center justify-center gap-1 mt-1">
                <Shield className="w-4 h-4" />
                +{character.hitPoints.temp} temp HP
              </div>
            )}
          </div>

          {/* HP Progress Bar */}
          <div className="relative h-4 bg-parchment-200 dark:bg-dark-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-burgundy-500 to-red-600 transition-all duration-300"
              style={{ width: `${hpPercentage}%` }}
            />
            {character.hitPoints.temp > 0 && (
              <div 
                className="absolute top-0 h-full bg-forest-500/50"
                style={{ 
                  left: `${hpPercentage}%`,
                  width: `${Math.min((character.hitPoints.temp / character.hitPoints.max) * 100, 100 - hpPercentage)}%`
                }}
              />
            )}
          </div>

          {/* Damage/Heal Controls */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="number"
                min="0"
                value={damageInput}
                onChange={(e) => setDamageInput(e.target.value)}
                placeholder="Damage"
                className="w-full px-2 py-1 text-sm rounded border border-parchment-300 dark:border-dark-border bg-white dark:bg-dark-secondary"
              />
              <button
                onClick={handleDamage}
                className="w-full mt-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Take Damage
              </button>
            </div>
            <div>
              <input
                type="number"
                min="0"
                value={healInput}
                onChange={(e) => setHealInput(e.target.value)}
                placeholder="Heal"
                className="w-full px-2 py-1 text-sm rounded border border-parchment-300 dark:border-dark-border bg-white dark:bg-dark-secondary"
              />
              <button
                onClick={handleHeal}
                className="w-full mt-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Heal
              </button>
            </div>
            <div>
              <input
                type="number"
                min="0"
                value={tempHPInput}
                onChange={(e) => setTempHPInput(e.target.value)}
                placeholder="Temp"
                className="w-full px-2 py-1 text-sm rounded border border-parchment-300 dark:border-dark-border bg-white dark:bg-dark-secondary"
              />
              <button
                onClick={handleTempHP}
                className="w-full mt-1 px-2 py-1 text-xs bg-forest-600 text-white rounded hover:bg-forest-700 transition-colors"
              >
                Add Temp HP
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Death Saves (only show when dying) */}
      {isDying && (
        <Card glass className="border-2 border-red-600 dark:border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-red-700 dark:text-red-400">
              <Skull className="w-5 h-5" />
              Death Saves
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Successes */}
            <div>
              <div className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                Successes
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={`success-${index}`}
                    onClick={() => handleDeathSaveClick('success', index)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      deathSaves.successes > index
                        ? 'bg-green-600 border-green-600'
                        : 'border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Failures */}
            <div>
              <div className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                Failures
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={`failure-${index}`}
                    onClick={() => handleDeathSaveClick('failure', index)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      deathSaves.failures > index
                        ? 'bg-red-600 border-red-600'
                        : 'border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => resetDeathSaves(character.id)}
              className="w-full mt-2 px-3 py-2 text-sm bg-parchment-200 dark:bg-dark-border rounded hover:bg-parchment-300 dark:hover:bg-dark-hover transition-colors"
            >
              Reset Death Saves
            </button>
          </CardContent>
        </Card>
      )}

      {/* Hit Dice & Rest */}
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-gold-600 dark:text-gold-400" />
            Hit Dice & Rest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Hit Dice Display */}
          <div className="text-center">
            <div className="text-2xl font-bold text-parchment-900 dark:text-parchment-100">
              {hitDice.current} / {hitDice.total}
            </div>
            <div className="text-sm text-parchment-600 dark:text-parchment-400">
              {hitDice.type}
            </div>
          </div>

          {/* Short Rest */}
          <div className="p-3 bg-parchment-100 dark:bg-dark-hover rounded">
            <div className="text-sm font-semibold mb-2">Short Rest</div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-parchment-600 dark:text-parchment-400">
                Spend Hit Dice:
              </label>
              <input
                type="number"
                min="1"
                max={hitDice.current}
                value={hitDiceToSpend}
                onChange={(e) => setHitDiceToSpend(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 text-sm rounded border border-parchment-300 dark:border-dark-border bg-white dark:bg-dark-secondary"
              />
              <button
                onClick={handleShortRest}
                disabled={hitDice.current === 0}
                className="flex-1 px-3 py-2 text-sm bg-forest-600 text-white rounded hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Short Rest
              </button>
            </div>
          </div>

          {/* Long Rest */}
          <button
            onClick={handleLongRest}
            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-semibold"
          >
            💤 Long Rest
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CombatTracker;

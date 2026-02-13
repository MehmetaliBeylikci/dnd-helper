import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import type { CharacterFormData, AbilityScores } from '../../types/character';
import type { DndClass } from '../../types/classDefaults';
import { calculateProficiencyBonus } from '../../lib/dice';
import { characterStorage } from '../../lib/storage';
import { useCharacterStore } from '../../store/characterStore';
import { applyClassDefaults, getClassHitDie, calculateStartingHP, getAbilityModifier, shouldShowSubclassSelection } from '../../lib/classDefaults';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AbilityScoresGrid } from './AbilityScore';
import { ClassSelector } from './ClassSelector';
import { SubclassSelector } from './SubclassSelector';

interface CharacterCreatorProps {
  onClose: () => void;
}

const defaultAbilityScores: AbilityScores = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
};

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const addCharacter = useCharacterStore((state) => state.addCharacter);
  
  const [formData, setFormData] = useState<CharacterFormData>({
    name: '',
    race: '',
    class: '',
    subclass: '',
    level: 1,
    background: '',
    alignment: '',
    abilityScores: defaultAbilityScores,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClassChange = (className: DndClass) => {
    const updatedFormData = applyClassDefaults(formData, className);
    // Reset subclass when changing class
    setFormData({ ...updatedFormData, subclass: '' });
  };

  const handleLevelChange = (newLevel: number) => {
    setFormData(prev => {
      // If level is below subclass requirement, clear subclass
      if (prev.class && !shouldShowSubclassSelection(prev.class, newLevel)) {
        return { ...prev, level: newLevel, subclass: '' };
      }
      return { ...prev, level: newLevel };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Character name is required';
    }
    if (!formData.race.trim()) {
      newErrors.race = 'Race is required';
    }
    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    }
    if (formData.level < 1 || formData.level > 20) {
      newErrors.level = 'Level must be between 1 and 20';
    }
    if (shouldShowSubclassSelection(formData.class, formData.level) && !formData.subclass?.trim()) {
      newErrors.subclass = 'Subclass is required for this level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      const hitDie = getClassHitDie(formData.class);
      const conModifier = getAbilityModifier(formData.abilityScores.constitution);
      const startingHP = calculateStartingHP(hitDie, conModifier);
      
      const newCharacter = await characterStorage.create({
        ...formData,
        experiencePoints: 0,
        proficiencyBonus: calculateProficiencyBonus(formData.level),
        hitPoints: {
          current: startingHP,
          max: startingHP,
          temp: 0,
        },
        armorClass: 10 + getAbilityModifier(formData.abilityScores.dexterity),
        initiative: getAbilityModifier(formData.abilityScores.dexterity),
        speed: 30,
        skillProficiencies: [],
        savingThrowProficiencies: [],
        spellIds: [],
        inventoryIds: [],
      });

      addCharacter(newCharacter);
      onClose();
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="parchment-card w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg animate-slide-up">
        <div className="sticky top-0 bg-parchment-100 dark:bg-dark-surface border-b border-parchment-400 dark:border-dark-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-heading font-semibold text-parchment-900 dark:text-parchment-100">
            {t('character.create')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-parchment-200 dark:hover:bg-dark-border rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('character.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />
            
            <Input
              label={t('character.race')}
              value={formData.race}
              onChange={(e) => setFormData({ ...formData, race: e.target.value })}
              error={errors.race}
              placeholder="e.g., Human, Elf, Dwarf"
              required
            />
            
            <ClassSelector
              value={formData.class}
              onChange={handleClassChange}
              error={errors.class}
            />
            
            <Input
              label={t('character.level')}
              type="number"
              min="1"
              max="20"
              value={formData.level}
              onChange={(e) => handleLevelChange(parseInt(e.target.value) || 1)}
              error={errors.level}
              required
            />
            
            <Input
              label={t('character.background')}
              value={formData.background}
              onChange={(e) => setFormData({ ...formData, background: e.target.value })}
              placeholder="e.g., Soldier, Acolyte"
            />
            
            <Input
              label={t('character.alignment')}
              value={formData.alignment}
              onChange={(e) => setFormData({ ...formData, alignment: e.target.value })}
              placeholder="e.g., Lawful Good, Chaotic Neutral"
            />

            {/* Subclass Selection - Shown when level >= subclass level */}
            {formData.class && shouldShowSubclassSelection(formData.class, formData.level) && (
              <div className="md:col-span-2">
                <SubclassSelector
                  className={formData.class as DndClass}
                  value={formData.subclass || ''}
                  onChange={(subclass) => setFormData({ ...formData, subclass })}
                  error={errors.subclass}
                />
              </div>
            )}
          </div>

          {/* Ability Scores */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-parchment-900 dark:text-parchment-100 mb-4">
              {t('character.abilities')}
            </h3>
            <AbilityScoresGrid
              scores={formData.abilityScores}
              onScoresChange={(scores) => setFormData({ ...formData, abilityScores: scores })}
              editable
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-parchment-300 dark:border-dark-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

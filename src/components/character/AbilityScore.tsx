import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AbilityType, AbilityScores } from '../../types/character';
import { calculateModifier } from '../../lib/dice';
import { useDiceStore } from '../../store/diceStore';
import { cn } from '../../lib/utils';

interface AbilityScoreProps {
  ability: AbilityType;
  score: number;
  onScoreChange?: (newScore: number) => void;
  editable?: boolean;
}

export const AbilityScore: React.FC<AbilityScoreProps> = ({
  ability,
  score,
  onScoreChange,
  editable = false,
}) => {
  const { t } = useTranslation();
  const roll = useDiceStore((state) => state.roll);
  
  const modifier = calculateModifier(score);
  const modifierStr = modifier >= 0 ? `+${modifier}` : modifier.toString();

  const abilityShortName = t(`abilities.${ability.substring(0, 3)}`) as string;

  const handleRoll = () => {
    if (!editable) {
      roll({
        diceType: 'd20',
        modifier,
        label: `${t(`abilities.${ability}`)} ${t('dice.abilityCheck')}`,
      });
    }
  };

  const handleScoreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const clamped = Math.max(1, Math.min(30, value));
    onScoreChange?.(clamped);
  };

  return (
    <div
      onClick={handleRoll}
      className={cn(
        'flex flex-col items-center justify-center',
        'gap-2 p-3 sm:p-4',
        'rounded-lg parchment-card',
        'min-h-[120px]',
        !editable && 'cursor-pointer hover:ring-2 hover:ring-burgundy-400/50 transition-all',
        editable && 'cursor-default'
      )}
    >
      <div className="text-xs font-heading uppercase tracking-wider text-parchment-700 dark:text-parchment-300">
        {abilityShortName}
      </div>
      
      <div className="relative">
        {editable ? (
          <input
            type="number"
            min="1"
            max="30"
            value={score}
            onChange={handleScoreInput}
            onClick={(e) => e.stopPropagation()}
            className="w-16 h-16 text-center text-2xl font-bold rounded-full bg-parchment-200 dark:bg-dark-surface border-2 border-parchment-400 dark:border-dark-border text-parchment-900 dark:text-parchment-100 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-parchment-200 dark:bg-dark-surface border-2 border-parchment-400 dark:border-dark-border flex items-center justify-center">
            <span className="text-2xl font-bold text-parchment-900 dark:text-parchment-100">
              {score}
            </span>
          </div>
        )}
      </div>
      
      <div className={cn(
        'text-lg font-semibold',
        modifier >= 0 ? 'text-forest-600 dark:text-forest-400' : 'text-burgundy-600 dark:text-burgundy-400'
      )}>
        {modifierStr}
      </div>
      
      {!editable && (
        <div className="text-xs text-parchment-600 dark:text-parchment-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to roll
        </div>
      )}
    </div>
  );
};

interface AbilityScoresGridProps {
  scores: AbilityScores;
  onScoresChange?: (scores: AbilityScores) => void;
  editable?: boolean;
}

export const AbilityScoresGrid: React.FC<AbilityScoresGridProps> = ({
  scores,
  onScoresChange,
  editable = false,
}) => {
  const abilities: AbilityType[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

  const handleScoreChange = (ability: AbilityType, newScore: number) => {
    if (onScoresChange) {
      onScoresChange({ ...scores, [ability]: newScore });
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {abilities.map((ability) => (
        <AbilityScore
          key={ability}
          ability={ability}
          score={scores[ability]}
          onScoreChange={(newScore) => handleScoreChange(ability, newScore)}
          editable={editable}
        />
      ))}
    </div>
  );
};

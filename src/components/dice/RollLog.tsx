import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { useDiceStore } from '../../store/diceStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export const RollLog: React.FC = () => {
  const { t } = useTranslation();
  const { rolls, clearHistory, removeRoll } = useDiceStore();

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getRollTypeLabel = (rollType: string) => {
    if (rollType === 'advantage') return t('dice.rollWithAdvantage');
    if (rollType === 'disadvantage') return t('dice.rollWithDisadvantage');
    return t('dice.normalRoll');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('dice.rollHistory')}</CardTitle>
        {rolls.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-xs"
          >
            {t('dice.clearHistory')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-96">
        {rolls.length === 0 ? (
          <div className="text-center py-8 text-parchment-600 dark:text-parchment-400">
            <p className="font-body">{t('dice.noHistory')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rolls.map((roll) => (
              <div
                key={roll.id}
                className="group flex items-start justify-between gap-3 p-3 rounded-medieval bg-parchment-100 dark:bg-dark-surface border border-parchment-300 dark:border-dark-border animate-fade-in"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-semibold text-burgundy-700 dark:text-burgundy-400 text-lg">
                      {roll.total}
                    </span>
                    <span className="text-sm text-parchment-600 dark:text-parchment-400 font-mono">
                      {roll.count > 1 ? `${roll.count}` : ''}{roll.diceType}
                      {roll.modifier !== 0 && (roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier)}
                    </span>
                  </div>
                  
                  {roll.label && (
                    <p className="text-sm font-medium text-parchment-800 dark:text-parchment-200 mt-0.5">
                      {roll.label}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-parchment-500 dark:text-parchment-500">
                    <span>{formatTimestamp(roll.timestamp)}</span>
                    {roll.rollType !== 'normal' && (
                      <>
                        <span>•</span>
                        <span className="italic">{getRollTypeLabel(roll.rollType)}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-1 mt-1.5">
                    {roll.results.map((result, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded bg-parchment-300 dark:bg-dark-border text-parchment-900 dark:text-parchment-100"
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => removeRoll(roll.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-parchment-200 dark:hover:bg-dark-border rounded"
                  aria-label="Remove roll"
                >
                  <Trash2 className="w-4 h-4 text-parchment-600 dark:text-parchment-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDiceStore } from '../../store/diceStore';
import { DiceButton } from './DiceButton';
import type { DiceType } from '../../types/dice';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const diceTypes: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

export const DiceRoller: React.FC = () => {
  const { t } = useTranslation();
  const roll = useDiceStore((state) => state.roll);

  const handleRoll = (diceType: DiceType) => {
    roll({ diceType });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dice.roll')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
          {diceTypes.map((diceType) => (
            <DiceButton
              key={diceType}
              diceType={diceType}
              onClick={() => handleRoll(diceType)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

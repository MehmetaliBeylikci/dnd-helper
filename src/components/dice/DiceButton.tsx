import React from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { DiceType } from '../../types/dice';

interface DiceButtonProps {
  diceType: DiceType;
  onClick: () => void;
  disabled?: boolean;
}

const diceIcons: Record<DiceType, React.ReactNode> = {
  'd4': <Dice1 className="w-8 h-8" />,
  'd6': <Dice2 className="w-8 h-8" />,
  'd8': <Dice3 className="w-8 h-8" />,
  'd10': <Dice4 className="w-8 h-8" />,
  'd12': <Dice5 className="w-8 h-8" />,
  'd20': <Dice6 className="w-8 h-8" />,
  'd100': <span className="text-xl font-bold">%</span>,
};

export const DiceButton: React.FC<DiceButtonProps> = ({ diceType, onClick, disabled }) => {
  const [isRolling, setIsRolling] = React.useState(false);

  const handleClick = () => {
    if (disabled || isRolling) return;
    
    setIsRolling(true);
    onClick();
    
    setTimeout(() => setIsRolling(false), 500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isRolling}
      className={cn(
        'group relative flex flex-col items-center justify-center gap-2',
        'w-20 h-20 sm:w-24 sm:h-24',
        'parchment-card hover:shadow-parchment-lg',
        'rounded-md transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-burgundy-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isRolling && 'animate-dice-roll'
      )}
    >
      <div className="text-burgundy-600 dark:text-burgundy-400 group-hover:text-burgundy-700 dark:group-hover:text-burgundy-300 transition-colors">
        {diceIcons[diceType]}
      </div>
      <span className="font-heading text-sm font-semibold text-parchment-800 dark:text-parchment-200">
        {diceType.toUpperCase()}
      </span>
    </button>
  );
};

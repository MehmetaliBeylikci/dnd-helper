import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DndClass } from '../../types/classDefaults';
import { getAllClasses, getClassDescription } from '../../lib/classDefaults';

interface ClassSelectorProps {
  value: string;
  onChange: (className: DndClass) => void;
  error?: string;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({ value, onChange, error }) => {
  const { t } = useTranslation();
  const classes = getAllClasses();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-parchment-800 dark:text-parchment-200">
        {t('character.class')}
        <span className="text-red-600 ml-1">*</span>
      </label>
      
      <select
        value={value.toLowerCase()}
        onChange={(e) => onChange(e.target.value as DndClass)}
        className="w-full px-4 py-2 bg-parchment-50 dark:bg-dark-surface border border-parchment-300 dark:border-dark-border rounded-lg
                   text-parchment-900 dark:text-parchment-100 
                   focus:outline-none focus:ring-2 focus:ring-fantasy-600 dark:focus:ring-fantasy-500
                   transition-colors"
        required
      >
        <option value="">Select a class...</option>
        {classes.map(({ value: classValue, label }) => (
          <option key={classValue} value={classValue}>
            {label}
          </option>
        ))}
      </select>

      {value && (
        <p className="text-sm text-parchment-600 dark:text-parchment-400 italic mt-2">
          {getClassDescription(value)}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

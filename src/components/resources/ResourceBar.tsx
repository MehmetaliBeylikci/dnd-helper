/**
 * ResourceBar Component
 * Displays a single class resource with progress bar and use/restore controls
 */

import React, { useState } from 'react';
import { Plus, Minus, Moon, Bed } from 'lucide-react';
import type { ClassResource } from '../../types/classResource';

interface ResourceBarProps {
  resource: ClassResource;
  onUse: (amount?: number) => void;
  onRestore: (amount?: number) => void;
  onSetValue: (value: number) => void;
}

const RESOURCE_COLORS = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  gold: 'bg-yellow-500',
  orange: 'bg-orange-500',
};

const RESOURCE_TEXT_COLORS = {
  red: 'text-red-600 dark:text-red-400',
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400',
  gold: 'text-yellow-600 dark:text-yellow-400',
  orange: 'text-orange-600 dark:text-orange-400',
};

export const ResourceBar: React.FC<ResourceBarProps> = ({
  resource,
  onUse,
  onRestore,
  onSetValue,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(resource.current.toString());

  const percentage = resource.max > 0 ? (resource.current / resource.max) * 100 : 0;
  const isEmpty = resource.current === 0;
  const isFull = resource.current >= resource.max;

  const color = resource.color || 'blue';
  const barColor = RESOURCE_COLORS[color];
  const textColor = RESOURCE_TEXT_COLORS[color];

  const handleEdit = () => {
    setEditValue(resource.current.toString());
    setIsEditing(true);
  };

  const handleSave = () => {
    const newValue = parseInt(editValue);
    if (!isNaN(newValue)) {
      onSetValue(newValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div className="p-3 bg-parchment-100 dark:bg-dark-hover rounded-lg border border-parchment-200 dark:border-dark-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${textColor}`}>
            {resource.name}
          </span>
          {resource.dieType && (
            <span className="text-xs bg-parchment-200 dark:bg-dark-border px-2 py-0.5 rounded">
              {resource.dieType}
            </span>
          )}
        </div>

        {/* Reset indicator */}
        <div className="flex items-center gap-1 text-xs text-parchment-500 dark:text-parchment-400">
          {resource.resetOn === 'short-rest' && (
            <>
              <Moon className="w-3 h-3" />
              <span className="hidden sm:inline">Short</span>
            </>
          )}
          {resource.resetOn === 'long-rest' && (
            <>
              <Bed className="w-3 h-3" />
              <span className="hidden sm:inline">Long</span>
            </>
          )}
        </div>
      </div>

      {/* Current/Max Value */}
      <div className="flex items-center justify-between mb-2">
        {isEditing ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-20 px-2 py-1 text-sm rounded border border-parchment-300 dark:border-dark-border bg-white dark:bg-dark-secondary"
            autoFocus
            min="0"
            max={resource.max}
          />
        ) : (
          <button
            onClick={handleEdit}
            className={`text-lg font-bold ${textColor} hover:opacity-75 transition-opacity`}
          >
            {resource.current} / {resource.max}
          </button>
        )}

        {/* Use/Restore buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => onRestore(1)}
            disabled={isFull}
            className={`p-1.5 rounded transition-colors ${
              isFull
                ? 'bg-parchment-200 dark:bg-dark-border text-parchment-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            title="Restore 1"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onUse(1)}
            disabled={isEmpty}
            className={`p-1.5 rounded transition-colors ${
              isEmpty
                ? 'bg-parchment-200 dark:bg-dark-border text-parchment-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            title="Use 1"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-parchment-200 dark:bg-dark-border rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${barColor} ${
            isEmpty ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Description */}
      {resource.description && (
        <p className="text-xs text-parchment-500 dark:text-parchment-400 mt-2">
          {resource.description}
        </p>
      )}
    </div>
  );
};

export default ResourceBar;

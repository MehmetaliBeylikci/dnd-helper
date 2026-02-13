/**
 * Autocomplete Dropdown Component
 * Reusable search component for SRD data (spells, items)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import LibraryService from '../../services/libraryService';
import type { SRDSpell, SRDItem } from '../../data/srdData';

interface AutocompleteDropdownProps {
  dataSource: 'spells' | 'items';
  onSelect: (item: SRDSpell | SRDItem) => void;
  placeholder?: string;
  className?: string;
}

export const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  dataSource,
  onSelect,
  placeholder = 'Search...',
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(SRDSpell | SRDItem)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 0) {
        const searchResults = dataSource === 'spells'
          ? LibraryService.searchSpells(query, 10)
          : LibraryService.searchItems(query, 10);
        
        setResults(searchResults);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, dataSource]);

  const handleSelect = useCallback((item: SRDSpell | SRDItem) => {
    onSelect(item);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(0);
  }, [onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-parchment-500 dark:text-parchment-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-parchment-300 dark:border-dark-border bg-white dark:bg-dark-secondary text-parchment-900 dark:text-parchment-100 placeholder:text-parchment-400 focus:outline-none focus:ring-2 focus:ring-forest-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment-500 hover:text-parchment-700 dark:hover:text-parchment-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 max-h-64 overflow-y-auto bg-white dark:bg-dark-secondary border border-parchment-300 dark:border-dark-border rounded-lg shadow-lg">
          {results.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full px-4 py-3 text-left hover:bg-parchment-100 dark:hover:bg-dark-hover transition-colors ${
                index === selectedIndex ? 'bg-parchment-100 dark:bg-dark-hover' : ''
              }`}
            >
              <div className="font-semibold text-parchment-900 dark:text-parchment-100">
                {item.name}
              </div>
              <div className="text-sm text-parchment-600 dark:text-parchment-400">
                {dataSource === 'spells' ? (
                  <>
                    Level {(item as SRDSpell).level} {(item as SRDSpell).school}
                  </>
                ) : (
                  <>
                    {(item as SRDItem).type} • {(item as SRDItem).weight} lbs
                    {(item as SRDItem).rarity && ` • ${(item as SRDItem).rarity}`}
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 px-4 py-3 bg-white dark:bg-dark-secondary border border-parchment-300 dark:border-dark-border rounded-lg shadow-lg text-center text-parchment-600 dark:text-parchment-400">
          No results found
        </div>
      )}
    </div>
  );
};

export default AutocompleteDropdown;

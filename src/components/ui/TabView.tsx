/**
 * Tab View Component
 * Mobile-first tab navigation for Dashboard sections
 */


import React from 'react';
import { User, Sword, Package, Scroll } from 'lucide-react';
import { cn } from '../../lib/utils';

export type TabId = 'stats' | 'combat' | 'inventory' | 'spells';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: Tab[] = [
  { id: 'stats', label: 'Stats', icon: User },
  { id: 'combat', label: 'Combat', icon: Sword },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'spells', label: 'Spells', icon: Scroll },
];

interface TabViewProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  className?: string;
}

export const TabView: React.FC<TabViewProps> = ({ activeTab, onTabChange, className = '' }) => {
  return (
    <div className={cn(
      'border-b border-parchment-300/80 dark:border-dark-border',
      'bg-parchment-50/50 dark:bg-dark-surface/30',
      'rounded-t-lg overflow-hidden',
      className
    )}>
      <nav className="flex -mb-px">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2',
                'px-3 sm:px-4 py-3',
                'border-b-2 font-medium text-sm sm:text-base',
                'transition-all duration-200',
                isActive
                  ? 'border-burgundy-600 dark:border-burgundy-400 text-burgundy-700 dark:text-burgundy-300 bg-parchment-100/80 dark:bg-dark-surface/80'
                  : 'border-transparent text-parchment-600 dark:text-parchment-400 hover:text-parchment-900 dark:hover:text-parchment-100 hover:bg-parchment-100/50 dark:hover:bg-dark-surface/50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabView;

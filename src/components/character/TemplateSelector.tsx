import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swords, Wand2, User, Heart } from 'lucide-react';
import { useCharacterStore } from '../../store/characterStore';
import { CHARACTER_TEMPLATES, type CharacterTemplate } from '../../lib/characterTemplates';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

/**
 * Template Selector Component
 * Allows users to quickly create characters from pre-configured templates
 */
export const TemplateSelector: React.FC = () => {
  const { t } = useTranslation();
  const loadCharacterFromTemplate = useCharacterStore((state) => state.loadCharacterFromTemplate);
  const [isLoading, setIsLoading] = React.useState<CharacterTemplate | null>(null);

  const handleTemplateSelect = async (template: CharacterTemplate) => {
    setIsLoading(template);
    try {
      await loadCharacterFromTemplate(template);
    } catch (error) {
      console.error('Failed to load template:', error);
      alert('Failed to create character from template');
    } finally {
      setIsLoading(null);
    }
  };

  const templates = [
    {
      key: 'fighter' as CharacterTemplate,
      icon: Swords,
      title: 'Fighter',
      description: 'Master of arms, high HP and AC',
      color: 'burgundy',
      stats: CHARACTER_TEMPLATES.fighter,
    },
    {
      key: 'wizard' as CharacterTemplate,
      icon: Wand2,
      title: 'Wizard',
      description: 'Arcane spellcaster, high intelligence',
      color: 'forest',
      stats: CHARACTER_TEMPLATES.wizard,
    },
    {
      key: 'rogue' as CharacterTemplate,
      icon: User,
      title: 'Rogue',
      description: 'Stealthy expert, high dexterity',
      color: 'parchment',
      stats: CHARACTER_TEMPLATES.rogue,
    },
    {
      key: 'cleric' as CharacterTemplate,
      icon: Heart,
      title: 'Cleric',
      description: 'Divine healer, wisdom-based',
      color: 'forest',
      stats: CHARACTER_TEMPLATES.cleric,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Start Templates</CardTitle>
        <p className="text-sm text-parchment-600 dark:text-parchment-400 mt-1">
          Start with a pre-configured character template
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {templates.map((template) => {
            const Icon = template.icon;
            const isCurrentlyLoading = isLoading === template.key;
            
            return (
              <button
                key={template.key}
                onClick={() => handleTemplateSelect(template.key)}
                disabled={isCurrentlyLoading}
                className="group relative p-4 sm:p-5 rounded-lg parchment-card card-hover border border-parchment-300 dark:border-dark-border hover:border-burgundy-500 dark:hover:border-burgundy-400 hover:ring-2 hover:ring-burgundy-500/20 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-${template.color}-100 dark:bg-${template.color}-900/30 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${template.color}-600 dark:text-${template.color}-400`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg text-parchment-900 dark:text-parchment-100">
                      {template.title}
                    </h3>
                    <p className="text-sm text-parchment-600 dark:text-parchment-400 mt-1">
                      {template.description}
                    </p>
                    
                    {/* Quick Stats Preview */}
                    <div className="flex gap-3 mt-3 text-xs text-parchment-700 dark:text-parchment-300">
                      <span>HP: {template.stats.hitPoints.max}</span>
                      <span>AC: {template.stats.armorClass}</span>
                      <span>Lvl {template.stats.level}</span>
                    </div>
                  </div>
                </div>
                
                {isCurrentlyLoading && (
                  <div className="absolute inset-0 bg-parchment-100/80 dark:bg-dark-surface/80 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-parchment-100 dark:bg-dark-surface border border-parchment-300 dark:border-dark-border rounded text-xs text-parchment-700 dark:text-parchment-300">
          <p>💡 <strong>Tip:</strong> Templates provide optimized starting stats based on D&D 5E. You can customize them after creation.</p>
        </div>
      </CardContent>
    </Card>
  );
};

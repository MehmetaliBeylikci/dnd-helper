import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Swords, Wand2, User, Heart, Info } from 'lucide-react';

/**
 * Welcome/Landing component shown to new users
 * Explains the app and guides them to create their first character
 */
export const Welcome: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-parchment-900 dark:text-parchment-100 mb-4">
          D&D Helper
        </h1>
        <p className="text-xl text-parchment-600 dark:text-parchment-400 mb-2">
          Your Digital Companion for D&D 5th Edition
        </p>
        <p className="text-sm text-parchment-500 dark:text-parchment-500">
          Manage characters • Roll dice • Track spells & inventory
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card glass>
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-full bg-burgundy-100 dark:bg-burgundy-900/30 w-fit mx-auto mb-4">
              <Swords className="w-8 h-8 text-burgundy-600 dark:text-burgundy-400" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2 text-parchment-900 dark:text-parchment-100">
              Character Management
            </h3>
            <p className="text-sm text-parchment-600 dark:text-parchment-400">
              Create and manage multiple characters with full D&D 5E stats and abilities
            </p>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-full bg-forest-100 dark:bg-forest-900/30 w-fit mx-auto mb-4">
              <Wand2 className="w-8 h-8 text-forest-600 dark:text-forest-400" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2 text-parchment-900 dark:text-parchment-100">
              Dice Roller
            </h3>
            <p className="text-sm text-parchment-600 dark:text-parchment-400">
              Roll all dice types with advantage/disadvantage and automatic modifier calculations
            </p>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-full bg-parchment-200 dark:bg-dark-border w-fit mx-auto mb-4">
              <Heart className="w-8 h-8 text-parchment-700 dark:text-parchment-300" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2 text-parchment-900 dark:text-parchment-100">
              Track Everything
            </h3>
            <p className="text-sm text-parchment-600 dark:text-parchment-400">
              Monitor HP, spells, inventory, and more with an intuitive interface
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400" />
            <CardTitle>How to Get Started</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-parchment-700 dark:text-parchment-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-burgundy-100 dark:bg-burgundy-900/30 text-burgundy-600 dark:text-burgundy-400 font-bold text-sm">
                1
              </span>
              <span>
                <strong>Choose a template</strong> below for quick start (Fighter, Wizard, Rogue, Cleric)
                or create a custom character from scratch
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-burgundy-100 dark:bg-burgundy-900/30 text-burgundy-600 dark:text-burgundy-400 font-bold text-sm">
                2
              </span>
              <span>
                <strong>Customize your character</strong> with ability scores, skills, and equipment
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-burgundy-100 dark:bg-burgundy-900/30 text-burgundy-600 dark:text-burgundy-400 font-bold text-sm">
                3
              </span>
              <span>
                <strong>Start your adventure!</strong> Use the dashboard to roll dice, track stats, and manage your character
              </span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Pro Tip */}
      <div className="p-4 bg-forest-50 dark:bg-forest-900/20 border border-forest-300 dark:border-forest-800 rounded-lg">
        <p className="text-sm text-forest-800 dark:text-forest-300">
          💡 <strong>Pro Tip:</strong> All your character data is saved locally in your browser. 
          You can create multiple characters and switch between them anytime!
        </p>
      </div>
    </div>
  );
};

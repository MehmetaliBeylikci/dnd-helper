import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sword, Shield, Heart, Zap } from 'lucide-react';
import type { Character } from '../../types/character';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { AbilityScoresGrid } from './AbilityScore';
import { PdfExport } from './PdfExport';

interface CharacterSheetProps {
  character: Character;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ character }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl mb-2">{character.name}</CardTitle>
              <p className="text-parchment-700 dark:text-parchment-300 font-body">
                Level {character.level} {character.race} {character.class}
              </p>
              {character.background && (
                <p className="text-sm text-parchment-600 dark:text-parchment-400">
                  {character.background}
                  {character.alignment && ` • ${character.alignment}`}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Combat Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-burgundy-100 dark:bg-burgundy-900/30">
                <Heart className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400" />
              </div>
              <div>
                <div className="text-xs text-parchment-600 dark:text-parchment-400 uppercase tracking-wider">
                  {t('character.hitPoints')}
                </div>
                <div className="text-2xl font-bold text-parchment-900 dark:text-parchment-100">
                  {character.hitPoints.current}/{character.hitPoints.max}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-forest-100 dark:bg-forest-900/30">
                <Shield className="w-5 h-5 text-forest-600 dark:text-forest-400" />
              </div>
              <div>
                <div className="text-xs text-parchment-600 dark:text-parchment-400 uppercase tracking-wider">
                  {t('character.armorClass')}
                </div>
                <div className="text-2xl font-bold text-parchment-900 dark:text-parchment-100">
                  {character.armorClass}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-parchment-200 dark:bg-dark-border">
                <Zap className="w-5 h-5 text-parchment-700 dark:text-parchment-300" />
              </div>
              <div>
                <div className="text-xs text-parchment-600 dark:text-parchment-400 uppercase tracking-wider">
                  {t('character.initiative')}
                </div>
                <div className="text-2xl font-bold text-parchment-900 dark:text-parchment-100">
                  {character.initiative >= 0 ? '+' : ''}{character.initiative}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-parchment-200 dark:bg-dark-border">
                <Sword className="w-5 h-5 text-parchment-700 dark:text-parchment-300" />
              </div>
              <div>
                <div className="text-xs text-parchment-600 dark:text-parchment-400 uppercase tracking-wider">
                  {t('character.speed')}
                </div>
                <div className="text-2xl font-bold text-parchment-900 dark:text-parchment-100">
                  {character.speed} ft
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ability Scores */}
      <Card>
        <CardHeader>
          <CardTitle>{t('character.abilities')}</CardTitle>
        </CardHeader>
        <CardContent>
          <AbilityScoresGrid scores={character.abilityScores} />
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-parchment-600 dark:text-parchment-400 mb-1">
              {t('character.proficiencyBonus')}
            </div>
            <div className="text-xl font-bold text-parchment-900 dark:text-parchment-100">
              +{character.proficiencyBonus}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-parchment-600 dark:text-parchment-400 mb-1">
              {t('character.experiencePoints')}
            </div>
            <div className="text-xl font-bold text-parchment-900 dark:text-parchment-100">
              {character.experiencePoints.toLocaleString()} XP
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PDF Export */}
      <PdfExport character={character} />
    </div>
  );
};

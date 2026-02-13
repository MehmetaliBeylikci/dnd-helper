import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Heart, Shield, Zap, User, Sword, Eye, 
  Footprints, Scroll, Package, Dices 
} from 'lucide-react';
import type { Character } from '../../types/character';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { DiceRoller } from '../dice/DiceRoller';
import { RollLog } from '../dice/RollLog';
import { AbilityScoresGrid } from '../character/AbilityScore';
import { TabView, type TabId } from '../ui/TabView';
import CombatTracker from '../combat/CombatTracker';
import InventoryManager from '../inventory/InventoryManager';
import ResourceManager from '../resources/ResourceManager';
import SpellSlotTracker from '../resources/SpellSlotTracker';
import { useDiceStore } from '../../store/diceStore';
import { performRoll } from '../../lib/dice';
import { calculateModifier } from '../../lib/dice';

interface DashboardProps {
  character: Character;
}

type AbilityKey = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

// Skill to ability mapping
const SKILL_ABILITY_MAP: Record<string, AbilityKey> = {
  'Athletics': 'strength',
  'Acrobatics': 'dexterity',
  'Sleight of Hand': 'dexterity',
  'Stealth': 'dexterity',
  'Arcana': 'intelligence',
  'History': 'intelligence',
  'Investigation': 'intelligence',
  'Nature': 'intelligence',
  'Religion': 'intelligence',
  'Animal Handling': 'wisdom',
  'Insight': 'wisdom',
  'Medicine': 'wisdom',
  'Perception': 'wisdom',
  'Survival': 'wisdom',
  'Deception': 'charisma',
  'Intimidation': 'charisma',
  'Performance': 'charisma',
  'Persuasion': 'charisma',
};

export const Dashboard: React.FC<DashboardProps> = ({ character }) => {
  const { roll: addRoll } = useDiceStore();
  const [lastRoll, setLastRoll] = useState<{ value: number; isCrit: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('stats');

  // Roll ability check (d20 + modifier)
  const rollAbilityCheck = (abilityName: string, abilityScore: number) => {
    const modifier = calculateModifier(abilityScore);
    const roll = performRoll({
      diceType: 'd20',
      count: 1,
      modifier,
      rollType: 'normal',
      label: `${abilityName} Check`,
    });
    
    addRoll(roll);
    
    // Check for natural 20 or 1
    const naturalRoll = roll.results[0];
    if (naturalRoll === 20 || naturalRoll === 1) {
      setLastRoll({ value: naturalRoll, isCrit: true });
      setTimeout(() => setLastRoll(null), 2000);
    }
  };

  // Roll skill check (d20 + ability modifier + prof if proficient)
  const rollSkillCheck = (skillName: string) => {
    const abilityKey = SKILL_ABILITY_MAP[skillName];
    if (!abilityKey) return;
    
    const abilityScore = character.abilityScores[abilityKey];
    const abilityModifier = calculateModifier(abilityScore);
    const isProficient = character.skillProficiencies.includes(skillName);
    const modifier = abilityModifier + (isProficient ? character.proficiencyBonus : 0);
    
    const roll = performRoll({
      diceType: 'd20',
      count: 1,
      modifier,
      rollType: 'normal',
      label: `${skillName} (${isProficient ? 'Prof' : 'Untrained'})`,
    });
    
    addRoll(roll);
    
    // Check for natural 20 or 1
    const naturalRoll = roll.results[0];
    if (naturalRoll === 20 || naturalRoll === 1) {
      setLastRoll({ value: naturalRoll, isCrit: true });
      setTimeout(() => setLastRoll(null), 2000);
    }
  };

  // Roll saving throw (d20 + ability modifier + prof if proficient)
  const rollSavingThrow = (abilityName: string, abilityKey: AbilityKey) => {
    const abilityScore = character.abilityScores[abilityKey];
    const abilityModifier = calculateModifier(abilityScore);
    const isProficient = character.savingThrowProficiencies.includes(abilityKey);
    const modifier = abilityModifier + (isProficient ? character.proficiencyBonus : 0);
    
    const roll = performRoll({
      diceType: 'd20',
      count: 1,
      modifier,
      rollType: 'normal',
      label: `${abilityName} Save (${isProficient ? 'Prof' : 'Untrained'})`,
    });
    
    addRoll(roll);
    
    const naturalRoll = roll.results[0];
    if (naturalRoll === 20 || naturalRoll === 1) {
      setLastRoll({ value: naturalRoll, isCrit: true });
      setTimeout(() => setLastRoll(null), 2000);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Critical Roll Animation */}
      {lastRoll && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className={`text-9xl font-bold animate-bounce ${
            lastRoll.value === 20 
              ? 'text-forest-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]' 
              : 'text-burgundy-600 drop-shadow-[0_0_30px_rgba(153,27,27,0.8)]'
          }`}>
            {lastRoll.value === 20 ? '🎲 NAT 20! 🎲' : '💀 NAT 1! 💀'}
          </div>
        </div>
      )}

      {/* Mobile Tabs */}
      <div className="lg:hidden mb-4">
        <TabView activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Mobile Tab Content */}
      <div className="lg:hidden">
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Character Header Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-burgundy-100 dark:bg-burgundy-900/30">
                    <User className="w-6 h-6 text-burgundy-600 dark:text-burgundy-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading text-xl font-bold text-parchment-900 dark:text-parchment-100">
                      {character.name}
                    </h2>
                    <p className="text-sm text-parchment-600 dark:text-parchment-400">
                      {character.race} {character.class} {character.level}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ability Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Ability Scores</CardTitle>
                <p className="text-xs text-parchment-600 dark:text-parchment-400 mt-1">
                  Click any ability to roll a check
                </p>
              </CardHeader>
              <CardContent>
                <AbilityScoresGrid scores={character.abilityScores} />
              </CardContent>
            </Card>

            {/* Dice Roller */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Dices className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400" />
                  <CardTitle>Dice Roller</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <DiceRoller />
              </CardContent>
            </Card>

            {/* Roll History */}
            <Card>
              <CardHeader>
                <CardTitle>Roll History</CardTitle>
              </CardHeader>
              <CardContent>
                <RollLog />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'combat' && (
          <div className="space-y-4">
            <CombatTracker character={character} />
            <ResourceManager character={character} />
            <SpellSlotTracker character={character} />
          </div>
        )}

        {activeTab === 'inventory' && (
          <InventoryManager character={character} />
        )}

        {activeTab === 'spells' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scroll className="w-5 h-5" />
                Spells
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-parchment-600 dark:text-parchment-400">
                <Scroll className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Spell system coming soon!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop: 3-Column Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        
        {/* LEFT SIDEBAR - Character Stats */}
        <aside className="lg:col-span-3 space-y-4 lg:space-y-6 lg:sticky lg:top-24">
          {/* Character Header Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-burgundy-100 dark:bg-burgundy-900/30">
                  <User className="w-6 h-6 text-burgundy-600 dark:text-burgundy-400" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-xl font-bold text-parchment-900 dark:text-parchment-100">
                    {character.name}
                  </h2>
                  <p className="text-sm text-parchment-600 dark:text-parchment-400">
                    {character.race} {character.class} {character.level}
                  </p>
                </div>
              </div>

              {/* XP Progress */}
              <div>
                <div className="flex justify-between text-xs text-parchment-600 dark:text-parchment-400 mb-1">
                  <span>Experience</span>
                  <span>{character.experiencePoints.toLocaleString()} XP</span>
                </div>
                <div className="h-2 bg-parchment-200 dark:bg-dark-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-burgundy-500 to-burgundy-600 transition-all duration-300"
                    style={{ width: `${Math.min((character.experiencePoints % 1000) / 10, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Combat Tracker for Desktop */}
          <CombatTracker character={character} />
          
          {/* Resource Management */}
          <ResourceManager character={character} />
          <SpellSlotTracker character={character} />

          {/* Ability Scores - Desktop */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ability Scores</CardTitle>
              <p className="text-xs text-parchment-600 dark:text-parchment-400 mt-1">
                Click any ability to roll a check
              </p>
            </CardHeader>
            <CardContent>
              <AbilityScoresGrid scores={character.abilityScores} />
            </CardContent>
          </Card>

          {/* Skills - Clickable List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills</CardTitle>
              <p className="text-xs text-parchment-600 dark:text-parchment-400 mt-1">
                Click to roll skill check
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {Object.keys(SKILL_ABILITY_MAP).map((skill) => {
                  const isProficient = character.skillProficiencies.includes(skill);
                  const abilityKey = SKILL_ABILITY_MAP[skill];
                  const modifier = calculateModifier(character.abilityScores[abilityKey]) +
                    (isProficient ? character.proficiencyBonus : 0);
                  
                  return (
                    <button
                      key={skill}
                      onClick={() => rollSkillCheck(skill)}
                      className={`w-full flex items-center justify-between p-2 rounded hover:bg-parchment-100 dark:hover:bg-dark-surface transition-colors text-left ${
                        isProficient ? 'bg-parchment-50 dark:bg-dark-border' : ''
                      }`}
                    >
                      <span className={`text-sm ${
                        isProficient 
                          ? 'font-medium text-parchment-900 dark:text-parchment-100' 
                          : 'text-parchment-600 dark:text-parchment-400'
                      }`}>
                        {skill}
                        {isProficient && <span className="ml-1 text-xs">●</span>}
                      </span>
                      <span className="text-sm font-medium text-parchment-900 dark:text-parchment-100">
                        {modifier >= 0 ? '+' : ''}{modifier}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* CENTER - Main Actions */}
        <main className="lg:col-span-6 space-y-6">
          {/* Dice Roller */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Dices className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400" />
                <CardTitle>Dice Roller</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <DiceRoller />
            </CardContent>
          </Card>

          {/* Roll History */}
          <Card>
            <CardHeader>
              <CardTitle>Roll History</CardTitle>
            </CardHeader>
            <CardContent>
              <RollLog />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => rollAbilityCheck('Attack Roll', character.abilityScores.strength)}
                  className="p-4 border-2 border-burgundy-400 dark:border-burgundy-600 rounded-lg hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-all group hover:scale-105"
                >
                  <Sword className="w-6 h-6 mx-auto mb-2 text-burgundy-600 dark:text-burgundy-400 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-parchment-900 dark:text-parchment-100">Attack</div>
                </button>
                <button 
                  onClick={() => rollSavingThrow('Dexterity', 'dexterity')}
                  className="p-4 border-2 border-forest-400 dark:border-forest-600 rounded-lg hover:bg-forest-50 dark:hover:bg-forest-900/20 transition-all group hover:scale-105"
                >
                  <Shield className="w-6 h-6 mx-auto mb-2 text-forest-600 dark:text-forest-400 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-parchment-900 dark:text-parchment-100">Defend</div>
                </button>
                <button 
                  onClick={() => rollSkillCheck('Perception')}
                  className="p-4 border-2 border-parchment-400 dark:border-dark-border rounded-lg hover:bg-parchment-50 dark:hover:bg-dark-surface transition-all group hover:scale-105"
                >
                  <Eye className="w-6 h-6 mx-auto mb-2 text-parchment-700 dark:text-parchment-300 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-parchment-900 dark:text-parchment-100">Perception</div>
                </button>
                <button 
                  onClick={() => rollSkillCheck('Stealth')}
                  className="p-4 border-2 border-parchment-400 dark:border-dark-border rounded-lg hover:bg-parchment-50 dark:hover:bg-dark-surface transition-all group hover:scale-105"
                >
                  <Footprints className="w-6 h-6 mx-auto mb-2 text-parchment-700 dark:text-parchment-300 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-parchment-900 dark:text-parchment-100">Stealth</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* RIGHT SIDEBAR - Inventory & Spells */}
        <aside className="lg:col-span-3 space-y-4 lg:space-y-6">
          {/* Inventory Manager for Desktop */}
          <InventoryManager character={character} />

          {/* Spells */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scroll className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  <CardTitle className="text-base">Spells</CardTitle>
                </div>
                <span className="text-xs text-parchment-600 dark:text-parchment-400">
                  {character.spellIds.length}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {character.spellIds.length === 0 ? (
                <div className="text-center py-8 text-parchment-600 dark:text-parchment-400">
                  <Scroll className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No spells prepared</p>
                  <button className="mt-3 text-xs text-burgundy-600 dark:text-burgundy-400 hover:underline">
                    + Add Spell
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <p className="text-sm text-parchment-600 dark:text-parchment-400">
                    Spell list coming soon
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

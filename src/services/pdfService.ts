import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown } from 'pdf-lib';
import type { Character, AbilityScores } from '../types/character';

/**
 * PDF Form Field Mapping Configuration
 * Maps Character object properties to PDF form field names
 */
export const PDF_FIELD_MAPPING = {
  // Basic Character Info
  'CharacterName': (char: Character) => char.name,
  'ClassLevel': (char: Character) => `${char.class} ${char.level}`,
  'Class': (char: Character) => char.class,
  'Subclass': (char: Character) => char.subclass || '',
  'Level': (char: Character) => char.level.toString(),
  'Race': (char: Character) => char.race,
  'Background': (char: Character) => char.background || '',
  'Alignment': (char: Character) => char.alignment || '',
  'PlayerName': () => '', // Can be filled by user later
  'ExperiencePoints': (char: Character) => char.experiencePoints.toString(),
  
  // Ability Scores
  'STR': (char: Character) => char.abilityScores.strength.toString(),
  'STRmod': (char: Character) => getAbilityModifier(char.abilityScores.strength),
  'DEX': (char: Character) => char.abilityScores.dexterity.toString(),
  'DEXmod': (char: Character) => getAbilityModifier(char.abilityScores.dexterity),
  'CON': (char: Character) => char.abilityScores.constitution.toString(),
  'CONmod': (char: Character) => getAbilityModifier(char.abilityScores.constitution),
  'INT': (char: Character) => char.abilityScores.intelligence.toString(),
  'INTmod': (char: Character) => getAbilityModifier(char.abilityScores.intelligence),
  'WIS': (char: Character) => char.abilityScores.wisdom.toString(),
  'WISmod': (char: Character) => getAbilityModifier(char.abilityScores.wisdom),
  'CHA': (char: Character) => char.abilityScores.charisma.toString(),
  'CHAmod': (char: Character) => getAbilityModifier(char.abilityScores.charisma),
  
  // Combat Stats
  'ProfBonus': (char: Character) => `+${char.proficiencyBonus}`,
  'AC': (char: Character) => char.armorClass.toString(),
  'Initiative': (char: Character) => formatModifier(char.initiative),
  'Speed': (char: Character) => char.speed.toString(),
  'HPMax': (char: Character) => char.hitPoints.max.toString(),
  'HPCurrent': (char: Character) => char.hitPoints.current.toString(),
  'HPTemp': (char: Character) => char.hitPoints.temp.toString(),
  
  // Saving Throws (proficiency-aware)
  'ST Strength': (char: Character) => formatSavingThrow(char, 'strength'),
  'ST Dexterity': (char: Character) => formatSavingThrow(char, 'dexterity'),
  'ST Constitution': (char: Character) => formatSavingThrow(char, 'constitution'),
  'ST Intelligence': (char: Character) => formatSavingThrow(char, 'intelligence'),
  'ST Wisdom': (char: Character) => formatSavingThrow(char, 'wisdom'),
  'ST Charisma': (char: Character) => formatSavingThrow(char, 'charisma'),
  
  // Skills (proficiency-aware)
  'Acrobatics': (char: Character) => formatSkill(char, 'dexterity', 'Acrobatics'),
  'Animal': (char: Character) => formatSkill(char, 'wisdom', 'Animal Handling'),
  'Arcana': (char: Character) => formatSkill(char, 'intelligence', 'Arcana'),
  'Athletics': (char: Character) => formatSkill(char, 'strength', 'Athletics'),
  'Deception': (char: Character) => formatSkill(char, 'charisma', 'Deception'),
  'History': (char: Character) => formatSkill(char, 'intelligence', 'History'),
  'Insight': (char: Character) => formatSkill(char, 'wisdom', 'Insight'),
  'Intimidation': (char: Character) => formatSkill(char, 'charisma', 'Intimidation'),
  'Investigation': (char: Character) => formatSkill(char, 'intelligence', 'Investigation'),
  'Medicine': (char: Character) => formatSkill(char, 'wisdom', 'Medicine'),
  'Nature': (char: Character) => formatSkill(char, 'intelligence', 'Nature'),
  'Perception': (char: Character) => formatSkill(char, 'wisdom', 'Perception'),
  'Performance': (char: Character) => formatSkill(char, 'charisma', 'Performance'),
  'Persuasion': (char: Character) => formatSkill(char, 'charisma', 'Persuasion'),
  'Religion': (char: Character) => formatSkill(char, 'intelligence', 'Religion'),
  'SleightofHand': (char: Character) => formatSkill(char, 'dexterity', 'Sleight of Hand'),
  'Stealth': (char: Character) => formatSkill(char, 'dexterity', 'Stealth'),
  'Survival': (char: Character) => formatSkill(char, 'wisdom', 'Survival'),
  
  
  // Passive Perception
  'Passive': (char: Character) => {
    const wisModifier = getAbilityModifierValue(char.abilityScores.wisdom);
    const proficient = char.skillProficiencies.includes('Perception');
    return (10 + wisModifier + (proficient ? char.proficiencyBonus : 0)).toString();
  },
  
  // Hit Dice
  'HDTotal': (char: Character) => char.hitDice.total.toString(),
  'HD': (char: Character) => char.hitDice.type,
  
  // Spell Slots (Level 1-9)
  'SlotsTotal 1': (char: Character) => getSpellSlotMax(char, 1),
  'SlotsTotal 2': (char: Character) => getSpellSlotMax(char, 2),
  'SlotsTotal 3': (char: Character) => getSpellSlotMax(char, 3),
  'SlotsTotal 4': (char: Character) => getSpellSlotMax(char, 4),
  'SlotsTotal 5': (char: Character) => getSpellSlotMax(char, 5),
  'SlotsTotal 6': (char: Character) => getSpellSlotMax(char, 6),
  'SlotsTotal 7': (char: Character) => getSpellSlotMax(char, 7),
  'SlotsTotal 8': (char: Character) => getSpellSlotMax(char, 8),
  'SlotsTotal 9': (char: Character) => getSpellSlotMax(char, 9),
  
  // Spell Save DC and Attack Bonus
  'SpellSaveDC': (char: Character) => char.resources.spellSlots?.spellSaveDC?.toString() || '',
  'SpellAtkBonus': (char: Character) => {
    const bonus = char.resources.spellSlots?.spellAttackBonus;
    return bonus !== undefined ? formatModifier(bonus) : '';
  },
  'SpellcastingAbility': (char: Character) => {
    const ability = char.resources.spellSlots?.castingAbility;
    return ability ? ability.toUpperCase().substring(0, 3) : '';
  },
} as const;

/**
 * Helper: Calculate ability modifier as a number
 */
function getAbilityModifierValue(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Helper: Format ability modifier with +/- sign
 */
function getAbilityModifier(score: number): string {
  return formatModifier(getAbilityModifierValue(score));
}

/**
 * Helper: Format number with +/- sign
 */
function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : value.toString();
}

/**
 * Helper: Format saving throw with proficiency bonus if applicable
 */
function formatSavingThrow(char: Character, ability: keyof AbilityScores): string {
  const abilityMod = getAbilityModifierValue(char.abilityScores[ability]);
  const proficient = char.savingThrowProficiencies.includes(ability);
  const total = abilityMod + (proficient ? char.proficiencyBonus : 0);
  return formatModifier(total);
}

/**
 * Helper: Format skill with proficiency bonus if applicable
 */
function formatSkill(char: Character, ability: keyof AbilityScores, skillName: string): string {
  const abilityMod = getAbilityModifierValue(char.abilityScores[ability]);
  const proficient = char.skillProficiencies.includes(skillName);
  const total = abilityMod + (proficient ? char.proficiencyBonus : 0);
  return formatModifier(total);
}

/**
 * Helper: Get maximum spell slots for a given level
 */
function getSpellSlotMax(char: Character, level: number): string {
  if (!char.resources.spellSlots) return '';
  
  const slot = char.resources.spellSlots.slots.find(s => s.level === level);
  return slot ? slot.max.toString() : '';
}

/**
 * Scan a PDF template and extract all form field names
 * @param pdfBytes - ArrayBuffer or Uint8Array of the PDF file
 * @returns Promise<string[]> - Array of field names found in the PDF
 */
export async function scanPdfFields(pdfBytes: ArrayBuffer | Uint8Array): Promise<string[]> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    return fields.map(field => field.getName());
  } catch (error) {
    console.error('Error scanning PDF fields:', error);
    throw new Error(`Failed to scan PDF fields: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Scan multiple PDF templates from a directory
 * @param pdfFiles - Array of File objects or { name: string, data: ArrayBuffer } objects
 * @returns Promise with mapping of filename to field names
 */
export async function scanMultiplePdfTemplates(
  pdfFiles: Array<File | { name: string; data: ArrayBuffer }>
): Promise<Record<string, string[]>> {
  const results: Record<string, string[]> = {};
  
  for (const file of pdfFiles) {
    try {
      const data = file instanceof File ? await file.arrayBuffer() : file.data;
      const fields = await scanPdfFields(data);
      const name = file instanceof File ? file.name : file.name;
      results[name] = fields;
    } catch (error) {
      console.error(`Failed to scan ${file instanceof File ? file.name : file.name}:`, error);
      results[file instanceof File ? file.name : file.name] = [];
    }
  }
  
  return results;
}

/**
 * Fill a PDF character sheet with character data
 * @param pdfBytes - ArrayBuffer or Uint8Array of the PDF template
 * @param character - Character object to fill into the PDF
 * @returns Promise<Uint8Array> - Filled PDF as bytes
 */
export async function fillCharacterSheet(
  pdfBytes: ArrayBuffer | Uint8Array,
  character: Character
): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    // Iterate through all fields and try to fill them
    for (const field of fields) {
      const fieldName = field.getName();
      const mapper = PDF_FIELD_MAPPING[fieldName as keyof typeof PDF_FIELD_MAPPING];
      
      if (mapper) {
        const value = mapper(character);
        
        try {
          if (field instanceof PDFTextField) {
            field.setText(value);
          } else if (field instanceof PDFCheckBox) {
            // For checkboxes, check if value is truthy
            if (value && value !== '0' && value !== 'false') {
              field.check();
            }
          } else if (field instanceof PDFDropdown) {
            field.select(value);
          }
        } catch (fieldError) {
          console.warn(`Failed to set field "${fieldName}":`, fieldError);
        }
      }
    }
    
    // Optionally flatten the form to prevent further editing
    // form.flatten();
    
    return await pdfDoc.save();
  } catch (error) {
    console.error('Error filling PDF:', error);
    throw new Error(`Failed to fill PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get unmapped fields - fields that exist in PDF but don't have a mapper
 * @param pdfBytes - ArrayBuffer or Uint8Array of the PDF file
 * @returns Promise<string[]> - Array of unmapped field names
 */
export async function getUnmappedFields(pdfBytes: ArrayBuffer | Uint8Array): Promise<string[]> {
  const allFields = await scanPdfFields(pdfBytes);
  const mappedFields = Object.keys(PDF_FIELD_MAPPING);
  
  return allFields.filter(field => !mappedFields.includes(field));
}

/**
 * Download filled PDF
 * @param pdfBytes - Filled PDF bytes
 * @param filename - Name for the downloaded file
 */
export function downloadPdf(pdfBytes: Uint8Array, filename: string): void {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Preview PDF in new tab
 * @param pdfBytes - PDF bytes to preview
 */
export function previewPdf(pdfBytes: Uint8Array): void {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  // Note: URL will remain in memory until page reload
}

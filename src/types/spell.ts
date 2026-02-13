// Spell Types for D&D 5E

export type SpellSchool = 
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation';

export interface Spell {
  id: string;
  name: string;
  level: number; // 0 for cantrips, 1-9 for spell levels
  school: SpellSchool;
  castingTime: string;
  range: string;
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    materialDescription?: string;
  };
  duration: string;
  concentration: boolean;
  ritual: boolean;
  description: string;
  higherLevels?: string;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
}

export interface SpellFormData {
  name: string;
  level: number;
  school: SpellSchool;
  castingTime: string;
  range: string;
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    materialDescription?: string;
  };
  duration: string;
  concentration: boolean;
  ritual: boolean;
  description: string;
}

export interface Operator {
  id: string;
  name: string;
  nation: string;
  rarity: number;
  thumbnailLink?: string;
  potentials: string[];
  trait: string;
  class: string;
  branch: string;
  talents: Talent[];
  recruitTags: string[];
  obtainMethods: string[];
  stats: any;
  position: string;
  trustExtraStats?: any[];
  skills: Skill[];
}

export interface Talent {
  maxLevel?: number,
  descriptions: string[];
  unlockConditions: {
    potential: number,
    level: number,
    elite: number
  }[];
}[]

export interface Skill {
  id: string;
  name?: string;
  description?: string;
  spType?: 'Auto Recovery' | 'Offensive Recovery' | 'Defensive Recovery' | 'Passive'
  spIncrement?: number;
  levels?: SkillLevel[];
}

export interface SkillLevel {
  duration: number;
  spCost: number;
  stats: {
    name: string;
    value: any;
  }[];
}
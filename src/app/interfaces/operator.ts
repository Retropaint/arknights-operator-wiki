import { Item } from "./item";

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
  statBreakpoints: StatBreakpoint[];
  position: string;
  trustExtraStats?: any[];
  skills: Skill[];
  skillLevelUnlockReqs?: SkillUnlockReqs[];
}

export interface Talent {
  name: string,
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
  masteryUnlockReqs?: SkillUnlockReqs[]; 
}

export interface SkillLevel {
  duration: number;
  spCost: number;
  initialSp: number;
  stats: {
    name: string;
    value: any;
  }[];

  range?: string;
}

export interface StatBreakpoint {
  elite: number;
  minLevel: number;
  maxLevel: number;
  minStats: any;
  maxStats: any;
  eliteUnlockReqs?: EliteUnlockReqs;
}

export interface EliteUnlockReqs {
  level: number;
  items: Item[];
}

export interface SkillUnlockReqs {
  items: Item[];
  level: number;
  elite: number;

  duration?: number;
}
import { Item } from "./item";
import { Skin } from "./skin";

export interface Operator {
  id: string;
  name: string;
  rarity: number;
  thumbnailLink?: string;
  potentials: string[];
  trait: string;
  class: string;
  branch: string;
  originalBranch: string; // unedited branch name, used for icon
  talents: Talent[];
  tags: string[];
  obtainMethods: string[];
  statBreakpoints: StatBreakpoint[];
  position: string;
  skills: Skill[];
  skillLevelUnlockReqs?: SkillUnlockReqs[];
  modules?: Module[];
  skins: Skin[];
  summons?: Summon[];
  baseSkills?: OperatorBaseSkill[];
  recruitmentContract: string;
  potentialToken: string;
  profileEntries: ProfileEntry[];
  dialogues: Dialogue[];
  group: {
    name: string,
    id: string;
  }
  trustStats: any;
  voiceActors: {
    CN?: string;
    JP?: string;
    EN?: string;
    KR?: string;
  }
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
  spType?: 'Auto Recovery' | 'Offensive Recovery' | 'Defensive Recovery' | 'Passive';
  activationType?: 'Manual' | 'Auto';
  spIncrement?: number;
  levels?: SkillLevel[];
  masteryUnlockReqs?: SkillUnlockReqs[]; 
  eliteUnlockReq: number;
  iconId?: string;
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
  rangeId: string;
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

export interface Module {
  id: string;
  imgLink: string;
  typeName: string;
  name: string;
  description: string;

  // info gathered on battle equip json
  trait?: string;
  traitStats?: any;
  missions?: ModuleMission[];
  levels?: ModuleLevel[];
}

export interface ModuleMission {
  id: string;
  description?: string;
}

export interface ModuleLevel {
  itemCosts: Item[];
  stats?: any;
  summonStats?: any;
}

export interface Summon {
  name: string;
  id: string;
  associatedSkillIndex: number;
  statBreakpoints: StatBreakpoint[];
  position: string;

  trustStats?: any;
  potentials?: string[];
}

export interface BaseSkill {
  name: string;
  id: string;
  iconId: string;
  description: string;
  color: string;

  requirements?: {
    elite: number;
    level: number;
  }
}

export interface OperatorBaseSkill {
  iconId?: string;
  color?: string;
  name: string;
  id: string;
  description?: string;
  requirements: {
    elite: number;
    level: number;
  }
}

export interface ProfileEntry {
  name: string;
  description: string;
  unlockRequirement: {
    type: number;
    value: number;
  }
}

export interface Dialogue {
  name: string;
  text: string;
  fileIndex: string; // eg 002, 042, etc
}


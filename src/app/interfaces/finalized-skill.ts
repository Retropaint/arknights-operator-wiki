export interface FinalizedSkill {
  id: string,
  iconId: string,
  name: string,
  description: string,
  recoveryType: {
    name: string,
    tip: string;
  },
  eliteUnlockReq: number,
  activationType: string,
  spCosts: {value: number, level: number}[],
  initialSp: {value: number, level: number}[],
  durations: {value: number, level: number}[],
  ranges: {id: string, level: number}[]
}
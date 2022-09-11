export interface FinalizedSkill {
  name: string,
  description: string,
  recoveryType: string,
  eliteUnlockReq: number,
  activationType: string,
  spCosts: {value: number, level: number}[],
  initialSp: {value: number, level: number}[],
  durations: {value: number, level: number}[],
  ranges: {id: string, level: number}[]
}
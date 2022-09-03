export interface Doctor {
  levelBreakpoints: LevelBreakpoint[];
  statSlider: boolean;
  skillSlider: boolean;
}

export interface LevelBreakpoint {
  elite: number,
  level: number;
}
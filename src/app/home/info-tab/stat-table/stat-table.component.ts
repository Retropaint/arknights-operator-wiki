import { Component, Input, OnInit } from '@angular/core';
import { Doctor } from 'src/app/interfaces/doctor';
import { Operator, StatBreakpoint } from 'src/app/interfaces/operator';
import { DoctorService } from 'src/app/services/doctor.service';
import { linear } from 'everpolate'; 

@Component({
  selector: 'app-stat-table',
  templateUrl: './stat-table.component.html',
  styleUrls: ['./stat-table.component.scss'],
})
export class StatTableComponent implements OnInit {

  @Input() operator: Operator;

  doctor: Doctor = {
    levelBreakpoints: [],
    statSlider: false,
    skillSlider: false
  };

  customLevel: number = 0;
  maxCustomLevel: number = 0;
  parsedCustomLevel: {
    level: number;
    elite: number;
  }
  customStats: any;

  visualBreakpoints: any[] = [];

  // after changing breakpoints it takes a split second for visualBreakpoints to update, so this keeps previous data until getBreakpoints() is done to prevent jittering
  displayedBreakpoints: any;

  includeTrust: boolean = true;

  includePotentials: boolean = true;

  constructor(
    private doctorService: DoctorService
  ) { }

  ngOnInit() {
    this.displayedBreakpoints = this.visualBreakpoints.slice();
    this.visualBreakpoints = [];
    this.maxCustomLevel = 0;

    this.operator.statBreakpoints.forEach(breakpoint => {
      this.maxCustomLevel += breakpoint.maxLevel;
    })
    this.parsedCustomLevel = {
      level: 0,
      elite: 0
    }
    this.customStats = this.calculateStats(0, 0);
    setTimeout(() => {
      this.doctor = this.doctorService.doctor;
      this.getBreakpoints();
      this.displayedBreakpoints = this.visualBreakpoints;
    })
  }

  reset() {
    this.displayedBreakpoints = this.visualBreakpoints.slice();
    this.visualBreakpoints = [];

    setTimeout(() => {
      this.getBreakpoints();
      this.parseCustomLevel();
      this.displayedBreakpoints = this.visualBreakpoints;
    })
  }

  getBreakpoints() {
    this.doctor.levelBreakpoints.forEach(breakpoint => {

      if(this.operator.statBreakpoints[breakpoint.elite] == null) {

        // proceed if at least 1 breakpoint is valid
        if(this.visualBreakpoints.length > 0) {
          return;
        } else { // otherwise, pick the highest elite and level of this op as the breakpoint
          const opElite = this.operator.statBreakpoints.length - 1;
          const newBreakpoint = {
            elite: opElite,
            level: this.operator.statBreakpoints[opElite].maxLevel,
            stats: this.calculateStats(opElite, breakpoint.level)
          }
          this.visualBreakpoints.push(newBreakpoint)
          return;
        }

      }

      const newBreakpoint = {
        elite: breakpoint.elite,
        level: Math.min(breakpoint.level, this.operator.statBreakpoints[breakpoint.elite].maxLevel),
        stats: this.calculateStats(breakpoint.elite, breakpoint.level)
      }
      this.visualBreakpoints.push(newBreakpoint)
    })
  }

  calculateStats(elite: number, level: number) {
    if(this.operator.statBreakpoints[elite] == null) {
      return;
    }

    const op = this.operator.statBreakpoints[elite]
    level = Math.min(level, this.operator.statBreakpoints[elite].maxLevel);

    // immediately get min and max stats if that's the level
    if(level == 0) {
      return this.addTrustAndPotential(op.minStats);
    } else if(level == op.maxLevel) {
      return this.addTrustAndPotential(op.maxStats);
    }

    let stats: any = {};
    
    Object.keys(this.operator.statBreakpoints[0].minStats)
      .forEach(stat => {
        if(typeof op.minStats[stat] == "number" && stat != 'attackInterval') {
          const finalStat = Math.round(linear(level, [op.minLevel, op.maxLevel], [op.minStats[stat], op.maxStats[stat]])[0])
          stats[stat] = finalStat;
        } else {
          stats[stat] = op.minStats[stat];
        }
    })

    return this.addTrustAndPotential(stats);
    
  }

  addTrustAndPotential(paramStats: any) {

    const stats = JSON.parse(JSON.stringify(paramStats));

    if(this.includeTrust) {
      Object.keys(this.operator.trustStats).forEach(stat => {
        stats[stat] += this.operator.trustStats[stat];
      })
    }

    if(this.includePotentials) {
      this.operator.potentials.forEach(rank => {
        const split = rank.split(' ').filter(word => word != '');

        for(let i = 0; i < split.length; i++) {
          const word = split[i];
          const nextWord = split[i+1];
          if(nextWord != null) {
            stats[word.toLowerCase()] += parseInt(nextWord)
          }
        }
      })
    }

    return stats;
  }

  parseCustomLevel() {
    let level: number = this.customLevel;
    let elite: number = 0;

    let offsetLevels: number = 0;
    this.operator.statBreakpoints.forEach(breakpoint => {
      if(this.customLevel-offsetLevels > breakpoint.maxLevel) {
        level = this.customLevel - (breakpoint.maxLevel + offsetLevels);
        offsetLevels += breakpoint.maxLevel;
        elite++;
      }
    })

    this.parsedCustomLevel = {
      level: level,
      elite: elite
    }

    this.customStats = this.calculateStats(elite, level);

  }
}

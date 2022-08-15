import { Component, Input, OnInit } from '@angular/core';
import { Doctor } from 'src/app/interfaces/doctor';
import { Operator, StatBreakpoint } from 'src/app/interfaces/operator';
import { DoctorService } from 'src/app/services/doctor.service';
import { linear } from 'everpolate'; 

@Component({
  selector: 'app-stat-table',
  templateUrl: './stat-table.component.html',
  styleUrls: ['./stat-table.component.scss', '../table.scss'],
})
export class StatTableComponent implements OnInit {

  @Input() operator: Operator;

  doctor: Doctor;

  visualBreakpoints: any[] = [];

  constructor(
    private doctorService: DoctorService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.doctor = this.doctorService.doctor;
      this.getBreakpoints();
    })

    console.log();
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
            level: Math.min(breakpoint.level, this.operator.statBreakpoints[opElite].maxLevel),
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
    console.log(this.visualBreakpoints)
  }

  calculateStats(elite: number, level: number) {
    if(this.operator.statBreakpoints[elite] == null) {
      return;
    }

    const op = this.operator.statBreakpoints[elite]
    level = Math.min(level, this.operator.statBreakpoints[elite].maxLevel);

    // immediately get min and max stats if that's the level
    if(level == 0) {
      return op.minStats;
    } else if(level == op.maxLevel) {
      return op.maxStats;
    }

    let stats: any = [];
    
    Object.keys(this.operator.statBreakpoints[0].minStats)
      .forEach(stat => {
        if(typeof op.minStats[stat] == "number" && stat != 'baseAttackTime') {
          const finalStat = Math.round(linear(level, [op.minLevel, op.maxLevel], [op.minStats[stat], op.maxStats[stat]])[0])
          stats[stat] = finalStat;
        } else {
          stats[stat] = op.minStats[stat];
        }
    })

    return stats;
    
  }
}

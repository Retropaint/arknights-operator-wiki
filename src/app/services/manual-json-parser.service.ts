import { Injectable } from '@angular/core';
import { Operator, OperatorBaseSkill, Skill, Talent } from '../interfaces/operator';

@Injectable({
  providedIn: 'root'
})
export class ManualJsonParserService {

  constructor() { }

  edit(op: Operator) {
    this.skills(op);
    this.ranges(op);
    this.talents(op);
  }

  skills(op: Operator) {

    // Aqua Loop would be displayed as infinite due to a -1 duration
    if(op.name == 'Tuye') {
      op.skills.find(skill => skill.name == 'Aqua Loop')
        .levels.forEach(level => {
          level.duration = 0;
        })
    }

    // mulitply Exusiai's s3 attack interval reduction
    if(op.name == 'Exusiai') {
      op.skills.find(skill => skill.name == 'Overloading Mode')
        .levels.forEach(level => {
          level.stats.find(stat => stat.name == 'base_attack_time').value *= 2;
        })
    }
  }

  talents(op: Operator) {

    // show eyja's 2nd talent random SP range
    if(op.name == 'Eyjafjalla') {
      const pot = '<span class="positive-effect"> (+(3-4)) </span>'
      op.talents[2].descriptions[1] = op.talents[2].descriptions[1].replace('Points', 'Points (10-20) ' + pot);
    }

  }

  ranges(op: Operator) {
    
    // Frostleaf's e2 talent gives her permanent extra range
    if(op.name == 'Frostleaf') {
      op.statBreakpoints[2].rangeId = '3-1'
    }

  }
}

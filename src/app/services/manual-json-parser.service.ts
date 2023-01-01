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

  private skills(op: Operator) {
    const br = new RegExp('<br>', 'g');

    switch(op.name) {
      case 'Silverash': case 'Mountain': case "Ch\'en": 
        this.replaceSkillDesc(op, 1, br, '');
      break; case 'Schwarz': case 'Blemishine': case 'Fartooth':
        this.replaceSkillDesc(op, 2, br, '');
      break; case 'Vulcan': case 'Ambriel':
        this.replaceSkillDesc(op, 1, 'slightly', '');
      break; case "Kal\'tsit":
        this.replaceSkillDesc(op, 1, br, '');
        this.replaceSkillDesc(op, 2, br, '');
      break; case "Tuye":
        op.skills.find(skill => skill.name == 'Aqua Loop')
          .levels.forEach(level => {
            level.duration = 0;
          })
      break; case 'Exusiai':
        op.skills.find(skill => skill.name == 'Overloading Mode')
          .levels.forEach(level => {
            level.stats.find(stat => stat.name == 'base_attack_time').value *= 2;
          })
      break; case 'Ansel':
        op.skills[0].levels[0].range = '3-10';
        op.skills[0].levels[3].range = '5-2';
    }

    if(op.branch == 'Hookmaster' || op.branch == 'Pusher') {
      op.skills.forEach(skill => {
        skill.levels.forEach(level => {
          const forceStat = level.stats.find(stat => stat.name == "force");
          if(forceStat) {
            forceStat.name = 'attack@force';
          }
        })
      })
    }
  }

  replaceSkillDesc(op: Operator, index: number, toReplace: string | RegExp, newString: string) {
    op.skills[index].description = op.skills[index].description.replace(toReplace, newString);
  }

  private talents(op: Operator) {

    // show eyja's 2nd talent random SP range
    if(op.name == 'Eyjafjalla') {
      const pot = '<span class="positive-effect"> (+(3-4)) </span>'
      op.talents[2].descriptions[1] = op.talents[2].descriptions[1].replace('Points', 'Points (10-20) ' + pot);
    }

  }

  private ranges(op: Operator) {
    
    // Frostleaf's e2 talent gives her permanent extra range
    if(op.name == 'Frostleaf') {
      op.statBreakpoints[2].rangeId = '3-1'
    }

  }
}

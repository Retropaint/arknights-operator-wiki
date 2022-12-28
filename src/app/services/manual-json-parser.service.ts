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
    this.modules(op);
  }

  skills(op: Operator) {
    const br = new RegExp('<br>', 'g');

    switch(op.name) {
      case "Tuye":
        op.skills.find(skill => skill.name == 'Aqua Loop')
          .levels.forEach(level => {
            level.duration = 0;
          })
      break; case 'Exusiai':
        op.skills.find(skill => skill.name == 'Overloading Mode')
          .levels.forEach(level => {
            level.stats.find(stat => stat.name == 'base_attack_time').value *= 2;
          })
      break; case 'Vulcan':
        op.skills[1].description = op.skills[1].description.replace('slightly', '');
      break; case 'Ambriel':
        op.skills[1].description = op.skills[1].description.replace('a bit', '');
      break; case 'Silverash': case 'Mountain': case "Ch\'en": 
        op.skills[1].description = op.skills[1].description.replace(br, '');
      break; case 'Ansel':
        op.skills[0].levels[0].range = '3-10';
        op.skills[0].levels[3].range = '5-2';
      break; case 'Gladiia':
        op.skills.forEach(skill => {
          skill.levels.forEach(level => {
            level.stats.find(stat => stat.name.includes('force')).name = 'attack@force';
          })
        })
      break; case "Kal\'tsit":
        op.skills[1].description = op.skills[1].description.replace(br, '');
        op.skills[2].description = op.skills[2].description.replace(br, '');
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

  modules(op: Operator) {

    if(op.modules[1]) {
      // fast-redploy modules
      op.modules[1].trait = op.modules[1].trait.replace('a large portion', '80%')
      
      // Bagpipe's module
      op.modules[1].trait = op.modules[1].trait.replace('{cost:0}', '2')
    }
    
  }
}

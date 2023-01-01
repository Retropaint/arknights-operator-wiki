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
        this.replaceSkillDesc(op, 1, 'increases', 'increases by base_attack_time:s');
      break; case "Kal\'tsit":
        this.replaceSkillDesc(op, 1, br, '');
        this.replaceSkillDesc(op, 2, br, '');
      break; case 'Ebenholz':
        this.replaceSkillDesc(op, 0, 'significantly reduced', 'reduced significantly');
        this.replaceSkillStatName(op, 1, "force", "attack@force");
        this.replaceSkillStatName(op, 2, "force", "attack@force");
      break; case "Tuye":
        op.skills[0].levels.forEach(level => {
          level.duration = 0;
        })
      break; case 'Exusiai':
        op.skills[2].levels.forEach(level => {
          level.stats.find(stat => stat.name == 'base_attack_time').value *= 2;
        })
        this.replaceSkillDesc(op, 2, "Minor", "base_attack_time:s");
      break; case 'Ansel':
        op.skills[0].levels[0].range = '3-10';
        op.skills[0].levels[3].range = '5-2';
      
    }

    this.parseDescriptiveWords(op);
    this.parseUpperCaseNames(op);
  }

  private parseUpperCaseNames(op: Operator) {
    for(let i = 0; i < op.skills.length; i++) {
      this.replaceSkillDesc(op, i, "ABILITY_RANGE_FORWARD_EXTEND", "ABILITY_RANGE_FORWARD_EXTEND".toLowerCase());
      this.replaceSkillDesc(op, i, "hp_recovery_per_sec_BY_MAX_HP_RATIO", "hp_recovery_per_sec_BY_MAX_HP_RATIO".toLowerCase());
      this.replaceSkillDesc(op, i, "HP_RECOVERY_PER_SEC", "HP_RECOVERY_PER_SEC".toLowerCase());
    }
  }

  private parseDescriptiveWords(op: Operator) {
    const descriptiveWords = ['slightly', 'moderately', 'dramatically', 'significantly'];

    for(let i = 0; i < op.skills.length; i++) {
      this.replaceSkillStatName(op, i, "force", "attack@force");

      descriptiveWords.forEach(word => {
        const regex = RegExp(word, 'g');

        if(op.branch == 'Hookmaster' || op.branch == 'Pusher') {
          this.replaceSkillDesc(op, i, regex, 'by attack@force tiles');
        } else {
          let suffix = ':0%';
          if(op.name == 'Ptilopsis') {
            suffix = ':s';
          }

          this.replaceSkillDesc(op, i, regex, this.baseAttackTime(op.skills[i], suffix));
        }
      })

      this.replaceSkillDesc(op, i, 'a bit', '');
      this.replaceSkillDesc(op, i, 'reduces', 'reduced');
    }
  }

  private baseAttackTime(skill: Skill, suffix: string) {
    if(skill.levels[0].stats.find(stat => stat.name == 'base_attack_time')?.value < 0) {
      return 'by base_attack_time' + suffix;
    } else {
      return 'to base_attack_time' + suffix;
    }
  }

  private replaceSkillStatName(op: Operator, index: number, name: string, toReplace: string) {
    op.skills[index].levels.forEach(level => {
      const stat = level.stats.find(stat => stat.name == name);
      if(stat) {
        stat.name = toReplace;
      }
    })
  }

  private replaceSkillDesc(op: Operator, index: number, toReplace: string | RegExp, newString: string) {
    op.skills[index].description = op.skills[index].description.replace(toReplace, newString);
  }

  private talents(op: Operator) {
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

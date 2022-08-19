import { Component, Input, OnInit } from '@angular/core';
import { Operator, Skill } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-skill-table',
  templateUrl: './skill-table.component.html',
  styleUrls: ['./skill-table.component.scss', '../table.scss'],
})
export class SkillTableComponent implements OnInit {

  @Input() operator: Operator;

  skills: any[] = [];
  previousStats: {
    name: string,
    value: number
  }[] = [];

  m0img: string = '<span class="skill-level-mastery"> <img src="assets/icons/skillLevels/m0.png" /> </span>'
  m1img: string = '<span class="skill-level-mastery"> <img src="assets/icons/skillLevels/m1.png" /> </span>'
  m2img: string = '<span class="skill-level-mastery"> <img src="assets/icons/skillLevels/m2.png" /> </span>'
  m3img: string = '<span class="skill-level-mastery"> <img src="assets/icons/skillLevels/m3.png" /> </span>'

  constructor() { }

  ngOnInit() {
    this.getSkillDescriptions();
  }

  getSkillDescriptions() {

    this.operator.skills.forEach(skill => {
      let newSkill = {
        name: skill.name,
        description: skill.description,
        recoveryType: skill.spType,
        spCosts: this.getMiscSkillStats(skill, 'spCost'),
        initialSp: this.getMiscSkillStats(skill, 'initialSp'),
        durations: this.getMiscSkillStats(skill, 'duration')
      }

      // parse skill values as well as adding m0 and m3 stats

      newSkill.description = newSkill.description.replace('HP_RECOVERY_PER_SEC', 'hp_recovery_per_sec');

      newSkill.description = this.initialParse(skill, newSkill.description, 0)

      this.getMiscSkillStats(skill, 'duration')

      if(this.operator.rarity > 3) {
        newSkill.description = this.continuousParse(skill, newSkill.description, 6);
        newSkill.description = this.continuousParse(skill, newSkill.description, 7);
        newSkill.description = this.continuousParse(skill, newSkill.description, 8);
        newSkill.description = this.lastParse(skill, newSkill.description, 9);
      } else {
        newSkill.description = this.lastParse(skill, newSkill.description, 6);
      }

      this.skills.push(newSkill)
    })
  }

  initialParse(skill: Skill, description: string, level: number) {
    
    skill.levels[level].stats.forEach(stat => {

      const strings = [
        `{${stat.name}}`, // basic stat
        `{${stat.name}:0%}`, // percent-based stat
        `-{-${stat.name}}`, 
        `-{-${stat.name}:0%}`,
        `{-${stat.name}}`,
        `{${stat.name}:0.0}`,
        `+{${stat.name}}`,
        `+{${stat.name}:0%}`,
      ];

      this.previousStats.push({name: stat.name, value: stat.value})

      description = this.parseDesc(description, stat, strings, level, 'first');

    })

    return description;
  }

  continuousParse(skill: Skill, description: string, level: number) {
    
    skill.levels[level].stats.forEach(stat => {

      const index = this.previousStats.findIndex(findingStat => {
        return findingStat.name == stat.name;
      })

      // do not parse if values are the same
      if(index != -1 && this.previousStats[index].value == stat.value) {
        return;
      }

      const strings = [
        `${stat.name}~`, // basic stat
        `${stat.name}%~` // percent-based stat
      ];

      description = this.parseDesc(description, stat, strings, level, 'middle');

      // updated previousStats
      if(index != -1) {
        this.previousStats[index].value = stat.value;
      }
      
    })

    return description;
  }

  lastParse(skill: Skill, description: string, level: number) {
    
    skill.levels[level].stats.forEach(stat => {

      const index = this.previousStats.findIndex(findingStat => {
        return findingStat.name == stat.name;
      })
      if(index != -1 && this.previousStats[index].value == stat.value) {
        // remove incomplete parsing left by continuousParse()
        description = this.removeMiddleStray(description, stat.name + '~');
        description = this.removeMiddleStray(description, stat.name + '%~');
        return;
      }

      const strings = [
        `${stat.name}~`, // basic stat
        `${stat.name}%~` // percent-based stat
      ];

      if(index != -1) {
        this.previousStats[index].value = stat.value;
      }

      description = this.parseDesc(description, stat, strings, level, 'last');
      
    })

    return description;
  }

  parseDesc(description: string, stat, strings: string[], level, parseType: 'first' | 'middle' | 'last') {
    strings.forEach(string => {

      let multiplier = 1;
      let percent = '';
      let plus = '';
      let img = '';
      if(string.includes('%')) {
        multiplier = 100;
        percent = '%'
      }
      if(string.includes('+')) {
        plus = '+'
      }
      switch(level) {
        case 6:
          img = this.m0img;
        break; case 7:
          img = this.m1img;
        break; case 8:
          img = this.m2img;
        break; case 9:
          img = this.m3img;
      }

      switch(parseType) {
        case 'first':
          description = this.replaceWholeWord(description, string, `${plus}${Math.round(stat.value*multiplier)}${percent} ${img} ${stat.name}${percent}~`)
        break; case 'middle':
          description = this.replaceWholeWord(description, string, ` ${plus}(${Math.round(stat.value*multiplier)}${percent} ${img}) ${stat.name}${percent}~`)
        break; case 'last':
          description = this.replaceWholeWord(description, string, ` ${plus}(${Math.round(stat.value*multiplier)}${percent} ${img})`)
      }
    })

    return description;

  }

  removeMiddleStray(description: string, toCheck: string) {
    return this.replaceWholeWord(description, toCheck, '');
  }

  replaceWholeWord(string: string, toCheck: string, replacement: string) {
    const split = string.split(' ');
    const index = split.findIndex(word => word == toCheck);
    if(index != -1) {
      split[index] = replacement;
    }
    let result = '';
    split.forEach(word => {
      result += word + ' '; 
    })
    return result;
  }

  getMiscSkillStats(skill: any, miscStat: 'duration' | 'spCost' | 'initialSp') {
    let previousValue: number = -999;
    let stats: {
      value: number;
      mastery: string;
    }[] = [];

    let maxLevel = (this.operator.rarity > 3) ? 10: 7;
    for(let i = 6; i < maxLevel; i++) {
      const thisStat = skill.levels[i][miscStat];
      if(thisStat != previousValue) {
        stats.push({value: thisStat, mastery: 'm' + (i-6)});
        previousValue = thisStat;
      }
    }

    return stats;
  }

}

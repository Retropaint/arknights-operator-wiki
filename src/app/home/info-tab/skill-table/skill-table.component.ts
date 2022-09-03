import { Component, Input, OnInit } from '@angular/core';
import { Doctor } from 'src/app/interfaces/doctor';
import { Operator, Skill } from 'src/app/interfaces/operator';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-skill-table',
  templateUrl: './skill-table.component.html',
  styleUrls: ['./skill-table.component.scss'],
})
export class SkillTableComponent implements OnInit {

  objectKeys = Object.keys;

  @Input() operator: Operator;

  selectedSkillLevels = {
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: true,
    7: true,
    8: true,
    9: true
  };

  skills: any[] = [];
  previousStatValues: {
    name: string,
    value: number
  }[] = [];

  sliderLevel: number = 0;

  m0img: string = '<span class="skill-level"> <img class="mastery-img" src="assets/icons/skillLevels/m0.png" /> </span>'
  m1img: string = '<span class="skill-level"> <img class="mastery-img" src="assets/icons/skillLevels/m1.png" /> </span>'
  m2img: string = '<span class="skill-level"> <img class="mastery-img" src="assets/icons/skillLevels/m2.png" /> </span>'
  m3img: string = '<span class="skill-level"> <img class="mastery-img" src="assets/icons/skillLevels/m3.png" /> </span>'

  doctor: Doctor;

  constructor(
    private doctorService: DoctorService
  ) { }

  ngOnInit() {
    this.doctor = this.doctorService.doctor;
    this.getSkillDescriptions();
  }

  getSkillDescriptions() {

    this.skills = [];

    // get first and last skill levels for parsing
    let firstSelectedSkillLevel: number;
    let lastSelecedSkillLevel: number;
    for(let i = 0; i < 10; i++) {
      if(this.selectedSkillLevels[i] && firstSelectedSkillLevel == null) {
        firstSelectedSkillLevel = i;   
      }
      if(this.selectedSkillLevels[i]) {
        lastSelecedSkillLevel = i;
      }
    }

    this.operator.skills.forEach(skill => {
      this.previousStatValues = [];

      let newSkill = {
        name: skill.name,
        description: skill.description,
        recoveryType: skill.spType,
        eliteUnlockReq: skill.eliteUnlockReq,
        activationType: skill.activationType,
        spCosts: this.getMiscSkillStats(skill, 'spCost', firstSelectedSkillLevel, lastSelecedSkillLevel),
        initialSp: this.getMiscSkillStats(skill, 'initialSp', firstSelectedSkillLevel, lastSelecedSkillLevel),
        durations: this.getMiscSkillStats(skill, 'duration', firstSelectedSkillLevel, lastSelecedSkillLevel),
        ranges: this.getRanges(skill, firstSelectedSkillLevel, lastSelecedSkillLevel)
      }

      newSkill.description = newSkill.description.replace('HP_RECOVERY_PER_SEC', 'hp_recovery_per_sec');
      newSkill.description = newSkill.description.replace('hp_recovery_per_sec_BY_MAX_HP_RATIO', "hp_recovery_per_sec_by_max_hp_ratio");

      newSkill.description = this.parseUnnumberedStats(newSkill.description, skill);
      newSkill.description = this.initialParse(skill, newSkill.description, firstSelectedSkillLevel)
      const maxLevel = this.operator.rarity > 3 ? 9: 6;
      for(let i = firstSelectedSkillLevel+1; i <= Math.min(lastSelecedSkillLevel+1, maxLevel); i++) {
        if(this.selectedSkillLevels[i]) {
          newSkill.description = this.continuousParse(skill, newSkill.description, i);
        }
      }
      newSkill.description = this.lastParse(skill, newSkill.description, Math.min(lastSelecedSkillLevel, maxLevel));
      newSkill.description = this.cleanUpSkillDescription(newSkill.description)

      this.skills.push(newSkill)
    })
  }

  initialParse(skill: Skill, description: string, level: number) {
    
    skill.levels[level].stats.forEach(stat => {

      // behold, all stat value variations
      const strings = [
        `${stat.name}`,
        `-${stat.name}`, 
        `${stat.name}:0%`, 
        `${stat.name}:0.0`,
        `${stat.name}:0`,
        `-${stat.name}:0%`,
        `${stat.name}:0.0%`,
        `${stat.name}:s`,
      ];

      this.previousStatValues.push({name: stat.name, value: stat.value})

      description = this.parseDesc(description, stat, strings, level, 'first');

    })

    return description;
  }

  continuousParse(skill: Skill, description: string, level: number) {
    
    skill.levels[level].stats.forEach(stat => {

      // do not parse if values are the same
      const index = this.previousStatValues.findIndex(findingStat => {
        return findingStat.name == stat.name;
      })
      if(index != -1 && this.previousStatValues[index].value == stat.value) {
        return;
      }

      const statParseVariations = [
        `${stat.name}~`,
        `${stat.name}%~`,
        `${stat.name}:s~`
      ];

      description = this.parseDesc(description, stat, statParseVariations, level, 'middle');

      // updated previousStatValues
      if(index != -1) {
        this.previousStatValues[index].value = stat.value;
      }
      
    })

    return description;
  }

  lastParse(skill: Skill, description: string, level: number) {
    
    skill.levels[level].stats.forEach(stat => {

      const index = this.previousStatValues.findIndex(findingStat => {
        return findingStat.name == stat.name;
      })
      if(index != -1 && this.previousStatValues[index].value == stat.value) {
        // remove incomplete parsing left by continuousParse()
        description = this.replaceWholeWord(description, stat.name + '~', '');
        description = this.replaceWholeWord(description, stat.name + '%~', '');
        description = this.replaceWholeWord(description, stat.name + ':s~', '');
        return;
      }

      const statParseVariations = [
        `${stat.name}~`, 
        `${stat.name}%~`, 
        `${stat.name}:s~` 
      ];

      description = this.parseDesc(description, stat, statParseVariations, level, 'last');
      
    })

    return description;
  }

  parseDesc(description: string, stat, statParseVariations: string[], levelNum: number, parseType: 'first' | 'middle' | 'last') {
    statParseVariations.forEach(parseVariation => {

      let multiplier = 1;
      let suffix = '';
      let prefix = '';

      // add level image if it's not level 1
      let level = `<span class="skill-level"> <img class="level" src="assets/icons/skillLevels/${levelNum+1}.png" /> </span>`;
      if(levelNum > 5) {
        level = `<span class="skill-level"> <img class="mastery-img" src="assets/icons/skillLevels/${levelNum+1}.png" /> </span>`;
      } else if(levelNum == 0) {
        level = '';
      }

      // add special symbols
      if(parseVariation.includes('%')) {
        multiplier = 100;
        suffix = '%'
      } else if(parseVariation.includes(':s')) {
        suffix = ':s'
      }
      if(parseVariation.includes('+')) {
        prefix = '+'
      }

      let statValue = (stat.value*multiplier).toString();
      if(stat.value*multiplier % 1 != 0) {

        // due to float imprecision some stats can look like 100.000001%
        if(stat.value*multiplier > 100) {
          statValue = (stat.value*multiplier).toFixed(0);
        } 

        // for values less than 100% it's usually better to show decimal places
        else {
          statValue = (stat.value*multiplier).toFixed(2);
        }
      }

      // during parsing, the tilde (~) lets 'middle' parsing know if to add more levels (as seen in continuousParse() parse variations)
      switch(parseType) {
        case 'first':
          description = this.replaceWholeWord(description, parseVariation, `${prefix}${statValue}${suffix} ${level} ${stat.name}${suffix}~`)
        break; case 'middle':
          description = this.replaceWholeWord(description, parseVariation, ` ${prefix}(${statValue}${suffix} ${level}) ${stat.name}${suffix}~`)
        break; case 'last':
          description = this.replaceWholeWord(description, parseVariation, ` ${prefix}(${statValue}${suffix} ${level})`, true)
      }
    })

    return description;

  }

  // since some stat names can have overlapping words, use this function instead of string.replace()
  replaceWholeWord(string: string, toCheck: string, replacement: string, isFinal: boolean = false) {
    const split = string.split(/[\{\} ]/);
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

  cleanUpSkillDescription(string: string) {

    // regex contains colon (:) and whitespace
    // colon is for 's' representing seconds in stats, which is removed so the 's' letter is isolated and can be grouped with the value
    const split = string.split(/[\: ]/);
    
    let result = '';

    for(let i = 0; i < split.length; i++) {
      const word = split[i];

      if(word == '-') {
        split[i] = ''
      }

      // grouping 's' with the number before it to form a second
      if(split[i+1] == 's') {
        split[i] += 's';
        split[i+1] = ''
      }
    
    }

    split.forEach(word => {
      result += word + ' '
    })

    return result;
  }
  
  // for skills with text like 'reduced slightly', descriptive words are removed and replaced with actual values
  parseUnnumberedStats(description: string, skill: Skill) {
    const split = description.split(' ');
    for(let i = 0; i < split.length; i++) {
      let word = split[i];
      
      if(word == 'reduces') {
        split[i] = 'reduced'
      }

      if(word == 'moderately') {

        // a value less than 0 means it's negative, therefore it's reducing *by* and not *to*
        if(skill.levels[0].stats[0].value < 0) {
          split[i] = 'by base_attack_time:0%';
        } else {
          split[i] = 'to base_attack_time:0%';
        }
      }

      if(word == 'Minor') {
        split[i] = 'base_attack_time:s'
      }
    }

    let result = '';
    split.forEach(word => {
      result += word + ' ';
    })

    return result;
  }

  getRanges(skill: Skill, firstSkillLevel, lastSkillLevel) {
    let ranges: {
      id: string;
      level: number;
    }[] = [];

    let lastRange: string = '';
    let maxLevel = (this.operator.rarity > 3) ? 10: 7;
    for(let i = firstSkillLevel; i < Math.min(lastSkillLevel+1, maxLevel); i++) {
      if(skill.levels[i].range != null && skill.levels[i].range != lastRange) {
        ranges.push({
          id: skill.levels[i].range,
          level: i+1
        });
        lastRange = skill.levels[i].range;
      }
    }

    return ranges;
  }

  getMiscSkillStats(skill: any, miscStat: 'duration' | 'spCost' | 'initialSp', firstSkillLevel, lastSkillLevel) {
    let previousValue: number = -999;
    let stats: {
      value: number;
      level: string;
    }[] = [];

    // just push the one level that's selected
    if(firstSkillLevel == lastSkillLevel) {
      stats.push({value: skill.levels[firstSkillLevel][miscStat], level: firstSkillLevel+1});
    } else {
      let maxLevel = (this.operator.rarity > 3) ? 10: 7;
      for(let i = firstSkillLevel; i < Math.min(lastSkillLevel+1, maxLevel); i++) {
        if(this.selectedSkillLevels[i]) {
          const thisStat = skill.levels[i][miscStat];

          // only add values that are not the same as previous
          if(thisStat != previousValue) {
            stats.push({value: thisStat, level: i+1});
            previousValue = thisStat;
          }

        }
      }
    }

    return stats;
  }

  toggleSkillLevel(level: number) {
    this.sliderLevel = 0;

    this.selectedSkillLevels[level] = !this.selectedSkillLevels[level];

    // default to SL1 if none are active
    let shouldReset = true;
    for(let i = 0; i < 10; i++) {
      if(this.selectedSkillLevels[i]) {
        shouldReset = false;
        break;
      }
    }
    if(shouldReset) {
      this.selectedSkillLevels[0] = true;
    }

    this.getSkillDescriptions();
  }

  clearSkillLevels() {
    for(let i = 0; i < 10; i++) {
      this.selectedSkillLevels[i] = false;
    }
    this.selectedSkillLevels[0] = true;

    this.getSkillDescriptions();
  }

  usingSlider() {
    for(let i = 0; i < 10; i++) {
      this.selectedSkillLevels[i] = false;
    }
    this.selectedSkillLevels[this.sliderLevel] = true;

    this.getSkillDescriptions();
  }

}

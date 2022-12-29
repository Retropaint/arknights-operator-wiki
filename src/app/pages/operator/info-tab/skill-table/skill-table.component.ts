import { Component, Input, OnInit, ViewChildren } from '@angular/core';
import { Doctor } from 'src/app/interfaces/doctor';
import { FinalizedSkill } from 'src/app/interfaces/finalized-skill';
import { Operator, Skill } from 'src/app/interfaces/operator';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-skill-table',
  templateUrl: './skill-table.component.html',
  styleUrls: ['./skill-table.component.scss'],
})
export class SkillTableComponent implements OnInit {

  // for use in HTML
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

  skills: FinalizedSkill[] = [];

  sliderLevel: number = 0;

  doctor: Doctor;
  
  // keeps track of previous stat values to prevent repetition
  previousStatValues: {
    name: string,
    value: number
  }[] = [];

  @ViewChildren('description') descs: any;

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

      let newSkill: FinalizedSkill = {
        id: skill.id,
        iconId: skill.iconId,
        name: skill.name,
        description: skill.description,
        recoveryType: {
          name: skill.spType,
          tip: this.getSpTypeTip(skill.spType)
        },
        eliteUnlockReq: skill.eliteUnlockReq,
        activationType: skill.activationType,
        spCosts: this.getMiscSkillStats(skill, 'spCost', firstSelectedSkillLevel, lastSelecedSkillLevel),
        initialSp: this.getMiscSkillStats(skill, 'initialSp', firstSelectedSkillLevel, lastSelecedSkillLevel),
        durations: this.getMiscSkillStats(skill, 'duration', firstSelectedSkillLevel, lastSelecedSkillLevel),
        ranges: this.getRanges(skill, firstSelectedSkillLevel, lastSelecedSkillLevel)
      }

      newSkill.description = newSkill.description.replace('HP_RECOVERY_PER_SEC', 'hp_recovery_per_sec');
      newSkill.description = newSkill.description.replace('hp_recovery_per_sec_BY_MAX_HP_RATIO', "hp_recovery_per_sec_by_max_hp_ratio");
      newSkill.description = newSkill.description.replace('ABILITY_RANGE_FORWARD_EXTEND', "ability_range_forward_extend");

      // here's where the skill parsing magic happens!
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

    this.manualEdits();

    // add tooltips
    setTimeout(() => {
      for(let i = 0; i < this.descs._results.length; i++) {
        const desc = this.descs._results[i];
        desc.nativeElement.innerHTML = this.skills[i].description;
      }
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

      // these values will be checked again to prevent repetition
      this.previousStatValues.push({name: stat.name, value: stat.value})

      description = this.parseDesc(description, stat, strings, level, 'first');

    })

    return description;
  }

  continuousParse(skill: Skill, description: string, level: number) {
    
    skill.levels[level].stats.forEach(stat => {

      if(this.hasRepetition(stat)) {
        return;
      }

      // parsed stats will always leave a tilde (~) to let it know this is where parsing continues, so check for it
      const statParseVariations = [
        `${stat.name}~`,
        `${stat.name}%~`,
        `${stat.name}:s~`,
        `${stat.name}+~`
      ];

      description = this.parseDesc(description, stat, statParseVariations, level, 'middle');
      
    })

    return description;
  }

  lastParse(skill: Skill, description: string, level: number) {
    
    skill.levels[level].stats.forEach(stat => {

      if(this.hasRepetition(stat)) {
        description = this.replaceWholeWord(description, stat.name + '~', '');
        description = this.replaceWholeWord(description, stat.name + '%~', '');
        description = this.replaceWholeWord(description, stat.name + ':s~', '');
        return;
      }

      // parsed stats will always leave a tilde (~) to let it know this is where parsing continues, so check for it
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

      // add level image if level is not 1
      let level = `<span class="skill-level"> <img class="level" src="assets/icons/skillLevels/${levelNum+1}.png" /> </span>`;
      if(levelNum > 5) {
        level = `<span class="skill-level"> <img class="mastery-img" src="assets/icons/skillLevels/${levelNum+1}.png" /> </span>`;
      } else if(levelNum == 0) {
        level = '';
      }

      let multiplier = 1;
      let suffix = '';
      let prefix = '';

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

      // remove floating point imprecision (otherwise percentages will look like 100.000000001%)
      const fixedStatValue = (stat.value*multiplier).toFixed(2);
      if(fixedStatValue.includes('.00')) {
        statValue = fixedStatValue.slice(0, fixedStatValue.indexOf('.'));
      }

      // during parsing, the tilde (~) lets middle and last parsing know if to add more levels
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

    let index = split.findIndex(word => word == toCheck);
    // use while-loop to replace all instances of checked word
    while(index != -1) {
      split[index] = replacement;
      index = split.findIndex(word => word == toCheck);
    }

    let result = '';
    split.forEach(word => {
      result += word + ' ';
    })
    return result;
  }

  cleanUpSkillDescription(string: string) {

    // colon is for 's' representing seconds in stats, which is removed so the 's' letter is isolated and can be grouped with the value
    const split = string.split(/[\: ]/).filter(word => word != '');

    let result = '';

    for(let i = 0; i < split.length; i++) {
      const word = split[i];

      // when parsing negative stat values, the actual negative symbol is isolated, so put it out of its misery
      if(word == '-') {
        split[i] = ''
      }

      // grouping 's' with the number before it, to form a second
      if(split[i+1] == 's') {
        split[i] += 's';
        split[i+1] = ''
      }
    }

    // turn split into an actual string
    for(let i = 0; i < split.length; i++) {
      // don't add spacing between punctuation, and plus (it should be grouped with its stat value)
      if(split[i+1] != '</span>.' && split[i+1] != '</span>;' && split[i+1] != '</span>,' && split[i] != '+') {
        result += split[i] + ' '
      } else {
        result += split[i]
      }
    }

    return result;
  }
  
  // for skills with text like 'reduced slightly', descriptive words are removed and replaced with actual values
  parseUnnumberedStats(description: string, skill: Skill) {
    const name = this.operator.name;

    const split = description.split(' ');
    for(let i = 0; i < split.length; i++) {
      let word = split[i];
      
      // wording lol
      if(word == 'reduces') {
        split[i] = 'reduced'
      }

      if(word == 'moderately' || word == 'dramatically' || word == 'slightly' || word == 'significantly') {
        } else {
          let suffix = '0%';
          if(name == 'Ptilopsis') {
            suffix = 's';
          }

          // a value less than 0 means it's negative, therefore it's reduced/raised *by* and not *to*
          if(skill.levels[0].stats[0].value < 0) {
            split[i] = 'by base_attack_time:' + suffix;
          } else {
            split[i] = 'to base_attack_time:' + suffix;
          }
        }
      }

      if(word == 'increases' && split[i-1].includes('negative-effect')) {
        if(name == 'Vulcan' || name == 'Ambriel') {
          split[i] += ' by base_attack_time:s';
        } else {
          split[i] += ' by base_attack_time:0%';
        }
      }

      if(name == 'Exusiai') {
        if(word == 'Minor' || word == 'Moderate' || word == 'Significant') {
          split[i] = 'base_attack_time:s';
        }
      }
    }

    // turn split into an actual string
    let result = '';
    split.forEach(word => {
      result += word + ' ';
    })

    return result;
  }

  hasRepetition(stat: {value: number, name: string}) {
    const index = this.previousStatValues.findIndex(findingStat => findingStat.name == stat.name)

    if(index != -1 && this.previousStatValues[index].value == stat.value) {
      return true;
    } else {
      this.previousStatValues[index].value = stat.value;
      return false;
    }
  }

  getRanges(skill: Skill, firstSkillLevel, lastSkillLevel) {
    let ranges: {
      id: string;
      level: number;
    }[] = [];

    // prevents repetition
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

  getMiscSkillStats(skill: Skill, miscStat: 'duration' | 'spCost' | 'initialSp', firstSkillLevel, lastSkillLevel) {
    let previousValue: number = -999;
    let stats: {
      value: number;
      level: number;
    }[] = [];

    if(firstSkillLevel == lastSkillLevel) {
  
      // just push the one level that's selected
      stats.push({value: skill.levels[firstSkillLevel][miscStat], level: firstSkillLevel+1});
  
    } else {

      // push all selected levels (if they do not repeat stats, that is)
      let maxLevel = (this.operator.rarity > 3) ? 10: 7;
      for(let i = firstSkillLevel; i < Math.min(lastSkillLevel+1, maxLevel); i++) {
        if(this.selectedSkillLevels[i]) {
          const thisStat = skill.levels[i][miscStat];

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

    // put away the slider bar
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

  getSpTypeTip(spType: string) {
    switch(spType) {
      case 'Auto Recovery':
        return 'Generates 1 SP per second'
      case 'Defensive Recovery':
        return 'Generates 1 SP when hit'
      case 'Offensive Recovery':
        return 'Generates 1 SP per attack'
      case 'Passive':
        return 'Does not generate SP'
    }
  }

  manualEdits() {
    switch(this.operator.name) {
      case 'Mayer':
        for(let i = 6; i < 10; i++) {
          if(this.selectedSkillLevels[i]) {
            const m0img = '<span class="skill-level"> <img class="mastery-img" src="assets/icons/skillLevels/7.png" /> </span>'
            this.skills[0].description += "(Allies on Robotters' four adjacent tiles also gain the same buff " + m0img + ')';
            break;
          }
        }
      break; case 'Exusiai':
        this.skills[2].description += '<br>(this skill is bugged and triggers twice, giving twice the values than shown in-game)';
    }
  }

}

import { Component, Input, OnInit, ViewChildren } from '@angular/core';
import { Doctor } from 'src/app/interfaces/doctor';
import { FinalizedSkill } from 'src/app/interfaces/finalized-skill';
import { Operator, Skill } from 'src/app/interfaces/operator';
import { DoctorService } from 'src/app/services/doctor.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-skill-table',
  templateUrl: './skill-table.component.html',
  styleUrls: ['./skill-table.component.scss'],
})
export class SkillTableComponent implements OnInit {

  // for use in HTML
  objectKeys = Object.keys;

  @Input() operator: Operator;

  selectedSkillLevels = [
    true,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true
  ];

  skills: FinalizedSkill[] = [];

  sliderLevel: number = 0;

  doctor: Doctor;

  imgSrcs: string[] = [];
  imgLoaded: boolean[] = [];

  @ViewChildren('description') descs: any;

  constructor(
    private doctorService: DoctorService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.doctor = this.doctorService.doctor;
    this.getSkillDescriptions();

    for(let i = 0; i < this.operator.skills.length; i++) {
      this.imgSrcs.push(`assets/skills/skill_icon_${this.operator.skills[i].iconId}.png`);
      this.imgLoaded.push(false);
    }
  }

  getSkillDescriptions() {
    this.skills = [];

    let firstSkilLevel: number;
    let lastSkillLevel: number;
    for(let i = 0; i < 10; i++) {
      if(this.selectedSkillLevels[i] && firstSkilLevel == null) {
        firstSkilLevel = i;   
      }
      if(this.selectedSkillLevels[i]) {
        lastSkillLevel = i;
      }
    }

    let i = 0;
    this.operator.skills.forEach(skill => {
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
        spCosts: this.getMiscSkillStats(skill, 'spCost', firstSkilLevel, lastSkillLevel),
        initialSp: this.getMiscSkillStats(skill, 'initialSp', firstSkilLevel, lastSkillLevel),
        durations: this.getMiscSkillStats(skill, 'duration', firstSkilLevel, lastSkillLevel),
        ranges: this.getRanges(skill, firstSkilLevel, lastSkillLevel)
      }

      newSkill.description = this.parseSkillDesc(skill, newSkill.description);
      newSkill.description = this.cleanUpSkillDescription(newSkill.description);

      this.skills.push(newSkill)

      i++;
    })

    this.manualEdits();

    setTimeout(() => {
      for(let i = 0; i < this.descs._results.length; i++) {
        this.sharedService.addTooltips(this.descs.toArray()[i], this.skills[i].description);
      }
    })
  }

  parseSkillDesc(skill: Skill, description: string) {
    // level doesn't matter, just need the stats
    skill.levels[0].stats.forEach(stat => {

      const variants = [
        `+{${stat.name}:0%}`,
        `{${stat.name}:0%}`,
        `-{-${stat.name}:0%}`,
        `{-${stat.name}:0%}`,
        `-{-${stat.name}}`,
        `+{${stat.name}}`,
        `{${stat.name}}`,
        `${stat.name}:0%`,
        `${stat.name}:s`,
        `${stat.name}`,
      ];

      const variant = variants.find(variation => description.includes(variation))
      if(variant) {
        description = description.replace(variant, this.parseStat(skill, stat.name, variant));
        return;
      }
    })

    return description;
  }

  parseStat(skill: Skill, statName: string, variant: string) {
    let result: string = "";

    let suffix = '';
    if(variant.includes('%')) {
      suffix = '%';
    } else if(variant[variant.length - 1] == 's') {
      suffix = 's';
    }
    let prefix = '';
    if(variant.includes('+')) {
      prefix = '+';
    }

    let firstLevel = true;
    let prevVal = 9999;
    for(let i = 0; i < ((this.operator.rarity > 3) ? 10 : 7); i++) {
      if(this.selectedSkillLevels[i]) {
        let val = skill.levels[i].stats.find(stat => stat.name == statName).value;
        if(prevVal == val) {
          continue;
        }
        prevVal = val;

        if(suffix == '%') {
          val *= 100;
          if(val.toFixed(2).includes('.00') || val.toFixed(2).includes('.99')) {
            val = Math.floor(val);
          }
        }

        if(firstLevel) {
          result += `${prefix}${val}${suffix} `;
        } else {
          result += `(${prefix}${val}${suffix} ${this.getLevelImg(i)}) `;
        }
        
        firstLevel = false;
      }
    }

    return result;
  }

  getLevelImg(level: number) {
    let img = `<span class="skill-level"> <img class="level" src="assets/icons/skillLevels/${level+1}.png" /> </span>`;
    if(level > 5) {
      img = `<span class="skill-level"> <img class="mastery-img" src="assets/icons/skillLevels/${level+1}.png" /> </span>`;
    } else if(level == 0) {
      img = '';
    }
    return img;
  }

  cleanUpSkillDescription(string: string) {

    // colon is for 's' representing seconds in stats, which is removed so the 's' letter is isolated and can be grouped with the value
    const split = string.split(/[\: ]/).filter(word => word != '');

    let result = '';

    for(let i = 0; i < split.length; i++) {
      const word = split[i];

      // some negative symbols get isolated from parsing
      if(word == '-') {
        split[i] = ''
      }

      // grouping 's' with the number before it, to form a second
      if(split[i+1] == 's') {
        split[i] += 's';
        split[i+1] = ''
      }
    }

    for(let i = 0; i < split.length; i++) {
      if(split[i+1] != '</span>.' && split[i+1] != '</span>;' && split[i+1] != '</span>,' && split[i] != '+') {
        result += split[i] + ' '
      } else {
        result += split[i]
      }
    }
    return result;
  }

  getRanges(skill: Skill, firstSkillLevel, lastSkillLevel) {
    let ranges: {
      id: string;
      level: number;
    }[] = [];

    let prevRange: string = '';
    
    let maxLevel = (this.operator.rarity > 3) ? 10: 7;
    for(let i = firstSkillLevel; i < Math.min(lastSkillLevel+1, maxLevel); i++) {
      if(skill.levels[i].range != null && skill.levels[i].range != prevRange) {
        ranges.push({
          id: skill.levels[i].range,
          level: i+1
        });
        prevRange = skill.levels[i].range;
      }
    }

    return ranges;
  }

  getMiscSkillStats(skill: Skill, miscStat: 'duration' | 'spCost' | 'initialSp', firstSkillLevel, lastSkillLevel) {
    let prevValue: number = -999;
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

          if(thisStat != prevValue) {
            stats.push({value: thisStat, level: i+1});
            prevValue = thisStat;
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
        for(let i = 3; i < 10; i++) {
          if(this.selectedSkillLevels[i]) {
            this.skills[2].description += "<br>(this skill is bugged and triggers twice, giving twice the values than shown in-game)";
            break;
          }
        }
    }
  }

  noLocalImg(i: number) {
    this.imgSrcs[i] = `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/skills/skill_icon_${this.operator.skills[i].iconId}.png`;
  }

}

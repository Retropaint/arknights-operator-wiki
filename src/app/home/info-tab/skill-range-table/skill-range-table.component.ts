import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-skill-range-table',
  templateUrl: './skill-range-table.component.html',
  styleUrls: ['./skill-range-table.component.scss'],
})
export class SkillRangeTableComponent implements OnInit {

  @Input() operator: Operator;

  skillRanges: {
    skillName: string,
    ranges: {
      id: string,
      level: number
    }[]
  }[] = [];

  constructor() { }

  ngOnInit() {
    this.operator.skills.forEach(skill => {

      let lastRange: string = '';
      for(let i = 6; i < 10; i++) {

        // add new range
        if(skill.levels[i].range != null && lastRange != skill.levels[i].range) {

          // do not record this range again
          lastRange = skill.levels[i].range;

          if(!this.skillRanges.find(thisSkill => thisSkill.skillName == skill.name)) {
            this.skillRanges.push({
              skillName: skill.name,
              ranges: []
            })
          }

          this.skillRanges[this.skillRanges.findIndex(thisSkill => thisSkill.skillName == skill.name)].ranges.push({
            id: skill.levels[i].range,
            level: (i-6)
          }) 

        }

        if(this.operator.rarity < 4) {
          break;
        }

      }
    })
  }

}

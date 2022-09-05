import { Component, Input, OnInit } from '@angular/core';
import { BaseSkill, Operator } from 'src/app/interfaces/operator';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-base-skill-table',
  templateUrl: './base-skill-table.component.html',
  styleUrls: ['./base-skill-table.component.scss'],
})
export class BaseSkillTableComponent implements OnInit {

  @Input() operator: Operator;

  dbBaseSkills: BaseSkill[];

  descriptions: string[] = [];

  constructor(
    private database: DatabaseService
  ) { }

  ngOnInit() {
    this.dbBaseSkills = this.database.baseSkills;

    this.combineSkillDsecriptions();
  }

  combineSkillDsecriptions() {
    this.operator.baseSkills.forEach(skill => {
      if(skill.levels.length == 1) {
        this.descriptions.push(skill.levels[0].description);
        return;
      }

      let description = '';
      let index = 0;
      skill.levels.forEach(level => {
        if(index == 0) {
          description = level.description;
        } else {

          // check difference between both descriptions to get the level
          const previousSplit = description.split(' ');
          const split = level.description.split(' ');
          for(let i = 0; i < split.length; i++) {
            if(previousSplit[i] != split[i]) {
              previousSplit[i] += ` (${split[i]} ${this.eliteImg(level.requirements.elite)})`;
            }
          }

          let result = '';
          previousSplit.forEach(word => {
            result += ' ' + word;
          })
          this.descriptions.push(result);
        }
        index++;
      })
    })
  }

  eliteImg(elite: number) {
    console.log(elite)
    return `<span> <img class="elite-img" src="assets/icons/elitePhases/${elite}.webp" /> </span>`
  } 
}

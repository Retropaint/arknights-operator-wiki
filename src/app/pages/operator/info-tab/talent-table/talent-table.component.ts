import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren  } from '@angular/core';
import { Operator, Talent } from 'src/app/interfaces/operator';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-talent-table',
  templateUrl: './talent-table.component.html',
  styleUrls: ['./talent-table.component.scss'],
  providers: [DialogService],

})
export class TalentTableComponent implements OnInit, AfterViewInit {

  @Input() operator: Operator;

  talents: any = [];

  condenseElites: boolean = true;

  @ViewChildren('description') descs: QueryList<ElementRef>;
  
  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.operator.talents.forEach(talent => {

      const name = this.operator.name;
      if(name == 'Castle-3' || name == 'THRM-EX' || name == 'Lancet-2' || name == '\'Justice Knight\'') {
        this.talents.push(this.parseRobotTalent(talent));
      } else {
        this.talents.push(this.parseTalent(talent))
      }

    })
  }

  ngAfterViewInit() {
    for(let i = 0; i < this.talents.length; i++) {
      this.sharedService.addTooltips(this.descs.toArray()[i], this.talents[i].description, false);
    }
  }

  parseRobotTalent(talent: Talent) {
    let differences = [];
    let firstDescSplit: string[] = null;
    let finalSplit: string[] = null;

    let index = 0;
    talent.descriptions.forEach(desc => {
      const split = desc.split(' ');
      if(!firstDescSplit) {
        firstDescSplit = split.slice();
        finalSplit = split.slice();
      } else {
        for(let i = 0; i < split.length; i++) {
          if(firstDescSplit[i] != split[i]) {
            differences.push(split[i]);

            finalSplit[i] += '<span class="positive-effect">  (' + split[i] + this.potImg(index) + ') </span>';
          }
        }
        index++;
      }
    })

    let result = '';
    finalSplit.forEach(word => {
      result += word + ' ';
    })
    
    const newTalent = {
      description: result,
      unlockConditions: this.getRelevantUnlockConditions(talent.unlockConditions[0]),
      level: 0,
      name: talent.name
    }

    return newTalent;
  }

  parseTalent(talent: Talent) {
    // if no talent, just return normal description
    if(!talent.descriptions[1]) {
      const newTalent = {
        description: talent.descriptions[0],
        unlockConditions: this.getRelevantUnlockConditions(talent.unlockConditions[0]),
        level: 0,
        name: talent.name
      }
      return newTalent;
    }
    
    let split = talent.descriptions[1].split(' ');

    for(let i = 0; i < split.length; i++) {
      if(split[i].includes('positive-effect')) {
        // remove closing bracket, add pot img, and re-add bracket
        split[i+1] = split[i+1].slice(0, split[i+1].length-1) + ` ${this.potImg(talent.unlockConditions[1].potential-1)})`;
      }
    }

    let result = '';
    for(let i = 0; i < split.length; i++) {
      result += split[i] + ' ';
    }

    const newTalent = {
      description: result,
      unlockConditions: this.getRelevantUnlockConditions(talent.unlockConditions[0]),
      level: 0,
      name: talent.name
    }

    return newTalent;
  }

  getRelevantUnlockConditions(unlockConditions: any) {
    if(unlockConditions.elite == 0) {
      delete(unlockConditions.elite);
    }
    if(unlockConditions.level == 1) {
      delete(unlockConditions.level);
    }
    if(unlockConditions.potential == 0) {
      delete(unlockConditions.potential);
    }
    return unlockConditions;
  }

  emptyArray(size: number) {
    return new Array(size);
  }

  eliteImg(elite: number) {
    return `<span> <img class="elite-img" src="assets/icons/elitePhases/${elite}.webp" /></span>`
  } 
  
  potImg(pot: number) {
    return `<span> <img class="elite-img" src="assets/icons/potentials/${pot}.webp" /></span>`
  } 
}

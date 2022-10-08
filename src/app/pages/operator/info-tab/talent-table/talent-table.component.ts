import { Component, Input, OnInit, ViewChildren  } from '@angular/core';
import { Operator, Talent } from 'src/app/interfaces/operator';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-talent-table',
  templateUrl: './talent-table.component.html',
  styleUrls: ['./talent-table.component.scss'],
  providers: [DialogService],

})
export class TalentTableComponent implements OnInit {

  @Input() operator: Operator;

  talents: any = [];

  condenseElites: boolean = true;

  @ViewChildren('description') descs: any;
  
  constructor(
    private dialogService: DialogService
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

    setTimeout(() => {
      for(let i = 0; i < this.operator.talents.length; i++) {
        const desc = this.descs._results[i];
        desc.nativeElement.innerHTML = this.talents[i].description;
      }
    })
  }

  parseRobotTalent(talent: Talent) {
    let differences = [];
    let firstDescSplit: string[] = null;
    let finalSplit: string[] = null;

    talent.descriptions.forEach(desc => {
      const split = desc.split(' ');
      if(!firstDescSplit) {
        firstDescSplit = split.slice();
        finalSplit = split.slice();
      } else {
        for(let i = 0; i < split.length; i++) {
          if(firstDescSplit[i] != split[i]) {
            differences.push(split[i]);

            finalSplit[i] += '<span class="positive-effect">  (' + split[i] + ') </span>';
          }
        }
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

    // store pot bonuses
    let potBonuses: string[] = [];
    for(let i = 0; i < split.length; i++) {
      if(split[i].includes('positive-effect')) {

        // do not get the closing bracket of pot bonus
        let finalizedPotBonus = split[i+1].slice(0, split[i+1].length-1);

        // if there is whitespace between stat and positive effect span, get the next word
        if(split[i+1] == '') {
          finalizedPotBonus = split[i+2].slice(0, split[i+2].length-1);
        }

        potBonuses.push(finalizedPotBonus);
      }
    }

    // remove static pot bonus
    for(let i = 0; i < split.length; i++) {
      if(split[i].includes('positive-effect')) {
        split[i-1] = ``;
        split[i] = `~`;
        split[i+1] = '';
        split[i+2] = '';
      }
    }

    // replace tilde (~) with pot bonus
    let index = 0; // keeps track of pot bonus to add
    for(let i = 0; i < split.length; i++) {
      if(!potBonuses[index]) {
        break;
      }
      if(split[i].includes('~')) {
        // remove tilde
        split[i] = split[i].slice(0, split[i].length - 1);
        
        let finalizedPotBonus = potBonuses[index];
        // there is a HORRENDOUS bug where whitespace and opening bracket are somehow treated as a single character and I have no idea what's causing it
        // god bless the code spaghetti monster I'll be counting my days
        // the solution here is to just remove them and add a new opening bracket
        finalizedPotBonus = finalizedPotBonus.slice(1, finalizedPotBonus.length);
        finalizedPotBonus = '(' + finalizedPotBonus;
        split[i] += "<span class='positive-effect'> " + finalizedPotBonus + this.potImg(talent.unlockConditions[1].potential-1) + ') </span>';
        index++;
      }
    }

    // remove stray tildes
    for(let i = 0; i < split.length; i++) {
      if(split[i].includes('~')) {
        split[i] = split[i].slice(0, split[i].length - 1);
      }
    }

    // turn split into an actual string
    let result = '';
    for(let i = 0; i < split.length; i++) {
      if(split[i][split.length - 1] == ' ' || split[i+1] != null && split[i+1][0] == ' ') {
        result += split[i];
      } else {
        result += split[i] + ' ';
      }
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

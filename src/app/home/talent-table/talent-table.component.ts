import { Component, Input, OnInit  } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';
import { DialogService } from 'primeng/dynamicdialog';
import { TalentModalComponent } from 'src/app/modals/talent-modal/talent-modal.component';

@Component({
  selector: 'app-talent-table',
  templateUrl: './talent-table.component.html',
  styleUrls: ['./talent-table.component.scss', '../table.scss'],
  providers: [DialogService],

})
export class TalentTableComponent implements OnInit {

  @Input() operator: Operator;

  talents: any = [];
  
  constructor(
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.operator.talents.forEach(talent => {

      let newTalent = [];
      
      for(let i = 0; i < talent.maxLevel; i++) {
        const newTalentLevel = {
          description: talent.descriptions[i],
          unlockConditions: this.getRelevantUnlockConditions(talent.unlockConditions[i]),
          level: i+1,
          name: talent.name
        }
        newTalent.push(newTalentLevel);
      }

      this.talents.push(newTalent);

    })
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

  async openTalentModal(chosenTalent: number) {
    this.dialogService.open(
      TalentModalComponent,
      {
        data: {
          talent: this.talents[chosenTalent]
        },
        maskStyleClass: 'test',
        dismissableMask: true,
        modal: true,
        transitionOptions: '0ms'
      }
    )
  }

}

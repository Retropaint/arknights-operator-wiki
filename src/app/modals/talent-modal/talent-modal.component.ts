import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-talent-modal',
  templateUrl: './talent-modal.component.html',
  styleUrls: ['./talent-modal.component.scss', '../../home/table.scss'],
})
export class TalentModalComponent implements OnInit {

  constructor(
    private ref: DynamicDialogRef, 
    private config: DynamicDialogConfig,
  ) { }

  ngOnInit() {
  }

}

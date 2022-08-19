import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-elite-unlock-reqs-table',
  templateUrl: './elite-unlock-reqs-table.component.html',
  styleUrls: ['./elite-unlock-reqs-table.component.scss', '../table.scss'],
})
export class EliteUnlockReqsTableComponent implements OnInit {

  @Input() operator: Operator;

  constructor() { }

  ngOnInit() {
    
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-skill-level-unlock-reqs-table',
  templateUrl: './skill-level-unlock-reqs-table.component.html',
  styleUrls: ['./skill-level-unlock-reqs-table.component.scss'],
})
export class SkillLevelUnlockReqsTableComponent implements OnInit {

  @Input() operator: Operator;

  constructor() { }

  ngOnInit() {}

  emptyArray(num: number) {
    return new Array(num);
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-skill-mastery-unlock-reqs-table',
  templateUrl: './skill-mastery-unlock-reqs-table.component.html',
  styleUrls: ['./skill-mastery-unlock-reqs-table.component.scss', '../table.scss'],
})
export class SkillMasteryUnlockReqsTableComponent implements OnInit {

  @Input() operator: Operator;

  constructor() { }

  ngOnInit() {}

}

import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-base-skill-table',
  templateUrl: './base-skill-table.component.html',
  styleUrls: ['./base-skill-table.component.scss'],
})
export class BaseSkillTableComponent implements OnInit {

  @Input() operator: Operator;

  constructor() { }

  ngOnInit() {}

}

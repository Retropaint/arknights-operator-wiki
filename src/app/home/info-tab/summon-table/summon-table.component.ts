import { Component, Input, OnInit } from '@angular/core';
import { Summon } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-summon-table',
  templateUrl: './summon-table.component.html',
  styleUrls: ['./summon-table.component.scss'],
})
export class SummonTableComponent implements OnInit {

  @Input() summon: Summon;

  constructor() { }

  ngOnInit() {}

}

import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-potential-table',
  templateUrl: './potential-table.component.html',
  styleUrls: ['./potential-table.component.scss'],
})
export class PotentialTableComponent implements OnInit {

  @Input() operator: Operator;

  constructor() { }

  ngOnInit() {}

}

import { Component, OnInit } from '@angular/core';
import { Operator } from '../interfaces/operator';
import { AceshipService } from '../services/aceship.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', 'table.scss'],
})
export class HomePage implements OnInit {

  operator: Operator;
  operatorImageLink: string;
  randomOperatorNum: number;

  constructor(
    private aceship: AceshipService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.randomOperatorNum = Math.round(Math.random() * this.aceship.operators.length - 1);
      this.operator = this.aceship.operators[62];
      if(this.operator.id) {
        this.operatorImageLink = this.operator.id.slice(2, this.operator.id.length);
      }
    })
  }

}

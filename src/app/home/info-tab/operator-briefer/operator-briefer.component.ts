import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-operator-briefer',
  templateUrl: './operator-briefer.component.html',
  styleUrls: ['./operator-briefer.component.scss'],
})
export class OperatorBrieferComponent implements OnInit {

  @Input() operator: Operator;

  operatorImageLink: string;

  constructor(
    private database: DatabaseService
  ) { }

  ngOnInit() {
    this.operatorImageLink = this.operator.id;

    const specialReserveOp = this.database.specialReserveOps.find(operator => operator == this.operator.name) != null;

    if(this.operator != null && this.operator.id && !specialReserveOp) {

      if(this.operator.name.includes('Reserve Operator')) {
        this.operatorImageLink = this.operator.id.slice(0, this.operator.id.length - 2);
      } else {
        this.operatorImageLink = this.operator.id.slice(2, this.operator.id.length);
      }

    }
  }

}

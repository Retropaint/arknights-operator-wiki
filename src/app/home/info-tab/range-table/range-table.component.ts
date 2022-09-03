import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-range-table',
  templateUrl: './range-table.component.html',
  styleUrls: ['./range-table.component.scss'],
})
export class RangeTableComponent implements OnInit {

  @Input() operator: Operator;

  ranges: {
    id: string,
    elite: number
  }[] = [];

  constructor() { }

  ngOnInit() {
    this.operator.statBreakpoints.forEach(breakpoint => {
      if(!this.ranges.find(range => range.id == breakpoint.rangeId)) {
        this.ranges.push({
          id: breakpoint.rangeId,
          elite: breakpoint.elite
        })
      }
    })
  }

}

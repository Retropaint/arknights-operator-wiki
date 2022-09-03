import { Component, Input, OnInit } from '@angular/core';
import { Grid } from 'src/app/interfaces/range';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-range-grid',
  templateUrl: './range-grid.component.html',
  styleUrls: ['./range-grid.component.scss'],
})
export class RangeGridComponent implements OnInit {

  @Input() id: string;
  @Input() size: number = 20;

  grid: Grid;

  constructor(
    private database: DatabaseService
  ) { }

  ngOnInit() {
    this.grid = this.database.ranges.find(range => range.id == this.id).grid;
  }

  squareIs(row: number, currentCol: number): string {
    if(this.grid.startingSquare.row == row && this.grid.startingSquare.col == currentCol) {
      return 'start';
    }

    // check if range grid has a square in this specific column and row
    for(let rangeCol of this.grid.squares[row]) {
      if(rangeCol == currentCol) {
        return 'range';
      }
    }
    
    return 'empty';
  }

  emptyArray(num: number) {
    return new Array(num);
  }

}

export interface Range {
  id: string;
  grid: Grid; 
}

export interface Grid {
  maxCols: number;
  startingSquare: {
    row: number,
    col: number
  }
  squares: number[][];
}
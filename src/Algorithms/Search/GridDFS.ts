/*
  class that generates states of every step for depth first search algorithm.
*/
class GridDFS {
  grid: number[][];
  start: [number, number] = [0, 0];
  target: number;
  path: Array<[number, number]>;
  position!: [number, number];

  constructor(grid: number[][], target: number, start?: [number, number]) {
    this.grid = grid;
    this.target = target
    if (start != undefined) {
      this.start = start
    }
  }

  *generator() {
    let stack: Array<[number, number]> = [this.start];
    let dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    this.path.push(this.start);
    while (stack) {
      let [x, y] = stack.pop();

      // check if already visited
      if (this.grid[x][y] == -1 || this.grid[x][y] == 1) {
        continue;
      }

      // backtracking
      while (!this._isNeighbor([x, y], this.path[-1])) {
        this.position = this.path.pop();
        yield true;
      }

      this.position = [x, y];
      yield true;

      if (this.grid[x][y] == 2) {
        break;
      }

      for (let [movX, movY] of dirs) {
        let newX = x + movX, newY = y + movY;
        if (0 <= newX && 
          newX < this.grid.length && 
          0 <= newY && 
          newY < this.grid[0].length) {
            stack.push([movX, movY]);
        }
      }
    }
  }

  _isNeighbor(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) == 1;
  }
}
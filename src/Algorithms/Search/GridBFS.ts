/*
  class that generates states of every step for depth first search algorithm.
*/
class GridBFS {
    grid: number[][];
    start: [number, number] = [0, 0];
    target: number;
    path: Array<[number, number]> = new Array();
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
      let dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]]
      while (stack) {
        let newStack = [];
        for(let i=0; i<stack.length; i++) {
            let [x, y] = stack.pop();
  
            // check if already visited
            if (this.grid[x][y] == -1 || this.grid[x][y] == 1) {
              continue;
            }
      
            // backtracking
            while (this.path.length != 0 && !this._isNeighbor([x, y], this.path.at(-1))) {
              this.position = this.path.pop();
              yield this.position;
            }
      
            this.position = [x, y];
            this.path.push(this.position);
            yield this.position;
      
            if (this.grid[x][y] == 2) {
              break;
            }
      
            this.grid[x][y] = -1;
      
            for (let [movX, movY] of dirs) {
              let newX = x + movX, newY = y + movY;
              if (0 <= newX && 
                newX < this.grid.length && 
                0 <= newY && 
                newY < this.grid[0].length) {
                  newStack.push([newX, newY]);
              }
            }
        };
        stack = newStack;
      }
    }
  
    _isNeighbor(a, b) {
      return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) == 1;
    }
  }
  
  export default GridBFS;
/*
  class that generates states of every step for depth first search algorithm.
*/
class GridBFS {
  grid: number[][];
  start: [number, number] = [0, 0];
  target: number;
  position!: [number, number];
  deque: Array<[number, number]> = [];
  _stateGenerator;

  constructor(grid: number[][], target: number, start?: [number, number]) {
    this.grid = grid;
    this.target = target;
    if (start != undefined) {
      this.start = start;
    }
    this._stateGenerator = this._generator();
    // unshift is equivalent to add to front.
    this.deque.unshift(this.start);
    console.log(this.deque);
  }

  *_generator() {
    let dirs = [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
    ];
    while (this.deque.length) {
      for (let _ = 0; _ < this.deque.length; _++) {
        // shift is the equvalient of remove from front.
        let [x, y] = this.deque.shift();
        let nodeVal = this.grid[x][y];

        // check if already visited OR an obstacle
        if (nodeVal == -1 || nodeVal == 1) {
          continue;
        }

        this.position = [x, y];
        this.deque.push(this.position);

        if (this.grid[x][y] == 2) {
          return this._stateSnapshot();
        }

        for (let [movX, movY] of dirs) {
          let newX = x + movX,
            newY = y + movY;
          if (
            0 <= newX &&
            newX < this.grid.length &&
            0 <= newY &&
            newY < this.grid[0].length
          ) {
            this.deque.push([newX, newY]);
          }
        }
        this.grid[x][y] = -1;
        yield this._stateSnapshot();
      }
    }
  }

  _stateSnapshot(): any {
    return new GridState(
      structuredClone(this.grid),
      structuredClone(this.deque),
      this.position.slice(),
    );
  }

  next(): any {
    let { value, done } = this._stateGenerator.next();
    return value;
  }

  setState(state): void {
    this.grid = structuredClone(state.grid);
    this.deque = structuredClone(state.deque);
    this.position = structuredClone(state.position);
    //reset state generator to reflect new state.
    this._stateGenerator = this._generator();
  }
}

function GridState(grid, deque, position) {
  this.grid = grid;
  this.deque = deque;
  this.position = position;
}

export default GridBFS;

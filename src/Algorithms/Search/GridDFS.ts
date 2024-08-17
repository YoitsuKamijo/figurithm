/*
  class that generates states of every step for depth first search algorithm.
*/
class GridDFS {
  path;
  position;
  grid;
  target;
  start;
  stack;
  _stateGenerator;

  constructor(grid: number[][], target: number, start?: [number, number]) {
    this.path = new Array();
    this.position;
    this.grid = grid;
    this.target = target;
    this.start = [0, 0];
    if (start != undefined) {
      this.start = start;
    }
    this.stack = [this.start];
    this._stateGenerator = this._generator();
  }

  *_generator() {
    let dirs = [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
    ];
    while (this.stack) {
      let [x, y] = this.stack.at(-1);

      // check if already visited
      if (this.grid[x][y] < 0 || this.grid[x][y] == 1) {
        this.stack.pop();
        continue;
      }

      // backtracking
      while (
        this.path.length != 0 &&
        !this._isNeighbor([x, y], this.path.at(-1))
      ) {
        this.position = this.path.pop();
        this.grid[this.position[0]][this.position[1]] = -2;
        yield this._stateSnapshot();
      }

      this.position = this.stack.pop();
      this.path.push(this.position);

      if (this.grid[x][y] == 2) {
        return this._stateSnapshot();
      }
      this.grid[x][y] = -1;

      for (let [movX, movY] of dirs) {
        let newX = x + movX,
          newY = y + movY;
        if (
          0 <= newX &&
          newX < this.grid.length &&
          0 <= newY &&
          newY < this.grid[0].length
        ) {
          this.stack.push([newX, newY]);
        }
      }
      yield this._stateSnapshot();
    }
  }

  _isNeighbor(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) == 1;
  }

  _stateSnapshot() {
    return new GridState(
      structuredClone(this.grid),
      structuredClone(this.stack),
      structuredClone(this.path),
      this.position.slice(),
    );
  }

  next() {
    let { value, done } = this._stateGenerator.next();
    return value;
  }

  setState(state) {
    this.grid = structuredClone(state.grid);
    this.stack = structuredClone(state.stack);
    this.path = structuredClone(state.path);
    this.position = structuredClone(state.position);
    //reset state generator to reflect new state.
    this._stateGenerator = this._generator();
  }
}

function GridState(grid, stack, path, position) {
  this.grid = grid;
  this.stack = stack;
  this.path = path;
  this.position = position;
}

export default GridDFS;

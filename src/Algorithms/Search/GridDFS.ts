/*
  class that generates states of every step for depth first search algorithm.
*/
export default function GridDFS(grid: number[][], target: number, start?: [number, number]) {
    this.path = new Array();
    this.position;
    this.grid = grid;
    this.target = target
    this.start = [0, 0];
    if (start != undefined) {
      this.start = start
    }
    this.stack = [this.start];
    this.states = [];
    this.iterator = _generator.bind(this)();

  function* _generator() {
    let dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]]
    while (this.stack) {
      let [x, y] = this.stack.pop();

      // check if already visited
      if (this.grid[x][y] == -1 || this.grid[x][y] == 1) {
        continue;
      }

      // backtracking
      while (this.path.length != 0 && !this._isNeighbor([x, y], this.path.at(-1))) {
        this.position = this.path.pop();
        yield this.position;
        this._saveState(-1);
      }

      this.position = [x, y];
      this.path.push(this.position);
      yield this.position;
      this._saveState(1);

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
            this.stack.push([newX, newY]);
        }
      }
    }
  }

  this._isNeighbor = (a, b) => {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) == 1;
  }

  this._saveState = (action) => {
    let curPos = [...this.position];
    let val = this.grid[curPos[0]][curPos[1]];
    this.states.push({
      "pos": curPos,
      "val": val,
      "action": action
    })
  }

  this.next = () => {
    let {value, done} = this.iterator.next();
    return value;
  }

  this.prev = () => {
    if (!this.states || !this.states.length) {
      return;
    }
    let state = this.states.pop();
    let pos = state["pos"];
    this.position = pos;
    this.grid[pos[0]][pos[1]] = state["val"];
    if (state["action"] == 1) {
      this.path.pop();
      this.stack.push(pos);
    } else {
      this.path.push(pos);
      
    }
    // reset state in generator with new position and values;
    this.iterator = _generator.bind(this)();
    return this.position;
  }
}
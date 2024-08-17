/*
  class that generates states of every step for binary search algorithm.
*/
class BinarySearch {
  arr: number[];
  l: number;
  r: number;
  target: number;
  states: any[]
  _stateGenerator: any;

  constructor(arr: number[], target: number) {
    this.arr = arr;
    this.l = 0;
    this.r = arr.length - 1;
    this.target = target;
    this.states = [];
    this._stateGenerator = this._generator();
  }


  *_generator() {
    while (this.l < this.r) {
      let mid = Math.floor((this.l + this.r)/2);
      let value = this.arr[mid];
      yield [this.arr, this.l, this.r, mid];
      this.states.push([this.l, this.r, mid])
      if (value >= this.target) {
        this.r = mid;
      } else {
        this.l = mid + 1;
      }
    }
    yield [this.arr, this.l, this.r, null]
  }

  next() {
    let {value, done} = this._stateGenerator.next();
    return value;
  }

  prev() {
    if (!this.states || !this.states.length) {
      return;
    }
    let state = this.states.pop();
    this.l = state[0]
    this.r = state[1]
    // reset state in generator with new l and r.
    this._stateGenerator = this._generator();
    return [this.arr, ...state];
  }
}

export default BinarySearch;
/*
  class that generates states of every step for binary search algorithm.
*/
class BinarySearch {
  arr: number[];
  target: number;
  l: number;
  r: number;

  constructor(arr: number[], target: number) {
    this.arr = arr;
    this.target = target;
    this.l = 0;
    this.r = this.arr.length - 1;
  }

  *generator() {
    while (this.l < this.r) {
      let mid = Math.floor((this.l + this.r)/2);
      let value = this.arr[mid];
      yield [this.arr, this.l, this.r, mid];
      if (value >= this.target) {
        this.r = mid;
      } else {
        this.l = mid + 1;
      }
    }
    yield [this.arr, this.l, this.r, null]
  }
}

export default BinarySearch;

import Action from "../Utils/Action";
import Command from "../Utils/Command";

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
      let mid = Math.floor(this.l + this.r);
      let value = this.arr[mid];
      yield new Command.Builder()
        .setColor("#FFD700")
        .setAction(Action.HIGHLIGHT)
        .setValues([mid])
        .build();
      if (value >= this.target) {
        this.r = mid;
        yield new Command.Builder()
          .setColor("#F0F2F2")
          .setValues(
            Array.from(
              { length: this.r - this.l },
              (_, idx) => this.l + idx + 1,
            ),
          )
          .build();
      } else {
        this.l = mid + 1;
        yield new Command.Builder()
          .setColor("#F0F2F2")
          .setValues(Array.from({ length: this.l }, (_, idx) => idx))
          .build();
      }
    }
  }
}

export default BinarySearch;

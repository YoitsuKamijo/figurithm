import {
  Camera,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import { GridSearchAnimator } from "./GridSearchAnimator";
import { BACKGROUND_COLOR } from "../constants";
import GridBFS from "../../algorithms/search/GridBFS";
import {
  DARK_MATERIAL,
  GLOW_MATERIAL,
  GREEN_MATERIAL,
  RED_MATERIAL,
} from "../utils/materials";

class BfsAnimator extends GridSearchAnimator {
  targetPos!: number[];
  darkenedMesh: number[] = new Array();

  // target bounce
  vibrateBaseX!: number;
  vibrateSpeed: number = 0.1;
  vibrateStep: number = 0;

  constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
    let gridValues = [
      [0, 0, 1, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 0, 1, 1, 0],
      [1, 0, 1, 1, 1],
      [0, 0, 0, 0, 2],
    ];
    let target = 2;
    let targetPos = [3, 3];
    console.log(gridValues);
    super(renderer, scene, camera, new GridBFS(gridValues, target));

    this.targetPos = targetPos;
    this.vibrateBaseX =
      this.grid.meshes[this.targetPos[0]][this.targetPos[1]].position.x;
  }

  nonBloomed() {
    const position = this.algorithm.position;
    if (position == undefined) {
      return;
    }

    const algoGrid = this.algorithm.grid;

    for (let x = 0; x < algoGrid.length; x++) {
      for (let y = 0; y < algoGrid[0].length; y++) {
        let val = algoGrid[x][y];
        if (val == 1) {
          this.grid.meshes[x][y].material = RED_MATERIAL;
        } else if (val == 0 || val == 2) {
          this.grid.meshes[x][y].material = DARK_MATERIAL;
        } else {
          this.grid.meshes[x][y].material = GLOW_MATERIAL;
        }
      }
    }

    if (algoGrid[position[0]][position[1]] == this.algorithm.target) {
      this.grid.meshes[position[0]][position[1]].material = GREEN_MATERIAL;
    }
  }

  restoreMaterial() {
    if (this.algorithm.position == undefined) {
      return;
    }

    let meshes = this.grid.meshes;
    for (let x = 0; x < meshes.length; x++) {
      for (let y = 0; y < meshes[0].length; y++) {
        if (meshes[x][y].material.color.getHex() == 0x000000) {
          meshes[x][y].material = new MeshPhongMaterial({
            color: BACKGROUND_COLOR,
          });
        }
      }
    }
  }

  vibrateTarget() {
    let x = this.targetPos[0],
      y = this.targetPos[1];
    let targetCurX: number = this.grid.meshes[x][y].position.x;
    const position = this.algorithm.position;

    // if target has been found, and has returned to original height, no more bounces;
    if (
      position.length &&
      position[1] == position[2] &&
      Math.abs(targetCurX - this.vibrateBaseX) < 0.01
    ) {
      this.grid.meshes[x][y].position.x = this.vibrateBaseX;
      return;
    }
    this.vibrateStep = (this.vibrateStep + this.vibrateSpeed) % Math.PI;
    this.grid.meshes[x][y].position.x =
      this.vibrateBaseX + 0.05 * Math.abs(Math.sin(this.vibrateStep));
  }

  static creator(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
    return new BfsAnimator(renderer, scene, camera);
  }
}

export default BfsAnimator;

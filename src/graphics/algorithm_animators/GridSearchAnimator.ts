import { Camera, Scene, WebGLRenderer } from "three";
import Grid from "../utils/Grid";
import { SelectiveBloomEffectComposer } from "../post_processing/SelectiveBloomEffectComposer";

export class GridSearchAnimator {
  scene!: Scene;
  algorithm!: any;
  grid!: Grid;
  effectComposer!: any;
  states: any[] = new Array();

  constructor(
    renderer: WebGLRenderer,
    scene: Scene,
    camera: Camera,
    algorithm,
  ) {
    this.scene = scene;
    this.algorithm = algorithm;
    this.grid = new Grid(this.algorithm.grid);
    this.grid.addToScene(scene);

    this.effectComposer = new SelectiveBloomEffectComposer(
      renderer,
      scene,
      camera,
    );
    this.effectComposer.setPreBloomProcess(this.nonBloomed.bind(this));
    this.effectComposer.setPreRenderProcess(this.restoreMaterial.bind(this));
  }

  next() {
    let ret = this.algorithm.next();
    if (!ret) return;
    this.states.push(ret);
  }

  prev() {
    if (this.states.length <= 1) {
      return;
    }
    this.states.pop();
    let lastState = this.states.at(-1);
    this.algorithm.setState(lastState);
  }

  nonBloomed() {}

  restoreMaterial() {}

  render() {
    this.effectComposer.render();
  }

  dispose() {
    this.grid.cleanUp();
  }
}

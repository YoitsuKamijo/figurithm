import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import {
  Camera,
  Color,
  LinearFilter,
  Renderer,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";

import vertexShader from "../shaders/neonBloom/vertex.glsl";
import fragmentShader from "../shaders/neonBloom/fragment.glsl";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";

export class SelectiveBloomEffectComposer {
  renderer!: WebGLRenderer;
  scene!: Scene;
  camera!: Camera;

  renderPass!: RenderPass;
  bloomPass!: UnrealBloomPass;

  bloomComposer!: EffectComposer;
  finalComposer!: EffectComposer;

  preBloomProceses?: () => void;
  preRenderProcess?: () => void;

  constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    const renderSize: Vector2 = renderer.getSize(new Vector2());

    this.renderPass = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(renderSize, 0.6, 0.05, 0);

    this.bloomComposer = new EffectComposer(renderer);
    this.bloomComposer.renderToScreen = false;
    // This line might be sus
    this.bloomComposer.setSize(renderSize.x, renderSize.y);
    this.bloomComposer.addPass(this.renderPass);
    this.bloomComposer.addPass(this.bloomPass);

    const glowMaterial = new ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      defines: {},
      precision: "lowp",
    });
    const glowPass = new ShaderPass(glowMaterial, "baseTexture");
    glowPass.needsSwap = true;

    let renderTarget = new WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat,
      },
    );
    this.finalComposer = new EffectComposer(this.renderer, renderTarget);
    this.finalComposer.addPass(this.renderPass);
    this.finalComposer.addPass(glowPass);
    // const outputPass = new OutputPass();
    let smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
    this.finalComposer.addPass(smaaPass);
  }

  setPreBloomProcess(preprocess: () => void) {
    this.preBloomProceses = preprocess;
  }

  setPreRenderProcess(preprocess: () => void) {
    this.preRenderProcess = preprocess;
  }

  render() {
    if (this.preBloomProceses != undefined) {
      this.preBloomProceses();
    }
    let og_background = this.scene.background;
    this.scene.background = new Color(0x000000);
    this.bloomComposer.render();
    if (this.preRenderProcess != undefined) {
      this.preRenderProcess();
    }
    // this.scene.background = og_background;
    this.finalComposer.render();
  }
}

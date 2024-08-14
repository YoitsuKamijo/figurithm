import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { Camera, Color, Renderer, Scene, ShaderMaterial, Vector2, WebGLRenderer } from "three";
import { render } from '@testing-library/react';

export class SelectiveBloomEffectComposer {
    renderer!: WebGLRenderer;
    scene!: Scene;
    camera!: Camera;

    renderPass!: RenderPass;
    bloomPass!: UnrealBloomPass;

    effectComposer!: EffectComposer;
    finalComposer!: EffectComposer;

    preBloomProceses?: () => void;
    preRenderProcess?: () => void;

    vShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
        }`;

    fShader = `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        void main() {
            gl_FragColor = (texture2D(baseTexture, vUv) + vec4(0.3) * texture2D(bloomTexture, vUv));
        }
    `; 

    constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        const renderSize: Vector2 = renderer.getSize(new Vector2());

        this.renderPass = new RenderPass(this.scene, this.camera);
        this.bloomPass = new UnrealBloomPass(
            renderSize,
            0.5,
            1,
            0.5
        );

        this.effectComposer = new EffectComposer(renderer);
        this.effectComposer.renderToScreen = false;
        // This line might be sus
        this.effectComposer.setSize(renderSize.x, renderSize.y);
        this.effectComposer.addPass(this.renderPass);
        this.effectComposer.addPass(this.bloomPass);

        const glowMaterial = new ShaderMaterial({
            uniforms: {
                baseTexture: {value: null},
                bloomTexture: {value: this.effectComposer.renderTarget2.texture}
            },
            vertexShader: this.vShader,
            fragmentShader: this.fShader,
            defines: {}
        })
        const glowPass = new ShaderPass(
            glowMaterial,
            'baseTexture'
        )
        glowPass.needsSwap = true;

        this.finalComposer = new EffectComposer(this.renderer);
        this.finalComposer.addPass(this.renderPass);
        this.finalComposer.addPass(glowPass);
        const outputPass = new OutputPass();
        this.finalComposer.addPass(outputPass);
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
        this.effectComposer.render();
        if (this.preRenderProcess != undefined) {
            this.preRenderProcess();
        }
        this.scene.background = og_background;
        this.finalComposer.render();
    }
}
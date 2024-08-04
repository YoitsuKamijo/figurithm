import { AnyPixelFormat, Camera, MeshBasicMaterial, MeshPhongMaterial, Scene, WebGLRenderer } from "three";
import BinarySearch from "../algorithms/Search/BinarySearch";
import Grid from "./utils/Grid";
import { SelectiveBloomEffectComposer } from "./utils/SelectiveBloomEffectComposer";

export class BinarySearchAnimator {
    scene!:Scene;
    arr!:number[];
    target!:number;
    targetIdx!:number;
    algorithm!:any;
    grid!:Grid;
    effectComposer!: any;
    state!: any;
    darkenedMesh: number[] = new Array();
    self:any;
    // target bounce
    bounceBaseHeight!:number;
    bounceSpeed:number = 0.025;
    bounceStep:number = 0;

    constructor(renderer: WebGLRenderer, scene:Scene, camera: Camera) {
        this.scene = scene;
        this.arr = [1, 5, 7, 10, 11, 11, 13, 15, 16];
        this.target = 11;
        this.targetIdx = 4;
        this.algorithm = new BinarySearch(this.arr, this.target);
        this.grid = new Grid([this.arr]);
        this.grid.addToScene(scene);

        this.effectComposer = new SelectiveBloomEffectComposer(renderer, scene, camera);
        this.effectComposer.setPreBloomProcess(this.nonBloomed.bind(this));
        this.effectComposer.setPreRenderProcess(this.restoreMaterial.bind(this));

        this.bounceBaseHeight = this.grid.meshes[0][this.targetIdx].position.y;
    }

    *next() {
        let state: any;
        for (state of this.algorithm.generator()) {
            this.state = state;
            console.log(this.state);
            yield true;
        }
        yield false;
    }

    nonBloomed() {
        if (this.state == undefined || this.state.length == 0) {
            return;
        }

        const l = this.state[1];
        const r = this.state[2];
        const mid = this.state[3];
        const darkMaterial = new MeshBasicMaterial({color: 0x000000});
        const greenMaterial = new MeshBasicMaterial({color: 0x00FF00});
        const glowMaterial = new MeshBasicMaterial({color: 0xF5F5DC});
        
        for (let i = 0; i < this.state[0].length; i++) {
            if (i == l && l == r && this.algorithm.arr[i] == this.algorithm.target){
                this.grid.meshes[0][i].material = greenMaterial;
            } else if (i == l || i == r) {
                this.grid.meshes[0][i].material = glowMaterial;
            } else {
                this.darkenedMesh.push(i);
                this.grid.meshes[0][i].material = darkMaterial;
            }
        }
    }

    restoreMaterial() {
        if (this.state == undefined || this.state.length == 0) {
            return;
        }

        const l = this.state[1];
        const r = this.state[2];
        const mid = this.state[3];
        for (let i of this.darkenedMesh) {

            this.grid.meshes[0][i].material = new MeshPhongMaterial({color: 0x808080});
        }  
        this.darkenedMesh = new Array();
    }

    bounceTarget() {
        let targetCurY:number = this.grid.meshes[0][this.targetIdx].position.y;

        // if target has been found, and has returned to original height, no more bounces;
        if (this.state.length && this.state[1] == this.state[2] && Math.abs(targetCurY-this.bounceBaseHeight) < 0.01) {
            this.grid.meshes[0][this.targetIdx].position.y = this.bounceBaseHeight;
            return;
        }
        this.bounceStep += this.bounceSpeed;
        this.grid.meshes[0][this.targetIdx].position.y = this.bounceBaseHeight + 0.25 * Math.abs(Math.sin((this.bounceStep)));
    }

    render() {
        this.bounceTarget();
        this.effectComposer.render();
    }
}
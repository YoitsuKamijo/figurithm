import { Camera, MeshBasicMaterial, MeshPhongMaterial, Scene, WebGLRenderer } from "three";
import Grid from "../utils/Grid";
import GridDFS from "../../algorithms/search/GridDFS";
import { SelectiveBloomEffectComposer } from "../utils/SelectiveBloomEffectComposer";
import Obsidian from "../materials/Obsidian";
import { BACKGROUND_COLOR, CANCEL_COLOR, ERROR_COLOR, PRIMARY_COLOR, SUCCESS_COLOR } from "../constants";

export class GridSearchAnimator {
    scene!:Scene;
    gridValues!:number[][];
    target!:number;
    targetPos!:[number, number];
    algorithm!:any;
    grid!:Grid;
    effectComposer!: any;
    state!: any;
    darkenedMesh: number[] = new Array();
    self:any;
    // target bounce
    vibrateBaseX!:number;
    vibrateSpeed:number = 0.1;
    vibrateStep:number = 0;

    constructor(renderer: WebGLRenderer, scene:Scene, camera: Camera) {
        this.scene = scene;
        this.gridValues = [
            [0, 0, 1, 0, 0],
            [1, 0, 0, 0, 0],
            [0, 0, 1, 1, 0],
            [1, 0, 1, 1, 1],
            [0, 0, 0, 0, 2]
        ];
        this.target = 2;
        this.targetPos = [3, 3];
        this.algorithm = new GridDFS(this.gridValues, this.target);
        this.grid = new Grid(this.gridValues);
        this.grid.addToScene(scene);

        this.effectComposer = new SelectiveBloomEffectComposer(renderer, scene, camera);
        this.effectComposer.setPreBloomProcess(this.nonBloomed.bind(this));
        this.effectComposer.setPreRenderProcess(this.restoreMaterial.bind(this));

        this.vibrateBaseX = this.grid.meshes[this.targetPos[0]][this.targetPos[1]].position.x;
    }

    next() {
        let ret = this.algorithm.next();
        if (!ret) return;
        this.state =ret;
    }

    prev() {
        this.state = this.algorithm.prev();
    }

    nonBloomed() {
        if (this.state == undefined) {
            return;
        }

        const darkMaterial = new MeshBasicMaterial({color: 0x000000});
        const greenMaterial = new MeshBasicMaterial({color: SUCCESS_COLOR});
        const glowMaterial = new MeshBasicMaterial({color: PRIMARY_COLOR});
        const orangeMaterial = new MeshBasicMaterial({color: CANCEL_COLOR});
        const redMaterial = new MeshBasicMaterial({color: ERROR_COLOR});

        let algoGrid = this.algorithm.grid;

        for (let x = 0; x < algoGrid.length; x++) {
            for (let y = 0; y < algoGrid[0].length; y++) {
                if (algoGrid[x][y] == 1) {
                    this.grid.meshes[x][y].material = redMaterial;
                } else {
                    this.grid.meshes[x][y].material = darkMaterial;
                }
            }
        }

        for (let pos of this.algorithm.path) {
            this.grid.meshes[pos[0]][pos[1]].material = glowMaterial;
        }

        if (algoGrid[this.state[0]][this.state[1]] == -1) {
            this.grid.meshes[this.state[0]][this.state[1]].material = orangeMaterial;
        } else if (algoGrid[this.state[0]][this.state[1]] == this.target) {
            this.grid.meshes[this.state[0]][this.state[1]].material = greenMaterial;
        } else {
            this.grid.meshes[this.state[0]][this.state[1]].material = glowMaterial;
        }
    }

    restoreMaterial() {
        if (this.state == undefined) {
            return;
        }

        let meshes = this.grid.meshes;
        for (let x = 0; x < meshes.length; x++) {
            for (let y = 0; y < meshes[0].length; y++) {
                if (meshes[x][y].material.color.getHex() == 0x000000) {
                    meshes[x][y].material = new MeshPhongMaterial({color: BACKGROUND_COLOR});
                }
            }
        }
    }

    vibrateTarget() {
        let x = this.targetPos[0], y = this.targetPos[1];
        let targetCurX:number = this.grid.meshes[x][y].position.x;

        // if target has been found, and has returned to original height, no more bounces;
        if (this.state.length && this.state[1] == this.state[2] && Math.abs(targetCurX-this.vibrateBaseX) < 0.01) {
            this.grid.meshes[x][y].position.x = this.vibrateBaseX;
            return;
        }
        this.vibrateStep = (this.vibrateStep + this.vibrateSpeed) % Math.PI;
        this.grid.meshes[x][y].position.x = this.vibrateBaseX + 0.05 * Math.abs(Math.sin((this.vibrateStep)));
    }

    render() {
        this.effectComposer.render();
    }

    dispose() {
        this.grid.cleanUp();
    }

    static creator(renderer: WebGLRenderer, scene:Scene, camera: Camera) {
        return new GridSearchAnimator(renderer, scene, camera);
    }
}
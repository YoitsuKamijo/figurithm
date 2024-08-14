import { useState } from 'react';
import { BoxGeometry, MeshPhongMaterial, Scene, Mesh, Box3, Vector3 } from 'three';
import { TupleType } from 'typescript';
import Puck from './Puck';

const SPACING = 0.05;

export default class Grid {
    meshTemplate:any = Puck;
    rows!:number;
    cols!:number;
    meshes:Mesh[][] = new Array();
    values:any[][] = new Array();

    constructor(values:any[][], mesh?:Mesh) {
        this.rows = values.length;
        this.cols = values[0].length;
        this.values = values;
        if (mesh != undefined) {
            this.meshTemplate = mesh;
        }
        this._initialize();
    }

    setMesh(mesh:any) {
        this.meshTemplate = mesh;
        this.meshes = new Array();
        this._initialize();
    }

    _initialize() {
        for (let i=0; i<this.rows; i++) {
            let row:Mesh[] = new Array();
            for (let j=0; j<this.cols; j++) {
                let clone = this.meshTemplate(Math.max(0.5, this.values[i][j]));
                row.push(clone);
            }
            this.meshes.push(row);
        }
    }

    addToScene(scene:Scene) {
        let [x, y, z] = this._getOrigin();
        console.log(x, y, z)
        for (let i=0; i<this.rows;i++) { 
            for (let j=0;j<this.cols;j++) {
                let mesh = this.meshes[i][j];

                //place the bottom the mesh at height of 0;
                mesh.geometry.computeBoundingBox();
                let yPos = (mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y)/2;
                mesh.position.set(x + j + j* SPACING, y + yPos, z + i + i * SPACING);
                scene.add(mesh);
            }
        }
    }

    _getOrigin() {
        const boundingBox = new Box3().setFromObject(Puck());
        const puckDiameter = boundingBox.getSize(new Vector3()).x;
        let x = ((this.cols - 1) * (puckDiameter + SPACING)) / 2;
        let z = ((this.rows - 1) * (puckDiameter + SPACING)) / 2;
        return new Vector3(-x, 0, -z)
    }


    cleanUp() {
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.cols; j++) {
                this.meshes[i][j].removeFromParent();
            }
        }
    }
}
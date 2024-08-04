import { useState } from 'react';
import { BoxGeometry, MeshPhongMaterial, Scene, Mesh } from 'three';
import { TupleType } from 'typescript';
import Puck from './Puck';

const SPACING = 0.05;

export default class Grid {
    meshTemplate:any = Puck;
    x!:number;
    y!:number;
    meshes:Mesh[][] = new Array();
    values:any[][] = new Array();

    constructor(values:any[][], mesh?:Mesh) {
        this.y = values.length;
        this.x = values[0].length;
        console.log(this.x);
        console.log(this.y);
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
        for (let i=0; i<this.y; i++) {
            let row:Mesh[] = new Array();
            for (let j=0; j<this.x; j++) {
                let clone = this.meshTemplate(this.values[i][j])
                row.push(clone);
            }
            this.meshes.push(row);
        }
        console.log(this.meshes[0][0])
    }

    addToScene(scene:Scene) {
        for (let i=0; i<this.y;i++) { 
            for (let j=0;j<this.x;j++) {
                let mesh = this.meshes[i][j];
                console.log(mesh.uuid);

                //place the bottom the mesh at height of 0;
                mesh.geometry.computeBoundingBox();
                let yPos = (mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y)/2;
                console.log(i, j)
                console.log(i + i * SPACING, yPos, j + j* SPACING);
                mesh.position.set(j + j* SPACING, yPos, i + i * SPACING);
                scene.add(mesh);
            }
        }
    }
}
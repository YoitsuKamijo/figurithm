import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as dat from 'dat.gui';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BinarySearchAnimator } from './algorithm_animators/BinarySearchAnimator';
import { GridSearchAnimator } from './algorithm_animators/GridSearchAnimator';

export default class Display extends Component {
    clock = new THREE.Clock();
    delta = 0;
    // 30 fps
    frameRate = 1 / 30;

    mount: HTMLDivElement;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    animator: GridSearchAnimator;
    requestID: number;
    orbitCtrl: OrbitControls;
    

    componentDidMount() {
        this.sceneSetUp();
        this.animate();
        this.runSteps();
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
        this.orbitCtrl.dispose();
    }

    sceneSetUp = () => {
        // get container dimensions and use them for scene sizing
        const width = this.mount.clientWidth;
        const height = window.innerHeight;
        console.log(width, height)
        this.scene = new THREE.Scene();

        // defaults to 0, 0, 0
        this.camera = new THREE.PerspectiveCamera(75,  width / height, 0.1, 1000);
        this.camera.updateProjectionMatrix();
        this.camera.position.set(4, 5, 15)

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);

        // Static lighting
        const color = 0xffffff;
        const intensity = 1.5;
        const light = new THREE.AmbientLight(color, intensity);
        this.scene.add(light);

        var pointLight = new THREE.PointLight(0xffffff, 1);
        this.camera.add(pointLight);
        this.scene.add(this.camera);

        // Camera control
        // CameraControls.install( { THREE: THREE } );
        // const clock = new THREE.Clock();
        // const cameraControls = new CameraControls( camera, renderer.domElement );
        this.orbitCtrl = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitCtrl.update();
        this.orbitCtrl.addEventListener('change', () => this.animator.render())

        //Visual helpers
        const gridHelper = new THREE.GridHelper(30);
        this.scene.add(gridHelper);

        // sets up the particular animator
        this.animator = new GridSearchAnimator(this.renderer, this.scene, this.camera);
        this.mount.appendChild( this.renderer.domElement ); 
    }

    handleWindowResize = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.renderer.setSize( width, height );
        this.camera.aspect = width / height;

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        this.camera.updateProjectionMatrix();
    };

    _timer = (ms) => new Promise(res => setTimeout(res, ms));

    async runSteps() {
        let counter = 1;
        let hasState: boolean;
        for (hasState of this.animator.next()) {
            counter += 1
            await this._timer(1500);
        }
        console.log(counter);
    }

    animate = () => {
        this.requestID = requestAnimationFrame(this.animate);
        this.delta += this.clock.getDelta();
        if (this.delta > this.frameRate) {
            this.animator.render();
            this.delta = this.delta % this.frameRate;
        }
    };

    render() {
        return <div ref={ref => (this.mount = ref)} />;
    }
}
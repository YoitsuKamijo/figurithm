import React, { Component, useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import * as dat from 'dat.gui';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BinarySearchAnimator } from './algorithm_animators/BinarySearchAnimator';
import { animatorMap } from "../components/constants";
import { OrganizeImportsMode } from "typescript";

export default function Display({algorithm}) {
    console.log('Display component: ', algorithm)
    const refContainer = useRef(null);
    const clock = new THREE.Clock();
    // 30 fps
    const frameRate = 1 / 30;
    let delta = 0;
    
    let sceneRef = useRef(null);
    let cameraRef = useRef(null);
    let rendererRef = useRef(null);
    let orbitCtrlRef = useRef(null);
    let animator: any;
    let requestID: number;
    
    useEffect(() => {
        sceneSetUp();
        animatorSetUp();
        animate();
        runSteps();
        window.addEventListener('resize', handleWindowResize);

        return () => {
            sceneCleanUp();
        };

    }, [algorithm])

    const sceneSetUp = () => {
        // get container dimensions and use them for scene sizing
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Setup camera if not setup
        if (!cameraRef.current) {
            // defaults to 0, 0, 0
            cameraRef.current = new THREE.PerspectiveCamera(75,  width / height, 0.1, 1000);
            cameraRef.current.updateProjectionMatrix();
            cameraRef.current.position.set(4, 5, 15);

            var pointLight = new THREE.PointLight(0xffffff, 1);
            cameraRef.current.add(pointLight);

        }
        
        if (!sceneRef.current) {
            sceneRef.current = new THREE.Scene();
            //Visual helpers
            const gridHelper = new THREE.GridHelper(30);
            sceneRef.current.add(gridHelper);

            // Static lighting
            const color = 0xffffff;
            const intensity = 1.5;
            const light = new THREE.AmbientLight(color, intensity);
            sceneRef.current.add(light);
            sceneRef.current.add(cameraRef.current);
        }

        if (!rendererRef.current) {
            rendererRef.current = new THREE.WebGLRenderer();
            rendererRef.current.setSize(width, height);
            refContainer.current && refContainer.current.appendChild(rendererRef.current.domElement);
        }

        orbitCtrlRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
        orbitCtrlRef.current.update();

        // Camera control
        // CameraControls.install( { THREE: THREE } );
        // const clock = new THREE.Clock();
        // const cameraControls = new CameraControls( camera, renderer.domElement );
    }

    const animatorSetUp = () => {
        animator = animatorMap[algorithm](rendererRef.current, sceneRef.current, cameraRef.current);
        orbitCtrlRef.current.addEventListener('change', () => {animator.render()});
    }

    const sceneCleanUp = () => {
        window.cancelAnimationFrame(requestID);
        window.removeEventListener('resize', handleWindowResize);
        // rendererRef.current.renderLists.dispose();
        animator.dispose();
        orbitCtrlRef.current.dispose();
        orbitCtrlRef.current = null;
    }

    const handleWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        rendererRef.current.setSize( width, height );
        cameraRef.current.aspect = width / height;

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        cameraRef.current.updateProjectionMatrix();
    };

    const _timer = (ms) => new Promise(res => setTimeout(res, ms));

    const runSteps = async() => {
        let counter = 1;
        let hasState: boolean;
        for (hasState of animator.next()) {
            counter += 1
            await _timer(1500);
        }
        console.log(counter);
    };

    const animate = () => {
        requestID = requestAnimationFrame(animate);
        delta += clock.getDelta();
        if (delta > frameRate) {
            animator.render();
            delta = delta % frameRate;
        }
    };

    return (
        <div ref={refContainer} />
    )
}
import React, { Component, useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import * as dat from 'dat.gui';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { animatorMap } from "../components/constants";
import { BACKGROUND_COLOR, CANCEL_COLOR, PRIMARY_COLOR } from "./constants";
import ControlBar from "./ControlBar";

export default function Display({ algorithm }) {
    const clock = new THREE.Clock();
    // 30 fps
    const frameRate = 1 / 30;
    let delta = 0;

    let [isPlaying, setIsPlaying] = useState(false);
    const refContainer = useRef(null);
    const animatorRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const orbitCtrlRef = useRef(null);
    let requestID: number;
    let animatorRunner: NodeJS.Timeout;

    useEffect(() => {
        setUpScene();
        setUpAnimator();
        window.addEventListener('resize', handleWindowResize);
        run();

        return () => {
            sceneCleanUp();
            clearInterval(animatorRunner);
        };

    }, [algorithm])

    useEffect(() => {
        if (isPlaying) {
            runAnimator();
        }
        return () => {
            clearInterval(animatorRunner);
        }
    }, [isPlaying])

    const setUpScene = () => {
        // get container dimensions and use them for scene sizing
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Setup camera if not setup
        if (!cameraRef.current) {
            // defaults to 0, 0, 0
            cameraRef.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            cameraRef.current.updateProjectionMatrix();
            cameraRef.current.position.set(0, 7, 10);

            // var pointLight = new THREE.PointLight(0xffffff, 1);
            // cameraRef.current.add(pointLight);

        }

        if (!sceneRef.current) {
            sceneRef.current = new THREE.Scene();
            //Visual helpers
            const gridHelper = new THREE.GridHelper(100, 100);
            sceneRef.current.add(gridHelper);

            // Static lighting
            const color = new THREE.Color(0xffffff);
            const intensity = 0.5;
            let dirLight = new THREE.DirectionalLight(0xffffff, intensity);
            dirLight.position.setScalar(1);
            const light = new THREE.AmbientLight(color, intensity);
            sceneRef.current.add(dirLight, light);
            sceneRef.current.add(cameraRef.current);
            sceneRef.current.background = new THREE.Color(BACKGROUND_COLOR);
        }

        if (!rendererRef.current) {
            rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            // rendererRef.current.setClearColor( 0x000000, 0 );
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

    const setUpAnimator = () => {
        animatorRef.current = animatorMap[algorithm](rendererRef.current, sceneRef.current, cameraRef.current);
        orbitCtrlRef.current.addEventListener('change', () => { animatorRef.current.render() });
    
    }

    const runAnimator = () => {
        animatorRunner = setInterval(() => {
            if (isPlaying) {
                animatorRef.current.next();
            }
        }, 1000);
    }

    const sceneCleanUp = () => {
        window.cancelAnimationFrame(requestID);
        window.removeEventListener('resize', handleWindowResize);
        // rendererRef.current.renderLists.dispose();
        animatorRef.current.dispose();
        orbitCtrlRef.current.dispose();
        orbitCtrlRef.current = null;
    }

    const handleWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        cameraRef.current.updateProjectionMatrix();
    };

    const _timer = (ms) => new Promise(res => setTimeout(res, ms));

    const handlePlay = () => {
        setIsPlaying(!isPlaying);
    }

    const handleRewind = () => {
        setIsPlaying(false);
        animatorRef.current.prev();
    }

    const handleForward = () => {
        setIsPlaying(false);
        animatorRef.current.next();
    }

    const run = () => {
        requestID = requestAnimationFrame(run);
        delta += clock.getDelta();
        if (delta > frameRate) {
            animatorRef.current.render();
            delta = delta % frameRate;
        }
    };

    return (
        <>
            <ControlBar
                isPlaying={isPlaying}
                handlePlay={handlePlay}
                handleRewind={handleRewind}
                handleForward={handleForward}>
            </ControlBar>
            <div ref={refContainer} />
        </>
    )
}
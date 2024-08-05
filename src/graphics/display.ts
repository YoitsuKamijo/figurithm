import * as dat from 'dat.gui';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BinarySearchAnimator } from './algorithm_animators/BinarySearchAnimator';
import { GridSearchAnimator } from './algorithm_animators/GridSearchAnimator';

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();

// defaults to 0, 0, 0
const camera = new THREE.PerspectiveCamera(75,  width / height, 0.1, 1000);
camera.updateProjectionMatrix();
camera.position.set(4, 5, 15)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
// add to document
document.body.appendChild(renderer.domElement);
// OR use ref as a mount point of the Three.js scene instead of the document.body
// refContainer.current && refContainer.current.appendChild( renderer.domElement );

// move z a little so the camera isn't insde the cube

// Static lighting
const color = 0xffffff;
const intensity = 1.5;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

var pointLight = new THREE.PointLight(0xffffff, 1);
camera.add(pointLight);
scene.add(camera);

// const animator = new BinarySearchAnimator(renderer, scene, camera);
const animator = new GridSearchAnimator(renderer, scene, camera);

// Camera control
// CameraControls.install( { THREE: THREE } );
// const clock = new THREE.Clock();
// const cameraControls = new CameraControls( camera, renderer.domElement );
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
orbit.addEventListener('change', () => animator.render())

//Visual helpers
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);
// const pLightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(pLightHelper);

//Mouse selector
const mousePosition = new THREE.Vector2();
// window.addEventListener('mousemove', function(e){
//     // calculating normalized values of mousPosition on a screen
//     mousePosition.x = (e.clientX/width) * 2 -1;
//     mousePosition.y = 1 - ((e.clientY/height) * 2);

// });

// register click event
// const rayCaster = new THREE.Raycaster();
// window.addEventListener('pointerdown', onObjectSelect);


// function onObjectSelect(e: PointerEvent) {
//     mousePosition.x = (e.clientX/width) * 2 -1;
//     mousePosition.y = 1 - ((e.clientY/height) * 2);

//     rayCaster.setFromCamera(mousePosition, camera);
//     const intersects = rayCaster.intersectObjects(scene.children, false);
//     if (intersects.length > 0) {
//         const object = intersects[0].object;
//         object.layers.toggle(BLOOM_SCENE);
//         render();
//     }
// }

let datGui!: dat.GUI;
function setDatGui() {
    if (datGui != undefined) {
        datGui.destroy();
    }
    datGui = new dat.GUI();
    const guiOptions = {
        highlightColor: 0xaaaaaa,
        wireframe: false
    };

    let puck: THREE.Mesh = animator.grid.meshes[0][0];

    datGui.addColor(guiOptions, "highlightColor").onChange(function(e) {
        puck.material.color.setHex(e);
        animator.render();
    });

    datGui.add(guiOptions, "wireframe").onChange(function(e) {
        puck.material.wireframe = e;
        animator.render();
    })
}

setDatGui();
const timer = ms => new Promise(res => setTimeout(res, ms));
async function runSteps() {
    let counter = 1;
    let hasState: boolean;
    for (hasState of animator.next()) {
        counter += 1
        await timer(1500);
        
    }
    console.log(counter);
}

runSteps();

// Cannot use this with postprocessing as of now
// renderer.setAnimationLoop(animator.render.bind(animator));

let clock = new THREE.Clock();
let delta = 0;
// 30 fps
let interval = 1 / 30;
const animate = () => {
    requestAnimationFrame(animate);
    delta += clock.getDelta();
    if (delta > interval) {
        animator.render();
        delta = delta % interval;
    }
};

animate();



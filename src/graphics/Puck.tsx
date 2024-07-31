import * as THREE from 'three';

const radiusTop =  0.5; 
const radiusBottom =  0.5;  
const height =  0.25;  
const radialSegments = 50;  
const geometry = new THREE.CylinderGeometry(
	radiusTop, radiusBottom, height, radialSegments );

export {geometry as Puck};
import * as THREE from "three";

const radiusTop = 0.5;
const radiusBottom = 0.5;
const height = 0.15;
const radialSegments = 50;

export default function Puck(heightMultiplier?: number) {
  if (heightMultiplier == undefined) {
    heightMultiplier = 1;
  }
  const geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height * heightMultiplier,
    radialSegments,
  );
  // geometry.translate(0, (height * heightMultiplier)/2, 0);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  return new THREE.Mesh(geometry, material);
}

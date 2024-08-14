import { MeshStandardMaterial } from "three";

const Obsidian = () => {
    return new MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.5
      });
};

export default Obsidian;
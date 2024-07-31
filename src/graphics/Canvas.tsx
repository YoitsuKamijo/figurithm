import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { useEffect, useRef } from "react";
import { Puck } from './Puck';

function Canvas() {

    // const refContainer: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null);

    useEffect(() => {
        // if (refContainer.current && refContainer.current.hasChildNodes()) return;

        const canvas: any = document.querySelector('#c');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const scene = new THREE.Scene();

        // defaults to 0, 0, 0
        const camera = new THREE.PerspectiveCamera(75,  width / height, 0.1, 1000);
        camera.updateProjectionMatrix();

        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        renderer.setSize(width, height);

        // HACKY, not recommended.
        // document.body.appendChild(renderer.domElement);
        // OR use ref as a mount point of the Three.js scene instead of the document.body
        // refContainer.current && refContainer.current.appendChild( renderer.domElement );

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        //MeshBasicMaterial is not affected by lighting
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        //MeshPhongMaterial is affected by lighting
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const cube = new THREE.Mesh(Puck, material);
        // defaults to 0, 0, 0 which is in the middle?
        // scene.add(cube);
        scene.add(cube)

        // move z a little so the camera isn't insde the cube
        camera.position.z = 5;

        // Static lighting
        const color = 0xffffff;
        const intensity = 2;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);

        var pointLight = new THREE.PointLight( 0xfdf3c6, 2);
        camera.add(pointLight);
        scene.add(camera);

        // Camera control
        CameraControls.install( { THREE: THREE } );
        const clock = new THREE.Clock();
        const cameraControls = new CameraControls( camera, renderer.domElement );

        //Render object
        // renderer.setAnimationLoop(animate);
        // function animate() {
        //     cube.rotation.x += 0.01;
        //     cube.rotation.y += 0.01;
        //     renderer.render(scene, camera);
        // }

        function animate() {
            // snip
	        const delta = clock.getDelta();
	        const hasControlsUpdated = cameraControls.update(delta);
	        requestAnimationFrame(animate);

	        // you can skip this condition to render though
	        if ( hasControlsUpdated ) {
                
		        renderer.render(scene, camera);
	        }
        }
        //Initial rendering
        renderer.render(scene, camera);
        animate();
    }, []);

    return (
        <canvas
            style={{ display: 'block', width: "100%", height: "100%" }}
            id="c">
        </canvas>
    );
}

export default Canvas
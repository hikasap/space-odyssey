import scene from '../core/scene.js';
import Camera from '../core/camera.js';
import renderer from '../core/renderer.js';
import { ambientLight } from '../core/light.js';
import { generateSolarSystem } from '../components/systems/solarSystem.js';
import { setupInteraction } from '../components/systems/interaction.js';
import { Planet } from '../components/celestialBody/planet.js';
import { Moon } from '../components/celestialBody/moon.js';
import * as THREE from 'three';
import { Spacecraft } from '../components/spacecraft.js';
import PhysicsInstance from '../core/physics.js';


export function initScene(container){

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 0, 100);
    camera.setOrbitControls(renderer.domElement);
    scene.add(ambientLight);
    container.appendChild(renderer.domElement);

    const celestialBodies = [];
    const chunkSize = 256;
    const halfChunkSize = chunkSize / 2;

    const range = [-1, 0, 1];
    // use range
    const x_range = [0];
    // const x_range = range;
    const y_range = [0];
    // const y_range = range;
    const z_range = [0];
    // const z_range = range;

    for (const x of x_range) {
        for (const y of y_range) {
            for (const z of z_range) {
                const chunkOffset = new THREE.Vector3(x * chunkSize, y * chunkSize, z * chunkSize);
                generateSolarSystem(scene, celestialBodies, chunkOffset);
            }
        }
    }
    Promise.all([
        PhysicsInstance.init(),
    ]).then(() => {

        const spaceCraftPosition = new THREE.Vector3(0, 0, 50);
        const spacecraft = new Spacecraft(spaceCraftPosition , scene,  () => {
            camera.setFollowTarget(spacecraft.getMesh());
        });

        const detectRaycast = setupInteraction(renderer, camera, scene, celestialBodies);

        function animate() {
            requestAnimationFrame(animate);

            const deltaTime = 1.0/60.0;

            celestialBodies.forEach(body => {
                body.rotate();
                if (body instanceof Planet || body instanceof Moon) {
                    body.updateOrbit(deltaTime);
                }
            });
            
            PhysicsInstance.update(deltaTime);
            spacecraft.update(deltaTime);

            camera.update();
            detectRaycast();

            renderer.render(scene, camera);
        }

        animate();

    }).catch((error) => {
        console.error('Failed to initialize physics', error);
    });

    // Handle window resizing
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height
        camera.updateProjectionMatrix();
    });

}


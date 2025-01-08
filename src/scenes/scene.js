// import scene from '../core/scene.js';
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
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

let speedMultiplier = 1.0;

export function setSpeedMultiplier(value) {
    speedMultiplier = value;
}

let scene = null;

export function displayScene(container){
    if (!scene) {
        initScene();
    }
    container.appendChild(renderer.domElement);
}

export function initScene(){

    scene = new THREE.Scene();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.01, 2048);
    camera.setOrbitControls(renderer.domElement);

    scene.add(ambientLight);

    const celestialBodies = [];
    const chunkSize = 512;
    const x_range = [0];
    const y_range = [0];
    const z_range = [0];
    for (const x of x_range) {
        for (const y of y_range) {
            for (const z of z_range) {
                const chunkOffset = new THREE.Vector3(x * chunkSize, y * chunkSize, z * chunkSize);
                generateSolarSystem(scene, celestialBodies, chunkOffset, chunkSize);
            }
        }
    }


    function getSphericalRandomDot(radius)
    {
        const u = Math.random();
        const v = Math.random();
    
        const phi = 2 * Math.PI * u;
        const theta = Math.acos(2 * v - 1);
    
        const sinTheta = Math.sin(theta);
        const x = radius * sinTheta * Math.cos(phi);
        const y = radius * sinTheta * Math.sin(phi);
        const z = radius * Math.cos(theta);
    
        return new THREE.Vector3(x, y, z);
    }
    // Create starfield
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        // x should be outside the solar system
        // ranges from [-ChunkSize, -2*ChunkSize] and [*ChunkSize, 2*ChunkSize]
        const point = getSphericalRandomDot(2 * chunkSize);
        starVertices.push(point.x, point.y, point.z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Add motion blur effect
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const afterimagePass = new AfterimagePass(0.5);
    composer.addPass(afterimagePass);

    Promise.all([
        PhysicsInstance.init(),
    ]).then(() => {

        const spaceCraftPosition = new THREE.Vector3(0, 0, chunkSize / 2);
        camera.position.set(0, 0, chunkSize);
        const spacecraft = new Spacecraft(spaceCraftPosition , scene,  () => {
            camera.setFollowTarget(spacecraft.getMesh());
        });

        const detectRaycast = setupInteraction(renderer, camera, scene, celestialBodies);

        function animate() {
            requestAnimationFrame(animate);
            const deltaTime = 1.0/60.0 * speedMultiplier;

            celestialBodies.forEach(body => {
                body.rotate(deltaTime);
                if (body instanceof Planet || body instanceof Moon) {
                    body.updateOrbit(deltaTime);
                }
            });
            
            detectRaycast();

            // composer.render();
            PhysicsInstance.update(deltaTime);
            spacecraft.update(deltaTime);
            camera.update();
            
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


import scene from './core/scene.js';
import Camera from './core/camera.js';
import renderer from './core/renderer.js';
import { ambientLight } from './core/light.js';
import { generateSolarSystem } from './components/systems/solarSystem.js';
import { setupInteraction } from './components/systems/interaction.js';
import { Planet } from './components/celestialBody/planet.js';
import { Moon } from './components/celestialBody/moon.js';

const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100);
camera.setInitialPosition(camera.position);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(ambientLight);

const celestialBodies = [];
generateSolarSystem(scene, celestialBodies);
const detectRaycast = setupInteraction(renderer, camera, scene, celestialBodies);

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = 0.01;

    celestialBodies.forEach(body => {
        body.rotate();
        if (body instanceof Planet || body instanceof Moon) {
            body.updateOrbit(deltaTime);
        }
    });

    camera.update();

    detectRaycast();

    renderer.render(scene, camera);
}

animate();
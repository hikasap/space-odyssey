import scene from './core/scene.js';
import camera from './core/camera.js';
import renderer from './core/renderer.js';
import {ambientLight} from './core/light.js';
import { generateSolarSystem } from './components/systems/solarSystem.js';
import { setupInteraction } from './components/systems/interaction.js';

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(ambientLight);

const celestialBodies = [];
generateSolarSystem(scene, celestialBodies);
setupInteraction(renderer, camera, scene, celestialBodies);
import Camera from '../core/camera.js';
import renderer from '../core/renderer.js';
import { ambientLight } from '../core/light.js';
import { generateSolarSystem } from '../components/systems/solarSystem.js';
import { setupInteraction, getIntersectedObject } from '../components/systems/interaction.js';
import { Planet } from '../components/celestialBody/planet.js';
import { Moon } from '../components/celestialBody/moon.js';
import * as THREE from 'three';
import { Spacecraft } from '../components/spacecraft/spacecraft.js';
import PhysicsInstance from '../core/physics.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { getRandomNumber, resetRandom, setSeed } from '../utils/random.js';
import { gameConfig } from '../systems/configs/gameConfig.js';
import { CelestialBody } from '../components/celestialBody/celestialBody.js';

export class SpaceScene{
    constructor(){
        this._composer = null;
        this._scene = new THREE.Scene();
        this._celestialBodies = [];    
        this._camera = new Camera(gameConfig.cameraFov, window.innerWidth / window.innerHeight, gameConfig.cameraNear, gameConfig.cameraFar);
        this._camera.setOrbitControls(renderer.domElement);
        PhysicsInstance.init().then(() => {
            this.initScene();
        }).catch((error) => {
            console.error('Failed to initialize physics', error);
        });
    }

    get celestialBodies(){
        return this._celestialBodies;
    }

    set celestialBodies(value){
        this._celestialBodies = value;
    }

    get camera(){
        return this._camera;
    }

    initScene(){

        this._scene = new THREE.Scene();
        renderer.setSize(window.innerWidth, window.innerHeight);
        this._scene.add(ambientLight);
    
        this.addSolarSystem();
        this.addChunkBorders();
        this.addBackground();
    

        this._composer = new EffectComposer(renderer);
        this._composer.addPass(new RenderPass(this._scene, this._camera));
        this._composer.addPass(new AfterimagePass(0.5));
    
        const spaceCraftPosition = new THREE.Vector3(0, 0, gameConfig.chunkSize / 2);
        this._camera.position.set(0, 0, gameConfig.chunkSize);
        this._spacecraft = new Spacecraft(spaceCraftPosition, this._scene, () => {
            this._camera.setFollowTarget(this._spacecraft.getMesh());
        });

        this._detectRaycast = setupInteraction(this);

        this.update();

        window.addEventListener('resize', this.onWindowResize.bind(this));

        gameConfig.addEventListener('solarSystemSeedChanged', () => {
            this.regenerateSolarSystem();
        });

        gameConfig.addEventListener('chunkSizeChanged', () => {
            this.regenerateSolarSystem();
            this._scene.remove(this.chunkLine);
            this.addChunkBorders();
        });

        gameConfig.addEventListener('starfieldDensityChanged', () => {
            this._scene.remove(this.stars);
            this.addBackground();
        });

        gameConfig.addEventListener('starfieldColorChanged', () => {
            this._scene.remove(this.stars);
            this.addBackground();
        }
        );

        gameConfig.addEventListener('displayChunkBordersChanged', () => {
            if (gameConfig.displayChunkBorders) {
                this._scene.add(this.chunkLine);
            } else {
                this._scene.remove(this.chunkLine);
            }
        }
        );

        gameConfig.addEventListener('displayStarfieldChanged', () => {
            if (gameConfig.displayStarfield) {
                this._scene.add(this.stars);
            } else {
                this._scene.remove(this.stars);
            }
        }
        );

    }

    addChunkBorders(){
        const CHUNK_SIZE = gameConfig.chunkSize;
        const chunkGeometry = new THREE.BoxGeometry(CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE);
        const chunkWireframe = new THREE.EdgesGeometry(chunkGeometry);
        const chunkLine = new THREE.LineSegments(chunkWireframe, new THREE.LineBasicMaterial({ color: 0xffffff }));
        this.chunkLine = chunkLine;
        if (gameConfig.displayChunkBorders) this._scene.add(chunkLine);
    }


    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
    }

    update() {
        requestAnimationFrame(this.update.bind(this));
        const deltaTime = 1.0/60.0 * gameConfig.speedMultiplier;

        this._celestialBodies.forEach(body => {
            body.rotate(deltaTime);
            if (body instanceof Planet || body instanceof Moon) {
                body.updateOrbit(deltaTime);
            }
        });
        
        PhysicsInstance.update(deltaTime);
        this._detectRaycast();
        this._composer.render();
        this._spacecraft.update(deltaTime);
        this._camera.update();
        
        renderer.render(this._scene, this._camera);
    }


    regenerateSolarSystem(){
        // Clear all
        for (const celestialBody of this._celestialBodies) {
            this._scene.remove(celestialBody.mesh);
        }
    
        this._celestialBodies = [];
        this.addSolarSystem();
    }
    
    addSolarSystem(){
        setSeed(gameConfig.solarSystemSeed.toString());
        resetRandom();
        const x_range = [0];
        const y_range = [0];
        const z_range = [0];
        for (const x of x_range) {
            for (const y of y_range) {
                for (const z of z_range) {
                    const chunkOffset = new THREE.Vector3(x * gameConfig.chunkSize, y * gameConfig.chunkSize, z * gameConfig.chunkSize);
                    generateSolarSystem(this._scene, this._celestialBodies, chunkOffset, gameConfig.chunkSize);
                    
                }
            }
        }

    }

    addBackground(){
        function getSphericalRandomDot(radius)
        {
            const u = getRandomNumber();
            const v = getRandomNumber();
        
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
        const starMaterial = new THREE.PointsMaterial({ color: gameConfig.starfieldColor });
        const starVertices = [];
        for (let i = 0; i < gameConfig.starfieldDensity; i++) {
            const point = getSphericalRandomDot(2 * gameConfig.chunkSize);
            starVertices.push(point.x, point.y, point.z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        this.stars = new THREE.Points(starGeometry, starMaterial);
        if (gameConfig.displayStarfield) this._scene.add(this.stars);
    }

    displayScene(container){
        container.appendChild(renderer.domElement);
    }            

    getTargetCelestial(){
        const INTERSECTED = getIntersectedObject();
        if (INTERSECTED && INTERSECTED instanceof CelestialBody) {
            return INTERSECTED;
        }
        return null;
    }
} 

export default SpaceScene;






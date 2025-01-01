import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Spacecraft {
    constructor(scene, onModelLoaded) {
        this.scene = scene;
        this.model = null;
        this.loader = new GLTFLoader();
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.keys = {};
        this.onModelLoaded = onModelLoaded;
        this.init();
    }

    init() {
        this.loadModel();
        this.setupInput();
    }

    loadModel() {
        this.loader.load(
            'assets/models/spacecraft.glb',
            (gltf) => {
                // console.log('Spacecraft model loaded:', gltf);
                this.model = gltf.scene;
                this.model.scale.set(0.02, 0.02, 0.02);
                // rotate the model so it faces the camera
                this.model.rotation.y = Math.PI;
                this.scene.add(this.model);
                // console.log('Spacecraft model added to scene:', this.model);

                this.addWireframe();

                if (this.onModelLoaded) {
                    this.onModelLoaded();
                    console.log("on model loaded");
                }
                    
            },
            undefined,
            (error) => {
                console.error('An error happened while loading the spacecraft model:', error);
            }
        );
    }


    addWireframe() {
        if (!this.model) return;

        this.model.traverse((child) => {
            if (child.isMesh) {
                
                const wireframeGeometry = new THREE.WireframeGeometry(child.geometry);
                const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.15 , linecap: 'round', linejoin: 'round', transparent: true });
                const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
                wireframe.position.copy(child.position);
                wireframe.rotation.copy(child.rotation);
                wireframe.scale.copy(child.scale);
                child.add(wireframe);
            }
        });
    }
    setupInput() {
        window.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            this.keys[key] = true;
        });

        window.addEventListener('keyup', (event) => {
            const key = event.key.toLowerCase();
            this.keys[key] = false;
        });
    }

    update(deltaTime) {
        if (!this.model) return;
    
        let TRANSLATION_SPEED = 1;
        if (this.keys['shift']) {
            TRANSLATION_SPEED *= 3;
        }
        const ROTATION_SPEED = 1;

        this.velocity.set(0, 0, 0);
    

        if (this.keys['w'] || this.keys['arrowup']) {
            this.velocity.z += TRANSLATION_SPEED * deltaTime;
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            this.velocity.z -= TRANSLATION_SPEED * deltaTime;
        }
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.model.rotateY(ROTATION_SPEED * deltaTime);
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.model.rotateY(-ROTATION_SPEED * deltaTime);
        }
        if (this.keys['q']) {
            this.model.rotateX(ROTATION_SPEED * deltaTime);
        }
        if (this.keys['e']) {
            this.model.rotateX(-ROTATION_SPEED * deltaTime);
        }
    
    
        this.model.translateX(this.velocity.x);
        this.model.translateY(this.velocity.y);
        this.model.translateZ(this.velocity.z);
    }

    getMesh() {
        return this.model;
    }
}
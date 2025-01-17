import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import PhysicsInstance from '../core/physics';
import { BatchedRenderer, ColorOverLife, ColorRange, ConeEmitter, ConstantColor, ConstantValue, IntervalValue, ParticleSystem} from 'three.quarks';

export class Spacecraft {
    constructor(position, scene, onModelLoaded) {
        this.scene = scene;
        this.position = position || new THREE.Vector3(0, 0, 0);
        this.model = null;
        this.loader = new GLTFLoader();
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.keys = {};
        this.onModelLoaded = onModelLoaded;
        this.init();

        this.batchSystem = null;
        this.enginePositions = [
            { position: new THREE.Vector3(-1.5, 0.6, -3), group: 'topLeft' },
            { position: new THREE.Vector3(1.5, 0.6, -3), group: 'topRight' },
            { position: new THREE.Vector3(-1.5, -0.6, -3), group: 'bottomLeft' },
            { position: new THREE.Vector3(1.5, -0.6, -3), group: 'bottomRight' },
            { position: new THREE.Vector3(0, 0, -2.5), group: 'central' }
        ];
        this.particleSystems = {};
    }

    init() {
        this.loadModel();
        this.setupInput();    
    }

    loadModel() {
        this.loader.load(
            'assets/models/spacecraft.glb',
            (gltf) => {
                this.model = gltf.scene;
                this.model.scale.set(0.02, 0.02, 0.02);
                this.model.rotation.y = Math.PI;
                this.model.position.copy(this.position);
                this.scene.add(this.model);
                this.addWireframe();
                this.initParticleSystems();

                if (this.onModelLoaded) {
                    this.onModelLoaded();
                }
                PhysicsInstance.addRigidBody(this.model, 1);
                const body = this.model.userData.physicsBody;
                body.setActivationState(4);
                
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

    applyForce(force) {
        if (this.model && this.model.userData.physicsBody) {
            const btForce = new PhysicsInstance.AmmoLib.btVector3(force.x, force.y, force.z);
            this.model.userData.physicsBody.applyForce(btForce, new PhysicsInstance.AmmoLib.btVector3(0, 0, 0));
            PhysicsInstance.AmmoLib.destroy(btForce);
        }
    }

    applyTorque(torque) {
        if (this.model && this.model.userData.physicsBody) {
            const btTorque = new PhysicsInstance.AmmoLib.btVector3(torque.x, torque.y, torque.z);
            this.model.userData.physicsBody.applyTorque(btTorque);
            PhysicsInstance.AmmoLib.destroy(btTorque);
        }
    }

    initParticleSystems() {
        this.batchSystem = new BatchedRenderer();
        this.enginePositions.forEach(engine => {
            const {position, group} = engine;

            const mainEngine = group === 'central';
            const texture = new THREE.TextureLoader().load("assets/textures/a_albedo.png");
            const engineFlame = {
                duration: 1,
                looping: true,
                startLife: new IntervalValue(0.1, 1),
                startSpeed: mainEngine ? new ConstantValue(-1.75) : new ConstantValue(-1.25),
                startSize: mainEngine ? new IntervalValue(0.5, 1) : new IntervalValue(0.25, 0.4),
                startColor: new ConstantColor(new THREE.Vector4(0.8, 0.8, 1, 1)),
                worldSpace: false,
                maxParticle: 500,
                shape: new ConeEmitter({
                    radius: 0.01,
                    angle : Math.PI / 20,
                    thickness: 0.5,
                    direction: new THREE.Vector3(0, 0, 1),
                    spread: 0,
                }),
                // Simple material without texture
                geometry: new THREE.SphereGeometry(0.1, 32, 32),
                material : new THREE.MeshBasicMaterial({ 
                    color: 0xffffff, 
                    map: texture, 
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    side: THREE.DoubleSide,
                }),
                // renderMode: RenderMode.Trail,
            };

            const engineFlameSystem = new ParticleSystem(engineFlame);
            engineFlameSystem.addBehavior(new ColorOverLife(new ColorRange(
                new THREE.Vector4(1, 1, 1, 1),
                new THREE.Vector4(1, 1, 1, 0)
            )));
            
            engineFlameSystem.emitter.name = 'engineFlame';
            engineFlameSystem.emitter.position.copy(position);
            
            // engineFlameSystem.set

            this.particleSystems[group] = engineFlameSystem;
            this.batchSystem.addSystem(this.particleSystems[group]);
            this.model.add(this.particleSystems[group].emitter);
        });
        this.scene.add(this.batchSystem);
    }

    update(deltaTime) {
        if (!this.model) return;
    
        const mainEngineForce = 500 * deltaTime;
        const sideEngineForce = 25 * deltaTime;
        const rotationalFactor = 0.01;
        const backwardEngineForce = 0.5 * deltaTime;

        let force = 4 * sideEngineForce;
        if (this.keys['shift']) {
            force = mainEngineForce + 4 * sideEngineForce;
        }

        if (this.keys['w'] || this.keys['arrowup']) {
            const forwardVector = this.getForwardVector();
            const forceVector = forwardVector.clone().multiplyScalar(-force);
            this.applyForce(forceVector);
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            const forwardVector = this.getForwardVector();
            const forceVector = forwardVector.clone().multiplyScalar(backwardEngineForce);
            this.applyForce(forceVector);
        }
        
        // Apply Torques Based on Local Axes
        if (this.keys['a'] || this.keys['arrowleft']) {
            // Yaw left (rotate around local Up axis)
            const upVector = this.getUpVector();
            const torque = upVector.clone().multiplyScalar(sideEngineForce * rotationalFactor);
            this.applyTorque(torque);
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            // Yaw right (rotate around local Up axis)
            const upVector = this.getUpVector();
            const torque = upVector.clone().multiplyScalar(-sideEngineForce * rotationalFactor);
            this.applyTorque(torque);
        }
        if (this.keys['q']) {
            // Pitch nose up (rotate around local Right axis)
            const rightVector = this.getRightVector();
            const torque = rightVector.clone().multiplyScalar(sideEngineForce * rotationalFactor);
            this.applyTorque(torque);
        }
        if (this.keys['e']) {
            // Pitch nose down (rotate around local Right axis)
            const rightVector = this.getRightVector();
            const torque = rightVector.clone().multiplyScalar(-sideEngineForce * rotationalFactor);
            this.applyTorque(torque);
        }
    
        this.handleParticleActivation();

        // Update batch renderer
        this.batchSystem.update(deltaTime);
    }

    handleParticleActivation() {
        let engineAvailable = [0, 0, 0, 0, 0];

        if (this.keys['w'] || this.keys['arrowup']) {
            engineAvailable[0] = 1;
            engineAvailable[1] = 1;
            engineAvailable[2] = 1;
            engineAvailable[3] = 1;
            if (this.keys['shift']) {
                engineAvailable[4] = 1;
            }
        }
        if (this.keys['a'] || this.keys['arrowleft']) {
            engineAvailable[0] = 1;
            engineAvailable[2] = 1;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            engineAvailable[1] = 1;
            engineAvailable[3] = 1;
        }
        if (this.keys['q']) {
            engineAvailable[0] = 1;
            engineAvailable[1] = 1;
        }
        if (this.keys['e']) {
            engineAvailable[2] = 1;
            engineAvailable[3] = 1;
        }

        // close engines and open engines
        this.enginePositions.forEach((engine, index) => {
            const { group } = engine;
            if (engineAvailable[index]) {
                this.setParticleEmission(true, [group]);
            } else {
                this.setParticleEmission(false, [group]);
            }
        });
    }

    // Method to activate or deactivate particle emission for specific groups
    setParticleEmission(active, groups) {
        groups.forEach(group => {
            // Get it from the particle systems object
            const system = this.particleSystems[group];
            if (system) {
                if (!active) {
                    system.stop();
                }
                else {
                    system.play();
                }
            }
        });
    }

    /**
     * Returns the forward vector based on the current orientation.
     */
    getForwardVector() {
        const forward = new THREE.Vector3(0, 0, -1); // Assuming -Z is forward
        forward.applyQuaternion(this.model.quaternion);
        forward.normalize();
        return forward;
    }
    /**
     * Returns the right vector based on the current orientation.
     */
    getRightVector() {
        const right = new THREE.Vector3(1, 0, 0); // Assuming +X is right
        right.applyQuaternion(this.model.quaternion);
        right.normalize();
        return right;
    }

    /**
     * Returns the up vector based on the current orientation.
     */
    getUpVector() {
        const up = new THREE.Vector3(0, 1, 0); // Assuming +Y is up
        up.applyQuaternion(this.model.quaternion);
        up.normalize();
        return up;
    }

    getMesh() {
        return this.model;
    }
}
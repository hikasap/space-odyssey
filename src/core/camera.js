import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

class Camera extends THREE.PerspectiveCamera {
    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far);

        this.followTarget = null;
        this.focusedObject = null;
        this.lerpSpeed = 0.06;
        this.controls = null;
        this.userInteracting = false;
    }

    setFollowTarget(object) {
        this.focusedObject = 0;
        this.followTarget = object;
        this.controls.target.copy(object.position);
    }

    focusOnObject(object) {
        this.focusedObject = object;
        this.controls.target.copy(object.position);
    }

    resetFocus() {
        this.focusedObject = 0;
        this.controls.target.copy(this.followTarget.position);
    }

    setOrbitControls(domElement) {
        this.controls = new OrbitControls(this, domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;

        this.controls.addEventListener('start', () => {
            this.userInteracting = true;
            this.handleControlStart();
        });

        this.controls.addEventListener('end', () => {
            this.handleControlEnd();
            this.userInteracting = false;
        });

    }

    handleControlStart() {
        this.focusedObject = null;
        console.log('Control started');
    }


    handleControlEnd() {
        console.log('Control ended');
    }

    update() {

        if (this.controls && !this.focusOnObject) {
            this.controls.update();
        }
        
        if (this.userInteracting) {
            return;
        }

        if (this.focusedObject) {
            console.log(this.focusedObject);
            const geometry = this.focusedObject.geometry;

            if (geometry) {

                if (!geometry.boundingSphere) {
                    geometry.computeBoundingSphere();
                }

                const radius = geometry.boundingSphere?.radius || 1;
                console.log(radius);

                const offsetDist = radius * 2;
                console.log(offsetDist);
                const targetOffset = new THREE.Vector3(offsetDist, offsetDist, offsetDist);

                const targetPosition = new THREE.Vector3()
                    .copy(this.focusedObject.position)
                    .add(targetOffset);

                this.position.lerp(targetPosition, this.lerpSpeed);
                this.lookAt(this.focusedObject.position);
            }

        }else if (this.focusedObject == 0) {
            const offset = new THREE.Vector3(0, 0.1, -0.2);
            offset.applyQuaternion(this.followTarget.quaternion);

            const targetPosition = new THREE.Vector3()
                .copy(this.followTarget.position)
                .add(offset);

            this.position.lerp(targetPosition, this.lerpSpeed);
            this.lookAt(this.followTarget.position);
        }
    }
}

export default Camera;
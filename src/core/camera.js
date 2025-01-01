import * as THREE from 'three';

class Camera extends THREE.PerspectiveCamera {
    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far);

        this.initialPosition = new THREE.Vector3();
        this.focusedObject = null;

        this.lerpSpeed = 0.05;
    }

    setInitialPosition(position) {
        this.initialPosition.copy(position);
        this.position.copy(position);
    }

    focusOnObject(object) {
        this.focusedObject = object;
    }

    resetFocus() {
        this.focusedObject = null;
    }

    update() {
        if (this.focusedObject) {
            const geometry = this.focusedObject.geometry;
            console.log(geometry);
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
        } else {
            this.position.lerp(this.initialPosition, this.lerpSpeed);
            this.lookAt(new THREE.Vector3(0, 0, 0));
        }
    }
}

export default Camera;
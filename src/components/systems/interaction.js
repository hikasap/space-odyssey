import * as THREE from 'three';
import { gsap } from 'gsap';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED;
let targetObject = null;
const initialCameraPosition = new THREE.Vector3();
let mouseMoved = false;

const lookAtTarget = new THREE.Vector3();

export function setupInteraction(renderer, camera, scene, celestialBodies) {
    initialCameraPosition.copy(camera.position);
    lookAtTarget.copy(scene.position);

    function onMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseMoved = true;
    }

    function onClick(event) {
        event.preventDefault();
        if (INTERSECTED) {
            targetObject = INTERSECTED;

            const targetPosition = {
                x: targetObject.position.x + 5,
                y: targetObject.position.y + 5,
                z: targetObject.position.z + 5,
            };

            gsap.to(camera.position, {
                duration: 2,
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
            });

            gsap.to(lookAtTarget, {
                duration: 2,
                x: targetObject.position.x,
                y: targetObject.position.y,
                z: targetObject.position.z,
            });
        }
    }

    function onKeyPress(event) {
        if (event.key === 'r' || event.key === 'R') {
            gsap.to(camera.position, {
                duration: 2,
                x: initialCameraPosition.x,
                y: initialCameraPosition.y,
                z: initialCameraPosition.z,
            });

            gsap.to(lookAtTarget, {
                duration: 2,
                x: scene.position.x,
                y: scene.position.y,
                z: scene.position.z,
            });
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        celestialBodies.forEach((body) => {
            body.rotate();
        });

        if (mouseMoved) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                if (INTERSECTED != intersects[0].object) {
                    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                    INTERSECTED = intersects[0].object;
                    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                    INTERSECTED.material.emissive.setHex(0xff0000);
                }
            } else {
                if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                INTERSECTED = null;
            }
        }

        camera.lookAt(lookAtTarget);
        renderer.render(scene, camera);
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);
    window.addEventListener('keypress', onKeyPress, false);

    animate();
}

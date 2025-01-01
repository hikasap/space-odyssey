import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED;
let mouseMoved = false;

export function setupInteraction(renderer, camera, scene, celestialBodies) {
    function onMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseMoved = true;
    }

    function onClick(event) {
        event.preventDefault();
        if (INTERSECTED) {
            camera.focusOnObject(INTERSECTED);
        }
    }

    function onKeyPress(event) {
        if (event.key === 'r' || event.key === 'R') {
            camera.resetFocus();
        }
    }

    function detectRaycast() {
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
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);
    window.addEventListener('keypress', onKeyPress, false);

    return detectRaycast;
}
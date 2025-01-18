import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED;
let mouseMoved = false;

export function setupInteraction(scene) {
    function onMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseMoved = true;
    }

    function onClick(event) {
        event.preventDefault();
        if (event.shiftKey && INTERSECTED) {
            scene.camera.focusOnObject(INTERSECTED.mesh);
        }
    }

    function onKeyPress(event) {
        if (event.key === 'r' || event.key === 'R') {
            scene.camera.resetFocus();
        }
    }

    function setIntersectedObject(object) {
    
        if (!object) {
            if (INTERSECTED) INTERSECTED.mesh.material.emissive.setHex(INTERSECTED.mesh.currentHex);
            INTERSECTED = null;
            return;
        }

        if (INTERSECTED !== object) {
            if (INTERSECTED) INTERSECTED.mesh.material.emissive.setHex(INTERSECTED.mesh.currentHex);
            INTERSECTED = object;
            INTERSECTED.mesh.currentHex = INTERSECTED.mesh.material.emissive.getHex();
            INTERSECTED.mesh.material.emissive.setHex(0xff0000);
        }
    }

    function detectRaycast() {
        if (mouseMoved) {
            raycaster.setFromCamera(mouse, scene.camera);
            const intersects = raycaster.intersectObjects(scene.celestialBodies.map(body => body.mesh)).filter(intersect => intersect.object.material && intersect.object.material.emissive);

            if (intersects.length > 0) {                
                scene.celestialBodies.forEach(body => {
                    if (body.mesh === intersects[0].object) {
                        setIntersectedObject(body);
                    }
                });
            }
            else {
                setIntersectedObject(null);
            }
        }
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onClick, false);
    window.addEventListener('keypress', onKeyPress, false);

    return detectRaycast;
}

export function getIntersectedObject() {
    return INTERSECTED;
}
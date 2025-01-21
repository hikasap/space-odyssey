import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED;
let mouseMoved = false;

/**
 * Sets up interaction handlers for a Three.js scene, including mouse movement,
 * click events, and keyboard interactions.
 *
 * @param {Object} scene - The scene object containing the camera and celestial bodies.
 * @param {THREE.PerspectiveCamera} scene.camera - The camera used for raycasting.
 * @param {Array<{mesh: THREE.Mesh}>} scene.celestialBodies - An array of objects with `mesh` properties representing celestial bodies in the scene.
 * @returns {Function} A function to be called periodically to detect raycast intersections.
 */
export function setupInteraction(scene) {
    /**
     * Handles mouse move events and updates the mouse position for raycasting.
     *
     * @param {MouseEvent} event - The mouse move event.
     */
    function onMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseMoved = true;
    }

    /**
     * Handles mouse click events. If the shift key is pressed and an object is intersected,
     * the camera focuses on the intersected object.
     *
     * @param {MouseEvent} event - The mouse click event.
     */
    function onClick(event) {
        event.preventDefault();
        if (event.shiftKey && INTERSECTED) {
            scene.camera.focusOnObject(INTERSECTED.mesh);
        }
    }

    /**
     * Handles key press events. Resets the camera focus if the 'r' key is pressed.
     *
     * @param {KeyboardEvent} event - The key press event.
     */
    function onKeyPress(event) {
        if (event.key === 'r' || event.key === 'R') {
            scene.camera.resetFocus();
        }
    }

    /**
     * Sets the currently intersected object and updates its material's emissive color.
     *
     * @param {Object|null} object - The intersected object or null if no object is intersected.
     */
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

    /**
     * Detects raycast intersections and updates the currently intersected object.
     * Should be called periodically, e.g., within an animation loop.
     */
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
            } else {
                setIntersectedObject(null);
            }
        }
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onClick, false);
    window.addEventListener('keypress', onKeyPress, false);

    return detectRaycast;
}

/**
 * Gets the currently intersected object, if any.
 *
 * @returns {Object|null} The currently intersected object or null if no object is intersected.
 */
export function getIntersectedObject() {
    return INTERSECTED;
}

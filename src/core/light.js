import * as THREE from 'three';

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
export { light, ambientLight };

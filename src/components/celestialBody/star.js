import { CelestialBody } from './celestialBody.js';
import * as THREE from 'three';

export class Star extends CelestialBody {
    constructor(size, color) {
        super(size, color, 'sphere');

        this.mesh.material.emissive = new THREE.Color(0xffffff);
        this.mesh.material.emissiveIntensity = 0.8;

        this.light = new THREE.PointLight(color, 1000000, 0, 2);
        this.light.position.set(0, 0, 0);
        this.mesh.add(this.light);
    }
}
import { CelestialBody } from './celestialBody.js';
import * as THREE from 'three';

export class Star extends CelestialBody {
    constructor(size, color) {
        super(size, color, 'sphere');
        this.light = new THREE.PointLight(0xffffff, 2, 1000);
        this.light.position.set(0, 0, 0);
        this.mesh.add(this.light); // Attach the light to the star's mesh

    }
}
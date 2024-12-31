import { CelestialBody } from './celestialBody.js';

export class Planet extends CelestialBody {
    constructor(size, color) {
        super(size, color, 'sphere');
        this.orbitSpeed = Math.random() * 0.01;
    }

    orbit() {
        // Implement orbit logic if needed
    }
}
import { CelestialBody } from './celestialBody.js';

export class Moon extends CelestialBody {
    constructor(size, color) {
        super(size, color, 'sphere');
        this.orbitSpeed = Math.random() * 0.02;
    }

    orbit() {
        // Implement orbit logic if needed
    }
}
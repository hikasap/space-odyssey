import { CelestialBody } from './celestialBody.js';

export class Planet extends CelestialBody {
    constructor(size, color, semiMajorAxis, eccentricity, orbitalPeriod) {
        super(size, color, 'sphere');
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.orbitalPeriod = orbitalPeriod;
        this.orbitalAngle = Math.random() * Math.PI * 2; // Random initial angle
    }

    updateOrbit(deltaTime) {
        const angleIncrement = (2 * Math.PI / this.orbitalPeriod) * deltaTime;
        this.orbitalAngle += angleIncrement;

        const a = this.semiMajorAxis;
        const e = this.eccentricity;
        const b = a * Math.sqrt(1 - e * e);

        const x = a * Math.cos(this.orbitalAngle);
        const y = b * Math.sin(this.orbitalAngle);

        this.mesh.position.set(x, 0, y);
    }
}
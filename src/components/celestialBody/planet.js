import { CelestialBody } from './celestialBody.js';

export class Planet extends CelestialBody {
    constructor(size, color, semiMajorAxis, eccentricity, orbitalPeriod, parentStar) {
        super(size, color, 'sphere');
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.orbitalPeriod = orbitalPeriod;
        this.orbitalAngle = Math.random() * Math.PI * 2; 
        this.inclination = Math.random() * Math.PI * 2; 
        this.parentStar = parentStar;
    }

    updateOrbit(deltaTime) {
        const angleIncrement = (2 * Math.PI / this.orbitalPeriod) * deltaTime;
        this.orbitalAngle += angleIncrement;

        const a = this.semiMajorAxis;
        const e = this.eccentricity;
        const b = a * Math.sqrt(1 - e * e);

        const x = a * Math.cos(this.orbitalAngle);
        const y = b * Math.sin(this.orbitalAngle);
        const z = y * Math.sin(this.inclination);

        this.mesh.position.set(
            this.parentStar.mesh.position.x + x,
            this.parentStar.mesh.position.y + y * Math.cos(this.inclination),
            this.parentStar.mesh.position.z + z
        );
    }
}
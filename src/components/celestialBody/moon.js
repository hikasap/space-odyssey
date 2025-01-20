import { getRandomNumber } from '../../utils/random.js';
import { CelestialBody } from './celestialBody.js';

export class Moon extends CelestialBody {
    constructor(size, color, semiMajorAxis, eccentricity, orbitalPeriod, parentPlanet) {
        super(size, color, 'goldberg', 'assets/textures/moon_texture.png');
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.orbitalPeriod = orbitalPeriod;
        this.orbitalAngle = getRandomNumber() * Math.PI * 2;
        this.inclination = getRandomNumber() * Math.PI * 2; 
        this.parentPlanet = parentPlanet; 
        
        super.addPhysics();
        this.initCelesitalDetails();
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
            this.parentPlanet.mesh.position.x + x,
            this.parentPlanet.mesh.position.y + y * Math.cos(this.inclination),
            this.parentPlanet.mesh.position.z + z
        );
    }

    initCelesitalDetails() {
        super.initCelesitalDetails();
        this.celestialDetails['Type'] = 'Moon';
        this.celestialDetails['Parent Planet'] = this.parentPlanet.celestialDetails['Name'];
    }
}
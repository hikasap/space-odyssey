import { CelestialBody } from './celestialBody.js';

export class Asteroid extends CelestialBody {
    constructor(size, color) {
        super(size, color, 'cube');
        
        super.addPhysics();
        this.initCelesitalDetails();
    }

    initCelesitalDetails() {
        super.initCelesitalDetails();
        this.celestialDetails['Type'] = 'Asteroid';
    }
}
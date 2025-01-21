import { CelestialBody } from './celestialBody.js';

/**
 * Class representing an asteroid, which is a specific type of celestial body.
 * Extends the {@link CelestialBody} class to add asteroid-specific functionality.
 * 
 * @class
 * @extends CelestialBody
 */
export class Asteroid extends CelestialBody {
    /**
     * Constructs a new Asteroid instance.
     * 
     * @constructor
     * @param {number} size - The size of the asteroid.
     * @param {string} color - The color of the asteroid.
     * 
     * @example
     * // Create a red asteroid with size 5
     * const asteroid = new Asteroid(5, 'red');
     */
    constructor(size, color) {
        super(size, color, 'cube'); // Initialize the CelestialBody with a cube shape.
        
        super.addPhysics(); // Adds physics properties to the asteroid.
        this.initCelesitalDetails(); // Initializes additional asteroid-specific details.
    }

    /**
     * Initializes celestial details specific to the asteroid.
     * This method overrides the parent class's implementation to add a `Type` property.
     * 
     * @method
     * @override
     * 
     * @example
     * asteroid.initCelesitalDetails();
     * console.log(asteroid.celestialDetails['Type']); // Outputs: 'Asteroid'
     */
    initCelesitalDetails() {
        super.initCelesitalDetails();
        this.celestialDetails['Type'] = 'Asteroid';
    }
}

import { Star } from '../celestialBody/star.js';
import { Planet } from '../celestialBody/planet.js';
import { Moon } from '../celestialBody/moon.js';
import { Asteroid } from '../celestialBody/asteroid.js';

export function generateSolarSystem(scene, celestialBodies) {

    const star = new Star(5, 0xffff00);
    scene.add(star.mesh);
    celestialBodies.push(star);

    const numPlanets = Math.floor(Math.random() * 10) + 1;
    for (let i = 0; i < numPlanets; i++) {
        const planetSize = Math.random() * 2 + 1;
        const planetColor = Math.random() * 0xffffff;
        const semiMajorAxis = Math.random() * 50 + 20;
        const eccentricity = Math.random() * 0.2;
        const orbitalPeriod = Math.random() * 50 + 20;
        const planet = new Planet(planetSize, planetColor, semiMajorAxis, eccentricity, orbitalPeriod);
        scene.add(planet.mesh);
        celestialBodies.push(planet);

        const numMoons = Math.floor(Math.random() * 5);
        for (let j = 0; j < numMoons; j++) {
            const moonSize = Math.random() * 0.5 + 0.1;
            const moonColor = Math.random() * 0xffffff;
            const moonSemiMajorAxis = planetSize + moonSize + Math.random();
            const moonEccentricity = Math.random() * 0.2;
            const moonOrbitalPeriod = Math.random() * 10 + 5;
            const moon = new Moon(moonSize, moonColor, moonSemiMajorAxis, moonEccentricity, moonOrbitalPeriod, planet);
            scene.add(moon.mesh);
            celestialBodies.push(moon);
        }
    }

    const numAsteroids = Math.floor(Math.random() * 50) + 50;
    for (let k = 0; k < numAsteroids; k++) {
        const asteroidSize = Math.random() * 0.2 + 0.1;
        const asteroidColor = Math.random() * 0xffffff;
        const asteroid = new Asteroid(asteroidSize, asteroidColor);
        asteroid.mesh.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
        scene.add(asteroid.mesh);
        celestialBodies.push(asteroid);
    }
}
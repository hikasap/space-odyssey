import { Star } from '../celestialBody/star.js';
import { Planet } from '../celestialBody/planet.js';
import { Moon } from '../celestialBody/moon.js';
import { Asteroid } from '../celestialBody/asteroid.js';
import * as THREE from 'three';
import { getRandomNumber } from '../../utils/random.js';

export function generateSolarSystem(scene, celestialBodies, chunkOffset = new THREE.Vector3(0, 0, 0), chunkSize = 512) {
 
    const CHUNK_SIZE = chunkSize;
    const HALF_SIZE = CHUNK_SIZE / 2;

    const chunkGeometry = new THREE.BoxGeometry(CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE);
    const chunkWireframe = new THREE.EdgesGeometry(chunkGeometry);
    const chunkLine = new THREE.LineSegments(chunkWireframe, new THREE.LineBasicMaterial({ color: 0xffffff }));
    chunkLine.position.copy(chunkOffset);
    scene.add(chunkLine);

    const starSize = getRandomNumber() * 5 + 10;
    const starColor = 0xffff00 + getRandomNumber() * 0x0000cc;
    const star = new Star(starSize, starColor);
    star.mesh.position.add(chunkOffset);
    scene.add(star.mesh);
    celestialBodies.push(star);

    const numPlanets = Math.floor(getRandomNumber() * 5) + 3;
    for (let i = 0; i < numPlanets; i++) {
        const planetSize = getRandomNumber() * 5 + 2;
        const planetColor = getRandomNumber() * 0xffffff;
        const maxSemiMajorAxis = HALF_SIZE - planetSize - starSize * 2;
        const semiMajorAxis = planetSize + starSize * 2 +  getRandomNumber() * maxSemiMajorAxis;
        const eccentricity = getRandomNumber() * 0.4;

        // Use a simplified Kepler-like law for orbital period:
        // T ~ sqrt(a^3), adjusting with a multiplier to control final speed scale
        const basePeriod = 20; // tweak as you see fit for overall speed
        const orbitalPeriod = basePeriod * Math.sqrt(Math.pow(semiMajorAxis, 3) / 10000);


        const planet = new Planet(planetSize, planetColor, semiMajorAxis, eccentricity, orbitalPeriod, star);
        scene.add(planet.mesh);
        celestialBodies.push(planet);

        const numMoons = Math.floor(getRandomNumber() * 3);
        for (let j = 0; j < numMoons; j++) {
            const moonSize = getRandomNumber() * 0.8 + 0.2;
            const moonColor = getRandomNumber() * 0xffffff;
            const moonSemiMajorAxis = planetSize + moonSize + getRandomNumber() * 2;
            const moonEccentricity = getRandomNumber() * 0.2;
            const moonOrbitalPeriod = (orbitalPeriod / 2) + getRandomNumber() * (orbitalPeriod / 2);
            const moon = new Moon(moonSize, moonColor, moonSemiMajorAxis, moonEccentricity, moonOrbitalPeriod, planet);
            scene.add(moon.mesh);
            celestialBodies.push(moon);
        }
    }

    const numAsteroids = Math.floor(getRandomNumber() * 50) + 50;
    for (let k = 0; k < numAsteroids; k++) {
        const asteroidSize = getRandomNumber() * 0.2 + 0.25;
        const asteroidColor = getRandomNumber() * 0xffffff;
        const asteroid = new Asteroid(asteroidSize, asteroidColor);

        const asteroidPos = new THREE.Vector3(
            getRandomNumber() * CHUNK_SIZE - HALF_SIZE,
            getRandomNumber() * CHUNK_SIZE - HALF_SIZE,
            getRandomNumber() * CHUNK_SIZE - HALF_SIZE
        );
        asteroid.mesh.position.copy(asteroidPos).add(chunkOffset);

        scene.add(asteroid.mesh);
        celestialBodies.push(asteroid);
    }
}
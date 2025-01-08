import { Star } from '../celestialBody/star.js';
import { Planet } from '../celestialBody/planet.js';
import { Moon } from '../celestialBody/moon.js';
import { Asteroid } from '../celestialBody/asteroid.js';
import * as THREE from 'three';

export function generateSolarSystem(scene, celestialBodies, chunkOffset = new THREE.Vector3(0, 0, 0), chunkSize = 512) {
    const CHUNK_SIZE = chunkSize;
    const HALF_SIZE = CHUNK_SIZE / 2;

    const chunkGeometry = new THREE.BoxGeometry(CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE);
    const chunkWireframe = new THREE.EdgesGeometry(chunkGeometry);
    const chunkLine = new THREE.LineSegments(chunkWireframe, new THREE.LineBasicMaterial({ color: 0xffffff }));
    chunkLine.position.copy(chunkOffset);
    scene.add(chunkLine);

    const starSize = Math.random() * 5 + 10;
    const starColor = 0xffff00 + Math.random() * 0x0000cc;
    const star = new Star(starSize, starColor);
    star.mesh.position.add(chunkOffset);
    scene.add(star.mesh);
    celestialBodies.push(star);

    const numPlanets = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < numPlanets; i++) {
        const planetSize = Math.random() * 5 + 2;
        const planetColor = Math.random() * 0xffffff;
        const maxSemiMajorAxis = HALF_SIZE - planetSize - starSize * 2;
        const semiMajorAxis = planetSize + starSize * 2 +  Math.random() * maxSemiMajorAxis;
        const eccentricity = Math.random() * 0.4;

        // Use a simplified Kepler-like law for orbital period:
        // T ~ sqrt(a^3), adjusting with a multiplier to control final speed scale
        const basePeriod = 20; // tweak as you see fit for overall speed
        const orbitalPeriod = basePeriod * Math.sqrt(Math.pow(semiMajorAxis, 3) / 10000);


        const planet = new Planet(planetSize, planetColor, semiMajorAxis, eccentricity, orbitalPeriod, star);
        scene.add(planet.mesh);
        celestialBodies.push(planet);

        const numMoons = Math.floor(Math.random() * 3);
        for (let j = 0; j < numMoons; j++) {
            const moonSize = Math.random() * 0.8 + 0.2;
            const moonColor = Math.random() * 0xffffff;
            const moonSemiMajorAxis = planetSize + moonSize + Math.random() * 2;
            const moonEccentricity = Math.random() * 0.2;
            const moonOrbitalPeriod = (orbitalPeriod / 2) + Math.random() * (orbitalPeriod / 2);
            const moon = new Moon(moonSize, moonColor, moonSemiMajorAxis, moonEccentricity, moonOrbitalPeriod, planet);
            scene.add(moon.mesh);
            celestialBodies.push(moon);
        }
    }

    const numAsteroids = Math.floor(Math.random() * 50) + 50;
    for (let k = 0; k < numAsteroids; k++) {
        const asteroidSize = Math.random() * 0.2 + 0.25;
        const asteroidColor = Math.random() * 0xffffff;
        const asteroid = new Asteroid(asteroidSize, asteroidColor);

        const asteroidPos = new THREE.Vector3(
            Math.random() * CHUNK_SIZE - HALF_SIZE,
            Math.random() * CHUNK_SIZE - HALF_SIZE,
            Math.random() * CHUNK_SIZE - HALF_SIZE
        );
        asteroid.mesh.position.copy(asteroidPos).add(chunkOffset);

        scene.add(asteroid.mesh);
        celestialBodies.push(asteroid);
    }
}
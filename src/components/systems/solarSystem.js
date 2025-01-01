import { Star } from '../celestialBody/star.js';
import { Planet } from '../celestialBody/planet.js';
import { Moon } from '../celestialBody/moon.js';
import { Asteroid } from '../celestialBody/asteroid.js';
import * as THREE from 'three';

export function generateSolarSystem(scene, celestialBodies, chunkOffset = new THREE.Vector3(0, 0, 0)) {
    const CHUNK_SIZE = 128;
    const HALF_SIZE = CHUNK_SIZE / 2;

    const chunkGeometry = new THREE.BoxGeometry(CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE);
    const chunkWireframe = new THREE.EdgesGeometry(chunkGeometry);
    const chunkLine = new THREE.LineSegments(chunkWireframe, new THREE.LineBasicMaterial({ color: 0xffffff }));
    chunkLine.position.copy(chunkOffset);
    scene.add(chunkLine);

    const starSize = Math.random() * 3 + 5;
    const starColor = 0xffff00 + Math.random() * 0x0000ff;
    const star = new Star(starSize, starColor);
    star.mesh.position.add(chunkOffset);
    scene.add(star.mesh);
    celestialBodies.push(star);

    const numPlanets = Math.floor(Math.random() * 10) + 1;
    for (let i = 0; i < numPlanets; i++) {
        const planetSize = Math.random() * 2 + 1;
        const planetColor = Math.random() * 0xffffff;
        const maxSemiMajorAxis = HALF_SIZE - planetSize - starSize;
        const semiMajorAxis = planetSize + starSize +  Math.random() * maxSemiMajorAxis;
        const eccentricity = Math.random() * 0.2;
        const orbitalPeriod = Math.random() * 50 + 20;

        const planet = new Planet(planetSize, planetColor, semiMajorAxis, eccentricity, orbitalPeriod, star);
        scene.add(planet.mesh);
        celestialBodies.push(planet);

        const numMoons = Math.floor(Math.random() * 3);
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
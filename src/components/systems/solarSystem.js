import { Star } from '../celestialBody/star.js';
import { Planet } from '../celestialBody/planet.js';
import { Moon } from '../celestialBody/moon.js';
import { Asteroid } from '../celestialBody/asteroid.js';
import * as THREE from 'three';
import { getRandomNormal, getRandomNumber } from '../../utils/random.js';


const BASE_STAR_SIZE = 50;
const STAR_SIZE_VARIATION = 20;
const BASE_STAR_COLOR = 0xffff00;
const STAR_COLOR_VARIATION = 0x0000ff;
const BASE_PLANET_COUNT = 3;
const PLANET_COUNT_VARIATION = 5;
const BASE_PLANET_SIZE = 10;
const PLANET_SIZE_VARIATION = 10;
const BASE_PLANET_COLOR = 0xffffff;
const MAX_PLANET_ECCENTRICITY = 0.4;
const BASE_ORBITAL_PERIOD = 300;
const BASE_MOON_COUNT = 2;
const MOON_COUNT_VARIATION = 2;
const BASE_MOON_SIZE = 1;
const MOON_SIZE_VARIATION = 0.8;
const BASE_MOON_COLOR = 0xffffff;
const BASE_MOON_ORBITAL_PERIOD_DIVISOR = 40;
const BASE_ASTEROID_COUNT = 50;
const ASTEROID_COUNT_VARIATION = 50;
const BASE_ASTEROID_SIZE = 0.25;
const ASTEROID_SIZE_VARIATION = 0.2;
const BASE_ASTEROID_COLOR = 0xffffff;

export function generateSolarSystem(scene, celestialBodies, chunkOffset = new THREE.Vector3(0, 0, 0), chunkSize = 512) {
    const CHUNK_SIZE = chunkSize;
    const HALF_SIZE = CHUNK_SIZE / 2;

    const starSize = getRandomNumber() * STAR_SIZE_VARIATION + BASE_STAR_SIZE;
    const starColor = BASE_STAR_COLOR + getRandomNumber() * STAR_COLOR_VARIATION;
    const star = new Star(starSize, starColor);
    star.mesh.position.add(chunkOffset);
    scene.add(star.mesh);
    celestialBodies.push(star);

    const numPlanets = Math.floor(getRandomNumber() * PLANET_COUNT_VARIATION) + BASE_PLANET_COUNT;
    for (let i = 0; i < numPlanets; i++) {
        const planetSize = getRandomNumber() * PLANET_SIZE_VARIATION + BASE_PLANET_SIZE;
        const planetColor = getRandomNumber() * BASE_PLANET_COLOR;
        const maxSemiMajorAxis = HALF_SIZE - planetSize - starSize * 2;
        const semiMajorAxis = planetSize + starSize * 2 + getRandomNumber() * maxSemiMajorAxis;
        const eccentricity = getRandomNumber() * MAX_PLANET_ECCENTRICITY;

        const orbitalPeriod = BASE_ORBITAL_PERIOD * Math.sqrt(Math.pow(semiMajorAxis, 3) / 10000);

        const planet = new Planet(planetSize, planetColor, semiMajorAxis, eccentricity, orbitalPeriod, star);
        scene.add(planet.mesh);
        celestialBodies.push(planet);

        const val = getRandomNormal(BASE_MOON_COUNT, MOON_COUNT_VARIATION);
        const numMoons = Math.floor(Math.min(Math.max(val, 0), 10));
        for (let j = 0; j < numMoons; j++) {
            const moonSize = getRandomNumber() * MOON_SIZE_VARIATION + BASE_MOON_SIZE;
            const moonColor = getRandomNumber() * BASE_MOON_COLOR;
            const moonSemiMajorAxis = 2 * (planetSize + moonSize) + getRandomNumber() * 2;
            const moonEccentricity = getRandomNumber() * 0.2;
            const moonOrbitalPeriod = (orbitalPeriod / BASE_MOON_ORBITAL_PERIOD_DIVISOR) + getRandomNumber() * (orbitalPeriod / BASE_MOON_ORBITAL_PERIOD_DIVISOR);
            const moon = new Moon(moonSize, moonColor, moonSemiMajorAxis, moonEccentricity, moonOrbitalPeriod, planet);
            scene.add(moon.mesh);
            celestialBodies.push(moon);
        }
    }

    const numAsteroids = Math.floor(getRandomNumber() * ASTEROID_COUNT_VARIATION) + BASE_ASTEROID_COUNT;
    for (let k = 0; k < numAsteroids; k++) {
        const asteroidSize = getRandomNumber() * ASTEROID_SIZE_VARIATION + BASE_ASTEROID_SIZE;
        const asteroidColor = getRandomNumber() * BASE_ASTEROID_COLOR;
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
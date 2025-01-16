import { generateRandomName } from '../../utils/nameGenerator.js';
import { getRandomNumber } from '../../utils/random.js';
import { CelestialBody } from './celestialBody.js';
import * as THREE from 'three';

const atmosphereVertexShader = `
varying vec3 vWorldPosition;
void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const atmosphereFragmentShader = `
varying vec3 vWorldPosition;
uniform float planetRadius;
uniform float atmosphereRadius;
uniform float planetDist;
void main() {
    float height = length(vWorldPosition) - planetDist;
    // Make height from planet
    float alpha = clamp(1.0 - abs(height) / (atmosphereRadius - planetRadius), 0.0, 1.0);
    // Increase alpha multiplier
    gl_FragColor = vec4(alpha, 1, 1, alpha);
}
`;

export class Planet extends CelestialBody {
    constructor(size, color, semiMajorAxis, eccentricity, orbitalPeriod, parentStar) {
        super(size, color, 'sphere');
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.orbitalPeriod = orbitalPeriod;
        this.orbitalAngle = getRandomNumber() * Math.PI * 2; 
        this.inclination = getRandomNumber() * Math.PI * 2; 
        this.parentStar = parentStar;
        this.has_atmosphere = getRandomNumber() > 0.5;
        this.name = generateRandomName();

        console.log("name", this.name);
    



        // if (this.has_atmosphere) {
        this.addAtmosphere();
        // }
    }

    addAtmosphere(){
        const distToStart = this.mesh.position.length();
        console.log(distToStart);
        const atmosphereGeo = new THREE.SphereGeometry(this.size * 1.25, 32, 32);
        const atmosphereMat = new THREE.ShaderMaterial({
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            side: THREE.BackSide,
            transparent: true,
            uniforms: {
                planetDist : {value : this.mesh.position.length()},
                planetRadius: { value: this.size },
                atmosphereRadius: { value: this.size * 1.25 }
            }
        });
        
        this.atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
        this.mesh.add(this.atmosphereMesh);
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
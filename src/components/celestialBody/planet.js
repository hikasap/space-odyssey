import { generateRandomName } from '../../utils/nameGenerator.js';
import { getRandomNumber } from '../../utils/random.js';
import { CelestialBody } from './celestialBody.js';
import * as THREE from 'three';

const atmosphereVertexShader = `
varying vec3 vNormal;
void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const atmosphereFragmentShader = `
varying vec3 vNormal;
uniform vec3 atmosphereColor;

void main() {
    float intensity = pow(0.5 - dot(vNormal, vec3(0, 0, 1)), 0.75);
    gl_FragColor = vec4(atmosphereColor, 0.5) * intensity;
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
        if (this.has_atmosphere) {
            this.addAtmosphere();
        }
    }

    addAtmosphere(){
        this.atmosphereThickness = getRandomNumber() * 0.5 + 1;
        this.atmosphereColor = getRandomNumber() * 0xffffff;
        console.log(this.size * this.atmosphereThickness);
        const atmosphereGeo = new THREE.SphereGeometry(this.size * this.atmosphereThickness, 32, 32);
        const atmosphereMat = new THREE.ShaderMaterial({
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            uniforms: {
                atmosphereColor: { value: new THREE.Color(this.atmosphereColor) }
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
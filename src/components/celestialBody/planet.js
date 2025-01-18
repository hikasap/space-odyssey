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


const fluidVertexShader = `
uniform float time;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);

    // Simple wave displacement using sine functions
    float frequency = 3.0;
    float amplitude = 0.02;
    vec3 displacedPosition = position + normal * sin(dot(position, vec3(1.0, 1.0, 1.0)) * frequency + time) * amplitude;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(displacedPosition, 1.0);
}
`;

const fluidFragmentShader = `
uniform vec3 fluidColor;
uniform float time;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    // Calculate lighting based on normal and view direction
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float lighting = max(dot(vNormal, lightDir), 0.0);

    // Create a simple animated pattern
    float pattern = sin(vPosition.y * 10.0 + time * 2.0) * 0.5 + 0.5;

    // Combine color with lighting and pattern
    vec3 color = fluidColor * lighting * pattern;

    gl_FragColor = vec4(color, 1.0);
}
`;


export class Planet extends CelestialBody {
    constructor(size, color, semiMajorAxis, eccentricity, orbitalPeriod, parentStar) {
        super(size, color, 'goldberg');
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

        this.addFluid();
    }

    addFluid(){
        // Initialize Clock for animation
        this.clock = new THREE.Clock();

        // Assign a random fluid color
        this.fluidColor = new THREE.Color(Math.random(), Math.random(), Math.random());

        const fluidGeometry = new THREE.SphereGeometry(this.size * 0.99, 32, 32);
        const fluidMaterial = new THREE.ShaderMaterial({
            vertexShader: fluidVertexShader,
            fragmentShader: fluidFragmentShader,
            uniforms: {
                time: { value: 0.0 },
                fluidColor: { value: this.fluidColor }
            },
            transparent: false,
            polygonOffset: true,
            polygonOffsetFactor: 2,
            polygonOffsetUnits: 2,
            side: THREE.FrontSide,
        });

        const fluidMesh = new THREE.Mesh(fluidGeometry, fluidMaterial);
        this.fluidMesh = fluidMesh;
        // Make the fluid mesh is not less priority than the planet mesh
        this.fluidMesh.renderOrder = 1;
        
        this.mesh.add(this.fluidMesh);
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

        const delta = this.clock.getDelta();
        this.fluidMesh.material.uniforms.time.value += delta * 10;
    }
}
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
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 normal = normalize(vNormal);
    float lightIntensity = dot(normal, lightDir) * 1.0;

    // Create a wave pattern
    float wave = sin(vPosition.x * 10.0 + time * 2.0) * 0.5 + 0.5;
    wave += sin(vPosition.z * 10.0 + time * 2.5) * 0.5 + 0.5;
    wave *= 0.5;

    // Create a ripple effect
    float distance = length(vPosition.xy);
    float ripple = sin(distance * 12.0 - time * 4.0) * 0.1;

    // Combine wave and ripple effects
    float pattern = wave + ripple;

    // Adjust the fluid color based on the pattern
    vec3 color = mix(fluidColor, fluidColor * 0.95, pattern);

    // Add specular highlights
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = vec3(1.0) * spec * 0.5;

    gl_FragColor = vec4(color + specular, 1.0);
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
        if (this.has_atmosphere) {
            this.addAtmosphere();
            this.has_fluid = getRandomNumber() > 0.5;
            if (this.has_fluid) {
                this.addFluid();
            }            
        }
    }

    addFluid(){
        // Assign a random fluid color
        this.fluidColor = new THREE.Color(getRandomNumber(), getRandomNumber(), getRandomNumber());

        const fluidGeometry = new THREE.SphereGeometry(this.size * 0.99, 32, 32);
        const fluidMaterial = new THREE.ShaderMaterial({
            vertexShader: fluidVertexShader,
            fragmentShader: fluidFragmentShader,
            uniforms: {
                time: { value: 0.0 },
                fluidColor: { value: this.fluidColor }
            },
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
            transparent: false,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending
        });

        const fluidMesh = new THREE.Mesh(fluidGeometry, fluidMaterial);
        this.fluidMesh = fluidMesh;    
            
        
        this.mesh.add(this.fluidMesh);
    }

    addAtmosphere(){
        this.atmosphereThickness = getRandomNumber() * 0.5 + 1;
        this.atmosphereColor = getRandomNumber() * 0xffffff;
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

        if (this.has_fluid) {
            this.fluidMesh.material.uniforms.time.value += deltaTime;    
        }
    }
}
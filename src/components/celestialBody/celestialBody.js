import * as THREE from 'three';
import { getRandomNumber } from '../../utils/random';
import { createGoldbergPolyhedron } from '../../utils/goldbergPolygedron';
import { generateRandomName } from '../../utils/nameGenerator';

export class CelestialBody {
    constructor(size = 1, color = 0xffffff, type = 'sphere', texturePath = 'assets/textures/a_albedo.png') {
        this.size = size;
        this.color = new THREE.Color(color);
        this.type = type;
        this.rotationSpeedX = (getRandomNumber() - 0.5) * 0.01;
        this.rotationSpeedY = (getRandomNumber() - 0.5) * 0.01;
        this.name = generateRandomName();
    
        // const textureLoader = new THREE.TextureLoader();
        // const texture = textureLoader.load(texturePath);

        this.geometry = null;

        if (type === 'goldberg') {
            const detail = 5;
            const roughness = getRandomNumber() * 0.25 + 0.1;
            const stepSize = getRandomNumber() * 0.25 + 0.1;
            const noisePower = 2 * Math.floor(getRandomNumber() * 3) + 1;
            this.geometry = createGoldbergPolyhedron(size, detail, roughness, stepSize, noisePower);
            this.material = new THREE.MeshStandardMaterial({ color: color, emissive: 0x000000, emissiveIntensity: 0.5 });
        }
        else if (type === 'sphere') {
            this.geometry = new THREE.SphereGeometry(size, 16,16);
            this.material = new THREE.MeshStandardMaterial({ color: color, emissive: 0x000000, emissiveIntensity: 0.5 });
        } else if (type === 'cube') {
            this.geometry = new THREE.BoxGeometry(size, size, size);
            this.material = new THREE.MeshStandardMaterial({ color: color, emissive: 0x000000, emissiveIntensity: 0.5 });
        }
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Skeleton wireframe
        const wireframe = new THREE.WireframeGeometry(this.geometry);
        const line = new THREE.LineSegments(wireframe);
        line.material.opacity = 0.05;
        line.material.transparent = true;
        this.mesh.add(line);

    }

    rotate(deltaTime) {
        this.mesh.rotation.y += this.rotationSpeedX * deltaTime;
        this.mesh.rotation.x += this.rotationSpeedY * deltaTime;
    }

    initCelesitalDetails() {
        this.celestialDetails = {};
        this.celestialDetails['Name'] = this.name;
        this.celestialDetails['Size'] = this.size;
        // Convert hex
        this.celestialDetails['Color'] = this.color.getHexString();
        this.celestialDetails['Type'] = this.type;
    }

}
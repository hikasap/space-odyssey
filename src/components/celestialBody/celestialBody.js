import * as THREE from 'three';
import { getRandomNumber } from '../../utils/random';
import { createGoldbergPolyhedron } from '../../utils/goldbergPolygedron';

export class CelestialBody {
    constructor(size = 1, color = 0xffffff, type = 'sphere', texturePath = 'assets/textures/a_albedo.png') {
        this.size = size;
        this.color = color;
        this.type = type;
        this.rotationSpeedX = (getRandomNumber() - 0.5) * 0.2;
        this.rotationSpeedY = (getRandomNumber() - 0.5) * 0.2;

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        let geometry;

        if (type === 'sphere') {
            geometry = createGoldbergPolyhedron(size, 4, 0.05);
            // geometry = new THREE.SphereGeometry(size, 32, 32);
            this.material = new THREE.MeshStandardMaterial({ map: texture, color: color, emissive: 0x000000, emissiveIntensity: 0.5 });
        } else if (type === 'cube') {
            geometry = new THREE.BoxGeometry(size, size, size);
            this.material = new THREE.MeshStandardMaterial({ map: texture, color: color, emissive: 0x000000, emissiveIntensity: 0.5 });
        }

        this.mesh = new THREE.Mesh(geometry, this.material);
    }

    rotate(deltaTime) {
        this.mesh.rotation.y += this.rotationSpeedX * deltaTime;
        this.mesh.rotation.x += this.rotationSpeedY * deltaTime;
    }
}
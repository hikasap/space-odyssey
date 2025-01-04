import * as THREE from 'three';

export class CelestialBody {
    constructor(size = 1, color = 0xffffff, type = 'sphere', texturePath = 'assets/textures/a_albedo.png') {
        this.size = size;
        this.color = color;
        this.type = type;
        this.rotationSpeedX = (Math.random() - 0.5) * 0.02;
        this.rotationSpeedY = (Math.random() - 0.5) * 0.02;

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        let geometry;
        if (type === 'sphere') {
            geometry = new THREE.SphereGeometry(size, 12, 12);
            this.material = new THREE.MeshStandardMaterial({ map: texture, color: color, emissive: 0x000000, emissiveIntensity: 0.5 });
        } else if (type === 'cube') {
            geometry = new THREE.BoxGeometry(size, size, size);
            this.material = new THREE.MeshStandardMaterial({ map: texture, color: color, emissive: 0x000000, emissiveIntensity: 0.5 });
        }

        this.mesh = new THREE.Mesh(geometry, this.material);
    }

    rotate() {
        this.mesh.rotation.y += this.rotationSpeedX;
        this.mesh.rotation.x += this.rotationSpeedY;
    }
}
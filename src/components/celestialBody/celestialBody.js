import * as THREE from 'three';
import { getRandomNormal, getRandomNumber } from '../../utils/random';
import { createGoldbergPolyhedron } from '../../utils/goldbergPolygedron';
import { generateRandomName } from '../../utils/nameGenerator';
import PhysicsInstance from '../../core/physics';

export class CelestialBody {
    constructor(size = 1, color = 0xffffff, type = 'sphere', texturePath = 'assets/textures/a_albedo.png') {
        this.size = size;
        this.color = new THREE.Color(color);
        this.type = type;
        this.rotationSpeedX = (getRandomNumber() - 0.5) * 0.01;
        this.rotationSpeedY = (getRandomNumber() - 0.5) * 0.01;
        this.name = generateRandomName();
        this.density = getRandomNumber() * 20 + 1;
        this.geometry = null;
        this.pullRadius = 0;

        if (type === 'goldberg') {
            const detail = 4;
            const roughness = getRandomNumber() * 0.25 + 0.1;
            const stepSize = getRandomNumber() * 0.25 + 0.05;
            let val = getRandomNormal(0.1, 0.5);
            const frequency = Math.min(Math.max(val, 0), 1); 
            this.geometry = createGoldbergPolyhedron(size, detail, roughness, stepSize, frequency, 0.5);
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

    addPhysics() {
        this.mass = this.size * this.size * this.size * this.density;
        // The radius where the planet starts to pull objects towards it
        this.pullRadius = Math.cbrt(this.mass);
        // // Draw a debug sphere to show the pull radius
        // const pullGeometry = new THREE.SphereGeometry(this.pullRadius, 64, 64);
        // const pullMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true , opacity: 0.025, transparent: true });
        // const pullMesh = new THREE.Mesh(pullGeometry, pullMaterial);
        // this.mesh.add(pullMesh);

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
        this.celestialDetails['Density'] = this.density;
        this.celestialDetails['Mass'] = this.mass;
    }

}
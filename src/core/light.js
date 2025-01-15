import * as THREE from 'three';
import { gameConfig } from '../systems/configs/gameConfig';

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(gameConfig.ambientLightColor, gameConfig.ambientLightIntensity);
gameConfig.addEventListener('ambientLightColorChanged', (value) => {
    ambientLight.color.set(value);
}
);
gameConfig.addEventListener('ambientLightIntensityChanged', (value) => {
    ambientLight.intensity = value;
}
);

export { light, ambientLight };

import * as THREE from 'three';
import { gameConfig } from '../systems/configs/gameConfig';

const ambientLight = new THREE.AmbientLight(gameConfig.ambientLightColor, gameConfig.ambientLightIntensity);

gameConfig.addEventListener('ambientLightColorChanged', (value) => {
    ambientLight.color.set(value);
});
gameConfig.addEventListener('ambientLightIntensityChanged', (value) => {
    ambientLight.intensity = value;
});

export { ambientLight };

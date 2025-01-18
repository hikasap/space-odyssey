import * as dat from 'dat.gui';
import * as THREE from 'three';

export class GameConfig {
    
    constructor() {
        this.listeners = {};
        this._defaultValues = {
            chunkSize: 2048,
            speedMultiplier: 1.0,
            solarSystemSeed: 61,
            displayStarfield: true,
            displayChunkBorders: false,
            displayOrbits: true,
            afterimagePassDamp: 0.5,
            cameraFov: 75,
            cameraNear: 0.01,
            cameraFar: 2048 * 4,
            cameraLerpSpeed: 0.2,
            cameraFollowOffsetX : 0,
            cameraFollowOffsetY : 0.1,
            cameraFollowOffsetZ : -0.2,
            starfieldDensity: 10000,
            starfieldColor: 0xaaaaaa,
            ambientLightColor: 0xffffff,
            ambientLightIntensity: 0.05,
            spacecraftMainEngineThrust: 500,
            spacecraftSideEngineThrust: 25,
            spacecraftBackEngineThrust: 1,
            spacecraftRotationalFactor: 0.01,
        };
        this.initAll();
        this.gui = this.getDatGui();
    }

    initAll() {
        Object.assign(this, this._defaultValues);
    }

    resetAll() {
        Object.assign(this, this._defaultValues);
        this.updateGui();
    }

    resetProperty(property) {
        if (this._defaultValues.hasOwnProperty(property)) {
            this[property] = this._defaultValues[property];
        }
    }

    updateGui() {
        const folderNames = Object.keys(this.gui.__folders);
        folderNames.forEach(folderName => {
            const folder = this.gui.__folders[folderName];
            folder.__controllers.forEach(controller => {
                controller.updateDisplay();
            });
        });
    }

    getDatGui() {
        const gui = new dat.GUI();
        const config = this;
        const generalFolder = gui.addFolder('General');
        generalFolder.add(config, 'chunkSize', 128, 2048).name('Chunk Size');
        generalFolder.add(config, 'speedMultiplier', 0.25, 500, 0.25).name('Speed Multiplier');
        generalFolder.add(config, 'solarSystemSeed', 0, 1000).name('Solar System Seed');

        const displayFolder = gui.addFolder('Display');
        displayFolder.add(config, 'displayStarfield').name('Display Starfield');
        displayFolder.add(config, 'displayChunkBorders').name('Display Chunk Borders');
        displayFolder.add(config, 'displayOrbits').name('Display Orbits');
        displayFolder.add(config, 'afterimagePassDamp', 0, 1, 0.01).name('Afterimage Pass Damp');

        const cameraFolder = gui.addFolder('Camera');
        cameraFolder.add(config, 'cameraFov', 30, 120).name('Camera FOV');
        cameraFolder.add(config, 'cameraNear', 0.01, 1, 0.01).name('Camera Near');
        cameraFolder.add(config, 'cameraFar', 512, 16384).name('Camera Far');
        cameraFolder.add(config, 'cameraLerpSpeed', 0.01, 1).name('Camera Lerp Speed');
        cameraFolder.add(config, 'cameraFollowOffsetX', -1.0, 1.0, 0.01).name('Camera Follow Offset X');
        cameraFolder.add(config, 'cameraFollowOffsetY', -1.0, 1.0, 0.01).name('Camera Follow Offset Y');
        cameraFolder.add(config, 'cameraFollowOffsetZ', -1.0, 1.0, 0.01).name('Camera Follow Offset Z');


        const starfieldFolder = gui.addFolder('Starfield');
        starfieldFolder.add(config, 'starfieldDensity', 1000, 50000).name('Starfield Density');
        starfieldFolder.addColor(config, 'starfieldColor').name('Starfield Color');

        const lightFolder = gui.addFolder('Light');
        lightFolder.addColor(config, 'ambientLightColor').name('Ambient Light Color');
        lightFolder.add(config, 'ambientLightIntensity', 0, 1).name('Ambient Light Intensity');
        
        const spacecraftFolder = gui.addFolder('Spacecraft');
        spacecraftFolder.add(config, 'spacecraftMainEngineThrust' , 1, 10000).name('Main Engine Thrust');
        spacecraftFolder.add(config, 'spacecraftSideEngineThrust', 1, 1000).name('Side Engine Thrust');
        spacecraftFolder.add(config, 'spacecraftBackEngineThrust', 0.1, 10).name('Back Engine Thrust');
        spacecraftFolder.add(config, 'spacecraftRotationalFactor', 0.001, 0.1).name('Rotational Factor');

        gui.add(config, 'resetAll').name('Reset All');

        

        return gui;
    }

    addEventListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    removeEventListener(event, callback) {
        if (!this.listeners[event]) return;
        const index = this.listeners[event].indexOf(callback);
        if (index > -1) {
            this.listeners[event].splice(index, 1);
        }
    }

    dispatchEvent(event, data) {
        console.log('dispatching event', event, data);
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => {
            callback(data);
        }
        );
    }

    get chunkSize() {
        return this._chunkSize;
    }

    set chunkSize(value) {
        this._chunkSize = value;
        this.dispatchEvent('chunkSizeChanged', value);
    }

    get speedMultiplier() {
        return this._speedMultiplier;
    }

    set speedMultiplier(value) {
        this._speedMultiplier = value;
        this.dispatchEvent('speedMultiplierChanged', value);
    }

    get solarSystemSeed() {
        return this._solarSystemSeed;
        
    }

    set solarSystemSeed(value) {
        this._solarSystemSeed = value
        this.dispatchEvent('solarSystemSeedChanged', value);
    }

    get displayStarfield() {
        return this._displayStarfield;
    }

    set displayStarfield(value) {
        this._displayStarfield = value;
        this.dispatchEvent('displayStarfieldChanged', value);
    }

    get displayChunkBorders() {
        return this._displayChunkBorders;
    }

    set displayChunkBorders(value) {
        this._displayChunkBorders = value;
        this.dispatchEvent('displayChunkBordersChanged', value);
    }

    get displayOrbits() {
        return this._displayOrbits;
    }

    set displayOrbits(value) {
        this._displayOrbits = value;
        this.dispatchEvent('displayOrbitsChanged', value);
    }

    get afterimagePassDamp() {
        return this._afterimagePassDamp;
    }

    set afterimagePassDamp(value) {
        this._afterimagePassDamp = value;
        this.dispatchEvent('afterimagePassDampChanged', value);
    }

    get cameraFov() {
        return this._cameraFov;
    }

    set cameraFov(value) {
        this._cameraFov = value;
        this.dispatchEvent('cameraFovChanged', value);
    }

    get cameraNear() {
        return this._cameraNear;
    }

    set cameraNear(value) {
        this._cameraNear = value;
        this.dispatchEvent('cameraNearChanged', value);
    }

    get cameraFar() {
        return this._cameraFar;
    }

    set cameraFar(value) {
        this._cameraFar = value;
        this.dispatchEvent('cameraFarChanged', value);
    }

    get starfieldDensity() {
        return this._starfieldDensity;
    }

    set starfieldDensity(value) {
        this._starfieldDensity = value;
        this.dispatchEvent('starfieldDensityChanged', value);
    }

    get starfieldColor() {
        return this._starfieldColor;
    }

    set starfieldColor(value) {
        this._starfieldColor = value;
        this.dispatchEvent('starfieldColorChanged', value);
    }

    get cameraFollowOffset() {
        return new THREE.Vector3(this.cameraFollowOffsetX, this.cameraFollowOffsetY, this.cameraFollowOffsetZ);
    }

    set cameraFollowOffset(value) {
        this.cameraFollowOffsetX = value.x;
        this.cameraFollowOffsetY = value.y;
        this.cameraFollowOffsetZ = value.z;
    }

    get cameraLerpSpeed() {
        return this._cameraLerpSpeed;
    }

    set cameraLerpSpeed(value) {
        this._cameraLerpSpeed = value;
        this.dispatchEvent('cameraLerpSpeedChanged', value);
    }

    get ambientLightColor() {
        return this._ambientLightColor;
    }

    set ambientLightColor(value) {
        this._ambientLightColor = value;
        this.dispatchEvent('ambientLightColorChanged', value);
    }

    get ambientLightIntensity() {
        return this._ambientLightIntensity;
    }

    set ambientLightIntensity(value) {
        this._ambientLightIntensity = value;
        this.dispatchEvent('ambientLightIntensityChanged', value);
    }

    get spacecraftMainEngineThrust() {
        return this._spacecraftMainEngineThrust;
    }

    set spacecraftMainEngineThrust(value) {
        this._spacecraftMainEngineThrust = value;
        this.dispatchEvent('spacecraftMainEngineThrustChanged', value);
    }

    get spacecraftSideEngineThrust() {
        return this._spacecraftSideEngineThrust;
    }

    set spacecraftSideEngineThrust(value) {
        this._spacecraftSideEngineThrust = value;
        this.dispatchEvent('spacecraftSideEngineThrustChanged', value);
    }

    get spacecraftBackEngineThrust() {
        return this._spacecraftBackEngineThrust;
    }

    set spacecraftBackEngineThrust(value) {
        this._spacecraftBackEngineThrust = value;
        this.dispatchEvent('spacecraftBackEngineThrustChanged', value);
    }

    get spacecraftRotationalFactor() {
        return this._spacecraftRotationalFactor;
    }

    set spacecraftRotationalFactor(value) {
        this._spacecraftRotationalFactor = value;
        this.dispatchEvent('spacecraftRotationalFactorChanged', value);
    }
}

GameConfig.instance = new GameConfig();

export const gameConfig = GameConfig.instance;

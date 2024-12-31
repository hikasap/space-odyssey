import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
const geometry = new THREE.SphereGeometry( 1, 32, 32 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

camera.position.z = 10;

let angle = 0;
const radius = 5;

function animate() {
    angle += 0.01;
    sphere.position.x = radius * Math.cos(angle);
    sphere.position.z = radius * Math.sin(angle);

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render( scene, camera );
}
const textureLoader = new THREE.TextureLoader();
textureLoader.load('../assets/textures/a_albedo.png', function (texture) {
    sphere.material.map = texture;
    sphere.material.needsUpdate = true;
});
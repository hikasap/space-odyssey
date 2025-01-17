import * as THREE from 'three';
import { Perlin } from './perlin';
import { threshold } from 'three/tsl';

/**
 * Creates a Goldberg-like polyhedron from scratch by:
 *  1) Defining base icosahedron vertices and faces mathematically.
 *  2) Subdividing those faces a given number of times.
 *  3) Projecting new vertices onto a sphere (and applying random height perturbations).
 *
 * @param {number} radius    - Target radius of the sphere.
 * @param {number} detail    - Number of subdivisions (higher = more faces).
 * @param {number} roughness - How much to randomly displace each vertex radially.
 * @returns {THREE.BufferGeometry} A BufferGeometry representing the subdivided polyhedron.
 */
export function createGoldbergPolyhedron(radius = 1, detail = 1, roughness = 0.1) {
    
    const perlin = new Perlin();

    // 1) Define base icosahedron vertices & faces (mathematical approach)
  const t = (1 + Math.sqrt(5)) / 2; // golden ratio
  const baseVertices = [
    new THREE.Vector3(-1,  t,  0),
    new THREE.Vector3( 1,  t,  0),
    new THREE.Vector3(-1, -t,  0),
    new THREE.Vector3( 1, -t,  0),
    new THREE.Vector3( 0, -1,  t),
    new THREE.Vector3( 0,  1,  t),
    new THREE.Vector3( 0, -1, -t),
    new THREE.Vector3( 0,  1, -t),
    new THREE.Vector3( t,  0, -1),
    new THREE.Vector3( t,  0,  1),
    new THREE.Vector3(-t,  0, -1),
    new THREE.Vector3(-t,  0,  1),
  ];

  // Normalize all base vertices (project onto unit sphere to start)
  baseVertices.forEach(v => v.normalize());

  // 20 triangular faces of an icosahedron (indices into baseVertices)
  const baseFaces = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ];

  // 2) Subdivide each face detail times & gather final vertices/triangles
  const finalPositions = [];
  const finalIndices = [];
  let vertexMap = new Map(); // to avoid duplicating vertices
  let indexCounter = 0;

  /**
   * Helper: add a new THREE.Vector3 to finalPositions, return its index.
   * If the vertex is already stored, reuse the existing index.
   */
  function addVertex(vec) {
    // Key by approximate coordinate to limit duplicates
    const key = `${vec.x.toFixed(5)},${vec.y.toFixed(5)},${vec.z.toFixed(5)}`;
    if (vertexMap.has(key)) {
      return vertexMap.get(key);
    }
    finalPositions.push(vec);
    vertexMap.set(key, indexCounter);
    return indexCounter++;
  }

  /**
   * Helper: subdivide a single triangle [v1, v2, v3] recursively.
   * v1, v2, v3 are THREE.Vector3 positions on the unit sphere.
   */
  function subdivideTriangle(v1, v2, v3, depth) {
    if (depth <= 0) {
      // add face [v1, v2, v3] to finalIndices
      const i1 = addVertex(v1.clone());
      const i2 = addVertex(v2.clone());
      const i3 = addVertex(v3.clone());
      finalIndices.push(i1, i2, i3);
      return;
    }
    // midpoints
    const v12 = v1.clone().add(v2).multiplyScalar(0.5).normalize();
    const v23 = v2.clone().add(v3).multiplyScalar(0.5).normalize();
    const v31 = v3.clone().add(v1).multiplyScalar(0.5).normalize();
    // subdivide further
    subdivideTriangle(v1,  v12, v31, depth - 1);
    subdivideTriangle(v2,  v23, v12, depth - 1);
    subdivideTriangle(v3,  v31, v23, depth - 1);
    subdivideTriangle(v12, v23, v31, depth - 1);
  }

  // Subdivide all base icosahedron faces
  for (const face of baseFaces) {
    const [i1, i2, i3] = face;
    const v1 = baseVertices[i1];
    const v2 = baseVertices[i2];
    const v3 = baseVertices[i3];
    subdivideTriangle(v1, v2, v3, detail);
  }

  // 3) Create BufferGeometry & project new vertices onto radius + roughness
  // Convert finalPositions (THREE.Vector3) to typed arrays
  const positionArray = new Float32Array(finalPositions.length * 3);
  for (let i = 0; i < finalPositions.length; i++) {
    // random radial offset
    const noiseVal = perlin.noise(finalPositions[i].x, finalPositions[i].y, finalPositions[i].z);
    // console.log(noiseVal);
    let mountain_threshold = 0.5;
    let treshold = 0;
    if(noiseVal > mountain_threshold){
      treshold = 0.1 + noiseVal;
    }
    if (noiseVal < -mountain_threshold){
      treshold = -0.1 + noiseVal;
    }
    const offset = treshold * roughness;
    finalPositions[i].multiplyScalar(radius * (1 + offset));
    positionArray[3 * i + 0] = finalPositions[i].x;
    positionArray[3 * i + 1] = finalPositions[i].y;
    positionArray[3 * i + 2] = finalPositions[i].z;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
  geometry.setIndex(finalIndices);


  // Recompute normals & bounding info
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return geometry;
}
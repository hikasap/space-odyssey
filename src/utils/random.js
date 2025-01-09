import seedrandom from 'seedrandom'; 
let rng = seedrandom('default-seed');

/**
 * Allows switching or editing the seed at runtime with an integer
 * @param {string} seed
 * @returns {void}
 * @example
 */
export function setSeed(seed) {
    rng = seedrandom(seed);
} 

/*
* Returns a random number between 0 and 1
* @returns {number}
* @example
*/
export function getRandomNumber() {
    return rng();
}
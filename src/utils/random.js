import seedrandom from 'seedrandom'; 

let _seed = '0';
let _rng = seedrandom(_seed);

/**
 * Allows switching or editing the seed at runtime with an integer
 * @param {string} seed
 * @returns {void}
 */
export function setSeed(seed) {
    _rng = seedrandom(seed);
    _seed = seed;
} 

/*
* Returns a random number between 0 and 1
* @returns {number}
*/
export function getRandomNumber() {
    return _rng.quick();
}

/* 
* Reset the random generator with current seed
* to ensure the same sequence of random numbers
* returned for a certain procedure. Call this
* before starting a new procedure.
* @returns {void}
*/
export function resetRandom() {
    _rng = seedrandom(_seed);
}

/*
* Return a random number normal distributed
* Using box muller
* @param {number} sigma - standard deviation
* @param {number} mu - mean
* @returns {number}
*/
export function getRandomNormal(sigma = 1, mu = 0) {
    let u1 = 1 - _rng.quick();
    let u2 = 1 - _rng.quick();
    let z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * sigma + mu;
}
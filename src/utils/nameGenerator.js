/**
 * Generates random names for celestial bodies based on weighted syllable structures.
 * The names are composed of random vowels and consonants, arranged in patterns.
 * 
 * @module NameGenerator
 */

import { getRandomNumber } from "./random";

/**
 * Generates a random name for a celestial body.
 * The name consists of a combination of vowels and consonants, structured by weighted syllable types.
 *
 * @returns {string} - A randomly generated name with the first letter capitalized.
 * 
 * @example
 * import { generateRandomName } from './nameGenerator';
 * 
 * const celestialName = generateRandomName();
 * console.log('Generated Name:', celestialName);
 */
export function generateRandomName() {
    // Arrays of vowels and consonants
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

    // Random number of syllables (1-3)
    const numberOfSyllables = Math.floor(getRandomNumber() * 3) + 1;

    // Types and weights of syllables
    const syllableType = ['vc', 'cvc', 'cv', 'v', 'cvcc', 'vcc', 'ccv', 'ccvc'];
    const syllableWeights = [0.1, 0.2, 0.2, 0.2, 0.1, 0.1, 0.05, 0.05];

    let name = '';

    // Generate syllables
    for (let i = 0; i < numberOfSyllables; i++) {
        // Determine syllable type based on weights
        const value = getRandomNumber();
        let type = '';
        let sum = 0;

        for (let j = 0; j < syllableWeights.length; j++) {
            sum += syllableWeights[j];
            if (value <= sum) {
                type = syllableType[j];
                break;
            }
        }

        // Build syllable using type
        for (const char of type) {
            if (char === 'v') {
                name += vowels[Math.floor(getRandomNumber() * vowels.length)];
            } else {
                name += consonants[Math.floor(getRandomNumber() * consonants.length)];
            }
        }
    }

    // Capitalize the first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
}

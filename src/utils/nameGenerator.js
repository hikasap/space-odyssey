// Generate random names for celestial bodies.
import { getRandomNumber } from "./random";
export function generateRandomName() {
    const vovels = ['a', 'e', 'i', 'o', 'u'];
    const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
    const numberOfSyllables = Math.floor(getRandomNumber() * 3) + 1;
    const syllableType = ['vc', 'cvc', 'cv', 'v', 'cvcc', 'vcc', 'ccv', 'ccvc'];
    const syllableWeights = [0.1, 0.2, 0.2, 0.2, 0.1, 0.1, 0.05, 0.05];

    let name = '';

    for (let i = 0; i < numberOfSyllables; i ++){
        // using syllableWeights
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

        for (const char of type) {
            if (char === 'v') {
                name += vovels[Math.floor(getRandomNumber() * vovels.length)];
            } else {
                name += consonants[Math.floor(getRandomNumber() * consonants.length)];
            }
        }
    }

    return name.charAt(0).toUpperCase() + name.slice(1);
}
    
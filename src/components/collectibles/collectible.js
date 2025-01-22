/**
 * Collectible class
 */
export class Collectible {
   
    /**
     * Constructor
     * 
     * Creates a new instance of the Collectible class.
     * 
     * @param {string} type The type of collectible
     * @param {number} amount The amount of the collectible
     */
    constructor(type, amount) {
        this.type = type;
        this.amount = amount;
    }

    /**
     * Get the type of the collectible
     * 
     * Returns the type of the collectible.
     * 
     * @returns {string} The type of the collectible
     */
    getType() {
        return this.type;
    }

    /**
     * Get the amount of the collectible
     * 
     * Returns the amount of the collectible.
     * 
     * @returns {number} The amount of the collectible
     */
    getAmount() {
        return this.amount;
    }
}

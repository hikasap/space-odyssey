/**
 * Manages fuel levels for a system, such as a vehicle or machinery.
 */
export class FuelManager {
    /**
     * Creates an instance of the FuelManager class.
     * @param {number} [capacity=1000] - The maximum amount of fuel that the system can hold. Defaults to 1000
     * @param {number} [initialFuel=1000] - The initial amount of fuel. Defaults to 1000.
     * @param {number} [consumptionRate=0.001] - The rate at which fuel is consumed per unit of activity. Defaults to 0.001.
     */
    constructor(capacity = 1000, initialFuel = 1000, consumptionRate = 0.001) {
        /**
         * The maximum amount of fuel that the system can hold.
         * @type {number}
         * */
        this.capacity = capacity;
        
        /** 
         * The current amount of fuel. 
         * @type {number} 
         */
        this.fuel = initialFuel;

        /** 
         * The rate at which fuel is consumed per unit of activity. 
         * @type {number} 
         */
        this.consumptionRate = consumptionRate;
    }

    /**
     * Consumes fuel based on the specified amount of activity.
     * @param {number} amount - The amount of activity causing fuel consumption.
     * @returns {boolean} - Returns `true` if there is fuel remaining after consumption, otherwise `false`.
     */
    consumeFuel(amount) {
        const fuelConsumed = this.consumptionRate * amount;
        this.fuel = Math.max(this.fuel - fuelConsumed, 0);
        return this.fuel > 0;
    }

    /**
     * Refuels the system by a specified amount.
     * @param {number} amount - The amount of fuel to add.
     * Ensures that the fuel level does not exceed the maximum capacity of 1000.
     */
    refuel(amount) {
        this.fuel += amount;
        this.fuel = Math.min(this.fuel, this.capacity);
    }

    /**
     * Gets the current fuel level.
     * @returns {number} - The current fuel level.
     */
    getFuelLevel() {
        return this.fuel;
    }
}

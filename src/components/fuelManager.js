export class FuelManager {
    constructor(initialFuel = 1000, consumptionRate = 0.001) {
        this.fuel = initialFuel;
        this.consumptionRate = consumptionRate;
    }

    consumeFuel(amount) {
        console.log('amount', amount);
        const fuelConsumed = this.consumptionRate * amount;
        console.log('fuelConsumed', fuelConsumed);
        this.fuel = Math.max(this.fuel - fuelConsumed, 0);
        console.log('fuel', this.fuel);
        return this.fuel > 0;
    }

    refuel(amount) {
        this.fuel += amount;
        this.fuel = Math.min(this.fuel, 1000);
    }

    getFuelLevel() {
        return this.fuel;
    }
}
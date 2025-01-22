/**
 * InventoryManager class
 * 
 * This class is responsible for managing the player's inventory.
 * It keeps track of the resources the player has collected and
 * provides methods to add and remove resources.
 * 
 * The inventory has a capacity limit, which can be set when creating
 * a new instance of the InventoryManager class.
 * 
 * The inventory manager also provides a method to get the total amount
 * of resources the player has collected.
 * 
 * 
 */
export class InventoryManager {
    
    /**
     * Constructor
     * 
     * Creates a new instance of the InventoryManager class.
     * 
     * @param {number} capacity The maximum amount of resources the inventory can hold
     */
    constructor(capacity = 1000) {
        this.capacity = capacity;
        this.resources = {};
    }

    /**
     * Add a collectible to the inventory
     * 
     * This method adds a collectible to the inventory. The collectible
     * is an object with a type and an amount. The type is a string that
     * represents the type of resource, and the amount is a number that
     * represents the quantity of the resource.
     * 
     * If the inventory has enough capacity to hold the collectible, the
     * collectible is added to the inventory and the method returns true.
     * Otherwise, the collectible is not added to the inventory and the
     * method returns false.
     * 
     * @param {object} collectible The collectible to add to the inventory
     * @returns {boolean} True if the collectible was added, false otherwise
     */
    addResource(collectible) {
        if (!this.resources[collectible.type]) {
            this.resources[collectible.type] = 0;
        }

        const totalAmount = this.getTotalResources() + collectible.amount;
        if (totalAmount > this.capacity) {
            console.error('Not enough capacity to add resources');
            return false;
        }

        this.resources[collectible.type] += collectible.amount;
        return true;
    }

    /**
     * Remove a resource from the inventory
     * 
     * This method removes a resource from the inventory. The resource
     * is identified by its type, which is a string that represents the
     * type of resource, and the amount is a number that represents the
     * quantity of the resource to remove.
     * 
     * If the inventory has enough of the specified resource, the resource
     * is removed from the inventory and the method returns true. Otherwise,
     * the resource is not removed from the inventory and the method returns
     * false.
     * 
     * @param {string} type The type of resource to remove
     * @param {number} amount The amount of the resource to remove
     * @returns {boolean} True if the resource was removed, false otherwise
     * 
     */
    removeResource(type, amount) {
        if (!this.resources[type]) {
            console.error(`Unknown resource type: ${type}`);
            return false;
        }

        if (this.resources[type] < amount) {
            console.error('Not enough resources to remove');
            return false;
        }

        this.resources[type] -= amount;
        return true;
    }

    /**
     * Get the total amount of resources in the inventory
     * 
     * This method returns the total amount of resources in the inventory.
     * The total amount is calculated by summing the amount of each resource
     * type in the inventory.
     * 
     * @returns {number} The total amount of resources in the inventory
     */
    getTotalResources() {
        return Object.values(this.resources).reduce((acc, val) => acc + val, 0);
    }
}
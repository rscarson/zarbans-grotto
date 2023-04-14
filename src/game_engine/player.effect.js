'use strict';

export class PlayerEffect {
    constructor(json = {}) {
        Object.assign(this, json);
    }

    static build(json = {}) {
        switch (json.type) {
            case "status":
                return new PlayerStatusEffect(json);
            case "choices":
                return new PlayerChoiceEffect(json);
            case "inventory":
                return new PlayerInventoryEffect(json);
                
        }
    }

    /**
     * Verify this condition
     * @param {object} playerStatus 
     * @returns boolean
     */
    verify(player) {
        if (this.target == "all") {
            return player[this.type].list().map(e => this.verifyTarget(e, player[this.type])).filter(e => e == false).length == 0;
        } else {
            return this.verifyTarget(this.target, player[this.type]);
        }
    }

    /**
     * Apply this effect
     * @param {object} playerStatus 
     */
    apply(player, skip_inv_queue=false) {
        if (this.target == "all") {
            player[this.type].list().map(e => this.applyToTarget(e, player[this.type])).filter(e => e == false).length == 0;
        } else {
            this.applyToTarget(this.target, player[this.type]);
        }

        // Manage inventory effect queues
        if (!skip_inv_queue) {
            for (const e of player.inventory.addEffectQueue) {
                e.apply(player, true);
            }
            for (const e of player.inventory.delEffectQueue) {
                e.remove(player);
            }
            player.inventory.addEffectQueue = [];
            player.inventory.delEffectQueue = [];
        }
    }

    /**
     * Remove this effect
     * @param {object} playerStatus 
     */
    remove(player) {
        if (this.target == "all") {
            return player[this.type].list().map(e => this.removeFromTarget(e, player[this.type])).filter(e => e == false).length == 0;
        } else {
            this.removeFromTarget(this.target, player[this.type]);
        }
    }
}

class PlayerStatusEffect extends PlayerEffect {
    /**
     * Verify this condition against a specific target
     * @param {String} target 
     * @param {object} data 
     * @returns boolean
     */
    verifyTarget(target, data) {
        switch (this.operation) {
            case "lt":
                return data.get(target).value < this.value;
            case "lte":
                return data.get(target).value <= this.value;
            case "gt":
                return data.get(target).value > this.value;
            case "gte":
                return data.get(target).value >= this.value;
            case "eq":
                return data.get(target).value == this.value;
            case "ne":
                return data.get(target).value != this.value;
        }
    }

    /**
     * Apply this effect to a specific target
     * @param {String} target 
     * @param {object} data 
     */
    applyToTarget(target, data) {
        switch (this.operation) {
            case "add":
                return data.get(target).add(this.value);
            case "add_max":
                return data.get(target).maximum += this.value;
        }
    }

    /**
     * Remove this effect from a specific target
     * @param {String} target 
     * @param {object} data 
     */
    removeFromTarget(target, data) {
        switch (this.operation) {
            case "add":
                return data.get(target).add(-this.value);
            case "add_max":
                return data.get(target).maximum -= this.value;
        }
    }
}

/**
 * An effect or condition towards player effects
 */
class PlayerChoiceEffect extends PlayerEffect {
    /**
     * Verify this condition against a specific target
     * @param {String} target 
     * @param {object} data 
     * @returns boolean
     */
    verifyTarget(target, data) {
        return this.value == data.chose(target);
    }

    /**
     * Apply this effect to a specific target
     * @param {String} target 
     * @param {object} data 
     */
    applyToTarget(target, data) {
        data.choose(target, this.value);
    }

    /**
     * Remove this effect from a specific target
     * @param {String} target 
     * @param {object} data 
     */
    removeFromTarget(target, data) {
        data.choose(target, !this.value);
    }
}

class PlayerInventoryEffect extends PlayerEffect {
    /**
     * Verify this condition against a specific target
     * @param {String} target 
     * @param {object} data 
     * @returns boolean
     */
    verifyTarget(target, data) {
        return data.has(target) == this.value;
    }

    /**
     * Apply this effect to a specific target
     * @param {String} target 
     * @param {object} data 
     */
    applyToTarget(target, data) {
        this.value
            ? data.give(target)
            : data.take(target);
    }

    /**
     * Remove this effect from a specific target
     * @param {String} target 
     * @param {object} data 
     */
    removeFromTarget(target, data) {
        this.value
            ? data.take(target)
            : data.give(target);
    }
}
'use strict';
import { PlayerEffect } from "./player.effect.js";

/**
 * The player's inventory
 */
export class PlayerInventory {
    constructor(json = {}) {
        Object.assign(this, JSON.parse(JSON.stringify(
            json
        )));
        for (const i in this.records) {
            this.records[i] = new PlayerInventoryItem(this.records[i]);
        }

        this.addEffectQueue = [];
        this.delEffectQueue = [];
    }

    /**
     * List the available entries
     * @returns Array
     */
    list() {
        return Object.keys(this.records);
    }

    /**
     * List the equipped entries
     * @returns Array
     */
    all_equipped() {
        return Object.values(this.records).filter(i => i.equipped);
    }

    /**
     * Set an item status
     * @param {String} item 
     * @param {Boolean} equipped 
     */
    set(item, equipped) {
        this.records[item].equipped = equipped;
    }

    /**
     * Give an item to the player
     * @param {String} item 
     * @returns array of effects to apply
     */
    give(item) {
        if (!this.has(item)) {
            this.addEffectQueue.push(...this.describe(item).effects);
        }
        this.set(item, true);
    }

    /**
     * Take an item away from the player
     * @param {String} item 
     */
    take(item) {
        if (this.has(item)) {
            this.delEffectQueue.push(...this.describe(item).effects);
        }
        this.set(item, false);
    }

    /**
     * Returns true if the player possesses the given item
     * @param {String} item 
     * @returns boolean
     */
    has(item) {
        return this.records[item].equipped;
    }

    /**
     * Returns item description
     * @param {String} item 
     * @returns boolean
     */
    describe(item) {
        return this.records[item];
    }

    /**
     * Return the full set of active effects from equipped items
     * @returns PlayEffect[]
     */
    activeEffects() {
        return Object.values(this.records).filter(i => i.equipped).map(i => i.effects).flat();
    }
}

/**
 * An item in the player's inventory
 */
class PlayerInventoryItem {
    constructor(json = {}) {
        Object.assign(this, json);
        for (const i in this.effects) {
            this.effects[i] = PlayerEffect.build(this.effects[i]);
        }
    }
}
'use strict';

/**
 * The player's choices
 */
export class PlayerChoices {
    constructor(json = {}) {
        Object.assign(this, JSON.parse(JSON.stringify(
            json
        )));
        for (const i in this.records) {
            this.records[i] = new PlayerChoice(this.records[i]);
        }
    }

    /**
     * List the available entries
     * @returns Array
     */
    list() {
        return Object.keys(this.records);
    }

    /**
     * List the available entries
     * @returns Array
     */
    list_chosen() {
        return Object.keys(this.records).filter(k => this.chose(k));
    }

    /**
     * Make a choice
     * @param {String} choice 
     */
    choose(choice, enabled) {
        this.records[choice].enabled = enabled;
    }

    /**
     * Returns true if the player chose the given path
     * @param {String} choice 
     * @returns boolean
     */
    chose(choice) {
        return this.records[choice].enabled;
    }
}

/**
 * An choice the player can make
 */
class PlayerChoice {
    constructor(json = {}) {
        Object.apply(this, json);
        if (this.enabled == undefined) {
            this.enabled = false;
        }
    }
}
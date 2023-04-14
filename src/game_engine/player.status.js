'use strict';

export class PlayerStatus {
    constructor(json = {}) {
        Object.assign(this, JSON.parse(JSON.stringify(
            json
        )));
        for (const i in this.records) {
            this.records[i] = new PlayerStatusItem(this.records[i]);
        }
    }

    /**
     * List the available status entries
     * @returns Array
     */
    list() {
        return Object.keys(this.records);
    }

    /**
     * List the available status entries
     * @returns Array
     */
    list_visible() {
        return this.list().filter(k => !this.records[k].hidden);
    }

    /**
     * Retrieve a status
     * @param {String} target 
     * @returns Number
     */
    get(target) {
        return this.records[target];
    }

    /**
     * Retrieve a status value
     * @param {String} target 
     * @returns Number
     */
    value(target) {
        return this.records[target].value;
    }

    /**
     * Change a status value
     * @param {String} target 
     * @param {Number} value 
     */
    set(target, value) {
        this.get(target).set(value);
    }

    /**
     * Add to a status value
     * @param {String} target 
     * @param {Number} value 
     */
    add(target, value) {
        this.get(target).add(value);
    }
}

class PlayerStatusItem {
    constructor(json = {}) {
        Object.assign(this, json);
        if (this.value==undefined) {
            this.value = this.default;
        }
    }

    /**
     * Change a status value
     * @param {Number} value 
     */
    set(value) {
        this.value = value;
        if (this.value < 0) {
            this.value = 0;
        } else if (this.value > this.maximum) {
            this.value = this.maximum;
        }
    }

    /**
     * Add to a status value
     * @param {Number} value 
     */
    add(value) {
        this.set(this.value + value);
    }
}
'use strict';
import { PlayerEffect } from "./player.effect.js";

export class Chapter {
    constructor(json = {}) {
        Object.assign(this, JSON.parse(JSON.stringify(
            json
        )));

        for (const i in this.records) {
            this.records[i] = new Story(this.records[i]);
        }
    }

    /**
     * Retrieve a story in the chapter by ID
     * @param {String} story_key 
     * @returns A Story object, or false
     */
    getStory(story_key) {
        return this.records[story_key] || false;
    }
}

export class Story {
    constructor(json = {}) {
        Object.assign(this, json);
        for (const i in this.effects) {
            this.effects[i] = PlayerEffect.build(this.effects[i]);
        }
        for (const i in this.options) {
            this.options[i] = new StoryOption(this.options[i]);
        }
    }
}

export class StoryOption {
    constructor(json = {}) {
        Object.assign(this, json);
        for (const i in this.results) {
            this.results[i] = new StoryOptionResult(this.results[i]);
        }
        for (const i in this.conditions) {
            this.conditions[i] = PlayerEffect.build(this.conditions[i]);
        }
    }

    toString() {
        return this.prompt;
    }
}

export class StoryOptionResult {
    constructor(json = {}) {
        
        if (typeof json === 'string' || json instanceof String) {
            this.target = json;
            this.conditions = [];
        } else {
            Object.assign(this, json);
            for (const i in this.conditions) {
                this.conditions[i] = PlayerEffect.build(this.conditions[i]);
            }
        }
    }
}
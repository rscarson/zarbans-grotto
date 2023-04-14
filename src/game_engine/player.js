'use strict';
import { PlayerChoices } from "./player.choices.js";
import { PlayerInventory } from "./player.inventory.js";
import { PlayerStatus } from "./player.status.js";
import { Chapter, Story } from "./chapter.js";
import { JsonUtilities } from "./json.utils.js";

import player_data from '../../dist/game.json' assert { type: "json" };

export class Player {
    constructor(json) {
        if (json === undefined) {
            JsonUtilities.assign(this, player_data);
        } else {
            JsonUtilities.assign(this, json);
        }

        this.choices = new PlayerChoices(this.choices);
        this.inventory = new PlayerInventory(this.inventory);
        this.status = new PlayerStatus(this.status);

        for (const i in this.chapters) {
            this.chapters[i] = new Chapter(this.chapters[i]);
        }

        if (this.currentStory === undefined) {
            this.setStory(this.entrypoint);
        } else {
            this.currentChapter = new Chapter(this.currentChapter);
            this.currentStory = new Story(this.currentStory);
        }
    }

    /**
     * Validate an option's conditions
     * @param {StoryOption} option 
     * @returns bool
     */
    validateConditions(conditions) {
        let stats = this.getAdjustedStats();
        for (const condition of conditions) {
            if (!condition.verify(stats)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Based on a selection, find the next available story
     * @param {Number} option_id 
     * @returns String, or false for invalid selections
     */
    nextStory(option_id) {
        let next = this.currentStory.options.filter(o => this.validateConditions(o.conditions))[option_id-1];
        if (next === undefined) return false;
        
        // Search results
        for (const result of next.results) {
            if (!this.validateConditions(result.conditions)) continue;
            this.setStory(result.target);
            return true;
        }

        return false;
    }

    /**
     * Update current game story
     * @param {String} story_key 
     */
    setStory(story_key) {
        for (const chapter of Object.values(this.chapters)) {
            let story = chapter.getStory(story_key);
            if (story !== false) {
                this.currentChapter = chapter;
                this.currentStory = story;

                for (const effect of story.effects) {
                    effect.apply(this);
                }
            }
        }
    }

    /**
     * Get inventory-effect adjusted stats
     * @returns a copy of the player
     */
    getAdjustedStats() {
        let playerCopy = new Player(this);
        for (const effect of this.inventory.activeEffects()) {
            effect.apply(playerCopy);
        }
        return this;
    }

    /**
     * Retrieve a story by ID
     * @param {String} story_key 
     * @returns A Story object, or false
     */
    getStory(story_key) {
        for (const chapter of Object.values(this.chapters)) {
            let story = chapter.getStory(story_key);
            if (story !== false) {
                return story;
            };
        }
        throw new Error(`Invalid story ID referenced: ${story_key}!`);
    }

    /**
     * Save current game status to a string
     * @returns String
     */
    save() {
        return Buffer.from(
            JSON.stringify(this)
        ).toString('base64');
    }

    /**
     * Restore a game save from the save data
     * @param {String} data 
     * @returns Player
     */
    static restore(data) {
        let unpacked = JSON.parse(
            Buffer.from(data, 'base64').toString('ascii')
        );
        return new Player(unpacked);
    }
}
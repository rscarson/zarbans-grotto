'use strict';
import { PlayerChoices } from "./player.choices.js";
import { PlayerInventory } from "./player.inventory.js";
import { PlayerStatus } from "./player.status.js";
import { Chapter, Story } from "./chapter.js";
import { JsonUtilities } from "./json.utils.js";

import _player_data from '../../dist/game.json' assert { type: "json" };
let player_data = _player_data;
if (player_data.data) {
    // Level data is encoded
    player_data = JsonUtilities.base64Decode(player_data.data);
    player_data = JSON.parse(player_data);
}

export class Player {
    constructor(json) {
        JsonUtilities.assign(this, player_data);
        if (json !== undefined) {
            JsonUtilities.assign(this, json);
        }

        this.choices = new PlayerChoices(this.choices);
        this.inventory = new PlayerInventory(this.inventory);
        this.status = new PlayerStatus(this.status);

        for (const i in this.chapters) {
            this.chapters[i] = new Chapter(this.chapters[i]);
        }

        if (this.currentStoryKey === undefined) {
            this.setStory(this.entrypoint);
        }
    }

    /**
     * Return the current story
     * @returns Story
     */
    currentStory() {
        return this.getStory(this.currentStoryKey);
    }

    /**
     * Return the current chapter
     * @returns Chapter
     */
    currentChapter() {
        return this.chapters[this.currentChapterKey];
    }

    /**
     * Return true if this is new game
     * @returns bool
     */
    isNewGame() {
        return this.currentStoryKey == this.entrypoint;
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
        let next = this.currentStory().options.filter(o => this.validateConditions(o.conditions))[option_id-1];
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
        for (const i in Object.keys(this.chapters)) {
            let story = this.chapters[i].getStory(story_key);
            if (story !== false) {
                this.currentChapterKey = i;
                this.currentStoryKey = story_key;

                for (const effect of story.effects) {
                    effect.apply(this);
                }
                return true;
            }
        }

        return false;
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
        const gameData = {
            currentChapterKey: this.currentChapterKey,
            currentStoryKey: this.currentStoryKey,
            status: {},
            choices: this.choices.list_chosen(),
            inventory: this.inventory.list_equipped()
        };

        this.status.list().forEach(i => {gameData.status[i] = {
            value: this.status.get(i).value,
            maximum: this.status.get(i).maximum
        }});

        return encodeURIComponent(
            JSON.stringify(gameData)
        );
    }

    /**
     * Restore a game save from the save data
     * @param {String} data 
     * @returns Player
     */
    static restore(data) {
        try {
            const gameData = JSON.parse(
                decodeURIComponent(data)
            );
    
            const player = new Player({
                currentChapterKey: gameData.currentChapterKey,
                currentStoryKey: gameData.currentStoryKey,
            });
            gameData.choices.forEach(k => {
                player.choices.records[k].enabled = true;
            });
            gameData.inventory.forEach(k => {
                player.inventory.records[k].equipped = true;
            });
            Object.keys(gameData.status).forEach(k => {
                player.status.records[k].value = gameData.status[k].value;
                player.status.records[k].maximum = gameData.status[k].maximum;
            });
            return player;
        } catch(e) {
            console.log(e);
            return new Player();
        }
    }
}
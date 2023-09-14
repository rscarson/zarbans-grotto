import { Player, Interface } from '../game_engine/index.js';

export class ZarbanRunner {
    constructor(save_data) {
        this.player = save_data
        ? Player.restore(save_data)
        : new Player();
    }

    /**
     * Get the current story text
     */
    getInterfaceStrings() {
        return Interface.getInterfaceStrings(this.player);
    }

    /**
     * Return the current game state
     */
    save() {
        return this.player.save()
    }

    /**
     * Reset the game state
     */
    reset() {
        this.player = new Player();
        this.draw();
    }

    /**
     * Render the current game state
     */
    draw() {
        return '';
    }

    /**
     * Advance the game state
     */
    step(option) {
        this.error = option
        ? this.player.nextStory(option)
        : false;
        return this.draw();
    }
}
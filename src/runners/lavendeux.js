import { Player } from '../game_engine/player.js';
import { Interface } from '../game_engine/interface.js';

export class ZarbanLavendeuxRunner {
    constructor(save_data) {
        this.player = save_data
            ? Player.restore(save_data)
            : new Player();        
    }

    draw(error=false) {
        const strings = Interface.getInterfaceStrings(this.player);
        const box = Interface.getTitledBox(strings.title, strings.description);
        return [
            '',
            ...box,
            error ? '\nInvalid option!' : '',
            'What do you do?',
            ...strings.options.map((o,i) => `${i+1} @zarban) ${o}`),
            '',
            'You can choose an option from above, such as "1 @zarban" and "zarban(1)" or start a new game with "start/restart @zarban" or "zarban()"',
            'Paste the option below and use Lavendeux to continue your adventure!\n'
        ].join('\n');
    }

    /**
     * Advance the story
     * @param {string} option 
     */
    next(option=false) {
        return this.draw(option && !this.player.nextStory(parseInt(option)));
    }

    /** 
     * Return save data string 
     * @returns String
    */
    save() {
        return this.player.save();
    }
}
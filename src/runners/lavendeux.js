import { name, author, version } from '../../package.json';
import { ZarbanRunner } from './runner';
import { Interface } from '../game_engine';
import { Lavendeux } from 'lavendeux';

export class ZarbanLavendeuxRunner extends ZarbanRunner {
    constructor(save_data) {
        super(save_data);
    }

    /**
     * Render the current game state
     */
    draw() {
        const strings = this.getInterfaceStrings();
        const box = Interface.getTitledBox(strings.title, strings.description);
        return [
            '',
            ...box,
            this.error ? '\nInvalid option!' : '',
            'What do you do?',
            ...strings.options.map((o,i) => `${i+1} @zarban) ${o}`),
            '',
            'You can choose an option from above, such as "1 @zarban" and "zarban(2)" or start a new game with "start/restart @zarban" or "zarban()"',
            'Type your selection below and use Lavendeux to continue your adventure!\n'
        ].join('\n');
    }

    /**
     * Register zarban as a lavendeux extension
     */
    static registerExtension(name, author, version) {
        let instance = new Lavendeux(name, author, version);
        instance.addStringDecorator('zarban', ZarbanLavendeuxRunner.callback);
        instance.addStringDecorator('Zarban', ZarbanLavendeuxRunner.callback);
        instance.addStringFunction('zarban', ZarbanLavendeuxRunner.callback).addStringArgument();
        instance.addStringFunction('Zarban', ZarbanLavendeuxRunner.callback).addStringArgument();
        Lavendeux.register(instance);
    }

    /**
     * Callback method for running zarban through lavendeux
     */
    static callback(option, state) {
        // Restart the game?
        if (['start', 'restart', ''].includes(option.toLowerCase())) {
            delete state.zarban_save;
        }

        // Play the game
        const game = new ZarbanLavendeuxRunner(state.zarban_save);
        const result = game.step(state.zarban_save ? option : false);
        
        // Return the next interface
        state.zarban_save = game.save();
        return result;
    }
}

// Create a new extension from the configuration in package.json
ZarbanLavendeuxRunner.registerExtension(name, author, version);
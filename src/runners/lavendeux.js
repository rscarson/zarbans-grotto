import { name, author, version } from '../../package.json';
import { ZarbanRunner } from './runner';
import { Interface } from '../game_engine';

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
            'You can choose an option from above, such as "1 @zarban" and "zarban(2)" or start a new game with "start/restart @zarban" or "zarban("start")"',
            'Type your selection below and use Lavendeux to continue your adventure!\n'
        ].join('\n');
    }

    /**
     * Register zarban as a lavendeux extension
     */
    static registerExtension(name, author, version) {
        if (!lavendeux) return; // May not be running in the lavendeux engine

        lavendeuxExtensionName(name);
        lavendeuxExtensionAuthor(author);
        lavendeuxExtensionVersion(version);
        
        lavendeuxFunction('play_zarban', () => ZarbanLavendeuxRunner.callback('start'), {
            description: "Start a new game of Zarban",
            arguments: [],
            returns: lavendeuxType.String
        });
    
        lavendeuxFunction('zarban', ZarbanLavendeuxRunner.callback, {
            description: "Advance a game of Zarban",
            arguments: [lavendeuxType.String],
            returns: lavendeuxType.String
        });
    
        lavendeuxDecorator('zarban', ZarbanLavendeuxRunner.callback, lavendeuxType.String);
    }

    /**
     * Callback method for running zarban through lavendeux
     */
    static callback(option) {
        let state = loadState();
        if (["start", "restart", ""].includes(option.toLowerCase())) {
          delete state.zarban_save;
        }

        // Play the game
        const game = new ZarbanLavendeuxRunner(state.zarban_save);
        const result = game.step(state.zarban_save ? option : false);
        
        // Return the next interface
        state.zarban_save = game.save();
        saveState(state);
        return result;
    }
}

// Create a new extension from the configuration in package.json
ZarbanLavendeuxRunner.registerExtension(name, author, version);
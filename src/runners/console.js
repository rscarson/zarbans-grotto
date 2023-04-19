import { Player } from '../game_engine/player.js';
import { Interface } from '../game_engine/interface.js';

export class ZarbanConsoleRunner {
    constructor(reader) {
        this.player = new Player();
        this.interface = reader;
    }

    draw(error=false) {
        const strings = Interface.getInterfaceStrings(this.player);
        const box = Interface.getTitledBox(strings.title, strings.description);

        console.clear();
        console.log('');
        console.log(box.join('\n'));
        console.log('');

        // Controls interface
        error && console.log('Invalid option!');
        console.log('What do you do? Type restart to begin a new game.');
        for (const i in strings.options) {
            console.log(`${parseInt(i)+1}) ${strings.options[i]}`);
        }

        process.stdout.write('\n> ');
    }

    /**
     * Advance the story
     * @param {int} option 
     */
    next(option) {
        this.draw(!this.player.nextStory(option));
    }

    /**
     * Start the main game loop
     */
    loop() {
        this.draw();
        const f = async () => {
            for await (const line of this.interface) {
                if (line == 'restart') {
                    this.player = new Player();
                    this.draw();
                } else {
                    const option = parseInt(line);
                    this.next(option);
                }
            }
        }; f();
    }
}
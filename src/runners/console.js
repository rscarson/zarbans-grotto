import { Interface } from '../game_engine/interface.js';
import { ZarbanRunner } from './runner.js';
import { createInterface } from 'readline';

class ZarbanConsoleRunner extends ZarbanRunner {
    constructor(reader) {
        super();
        this.interface = reader;
    }

    draw() {
        const strings = this.getInterfaceStrings();
        const box = Interface.getTitledBox(strings.title, strings.description);

        console.clear();
        console.log('');
        console.log(box.join('\n'));
        console.log('');

        // Controls interface
        this.error && console.log('Invalid option!');
        console.log('What do you do? Type restart to begin a new game.');
        for (const i in strings.options) {
            console.log(`${parseInt(i)+1}) ${strings.options[i]}`);
        }

        process.stdout.write('\n> ');
    }

    /**
     * Start the main game loop
     */
    loop() {
        this.draw();
        const f = async () => {
            for await (const line of this.interface) {
                if (line == 'restart') {
                    this.reset();
                    this.draw();
                } else {
                    const option = parseInt(line);
                    this.step(option);
                }
            }
        }; f();
    }
}

const instance = createInterface({
    input: process.stdin,
    output: process.stdout
});

const game = new ZarbanConsoleRunner(instance);
game.loop();
import { createInterface } from 'readline';
import '../src/runner.js';

const game = new Zarban.ConsolePlayer(createInterface({
    input: process.stdin,
    output: process.stdout
}));
game.loop();
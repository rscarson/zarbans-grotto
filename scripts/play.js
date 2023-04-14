import { Player } from '../src/game_engine/player.js';
import { Interface } from '../src/game_engine/interface.js';

import { createInterface } from 'readline';

/**
 * Ask the user for the next choice
 * @param {Object} reader 
 * @param {Object} player 
 * @param {Boolean} has_error 
 */
function nextGameLine(player, option) {
    console.clear();
    console.log('');
    console.log(Interface.getInterfaceString(player, 
        option && !player.nextStory(option)
    ));
    console.log('');
}

// Prep game objects
const player = new Player();
const reader = createInterface({
    input: process.stdin,
    output: process.stdout
});
reader.setPrompt('> ');

// Start game
nextGameLine(player);
for await (const line of reader) {
    const option = parseInt(line);
    nextGameLine(player, option);
}
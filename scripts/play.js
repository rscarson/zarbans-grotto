import { Player } from '../src/game_engine/player.js';
import { Interface } from '../src/game_engine/interface.js';

import { createInterface } from 'readline';

const DEBUG_ZARBAN = process.env.DEBUG_ZARBAN;

/**
 * Ask the user for the next choice
 * @param {Object} reader 
 * @param {Object} player 
 * @param {Boolean} has_error 
 */
function nextGameLine(player, option) {
    console.clear();
    console.log('');
    const error = option? !player.nextStory(option) : false;
    console.log(Interface.getInterfaceString(player, error, DEBUG_ZARBAN));
    console.log('\n');
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
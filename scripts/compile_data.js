'use strict'
import { writeFileSync } from 'fs';

console.log(process.cwd());
import { JsonUtilities } from "../src/game_engine/json.utils.js";

console.log('Compiling game data...');
const config = JsonUtilities.import('zarban.config.json')

const player_data = JsonUtilities.import(config.root);
player_data.choices = JsonUtilities.import(player_data.choices);
player_data.inventory = JsonUtilities.import(player_data.inventory);
player_data.status = JsonUtilities.import(player_data.status);

for (const i of Object.keys(player_data.chapters)) {
    player_data.chapters[i] = JsonUtilities.import(player_data.chapters[i]);
    player_data.chapters[i].chapter = i;
}

let json = JSON.stringify(player_data);
writeFileSync(config.output, json);
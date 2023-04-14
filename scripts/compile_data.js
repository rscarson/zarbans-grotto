'use strict'
import { writeFileSync, readFileSync } from 'fs';

function importJSON(path) {
    const data = readFileSync(path);
    return JSON.parse(data);
}

console.log('Compiling game data...');
const config = importJSON('zarban.config.json')

const player_data = importJSON(config.root);
player_data.choices = importJSON(player_data.choices);
player_data.inventory = importJSON(player_data.inventory);
player_data.status = importJSON(player_data.status);

for (const i of Object.keys(player_data.chapters)) {
    player_data.chapters[i] = importJSON(player_data.chapters[i]);
    player_data.chapters[i].chapter = i;
}

let json = JSON.stringify(player_data);
writeFileSync(config.output, json);
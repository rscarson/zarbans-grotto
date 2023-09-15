'use strict'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import * as path from 'path';

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

const dir = path.dirname(config.output);
if (!existsSync(dir)){
    mkdirSync(dir, { recursive: true });
}

let json = JSON.stringify(player_data);

// Encode the level data if requested
if (config.encode) {
    const encoder = new TextEncoder()
    json = encoder.encode(json);
    json = JSON.stringify({
        comment: "I know this looks sketchy af but it's just a base64 encoding of the games' level data",
        data: json
    });
}
writeFileSync(config.output, json);
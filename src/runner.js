import { ZarbanWebRunner } from "./runners/web.js";
import { ZarbanConsoleRunner } from "./runners/console.js";
import { ZarbanLavendeuxRunner } from "./runners/lavendeux.js";
import { Player } from './game_engine/player.js';
import { Interface } from './game_engine/interface.js';

globalThis.Zarban = {
    Player: Player, 
    Interface: Interface,
    WebPlayer: ZarbanWebRunner,
    ConsolePlayer: ZarbanConsoleRunner,
    LavendeuxPlayer: ZarbanLavendeuxRunner
};
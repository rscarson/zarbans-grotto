import { test, expect, describe } from 'vitest';
import { Player } from '../../src/game_engine/player';


describe('PlayerChoices', () => {
    test('save-restore', () => {
        const p = new Player();
        p.status.set('stamina', 0);
        
        let data = p.save(); 
        const resumed = Player.restore(data);
        expect(resumed).toStrictEqual(p);
    });
});
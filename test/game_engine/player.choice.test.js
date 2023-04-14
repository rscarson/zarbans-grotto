import { test, expect, describe, beforeEach } from 'vitest';
import { Player } from '../../src/game_engine/player';


let p;
describe('PlayerChoices', () => {
    beforeEach(() => {
        p = new Player().choices;
    })

    test('list', () => {
        expect(p.list().length).toBeGreaterThan(1);
    });

    test('choose-chose', () => {
        p.choose('made_dave_sad', true);
        expect(p.chose('made_dave_sad')).toBe(true);
    });
});
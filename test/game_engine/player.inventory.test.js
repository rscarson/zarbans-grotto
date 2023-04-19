import { test, expect, describe, beforeEach } from 'vitest';
import { Player } from '../../src/game_engine/player';

let p;
describe('PlayerInventory', () => {
    beforeEach(() => {
        p = new Player().inventory;
    })

    test('list', () => {
        expect(p.list()).toContain('rusty_sword');
    });

    test('give', () => {
        p.give('rusty_sword');
        expect(p.has('rusty_sword')).toBe(true);
    });

    test('take', () => {
        p.give('rusty_sword');
        p.take('rusty_sword');
        expect(p.has('rusty_sword')).toBe(false);
    });

    test('describe', () => {
        expect(p.describe('rusty_sword').description.length).toBeGreaterThan(0);
    });

    test('activeEffects', () => {
        p.give('old_armor');
        p.give('ancient_armor');
        expect(p.activeEffects().length).toBe(4);
        
    });
});
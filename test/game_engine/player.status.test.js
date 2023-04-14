import { test, expect, describe, beforeEach } from 'vitest';
import { Player } from '../../src/game_engine/player';

let p;
describe('PlayerStatus', () => {
    beforeEach(() => {
        p = new Player().status;
        p.set('stamina', 2);
    })

    test('list', () => {
        expect(p.list()).toEqual(['stamina', 'alcoholism']);
    });

    test('get', () => {
        expect(p.get('stamina')).toBe(p.records['stamina']);
    });

    test('value', () => {
        expect(p.value('stamina')).toBe(2);
    });

    test('set', () => {
        p.set('stamina', 0);
        expect(p.value('stamina')).toBe(0);
    });

    test('add', () => {
        p.add('stamina', -1);
        expect(p.value('stamina')).toBe(1);
        
        p.add('stamina', -99);
        expect(p.value('stamina')).toBe(0);
        
        p.add('stamina', 99);
        expect(p.value('stamina')).toBe(p.get('stamina').maximum);
    });
});
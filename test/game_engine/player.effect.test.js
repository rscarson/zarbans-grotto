import { test, expect, describe, beforeEach } from 'vitest';
import { Player } from '../../src/game_engine/player';
import { PlayerEffect } from '../../src/game_engine/player.effect';

describe('PlayerChoiceEffect', () => {
    test('verify', () => {    
        let p = new Player(); 
        let effect = PlayerEffect.build({
            type: "choices",
            target: "all",
            value: false
        });
        expect(effect.verify(p)).toBe(true);

        p.choices.records['made_dave_sad'].enabled = true;
        expect(effect.verify(p)).toBe(false);
    });

    test('apply', () => {
        let p = new Player();
        let effect = PlayerEffect.build({
            type: "choices",
            target: "all",
            value: true
        });
        effect.apply(p);
        expect(p.choices.records['made_dave_sad'].enabled).toBe(true);
    });
})

describe('PlayerInventoryEffect', () => {
    test('verify', () => {
        let p = new Player();
        let effect = PlayerEffect.build({
            type: "inventory",
            target: "all",
            value: false
        });
        expect(effect.verify(p)).toBe(false);

        p.inventory.take('hunter_sword');
        p.inventory.take('hunter_armor');
        expect(effect.verify(p)).toBe(true);
    });

    test('apply', () => {
        let p = new Player();
        let effect = PlayerEffect.build({
            type: "inventory",
            target: "all",
            value: true
        });
        effect.apply(p);
        expect(p.inventory.has('rusty_sword')).toBe(true);
    });
})

describe('PlayerStatusEffect', () => {
    test('verify', () => {
        let p = new Player();
        let effect = PlayerEffect.build({
            type: "status",
            target: "all",
            operation: "eq",
            value: 0
        });
        expect(effect.verify(p)).toBe(false);

        p.status.set('stamina', 0);
        expect(effect.verify(p)).toBe(true);
    });

    test('apply', () => {
        let p = new Player();
        let effect = PlayerEffect.build({
            type: "status",
            target: "all",
            operation: "add",
            value: 99
        });
        effect.apply(p);
        expect(p.status.get('stamina').value).toBe(p.status.records['stamina'].maximum);
    });
})
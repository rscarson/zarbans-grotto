import { test, expect, describe } from 'vitest';

const chapter1 = require("../../data/chapter1_cave.storyboard.json");
const chapter2 = require("../../data/chapter2_tavern.storyboard.json");

const choices = require("../../data/player.choices.json");
const statuses = require("../../data/player.status.json");
const inventory = require("../../data/player.inventory.json");

const allStoryTargets = Object.keys(chapter1.records).concat(Object.keys(chapter2.records));

function validateEffectTarget(effect) {
    const library = effect.type == "choice"
        ? Object.keys(choices.records)
        : effect.type == "inventory"
            ? Object.keys(inventory.records)
            : Object.keys(statuses.records);
    expect(library.includes(effect.target));
}

describe('Chapter 1', () => {
    test('story effects', () => {
        for (const story of Object.values(chapter1.records)) {
            for (const effect of story.effects) {
                validateEffectTarget(effect);
            }
        }
    });
    
    test('option conditions', () => {
        for (const story of Object.values(chapter1.records)) {
            for (const option of story.options) {
                for (const condition of option.conditions) {
                    validateEffectTarget(condition);
                }
            }
        }
    });
    
    test('option results', () => {
        for (const story of Object.values(chapter1.records)) {
            for (const option of story.options) {
                for (const result of option.results) {
                    if (!result.conditions) {
                        expect(allStoryTargets).includes(result);
                    } else {
                        expect(allStoryTargets).includes(result.target);
                    }
                }
            }
        }
    });
    
    test('option result conditions', () => {
        for (const story of Object.values(chapter1.records)) {
            for (const option of story.options) {
                for (const result of option.results) {
                    if (!result.conditions) continue;
                    for (const condition of result.conditions) {
                        validateEffectTarget(condition);
                    }
                }
            }
        }
    });
})

describe('Chapter 2', () => {
    test('story effects', () => {
        for (const story of Object.values(chapter2.records)) {
            for (const effect of story.effects) {
                validateEffectTarget(effect);
            }
        }
    });
    
    test('option conditions', () => {
        for (const story of Object.values(chapter2.records)) {
            for (const option of story.options) {
                for (const condition of option.conditions) {
                    validateEffectTarget(condition);
                }
            }
        }
    });
    
    test('option results', () => {
        for (const story of Object.values(chapter2.records)) {
            for (const option of story.options) {
                for (const result of option.results) {
                    if (!result.conditions) {
                        expect(allStoryTargets).includes(result);
                    } else {
                        expect(allStoryTargets).includes(result.target);
                    }
                }
            }
        }
    });
    
    test('option result conditions', () => {
        for (const story of Object.values(chapter2.records)) {
            for (const option of story.options) {
                for (const result of option.results) {
                    if (!result.conditions) continue;
                    for (const condition of result.conditions) {
                        validateEffectTarget(condition);
                    }
                }
            }
        }
    });
})
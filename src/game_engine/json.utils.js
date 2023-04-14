'use strict';
import { readFileSync } from 'fs';

export class JsonUtilities {
    /**
     * Assign a copy of the source Object to target
     * @param {Object} target 
     * @param {Object} source 
     */
    static assign(target, source) {
        Object.assign(target, JSON.parse(JSON.stringify(
            source
        )));
    }

    /**
     * Import a JSON object from a file
     * @param {String} path 
     * @returns Object
     */
    static import(path) {
        const data = readFileSync(path);
        return JSON.parse(data);
    }
}
'use strict';

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
}
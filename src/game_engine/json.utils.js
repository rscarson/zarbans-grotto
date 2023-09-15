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

    static base64Encode(data) {
        if (typeof window.btoa === 'function') {
            return window.btoa(data);
        } else if (typeof Buffer === 'object') {
            return Buffer.from(data).toString('base64')
        } else {
            throw new Error('Cannot base64');
        }
    }

    static base64Decode(data) {
        if (typeof window.atob === 'function') {
            return window.atob(data);
        } else if (typeof Buffer === 'object') {
            return Buffer.from(data, 'base64').toString('binary')
        } else {
            throw new Error('Cannot base64');
        }
    }
}
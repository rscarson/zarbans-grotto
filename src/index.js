import { extensionName, author, version } from '../package.json';
import { LavendeuxValue } from './lavendeux';
import './runner';

globalThis.extension = () => {
    return {
        name: `${extensionName}`,
        author: `${author}`,
        version: `${version}`,

        functions: {
            "zarban": "functionZarban",
            "Zarban": "functionZarban",
        },

        decorators: {
            "zarban": "decoratorZarban",
            "Zarban": "decoratorZarban",
        }
    }
}

globalThis.decoratorZarban = (value) => {
    return `${LavendeuxValue.asString(
        functionZarban([value])
    )}`;
}

globalThis.functionZarban = (args) => {
    if (typeof getState != 'function') {
        throw new Error("This extension requires Lavendeux v0.21.0 or above");
    }

    let state = getState();
    if (args.length > 1) {
        throw new Error("zarban([n]): expected 0 or 1 argument");
    }

    let value = args.length ? LavendeuxValue.asString(args[0]) : "";
    let isNewGame = ['start', 'restart', ''].includes(value.toLowerCase());
    const gameSave = state.zarban_save && !isNewGame ? LavendeuxValue.asString(state.zarban_save) : undefined;
    const game = new Zarban.LavendeuxPlayer(gameSave);
    
    const result = game.next(value);
    state.zarban_save = LavendeuxValue.returnString(game.save());
    setState(state);
    return LavendeuxValue.returnString(result);
}
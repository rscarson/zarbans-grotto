import { extensionName, author, version } from '../package.json';
import './functions';
import './decorators';
import './runner';

globalThis.extension = () => {
    const p = new Player();
    return {
        name: `${extensionName}`,
        author: `${author}`,
        version: `${version}`,

        functions: {
            "my_function": "myFunction"
        },

        decorators: {
            "my_decorator": "my_decorator"
        }
    }
}
import { Player } from '../game_engine/player.js';
import { Interface } from '../game_engine/interface.js';

const ZARBAN_GAMEBOARD_CLASS = 'zarban_gameboard';
const ZARBAN_CONTROLS_CLASS = 'zarban_controls';

/**
 * Allows inline creation of elements
 */
class InlineElement {
    constructor(tag) {
        this.e = document.createElement(tag);
    }

    setAttribute(name, value) {
        this.e.setAttribute(name, value);
        return this;
    }

    setInnerHTML(value) {
        this.e.innerHTML = value;
        return this;
    }

    setOnClick(handler) {
        this.e.onclick = handler;
        return this;
    }

    setStyle(name, value) {
        this.e.style[name] = value;
        return this;
    }

    element() {
        return this.e;
    }
}

export class ZarbanWebRunner {
    constructor(container) {
        // Prepare board
        this.container = container;
        this.createInterface();

        // Prepare game engine
        this.player = new Player();
        this.restore();

        // Tag the container
        this.container.dataZarbanRunner = this;
    }

    draw() {
        const strings = Interface.getInterfaceStrings(this.player);
        const gameboard = this.container.getElementsByClassName(ZARBAN_GAMEBOARD_CLASS)[0];
        const controls = this.container.getElementsByClassName(ZARBAN_CONTROLS_CLASS)[0];

        // Fix spacing in web view
        strings.description = strings.description.map(s => s.length==0 ? '<br/>' : s);

        // Gameboard interface
        gameboard.innerHTML = '';
        gameboard.appendChild(
            new InlineElement('a')
                .setAttribute('href', '#')
                .setStyle('float', 'right')
                .setInnerHTML('[ New Game ]')
                .setOnClick(() => this.reset())
                .element()
        );
        gameboard.appendChild(
            new InlineElement('h4').setInnerHTML(strings.title).element()
        );
        strings.description.map(l => {
            gameboard.appendChild(
                new InlineElement('p').setInnerHTML(l).element()
            );
        });

        // Controls interface
        const control_p = document.createElement('p');
        control_p.innerHTML = 'What do you do?<br/>';
        for (const i in strings.options) {
            control_p.appendChild(
                new InlineElement('a')
                    .setAttribute('href', '#')
                    .setInnerHTML(`> ${strings.options[i]}`)
                    .setOnClick(() => this.next(parseInt(i)+1))
                    .element()
            );
        }
        controls.innerHTML = '';
        controls.appendChild(control_p);
    }

    /**
     * Advance the story
     * @param {int} option 
     */
    next(option) {
        this.player.nextStory(option);
        this.draw(); this.save();
    }

    /**
     * Create the container divs for the game
     */
    createInterface() {
        this.container.innerHTML = '';
        this.container.appendChild(
            new InlineElement('div').setAttribute('class', ZARBAN_GAMEBOARD_CLASS).element()
        );
        this.container.appendChild(
            new InlineElement('div').setAttribute('class', ZARBAN_CONTROLS_CLASS).element()
        );
    }

    /**
     * Save the game state to local storage
     */
    save() {
        localStorage[`zarban_${this.container.id}`] = this.player.save();
    }

    /**
     * Save the game state to local storage
     */
    restore() {
        const data = localStorage[`zarban_${this.container.id}`];
        if (data && !this.isNewGame) {
            this.player = Player.restore(data);
        }
        this.draw();
    }

    /**
     * Reset the game board
     */
    reset() {
        this.player = new Player();
        this.save(); this.draw();
    }
}
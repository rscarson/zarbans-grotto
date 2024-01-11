import { Player, Interface } from '../game_engine';
import { ZarbanRunner } from './runner';

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

const ZARBAN_GAMEBOARD_CLASS = 'zarban_gameboard';
const ZARBAN_CONTROLS_CLASS = 'zarban_controls';

export class ZarbanWebRunner extends ZarbanRunner {
    constructor(container_id) {
        const data = localStorage[`zarban_${container_id}`];
        super(data);

        // Prep the container
        this.container = document.getElementById(container_id);
        this.injectCSS(container_id);
        this.initContainer();

        // Inject the web callback into global
        globalThis.advanceGame = (option) => this.step(option);
        advanceGame();
    }

    /**
     * Create the container divs for the game
     */
    initContainer() {
        this.container.dataZarbanRunner = this;
        this.container.innerHTML = '';
        this.container.appendChild(
            new InlineElement('div').setAttribute('class', ZARBAN_GAMEBOARD_CLASS).element()
        );
        this.container.appendChild(
            new InlineElement('div').setAttribute('class', ZARBAN_CONTROLS_CLASS).element()
        );
    }

    /**
     * Inject game style into the page
     */
    injectCSS() { 
        let css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = `
            body,html {
                background-color: #333; color: #00AA20;
                font-family: "Lucida Console", "Courier New", monospace; font-size: 1em;
            }
            .zarban_gameboard {
                border: 1px solid #00AA20; border-width: 4px; border-style: double;
                padding: 10px;
            }
            .zarban_gameboard h4 {
                border-bottom: 1px solid #00AA20; margin-top: 0px;
            }
            #${this.container.id} a {
                background-color: #333; color: #00AA20;
                font-family: "Lucida Console", "Courier New", monospace; font-size: 1em;text-decoration: none;
                display: block;
            }
            #${this.container.id} a:hover { color: #00CC40; }
            .zarban_controls a { margin-top: 10px; }
        `;
        document.head.appendChild(css);
    }

    /**
     * Save the game state to local storage
     */
    save() {
        localStorage[`zarban_${this.container.id}`] = super.save();
    }

    /**
     * Render the current game state
     */
    draw() {
        const strings = this.getInterfaceStrings();
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
                    .setOnClick(() => this.step(parseInt(i)+1))
                    .element()
            );
        }
        controls.innerHTML = '';
        controls.appendChild(control_p);
    }

    /**
     * Advance the game state
     */
    step(option) {
        super.step(option);
        this.save();
    }
}

globalThis.play_zarban = (container_id) => new ZarbanWebRunner(container_id);
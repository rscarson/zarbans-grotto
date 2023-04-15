import { Player } from './game_engine/player';
import { Interface } from './game_engine/interface';

const ZARBAN_GAMEBOARD_CLASS = 'zarban_gameboard';
const ZARBAN_CONTROLS_CLASS = 'zarban_controls';

class ZarbanWebPlayer {
    static init(container) {
        const gameBoard = document.createElement('div');
        gameBoard.className = ZARBAN_GAMEBOARD_CLASS;
        container.appendChild(gameBoard);
        
        const gameControls = document.createElement('div');
        gameControls.className = ZARBAN_CONTROLS_CLASS;
        container.appendChild(gameControls);

        container.dataZarbanPlayer = new Player();
        ZarbanWebPlayer.restore(container);
    }

    static save(container) {
        localStorage[`zarban_${container.id}`] = container.dataZarbanPlayer.save();
    }

    static restore(container) {
        const data = localStorage[`zarban_${container.id}`];
        if (data) {
            container.dataZarbanPlayer = Player.restore(data);
        }
        ZarbanWebPlayer.draw(container);
    }

    static draw(container) {
        const strings = Interface.getInterfaceStrings(container.dataZarbanPlayer);
        const gameboard = container.getElementsByClassName(ZARBAN_GAMEBOARD_CLASS)[0];
        const controls = container.getElementsByClassName(ZARBAN_CONTROLS_CLASS)[0];

        // Fix spacing in web view
        strings.description = strings.description.map(s => s.length==0 ? '<br/>' : s);

        // New game button
        const newBtn = document.createElement('a');
        newBtn.setAttribute('href', '#');
        newBtn.innerHTML = '[ New Game ]';
        newBtn.style.float = 'right';
        newBtn.onclick = () => {
            console.log("!");
            delete localStorage[`zarban_${container.id}`];
            container.dataZarbanPlayer = new Player();
            ZarbanWebPlayer.draw(container);
        };

        gameboard.innerHTML = '';
        gameboard.appendChild(newBtn);
        const title = document.createElement('h4'); title.innerHTML = strings.title;
        gameboard.appendChild(title);
        strings.description.map(l => {
            const p = document.createElement('p');
            p.innerHTML = l
            return p;
        }).map(p => gameboard.appendChild(p));

        controls.innerHTML = '';
        for (const i in strings.options) {
            const link = document.createElement('a');
            link.setAttribute('href', '#');
            link.innerHTML = `> ${strings.options[i]}`;
            link.onclick = () => {
                ZarbanWebPlayer.next(container, parseInt(i)+1);
            };
            
            controls.appendChild(link);
        }
    }

    static next(container, option) {
        container.dataZarbanPlayer.nextStory(option);
        ZarbanWebPlayer.draw(container);
        ZarbanWebPlayer.save(container);
    }
}

globalThis.Zarban = {
    Player: Player, 
    Interface: Interface,
    WebPlayer: ZarbanWebPlayer
};
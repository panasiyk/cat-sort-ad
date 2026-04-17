import {Game} from './core/Game';

const container = document.getElementById('app');
if (!container) throw new Error('Mount point #app not found in DOM');

const game = new Game();
game.init(container);

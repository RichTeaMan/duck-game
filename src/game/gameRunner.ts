import * as Phaser from 'phaser';
import { GameScene } from './gameScene';
import { UiScene } from './uiScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'duck-game',

    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
    },

    parent: "game-container",
    width: 1600,
    height: 1200,

    /*
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    */
    scene: [ GameScene, UiScene ],
    backgroundColor: '#000000',
};

window.addEventListener("resize", () => {
    //gameState.scene.game.scale.resize(window.innerWidth / ZOOM_LEVEL, window.innerHeight / ZOOM_LEVEL);
}, false);


export function setupGame(): Phaser.Game {
    const game = new Phaser.Game(gameConfig);
    return game;
}

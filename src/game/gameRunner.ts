import * as Phaser from 'phaser';
import { GameScene } from './gameScene';
import { UiScene } from './uiScene';

export const TARGET_WIDTH = 1536;

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'duck-game',

    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    },
    parent: "game-container",
    scene: [ GameScene, UiScene ],
    backgroundColor: '#000000',
};

export function setupGame(): Phaser.Game {
    const game = new Phaser.Game(gameConfig);
    return game;
}

import * as Phaser from 'phaser';
import logoImg from "../assets/logo.png";

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Sample',

    type: Phaser.AUTO,

    parent: "game-container",
    width: 800,
    height: 600,

    /*
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    */
   scene: {
       preload: preload,
       create: create
   },

    backgroundColor: '#000000',
};

function preload() {
    const scene = this as Phaser.Scene;
    scene.load.image("logo", logoImg);
}

function create() {
    const scene = this as Phaser.Scene;
    const logo = scene.add.image(400, 150, "logo");
    scene.tweens.add({
        targets: logo,
        y: 450,
        duration: 2000,
        ease: "Power2",
        yoyo: true,
        loop: -1
    });
}

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    
    constructor() {
        super(sceneConfig);
    }
    
    public update() {
        // TODO
    }

}

export function setupGame(): Phaser.Game {
    const game = new Phaser.Game(gameConfig);
    return game;
}

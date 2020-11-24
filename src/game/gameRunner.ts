import * as Phaser from 'phaser';
import { Direction } from './direction';
import { Duck } from './duck';
import { Food } from './food';
import { GameState } from './gameState';

let tileWidthHalf;
let tileHeightHalf;

let gameState: GameState;

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Sample',

    type: Phaser.AUTO,

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
    scene: {
        preload: preload,
        create: create,
        update: update
    },

    backgroundColor: '#000000',
};

function preload() {
    this.load.json('pond-map', 'assets/pond.json');
    this.load.spritesheet('duck', 'assets/duck-white-spritesheet.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('mallard', 'assets/duck-mallard-spritesheet.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('landscape-tileset', 'assets/landscape-spritesheet.png', { frameWidth: 132, frameHeight: 100 });

    this.load.image('bread', 'assets/bread_NW.png');
    this.load.image('breadc', 'assets/bread_cursor.png');
}

function create() {
    gameState = new GameState(this);

    //this.input.setDefaultCursor('url(assets/bread_cursor.png), pointer');
    this.input.on('pointerdown', function (pointer: Phaser.Input.Pointer) {

        const point = gameState.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        Food.createBread(gameState, point.x, point.y + 40);
    }, this);

    buildWater();

    const x_offset = 1750;
    const y_offset = 600;

    gameState.addEntity(new Duck(gameState, x_offset + 240, y_offset + 490, 'walk', Direction.get('southEast'), 100));
    gameState.addEntity(new Duck(gameState, x_offset + 100, y_offset + 580, 'walk', Direction.get('southEast'), 230));
    gameState.addEntity(new Duck(gameState, x_offset + 620, y_offset + 340, 'walk', Direction.get('south'), 380));
    gameState.addEntity(new Duck(gameState, x_offset + 460, y_offset + 380, 'walk', Direction.get('south'), 150));
    gameState.addEntity(new Duck(gameState, x_offset + 760, y_offset + 300, 'walk', Direction.get('southEast'), 670));
    gameState.addEntity(new Duck(gameState, x_offset + 800, y_offset + 340, 'walk', Direction.get('northWest'), 800, 'mallard'));
    gameState.addEntity(new Duck(gameState, x_offset + 750, y_offset + 680, 'walk', Direction.get('east'), 200));
    gameState.addEntity(new Duck(gameState, x_offset + 1030, y_offset + 500, 'walk', Direction.get('west'), 100, 'mallard'));
    gameState.addEntity(new Duck(gameState, x_offset + 1180, y_offset + 540, 'walk', Direction.get('northEast'), 420));
    gameState.addEntity(new Duck(gameState, x_offset + 1180, y_offset + 380, 'walk', Direction.get('southEast'), 160));
    gameState.addEntity(new Duck(gameState, x_offset + 1450, y_offset + 520, 'walk', Direction.get('southWest'), 320, 'mallard'));
    gameState.addEntity(new Duck(gameState, x_offset + 1500, y_offset + 540, 'walk', Direction.get('southWest'), 340));
    gameState.addEntity(new Duck(gameState, x_offset + 1550, y_offset + 560, 'walk', Direction.get('southWest'), 330, 'mallard'));

    //gameState.scene.cameras.main.setSize(1600, 1200);

    gameState.scene.cameras.main.scrollX = x_offset;
    gameState.scene.cameras.main.scrollY = y_offset;
    gameState.scene.cameras.main.zoom = 0.75;
}

function update() {
    gameState.update();
    gameState.pruneEntities();
}

function buildWater() {
    //  Parse the data out of the map
    const data = gameState.scene.cache.json.get('pond-map');

    const tileWidth = data.tilewidth;
    const tileHeight = data.tileheight;

    tileWidthHalf = tileWidth / 2;
    tileHeightHalf = tileHeight / 2;

    const layer = data.layers[0].data;

    const mapWidth = data.layers[0].width;
    const mapHeight = data.layers[0].height;

    const centerX = mapWidth * tileWidthHalf;
    const centerY = 32;

    let i = 0;

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            const id = layer[i] - 1;

            const tx = (x - y) * tileWidthHalf;
            const ty = (x + y) * tileHeightHalf;

            const tile = gameState.scene.add.image(centerX + tx, centerY + ty, 'landscape-tileset', id);

            tile.depth = centerY + ty;
            i++;
        }
    }
}

export function setupGame(): Phaser.Game {
    const game = new Phaser.Game(gameConfig);
    return game;
}

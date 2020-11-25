import * as Phaser from 'phaser';
import { Duck, DuckType } from './duck';
import { Food } from './food';
import { GameState } from './gameState';
import { randomInt } from './utils';

let tileWidthHalf;
let tileHeightHalf;

let gameState: GameState;

const ZOOM_LEVEL = 0.4;

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
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: '#000000',
};

window.addEventListener("resize", () => {
    gameState.scene.game.scale.resize(window.innerWidth / ZOOM_LEVEL, window.innerHeight / ZOOM_LEVEL);
}, false);

function preload() {
    const scene = this as Phaser.Scene;

    scene.load.json('pond-map', 'assets/pond.json');
    scene.load.spritesheet('duck-white', 'assets/duck-white-spritesheet.png', { frameWidth: 128, frameHeight: 128 });
    scene.load.spritesheet('duck-mallard', 'assets/duck-mallard-spritesheet.png', { frameWidth: 128, frameHeight: 128 });
    scene.load.spritesheet('landscape-tileset', 'assets/landscape-spritesheet.png', { frameWidth: 132, frameHeight: 100 });
    scene.load.spritesheet('water', 'assets/landscapeTiles_066.png', { frameWidth: 132, frameHeight: 100 });

    scene.load.image('bread', 'assets/bread_NW.png');
    scene.load.image('breadc', 'assets/bread_cursor.png');

    scene.load.image('debug', 'assets/debug.png');
}

function create() {
    gameState = new GameState(this);

    //this.input.setDefaultCursor('url(assets/bread_cursor.png), pointer');
    this.input.on('pointerdown', function (pointer: Phaser.Input.Pointer) {

        const point = gameState.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        Food.createBread(gameState, point.x, point.y + 40);
    }, this);

    buildMap();

    const x_offset = 4550;
    const y_offset = 2000;

    const startDucks = 7;
    for (let i = 0; i < startDucks; i++) {
        const randomTile = gameState.waterTiles[randomInt(gameState.waterTiles.length)];
        const randomDuckType = DuckType.random();

        gameState.addEntity(new Duck(gameState, randomTile.x, randomTile.y, randomDuckType));
    }

    gameState.scene.cameras.main.scrollX = x_offset;
    gameState.scene.cameras.main.scrollY = y_offset;
    gameState.scene.cameras.main.zoom = ZOOM_LEVEL;
}

function update() {
    gameState.update();
    gameState.pruneEntities();
}

function buildMap() {
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
        if (y % 2 === 0) {
            //continue;
        }
        for (let x = 0; x < mapWidth; x++) {
            const id = layer[i] - 1;

            const tx = (x - y) * tileWidthHalf;
            const ty = (x + y) * tileHeightHalf;

            let tile: Phaser.GameObjects.Image;

            // 53 is water
            if (id === 53) {
                //tile = gameState.scene.add.image(centerX + tx, centerY + ty, 'debug');

                // DIRTY HACK - the spritesheet has bleeding in some cases (specifically, I think the sheet is fine, but reading it somehow causes alignment problems).
                // Usually it's fine but water gets particular ugly at different zoom levels, so swap in a pure tile.
                tile = gameState.scene.add.image(centerX + tx, centerY + ty, 'water');
                //tile.setVisible(false);
                gameState.waterTiles.push(tile);
            } else {
                tile = gameState.scene.add.image(centerX + tx, centerY + ty, 'landscape-tileset', id);
            }
            console.log(`${tile.x}, ${tile.y} - ${tile.width}, ${tile.height}`);

            tile.depth = centerY + ty;
            i++;
        }
    }
    console.log(`${gameState.waterTiles.length} water tiles.`)
}

export function setupGame(): Phaser.Game {
    const game = new Phaser.Game(gameConfig);
    return game;
}

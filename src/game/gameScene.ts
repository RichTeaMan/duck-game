import * as Phaser from 'phaser';
import { Duck, DuckType } from './duck';
import { EntityType } from './entityType';
import { Food } from './food';
import { GameState } from './gameState';
import { Nest } from './nest';
import { randomInt } from './utils';


const ZOOM_LEVEL = 0.4;

export class GameScene extends Phaser.Scene {
    
    gameState: GameState;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.gameState = GameState.singleton();
        this.gameState.scene = this;

        const scene = this as Phaser.Scene;

        scene.load.json('pond-map', 'assets/pond.json');
        scene.load.spritesheet('duck-white', 'assets/duck-white-spritesheet.png', { frameWidth: 512, frameHeight: 512 });
        scene.load.spritesheet('duck-mallard', 'assets/duck-mallard-spritesheet.png', { frameWidth: 512, frameHeight: 512 });
        scene.load.spritesheet('duck-duckling', 'assets/duck-duckling-spritesheet.png', { frameWidth: 512, frameHeight: 512 });
        scene.load.spritesheet('landscape-tileset', 'assets/landscape-spritesheet.png', { frameWidth: 132, frameHeight: 100 });
        scene.load.spritesheet('water', 'assets/landscapeTiles_066.png', { frameWidth: 132, frameHeight: 100 });
        scene.load.image('nest', 'assets/pan_SE.png');

        scene.load.image('bread', 'assets/bread_NW.png');
        scene.load.image('breadc', 'assets/bread_cursor.png');

        scene.load.image('debug', 'assets/debug.png');
        scene.load.image('target', 'assets/target.png');

        scene.load.audio('quackquack-f', 'assets/quackquack-f.mp3');
        scene.load.json('duck-thoughts', 'assets/duck-thoughts.json');
    }

    create() {
        window.addEventListener("resize", () => {
            //GameState.singleton().scene.game.scale.resize(window.innerWidth / ZOOM_LEVEL, window.innerHeight / ZOOM_LEVEL);
        }, false);

        this.input.setDefaultCursor('url(assets/bread_cursor.png), pointer');
        this.input.on('pointerdown', function (pointer: Phaser.Input.Pointer) {

            const point = this.gameState.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
            Food.createBread(this.gameState, point.x, point.y + 40);
        }, this);

        this.buildMap();

        const x_offset = 4550;
        const y_offset = 2000;

        const startDucks = 7;
        for (let i = 0; i < startDucks; i++) {
            const randomTile = this.gameState.waterTiles[randomInt(this.gameState.waterTiles.length)];
            const randomDuckType = DuckType.random();

            this.gameState.addEntity(new Duck(this.gameState, randomTile.x, randomTile.y, randomDuckType));
        }

        Nest.create(this.gameState, 7013, 2144);

        this.gameState.scene.cameras.main.scrollX = x_offset;
        this.gameState.scene.cameras.main.scrollY = y_offset;
        this.gameState.scene.cameras.main.zoom = ZOOM_LEVEL;

    }

    update() {
        this.gameState.update();
        this.gameState.pruneEntities();
    }

    buildMap() {
        //  Parse the data out of the map
        const data = this.gameState.scene.cache.json.get('pond-map');

        const tileWidth = data.tilewidth;
        const tileHeight = data.tileheight;

        const tileWidthHalf = tileWidth / 2;
        const tileHeightHalf = tileHeight / 2;

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

                let tile: Phaser.GameObjects.Image;

                // 53 is water
                if (id === 53) {
                    //tile = gameState.scene.add.image(centerX + tx, centerY + ty, 'debug');

                    // DIRTY HACK - the spritesheet has bleeding in some cases (specifically, I think the sheet is fine, but reading it somehow causes alignment problems).
                    // Usually it's fine but water gets particular ugly at different zoom levels, so swap in a pure tile.
                    tile = this.gameState.scene.add.image(centerX + tx, centerY + ty, 'water');
                    //tile.setVisible(false);
                    this.gameState.waterTiles.push(tile);
                } else {
                    tile = this.gameState.scene.add.image(centerX + tx, centerY + ty, 'landscape-tileset', id);
                }

                tile.depth = centerY + ty;
                i++;
            }
        }
    }
}

import * as Phaser from 'phaser';
import { Duck, DuckType } from './duck';
import { Food } from './food';
import { TARGET_WIDTH } from './gameRunner';
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
        scene.load.spritesheet('landscape-tileset', 'assets/landscape-spritesheet.png', { frameWidth: 132, frameHeight: 100 });
        scene.load.spritesheet('water', 'assets/landscapeTiles_066.png', { frameWidth: 132, frameHeight: 100 });
        scene.load.image('nest', 'assets/nest.png');
        
        scene.load.spritesheet('duck-white', 'assets/duck-white-spritesheet.png', { frameWidth: 512, frameHeight: 512 });
        scene.load.spritesheet('duck-mallard', 'assets/duck-mallard-spritesheet.png', { frameWidth: 512, frameHeight: 512 });
        scene.load.spritesheet('duck-brown', 'assets/duck-brown-spritesheet.png', { frameWidth: 512, frameHeight: 512 });
        scene.load.spritesheet('duck-mandarin', 'assets/duck-mandarin-spritesheet.png', { frameWidth: 512, frameHeight: 512 });
        scene.load.spritesheet('duck-duckling', 'assets/duck-duckling-spritesheet.png', { frameWidth: 512, frameHeight: 512 });

        scene.load.image('bread', 'assets/bread_NW.png');
        scene.load.image('breadc', 'assets/bread_cursor.png');

        scene.load.image('debug', 'assets/debug.png');
        scene.load.image('target', 'assets/target.png');

        scene.load.audio('quack-f1', 'assets/quack-f1.mp3');
        scene.load.audio('quackquack-f1', 'assets/quackquack-f1.mp3');
        scene.load.audio('quack-f2', 'assets/quack-f2.mp3');
        scene.load.audio('quackquack-f2', 'assets/quackquack-f2.mp3');
        scene.load.audio('quack-m1', 'assets/quack-m1.mp3');
        scene.load.audio('quackquack-m1', 'assets/quackquack-m1.mp3');
        scene.load.audio('chirp1', 'assets/chirp1.mp3');
        scene.load.audio('chirpchirp1', 'assets/chirpchirp1.mp3');
        scene.load.audio('chirp2', 'assets/chirp2.mp3');
        scene.load.audio('chirpchirp2', 'assets/chirpchirp2.mp3');

        scene.load.audio('ambience', 'assets/ambience.mp3');

        scene.load.json('duck-data', 'assets/duck-data.json');
    }

    create() {
        this.gameState.cursors = this.input.keyboard.createCursorKeys();

        this.input.setDefaultCursor('url(assets/bread_cursor.png), crosshair');
        this.input.on('pointerdown', function (pointer: Phaser.Input.Pointer) {
            if (this.gameState.pointerHandled)
                return;

            if (pointer.leftButtonDown()) {
                const point = this.gameState.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
                Food.createBread(this.gameState, point.x, point.y + 40);
            }
        }, this);

        this.buildMap();

        const x_offset = 4550;
        const y_offset = 2000;

        const startDucks = 3;
        for (let i = 0; i < startDucks; i++) {
            const randomTile = this.gameState.waterTiles[randomInt(this.gameState.waterTiles.length)];
            const randomDuckType = DuckType.random();

            this.gameState.addEntity(new Duck(this.gameState, randomTile.x, randomTile.y, randomDuckType));
        }

        Nest.create(this.gameState, 7013, 2144);

        this.gameState.scene.cameras.main.scrollX = x_offset;
        this.gameState.scene.cameras.main.scrollY = y_offset;
        this.gameState.scene.cameras.main.zoom = ZOOM_LEVEL;

        this.scale.on('resize', this.resize, this);
        this.resize({width: this.gameState.scene.cameras.main.width, height: this.gameState.scene.cameras.main.width}, null, null, null);

        this.gameState.scene.sound.add('ambience').play({ volume: 0.8, loop: true });
    }


    resize(gameSize, baseSize, displaySize, resolution) {
        // resets camera zoom and adjusts offset.

        var width = gameSize.width;
        var height = gameSize.height;

        const target = TARGET_WIDTH / ZOOM_LEVEL;
        const x2 = target / gameSize.width;
        this.gameState.scene.cameras.main.zoom = 1 / x2;

        this.gameState.scene.cameras.main.scrollX = width * -0.89 + 5898;
        this.gameState.scene.cameras.main.scrollY = height * -0.52 + 2600;

        this.gameState.uiScene.resize();
    }

    update() {
        this.gameState.update();
        this.gameState.pruneEntities();

        if (this.gameState.debug.cameraPanning) {
            const cursor = this.input.keyboard.createCursorKeys();
            if (cursor.left.isDown) {
                this.gameState.scene.cameras.main.scrollX -= 10;
            }
            if (cursor.right.isDown) {
                this.gameState.scene.cameras.main.scrollX += 10;
            }
            if (cursor.up.isDown) {
                this.gameState.scene.cameras.main.scrollY -= 10;
            }
            if (cursor.down.isDown) {
                this.gameState.scene.cameras.main.scrollY += 10;
            }
        }
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

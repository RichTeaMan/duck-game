import * as Phaser from 'phaser';
import { Duck } from './duck';
import { Food } from './food';
import { GameState } from './gameState';
import { PlayerDuck } from './playerDuck';

let cursors;

let entities = [];

let duck;

let tileWidthHalf;
let tileHeightHalf;

let d = 0;

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
    this.load.json('map', 'assets/tests/iso/isometric-water.json');
    this.load.spritesheet('tiles', 'assets/tests/iso/isometric-grass-and-water.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('skeleton', 'assets/tests/iso/skeleton8.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('house', 'assets/tests/iso/rem_0002.png');
    this.load.image('water', 'assets/water.png');
    this.load.spritesheet('duck', 'assets/duck-white-spritesheet.png', { frameWidth: 128, frameHeight: 128 });

    this.load.image('bread', 'assets/bread_NW.png');
}

function create() {
    gameState = new GameState(this);

    this.input.setDefaultCursor('url(assets/bread_cursor.png), pointer');
    this.input.on('pointerdown', function (pointer: Phaser.Input.Pointer) {

        const x = pointer.x + gameState.scene.cameras.main.scrollX;
        const y = pointer.y + gameState.scene.cameras.main.scrollY + 40;

        Food.createBread(gameState, x, y);
    }, this);

    //  Our Skeleton class


    buildWater();
    //buildMap();
    //placeHouses();

    /*
    skeletons.push(this.add.existing(new Skeleton(this, 240, 290, 'walk', 'southEast', 100)));
    skeletons.push(this.add.existing(new Skeleton(this, 100, 380, 'walk', 'southEast', 230)));
    skeletons.push(this.add.existing(new Skeleton(this, 620, 140, 'walk', 'south', 380)));
    skeletons.push(this.add.existing(new Skeleton(this, 460, 180, 'idle', 'south', 0)));

    skeletons.push(this.add.existing(new Skeleton(this, 760, 100, 'attack', 'southEast', 0)));
    skeletons.push(this.add.existing(new Skeleton(this, 800, 140, 'attack', 'northWest', 0)));

    skeletons.push(this.add.existing(new Skeleton(this, 750, 480, 'walk', 'east', 200)));

    skeletons.push(this.add.existing(new Skeleton(this, 1030, 300, 'die', 'west', 0)));

    skeletons.push(this.add.existing(new Skeleton(this, 1180, 340, 'attack', 'northEast', 0)));

    skeletons.push(this.add.existing(new Skeleton(this, 1180, 180, 'walk', 'southEast', 160)));

    skeletons.push(this.add.existing(new Skeleton(this, 1450, 320, 'walk', 'southWest', 320)));
    skeletons.push(this.add.existing(new Skeleton(this, 1500, 340, 'walk', 'southWest', 340)));
    skeletons.push(this.add.existing(new Skeleton(this, 1550, 360, 'walk', 'southWest', 330)));
*/

    duck = this.add.existing(new PlayerDuck(gameState, 600, 200, 'walk', 'east', 100));

    entities.push(this.add.existing(new Duck(gameState, 240, 290, 'walk', 'southEast', 100)));
    entities.push(this.add.existing(new Duck(gameState, 100, 380, 'walk', 'southEast', 230)));
    entities.push(this.add.existing(new Duck(gameState, 620, 140, 'walk', 'south', 380)));
    entities.push(this.add.existing(new Duck(gameState, 460, 180, 'walk', 'south', 150)));
    entities.push(this.add.existing(new Duck(gameState, 760, 100, 'walk', 'southEast', 670)));
    entities.push(this.add.existing(new Duck(gameState, 800, 140, 'walk', 'northWest', 800)));
    entities.push(this.add.existing(new Duck(gameState, 750, 480, 'walk', 'east', 200)));
    entities.push(this.add.existing(new Duck(gameState, 1030, 300, 'walk', 'west', 100)));
    entities.push(this.add.existing(new Duck(gameState, 1180, 340, 'walk', 'northEast', 420)));
    entities.push(this.add.existing(new Duck(gameState, 1180, 180, 'walk', 'southEast', 160)));
    entities.push(this.add.existing(new Duck(gameState, 1450, 320, 'walk', 'southWest', 320)));
    entities.push(this.add.existing(new Duck(gameState, 1500, 340, 'walk', 'southWest', 340)));
    entities.push(this.add.existing(new Duck(gameState, 1550, 360, 'walk', 'southWest', 330)));

    this.cameras.main.setSize(1600, 1200);

    // this.cameras.main.scrollX = 800;
}

function update() {
    entities.forEach(function (skeleton) {
        skeleton.update();
    });

    duck.update();
    gameState.update();
    gameState.pruneEntities();

    // return;

    if (d) {
        this.cameras.main.scrollX -= 0.5;

        if (this.cameras.main.scrollX <= 0) {
            d = 0;
        }
    }
    else {
        this.cameras.main.scrollX += 0.5;

        if (this.cameras.main.scrollX >= 800) {
            d = 1;
        }
    }
}

function buildWater() {
    //  Parse the data out of the map
    var data = gameState.scene.cache.json.get('map');

    var tilewidth = data.tilewidth;
    var tileheight = data.tileheight;

    tileWidthHalf = tilewidth / 2;
    tileHeightHalf = tileheight / 2;

    var layer = data.layers[0].data;

    var mapwidth = data.layers[0].width;
    var mapheight = data.layers[0].height;

    var centerX = mapwidth * tileWidthHalf;
    var centerY = 16;

    var i = 0;

    for (var y = 0; y < mapheight; y++) {
        for (var x = 0; x < mapwidth; x++) {
            const id = layer[i] - 1;

            var tx = (x - y) * tileWidthHalf;
            var ty = (x + y) * tileHeightHalf;

            var tile = gameState.scene.add.image(centerX + tx, centerY + ty, 'water');

            tile.depth = 200;
            //tile.depth = centerY + ty;
            console.log(tile.depth);
            i++;
        }
    }
}

function buildMap() {
    //  Parse the data out of the map
    var data = this.gameState.scene.cache.json.get('map');

    var tilewidth = data.tilewidth;
    var tileheight = data.tileheight;

    tileWidthHalf = tilewidth / 2;
    tileHeightHalf = tileheight / 2;

    var layer = data.layers[0].data;

    var mapwidth = data.layers[0].width;
    var mapheight = data.layers[0].height;

    var centerX = mapwidth * tileWidthHalf;
    var centerY = 16;

    var i = 0;

    for (var y = 0; y < mapheight; y++) {
        for (var x = 0; x < mapwidth; x++) {
            const id = layer[i] - 1;

            var tx = (x - y) * tileWidthHalf;
            var ty = (x + y) * tileHeightHalf;

            var tile = this.gameState.scene.add.image(centerX + tx, centerY + ty, 'tiles', id);

            tile.depth = centerY + ty;

            i++;
        }
    }
}

function placeHouses() {
    var house = this.gameState.scene.add.image(240, 370, 'house');

    house.depth = house.y + 86;

    house = this.gameState.scene.add.image(1300, 290, 'house');

    house.depth = house.y + 86;
}

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export function setupGame(): Phaser.Game {
    const game = new Phaser.Game(gameConfig);
    return game;
}

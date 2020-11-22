import * as Phaser from 'phaser';

var directions = {
    west: { offset: 0, x: -2, y: 0, opposite: 'east' },
    northWest: { offset: 32, x: -2, y: -1, opposite: 'southEast' },
    north: { offset: 64, x: 0, y: -2, opposite: 'south' },
    northEast: { offset: 96, x: 2, y: -1, opposite: 'southWest' },
    east: { offset: 128, x: 2, y: 0, opposite: 'west' },
    southEast: { offset: 160, x: 2, y: 1, opposite: 'northWest' },
    south: { offset: 192, x: 0, y: 2, opposite: 'north' },
    southWest: { offset: 224, x: -2, y: 1, opposite: 'northEast' }
};

var anims = {
    idle: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.2
    },
    walk: {
        startFrame: 4,
        endFrame: 12,
        speed: 0.15
    },
    attack: {
        startFrame: 12,
        endFrame: 20,
        speed: 0.11
    },
    die: {
        startFrame: 20,
        endFrame: 28,
        speed: 0.2
    },
    shoot: {
        startFrame: 28,
        endFrame: 32,
        speed: 0.1
    }
};

var duckAnims = {
    idle: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.2
    },
    walk: {
        startFrame: 0,
        endFrame: 8,
        speed: 0.45
    },
    attack: {
        startFrame: 12,
        endFrame: 20,
        speed: 0.11
    },
    die: {
        startFrame: 20,
        endFrame: 28,
        speed: 0.2
    },
    shoot: {
        startFrame: 28,
        endFrame: 32,
        speed: 0.1
    }
};

let cursors;

var entities = [];

var duck;

var tileWidthHalf;
var tileHeightHalf;

var d = 0;

let scene: Phaser.Scene;

class Skeleton extends Phaser.GameObjects.Image {

    Extends: Phaser.GameObjects.Image;

    initialize: any;

    startX: number;
    startY: number;
    distance: number;

    motion: any;
    anim: any;
    direction: any;
    speed: number;

    /**
     * Frame.
     */
    f: number;

    depth: number;

    constructor(scene, x, y, motion, direction, distance) {
        super(scene, x, y, 'skeleton', direction.offset + anims[motion].startFrame)

        this.startX = x;
        this.startY = y;
        this.distance = distance;

        this.motion = motion;
        this.anim = anims[motion];
        this.direction = directions[direction];
        this.speed = 0.15;
        this.f = this.anim.startFrame;

        //Phaser.GameObjects.Image.call(this, scene, x, y, 'skeleton', this.direction.offset + this.f);


        this.depth = y + 64;

        scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    };

    changeFrame() {
        this.f++;

        var delay = this.anim.speed;

        if (this.f === this.anim.endFrame) {
            switch (this.motion) {
                case 'walk':
                    this.f = this.anim.startFrame;
                    this.frame = this.texture.get(this.direction.offset + this.f);
                    scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
                    break;

                case 'attack':
                    delay = Math.random() * 2;
                    scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

                case 'idle':
                    delay = 0.5 + Math.random();
                    scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

                case 'die':
                    delay = 6 + Math.random() * 6;
                    scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;
            }
        }
        else {
            this.frame = this.texture.get(this.direction.offset + this.f);

            scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
        }
    }

    resetAnimation() {
        this.f = this.anim.startFrame;

        this.frame = this.texture.get(this.direction.offset + this.f);

        scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    }

    update() {
        if (this.motion === 'walk') {
            this.x += this.direction.x * this.speed;

            if (this.direction.y !== 0) {
                this.y += this.direction.y * this.speed;
                this.depth = this.y + 64;
            }

            //  Walked far enough?
            if (Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y) >= this.distance) {
                this.direction = directions[this.direction.opposite];
                this.f = this.anim.startFrame;
                this.frame = this.texture.get(this.direction.offset + this.f);
                this.startX = this.x;
                this.startY = this.y;
            }
        }
    }

}


class Duck extends Phaser.GameObjects.Image {

    Extends: Phaser.GameObjects.Image;

    initialize: any;

    startX: number;
    startY: number;
    distance: number;

    motion: any;
    anim: any;
    direction: any;
    speed: number;

    /**
     * Frame.
     */
    f: number;

    depth: number;

    playerControlled = false;

    constructor(scene, x, y, motion, direction, distance) {
        super(scene, x, y, 'duck')//, direction.offset + anims[motion].startFrame)

        this.startX = x;
        this.startY = y;
        this.distance = distance;

        this.motion = motion;
        this.anim = duckAnims[motion];
        this.direction = directions[direction];
        this.speed = this.anim.speed;
        this.f = this.anim.startFrame;

        //Phaser.GameObjects.Image.call(this, scene, x, y, 'skeleton', this.direction.offset + this.f);


        this.depth = y + 64;

        scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    };

    changeFrame() {
        //this.f++;

        var delay = this.anim.speed;

        if (this.f === this.anim.endFrame) {
            switch (this.motion) {
                case 'walk':
                    this.f = this.anim.startFrame;
                    this.frame = this.texture.get(this.direction.offset + this.f);
                    scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
                    break;

                case 'attack':
                    delay = Math.random() * 2;
                    scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

                case 'idle':
                    delay = 0.5 + Math.random();
                    scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

                case 'die':
                    delay = 6 + Math.random() * 6;
                    scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;
            }
        }
        else {
            this.frame = this.texture.get(this.direction.offset + this.f);

            scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
        }
    }

    resetAnimation() {
        //this.f = this.anim.startFrame;

        //this.frame = this.texture.get(this.direction.offset + this.f);

        //scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    }

    update() {
        if (this.playerControlled) {
            if (cursors.left.isDown) {
                this.direction = directions['west'];
            } else if (cursors.up.isDown) {
                this.direction = directions['north'];
            } else if (cursors.right.isDown) {
                this.direction = directions['east'];
            } else if (cursors.down.isDown) {
                this.direction = directions['south'];
            } else {
                // stop, somehow
            }

            if (this.motion === 'walk') {
                this.x += this.direction.x * this.speed;

                if (this.direction.y !== 0) {
                    this.y += this.direction.y * this.speed;
                    this.depth = this.y + 64;
                }
                this.frame = this.texture.get(this.direction.offset + this.f);
            }
        }
        else {
            if (this.motion === 'walk') {
                this.x += this.direction.x * this.speed;

                if (this.direction.y !== 0) {
                    this.y += this.direction.y * this.speed;
                    this.depth = this.y + 64;
                }

                //  Walked far enough?
                if (Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y) >= this.distance) {
                    this.direction = directions[this.direction.opposite];
                    this.f = this.anim.startFrame;
                    this.frame = this.texture.get(this.direction.offset + this.f);
                    this.startX = this.x;
                    this.startY = this.y;
                }
            }
        }
    }

}

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
    scene = this;
    cursors = scene.input.keyboard.createCursorKeys();

    this.input.setDefaultCursor('url(assets/bread_cursor.png), pointer');
    this.input.on('pointerdown', function (pointer: Phaser.Input.Pointer) {

        const x = pointer.x + scene.cameras.main.scrollX;
        const y = pointer.y + scene.cameras.main.scrollY + 40;

        const bread = scene.add.image(x, y, 'bread');
        bread.scale = 0.2;

        //const bread = scene.add.image(600, 200, 'bread');
        bread.depth = 900;

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

    duck = this.add.existing(new Duck(this, 600, 200, 'walk', 'east', 100));
    duck.playerControlled = true;

    entities.push(this.add.existing(new Duck(this, 240, 290, 'walk', 'southEast', 100)));
    entities.push(this.add.existing(new Duck(this, 100, 380, 'walk', 'southEast', 230)));
    entities.push(this.add.existing(new Duck(this, 620, 140, 'walk', 'south', 380)));
    entities.push(this.add.existing(new Duck(this, 460, 180, 'walk', 'south', 150)));
    entities.push(this.add.existing(new Duck(this, 760, 100, 'walk', 'southEast', 670)));
    entities.push(this.add.existing(new Duck(this, 800, 140, 'walk', 'northWest', 800)));
    entities.push(this.add.existing(new Duck(this, 750, 480, 'walk', 'east', 200)));
    entities.push(this.add.existing(new Duck(this, 1030, 300, 'walk', 'west', 100)));
    entities.push(this.add.existing(new Duck(this, 1180, 340, 'walk', 'northEast', 420)));
    entities.push(this.add.existing(new Duck(this, 1180, 180, 'walk', 'southEast', 160)));
    entities.push(this.add.existing(new Duck(this, 1450, 320, 'walk', 'southWest', 320)));
    entities.push(this.add.existing(new Duck(this, 1500, 340, 'walk', 'southWest', 340)));
    entities.push(this.add.existing(new Duck(this, 1550, 360, 'walk', 'southWest', 330)));

    this.cameras.main.setSize(1600, 1200);

    // this.cameras.main.scrollX = 800;
}

function update() {
    entities.forEach(function (skeleton) {
        skeleton.update();
    });

    duck.update();

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
    var data = scene.cache.json.get('map');

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

            var tile = scene.add.image(centerX + tx, centerY + ty, 'water');

            tile.depth = centerY + ty;
            console.log(tile.depth);
            i++;
        }
    }
}

function buildMap() {
    //  Parse the data out of the map
    var data = scene.cache.json.get('map');

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

            var tile = scene.add.image(centerX + tx, centerY + ty, 'tiles', id);

            tile.depth = centerY + ty;

            i++;
        }
    }
}

function placeHouses() {
    var house = scene.add.image(240, 370, 'house');

    house.depth = house.y + 86;

    house = scene.add.image(1300, 290, 'house');

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

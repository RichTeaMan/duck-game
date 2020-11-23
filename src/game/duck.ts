import { GameState } from "./gameState";

const directions = {
    west: { offset: 0, x: -2, y: 0, opposite: 'east' },
    northWest: { offset: 32, x: -2, y: -1, opposite: 'southEast' },
    north: { offset: 64, x: 0, y: -2, opposite: 'south' },
    northEast: { offset: 96, x: 2, y: -1, opposite: 'southWest' },
    east: { offset: 128, x: 2, y: 0, opposite: 'west' },
    southEast: { offset: 160, x: 2, y: 1, opposite: 'northWest' },
    south: { offset: 192, x: 0, y: 2, opposite: 'north' },
    southWest: { offset: 224, x: -2, y: 1, opposite: 'northEast' }
};

const duckAnims = {
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

export class Duck extends Phaser.GameObjects.Image {

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

    target = null;

    gameState: GameState;

    constructor(gameState: GameState, x: number, y: number, motion, direction, distance) {
        super(gameState.scene, x, y, 'duck')//, direction.offset + anims[motion].startFrame)

        this.startX = x;
        this.startY = y;
        this.distance = distance;

        this.motion = motion;
        this.anim = duckAnims[motion];
        this.direction = directions[direction];
        this.speed = this.anim.speed;
        this.f = this.anim.startFrame;

        this.gameState = gameState;

        //Phaser.GameObjects.Image.call(this, scene, x, y, 'skeleton', this.direction.offset + this.f);


        this.depth = y + 64;

        this.scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    };

    changeFrame() {
        //this.f++;

        var delay = this.anim.speed;

        if (this.f === this.anim.endFrame) {
            switch (this.motion) {
                case 'walk':
                    this.f = this.anim.startFrame;
                    this.frame = this.texture.get(this.direction.offset + this.f);
                    this.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
                    break;

                case 'attack':
                    delay = Math.random() * 2;
                    this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

                case 'idle':
                    delay = 0.5 + Math.random();
                    this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

                case 'die':
                    delay = 6 + Math.random() * 6;
                    this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;
            }
        }
        else {
            this.frame = this.texture.get(this.direction.offset + this.f);

            this.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
        }
    }

    resetAnimation() {
        //this.f = this.anim.startFrame;

        //this.frame = this.texture.get(this.direction.offset + this.f);

        //scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    }

    update() {
        // is there bread close by?
        this.gameState.foodList.forEach(f => {
            if (this.target != null)
                return;

            const dx = Math.abs(this.x - f.x);
            const dy = Math.abs(this.y - f.y);

            const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

            if (dist < 500) {

                // lets go
                this.target = f;
            }
        });

        if (this.target) {
            if (this.target.isDestroyed) {
                this.target = null;
                return;
            }
            const velocity = 0.5;
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;

            const angle = Math.atan(Math.abs(dx) / Math.abs(dy));
            let xR = Math.cos(angle);
            let yR = Math.sin(angle);

            const total = xR + yR;
            const modX = (dx / total) * velocity;
            const modY = (dy / total) * velocity;

            if (dx < 0 && xR > 0) {
                xR = -xR;
            }
            if (dy < 0 && yR > 0) {
                yR = -yR;
            }

            this.x += modX;
            this.y += modY;
        }
        else {

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

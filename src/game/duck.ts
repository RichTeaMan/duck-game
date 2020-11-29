import { Direction } from "./direction";
import { Entity } from "./entity";
import { EntityType } from "./entityType";
import { GameState } from "./gameState";
import { InvisibleTarget } from "./invisibleTarget";
import { Nest } from "./nest";
import { randomElement, randomInt } from "./utils";

const duckAnims = {
    walk: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.20
    },
    feed: {
        startFrame: 5,
        endFrame: 7,
        speed: 0.8
    },
    quack: {
        startFrame: 8,
        endFrame: 10,
        speed: 0.6
    },
    stand: {
        startFrame: 11,
        endFrame: 13,
        speed: 0.2
    },
    standFlap: {
        startFrame: 14,
        endFrame: 16,
        speed: 0.2
    }
};

export class DuckType {
    static duckTypes = [
        "white",
        "mallard",
        "brown",
        "mandarin"
    ];

    static random() {
        return DuckType.duckTypes[randomInt(DuckType.duckTypes.length)];
    }
}

export class Duck extends Entity {

    static QUACKS = [
        "quack-f1",
        "quackquack-f1",
        "quack-f2",
        "quackquack-f2",
        "quack-m1",
        "quackquack-m1"
    ];

    static CHIRPS = [
        "chirp1",
        "chirpchirp1",
        "chirp2",
        "chirpchirp2"
    ];

    /**
     * Gets the age in ticks when a duckling should age into a duck.
     */
    static DUCKLING_MATURATION_AGE = 30000;

    name = this.fetchName();

    motion: any;
    anim: any;
    direction: Direction = Direction.random();
    speed: number;

    /**
     * Frame.
     */
    f: number;

    target: Entity = null;
    vector: Phaser.Math.Vector2 = null;

    animationStep = 1;

    active = true;

    idleTicks = 0;

    thought: string = '';

    /**
     * The duck this duck should follow.
     */
    leaderDuck: Duck;

    duckType: DuckType;

    duckling: boolean;

    lastNested = - 10 * Duck.DUCKLING_MATURATION_AGE;

    /**
     * Age of the duck in ticks.
     */
    age = 0;

    private nesting = false;

    constructor(gameState: GameState, x: number, y: number, duckType: string, duckling = false) {
        super(gameState, duckling ? `duck-duckling` : `duck-${duckType}`, x, y);
        if (duckling) {
            this.image.scale = 0.4;
        }
        else {
            this.image.scale = 0.8;
        }

        this.duckling = duckling;

        this.image.setInteractive({ cursor: 'pointer' });
        this.image.input.hitArea.setTo(128, 128, 512 - 128, 512 - 128);

        this.duckType = duckType;
        this.motion = 'walk';
        this.anim = duckAnims[this.motion];
        this.speed = this.anim.speed;
        this.f = this.anim.startFrame;

        this.gameState.scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    };

    onPointerDown(pointer: Phaser.Input.Pointer) {
        this.gameState.pointerHandled = true;
        pointer.event.stopImmediatePropagation();
        this.startQuackAnimation();
        this.quack();
        this.thought = this.fetchThought();
        this.gameState.uiScene.displayDuckInfo(this);
    }

    entityType(): EntityType {
        return EntityType.Duck;
    }

    fetchName() {
        const names = this.gameState.scene.cache.json.get('duck-data').duckNames as Array<string>;
        return randomElement(names);
    }

    fetchThought() {
        let thoughts: Array<string>;
        if (this.duckling) {
            thoughts = this.gameState.scene.cache.json.get('duck-data').ducklingThoughts as Array<string>;
        }
        else {
            thoughts = this.gameState.scene.cache.json.get('duck-data').duckThoughts as Array<string>;
        }
        return randomElement(thoughts);
    }

    startWalkAnimation() {
        this.f = duckAnims['walk'].startFrame;
        this.anim = duckAnims['walk'];
        this.animationStep = 1;
        this.motion = 'walk';
        this.changeFrame();
        this.active = true;
    }

    startFeedAnimation() {
        this.f = duckAnims['feed'].startFrame;
        this.anim = duckAnims['feed'];
        this.animationStep = 1;
        this.motion = 'feed';
        this.changeFrame();
        this.active = false;
    }

    startQuackAnimation() {
        this.f = duckAnims['quack'].startFrame;
        this.anim = duckAnims['quack'];
        this.animationStep = 1;
        this.motion = 'quack';
        this.changeFrame();
        this.active = false;
    }

    startStandAnimation() {
        this.f = duckAnims['stand'].startFrame;
        this.anim = duckAnims['stand'];
        this.animationStep = 1;
        this.motion = 'stand';
        this.changeFrame();
        this.active = true;
    }

    startStandFlapAnimation() {
        this.f = duckAnims['standFlap'].startFrame;
        this.anim = duckAnims['standFlap'];
        this.animationStep = 1;
        this.motion = 'standFlap';
        this.changeFrame();
        this.active = true;
    }

    changeFrame() {

        let delay = this.anim.speed;
        this.image.depth = this.y + 256;
        let localF = this.f;

        if (this.f > this.anim.endFrame || this.f < 0 || this.f < this.anim.startFrame) {
            switch (this.motion) {
                case 'walk':
                    this.animationStep = -this.animationStep;
                    this.f += 2 * this.animationStep;
                    localF = this.f;
                    break;

                case 'feed':
                    this.gameState.scene.time.delayedCall(delay * 1000, this.startWalkAnimation, [], this);
                    return;

                case 'quack':
                    localF = this.f - 4;
                    if (this.f === 11) {
                        localF = 9;
                    }
                    else if (this.f > 16) {
                        this.startWalkAnimation();
                        return;
                    }
                    this.gameState.scene.time.delayedCall(delay * 1000, this.startWalkAnimation, [], this);
                    break;

                case 'stand':
                    this.startStandFlapAnimation();
                    return;
                case 'standFlap':
                    this.f = this.anim.startFrame;
                    localF = this.f;
                    break;
            }
        }

        this.image.frame = this.image.texture.get(this.direction.offset + localF);
        this.gameState.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
        this.f += this.animationStep;
    }

    /**
     * Moves the duck by the given amount, or returns false is fuck a movement isn't possible.
     * @param modX Amount to move duck by.
     * @param modY Amount to move duck by.
     */
    move(modX: number, modY: number): boolean {

        if (this.gameState.isPointWater(this.x + modX, this.y + modY)) {
            this.x += modX;
            this.y += modY;
            return true;
        }
        return false;
    }

    sendToNest(nest: Nest) {

        this.nesting = true;
        this.target?.destroy();
        this.target = nest;
        this.vector = this.vectorToEntity(nest, 3);
        this.direction = Direction.determineFromVector(this.vector);
    }

    nestingComplete() {
        this.nesting = false;
        this.target = null;
        this.active = true;
        this.lastNested = this.gameState.ticks;
    }

    quack() {
        let quackTrack: string;
        if (this.duckling) {
            quackTrack = randomElement(Duck.CHIRPS);
        }
        else {
            quackTrack = randomElement(Duck.QUACKS);
        }
        this.gameState.scene.sound.add(quackTrack).play({ volume: 0.2 });
    }

    update() {
        this.age++;
        if (this.duckling && this.age > Duck.DUCKLING_MATURATION_AGE) {

            this.duckling = false;
            this.leaderDuck = null;
            this.target = null;
            this.image.destroy();

            this.image = this.gameState.scene.add.image(this.x, this.y, `duck-${this.duckType}`);
            this.image.scale = 0.8;

            this.gameState.uiScene.displayToast(`${this.name} is all grown up.`);
        }

        if (!this.active)
            return;

        // 0.05% chance to quack
        if (randomInt(2000) === 1) {
            this.quack();
            this.startQuackAnimation();
        }

        if (this.leaderDuck != null) {
            const oppDir = this.leaderDuck.direction.opposite;

            const leaderOffset = 90;
            const justBehindX = this.leaderDuck.x + leaderOffset * oppDir.x;
            const justBehindY = this.leaderDuck.y + leaderOffset * oppDir.y;

            this.vector = this.vectorToTarget(justBehindX, justBehindY, 1)
            this.direction = Direction.determineFromVector(this.vector);
        }

        // find a target
        if (this.target == null || this.target.isDestroyed || this.target.entityType() === EntityType.Invisible) {

            // look for food
            if (this.gameState.fetchFood().length > 0) {
                const breadList = this.gameState.fetchFood().map(f => ({ distance: this.distanceFromEntity(f) + randomInt(30), target: f }));
                const select = breadList.sort(f => f.distance).reverse()[0];
                if (select.distance < 450) {

                    this.target?.destroy();
                    this.target = select.target;
                    this.vector = this.vectorToEntity(this.target, 5);
                    this.startStandAnimation();
                }
            }

            // find a random point to swim too
            if (this.target == null) {
                // no bread, swim to random target
                const waterTile = randomElement(this.gameState.waterTiles);
                this.target = this.gameState.addEntity(new InvisibleTarget(this.gameState, waterTile.x, waterTile.y));

                this.vector = this.vectorToEntity(this.target, 1);
                this.startWalkAnimation();
            }
            this.direction = Direction.determineFromVector(this.vector);
        }

        if (!this.nesting && this.target != null && this.distanceFromEntity(this.target) < 2.5) {
            this.target.destroy();

            if (this.target.entityType() === EntityType.Food) {
                this.startFeedAnimation();
            }
            this.target = null;
            return;
        }
        if (this.nesting && this.distanceFromEntity(this.target) < 2.5) {
            this.vector.x = 0;
            this.vector.y = 0;
            this.direction = Direction.west;
            this.active = false;
        }

        this.x += this.vector.x;
        this.y += this.vector.y;
        this.image.depth = this.y + this.image.y;
    }
}

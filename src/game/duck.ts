import { Direction } from "./direction";
import { Entity } from "./entity";
import { EntityType } from "./entityType";
import { GameState } from "./gameState";
import { InvisibleTarget } from "./invisibleTarget";
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
        "mallard"];

    static random() {
        return DuckType.duckTypes[randomInt(DuckType.duckTypes.length)];
    }
}

export class Duck extends Entity {

    name = randomElement(["Daisy", "Mavis", "Harold", "Ernest", "Ermintrude", "Annie", "Reginald", "Clarence", "Emmett", "Gert", "Hilda", "Doris", "Hattie"]);

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

    gameState: GameState;

    animationStep = 1;

    active = true;

    idleTicks = 0;

    thought: string = '';

    constructor(gameState: GameState, x: number, y: number, duckType: string) {
        super(gameState, `duck-${duckType}`, x, y);

        this.image.scale = 0.8;
        this.image.setInteractive();
        this.image.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.startQuackAnimation();
            this.gameState.scene.sound.add('quackquack-f').play({ volume: 0.2 });
            const thoughts = this.gameState.scene.cache.json.get('duck-thoughts') as Array<string>;
            this.thought = randomElement(thoughts);
            this.gameState.uiScene.displayDuckInfo(this);
        });

        this.motion = 'walk';
        this.anim = duckAnims[this.motion];
        this.speed = this.anim.speed;
        this.f = this.anim.startFrame;
        this.gameState = gameState;

        this.gameState.scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    };

    entityType(): EntityType {
        return EntityType.Duck;
    }

    onObjectClicked(pointer: Phaser.Input.Pointer) {
        this.gameState.uiScene.addTextWithDuration(this.name, 6000);
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

    update() {
        if (!this.active)
            return;

        // 0.05% chance to quack
        if (randomInt(2000) === 1) {
            this.gameState.scene.sound.add('quackquack-f').play({ volume: 0.2 })
            this.startQuackAnimation();
        }

        // find a target
        if (this.target == null || this.target.isDestroyed || this.target.entityType() !== EntityType.Food) {

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

        if (this.distanceFromEntity(this.target) < 2.5) {
            this.target.destroy();

            if (this.target.entityType() === EntityType.Food) {
                this.startFeedAnimation();
            }
            this.target = null;
            return;
        }

        this.x += this.vector.x;
        this.y += this.vector.y;
        this.image.depth = this.y + this.image.y;
    }
}

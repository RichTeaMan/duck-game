import { Direction } from "./direction";
import { Entity } from "./entity";
import { EntityType } from "./entityType";
import { GameState } from "./gameState";
import { randomInt } from "./utils";

const duckAnims = {
    idle: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.2
    },
    walk: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.40 // 0.10
    },
    feed: {
        startFrame: 5,
        endFrame: 7,
        speed: 0.8
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

export class DuckType {
    static duckTypes = [
        "white",
        "mallard"];

    static random() {
        return DuckType.duckTypes[randomInt(DuckType.duckTypes.length)];
    }
}

export class Duck extends Entity {

    motion: any;
    anim: any;
    direction: Direction = Direction.random();
    speed: number;

    /**
     * Frame.
     */
    f: number;

    target: Entity = null;

    gameState: GameState;

    animationStep = 1;

    active = true;

    idleTicks = 0;

    constructor(gameState: GameState, x: number, y: number, duckType: string) {
        super(gameState, `duck-${duckType}`, x, y);

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

    changeFrame() {

        let delay = this.anim.speed;
        this.image.depth = this.y + 256;

        if (this.f > this.anim.endFrame || this.f < 0) {
            switch (this.motion) {
                case 'walk':
                    this.animationStep = -this.animationStep;
                    this.f += 2 * this.animationStep;
                    break;

                case 'feed':
                    this.gameState.scene.time.delayedCall(delay * 1000, this.startWalkAnimation, [], this);
                    return;

                case 'idle':
                    delay = 0.5 + Math.random();
                    this.gameState.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

                case 'die':
                    delay = 6 + Math.random() * 6;
                    this.gameState.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;
            }
        }

        this.image.frame = this.image.texture.get(this.direction.offset + this.f);
        this.gameState.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
        this.f += this.animationStep;
    }

    resetAnimation() {
        //this.f = this.anim.startFrame;

        //this.frame = this.texture.get(this.direction.offset + this.f);

        //scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
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
        this.image.depth = this.y + 256;

        // is there bread close by?
        if (this.target == null && this.gameState.fetchFood().length > 0) {
            const breadList = this.gameState.fetchFood().map(f => ({ distance: this.distanceFromEntity(f) + randomInt(30), target: f }));
            const select = breadList.sort(f => f.distance).reverse()[0];
            if (select.distance < 250) {
                this.target = select.target;
            }
        }

        if (this.target) {
            if (this.target.isDestroyed) {
                this.target = null;
                return;
            }

            if (this.distanceFromEntity(this.target) < 2.5) {
                this.target.destroy();

                // feed animation
                this.startFeedAnimation();
                return;
            }

            const velocity = 0.05;
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
            this.image.depth = this.y + 256;
        }
        else {

            const modX = this.direction.x * this.speed;
            let modY = 0;

            if (this.direction.y !== 0) {
                modY = this.direction.y * this.speed;
                this.image.depth = this.y + 128;
            }

            //  Walked far enough?
            if (!this.move(modX, modY) || this.idleTicks <= 0) {
                this.idleTicks = randomInt(250);
                this.direction = Direction.random();
                this.image.frame = this.image.texture.get(this.direction.offset + this.f);
            }
        }
    }
}

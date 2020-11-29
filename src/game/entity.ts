import { EntityType } from "./entityType";
import { GameState } from "./gameState";

export abstract class Entity {

    image: Phaser.GameObjects.Image;
    isDestroyed = false;
    gameState: GameState;

    constructor(gameState: GameState, imageName: string, x: number, y: number) {
        this.image = gameState.scene.add.image(x, y, imageName);
        this.gameState = gameState;
        this.setEvents();
    }

    abstract entityType(): EntityType;

    setEvents() {
        this.image.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.onPointerDown(pointer)
        });
    }

    onPointerDown(pointer: Phaser.Input.Pointer) {

    }

    update() {

    }

    destroy() {
        this.isDestroyed = true;
        if (this.image)
            this.image.destroy();
    }

    distanceFromEntity(otherEntity: Entity) {
        return Phaser.Math.Distance.Between(this.x, this.y, otherEntity.x, otherEntity.y);
    }

    vectorToEntity(entity: Entity, speed: number) {
        return this.vectorToTarget(entity.x, entity.y, speed);
    }

    vectorToTarget(x: number, y: number, speed: number) {

        const dx = x - this.x;
        const dy = y - this.y;

        const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
        let xR = Math.cos(angle);
        let yR = Math.sin(angle);

        const total =  Math.abs(xR) + Math.abs(yR);
        let modX = (xR / total) * speed;
        let modY = (yR / total) * speed;

        if (modX > 10 || modY > 10) {

            console.error(`Spurious vectorToTargetResult - C: ${x}, ${y} | A: ${Phaser.Math.RadToDeg(angle)} | ${dx}, ${dy} | ${modX}, ${modY}`);

            if (modX > speed) {
                modX = speed;
            }
            else if (modX < -speed) {
                modX = -speed;
            }

            if (modY > speed) {
                modY = speed;
            }
            else if (modY < -speed) {
                modY = -speed;
            }
        }
        return new Phaser.Math.Vector2(modX, modY);
    }

    get x() {
        return this.image.x;
    }
    set x(x: number) {
        this.image.x = x;
    }

    get y() {
        return this.image.y;
    }
    set y(y: number) {
        this.image.y = y;
    }
}

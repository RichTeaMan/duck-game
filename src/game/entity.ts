import { EntityType } from "./entityType";
import { GameState } from "./gameState";

export abstract class Entity {

    image: Phaser.GameObjects.Image;
    isDestroyed = false;

    constructor(gameState: GameState, imageName: string, x: number, y: number) {
        this.image = gameState.scene.add.image(x, y, imageName);
    }

    abstract entityType(): EntityType;

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

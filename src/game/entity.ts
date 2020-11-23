import { GameState } from "./gameState";

export class Entity {

    image: Phaser.GameObjects.Image;
    isDestroyed = false;

    constructor(gameState: GameState, imageName: string, x: number, y: number) {
        this.image = gameState.scene.add.image(x, y, imageName);
    }

    destroy() {
        this.isDestroyed = true;
        if (this.image)
            this.image.destroy();
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

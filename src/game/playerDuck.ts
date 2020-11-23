import { Direction } from "./direction";
import { Duck } from "./duck";

export class PlayerDuck extends Duck {

    update() {
        if (this.gameState.cursors.left.isDown) {
            this.direction = Direction.west;
        } else if (this.gameState.cursors.up.isDown) {
            this.direction = Direction.north;
        } else if (this.gameState.cursors.right.isDown) {
            this.direction = Direction.east;
        } else if (this.gameState.cursors.down.isDown) {
            this.direction = Direction.south;
        } else {
            // stop, somehow
        }

        this.x += this.direction.x * this.speed;

        if (this.direction.y !== 0) {
            this.y += this.direction.y * this.speed;
            this.image.depth = this.y + 64;
        }
        this.image.frame = this.image.texture.get(this.direction.offset + this.f);
    }
}

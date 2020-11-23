import { Duck } from "./duck";

// TODO use the super class somehow
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

export class PlayerDuck extends Duck {

    update() {
        if (this.gameState.cursors.left.isDown) {
            this.direction = directions['west'];
        } else if (this.gameState.cursors.up.isDown) {
            this.direction = directions['north'];
        } else if (this.gameState.cursors.right.isDown) {
            this.direction = directions['east'];
        } else if (this.gameState.cursors.down.isDown) {
            this.direction = directions['south'];
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

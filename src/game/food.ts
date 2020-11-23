import { GameState } from "./gameState";

export class Food {

    static createBread(gameState: GameState, x: number, y: number): Food {

        const bread = new Food(gameState, 'bread', x, y);
        bread.image.scale = 0.2;
        gameState.foodList.push(bread);
        return bread;
    }

    image: Phaser.GameObjects.Image;

    constructor(gameState: GameState, imageName: string, x: number, y: number) {
        this.image = gameState.scene.add.image(x, y, imageName);

        this.image.depth = 900;
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

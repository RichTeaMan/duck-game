import { Entity } from "./entity";
import { GameState } from "./gameState";

export class Food extends Entity {

    static createBread(gameState: GameState, x: number, y: number): Food {

        const bread = new Food(gameState, 'bread', x, y);
        bread.image.scale = 0.2;
        gameState.foodList.push(bread);
        return bread;
    }

    start = 0;

    constructor(gameState: GameState, imageName: string, x: number, y: number) {
        super(gameState, imageName, x, y);

        this.image.depth = 900;
    }

    update() {
        this.start++;

        if (this.start > 1000) {
            this.destroy();
        }
    }
}

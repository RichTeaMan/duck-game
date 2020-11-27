import { Entity } from "./entity";
import { EntityType } from "./entityType";
import { GameState } from "./gameState";

export class Food extends Entity {

    static createBread(gameState: GameState, x: number, y: number): Food {

        const bread = new Food(gameState, 'bread', x, y);
        bread.image.scale = 0.6;
        gameState.entities.push(bread);
        return bread;
    }

    start = 0;

    constructor(gameState: GameState, imageName: string, x: number, y: number) {
        super(gameState, imageName, x, y);

        this.image.depth = y + 32;
    }

    entityType(): EntityType {
        return EntityType.Food;
    }

    update() {
        this.start++;

        if (this.start > 200) {
            this.destroy();
        }
    }
}

import { Entity } from "./entity";
import { Food } from "./food";

export class GameState {

    scene: Phaser.Scene;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    foodList: Array<Food> = [];
    entities: Array<Entity> = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {
        this.foodList.forEach(food => {
            food.update();
        })
    }

    pruneEntities() {

        const newFood: Array<Food> = [];
        this.foodList.forEach(food => {
            if (!food.isDestroyed) {
                newFood.push(food);
            }
        });
        this.foodList = newFood;
    }
}

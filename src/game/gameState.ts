import { Food } from "./food";

export class GameState {

    scene: Phaser.Scene;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    foodList: Array<Food> = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    this.cursors = scene.input.keyboard.createCursorKeys();
    }
}

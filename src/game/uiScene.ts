import * as Phaser from 'phaser';
import { GameState } from './gameState';

export class UiScene extends Phaser.Scene {

    gameState: GameState;

    constructor() {
        super({ key: 'UiScene', active: true });


    }

    preload() {

    }

    create() {
        this.gameState = GameState.singleton();
        this.gameState.uiScene = this;

        this.startBeginningMessage();
    }

    update() {
    }

    startBeginningMessage() {
        const helloMessage = this.addText('Hello. This is your pond.', 6);
        helloMessage.x = this.findMiddleWidth(helloMessage);
        helloMessage.y = (this.cameras.main.height / 4);
        helloMessage.alpha = 0;
        const foodMessage = this.addText('Try feeding a duck. Press on the water.', 4);
        foodMessage.x = this.findMiddleWidth(foodMessage);
        foodMessage.y = (this.cameras.main.height / 4);
        foodMessage.alpha = 0;

        const timeLine = this.tweens.timeline();
        timeLine.add({
            targets: helloMessage,
            duration: 2000,
            alpha: 1
        })
        .add({
            targets: helloMessage,
            duration: 4000
        })
        .add({
            targets: helloMessage,
            duration: 2000,
            alpha: 0
        })
        // identical tween for a delay
        .add({
            targets: helloMessage,
            duration: 2000,
            alpha: 0
        })
        .add({
            targets: foodMessage,
            duration: 2000,
            alpha: 1
        })
        .add({
            targets: foodMessage,
            duration: 4000
        })
        .add({
            targets: foodMessage,
            duration: 2000,
            alpha: 0
        });
        timeLine.play();
    }

    addText(text: string, size: number = 2): Phaser.GameObjects.Text {
        const textObject = this.add.text(0, 0, text, { fontFamily: 'Perpetua , Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: `${size}em` });
        return textObject;
    }

    addTextWithDuration(text: string, seconds: number, size: number = 2): Phaser.GameObjects.Text {
        const textObject = this.addText(text, size);
        this.time.delayedCall(seconds * 1000, () => { textObject.destroy() }, [], this);
        return textObject;
    }


    private findMiddleWidth(object: { width: number }): number {
        return (this.cameras.main.width / 2) - (object.width / 2);
    }

}

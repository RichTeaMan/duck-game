import * as Phaser from 'phaser';
import { Duck } from './duck';
import { GameState } from './gameState';

const FONT_FAMILY = 'Perpetua , Georgia, "Goudy Bookletter 1911", Times, serif';

export class UiScene extends Phaser.Scene {


    gameState: GameState;

    duckInfoObjects: Array<{ destroy(): void }> = [];

    debugMessage: Phaser.GameObjects.Text;

    toastMessages: Array<Phaser.GameObjects.Text> = [];
    toastX = 50;
    toastY = 400;
    toastYMargin = 15;

    previousHeight = 0;
    previousWidth = 0;


    constructor() {
        super({ key: 'UiScene', active: true });
    }

    preload() {
        this.gameState = GameState.singleton();
        this.gameState.uiScene = this;

        this.debugMessage = this.addText('');
    }

    create() {
        this.previousHeight = this.cameras.main.height;
        this.previousWidth = this.cameras.main.width;
        this.startBeginningMessage();
    }

    resize() {
        // extremely crude way to make sure all UI elements are in the same relative position on the screen after it has been resized.
        // It will not preserve alignment. If a text element was originally centred it is unlikely to be exactly centred after resize.
        const children = this.children.getAll();
        children.forEach(child => {
            const ui = child as any;

            if (typeof ui.x == 'number' && typeof ui.y == 'number') {

                const ratioX = ui.x / this.previousWidth;
                const ratioY = ui.y / this.previousHeight;

                ui.x = ratioX * this.cameras.main.width;
                ui.y = ratioY * this.cameras.main.height;
            }
        });
    }

    update() {

        let debugMsg = '';
        if (this.gameState.debug.showMouseData) {
            const pointer = this.gameState.fetchPointer();
            const worldPointer = this.gameState.fetchWorldPointerPosition();
            debugMsg += `Mouse: (${pointer.x.toFixed(2)}, ${pointer.y.toFixed(2)}) World: (${worldPointer.x.toFixed(2)}, ${worldPointer.y.toFixed(2)})    `;
        }
        if (this.gameState.debug.showResolutionData) {
            const camera = this.gameState.scene.cameras.main;
            debugMsg += `Camera (w,h): (${camera.width.toFixed(2)}, ${camera.height.toFixed(2)}) Camera Offset (x,y): (${camera.scrollX.toFixed(2)}, ${camera.scrollY.toFixed(2)})    `;
        }
        if (this.gameState.debug.showUiResolutionData) {
            const camera = this.gameState.uiScene.cameras.main;
            debugMsg += `UI Camera (w,h): (${camera.width.toFixed(2)}, ${camera.height.toFixed(2)}) UI Camera Offset (x,y): (${camera.scrollX.toFixed(2)}, ${camera.scrollY.toFixed(2)})    `;
        }

        if (debugMsg !== '') {
            this.debugMessage.text = debugMsg;
        }

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
        const textObject = this.add.text(0, 0, text, { fontFamily: FONT_FAMILY, fontSize: `${size}em` });
        return textObject;
    }

    addTextWithDuration(text: string, seconds: number, size: number = 2): Phaser.GameObjects.Text {
        const textObject = this.addText(text, size);
        this.time.delayedCall(seconds * 1000, () => { textObject.destroy(); }, null, null);
        return textObject;
    }

    displayDuckInfo(duck: Duck) {
        this.duckInfoObjects.forEach(element => {
            element.destroy();
        });

        const name = this.addText(duck.name, 4);
        const title = this.add.text(0, 0, duck.duckling ? "(a duck in training)" : "(the duck)", { fontFamily: FONT_FAMILY, fontSize: '2em', fontStyle: 'italic' });
        const thought = this.add.text(0, 0, `is thinking about ${duck.thought}`, { fontFamily: FONT_FAMILY, fontSize: '2em', fontStyle: 'italic' });
        name.x = 40;
        name.y = this.cameras.main.height * 0.75;

        title.y = name.y + name.height - (title.height * 1.25);
        title.x = name.x + name.width + 20;
        thought.x = 80;
        thought.y = name.y + 40;

        this.duckInfoObjects = [name, title, thought];
    }

    displayToast(message: string) {
        const delay = 15;
        const toast = this.addText(message);
        this.time.delayedCall(delay * 1000, () => {
            this.toastMessages = this.toastMessages.filter(t => t !== toast);
            toast.destroy();
            this.repositionToasts();
        }, null, null);
        this.toastMessages.push(toast);
        this.repositionToasts();

    }

    private repositionToasts() {
        let y = this.toastY;
        this.toastMessages.forEach(toastMessage => {

            if (y > this.cameras.main.height * 0.75) { // don't display this many toasts
                toastMessage.setVisible(false);
            }
            else {
                toastMessage.setVisible(true);
                toastMessage.y = y;
                toastMessage.x = this.toastX;
                y += this.toastYMargin + toastMessage.height;
            }
        });
    }


    private findMiddleWidth(object: { width: number }): number {
        return (this.cameras.main.width / 2) - (object.width / 2);
    }

}

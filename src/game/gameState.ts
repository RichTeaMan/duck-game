import { Duck } from "./duck";
import { Entity } from "./entity";
import { EntityType } from "./entityType";
import { Food } from "./food";
import { GameScene } from "./gameScene";
import { UiScene } from "./uiScene";

export class GameState {

    private static _instance = null;
    static singleton(): GameState {
        if (GameState._instance == null) {
            this._instance = new GameState();
        }
        return this._instance;
    }

    scene: GameScene;
    uiScene: UiScene;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    entities: Array<Entity> = [];
    waterTiles: Array<Phaser.GameObjects.Image> = [];

    debug = {
        showTargets: false,
        showMouseData: true,
        showResolutionData: true,
        showUiResolutionData: true,
        cameraPanning: true,
    }

    pointerHandled = false;

    fetchPointer() {
        return this.scene.input.activePointer;
    }

    fetchWorldPointerPosition() {
        const pointer = this.fetchPointer();
        const point = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        return point;
    }

    update() {
        this.entities.forEach(entity => {
            entity.update();
        });

        this.pointerHandled = false;
    }

    pruneEntities() {

        const newEntities: Array<Entity> = [];
        this.entities.forEach(entity => {
            if (!entity.isDestroyed) {
                newEntities.push(entity);
            }
        });
        this.entities = newEntities;
    }

    fetchFood(): Food[] {
        return this.entities.filter(e => e.entityType() === EntityType.Food && !e.isDestroyed) as Food[];
    }

    fetchDucks(): Duck[] {
        return this.entities.filter(e => e.entityType() === EntityType.Duck && !e.isDestroyed) as Duck[];
    }

    addEntity(entity: Entity) {

        this.entities.push(entity);
        return entity;
    }

    showWaterCollision() {
        for (let i = 0; i < this.waterTiles.length; i++) {
            const tile = this.waterTiles[i];
            const r = tile.getBounds();
            this.scene.add.rectangle(r.x, r.y, r.width, r.height, 0x9966ff);
        }
    }

    isPointWater(x: number, y: number) {
        // collisions and drawing aren't aligned. no idea why.
        for (let i = 0; i < this.waterTiles.length; i++) {
            const tile = this.waterTiles[i];
            if (tile.getBounds().contains(x + 60, y + 60)) {
                this.scene.add.rectangle(x, y, 2, 2, 0xff0000);
                return true;
            }
        }
        this.scene.add.rectangle(x, y, 6, 6, 0x00ff00);
        return false;
    }
}

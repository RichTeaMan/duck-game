import { Entity } from "./entity";
import { EntityType } from "./entityType";
import { Food } from "./food";

export class GameState {

    scene: Phaser.Scene;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    entities: Array<Entity> = [];
    waterTiles: Array<Phaser.GameObjects.Image> = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {
        this.entities.forEach(entity => {
            entity.update();
        })
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
        return this.entities.filter(e => e.entityType() === EntityType.Food) as Food[];
    }

    addEntity(entity: Entity) {

        this.entities.push(entity);
    }

    debug() {
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

import { Entity } from "./entity";
import { EntityType } from "./entityType";
import { Food } from "./food";

export class GameState {

    scene: Phaser.Scene;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    entities: Array<Entity> = [];

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
}

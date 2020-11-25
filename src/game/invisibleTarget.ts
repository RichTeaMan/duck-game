import { Entity } from "./entity";
import { EntityType } from "./entityType";
import { GameState } from "./gameState";

export class InvisibleTarget extends Entity {

    constructor(gameState: GameState, x: number, y: number) {
        super(gameState, 'target', x, y);

        this.image.depth = 2000;
        this.image.setVisible(gameState.debug.showTargets);
    }

    entityType(): EntityType {
        return EntityType.Invisible;
    }

    update() {
    }
}

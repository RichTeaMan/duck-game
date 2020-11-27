import { Duck, DuckType } from "./duck";
import { Entity } from "./entity";
import { EntityType } from "./entityType";
import { GameState } from "./gameState";
import { randomElement, randomInt } from "./utils";

export class Nest extends Entity {

    /**
     * Gets duration a duck most nest for in ticks.
     */
    static NESTING_DURATION = 1000;

    static create(gameState: GameState, x: number, y: number): Nest {

        const nest = new Nest(gameState, 'nest', x, y);
        gameState.addEntity(nest);
        return nest;
    }

    private nestingDuck: Duck;

    /**
     * Gets how many ticks the current duck has nested for.
     */
    private nestingTime = 0;

    constructor(gameState: GameState, imageName: string, x: number, y: number) {
        super(gameState, imageName, x, y);

        this.image.setInteractive({ cursor: 'pointer'});
        this.image.depth = y + 200;
    }

    onPointerDown(pointer: Phaser.Input.Pointer) {
        this.gameState.pointerHandled = true;

        if (this.nestingDuck != null) {
            this.gameState.uiScene.displayToast("A duck is already nesting there.");
            return;
        }

        // choose a random non duckling
        const ducks = this.gameState.fetchDucks().filter(f => f.duckType !== 'duckling');
        if (ducks.length > 0) {
            const duck = randomElement(ducks);
            this.nestingDuck = duck;
            this.gameState.uiScene.displayToast(`${duck.name} is feeling broody`);
            this.nestingTime = 0;
            duck.sendToNest(this);
        }
    }

    entityType(): EntityType {
        return EntityType.Nest;
    }

    destroy() {
        console.log ("nest destroyed!!!");
        console.trace();
        super.destroy();
    }

    update() {

        if (this.nestingDuck == null) {
            return;
        }

        
        if (this.distanceFromEntity(this.nestingDuck) < 2.5) {
            this.nestingTime++;
        }

        if (this.nestingTime === 20) {
            this.gameState.uiScene.displayToast(`${this.nestingDuck.name} has just started nesting`);
        }
        if (this.nestingTime === Math.floor(Nest.NESTING_DURATION * .5)) {
            this.gameState.uiScene.displayToast(`${this.nestingDuck.name} has a while left to nest`);
        }
        if (this.nestingTime === Math.floor(Nest.NESTING_DURATION * 0.9)) {
            this.gameState.uiScene.displayToast(`${this.nestingDuck.name} is feeling some rustling`);
        }
        if (this.nestingTime > Nest.NESTING_DURATION) {
            this.nestingDuck.nestingComplete();

            // generate some ducks
            const ducklingCount = randomInt(5) + 1;
            const names = [];
            let leader = this.nestingDuck;
            for (let i = 0; i < ducklingCount; i++) {
                const duckling = new Duck(this.gameState, this.nestingDuck.x, this.nestingDuck.y, DuckType.random(), true);
                duckling.leaderDuck = leader;
                this.gameState.addEntity(duckling);
                leader = duckling;
                names.push(duckling.name);
            }
            this.gameState.uiScene.displayToast(`${this.nestingDuck.name} brood has hatched ${names.length} ducklings!`);
            names.forEach(name => {
                this.gameState.uiScene.displayToast(`Welcome ${name}`);
            });

            this.nestingDuck = null;
        }
    }
}

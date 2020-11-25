import { Dir } from "fs";
import { VectorFactory } from "matter";
import { randomInt } from "./utils";

export class Direction {

    static west: Direction;
    static northWest: Direction;
    static north: Direction;
    static northEast: Direction;
    static east: Direction;
    static southEast: Direction;
    static south: Direction;
    static southWest: Direction;

    static map: Direction[];
    static list: Direction[];

    static initialise() {

        Direction.west = new Direction('west', 0, -2, 0);
        Direction.northWest = new Direction('northWest', 32, -2, -1);
        Direction.north = new Direction('north', 64, 0, -2);
        Direction.northEast = new Direction('northEast', 96, 2, -1);
        Direction.east = new Direction('east', 128, 2, 0);
        Direction.southEast = new Direction('southEast', 160, 2, 1);
        Direction.south = new Direction('south', 192, 0, 2);
        Direction.southWest = new Direction('southWest', 224, -2, 1);

        Direction.west.opposite = Direction.east;
        Direction.northWest.opposite = Direction.southEast;
        Direction.north.opposite = Direction.south;
        Direction.northEast.opposite = Direction.southWest;
        Direction.east.opposite = Direction.west;
        Direction.southEast.opposite = Direction.northWest;
        Direction.south.opposite = Direction.north;
        Direction.southWest.opposite = Direction.northEast;

        Direction.map = [];
        Direction.map[Direction.west.name] = Direction.west;
        Direction.map[Direction.northWest.name] = Direction.northWest;
        Direction.map[Direction.north.name] = Direction.north;
        Direction.map[Direction.northEast.name] = Direction.northEast;
        Direction.map[Direction.east.name] = Direction.east;
        Direction.map[Direction.southEast.name] = Direction.southEast;
        Direction.map[Direction.south.name] = Direction.south;
        Direction.map[Direction.southWest.name] = Direction.southWest;

        Direction.list = [];
        Direction.list.push(Direction.west);
        Direction.list.push(Direction.northWest);
        Direction.list.push(Direction.north);
        Direction.list.push(Direction.northEast);
        Direction.list.push(Direction.east);
        Direction.list.push(Direction.southEast);
        Direction.list.push(Direction.south);
        Direction.list.push(Direction.southWest);
    }

    static get(name: string): Direction {
        return Direction.map[name];
    }

    static random(): Direction {
        const i = randomInt(Direction.list.length);
        return Direction.list[i];
    }

    static determineFromVector(vector: Phaser.Math.Vector2) {

        const angle = Phaser.Math.Angle.Between(0, 0, Math.abs(vector.x), Math.abs(vector.y));

        let quad = [];

        // calculate quads for annoying trig and negative sign reasons. In phaser, 0,0 is top left so Y is inverted.

        // top left quad
        if (vector.x >= 0 && vector.y < 0) {
            quad = [Direction.east, Direction.northEast, Direction.north];
        }
        // bottom left
        else if (vector.x >= 0 && vector.y >= 0) {
            quad = [Direction.east, Direction.southEast, Direction.south];
        }
        // top right
        else if (vector.x < 0 && vector.y < 0) {
            quad = [Direction.west, Direction.northWest, Direction.north];
        }
        // bottom right
        else if (vector.x < 0 && vector.y >= 0) {
            quad = [Direction.west, Direction.southWest, Direction.south];
        }

        let i = 0;
        if (angle > 1.178097) { // 67.5 deg
            i = 2;
        }
        else if (angle > 0.3926991) { // 22.5 deg
            i = 1;
        }

        const direction = quad[i];
        return direction;
    }

    name: string;
    offset: number;
    x: number;
    y: number;
    opposite: Direction;

    constructor(name: string, offset: number, x: number, y: number) {
        this.name = name;
        this.offset = offset;
        this.x = x;
        this.y = y;
    }
}
Direction.initialise();

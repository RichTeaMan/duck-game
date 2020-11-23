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
    }

    static get(name: string): Direction {
        return Direction.map[name];
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

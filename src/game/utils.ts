export function randomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

export function randomElement<T>(array: Array<T>) : T {
    const i = randomInt(array.length);
    return array[i];
}
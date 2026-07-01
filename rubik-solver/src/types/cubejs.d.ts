declare module 'cubejs' {
  export interface CubeJSON {
    center: number[];
    cp: number[];
    co: number[];
    ep: number[];
    eo: number[];
  }

  export default class Cube {
    constructor(state?: Cube | CubeJSON);
    static fromString(str: string): Cube;
    static random(): Cube;
    static initSolver(): void;
    static inverse(algorithm: string | number[] | number): string | number[] | number;

    center: number[];
    cp: number[];
    co: number[];
    ep: number[];
    eo: number[];

    init(state: Cube | CubeJSON): void;
    identity(): void;
    toJSON(): CubeJSON;
    asString(): string;
    clone(): Cube;
    randomize(): void;
    isSolved(): boolean;
    move(algorithm: string | number[] | number): void;
    solve(maxDepth?: number, timeout?: number): string;
  }
}

export class Ghost {
    name!: string;
    evidence!: string[];
    sanity!: {
        min: number,
        normal: number,
        max: number
    }
    speed!: {
        min: number,
        normal: number,
        max: number
    }
}

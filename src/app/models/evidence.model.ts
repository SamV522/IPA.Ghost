export class Evidence {
    name!: string;
    id!: string;
    primary: boolean = false;
    categories: string[] = []
    condition?: string;
}

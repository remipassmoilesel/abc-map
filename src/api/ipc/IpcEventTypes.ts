export class Evt {

    public static PROJECT_ROOT = "/project";
    public static PROJECT_NEW_CREATED = new Evt(`${Evt.PROJECT_ROOT}/new-project`);

    public id: string;

    constructor(id: string) {
        this.id = id;
    }
}
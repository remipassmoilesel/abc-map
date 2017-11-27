export class Evt {

    public static PROJECT_ROOT = "/project";
    public static PROJECT_NEW_CREATED = new Evt(`${Evt.PROJECT_ROOT}/new-project`);
    public static PROJECT_NEW_LAYER_ADDED = new Evt(`${Evt.PROJECT_ROOT}/new-layer-added`);

    public static MAP_ROOT = "/map";

    public id: string;

    constructor(id: string) {
        this.id = id;
    }
}
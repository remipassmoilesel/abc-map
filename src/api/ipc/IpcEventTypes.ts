export class Evt {

    public static PROJECT_ROOT = "/project";
    public static PROJECT_NEW_CREATED = new Evt(`${Evt.PROJECT_ROOT}/new-project`);

    public static MAP_ROOT = "/map";
    public static MAP_NEW_LAYER_ADDED = new Evt(`${Evt.MAP_ROOT}/new-layer-added`);

    public id: string;

    constructor(id: string) {
        this.id = id;
    }
}
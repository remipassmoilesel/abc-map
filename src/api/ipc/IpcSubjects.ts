export class Subj {

    public static PROJECT_ROOT = "/project";
    public static PROJECT_EVENTS_BUS = new Subj(`${Subj.PROJECT_ROOT}/events-bus`);
    public static PROJECT_CREATE_NEW = new Subj(`${Subj.PROJECT_ROOT}/create-new`);
    public static PROJECT_GET_CURRENT = new Subj(`${Subj.PROJECT_ROOT}/get-current`);

    public static MAP_ROOT = "/map";
    public static MAP_EVENTS_BUS = new Subj(`${Subj.MAP_ROOT}/events-bus`);
    public static MAP_GET_WMS_DEFAULT_LAYERS = new Subj(`${Subj.MAP_ROOT}/get-default-layers`);
    public static MAP_ADD_LAYER = new Subj(`${Subj.MAP_ROOT}/add-layer`);

    public id: string;

    constructor(id: string) {
        this.id = id;
    }
}
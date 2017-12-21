export class EventType {

    public static PROJECT_ROOT = '/project';
    public static PROJECT_NEW_CREATED = new EventType(`${EventType.PROJECT_ROOT}/new-project`);
    public static PROJECT_NEW_LAYER_ADDED = new EventType(`${EventType.PROJECT_ROOT}/new-layer-added`);
    public static PROJECT_UPDATED = new EventType(`${EventType.PROJECT_ROOT}/updated`);

    public static SC_ROOT = '/global-shortcuts';

    public id: string;

    constructor(id: string) {
        this.id = id;
    }
}

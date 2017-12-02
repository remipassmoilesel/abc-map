export class IpcSubject {

    public static PROJECT_ROOT = "/project";
    public static PROJECT_EVENTS_BUS = new IpcSubject(`${IpcSubject.PROJECT_ROOT}/events-bus`);
    public static PROJECT_CREATE_NEW = new IpcSubject(`${IpcSubject.PROJECT_ROOT}/create-new`);
    public static PROJECT_GET_CURRENT = new IpcSubject(`${IpcSubject.PROJECT_ROOT}/get-current`);
    public static PROJECT_ADD_LAYER = new IpcSubject(`${IpcSubject.PROJECT_ROOT}/add-layer`);
    public static PROJECT_DELETE_LAYERS = new IpcSubject(`${IpcSubject.PROJECT_ROOT}/delete-layers`);

    public static MAP_ROOT = "/map";
    public static MAP_EVENTS_BUS = new IpcSubject(`${IpcSubject.MAP_ROOT}/events-bus`);
    public static MAP_GET_WMS_DEFAULT_LAYERS = new IpcSubject(`${IpcSubject.MAP_ROOT}/get-default-layers`);
    public static MAP_IMPORT_FILES = new IpcSubject(`${IpcSubject.MAP_ROOT}/kml/import-as-layer`);
    public static MAP_GEOCODE = new IpcSubject(`${IpcSubject.MAP_ROOT}/geocode`);

    public static DB_ROOT = "/map";
    public static DB_START = new IpcSubject(`${IpcSubject.DB_ROOT}/start`);
    public static DB_STOP = new IpcSubject(`${IpcSubject.DB_ROOT}/stop`);
    public static DB_RESTART = new IpcSubject(`${IpcSubject.DB_ROOT}/restart`);

    public id: string;

    constructor(id: string) {
        this.id = id;
    }
}
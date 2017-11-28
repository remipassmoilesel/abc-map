export class IpcSubjects {

    public static PROJECT_ROOT = "/project";
    public static PROJECT_EVENTS_BUS = new IpcSubjects(`${IpcSubjects.PROJECT_ROOT}/events-bus`);
    public static PROJECT_CREATE_NEW = new IpcSubjects(`${IpcSubjects.PROJECT_ROOT}/create-new`);
    public static PROJECT_GET_CURRENT = new IpcSubjects(`${IpcSubjects.PROJECT_ROOT}/get-current`);
    public static PROJECT_ADD_LAYER = new IpcSubjects(`${IpcSubjects.PROJECT_ROOT}/add-layer`);
    public static PROJECT_DELETE_LAYERS = new IpcSubjects(`${IpcSubjects.PROJECT_ROOT}/delete-layers`);

    public static MAP_ROOT = "/map";
    public static MAP_EVENTS_BUS = new IpcSubjects(`${IpcSubjects.MAP_ROOT}/events-bus`);
    public static MAP_GET_WMS_DEFAULT_LAYERS = new IpcSubjects(`${IpcSubjects.MAP_ROOT}/get-default-layers`);
    public static MAP_IMPORT_KML_AS_LAYER = new IpcSubjects(`${IpcSubjects.MAP_ROOT}/kml/import-as-layer`);

    public static DB_ROOT = "/map";
    public static DB_START = new IpcSubjects(`${IpcSubjects.DB_ROOT}/start`);
    public static DB_STOP = new IpcSubjects(`${IpcSubjects.DB_ROOT}/stop`);
    public static DB_RESTART = new IpcSubjects(`${IpcSubjects.DB_ROOT}/restart`);

    public id: string;

    constructor(id: string) {
        this.id = id;
    }
}
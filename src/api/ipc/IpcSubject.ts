export class IpcSubject {
    public id: string;

    constructor(id: string) {
        this.id = id;
    }
}

export class DbSubjects extends IpcSubject {

    public static ROOT = "/map";
    public static START_DB = new DbSubjects(`/start`);
    public static STOP_DB = new DbSubjects(`/stop`);
    public static RESTART_DB = new DbSubjects(`/restart`);
    public static GET_LAYER_GEOJSON_DATA = new DbSubjects(`/geojson/data`);

    constructor(id: string) {
        super(DbSubjects.ROOT + id);
    }
}

export class MapSubjects extends IpcSubject {

    public static ROOT = "/map";
    public static GET_WMS_DEFAULT_LAYERS = new MapSubjects(`/get-default-layers`);
    public static IMPORT_FILES = new MapSubjects(`/kml/import-as-layer`);
    public static GEOCODE = new MapSubjects(`/geocode`);

    constructor(id: string) {
        super(MapSubjects.ROOT + id);
    }
}

export class ProjectSubjects extends IpcSubject {

    public static ROOT = "/project";
    public static CREATE_NEW = new ProjectSubjects(`/create-new`);
    public static GET_CURRENT = new ProjectSubjects(`/get-current`);
    public static ADD_LAYER = new ProjectSubjects(`/add-layer`);
    public static DELETE_LAYERS = new ProjectSubjects(`/delete-layers`);

    constructor(id: string) {
        super(ProjectSubjects.ROOT + id);
    }
}

export class IpcEventBus extends IpcSubject {

    public static ROOT = "/events";
    public static PROJECT = new IpcEventBus(`/project`);
    public static MAP = new IpcEventBus(`/map`);
    public static SHORTCUTS = new IpcEventBus(`/shortcuts`);

    constructor(id: string) {
        super(IpcEventBus.ROOT + id);
    }

}


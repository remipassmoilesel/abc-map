import {Logger} from '../dev/Logger';
import {DefaultTileLayers} from '../entities/DefaultTileLayers';
import {TileLayer} from '../entities/TileLayer';
import {AbstractService} from "./AbstractService";
import {Ipc} from "../ipc/Ipc";
import {ProjectService} from "./ProjectService";
import {AbstractMapLayer} from "../entities/AbstractMapLayer";
import {IpcEvent} from "../ipc/IpcEvent";
import {Subj} from "../ipc/IpcSubjects";
import {Evt} from "../ipc/IpcEventTypes";

const logger = Logger.getLogger('MapService');

export class MapService extends AbstractService {

    private defaultLayers: DefaultTileLayers;
    private projectService: ProjectService;

    constructor(ipc: Ipc, projectService: ProjectService) {
        super(ipc);

        logger.info('Init MapService');

        this.projectService = projectService;
        this.defaultLayers = new DefaultTileLayers();
    }

    public getDefaultWmsLayers(): TileLayer[] {
        return this.defaultLayers.layers;
    }

    public addLayer(layer: AbstractMapLayer) {
        logger.info(`Adding layer: ${JSON.stringify(layer)}`);

        this.projectService.getCurrentProject().layers.push(layer);

        this.sendProjectEvent({
            type: Evt.MAP_NEW_LAYER_ADDED,
        });
    }

    private sendProjectEvent(data: IpcEvent) {
        return this.ipc.send(Subj.MAP_EVENTS_BUS, data);
    }
}

import {Logger} from '../dev/Logger';
import {DefaultWmsLayers} from '../entities/DefaultWmsLayers';
import {WmsLayer} from '../entities/WmsLayer';
import {AbstractService} from "./AbstractService";
import {Ipc} from "../ipc/Ipc";

export class MapService extends AbstractService {

    private logger = Logger.getLogger('MapService');
    private defaultLayers: DefaultWmsLayers;

    constructor(ipc: Ipc) {
        super(ipc);

        this.logger.info('Init MapService');
        this.defaultLayers = new DefaultWmsLayers();
    }

    public getDefaultWmsLayers(): WmsLayer[] {
        return this.defaultLayers.layers;
    }

}

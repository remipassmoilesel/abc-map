import {Logger} from '../dev/Logger';
import { DefaultWmsLayers } from '../entities/DefaultWmsLayers';
import { WmsLayer } from '../entities/WmsLayer';

export class MapService {

    private logger = Logger.getLogger('MapService');
    private defaultLayers: DefaultWmsLayers;

    constructor() {
        this.logger.info('Init MapService');
        this.defaultLayers = new DefaultWmsLayers();
    }

    public getDefaultWmsLayers(): WmsLayer[] {
        return this.defaultLayers.layers;
    }

}

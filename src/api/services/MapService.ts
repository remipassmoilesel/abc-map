import {Logger} from "../dev/Logger";

export class MapService {

    private logger = Logger.getLogger('MapService');

    constructor(){
        this.logger.info('Init MapService')
    }

    public getTilesUrls(): string[] {
        return [
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
            'https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}',
        ];
    }

}
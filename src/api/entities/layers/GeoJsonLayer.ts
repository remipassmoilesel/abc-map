import {AbstractMapLayer} from './AbstractMapLayer';



export class GeoJsonLayer extends AbstractMapLayer {

    constructor(name?: string) {
        super(name);
    }

    public getIdPrefix(): string {
        return 'geojson';
    }

}

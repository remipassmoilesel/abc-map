import * as gj from 'geojson';

export class GeoJsonDocument implements gj.LineString{

    type;
    coordinates: gj.Position[];
    data: any[];

}
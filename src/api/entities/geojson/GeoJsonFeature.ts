import * as gj from 'geojson';

export interface GeoJsonFeature {
    data: any;
    coordinates: gj.Position[];
}
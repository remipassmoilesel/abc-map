import * as gj from 'geojson';
import {IGeoJsonGeometry} from './IGeoJsonGeometry';

export interface IGeoJsonFeature extends gj.Feature<IGeoJsonGeometry, any> {
    _id?: any;
    type: 'Feature';
    geometry: IGeoJsonGeometry;
    properties: any;
}

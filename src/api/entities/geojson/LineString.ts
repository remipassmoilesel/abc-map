import * as gj from 'geojson';
import {GeoJsonFeature} from "./GeoJsonFeature";

export class LineString implements gj.LineString, GeoJsonFeature {
    type;
    coordinates: gj.Position[];
    data: any;
}
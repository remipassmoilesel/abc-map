import * as gj from 'geojson';
import {IGeoJsonGeometry} from './IGeoJsonGeometry';

export class LineString implements gj.LineString, IGeoJsonGeometry {
    public type: 'LineString';
    public coordinates: gj.Position[];
}

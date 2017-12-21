import * as gj from 'geojson';
import {IGeoJsonGeometry} from './IGeoJsonGeometry';

export class LineString implements gj.LineString, IGeoJsonGeometry {
    public type;
    public coordinates: gj.Position[];
}

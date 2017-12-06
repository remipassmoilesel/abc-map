import * as gj from 'geojson';
import {IGeoJsonGeometry} from "./IGeoJsonGeometry";

export class LineString implements gj.LineString, IGeoJsonGeometry {
    type;
    coordinates: gj.Position[];
}